const API_BASE = "https://faceshield-back.onrender.com/usuarios";
const API_GET = `${API_BASE}/buscar`;
const API_POST = `${API_BASE}/novoUsuario`;
const API_PUT = `${API_BASE}/editar`;
const API_DELETE = `${API_BASE}/deletar`;

function getAuthHeaders(includeContentType = false) {
  const token = localStorage.getItem("authToken");
  const usuario = localStorage.getItem("username");
  const id = localStorage.getItem("id");
  //console.log("Token recuperado:", token);
  //console.log(`Username do Token: ${usuario}`);
  // console.log(`ID do Token: ${id}`);
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

async function handleResponseError(response) {
  if (response.status === 401 || response.status === 403) {
    alert("Acesso negado. Sua sessão pode ter expirado. Faça login novamente.");
    window.location.href = "/front/Html/Login.html";
    throw new Error("Acesso não autorizado (401/403).");
  }

  const errorText = await response.text();
  throw new Error(
    `Erro na requisição: ${errorText} (Status: ${response.status})`
  );
}

const alunoService = {
  getAll: async function () {
    try {
      const response = await fetch(API_GET, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
      return [];
    }
  },

  getById: async function (id) {
    try {
      const response = await fetch(`${API_GET}/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
      return null;
    }
  },

  save: async function (aluno) {
    try {
      const url = aluno.id ? `${API_PUT}/${aluno.id}` : API_POST;
      const method = aluno.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(aluno),
      });

      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
      return null;
    }
  },

  delete: async function (id) {
    try {
      const response = await fetch(`${API_DELETE}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) await handleResponseError(response);
      return true;
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
      return false;
    }
  },

  search: async function (term) {
    try {
      const response = await fetch(`${API_GET}?search=${term}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
      return [];
    }
  },
};
let allStudents = [];

function closeModal() {
  document.getElementById("student-modal").style.display = "none";
}

function editStudent(id) {
  openEditStudentModal(id);
}

// === FUNÇÃO saveStudent ATUALIZADA ===
async function saveStudent() {
  const studentId = document.getElementById("student-id").value;
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const studentClass = document.getElementById("class").value;
  // Lendo o valor do novo campo <select>
  const tipoUsuario = document.getElementById("user-type").value;

  // Validando todos os campos, incluindo o novo tipoUsuario
  if (!firstName || !lastName || !studentClass || !tipoUsuario) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  const aluno = {
    id: studentId ? parseInt(studentId) : null,
    nome: firstName,
    sobrenome: lastName,
    turma: studentClass,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    // Passando o valor selecionado (ALUNO ou PROFESSOR)
    tipoUsuario: tipoUsuario,
  };

  try {
    await alunoService.save(aluno);
    loadStudentsTable();
    closeModal();
    alert("Usuário salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
}

async function deleteStudent(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    const success = await alunoService.delete(id);
    if (success) {
      loadStudentsTable();
    }
  }
}

function searchStudents() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();

  if (searchTerm === "") {
    loadStudentsTable();
    return;
  }

  const filteredStudents = allStudents.filter(
    (student) =>
      (student.nome && student.nome.toLowerCase().includes(searchTerm)) ||
      (student.sobrenome &&
        student.sobrenome.toLowerCase().includes(searchTerm)) ||
      (student.turma && student.turma.toLowerCase().includes(searchTerm)) ||
      (student.tipoUsuario &&
        student.tipoUsuario.toLowerCase().includes(searchTerm)) ||
      (student.id && student.id.toString().includes(searchTerm))
  );
  loadStudentsTable(filteredStudents);
}

async function loadStudentsTable(studentsArray = null) {
  const tableBody = document.getElementById("students-table-body");
  tableBody.innerHTML = "";

  try {
    const students = studentsArray || (await alunoService.getAll());

    if (!studentsArray) {
      allStudents = students;
    }

    if (students.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6">Nenhum usuário encontrado.</td></tr>';
      return;
    }

    students.forEach((student) => {
      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.nome}</td>
            <td>${student.sobrenome}</td>
            <td>${student.turma}</td>
            <td>${student.tipoUsuario === "ALUNO" ? "Aluno" : "Professor"}</td>
            <td class="actions">
              <button class="btn-action btn-edit" onclick="editStudent(${
                student.id
              })">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn-action btn-delete" onclick="deleteStudent(${
                student.id
              })">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </td>
          `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

// === FUNÇÃO openEditStudentModal ATUALIZADA ===
async function openEditStudentModal(id) {
  try {
    const student = await alunoService.getById(id);
    if (student) {
      document.getElementById("student-id").value = student.id;
      document.getElementById("first-name").value = student.nome;
      document.getElementById("last-name").value = student.sobrenome;
      // Preenche o campo de input "turma"
      document.getElementById("class").value = student.turma;
      // Seleciona a opção correta (ALUNO ou PROFESSOR) no <select>
      document.getElementById("user-type").value = student.tipoUsuario;

      document.getElementById("modal-title").textContent = "Editar Usuário";
      document.getElementById("student-modal").style.display = "flex";
    }
  } catch (error) {
    console.error("Erro ao abrir modal de edição:", error);
  }
}

// === CÓDIGO DO DARK MODE ADICIONADO AQUI ===
document.addEventListener("DOMContentLoaded", function () {
  // 1. Carrega a tabela (seu código existente)
  loadStudentsTable();

  // 2. LÓGICA NOVA DO DARK MODE
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const body = document.body;

  // Verifica se o botão existe antes de adicionar o ícone
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
});
