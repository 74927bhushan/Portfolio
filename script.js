/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — TRANSLATE-WF SCROLL ANIMATION ENGINE
 * Segmented Progress Bar Fill | Timeline Tracer | Interactive Scene Prompts
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initSegmentedProgressBar();
    initTimelineTracer();
    initNavbarAndSmoothScroll();
    initScrollObserverReveals();
});

/* ==========================================================================
   1. SEGMENTED SCROLL PROGRESS BAR (translate-wf.com signature)
   Fills each progress segment line proportionally and pulses ping nodes.
   ========================================================================== */
function initSegmentedProgressBar() {
    const scenes = [
        { id: '#imagine', ping: document.getElementById('ping-1'), fill: document.getElementById('fill-1') },
        { id: '#impact', ping: document.getElementById('ping-2'), fill: document.getElementById('fill-2') },
        { id: '#architecture', ping: document.getElementById('ping-3'), fill: document.getElementById('fill-3') },
        { id: '#experience', ping: document.getElementById('ping-4'), fill: document.getElementById('fill-4') },
        { id: '#work', ping: document.getElementById('ping-5'), fill: document.getElementById('fill-5') },
        { id: '#connect', ping: document.getElementById('ping-6'), fill: null }
    ];

    function updateProgress() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;

        scenes.forEach((scene, index) => {
            const el = document.querySelector(scene.id);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const top = rect.top + scrollY;
            const height = el.offsetHeight;

            // Calculate progress through this section
            let progress = (scrollY + windowHeight * 0.35 - top) / height;
            progress = Math.max(0, Math.min(1, progress));

            // Fill line if present
            if (scene.fill) {
                scene.fill.style.width = `${(progress * 100).toFixed(1)}%`;
            }

            // Activate ping dot
            if (scene.ping) {
                if (progress > 0.05 || (index === 0 && scrollY < height * 0.5)) {
                    scene.ping.classList.add('active');
                } else {
                    scene.ping.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Clicking progress bar segment scrolls to that chapter
    const progressParts = document.querySelectorAll('.progress-bar-part');
    progressParts.forEach(part => {
        part.addEventListener('click', () => {
            const targetId = part.getAttribute('data-target');
            if (targetId) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const offset = targetId === '#imagine' ? 0 : targetEl.offsetTop - 85;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ==========================================================================
   2. TIMELINE SCROLL TRACER FILL
   Fills the vertical timeline glowing line based on scroll progress.
   ========================================================================== */
function initTimelineTracer() {
    const timeline = document.querySelector('.tracer-timeline');
    const fill = document.getElementById('timelineTracerFill');
    if (!timeline || !fill) return;

    function updateTracer() {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight * 0.6 - rect.top) / rect.height;
            const clamped = Math.max(0, Math.min(1, progress));
            fill.style.height = `${(clamped * 100).toFixed(1)}%`;
        }
    }

    window.addEventListener('scroll', updateTracer, { passive: true });
    updateTracer();
}

/* ==========================================================================
   3. NAVIGATION, MOBILE DRAWER & SMOOTH SCROLLING
   ========================================================================== */
function initNavbarAndSmoothScroll() {
    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-item');
    const navItems = document.querySelectorAll('.nav-item');

    // Scrolled state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Intercept internal anchor links (ignore resume.html)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                const offset = href === '#imagine' ? 0 : targetEl.offsetTop - 85;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav item highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 140;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/* ==========================================================================
   4. SCROLL OBSERVER REVEALS (Cinematic entrance)
   ========================================================================== */
function initScrollObserverReveals() {
    const animatedElements = document.querySelectorAll(
        '.stat-card, .wf-card, .tracer-entry, .project-showcase-card, .connect-box'
    );

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}
