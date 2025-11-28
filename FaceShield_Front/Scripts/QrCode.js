const video = document.getElementById("video");
const mensagem = document.getElementById("mensagem");
const feedback = document.getElementById("feedback");
const loadingOverlay = document.querySelector(".loading-overlay");

let canvasElement = document.createElement("canvas");
let canvas = canvasElement.getContext("2d");
let scanning = false;

// URLs FINAIS E FIXAS
const BASE_URL = "https://faceshield-back.onrender.com/emprestimos";
const URL_EMPRESTIMO = `${BASE_URL}/novoEmprestimoQrcode`; // POST
const URL_DEVOLUCAO = `${BASE_URL}/finalizarEmprestimoQrcode`; // PUT

async function iniciarCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    video.srcObject = stream;
    video.play();

    requestAnimationFrame(detectarQRCode);
  } catch (err) {
    console.error("Erro ao acessar a câmera:", err);
    mostrarFeedback(
      "Erro ao acessar a câmera. Verifique as permissões.",
      "error"
    );
  }
}

function detectarQRCode() {
  if (video.readyState === video.HAVE_ENOUGH_DATA && !scanning) {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      scanning = true;
      processarQRCode(code.data);
    }
  }

  if (!scanning) {
    requestAnimationFrame(detectarQRCode);
  }
}

function processarQRCode(numeroQrCode) {
  mostrarLoading(true);
  mensagem.textContent = `QR Code lido [${numeroQrCode}]. Registrando operação...`;

  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem("authToken");

  registrarEmprestimo(userId, numeroQrCode, authToken);
}

/**
 * ABORDAGEM INTELIGENTE: Tenta POST primeiro, se der erro de "não disponível", faz PUT
 */
async function registrarEmprestimo(userId, numeroQrCode, token) {
  // 1. Validações Iniciais
  if (!token) {
    console.error("Erro: Token de autenticação ausente.");
    mostrarFeedback(
      "Token de autenticação ausente. Faça login novamente.",
      "error"
    );
    mostrarLoading(false);
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
    return;
  }

  const usuarioIdNumero = parseInt(userId, 10);
  if (isNaN(usuarioIdNumero)) {
    console.error("Erro: ID do usuário inválido ou não numérico.");
    mostrarFeedback("Erro no ID do usuário. Faça login novamente.", "error");
    mostrarLoading(false);
    scanning = false;
    requestAnimationFrame(detectarQRCode);
    return;
  }

  const qrcodeLimpado = numeroQrCode ? numeroQrCode.trim() : "";
  if (qrcodeLimpado.length === 0) {
    console.error("Erro: QR Code vazio.");
    mostrarFeedback("QR Code inválido ou vazio. Tente novamente.", "error");
    mensagem.textContent = "QR Code inválido. Tente novamente.";
    mostrarLoading(false);
    scanning = false;
    requestAnimationFrame(detectarQRCode);
    return;
  }

  const dataHoraBrasiliaISO = obterDataHoraBrasiliaISO();

  // -----------------------------------------------------------------
  // LÓGICA INTELIGENTE: Tenta POST -> Se erro -> Tenta PUT
  // -----------------------------------------------------------------

  // PRIMEIRO: Sempre tenta criar novo empréstimo (POST)
  let method = "POST";
  let url = URL_EMPRESTIMO;
  let sucessoMsg = "Empréstimo registrado com sucesso!";

  let payloadObject = {
    usuarioId: usuarioIdNumero,
    qrcodeFerramenta: qrcodeLimpado,
    data_retirada: dataHoraBrasiliaISO,
  };

  console.log(
    `Tentando CRIAR novo empréstimo para usuário: ${usuarioIdNumero}`
  );
  const payload = JSON.stringify(payloadObject);
  console.log(`Requisição POST para: ${url}`, payload);

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`POST falhou: ${errorText}`);

      // SE o erro for "ferramenta não está disponível", tenta finalizar empréstimo (PUT)
      if (
        errorText.includes("não está disponível") ||
        response.status === 400
      ) {
        console.log(
          "Ferramenta não disponível - tentando FINALIZAR empréstimo existente"
        );

        method = "PUT";
        url = URL_DEVOLUCAO;
        sucessoMsg = "Devolução registrada com sucesso!";

        payloadObject = {
          usuarioId: usuarioIdNumero,
          qrcodeFerramenta: qrcodeLimpado,
          data_devolucao: dataHoraBrasiliaISO,
        };

        const putPayload = JSON.stringify(payloadObject);
        console.log(`Requisição PUT para: ${url}`, putPayload);

        const putResponse = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: putPayload,
        });

        if (!putResponse.ok) {
          const putErrorText = await putResponse.text();
          throw new Error(`Erro na devolução: ${putErrorText}`);
        }

        const data = await putResponse.json();
        console.log("Devolução registrada com sucesso:", data);
        mostrarFeedback(sucessoMsg, "success");
        mensagem.textContent = "Sucesso! Devolução registrada.";
      } else {
        // Se for outro erro, lança exceção
        throw new Error(errorText);
      }
    } else {
      // Se POST deu certo (criou novo empréstimo)
      const data = await response.json();
      console.log("Empréstimo registrado com sucesso:", data);
      mostrarFeedback(sucessoMsg, "success");
      mensagem.textContent = "Sucesso! Empréstimo registrado.";
    }

    mostrarLoading(false);

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 3000);
  } catch (error) {
    console.error("Erro ao registrar operação:", error);
    mostrarFeedback(`Falha: ${error.message}`, "error");
    mensagem.textContent = "Falha no registro. Tente escanear novamente.";
    mostrarLoading(false);
    scanning = false;
    requestAnimationFrame(detectarQRCode);
  }
}

/**
 * Função auxiliar para garantir o formato ISO 8601 da Data/Hora de Brasília.
 * Retorna: "YYYY-MM-DDTHH:mm:ss"
 */
function obterDataHoraBrasiliaISO() {
  const now = new Date();
  const options = {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const dateParts = new Intl.DateTimeFormat("pt-BR", options)
    .formatToParts(now)
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  const year = dateParts.year;
  const month = dateParts.month;
  const day = dateParts.day;
  const hour = dateParts.hour;
  const minute = dateParts.minute;
  const second = dateParts.second;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

// ==================================================================
//  FUNÇÕES AUXILIARES
// ==================================================================

function mostrarFeedback(texto, tipo) {
  feedback.textContent = texto;
  feedback.className = "feedback " + tipo;
  feedback.style.display = "block";

  feedback.style.opacity = 1;
  feedback.style.transform = "translateX(0)";

  setTimeout(() => {
    feedback.style.opacity = 0;
    feedback.style.transform = "translateX(120%)";
    setTimeout(() => {
      feedback.style.display = "none";
    }, 400);
  }, 4000);
}

function mostrarLoading(mostrar) {
  loadingOverlay.style.display = mostrar ? "grid" : "none";
}

window.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");

  if (!userId) {
    mensagem.textContent = "Você precisa fazer o login facial primeiro.";
    mostrarFeedback("Não autenticado. Redirecionando...", "error");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
  } else {
    mensagem.textContent = `Olá, ${username}. Aponte para o QR Code.`;
    console.log(`Usuário logado: ${username} (ID: ${userId})`);
    iniciarCamera();
  }

  const botaoVoltar = document.getElementById("btn-voltar");

  if (botaoVoltar) {
    botaoVoltar.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/Html/Login.html";
    });
  }
});
