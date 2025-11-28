// Elementos DOM
const loansTableBody = document.getElementById("loans-table-body");
const filterUser = document.getElementById("filter-user");
const filterTool = document.getElementById("filter-tool");
const filterStatus = document.getElementById("filter-status");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const feedbackMessage = document.getElementById("feedback-message");
const novoEmprestimoBtn = document.getElementById("novo-emprestimo-btn");

// Elementos do Modal
const modal = document.getElementById("loan-details-modal");
const closeModalBtn = document.querySelector(".close");
const modalReturnBtn = document.getElementById("modal-return-btn");
const modalId = document.getElementById("modal-id");
const modalUser = document.getElementById("modal-user");
const modalTool = document.getElementById("modal-tool");
const modalWithdrawal = document.getElementById("modal-withdrawal");
const modalExpectedReturn = document.getElementById("modal-expected-return");
const modalActualReturn = document.getElementById("modal-actual-return");
const modalStatus = document.getElementById("modal-status");
const modalNotes = document.getElementById("modal-notes");
const modalLocationSpace = document.getElementById("modal-location-space");
const modalLocationCabinet = document.getElementById("modal-location-cabinet");
const modalLocationShelf = document.getElementById("modal-location-shelf");
const modalLocationCase = document.getElementById("modal-location-case");

// URLs da API
const API_BASE = "http://localhost:8080";
const EMPRESTIMOS_API = `${API_BASE}/emprestimos/buscar`;
const FINALIZAR_EMPRESTIMO_API = `${API_BASE}/emprestimos/finalizar`;
const FERRAMENTAS_API = `${API_BASE}/ferramentas/buscar`;
const LOCAIS_API = `${API_BASE}/locais/buscar`;

// Variáveis globais (Cache de dados)
let currentPage = 1;
const itemsPerPage = 10;
let allLoans = [];
let filteredLoans = [];
let currentLoanId = null;
let allTools = [];
let allLocals = [];

/**
 * Pega o token do localStorage e retorna o cabeçalho de Autorização.
 * @param {boolean} includeContentType - Define se o 'Content-Type: application/json' deve ser incluído
 * @returns {HeadersInit} - Objeto de Headers pronto para o fetch
 */
function getAuthHeaders(includeContentType = false) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Sessão expirada ou usuário não logado.");
    throw new Error("Token não encontrado. Redirecionando para login.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  //console.log("Token: ", token);
  // console.log(`Headers: ${headers}`);
  return headers;
}

/**
 * Função para tratar erros de resposta da API, especialmente 401/403.
 * @param {Response} response - O objeto de resposta do fetch
 */
async function handleResponseError(response) {
  if (response.status === 401 || response.status === 403) {
    // CORREÇÃO 2: Removido o 'error' que não estava definido
    alert("Acesso negado. Sua sessão pode ter expirado. Faça login novamente.");
    window.location.href = "/Html/Login.html";
    throw new Error("Acesso não autorizado (401/403).");
  }

  const errorText = await response.text();
  throw new Error(
    `Erro na requisição: ${errorText} (Status: ${response.status})`
  );
}

// Converte um objeto Date para uma string ISO 8601 no fuso horário local.
function formatToISOLocal(date) {
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

function showFeedback(message, type = "error") {
  feedbackMessage.textContent = message;
  feedbackMessage.className = `feedback-message feedback-${type}`;
  feedbackMessage.style.display = "block";
  if (type === "success") {
    setTimeout(() => {
      feedbackMessage.style.display = "none";
    }, 3000);
  }
}

// Carrega todos os dados iniciais (Empréstimos, Ferramentas e Locais) da API.
async function loadAllData() {
  try {
    showFeedback("Carregando dados...", "success");
    loansTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;"><div style="display: inline-block; margin-right: 10px;" class="loading"></div>Carregando empréstimos...</td></tr>`;

    const authHeaders = getAuthHeaders();

    // Carrega todos os dados necessários em paralelo
    const [loansResponse, toolsResponse, localsResponse] = await Promise.all([
      fetch(EMPRESTIMOS_API, { headers: authHeaders }),
      fetch(FERRAMENTAS_API, { headers: authHeaders }),
      fetch(LOCAIS_API, { headers: authHeaders }),
    ]);

    if (!loansResponse.ok) await handleResponseError(loansResponse);
    if (!toolsResponse.ok) await handleResponseError(toolsResponse);
    if (!localsResponse.ok) await handleResponseError(localsResponse);

    const loansData = await loansResponse.json();
    const toolsData = await toolsResponse.json();
    const localsData = await localsResponse.json();

    // ORDENA OS EMPRÉSTIMOS PELO MAIOR ID PRIMEIRO (DESCENDENTE)
    allLoans = loansData.sort((a, b) => b.id - a.id);
    allTools = toolsData;
    allLocals = localsData;

    filteredLoans = [...allLoans];
    renderTable();
    setupPagination();
    feedbackMessage.style.display = "none";
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    loansTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #c62828;">Erro ao carregar dados. Verifique se o servidor está rodando.</td></tr>`;

    if (
      !error.message.includes("Token") &&
      !error.message.includes("401/403")
    ) {
      showFeedback(
        "Erro ao carregar dados. Verifique se o servidor está rodando."
      );
    }
  }
}

// Finaliza um empréstimo (registra devolução)
async function finalizarEmprestimo(loanId) {
  try {
    showFeedback("Registrando devolução...", "success");
    const now = new Date();
    const dataDevolucao = formatToISOLocal(now);
    const emprestimo = allLoans.find((loan) => loan.id == loanId);

    const params = new URLSearchParams();
    params.append("dataDevolucao", dataDevolucao);
    if (emprestimo && emprestimo.observacoes) {
      params.append("observacoes", emprestimo.observacoes);
    }

    const response = await fetch(
      `${FINALIZAR_EMPRESTIMO_API}/${loanId}?${params}`,
      {
        method: "PUT",
        headers: getAuthHeaders(true),
      }
    );

    if (!response.ok) {
      await handleResponseError(response);
    }

    showFeedback("Devolução registrada com sucesso!", "success");
    loadAllData(); // Recarrega os dados para atualizar a tabela
    closeModal();
  } catch (error) {
    console.error("Erro ao registrar devolução:", error);

    if (!error.message.includes("401/403")) {
      showFeedback(`Erro ao registrar devolução: ${error.message}`);
    }
  }
}

// Renderiza a tabela de empréstimos com base nos dados filtrados e paginação
function renderTable() {
  loansTableBody.innerHTML = "";
  if (filteredLoans.length === 0) {
    loansTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhum empréstimo encontrado</td></tr>`;
    return;
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLoans.length);
  const currentLoans = filteredLoans.slice(startIndex, endIndex);

  currentLoans.forEach((loan) => {
    const row = document.createElement("tr");
    const status = calculateLoanStatus(loan);
    const isReturned = status === "Devolvido";
    row.innerHTML = `
              <td>${loan.id}</td>
              <td>${loan.nomeUsuario || "N/A"}</td>
              <td>${loan.nomeFerramenta || "N/A"}</td>
              <td>${formatDate(loan.data_retirada)}</td>
              <td>${
                loan.data_devolucao
                  ? formatDate(loan.data_devolucao)
                  : "Pendente"
              }</td>
              <td><span class="status-badge ${getStatusClass(
                status
              )}">${status}</span></td>
              <td>${loan.observacoes || "Nenhuma"}</td>
              <td>
                  <div class="action-buttons">
                      <button class="view-btn" data-id="${loan.id}">
                          <i class="fas fa-eye"></i> Detalhes
                      </button>
                      ${
                        !isReturned
                          ? `<button class="return-btn" data-id="${loan.id}"><i class="fas fa-check-circle"></i> Devolver</button>`
                          : `<button class="return-btn btn-finalizado" disabled><i class="fas fa-check-square"></i> Finalizado</button>`
                      }
                  </div>
              </td>
            `;
    loansTableBody.appendChild(row);
  });

  // Adiciona listeners aos botões de ação
  loansTableBody
    .querySelectorAll(".return-btn:not([disabled])")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        const btn = e.target.closest(".return-btn");
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Devolvendo...';
        const loanId = btn.getAttribute("data-id");
        finalizarEmprestimo(loanId);
      });
    });

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const loanId = e.target.closest(".view-btn").getAttribute("data-id");
      openModal(loanId);
    });
  });
}

// Abre o modal de detalhes do empréstimo
function openModal(loanId) {
  const loan = allLoans.find((item) => item.id == loanId);
  if (!loan) return;

  currentLoanId = loanId;
  const status = calculateLoanStatus(loan);
  const isReturned = status === "Devolvido";

  // Preenche os dados básicos do modal
  modalId.textContent = loan.id;
  modalUser.textContent = loan.nomeUsuario || "N/A";
  modalTool.textContent = loan.nomeFerramenta || "N/A";
  modalWithdrawal.textContent = formatDate(loan.data_retirada);

  const withdrawalDate = new Date(loan.data_retirada);
  const expectedReturnDate = new Date(withdrawalDate);
  expectedReturnDate.setDate(expectedReturnDate.getDate() + 7);
  modalExpectedReturn.textContent = formatDate(expectedReturnDate);

  modalActualReturn.textContent = loan.data_devolucao
    ? formatDate(loan.data_devolucao)
    : "Pendente";
  modalStatus.textContent = status;
  modalStatus.className = getStatusClass(status);
  modalNotes.textContent = loan.observacoes || "Nenhuma";

  let toolLocation = null;

  // --- Lógica de Localização ---
  const tool = allTools.find((t) => t.nome === loan.nomeFerramenta);
  if (tool && tool.nomeLocal) {
    toolLocation = allLocals.find((l) => l.nomeEspaco === tool.nomeLocal);
  }

  // Preenche o modal com os dados encontrados
  if (toolLocation) {
    modalLocationSpace.textContent = toolLocation.nomeEspaco || "N/A";
    modalLocationCabinet.textContent = toolLocation.armario || "N/A";
    modalLocationShelf.textContent = toolLocation.prateleira || "N/A";
    modalLocationCase.textContent = toolLocation.estojo || "N/A";
  } else {
    // Se não achou a localização completa, mostra o nome (se tiver) ou "Não localizado"
    modalLocationSpace.textContent = tool
      ? tool.nomeLocal || "Não localizado"
      : "Não localizado";
    modalLocationCabinet.textContent = "N/A";
    modalLocationShelf.textContent = "N/A";
    modalLocationCase.textContent = "N/A";
  }

  // Configura o botão de devolução no modal
  if (isReturned) {
    modalReturnBtn.disabled = true;
    modalReturnBtn.innerHTML =
      '<i class="fas fa-check-square"></i> Empréstimo Finalizado';
    modalReturnBtn.className = "return-btn btn-finalizado";
  } else {
    modalReturnBtn.disabled = false;
    modalReturnBtn.innerHTML =
      '<i class="fas fa-check-circle"></i> Registrar Devolução';
    modalReturnBtn.className = "return-btn";
  }

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  currentLoanId = null;
}

// Determina o status (Devolvido, Em atraso, Em andamento) de um empréstimo
function calculateLoanStatus(loan) {
  const now = new Date();

  if (loan.data_devolucao) {
    const dataDevolucao = new Date(loan.data_devolucao);
    if (dataDevolucao <= now) {
      return "Devolvido";
    }
  }

  const withdrawalDate = new Date(loan.data_retirada);
  const expectedReturnDate = new Date(withdrawalDate);
  expectedReturnDate.setDate(expectedReturnDate.getDate() + 7);

  if (now > expectedReturnDate) {
    return "Em atraso";
  }

  return "Em andamento";
}

// Retorna a classe CSS correspondente ao status
function getStatusClass(status) {
  switch (status) {
    case "Pendente":
      return "status-pending";
    case "Em andamento":
      return "status-active";
    case "Devolvido":
      return "status-returned";
    case "Em atraso":
      return "status-delayed";
    default:
      return "";
  }
}

// Formata uma string de data (ISO) para o formato "dd/mm/aaaa, HH:MM"
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Configura os botões e informações de paginação
function setupPagination() {
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  prevPageBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      setupPagination();
    }
  };
  nextPageBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      setupPagination();
    }
  };
}

// Filtra a lista 'allLoans' com base nos inputs de filtro
function applyFilters() {
  const userText = filterUser.value.toLowerCase();
  const toolText = filterTool.value.toLowerCase();
  const status = filterStatus.value;

  filteredLoans = allLoans.filter((loan) => {
    if (userText && !(loan.nomeUsuario || "").toLowerCase().includes(userText))
      return false;
    if (
      toolText &&
      !(loan.nomeFerramenta || "").toLowerCase().includes(toolText)
    )
      return false;
    if (status) {
      const loanStatus = calculateLoanStatus(loan);
      const statusMap = {
        active: "Em andamento",
        returned: "Devolvido",
        delayed: "Em atraso",
      };
      if (loanStatus !== statusMap[status]) return false;
    }
    return true;
  });

  currentPage = 1;
  renderTable();
  setupPagination();
}

// Inicialização e Event Listeners
filterUser.addEventListener("input", applyFilters);
filterTool.addEventListener("input", applyFilters);
filterStatus.addEventListener("change", applyFilters);
novoEmprestimoBtn.addEventListener("click", () => {
  window.location.href = "PostEmp.html";
});

closeModalBtn.addEventListener("click", closeModal);
modalReturnBtn.addEventListener("click", () => {
  if (currentLoanId) {
    modalReturnBtn.disabled = true;
    modalReturnBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Devolvendo...';
    finalizarEmprestimo(currentLoanId);
  }
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// === BLOCO DO DOMCONTENTLOADED ATUALIZADO ===
document.addEventListener("DOMContentLoaded", function () {
  // === LÓGICA DO DARK MODE ADICIONADA AQUI ===
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector("i");

    // Função para aplicar o tema (claro ou escuro)
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

    // Verificar se já existe um tema salvo no localStorage
    const temaSalvo = localStorage.getItem("theme");

    if (temaSalvo) {
      aplicarTema(temaSalvo);
    } else {
      // Opcional: Checar preferência do sistema
      const prefereEscuro =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefereEscuro) {
        aplicarTema("dark");
      } else {
        aplicarTema("light");
      }
    }

    // Adicionar o evento de clique ao botão
    themeToggleBtn.addEventListener("click", () => {
      // Verifica se o body JÁ TEM a classe dark-mode
      if (body.classList.contains("dark-mode")) {
        // Se sim, troca para light
        aplicarTema("light");
        localStorage.setItem("theme", "light"); // Salva a escolha
      } else {
        // Se não, troca para dark
        aplicarTema("dark");
        localStorage.setItem("theme", "dark"); // Salva a escolha
      }
    });
  }
  // === FIM DA LÓGICA DO DARK MODE ===

  // --- O RESTO DO SEU CÓDIGO ORIGINAL CONTINUA ABAIXO ---
  loadAllData();
});
