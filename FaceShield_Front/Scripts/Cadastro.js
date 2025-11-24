document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");
  if (!form) {
    console.error("Elemento #cadastroForm não encontrado!");
    return;
  }

  const feedback = document.getElementById("feedback");
  const tipoUsuarioSelect = document.getElementById("tipoUsuario");
  const usernameGroup = document.getElementById("username-group");
  const usernameInput = document.getElementById("username");
  const scanWidget = document.querySelector(".face-scan-widget");
  const scanInstruction = scanWidget.querySelector(".upload-instruction");
  const senhaGroup = document.getElementById("senha-group");
  const senhaInput = document.getElementById("senha");
  const nomeInput = document.getElementById("nome");
  const sobrenomeInput = document.getElementById("sobrenome");
  const turmaInput = document.getElementById("turma");
  const viewCameraBtn = document.querySelector(".view-camera-btn");

  const API_BASE_URL = "http://localhost:8080/auth/register";
  const CAPTURE_API_URL = "http://localhost:7001";

  /**
   * Função para tratar erros de resposta da API
   * @param {Response} response - O objeto de resposta do fetch
   */
  async function handleResponseError(response) {
    let errorMessage = `Erro HTTP! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage += ` - ${errorData.message}`;
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }

  let isScanning = false;
  let isViewingCamera = false;
  let captureSessionId = null;
  let faceCaptureComplete = false;
  let faceCaptureSuccess = false;
  let preRegisteredUserId = null;

  const cameraFeed = document.getElementById("camera-feed");

  const checkmark = document.createElement("div");
  checkmark.innerHTML = "&#10004;";

  checkmark.style.position = "absolute";
  checkmark.style.top = "50%";
  checkmark.style.left = "50%";
  checkmark.style.transform = "translate(-50%, -50%) scale(0)";
  checkmark.style.fontSize = "0rem";
  checkmark.style.color = "#00ffaa";
  checkmark.style.textShadow = "0 0 20px rgba(0, 255, 170, 0.8)";
  checkmark.style.zIndex = "10";
  checkmark.style.opacity = "0";
  checkmark.style.transition = "all 0.8s ease-out";
  scanWidget.appendChild(checkmark);

  const socket = io(CAPTURE_API_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    autoConnect: false,
  });

  // Função para mostrar/ocultar campos
  function toggleUsernameField() {
    if (!tipoUsuarioSelect) return;
    const isProfessor = tipoUsuarioSelect.value === "2";

    // Username é SEMPRE visível e obrigatório
    if (usernameGroup) usernameGroup.style.display = "block";
    if (usernameInput) usernameInput.required = true;
    if (senhaGroup) senhaGroup.style.display = isProfessor ? "block" : "none";
    if (senhaInput) senhaInput.required = isProfessor;
    if (!isProfessor) {
      if (senhaInput) senhaInput.value = "";
    }
  }

  // Validação em tempo real
  function validarCampo(input) {
    const parent = input.parentElement;
    if (!parent) return;
    const errorElement = parent.querySelector(".error-message");
    if (input.checkValidity()) {
      parent.classList.add("valid");
      parent.classList.remove("invalid");
      if (errorElement) errorElement.style.display = "none";
    } else {
      parent.classList.add("invalid");
      parent.classList.remove("valid");
      if (errorElement) {
        errorElement.textContent = "Este campo é obrigatório.";
        errorElement.style.display = "block";
      }
    }
  }

  // Exibir mensagens de feedback
  function showFeedback(tipo, mensagem) {
    if (!feedback) return;
    feedback.textContent = mensagem;
    feedback.className = "feedback " + tipo;
    feedback.style.display = "block";
    setTimeout(() => {
      feedback.style.opacity = "0";
      setTimeout(() => {
        feedback.style.display = "none";
        feedback.style.opacity = "1";
        feedback.style.transform = "translateX(0)";
      }, 500);
    }, 5000);
  }

  // Socket.IO event handlers
  socket.on("connect", () => {
    console.log("Conectado ao servidor de captura facial.");

    if (isViewingCamera) {
      scanInstruction.textContent = "Visualizando câmera...";
      return;
    }

    const nome = nomeInput.value.trim();
    const sobrenome = sobrenomeInput.value.trim();
    const turma = turmaInput.value.trim();
    const tipoUsuario = tipoUsuarioSelect.value;

    if (!nome || !sobrenome || !turma) {
      showFeedback(
        "error",
        "Preencha nome, sobrenome e turma antes da captura biométrica"
      );
      isScanning = false;
      socket.disconnect();
      return;
    }

    const payload = {
      nome: nome,
      sobrenome: sobrenome,
      turma: turma,
      tipoUsuario: tipoUsuario,
      session_id: captureSessionId,
    };

    socket.emit("start_camera", payload);
    scanInstruction.textContent = "Processando...";
  });

  socket.on("connect_error", (err) => {
    console.error(`Erro de conexão com Socket.IO: ${err.message}`);
    showFeedback(
      "error",
      "Não foi possível conectar ao servidor de captura. Verifique se o back-end está rodando na porta 7001."
    );
    isScanning = false;
    isViewingCamera = false;
    scanInstruction.textContent = "Falha na conexão. Tente novamente.";
    scanWidget.style.background = "rgba(255, 77, 125, 0.2)";
  });

  socket.on("capture_progress", (data) => {
    if (!isViewingCamera) {
      const progress = Math.min(
        100,
        Math.round((data.captured / data.total) * 100)
      );
      scanInstruction.textContent = `Capturando... ${progress}%`;
      scanWidget.style.background = `linear-gradient(
                      to right,
                      rgba(0, 224, 255, 0.5) ${progress}%,
                      rgba(30, 41, 59, 0.3) ${progress}%
                  )`;
    }
  });

  socket.on("capture_frame", (data) => {
    cameraFeed.src = `data:image/jpeg;base64,${data.frame}`;
    cameraFeed.style.display = "block";
    scanInstruction.style.display = "none";
    checkmark.style.display = "none";
  });

  socket.on("capture_complete", (data) => {
    isScanning = false;
    faceCaptureComplete = true;

    if (data.success) {
      faceCaptureSuccess = true;
      preRegisteredUserId = data.id;

      // Validação se o ID recebido é um número
      if (!preRegisteredUserId || isNaN(preRegisteredUserId)) {
        console.error(
          `Erro fatal: ID recebido do Python não é um número: ${preRegisteredUserId}`
        );
        showFeedback(
          "error",
          "Erro de comunicação (ID inválido). Tente novamente."
        );
        faceCaptureSuccess = false;
        isScanning = false;
        socket.disconnect();
        return;
      }

      console.log(`Usuário pré-cadastrado com ID: ${preRegisteredUserId}`);

      cameraFeed.style.display = "none";
      scanInstruction.style.display = "none";
      checkmark.style.display = "block";
      checkmark.style.opacity = "1";
      checkmark.style.fontSize = "5rem";
      checkmark.style.transform = "translate(-50%, -50%) scale(1)";
      setTimeout(() => {
        checkmark.style.opacity = "0";
        checkmark.style.transform = "translate(-50%, -50%) scale(0.5)";
        scanInstruction.style.display = "block";
        scanInstruction.textContent = "Biometria capturada!";
        scanWidget.style.background = "rgba(0, 255, 170, 0.1)";
        scanWidget.classList.add("capture-success");
      }, 2500);
      setTimeout(() => {
        checkmark.style.display = "none";
      }, 3300);
    } else {
      faceCaptureSuccess = false;
      cameraFeed.style.display = "none";
      checkmark.style.display = "none";
      scanInstruction.style.display = "block";
      scanInstruction.textContent =
        "Falha na captura. Clique para tentar novamente";
      scanWidget.style.background = "rgba(255, 77, 125, 0.2)";
      showFeedback("error", `Erro na captura biométrica: ${data.message}`);
    }
    console.log(
      "Captura completa. Resultado: ",
      data.success ? "Sucesso" : "Falha",
      "Mensagem:",
      data.message
    );
    socket.disconnect();
  });

  // Função para visualizar a câmera
  viewCameraBtn.addEventListener("click", () => {
    if (isViewingCamera) {
      socket.disconnect();
      isViewingCamera = false;
      viewCameraBtn.textContent = "Visualizar Câmera";
      cameraFeed.style.display = "none";
      scanInstruction.style.display = "block";
      scanInstruction.textContent = "Clique para captura biométrica";
      return;
    }
    isViewingCamera = true;
    captureSessionId = Date.now().toString() + "_view";
    cameraFeed.src = "";
    cameraFeed.style.display = "none";
    checkmark.style.display = "none";
    scanInstruction.style.display = "block";
    scanInstruction.textContent = "Preparando câmera...";
    scanWidget.style.background = "rgba(30, 41, 59, 0.5)";
    scanWidget.classList.remove("capture-success");
    socket.io.opts.query = { session_id: captureSessionId };
    socket.connect();
    viewCameraBtn.textContent = "Parar Visualização";
  });

  // Clique para iniciar a captura
  scanWidget.addEventListener("click", () => {
    if (isScanning || isViewingCamera) return;

    // Validação
    if (
      !nomeInput.value.trim() ||
      !sobrenomeInput.value.trim() ||
      !turmaInput.value.trim()
    ) {
      showFeedback(
        "error",
        "Preencha nome, sobrenome e turma antes da captura biométrica"
      );
      return;
    }

    isScanning = true;
    isViewingCamera = false;
    faceCaptureComplete = false;
    faceCaptureSuccess = false;
    preRegisteredUserId = null;
    captureSessionId = Date.now().toString();

    cameraFeed.src = "";
    cameraFeed.style.display = "none";
    checkmark.style.display = "none";
    checkmark.style.opacity = "0";
    checkmark.style.fontSize = "0rem";
    checkmark.style.transform = "translate(-50%, -50%) scale(0)";
    scanInstruction.style.display = "block";
    scanInstruction.textContent = "Preparando câmera...";
    scanWidget.style.background = "rgba(30, 41, 59, 0.5)";
    scanWidget.classList.remove("capture-success");
    socket.io.opts.query = { session_id: captureSessionId };
    socket.connect();
    console.log("Iniciando conexão com Socket.IO...");
  });

  if (tipoUsuarioSelect) {
    tipoUsuarioSelect.addEventListener("change", toggleUsernameField);
    toggleUsernameField();
  }
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => validarCampo(input));
  });

  // Submit do formulário
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const tipoUsuario = tipoUsuarioSelect ? tipoUsuarioSelect.value : "";

    // Validação de campos para o SUBMIT
    const camposIniciais = ["nome", "sobrenome", "turma"];
    const campos = ["username"];

    if (tipoUsuario === "2") {
      campos.push("senha"); // Senha só é validada para professor
    }

    let isValid = true;
    [...camposIniciais, ...campos].forEach((id) => {
      const campo = document.getElementById(id);
      if (!campo) return;
      if (
        !campo.value.trim() &&
        (campo.required || camposIniciais.includes(id))
      ) {
        isValid = false;
        campo.classList.add("input-error");
      } else {
        campo.classList.remove("input-error");
      }
    });

    if (!tipoUsuario) {
      showFeedback("error", "Selecione o tipo de usuário");
      return;
    }

    if (!isValid) {
      showFeedback(
        "error",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    if (!faceCaptureComplete) {
      showFeedback("error", "Realize a captura biométrica antes de cadastrar");
      return;
    }

    if (!faceCaptureSuccess || !preRegisteredUserId) {
      showFeedback(
        "error",
        "Captura biométrica não concluída ou ID não encontrado"
      );
      return;
    }

    const formData = {
      username: usernameInput.value.trim(),
      senha: tipoUsuario === "2" ? senhaInput.value : null,
    };

    try {
      showFeedback("info", "Enviando dados de cadastro...");
      document.querySelector(".loading-overlay").style.display = "grid";

      const finalApiUrl = `${API_BASE_URL}/${preRegisteredUserId}`;

      console.log(`Enviando PUT para: ${finalApiUrl}`);

      const response = await fetch(finalApiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      document.querySelector(".loading-overlay").style.display = "none";

      if (!response.ok) {
        await handleResponseError(response);
      }

      const responseData = await response.json();

      // Check de sucesso no cadastro
      if (response.status === 200 && responseData.token) {
        showFeedback("success", "Cadastro completado com sucesso!");

        // --- CORREÇÃO ---
        // Salva o token para que a próxima página (Usuarios.js) funcione
        localStorage.setItem("authToken", responseData.token);

        // Salva o username também, pois vi que seu Usuarios.js tenta pegar ele
        const usernameCadastrado = usernameInput.value.trim();
        localStorage.setItem("username", usernameCadastrado);
        // --- FIM DA CORREÇÃO ---

        form.reset();
        toggleUsernameField();
        faceCaptureComplete = false;
        faceCaptureSuccess = false;
        preRegisteredUserId = null;
        scanInstruction.textContent = "Clique para captura biométrica";
        scanWidget.style.background = "";
        scanWidget.classList.remove("capture-success");
        
        // Redireciona para a página de usuários, já que o login foi feito
        window.location.href = "Login.html"; 
      } else {
        const errorMsg =
          responseData.message ||
          "Cadastro aparentemente realizado, mas sem confirmação do servidor";
        showFeedback("warning", errorMsg);
      }
    } catch (error) {
      document.querySelector(".loading-overlay").style.display = "none";
      console.error("Erro completo na requisição:", error);
      let errorMessage;
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        errorMessage =
          "Servidor de cadastro offline! Verifique se o backend está rodando na porta 8080.";
      } else {
        errorMessage = error.message;
      }
      showFeedback("error", errorMessage);
    }
  });
});
