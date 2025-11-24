document.addEventListener("DOMContentLoaded", function () {
  const botaoSair = document.getElementById("logout");
  if (botaoSair) {
    botaoSair.addEventListener("click", function (event) {
      //Previne o link de te levar para o index.html IMEDIATAMENTE
      event.preventDefault();
      console.log("Botão Sair foi clicado. Limpando o localStorage...");
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
