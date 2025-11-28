document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const senha = document.getElementById("senha").value;

    const apiUrl = "https://faceshield-back.onrender.com/auth/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, senha: senha }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("id", data.id);

          window.location.href = "/Html/Menu.html";
        } else {
          alert("Erro: Token não recebido do servidor.");
        }
      } else {
        alert("Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      alert("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    }
  });
});
