const API_BASE = "http://localhost:8080/historico-trava";
const API_GET = `${API_BASE}/buscar`;

function getAuthHeaders() {
  // Recupera exatamente a chave 'authToken' mostrada no seu print
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "/front/Html/Login.html";
    throw new Error("Token não encontrado.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponseError(response) {
  if (response.status === 401 || response.status === 403) {
    alert("Acesso negado. Faça login novamente.");
    window.location.href = "/front/Html/Login.html";
    throw new Error("Acesso não autorizado.");
  }
  const errorText = await response.text();
  throw new Error(`Erro: ${errorText} (Status: ${response.status})`);
}

const historicoService = {
  getAll: async function () {
    try {
      const response = await fetch(API_GET, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  },
};

let allLogs = [];

function formatDateTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function searchHistory() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();

  if (searchTerm === "") {
    loadHistoryTable();
    return;
  }

  const filteredLogs = allLogs.filter(
    (log) =>
      (log.username && log.username.toLowerCase().includes(searchTerm)) ||
      (log.id && log.id.toString().includes(searchTerm)) ||
      (log.dataHoraAbertura && log.dataHoraAbertura.includes(searchTerm))
  );
  loadHistoryTable(filteredLogs);
}

async function loadHistoryTable(logsArray = null) {
  const tableBody = document.getElementById("history-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>';

  try {
    const logs = logsArray || (await historicoService.getAll());

    if (!logsArray) {
      allLogs = logs;
    }

    tableBody.innerHTML = "";

    if (logs.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="3">Nenhum registro encontrado.</td></tr>';
      return;
    }

    // ORDENA OS LOGS PELO MAIOR ID PRIMEIRO (DESCENDENTE)
    const sortedLogs = logs.sort((a, b) => b.id - a.id);

    sortedLogs.forEach((log) => {
      const row = document.createElement("tr");

      // Usando os campos do JSON esperado: id, dataHoraAbertura, username
      const id = log.id;
      const username = log.username || "Desconhecido";
      const dataFormatada = formatDateTime(log.dataHoraAbertura);

      row.innerHTML = `
            <td>${id}</td>
            <td><i class="fas fa-user-circle"></i> ${username}</td>
            <td>${dataFormatada}</td>
          `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro na tabela:", error);
    tableBody.innerHTML =
      '<tr><td colspan="3">Erro ao carregar dados.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadHistoryTable();

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector("i");

    function aplicarTema(tema) {
      if (tema === "dark") {
        body.classList.add("dark-mode");
        if (icon) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        }
      } else {
        body.classList.remove("dark-mode");
        if (icon) {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
      }
    }

    const temaSalvo = localStorage.getItem("theme");
    if (temaSalvo) {
      aplicarTema(temaSalvo);
    } else {
      const prefereEscuro =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      aplicarTema(prefereEscuro ? "dark" : "light");
    }

    themeToggleBtn.addEventListener("click", () => {
      if (body.classList.contains("dark-mode")) {
        aplicarTema("light");
        localStorage.setItem("theme", "light");
      } else {
        aplicarTema("dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
});
