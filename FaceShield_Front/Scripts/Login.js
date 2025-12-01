const video = document.getElementById("video");
const mensagem = document.getElementById("mensagem");
const feedback = document.getElementById("feedback");
let recognitionInterval;
let isProcessing = false;

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  console.log(
    "Token recuperado do localStorage:",
    token ? "Presente" : "Ausente"
  );
  if (!token) {
    console.warn("Token não encontrado no localStorage");
    return {
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function showFeedback(tipo, mensagemTexto) {
  if (!feedback) return;

  feedback.textContent = mensagemTexto;
  feedback.className = "feedback " + tipo;
  feedback.style.display = "block";

  setTimeout(() => {
    feedback.style.opacity = 0;
    feedback.style.transform = "translateX(120%)";
    setTimeout(() => {
      feedback.style.display = "none";
    }, 400);
  }, 5000);
}

function toggleLoading(show) {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = show ? "grid" : "none";
  }
}

async function iniciarCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 640 },
        facingMode: "user",
      },
    });
    video.srcObject = stream;
    mensagem.textContent = "Câmera ativada, aguardando reconhecimento...";

    setTimeout(iniciarReconhecimentoFacial, 1000);
  } catch (error) {
    mensagem.textContent = "Não foi possível ativar a câmera.";
    console.error("Erro ao acessar câmera:", error);
    showFeedback("error", "Erro ao acessar a câmera. Verifique as permissões.");
  }
}

function iniciarReconhecimentoFacial() {
  if (recognitionInterval) {
    clearInterval(recognitionInterval);
  }

  recognitionInterval = setInterval(() => {
    if (!isProcessing) {
      capturarEReconhecer();
    }
  }, 1000);
}

function capturarEReconhecer() {
  if (isProcessing) return;

  isProcessing = true;
  mensagem.textContent = "Processando reconhecimento...";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg");

  reconhecerFace(imageData);
}

function registrarLoginFacial(username, id) {
  const URL_REGISTRO =
    "https://faceshield-back.onrender.com/auth/generate-token";

  console.log(`Registrando evento de login para: ${username} (ID: ${id})`);

  return fetch(URL_REGISTRO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((response) => {
      console.log(`Resposta do servidor - Status: ${response.status}`);

      if (!response.ok) {
        // Tenta obter mais detalhes do erro
        return response.text().then((text) => {
          console.error(`Resposta de erro: ${text}`);
          throw new Error(
            `Erro ${response.status}: ${response.statusText} - ${text}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Resposta completa do backend:", data);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("id", id);
        console.log("authToken, Username e ID salvos no localStorage.");
        return data.token;
      } else {
        console.warn("Token não encontrado na resposta:", data);
        throw new Error("Token não recebido na resposta");
      }
    })
    .catch((error) => {
      console.error("Erro completo ao registrar evento de login:", error);

      // Verifica se é erro de CORS
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        console.error("❌ ERRO DE REDE/CORS - Verifique:");
        console.error("1. Backend Spring Boot está online?");
        console.error("2. Endpoint /auth/generate-token existe?");
        console.error("3. CORS está configurado no Spring Boot?");
      }

      throw error;
    });
}

// FUNÇÕES DE HORA CORRIGIDAS
function getDataHoraBrasilia() {
  return new Date();
}

function toISOLocalString(date) {
  if (!date) return null;

  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function registrarHistoricoTrava(usuarioId, dataHoraAbertura, token) {
  const URL_HISTORICO_TRAVA =
    "https://faceshield-back.onrender.com/historico-trava/novoLog";

  // Criando o objeto no formato esperado pelo backend
  const historicoData = {
    dataHoraAbertura: dataHoraAbertura,
    usuarioId: usuarioId,
  };

  console.log("Enviando histórico de trava:", historicoData);
  console.log("Token usado:", token);

  const headers = {
    "Content-Type": "application/json",
  };

  // Se tiver token, adiciona ao header
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(URL_HISTORICO_TRAVA, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(historicoData),
  })
    .then((response) => {
      if (!response.ok) {
        console.warn(
          `Não foi possível registrar o histórico de trava. Status: ${response.status}`
        );
        return Promise.reject(
          `Erro ${response.status}: ${response.statusText}`
        );
      }
      console.log("Histórico de trava registrado com sucesso!");
      return response.json();
    })
    .then((data) => {
      console.log("Resposta do histórico:", data);
    })
    .catch((error) => {
      console.error("Erro ao registrar histórico de trava:", error);
    });
}

function reconhecerFace(imageData) {
  toggleLoading(true);

  fetch("http://localhost:5005/face-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imagem: imageData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Resposta completa do Python:", data);

      toggleLoading(false);
      isProcessing = false;

      if (data.authenticated) {
        const username = data.user_info.username;
        const tipoUsuario = data.tipo_usuario;
        const id = data.user_info.id;

        mensagem.textContent = `Bem-vindo, ${username}!`;
        showFeedback(
          "success",
          `Login realizado com sucesso! Bem-vindo, ${username}.`
        );

        // Primeiro registra o login para obter o token
        registrarLoginFacial(username, id)
          .then((token) => {
            console.log("Token obtido com sucesso");

            // SÓ REGISTRA HISTÓRICO SE FOR ALUNO
            if (tipoUsuario === "ALUNO") {
              console.log("Usuário é ALUNO, registrando histórico de trava...");
              const dataHoraAtual = toISOLocalString(getDataHoraBrasilia());

              // Aguarda o registro do histórico antes de redirecionar
              return registrarHistoricoTrava(id, dataHoraAtual, token).then(
                () => {
                  console.log("Redirecionando para QR Code...");
                  window.location.href = "/Html/QrCode.html";
                }
              );
            } else {
              console.log("Usuário é PROFESSOR, redirecionando para Menu...");
              window.location.href = "/Html/Menu.html";
            }
          })
          .catch((error) => {
            console.error("Erro ao obter token:", error);
            // Redireciona mesmo com erro, mas tenta registrar histórico se for aluno
            if (tipoUsuario === "ALUNO") {
              const dataHoraAtual = toISOLocalString(getDataHoraBrasilia());
              registrarHistoricoTrava(id, dataHoraAtual, null).finally(() => {
                console.log("Redirecionando para QR Code (com erro)...");
                window.location.href = "/Html/QrCode.html";
              });
            } else {
              console.log("Redirecionando para Menu (com erro)...");
              window.location.href = "/Html/Menu.html";
            }
          });
      } else {
        mensagem.textContent =
          data.message || "Usuário não reconhecido. Tente novamente.";
        showFeedback(
          "error",
          data.message || "Usuário não reconhecido. Por favor, tente novamente."
        );
      }
    })
    .catch((error) => {
      toggleLoading(false);
      isProcessing = false;
      console.error("Erro:", error);
      mensagem.textContent = "Erro no reconhecimento. Tente novamente.";
      showFeedback("error", "Erro de conexão com o servidor. Tente novamente.");
    });
}

const botaoVoltar = document.querySelector(".buttonVoltar");

if (botaoVoltar) {
  botaoVoltar.addEventListener("click", () => {
    console.log("Botão Voltar clicado, limpando localStorage...");
    localStorage.clear();
  });
}

window.addEventListener("load", iniciarCamera);

window.addEventListener("beforeunload", () => {
  if (recognitionInterval) {
    clearInterval(recognitionInterval);
  }

  if (video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
});
