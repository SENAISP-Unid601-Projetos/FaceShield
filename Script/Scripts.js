
// Inicialização AOS
AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
});

// Dicionários de tradução
const translations = {
    'pt-BR': {
        'menu.home': 'Início',
        'menu.benefits': 'Benefícios',
        'menu.about': 'Sobre Nós',
        'menu.tech': 'Tecnologia',
        'menu.contact': 'Contato',
        'language': 'PT',
        'hero.title': 'Revolução em Autenticação Biométrica',
        'hero.subtitle': 'Sistema inteligente de reconhecimento facial com criptografia de última geração para segurança máxima',
        'hero.button': 'Solicitar Demonstração',
        'benefits.title': 'Soluções Inteligentes para Segurança Avançada',
        'benefits.subtitle': 'Nossa tecnologia de biometria facial oferece benefícios exclusivos para empresas que valorizam segurança e eficiência',
        'benefits.card1.title': 'Segurança Máxima',
        'benefits.card1.desc': 'Proteja seus sistemas com tecnologia de ponta',
        'benefits.card1.item1': 'Autenticação facial precisa e confiável',
        'benefits.card1.item2': 'Prevenção contra fraudes e acessos não autorizados',
        'benefits.card1.item3': 'Criptografia de dados em tempo real',
        'benefits.card2.title': 'Eficiência Operacional',
        'benefits.card2.desc': 'Agilize processos com autenticação rápida',
        'benefits.card2.item1': 'Redução de tempo em processos de verificação',
        'benefits.card2.item2': 'Automação de controles de acesso',
        'benefits.card2.item3': 'Integração simplificada com sistemas existentes',
        'benefits.card3.title': 'Resultados Comprovados',
        'benefits.card3.desc': 'Maximize o retorno sobre seu investimento',
        'benefits.card3.item1': 'Redução de custos com segurança',
        'benefits.card3.item2': 'Aumento da produtividade da equipe',
        'benefits.card3.item3': 'Aumento de Organização durante o trabalho remoto',
        'about.title': 'Sobre Nós',
        'about.text': 'Estamos desenvolvendo uma solução inovadora que utiliza biometria facial para aumentar a segurança e eficiência no monitoramento de ferramentas. Nosso objetivo é criar um sistema confiável e intuitivo, integrando tecnologia de reconhecimento facial e sensores para um controle preciso e automatizado.',
        'tech.title': 'Tecnologia',
        'tech.intro': 'Nossa solução utiliza tecnologias avançadas para garantir segurança e eficiência no reconhecimento facial. Entre os principais recursos, destacamos:',
        'tech.feature1.title': 'Reconhecimento 3D anti-fraude',
        'tech.feature1.desc': 'para evitar tentativas de falsificação.',
        'tech.feature2.title': 'Criptografia avançada',
        'tech.feature2.desc': 'para proteção de dados com máxima segurança.',
        'tech.feature3.title': 'Processamento em tempo real',
        'tech.feature3.desc': 'para respostas rápidas e precisas.',
        'contact.title': 'Contato',
        'contact.text': 'Entre em contato conosco através do GitHub para mais informações sobre nossas soluções em biometria facial.',
        'contact.github': 'Solicitar Orçamento',
        'footer.developed': 'Desenvolvido Por FaceShield - Tecnologia em Biometria Facial',
        'footer.github': 'GitHub',
        'footer.email': 'LinkedIn',
        'footer.rights': 'Todos os direitos reservados.'
    },
    'en-US': {
        'menu.home': 'Home',
        'menu.benefits': 'Benefits',
        'menu.about': 'About Us',
        'menu.tech': 'Technology',
        'menu.contact': 'Contact',
        'language': 'EN',
        'hero.title': 'Revolution in Biometric Authentication',
        'hero.subtitle': 'Intelligent facial recognition system with state-of-the-art encryption for maximum security',
        'hero.button': 'Request a Demo',
        'benefits.title': 'Smart Solutions for Advanced Security',
        'benefits.subtitle': 'Our facial biometric technology offers exclusive benefits for companies that value security and efficiency',
        'benefits.card1.title': 'Maximum Security',
        'benefits.card1.desc': 'Protect your systems with cutting-edge technology',
        'benefits.card1.item1': 'Accurate and reliable facial authentication',
        'benefits.card1.item2': 'Prevention against fraud and unauthorized access',
        'benefits.card1.item3': 'Real-time data encryption',
        'benefits.card2.title': 'Operational Efficiency',
        'benefits.card2.desc': 'Streamline processes with fast authentication',
        'benefits.card2.item1': 'Reduced time in verification processes',
        'benefits.card2.item2': 'Automation of access controls',
        'benefits.card2.item3': 'Simplified integration with existing systems',
        'benefits.card3.title': 'Proven Results',
        'benefits.card3.desc': 'Maximize your return on investment',
        'benefits.card3.item1': 'Reduced security costs',
        'benefits.card3.item2': 'Increased team productivity',
        'benefits.card3.item3': 'Increase in Organization during Remote Work',
        'about.title': 'About Us',
        'about.text': 'We are developing an innovative solution that uses facial biometrics to enhance security and efficiency in tool monitoring. Our goal is to create a reliable and intuitive system, integrating facial recognition technology and sensors for precise and automated control.',
        'tech.title': 'Technology',
        'tech.intro': 'Our solution uses advanced technologies to ensure security and efficiency in facial recognition. Among the main features, we highlight:',
        'tech.feature1.title': '3D anti-fraud recognition',
        'tech.feature1.desc': 'to prevent spoofing attempts.',
        'tech.feature2.title': 'Advanced encryption',
        'tech.feature2.desc': 'for data protection with maximum security.',
        'tech.feature3.title': 'Real-time processing',
        'tech.feature3.desc': 'for fast and accurate responses.',
        'contact.title': 'Contact',
        'contact.text': 'Contact us through GitHub for more information about our facial biometric solutions.',
        'contact.github': 'Request Quote',
        'footer.developed': 'Developed By FaceShield - Facial Biometrics Technology',
        'footer.github': 'GitHub',
        'footer.email': 'LinkedIn',
        'footer.rights': 'All rights reserved.'
    }
};

// Função para trocar idioma
function changeLanguage(lang) {
    document.documentElement.lang = lang;

    // Atualizar todos os elementos com atributo data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Atualizar bandeira e texto do idioma
    const flagIcon = document.getElementById('flagIcon');
    const languageText = document.getElementById('languageText');

    if (lang === 'en-US') {
        flagIcon.src = 'https://flagcdn.com/w40/us.png';
        flagIcon.alt = 'English';
    } else {
        flagIcon.src = 'https://flagcdn.com/w40/br.png';
        flagIcon.alt = 'Português';
    }

    // Salvar preferência de idioma
    localStorage.setItem('preferredLanguage', lang);
}

// Configurar evento de clique no seletor de idioma
document.getElementById('languageSelector').addEventListener('click', function () {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'pt-BR' ? 'en-US' : 'pt-BR';
    changeLanguage(newLang);
});

// Verificar se há uma preferência de idioma salva
const savedLanguage = localStorage.getItem('preferredLanguage');
if (savedLanguage) {
    changeLanguage(savedLanguage);
}

// Menu Mobile
const menuButton = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

// Abrir/fechar menu
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Fechar menu ao clicar no overlay
navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
});

// Fechar menu ao clicar nos links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth Scroll e Ativação de Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        const headerHeight = document.querySelector('.header').offsetHeight;

        // Scroll suave
        window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: 'smooth'
        });

        // Ativar link clicado
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
    });
});

// Atualizar links ativos no scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);

    // Verificar posição das seções
    const sections = document.querySelectorAll('.content-section, .hero, .benefits');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
