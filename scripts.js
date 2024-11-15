// Adicionar ao início do scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Implementar animações quando elementos entrarem na viewport
const observerOptions = {
    threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
});

// Menu mobile toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Criar overlay se não existir
let menuOverlay = document.querySelector('.menu-overlay');
if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    body.appendChild(menuOverlay);
}

// Função para toggle do menu
function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Event listeners
mobileMenuBtn.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Fechar menu e rolar suavemente para a seção ao clicar em um link
document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Fecha o menu mobile se estiver aberto
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }

            // Calcula a posição considerando o header fixo
            const headerOffset = document.querySelector('.navbar').offsetHeight;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            // Rola suavemente até a seção
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    });
});

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// Atualizar navegação ativa com base na posição da rolagem
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Atualizar link ativo durante a rolagem
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);
// Botão voltar ao topo
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});

// Validação do formulário de contato
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação básica
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;

    if (!name || !email || !message) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }

    // Simulação de envio
    showNotification('Mensagem enviada com sucesso!', 'success');
    contactForm.reset();
});

// Sistema de notificações
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Toggle modo claro/escuro
const darkModeToggle = document.createElement('button');
darkModeToggle.classList.add('dark-mode-toggle');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    // Atualiza o ícone
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    // Salva a preferência
    localStorage.setItem(
        'theme',
        document.body.classList.contains('light-mode') ? 'light' : 'dark'
    );
});

// Verifica preferência salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Verifica preferência do sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (!savedTheme && prefersDarkScheme.matches) {
    document.body.classList.remove('light-mode');
} else if (!savedTheme) {
    document.body.classList.add('light-mode');
    darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Listener para mudanças na preferência do sistema
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.body.classList.remove('light-mode');
            darkModeToggle
                .querySelector('i')
                .classList.replace('fa-sun', 'fa-moon');
        } else {
            document.body.classList.add('light-mode');
            darkModeToggle
                .querySelector('i')
                .classList.replace('fa-moon', 'fa-sun');
        }
    }
});

// Efeito parallax no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Filtros do portfólio
const filterButtons = document.querySelectorAll('.portfolio-filter button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        portfolioItems.forEach((item) => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contador de números
const counters = document.querySelectorAll('.counter');

const countUp = (counter) => {
    const target = +counter.dataset.target;
    const count = +counter.innerText;
    const increment = target / 200;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => countUp(counter), 1);
    } else {
        counter.innerText = target;
    }
};

// Iniciar contagem quando elemento estiver visível
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            countUp(entry.target);
        }
    });
});

counters.forEach((counter) => counterObserver.observe(counter));
