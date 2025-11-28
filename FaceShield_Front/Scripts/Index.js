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
