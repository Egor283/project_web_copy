// script.js - Космические анимации для миссии на Марс

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initStars();
    initMeteors();
    initRoverAnimation();
    initHoverEffects();
    initProgressBars();
    initJobCards();
    initGlitchEffect();
});

// Инициализация звездного неба с параллаксом
function initStars() {
    const stars = document.querySelector('.stars');
    if (!stars) return;

    let starsHTML = '';
    for (let i = 0; i < 200; i++) {
        const size = Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 3 + Math.random() * 7;
        const delay = Math.random() * 5;

        starsHTML += `<div class="star" style="
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            animation: twinkle ${duration}s ease-in-out ${delay}s infinite;
        "></div>`;
    }

    stars.innerHTML = starsHTML;

    // Параллакс эффект при движении мыши
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const speed = 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Инициализация метеоритного дождя
function initMeteors() {
    const meteorShower = document.querySelector('.meteor-shower');
    if (!meteorShower) return;

    setInterval(() => {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';

        const startX = Math.random() * 100;
        const duration = 1 + Math.random() * 2;
        const size = 2 + Math.random() * 3;

        meteor.style.cssText = `
            left: ${startX}%;
            top: -10px;
            width: ${size}px;
            height: ${size * 3}px;
            animation: meteorFall ${duration}s linear forwards;
        `;

        meteorShower.appendChild(meteor);

        setTimeout(() => {
            meteor.remove();
        }, duration * 1000);
    }, 300);
}

// Анимация марсохода
function initRoverAnimation() {
    const rover = document.querySelector('.mars-rover');
    if (!rover) return;

    let position = -100;
    let direction = 1;

    function animateRover() {
        position += direction * 2;

        if (position > window.innerWidth + 100) {
            position = -100;
        }

        if (rover) {
            rover.style.transform = `translateX(${position}px) ${direction > 0 ? 'scaleX(1)' : 'scaleX(-1)'}`;
        }

        requestAnimationFrame(animateRover);
    }

    animateRover();

    // Меняем направление при клике
    rover.addEventListener('click', function() {
        direction *= -1;
        createParticles(rover, 10);
    });
}

// Эффекты наведения для карточек
function initHoverEffects() {
    const cards = document.querySelectorAll('.job-card, .info-card, .auth-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            createRipple(e, this);
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Создание ripple эффекта
function createRipple(event, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size/2}px;
        top: ${event.clientY - rect.top - size/2}px;
        animation: ripple 1s ease-out forwards;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// Создание частиц
function createParticles(element, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const angle = (Math.PI * 2 * i) / count;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ff6b35;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: particle 1s ease-out forwards;
            --vx: ${vx};
            --vy: ${vy};
        `;

        element.style.position = 'relative';
        element.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Анимация прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.transition = 'width 2s ease-in-out';
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Анимация появления карточек
function initJobCards() {
    const cards = document.querySelectorAll('.job-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Анимация строк таблицы
                const rows = entry.target.querySelectorAll('.data-row');
                rows.forEach((row, index) => {
                    row.style.animation = `slideIn 0.5s ease ${index * 0.1}s forwards`;
                });
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Глитч эффект для заголовков
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(element => {
        const text = element.textContent;
        const glitchText = element.getAttribute('data-text') || text;

        setInterval(() => {
            if (Math.random() < 0.1) {
                element.style.animation = 'none';
                element.offsetHeight;
                element.style.animation = 'glitch 0.3s infinite';

                setTimeout(() => {
                    element.style.animation = 'glitch 3s infinite';
                }, 300);
            }
        }, 3000);
    });
}

// Класс для управления состоянием миссий
class MissionController {
    constructor() {
        this.jobs = document.querySelectorAll('.job-card');
        this.init();
    }

    init() {
        this.updateStats();
        this.initFilters();
    }

    updateStats() {
        const totalJobs = this.jobs.length;
        const completedJobs = document.querySelectorAll('[data-finished="true"]').length;
        const progress = totalJobs ? (completedJobs / totalJobs) * 100 : 0;

        // Обновляем статистику с анимацией
        this.animateNumber('.info-card:first-child h4', completedJobs, totalJobs);
    }

    animateNumber(selector, current, total) {
        const element = document.querySelector(selector);
        if (!element) return;

        let start = 0;
        const end = total;
        const duration = 2000;
        const step = end / (duration / 16);

        function update() {
            start += step;
            if (start < end) {
                element.textContent = `Миссий: ${Math.round(start)}/${total}`;
                requestAnimationFrame(update);
            } else {
                element.textContent = `Миссий: ${total}`;
            }
        }

        update();
    }

    initFilters() {
        // Добавляем фильтры для миссий (можно расширить)
        const filterContainer = document.createElement('div');
        filterContainer.className = 'mission-filters';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">Все миссии</button>
            <button class="filter-btn" data-filter="active">Активные</button>
            <button class="filter-btn" data-filter="completed">Завершенные</button>
        `;

        const header = document.querySelector('.page-header');
        if (header) {
            header.appendChild(filterContainer);

            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    this.filterMissions(e.target.dataset.filter);
                }
            });
        }
    }

    filterMissions(filter) {
        this.jobs.forEach(job => {
            const isFinished = job.querySelector('[data-finished]')?.dataset.finished === 'true';

            switch(filter) {
                case 'all':
                    job.style.display = 'block';
                    break;
                case 'active':
                    job.style.display = isFinished ? 'none' : 'block';
                    break;
                case 'completed':
                    job.style.display = isFinished ? 'block' : 'none';
                    break;
            }
        });
    }
}

// Инициализация контроллера миссий
const missionController = new MissionController();

// Добавляем новые анимации в CSS через JS (для динамических эффектов)
const style = document.createElement('style');
style.textContent = `
    @keyframes meteorFall {
        0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 1;
        }
        100% {
            transform: translate(100vw, 100vh) rotate(45deg);
            opacity: 0;
        }
    }

    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.5;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes particle {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--vx) * 20px), calc(-50% + var(--vy) * 20px)) scale(0);
            opacity: 0;
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .meteor {
        position: fixed;
        background: linear-gradient(45deg, #ff6b35, #ffd700);
        border-radius: 50% 0 0 50%;
        filter: blur(2px);
        box-shadow: 0 0 20px #ff6b35;
        z-index: 1000;
        pointer-events: none;
    }

    .star {
        position: fixed;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
    }

    .mission-progress {
        margin-top: 1rem;
        padding: 0.5rem;
    }

    .progress-bar {
        height: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff6b35, #ffd700);
        border-radius: 5px;
        transition: width 2s ease-in-out;
        position: relative;
        overflow: hidden;
    }

    .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    .progress-text {
        color: var(--text-gray);
        font-size: 0.9rem;
    }

    .mission-filters {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .filter-btn {
        padding: 0.5rem 1rem;
        background: rgba(255, 107, 53, 0.1);
        border: 2px solid var(--border-glow);
        border-radius: 50px;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 700;
    }

    .filter-btn:hover,
    .filter-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 5px 20px var(--shadow-color);
    }

    .footer-links {
        margin-top: 1rem;
    }

    .footer-link {
        color: var(--text-gray);
        text-decoration: none;
        transition: all 0.3s ease;
        padding: 0.3rem 0.8rem;
    }

    .footer-link:hover {
        color: var(--primary-color);
        text-shadow: 0 0 10px var(--shadow-color);
    }

    .footer-separator {
        color: var(--text-gray);
        opacity: 0.3;
    }

    .job-status-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        margin-left: 1rem;
        animation: pulse 2s infinite;
    }

    [data-finished="true"] {
        background: var(--success-color);
        box-shadow: 0 0 10px var(--success-color);
    }

    [data-finished="false"] {
        background: var(--warning-color);
        box-shadow: 0 0 10px var(--warning-color);
    }
`;

document.head.appendChild(style);