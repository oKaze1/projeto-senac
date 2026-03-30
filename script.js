document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const heroSection = document.querySelector('.hero-section');
    const bgVideo = document.getElementById('bg-video');
    const revealElements = document.querySelectorAll('.reveal');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const navOverlay = document.querySelector('.nav-overlay');
    const siteHeader = document.querySelector('.site-header');
    const metricCards = document.querySelectorAll('.metric-card strong[data-target]');
    const heroMetrics = document.querySelector('.hero-metrics');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach((element) => revealObserver.observe(element));

    const toggleMenu = (open) => {
        if (!mainNav || !navOverlay || !menuToggle) {
            return;
        }

        const isOpen = open ?? !mainNav.classList.contains('open');
        mainNav.classList.toggle('open', isOpen);
        navOverlay.classList.toggle('active', isOpen);
        body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    if (menuToggle && mainNav && navOverlay) {
        menuToggle.addEventListener('click', () => toggleMenu());
        navOverlay.addEventListener('click', () => toggleMenu(false));

        navLinks.forEach((link) => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mainNav.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    const countUp = (element) => {
        const target = parseFloat(element.dataset.target);
        if (Number.isNaN(target)) {
            return;
        }

        const isDecimal = String(target).includes('.');
        const duration = 900;
        const steps = 45;
        let current = 0;
        const increment = target / steps;

        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(interval);
                element.textContent = isDecimal ? target.toFixed(1) : String(target);
                return;
            }

            element.textContent = isDecimal ? current.toFixed(1) : String(Math.round(current));
        }, duration / steps);

        setTimeout(() => {
            clearInterval(interval);
            element.textContent = isDecimal ? target.toFixed(1) : String(target);
        }, duration + 50);
    };

    if (heroMetrics && metricCards.length > 0 && !prefersReducedMotion) {
        const metricsObserver = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                metricCards.forEach(countUp);
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.35 });

        metricsObserver.observe(heroMetrics);
    } else if (metricCards.length > 0) {
        metricCards.forEach((element) => {
            const target = parseFloat(element.dataset.target);
            if (!Number.isNaN(target)) {
                element.textContent = String(target);
            }
        });
    }

    window.addEventListener('scroll', () => {
        const offset = window.scrollY;

        if (siteHeader) {
            siteHeader.classList.toggle('scrolled', offset > 40);
        }

        if (prefersReducedMotion) {
            return;
        }

        if (heroSection) {
            heroSection.style.transform = `translateY(${offset * 0.008}px)`;
        }

        if (bgVideo) {
            bgVideo.style.transform = `translateY(${offset * 0.012}px)`;
        }
    });
});
