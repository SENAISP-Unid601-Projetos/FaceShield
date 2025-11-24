const API_URL = "http://localhost:8080/locais/buscar";
const API_DELETE = "http://localhost:8080/locais/deletar";
const API_POST = "http://localhost:8080/locais/novoLocal";
const API_EDITAR = "http://localhost:8080/locais/editar";

// Elementos DOM
const locationsTableBody = document.getElementById("locations-table-body");
const locationGrid = document.getElementById("location-grid");
const searchInput = document.getElementById("search-input");
const locationModal = document.getElementById("location-modal");
const locationForm = document.getElementById("location-form");
const modalTitle = document.getElementById("modal-title");
const locationId = document.getElementById("location-id");
const locationSpace = document.getElementById("location-space");
const locationCabinet = document.getElementById("location-cabinet");
const locationShelf = document.getElementById("location-shelf");
const locationCase = document.getElementById("location-case");
const addLocationBtn = document.getElementById("add-location-btn");
const addFirstLocationBtn = document.getElementById("add-first-location");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const closeBtn = document.querySelector(".close-btn");
const viewToggleBtn = document.getElementById("view-toggle-btn");
const tableView = document.getElementById("table-view");
const cardView = document.getElementById("card-view");
const emptyState = document.getElementById("empty-state");
const notification = document.getElementById("notification");
const loadingOverlay = document.getElementById("loading-overlay");

// Variável para armazenar os locais
let locations = [];
/**
 * Pega o token do localStorage e retorna o cabeçalho de Autorização.
 * Se o token não existir, lança um erro e redireciona para o login.
 * @param {boolean} includeContentType - Define se o 'Content-Type: application/json' deve ser incluído
 * @returns {HeadersInit} - Objeto de Headers pronto para o fetch
 */
function getAuthHeaders(includeContentType = false) {
  const token = localStorage.getItem("authToken");
 // console.log("Token", token);
  if (!token) {
    alert("Sessão expirada ou usuário não logado.");
    window.location.href = "/front/Html/Login.html";
    throw new Error("Token não encontrado. Redirecionando para login.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Função para tratar erros de resposta da API, especialmente 401/403.
 * @param {Response} response - O objeto de resposta do fetch
 */
async function handleResponseError(response) {
  if (response.status === 401 || response.status === 403) {
    // Token inválido ou expirado
    alert("Acesso negado. Sua sessão pode ter expirado. Faça login novamente.");
    window.location.href = "/front/Html/Login.html";
    throw new Error("Acesso não autorizado (401/403).");
  }

  const errorText = await response.text();
  // Tenta extrair uma mensagem do erro, se for JSON
  try {
    const errorJson = JSON.parse(errorText);
    if (errorJson.message) {
      throw new Error(errorJson.message);
    }
  } catch (e) {
    // Ignora se não for JSON e usa o texto original
  }

  throw new Error(
    `Erro na requisição: ${errorText} (Status: ${response.status})`
  );
}

// Função para mostrar notificação
function showNotification(type, message) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Função para mostrar/ocultar loading
function showLoading(show) {
  loadingOverlay.style.display = show ? "flex" : "none";
}

// Função para buscar locais da API
async function fetchLocations() {
  showLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(), //Adiciona token
    });

    if (!response.ok) {
      await handleResponseError(response); // Trata erros
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    // Não exibe notificação se for erro de auth (já tratado com alert)
    if (
      !error.message.includes("Token") &&
      !error.message.includes("401/403")
    ) {
      showNotification("error", "Falha ao carregar locais do servidor");
    }
    return [];
  } finally {
    showLoading(false);
  }
}

// Função para carregar locais na tabela
function loadLocationsTable(locationsArray = locations) {
  locationsTableBody.innerHTML = "";

  if (locationsArray.length === 0) {
    showEmptyState();
    return;
  }

  tableView.style.display = "block";
  emptyState.style.display = "none";

  locationsArray.forEach((location) => {
    const row = document.createElement("tr");

    const caseDisplay = location.estojo
      ? `<span class="location-badge"><i class="fas fa-box"></i> ${location.estojo}</span>`
      : '<span class="location-badge"><i class="fas fa-box"></i> N/A</span>';

    // === BOTÕES CORRIGIDOS AQUI ===
    row.innerHTML = `
            <td>${location.id}</td>
            <td><span class="location-badge"><i class="fas fa-building"></i> ${location.nomeEspaco}</span></td>
            <td><span class="location-badge"><i class="fas fa-archive"></i> ${location.armario}</span></td>
            <td><span class="location-badge"><i class="fas fa-layer-group"></i> ${location.prateleira}</span></td>
            <td>${caseDisplay}</td>
            <td class="actions">
                <button class="btn-action btn-edit" data-id="${location.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" data-id="${location.id}">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
          `;
    locationsTableBody.appendChild(row);
  });

  // Adicionar event listeners para os botões de ação
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      openEditLocationModal(id);
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      deleteLocation(id);
    });
  });
}

// Função para carregar locais em cards
function loadLocationsCards(locationsArray = locations) {
  locationGrid.innerHTML = "";

  if (locationsArray.length === 0) {
    showEmptyState();
    return;
  }

  cardView.style.display = "block";
  emptyState.style.display = "none";

  locationsArray.forEach((location) => {
    const card = document.createElement("div");
    card.className = "location-card";

    const caseDisplay = location.estojo ? location.estojo : "N/A";

    // === BOTÕES CORRIGIDOS AQUI ===
    card.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-map-marker-alt"></i> Local #${location.id}</h3>
            </div>
            <div class="card-body">
                <div class="location-info">
                    <i class="fas fa-building"></i>
                    <span><strong>Espaço:</strong> ${location.nomeEspaco}</span>
                </div>
                <div class="location-info">
                    <i class="fas fa-archive"></i>
                    <span><strong>Armário:</strong> ${location.armario}</span>
                </div>
                <div class="location-info">
                    <i class="fas fa-layer-group"></i>
                    <span><strong>Prateleira:</strong> ${location.prateleira}</span>
                </div>
                <div class="location-info">
                    <i class="fas fa-box"></i>
                    <span><strong>Estojo:</strong> ${caseDisplay}</span>
                </div>
            </div>
            <div class="card-footer actions">
                <button class="btn-action btn-edit" data-id="${location.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" data-id="${location.id}">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
          `;
    locationGrid.appendChild(card);
  });

  // Adicionar event listeners para os botões de ação nos cards
  document.querySelectorAll(".card-footer .btn-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      openEditLocationModal(id);
    });
  });

  document.querySelectorAll(".card-footer .btn-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      deleteLocation(id);
    });
  });
}

// Função para mostrar estado vazio
function showEmptyState() {
  tableView.style.display = "none";
  cardView.style.display = "none";
  emptyState.style.display = "block";
}

// Função de pesquisa
function searchLocations() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredLocations = locations.filter(
    (location) =>
      location.nomeEspaco.toLowerCase().includes(searchTerm) ||
      location.armario.toLowerCase().includes(searchTerm) ||
      location.prateleira.toLowerCase().includes(searchTerm) ||
      (location.estojo && location.estojo.toLowerCase().includes(searchTerm))
  );

  if (cardView.style.display !== "none") {
    loadLocationsCards(filteredLocations);
  } else {
    loadLocationsTable(filteredLocations);
  }
}

function openAddLocationModal() {
  if (locationForm) {
    locationForm.reset();
  }
  locationId.value = "";
  modalTitle.textContent = "Adicionar Novo Local";
  locationModal.style.display = "flex";
}

function openEditLocationModal(id) {
  const location = locations.find((l) => l.id == id);
  if (location) {
    locationId.value = location.id;
    locationSpace.value = location.nomeEspaco;
    locationCabinet.value = location.armario;
    locationShelf.value = location.prateleira;
    locationCase.value = location.estojo || "";

    modalTitle.textContent = "Editar Local";
    locationModal.style.display = "flex";
  }
}

function closeModal() {
  locationModal.style.display = "none";
}

// Função para salvar local, criação ou atualização
async function saveLocation() {
  const id = locationId.value;
  const nomeEspaco = locationSpace.value;
  const armario = locationCabinet.value;
  const prateleira = locationShelf.value;
  const estojo = locationCase.value;

  // Construir objeto com os nomes corretos
  const localData = {
    nomeEspaco,
    armario,
    prateleira,
    estojo: estojo || null,
  };

  // Adicionar ID se estiver editando
  if (id) localData.id = id;

  showLoading(true);
  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_EDITAR}/${id}` : API_POST;

    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(true),
      body: JSON.stringify(localData),
    });

    if (!response.ok) {
      await handleResponseError(response); // Trata erros
    }

    // Recarregar locais após salvar
    locations = await fetchLocations();

    if (cardView.style.display !== "none") {
      loadLocationsCards();
    } else {
      loadLocationsTable();
    }

    closeModal();
    showNotification(
      "success",
      id ? "Local atualizado com sucesso!" : "Local criado com sucesso!"
    );
  } catch (error) {
    console.error("Erro ao salvar local:", error);
    if (
      !error.message.includes("Token") &&
      !error.message.includes("401/403")
    ) {
      showNotification("error", error.message || "Erro ao salvar local");
    }
  } finally {
    showLoading(false);
  }
}

// Função para excluir local
async function deleteLocation(id) {
  if (!confirm("Tem certeza que deseja excluir este local?")) return;

  showLoading(true);
  try {
    const response = await fetch(`${API_DELETE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    // Recarregar locais após excluir
    locations = await fetchLocations();

    if (cardView.style.display !== "none") {
      loadLocationsCards();
    } else {
      loadLocationsTable();
    }

    showNotification("success", "Local excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir local:", error);
    if (
      !error.message.includes("Token") &&
      !error.message.includes("401/403")
    ) {
      showNotification("error", error.message || "Erro ao excluir local");
    }
  } finally {
    showLoading(false);
  }
}

// Alternar entre visualizações
function toggleView() {
  if (tableView.style.display !== "none") {
    tableView.style.display = "none";
    cardView.style.display = "block";
    viewToggleBtn.innerHTML =
      '<i class="fas fa-list"></i> Visualização em Tabela';
    loadLocationsCards();
  } else {
    tableView.style.display = "block";
    cardView.style.display = "none";
    viewToggleBtn.innerHTML = '<i class="fas fa-th"></i> Visualização em Cards';
    loadLocationsTable();
  }
}

// Inicializar aplicação
async function init() {
  try {
    locations = await fetchLocations();

    if (locations.length > 0) {
      loadLocationsTable();
    } else {
      showEmptyState();
    }
  } catch (error) {
    console.error("Erro na inicialização:", error);
    // A notificação de erro de auth
    if (
      !error.message.includes("Token") &&
      !error.message.includes("401/403")
    ) {
      showNotification("error", "Falha ao iniciar a aplicação");
    }
  }
}

// Event Listeners
addLocationBtn.addEventListener("click", openAddLocationModal);
addFirstLocationBtn.addEventListener("click", openAddLocationModal);
saveBtn.addEventListener("click", saveLocation);
cancelBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
searchInput.addEventListener("input", searchLocations);
viewToggleBtn.addEventListener("click", toggleView);

// Fechar modal ao clicar fora do conteúdo
window.addEventListener("click", (e) => {
  if (e.target === locationModal) {
    closeModal();
  }
});

// === BLOCO DO DOMCONTENTLOADED ATUALIZADO ===
// Substituí a linha antiga por este bloco
document.addEventListener("DOMContentLoaded", function () {
  // 1. Chama a inicialização da página de Locais
  init();

  // 2. LÓGICA DO DARK MODE
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (themeToggleBtn) {
    // Verifica se o botão existe
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
});
