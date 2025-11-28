// Função para testar conexão com o backend Spring Boot
async function testarConexaoBackend() {
  const URL_BACKEND = "https://faceshield-back.onrender.com/";

  try {
    console.log("Testando conexão com o backend...");
    const response = await fetch(URL_BACKEND, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(
        "BACKEND CONECTADO: Backend Spring Boot está online e respondendo"
      );
      return true;
    } else {
      console.warn(
        `BACKEND AVISO: Backend respondeu com status: ${response.status}`
      );
      return false;
    }
  } catch (error) {
    console.error("ERRO BACKEND: Erro ao conectar com o backend:", error);
    console.error("Verifique se o backend está online em:", URL_BACKEND);
    return false;
  }
}

// Função principal de inicialização
async function initializeApp() {
  console.log("Inicializando aplicação FaceShield...");

  // Testa a conexão com o backend assim que a página carrega
  await testarConexaoBackend();

  console.log("Aplicação inicializada com sucesso");
}

function initAuth(type, event) {
  if (event) event.preventDefault();

  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "grid";

  // Simulação de processo de autenticação
  setTimeout(() => {
    loadingOverlay.style.display = "none";
    if (type === "login") {
      window.location.href = "Login/CameraLogin.html";
    } else {
      window.location.href = "Cadastro/cadastro.html";
    }
  }, 2000);
}

// Inicializa a aplicação quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});
