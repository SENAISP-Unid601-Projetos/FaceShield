// Inicialização AOS
AOS.init({
  duration: 1000,
  once: true,
  easing: "ease-in-out",
});

// Dicionários de tradução
const translations = {
  "pt-BR": {
    "menu.home": "Início",
    "menu.features": "O Sistema",
    "menu.about": "Quem Somos",
    "menu.tech": "Tecnologia",
    "menu.contact": "Contato",
    language: "PT",

    // Hero Section
    "hero.title": "Gestão de Ferramentas com Reconhecimento Facial",
    "hero.subtitle":
      "Controle total de empréstimos, validação de usuários e rastreabilidade de ativos em um único sistema.",
    "hero.list1": "Empréstimos Validados por Biometria",
    "hero.list2": "Histórico Completo de Uso",
    "hero.list3": "Gestão de Estoque e Locais",
    "hero.button": "Ver Demonstração",

    // Features/Benefícios
    "features.title": "O Que o FaceShield Resolve?",
    "features.subtitle":
      "Elimine planilhas e perdas. Nosso sistema oferece gerenciamento completo (CRUD) e inteligência de dados.",

    "features.card1.title": "Gerenciamento Total (CRUD)",
    "features.card1.desc": "Controle absoluto sobre seus ativos.",
    "features.card1.item1": "Cadastro completo de Usuários e Ferramentas",
    "features.card1.item2": "Gestão de Locais (Armazéns/Setores)",
    "features.card1.item3": "Definição de Estados (Novo, Em uso, Manutenção)",

    "features.card2.title": "Empréstimo Inteligente",
    "features.card2.desc": "Segurança na retirada e devolução.",
    "features.card2.item1": "Validação facial obrigatória",
    "features.card2.item2": "Busca detalhada de ferramentas disponíveis",
    "features.card2.item3": "Processo rápido e sem senhas",

    "features.card3.title": "Histórico e Rastreio",
    "features.card3.desc": "Saiba quem pegou, quando e onde.",
    "features.card3.item1": "Histórico completo de empréstimos",
    "features.card3.item2": "Filtros por Localização e Estado",
    "features.card3.item3": "Auditoria simplificada de equipamentos",

    // About/Equipe
    "about.title": "Quem Somos Nós",
    "about.text":
      "A TechFlow é uma startup dedicada a resolver o caos na gestão de ativos. Desenvolvemos o FaceShield, uma solução robusta que une IoT e Software para garantir que você nunca mais perca uma ferramenta.",
    "role.pm": "Gerente de Projetos",
    "role.iot": "Engenheiro de IoT",
    "role.front": "Dev Front-end",
    "role.back": "Dev Back-end",

    // Tech
    "tech.title": "Tecnologia & Arquitetura",
    "tech.intro":
      "Nosso sistema backend suporta operações complexas em tempo real, garantindo:",
    "tech.feature1.title": "Reconhecimento Facial:",
    "tech.feature1.desc": "Validação biométrica para liberar empréstimos.",
    "tech.feature2.title": "Busca Inteligente:",
    "tech.feature2.desc": "Filtros por estado, localização e disponibilidade.",
    "tech.feature3.title": "Gestão de Dados:",
    "tech.feature3.desc": "Complete CRUD for users, tools, and locations.",

    "contact.title": "Contato",
    "contact.text": "Entre em contato conosco.",
    "footer.developed":
      "Desenvolvido Por TechFlow - Soluções em Gestão de Ativos",
    "footer.github": "GitHub",
    "footer.email": "LinkedIn",
    "footer.rights": "Todos os direitos reservados.",

    // Créditos do Desenvolvedor (NOVO)
    "footer.credits":
      "Desenvolvido por <strong>Kauã Henrique Frenedozo</strong>",
  },
  "en-US": {
    "menu.home": "Home",
    "menu.features": "System",
    "menu.about": "Who We Are",
    "menu.tech": "Technology",
    "menu.contact": "Contact",
    language: "EN",

    // Hero Section
    "hero.title": "Tool Management with Facial Recognition",
    "hero.subtitle":
      "Complete loan control, user validation, and asset traceability in a single system.",
    "hero.list1": "Biometrically Validated Loans",
    "hero.list2": "Complete Usage History",
    "hero.list3": "Inventory and Location Management",
    "hero.button": "View Demo",

    // Features/Benefits
    "features.title": "What Does FaceShield Solve?",
    "features.subtitle":
      "Eliminate spreadsheets and losses. Our system offers complete management (CRUD) and data intelligence.",

    "features.card1.title": "Total Management (CRUD)",
    "features.card1.desc": "Absolute control over your assets.",
    "features.card1.item1": "Complete User and Tool Registration",
    "features.card1.item2": "Location Management (Warehouses/Sectors)",
    "features.card1.item3": "State Definition (New, In Use, Maintenance)",

    "features.card2.title": "Smart Lending",
    "features.card2.desc": "Security in withdrawal and return.",
    "features.card2.item1": "Mandatory facial validation",
    "features.card2.item2": "Detailed search for available tools",
    "features.card2.item3": "Fast and password-free process",

    "features.card3.title": "History & Tracking",
    "features.card3.desc": "Know who took what, when, and where.",
    "features.card3.item1": "Complete loan history",
    "features.card3.item2": "Filters by Location and State",
    "features.card3.item3": "Simplified equipment auditing",

    // About/Team
    "about.title": "Who We Are",
    "about.text":
      "TechFlow is a startup dedicated to solving chaos in asset management. We develop FaceShield, a robust solution combining IoT and Software to ensure you never lose a tool again.",
    "role.pm": "Project Manager",
    "role.iot": "IoT Engineer",
    "role.front": "Front-end Dev",
    "role.back": "Back-end Dev",

    // Tech
    "tech.title": "Technology & Architecture",
    "tech.intro":
      "Our backend system supports complex real-time operations, ensuring:",
    "tech.feature1.title": "Facial Recognition:",
    "tech.feature1.desc": "Biometric validation to release loans.",
    "tech.feature2.title": "Smart Search:",
    "tech.feature2.desc": "Filters by state, location, and availability.",
    "tech.feature3.title": "Data Management:",
    "tech.feature3.desc": "Complete CRUD for users, tools, and locations.",

    "contact.title": "Contact",
    "contact.text": "Contact us.",
    "footer.developed": "Developed By TechFlow - Asset Management Solutions",
    "footer.github": "GitHub",
    "footer.email": "LinkedIn",
    "footer.rights": "All rights reserved.",

    // Developer Credits (NEW)
    "footer.credits": "Developed by <strong>Kauã Henrique Frenedozo</strong>",
  },
};

// Função para trocar idioma
function changeLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Atualizar bandeira e texto do idioma
  const flagIcon = document.getElementById("flagIcon");
 
  if (lang === "en-US") {
    flagIcon.src = "https://flagcdn.com/w40/us.png";
    flagIcon.alt = "English";
  } else {
    flagIcon.src = "https://flagcdn.com/w40/br.png";
    flagIcon.alt = "Português";
  }

  // Salvar preferência de idioma
  localStorage.setItem("preferredLanguage", lang);
}

// Configurar evento de clique no seletor de idioma
const langSelector = document.getElementById("languageSelector");
if (langSelector) {
  langSelector.addEventListener("click", function () {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === "pt-BR" ? "en-US" : "pt-BR";
    changeLanguage(newLang);
  });
}

// Verificar se há uma preferência de idioma salva
const savedLanguage = localStorage.getItem("preferredLanguage");
if (savedLanguage) {
  changeLanguage(savedLanguage);
}

// Menu Mobile
const menuButton = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");
const navOverlay = document.querySelector(".nav-overlay");

if (menuButton && navLinks && navOverlay) {
  // Abrir/fechar menu
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Fechar menu ao clicar no overlay
  navOverlay.addEventListener("click", () => {
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Fechar menu ao clicar nos links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

// Smooth Scroll e Ativação de Links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    if (targetId && targetId !== "#") {
      const target = document.querySelector(targetId);
      const header = document.querySelector(".header");
      const headerHeight = header ? header.offsetHeight : 0;

      if (target) {
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: "smooth",
        });
      }
    }

    document
      .querySelectorAll(".nav-link")
      .forEach((nav) => nav.classList.remove("active"));
    link.classList.add("active");
  });
});

// Atualizar links ativos no scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  const sections = document.querySelectorAll(
    ".content-section, .hero, .benefits"
  );
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
