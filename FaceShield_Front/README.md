# **FaceShield - Sistema de Controle de Empréstimos com Reconhecimento Facial**

O **FaceShield** é um sistema completo de **gerenciamento de empréstimos de ferramentas**, desenvolvido para uso em **oficinas educacionais e técnicas**.  
Ele utiliza **reconhecimento facial** e **leitura de QR Code** para validar usuários e registrar automaticamente os empréstimos, garantindo **segurança**, **automação** e **rastreabilidade total**.

---

## **Funcionalidades Principais**

- **Reconhecimento facial** para autenticação segura dos alunos.
- **Leitura de QR Code** das ferramentas para registro automático dos empréstimos.
- **CRUD completo** (Criar, Ler, Atualizar e Deletar) de:
  - **Usuários**
  - **Ferramentas**
  - **Locais**
  - **Estados**
  - **Empréstimos**
- **Buscas detalhadas** por ferramentas disponíveis, localização/estado e histórico de empréstimos.
- **Registro completo de cada empréstimo**, incluindo:
  - **Usuário responsável**
  - **Datas de retirada e devolução**
  - **Dados da ferramenta**
  - **Local de armazenamento**

---

## **Estrutura do Projeto**

```text

├── Assets/
│   ├── EscritoFS_preto.jpg
│   ├── ImagemRecon.png
│   └── LogoFaceShield.png
│
├── Html/
│   ├── Cadastro.html
│   ├── Emprestimos.html
│   ├── Ferramentas.html
│   ├── Local.html
│   ├── Login.html
│   ├── LoginProfessor.html
│   ├── Menu.html
│   ├── PostEmp.html
│   └── Usuarios.html
│
├── Scripts/
│   ├── Cadastro.js
│   ├── Emprestimos.js
│   ├── Ferramentas.js
│   ├── Index.js
│   ├── Local.js
│   ├── Login.js
│   ├── LoginProfessor.js
│   ├── PostEmp.js
│   └── Usuarios.js
│
└── Style/
    ├── Cadastro.css
    ├── Emprestimos.css
    ├── Ferramentas.css
    ├── Index.css
    └── Local.css
---
```

## **Descrição das Pastas**

- **Assets/** → Contém as imagens e ícones do sistema (como logo e imagens de reconhecimento facial).
- **Html/** → Páginas estruturais da interface do usuário.
- **Scripts/** → Arquivos JavaScript responsáveis pela interação no front-end.
- **Style/** → Arquivos CSS responsáveis pelos estilos e layout das páginas.

---

## **Páginas do Sistema**

| **Página**              | **Função**                                            |
| ----------------------- | ----------------------------------------------------- |
| **Login.html**          | Autenticação dos alunos via reconhecimento facial.    |
| **LoginProfessor.html** | Acesso administrativo para professores.               |
| **Cadastro.html**       | Cadastro de novos usuários ou ferramentas.            |
| **Emprestimos.html**    | Gerenciamento e exibição dos empréstimos realizados.  |
| **Ferramentas.html**    | Lista e controle de ferramentas disponíveis.          |
| **Local.html**          | Controle dos locais de armazenamento das ferramentas. |
| **Menu.html**           | Menu principal de navegação.                          |
| **PostEmp.html**        | Registro detalhado de empréstimos.                    |
| **Usuarios.html**       | Gerenciamento dos usuários cadastrados.               |

---

## **Tecnologias Utilizadas**

### **Front-End**

- **HTML5** → Estrutura e páginas do sistema.
- **CSS3** → Estilo e layout responsivo.
- **JavaScript (ES6+)** → Interação e manipulação dinâmica no front-end.

### **Reconhecimento Facial e QR Code**

- **Python** → Implementação dos módulos de reconhecimento facial e leitura de QR Code.

### **Back-End**

- **Java (Spring Boot)** → API responsável pela comunicação entre o front-end, Python e o banco de dados.

### **Banco de Dados**

- **PostgreSQL** → Armazenamento de usuários, ferramentas, locais, estados e registros de empréstimos.

---

## **Desenvolvido por**

**FaceShield** — _Soluções inteligentes para controle, automação e segurança em oficinas._
