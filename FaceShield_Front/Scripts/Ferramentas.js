// Elementos DOM
const toolsTableBody = document.getElementById("tools-table-body");
const toolsCards = document.getElementById("tools-cards");
const searchInput = document.getElementById("search-input");
const toolModal = document.getElementById("tool-modal");
const modalTitle = document.getElementById("modal-title");
const toolForm = document.getElementById("tool-form");
const toolId = document.getElementById("tool-id");
const toolName = document.getElementById("tool-name");
const toolBrand = document.getElementById("tool-brand");
const toolModel = document.getElementById("tool-model");
const toolQrcode = document.getElementById("tool-qrcode");
const toolEstado = document.getElementById("tool-estado");
const toolDisponibilidade = document.getElementById("tool-disponibilidade");
const toolDescricao = document.getElementById("tool-descricao");
const toolIdLocal = document.getElementById("tool-id_local");
const addToolBtn = document.getElementById("add-tool-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const closeBtn = document.querySelector(".close-btn");
const notification = document.getElementById("notification");
const loadingOverlay = document.getElementById("loading-overlay");

// Constantes da API Java (porta 8080) - USARÃO TOKEN
const Ferramenta_GET = "http://localhost:8080/ferramentas/buscar";
const Ferramenta_POST = "http://localhost:8080/ferramentas/novaFerramenta";
const Ferramenta_PUT = "http://localhost:8080/ferramentas/editar";
const Ferramenta_DELETE = "http://localhost:8080/ferramentas/deletar";
const Ferramenta_GET_BY_QRCODE =
  "http://localhost:5000/ferramentas/buscarPorQRCode";
const locais_get = "http://localhost:8080/locais/buscar";

const QR_SCAN_API = "http://localhost:5000/read-qrcode";

// QR Scanner - Modal e elementos
const qrScannerModal = document.createElement("div");
qrScannerModal.innerHTML = `
<div id="qr-scanner-modal" class="modal">
  <div class="modal-content" style="max-width: 600px;">
    <div class="modal-header">
      <h2>Escanear QR Code</h2>
      <button class="close-btn close-scan-btn">&times;</button>
    </div>
    <div class="modal-body">
      <div id="scanner-container" style="text-align: center;">
        <video id="qr-video" width="100%" height="300" style="border: 2px solid var(--primary-color); border-radius: 8px; background: #000;"></video>
        <div id="scan-result" style="margin: 15px 0; font-weight: bold; min-height: 24px;">Aguardando inicialização da câmera...</div>
        <canvas id="qr-canvas" style="display: none;"></canvas>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" id="cancel-scan-btn">Cancelar</button>
    </div>
  </div>
</div>
`;

document.body.appendChild(qrScannerModal.firstElementChild);

// Variáveis do scanner
const videoElement = document.getElementById("qr-video");
const scanResultElement = document.getElementById("scan-result");
const canvasElement = document.getElementById("qr-canvas");
const context = canvasElement.getContext("2d");
let qrStream = null;
let isScanning = false;

// Cache de locais
let locaisCache = [];

// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================

function getAuthHeaders(includeContentType = false) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Sessão expirada ou usuário não logado.");
    window.location.href = "../Login/LoginProfessor.html";
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

async function handleResponseError(response) {
  if (response.status === 401 || response.status === 403) {
    alert("Acesso negado. Sua sessão pode ter expirado. Faça login novamente.");
    window.location.href = "../LoginProf/LoginProf.html";
    throw new Error("Acesso não autorizado (401/403).");
  }

  const errorText = await response.text();
  throw new Error(
    `Erro na requisição: ${errorText} (Status: ${response.status})`
  );
}

// ==================== FUNÇÕES PRINCIPAIS ====================

function showNotification(message, isSuccess = true) {
  notification.textContent = message;
  notification.className = `notification ${isSuccess ? "success" : "error"}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function showLoading(show) {
  loadingOverlay.style.display = show ? "flex" : "none";
}

function setupQRCodeField() {
  const qrCodeField = document.getElementById("tool-qrcode");
  if (qrCodeField && !document.getElementById("start-scan-btn")) {
    const qrContainer = qrCodeField.parentElement;

    if (qrContainer && qrContainer.className.includes("form-group")) {
      qrContainer.innerHTML = `
            <label for="tool-qrcode">QR Code</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" id="tool-qrcode" class="form-control" style="flex: 1;" />
                <button type="button" id="start-scan-btn" class="btn" style="white-space: nowrap;">
                    <i class="fas fa-camera"></i> Escanear
                </button>
            </div>
        `;
      qrContainer
        .querySelector("#start-scan-btn")
        .addEventListener("click", openQRScanner);
    }
  }
}

async function fetchToolDataByQRCode(qrCode) {
  try {
    showLoading(true);

    const response = await fetch(`${Ferramenta_GET_BY_QRCODE}/${qrCode}`);

    if (response.status === 404) {
      showNotification(
        "Ferramenta não encontrada. Preencha os dados para cadastrar.",
        false
      );

      toolId.value = "";
      toolName.value = "";
      toolBrand.value = "";
      toolModel.value = "";
      toolEstado.value = "";
      toolDisponibilidade.checked = true;
      toolDescricao.value = "";
      toolIdLocal.value = "";

      modalTitle.textContent = "Cadastrar Nova Ferramenta";
      toolName.focus();
    } else if (response.ok) {
      const ferramenta = await response.json();

      toolId.value = ferramenta.id;
      toolName.value = ferramenta.nome;
      toolBrand.value = ferramenta.marca;
      toolModel.value = ferramenta.modelo;
      toolEstado.value = ferramenta.estado;
      toolDisponibilidade.checked = ferramenta.disponibilidade;
      toolDescricao.value = ferramenta.descricao || "";
      toolIdLocal.value = ferramenta.id_local;

      modalTitle.textContent = "Editar Ferramenta";
      showNotification("Dados da ferramenta carregados automaticamente!", true);
    } else {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Erro ao buscar dados da ferramenta:", error);
    showNotification(
      `Erro ao carregar dados da ferramenta: ${error.message}`,
      false
    );
  } finally {
    showLoading(false);
  }
}

async function initializeQRScanner() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Câmera não suportada neste dispositivo");
    }

    scanResultElement.textContent = "Solicitando permissão da câmera...";

    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    qrStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = qrStream;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement
          .play()
          .then(resolve)
          .catch((error) => {
            console.error("Erro ao reproduzir vídeo:", error);
            resolve();
          });
      };
    });

    scanResultElement.textContent = "Câmera ativa. Procurando QR Code...";
    scanResultElement.style.color = "var(--primary-color)";

    startAutoScan();
  } catch (error) {
    console.error("Erro ao acessar câmera:", error);

    if (
      error.name === "OverconstrainedError" ||
      error.name === "ConstraintNotSatisfiedError"
    ) {
      try {
        scanResultElement.textContent = "Tentando configuração alternativa...";
        qrStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoElement.srcObject = qrStream;
        await videoElement.play();
        startAutoScan();
        return;
      } catch (fallbackError) {
        console.error("Configuração alternativa também falhou:", fallbackError);
      }
    }

    scanResultElement.textContent = "Erro: " + error.message;
    scanResultElement.style.color = "var(--accent-color)";
  }
}

function startAutoScan() {
  if (isScanning) return;

  isScanning = true;
  let scanAttempts = 0;

  const scanFrame = async () => {
    if (
      !isScanning ||
      !videoElement.videoWidth ||
      videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA
    ) {
      if (isScanning) {
        setTimeout(scanFrame, 500);
      }
      return;
    }

    try {
      scanAttempts++;

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      canvasElement.toBlob(async (blob) => {
        if (!blob || !isScanning) return;

        try {
          const formData = new FormData();
          formData.append("image", blob, "qrcode.png");

          console.log(
            `Tentativa ${scanAttempts}: Enviando imagem para escaneamento...`
          );

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(QR_SCAN_API, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(
              `Erro HTTP ${response.status}: ${await response.text()}`
            );
          }

          const result = await response.json();
          console.log("Resposta do backend:", result);

          if (result.success && result.qrCode) {
            const qrCodeValue = result.qrCode;
            document.getElementById("tool-qrcode").value = qrCodeValue;

            await fetchToolDataByQRCode(qrCodeValue);

            showNotification("QR Code escaneado com sucesso!", true);
            closeQRScanner();
          } else if (scanAttempts % 5 === 0) {
            scanResultElement.textContent =
              result.error || "Procurando QR Code...";
          }
        } catch (error) {
          console.error("Erro ao escanear QR Code:", error);
          if (scanAttempts % 5 === 0) {
            if (error.name === "AbortError") {
              scanResultElement.textContent = "Timeout: Servidor não respondeu";
            } else {
              scanResultElement.textContent = "Erro de conexão com o servidor";
            }
            scanResultElement.style.color = "var(--accent-color)";
          }
        }
      }, "image/png");
    } catch (error) {
      console.error("Erro na captura:", error);
    }

    if (isScanning) {
      setTimeout(scanFrame, 1000);
    }
  };

  scanFrame();
}

function openQRScanner() {
  const modal = document.getElementById("qr-scanner-modal");
  modal.style.display = "flex";
  scanResultElement.textContent = "Iniciando câmera...";
  scanResultElement.style.color = "inherit";

  if (qrStream) {
    qrStream.getTracks().forEach((track) => track.stop());
    qrStream = null;
  }
  videoElement.srcObject = null;

  initializeQRScanner();
}

function closeQRScanner() {
  const modal = document.getElementById("qr-scanner-modal");
  modal.style.display = "none";

  isScanning = false;

  if (qrStream) {
    qrStream.getTracks().forEach((track) => track.stop());
    qrStream = null;
  }
  videoElement.srcObject = null;
}

// ==================== CORREÇÃO DOS EVENT LISTENERS ====================

function setupScannerEventListeners() {
  // Botão de fechar (X) do modal do scanner
  const closeScanBtn = document.querySelector(".close-scan-btn");
  if (closeScanBtn) {
    closeScanBtn.addEventListener("click", closeQRScanner);
  }

  // Botão de cancelar do modal do scanner
  const cancelScanBtn = document.getElementById("cancel-scan-btn");
  if (cancelScanBtn) {
    cancelScanBtn.addEventListener("click", closeQRScanner);
  }

  // Fechar modal do scanner ao clicar fora
  const scannerModal = document.getElementById("qr-scanner-modal");
  if (scannerModal) {
    scannerModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeQRScanner();
      }
    });
  }
}

async function loadLocais() {
  try {
    toolIdLocal.innerHTML =
      '<option value="">Carregando locais... <span class="loading"></span></option>';

    const response = await fetch(locais_get, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) await handleResponseError(response);

    const locais = await response.json();
    locaisCache = locais;
    return locais;
  } catch (error) {
    console.error("Erro ao carregar locais:", error);
    toolIdLocal.innerHTML = '<option value="">Erro ao carregar locais</option>';
    if (!error.message.includes("Token")) {
      showNotification("Erro ao carregar locais", false);
    }
    return [];
  }
}

function fillLocaisSelect() {
  toolIdLocal.innerHTML = '<option value="">Selecione um local...</option>';
  locaisCache.forEach((local) => {
    const option = document.createElement("option");
    option.value = local.id;
    option.textContent = local.nomeEspaco || `Local ID ${local.id}`;
    toolIdLocal.appendChild(option);
  });
}

async function loadFerramentas() {
  try {
    const response = await fetch(Ferramenta_GET, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) await handleResponseError(response);

    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar ferramentas:", error);
    if (!error.message.includes("Token")) {
      showNotification("Erro ao carregar ferramentas", false);
    }
    return [];
  }
}

function createToolCard(ferramenta, nomeLocal) {
  const card = document.createElement("div");
  card.className = "tool-card";

  card.innerHTML = `
        <div class="card-header">
          <div class="card-title">${ferramenta.nome}</div>
          <div class="card-badge">ID: ${ferramenta.id}</div>
        </div>
        
        <div class="card-details">
          <div class="card-detail">
            <span class="detail-label">Marca:</span>
            <span class="detail-value">${ferramenta.marca}</span>
          </div>
          
          <div class="card-detail">
            <span class="detail-label">Modelo:</span>
            <span class="detail-value">${ferramenta.modelo}</span>
          </div>
          
          <div class="card-detail">
            <span class="detail-label">QR Code:</span>
            <span class="detail-value">${ferramenta.qrcode || "N/A"}</span>
          </div>
          
          <div class="card-detail">
            <span class="detail-label">Estado:</span>
            <span class="detail-value">${ferramenta.estado}</span>
          </div>
          
          <div class="card-detail">
            <span class="detail-label">Disponível:</span>
            <span class="detail-value ${
              ferramenta.disponibilidade
                ? "status-available"
                : "status-unavailable"
            }">
              ${ferramenta.disponibilidade ? "Sim" : "Não"}
            </span>
          </div>
          
          <div class="card-detail">
            <span class="detail-label">Local:</span>
            <span class="detail-value">${nomeLocal}</span>
          </div>
          
          <div class="card-detail" style="grid-column: span 2;">
            <span class="detail-label">Descrição:</span>
            <span class="detail-value">
              ${
                ferramenta.descricao
                  ? ferramenta.descricao.substring(0, 50) +
                    (ferramenta.descricao.length > 50 ? "..." : "")
                  : "N/A"
              }
            </span>
          </div>
        </div>
        
        <div class="card-actions">
          <button class="btn-action btn-edit" data-id="${ferramenta.id}">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-action btn-delete" data-id="${ferramenta.id}">
            <i class="fas fa-trash-alt"></i> Excluir
          </button>
        </div>
      `;

  return card;
}

async function loadToolsTable() {
  showLoading(true);

  try {
    const ferramentas = await loadFerramentas();
    toolsTableBody.innerHTML = "";
    toolsCards.innerHTML = "";

    if (ferramentas.length === 0) {
      const emptyHtml = `
            <td colspan="10" style="text-align: center; padding: 30px;">
              <i class="fas fa-info-circle" style="font-size: 3rem; color: #6c757d; margin-bottom: 15px;"></i>
              <p>Nenhuma ferramenta cadastrada</p>
            </td>
          `;
      toolsTableBody.innerHTML = `<tr>${emptyHtml}</tr>`;

      toolsCards.innerHTML = `
            <div class="tool-card" style="text-align: center; padding: 30px;">
              ${emptyHtml.replace(/<td[^>]*>|<\/td>/g, "")} 
            </div>
          `;
      return;
    }

    ferramentas.forEach((ferramenta) => {
      const nomeLocal =
        ferramenta.nomeLocal ||
        locaisCache.find((l) => l.id == ferramenta.id_local)?.nomeEspaco ||
        "N/A";

      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${ferramenta.id}</td>
            <td>${ferramenta.nome}</td>
            <td>${ferramenta.marca}</td>
            <td>${ferramenta.modelo}</td>
            <td>${ferramenta.qrcode || "N/A"}</td>
            <td>${ferramenta.estado}</td>
            <td class="${
              ferramenta.disponibilidade
                ? "status-available"
                : "status-unavailable"
            }">
              ${ferramenta.disponibilidade ? "Sim" : "Não"}
            </td>
            <td>${
              ferramenta.descricao
                ? ferramenta.descricao.substring(0, 20) +
                  (ferramenta.descricao.length > 20 ? "..." : "")
                : "N/A"
            }</td>
            <td>${nomeLocal}</td> 
            <td class="actions">
              <button class="btn-action btn-edit" data-id="${ferramenta.id}">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-action btn-delete" data-id="${ferramenta.id}">
                <i class="fas fa-trash-alt"></i> Excluir
              </button>
            </td>
          `;
      toolsTableBody.appendChild(row);

      const card = createToolCard(ferramenta, nomeLocal);
      toolsCards.appendChild(card);
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        openEditToolModal(id);
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        deleteTool(id);
      });
    });

    document.querySelectorAll(".card-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        openEditToolModal(id);
      });
    });

    document.querySelectorAll(".card-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        deleteTool(id);
      });
    });
  } catch (error) {
    console.error("Erro ao carregar ferramentas:", error);
  } finally {
    showLoading(false);
  }
}

function searchTools() {
  const searchTerm = searchInput.value.toLowerCase();

  const rows = toolsTableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });

  const cards = toolsCards.querySelectorAll(".tool-card");
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

async function openAddToolModal() {
  toolForm.reset();
  toolId.value = "";
  toolDisponibilidade.checked = true;
  modalTitle.textContent = "Adicionar Nova Ferramenta";
  toolModal.style.display = "flex";

  setupQRCodeField();
  fillLocaisSelect();
}

async function openEditToolModal(id) {
  try {
    showLoading(true);
    const response = await fetch(`${Ferramenta_GET}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) await handleResponseError(response);

    const ferramenta = await response.json();

    setupQRCodeField();
    fillLocaisSelect();

    toolId.value = ferramenta.id;
    toolName.value = ferramenta.nome;
    toolBrand.value = ferramenta.marca;
    toolModel.value = ferramenta.modelo;
    document.getElementById("tool-qrcode").value = ferramenta.qrcode || "";
    toolEstado.value = ferramenta.estado;
    toolDisponibilidade.checked = ferramenta.disponibilidade;
    toolDescricao.value = ferramenta.descricao || "";
    toolIdLocal.value = ferramenta.id_local;

    modalTitle.textContent = "Editar Ferramenta";
    toolModal.style.display = "flex";
  } catch (error) {
    console.error("Erro ao carregar ferramenta:", error);
    if (!error.message.includes("Token")) {
      showNotification(
        "Não foi possível carregar os dados da ferramenta",
        false
      );
    }
  } finally {
    showLoading(false);
  }
}

function closeModal() {
  toolModal.style.display = "none";
}

async function saveTool() {
  if (
    !toolName.value ||
    !toolBrand.value ||
    !toolModel.value ||
    !toolEstado.value ||
    !toolIdLocal.value
  ) {
    showNotification("Preencha todos os campos obrigatórios!", false);
    return;
  }

  const qrcodeValue = document.getElementById("tool-qrcode").value;

  const toolData = {
    nome: toolName.value,
    marca: toolBrand.value,
    modelo: toolModel.value,
    qrcode: qrcodeValue,
    estado: toolEstado.value,
    disponibilidade: toolDisponibilidade.checked,
    descricao: toolDescricao.value || null,
    id_local: toolIdLocal.value,
  };

  try {
    showLoading(true);
    let response;
    const method = toolId.value ? "PUT" : "POST";
    const url = toolId.value
      ? `${Ferramenta_PUT}/${toolId.value}`
      : Ferramenta_POST;

    response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(true),
      body: JSON.stringify(toolData),
    });

    if (!response.ok) await handleResponseError(response);

    showNotification(
      toolId.value
        ? "Ferramenta atualizada com sucesso!"
        : "Ferramenta cadastrada com sucesso!",
      true
    );
    await loadToolsTable();
    closeModal();
  } catch (error) {
    console.error("Erro ao salvar ferramenta:", error);
    if (!error.message.includes("Token")) {
      showNotification(`Erro ao salvar ferramenta: ${error.message}`, false);
    }
  } finally {
    showLoading(false);
  }
}

async function deleteTool(id) {
  if (confirm("Tem certeza que deseja excluir esta ferramenta?")) {
    try {
      showLoading(true);
      const response = await fetch(`${Ferramenta_DELETE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) await handleResponseError(response);

      showNotification("Ferramenta excluída com sucesso!", true);
      await loadToolsTable();
    } catch (error) {
      console.error("Erro ao excluir ferramenta:", error);
      if (!error.message.includes("Token")) {
        showNotification(
          `Não foi possível excluir a ferramenta: ${error.message}`,
          false
        );
      }
    } finally {
      showLoading(false);
    }
  }
}

// ==================== EVENT LISTENERS PRINCIPAIS ====================

addToolBtn.addEventListener("click", openAddToolModal);
saveBtn.addEventListener("click", saveTool);
cancelBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
searchInput.addEventListener("input", searchTools);

window.addEventListener("click", (e) => {
  if (e.target === toolModal) {
    closeModal();
  }
});

// ==================== INICIALIZAÇÃO ====================

document.addEventListener("DOMContentLoaded", async function () {
  // Configuração do tema dark mode
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
      if (prefereEscuro) {
        aplicarTema("dark");
      } else {
        aplicarTema("light");
      }
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

  // Configuração inicial do sistema
  showLoading(true);
  try {
    // CONFIGURAR OS EVENT LISTENERS DO SCANNER PRIMEIRO
    setupScannerEventListeners();

    setupQRCodeField();
    await loadLocais();
    fillLocaisSelect();
    await loadToolsTable();
  } catch (error) {
    console.error("Erro na inicialização:", error);
    if (!error.message.includes("Token")) {
      showNotification("Erro ao carregar dados iniciais", false);
    }
  } finally {
    showLoading(false);
  }
});
