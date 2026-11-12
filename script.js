/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — SENIOR STAFF FULL STACK & UI CRAFTSMAN ENGINE
 * System Boot Preloader • 7-Segment Fluid Progress • Dual Engine Terminal
 * Specular Mouse Light Tracking • 3D Card Tilt • Copy Telemetry Toast
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initSegmentedChapterNav();
    initDualEngineTerminal();
    initSpecularAndTilt();
    initCounterAnimations();
    initCopyButtons();
    initSmoothScroll();
});

/* ==========================================================================
   1. CINEMATIC BOOT PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('preloading');

    const counter = document.getElementById('preloaderCounter');
    const fill = document.getElementById('preloaderFill');
    const statusText = document.getElementById('preloaderStatusText');

    const statusStages = [
        { at: 15, msg: 'Initializing hardware acceleration & WebGL compositor...' },
        { at: 35, msg: 'Mounting .NET 8 Enterprise runtime & Entity Framework...' },
        { at: 60, msg: 'Starting Java 21 Spring Boot microservices & JPA...' },
        { at: 85, msg: 'Hydrating React 19 concurrent renderer & glass shaders...' },
        { at: 100, msg: 'All systems operational. Telemetry link established.' }
    ];

    let currentVal = 0;
    const startTime = performance.now();
    const duration = 1400; // 1.4s smooth cinematic boot

    function step(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        currentVal = Math.floor(ease * 100);

        if (counter) counter.textContent = currentVal < 10 ? `0${currentVal}` : `${currentVal}`;
        if (fill) fill.style.width = `${currentVal}%`;

        // Update status text dynamically
        for (let i = statusStages.length - 1; i >= 0; i--) {
            if (currentVal >= statusStages[i].at) {
                if (statusText && statusText.textContent !== statusStages[i].msg) {
                    statusText.textContent = statusStages[i].msg;
                }
                break;
            }
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setTimeout(dismissPreloader, 200);
        }
    }

    requestAnimationFrame(step);

    function dismissPreloader() {
        if (!preloader || preloader.classList.contains('fade-out')) return;
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloading');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }

    // Skip on click or keypress
    preloader.addEventListener('click', dismissPreloader);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === ' ') dismissPreloader();
    });
}

/* ==========================================================================
   2. 7-SEGMENT CHAPTER PROGRESS BAR (TRANSLATE-WF FLUID ENGINE)
   ========================================================================== */
function initSegmentedChapterNav() {
    const chapters = [
        { id: '#genesis', segment: document.querySelector('.chapter-segment[data-chapter="1"]'), fill: document.getElementById('fill-1') },
        { id: '#dual-engine', segment: document.querySelector('.chapter-segment[data-chapter="2"]'), fill: document.getElementById('fill-2') },
        { id: '#matrix', segment: document.querySelector('.chapter-segment[data-chapter="3"]'), fill: document.getElementById('fill-3') },
        { id: '#chronicles', segment: document.querySelector('.chapter-segment[data-chapter="4"]'), fill: document.getElementById('fill-4') },
        { id: '#artifacts', segment: document.querySelector('.chapter-segment[data-chapter="5"]'), fill: document.getElementById('fill-5') },
        { id: '#protocol', segment: document.querySelector('.chapter-segment[data-chapter="6"]'), fill: document.getElementById('fill-6') },
        { id: '#transmission', segment: document.querySelector('.chapter-segment[data-chapter="7"]'), fill: document.getElementById('fill-7') }
    ];

    function updateChapterProgress() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        let activeFound = false;

        chapters.forEach((ch, index) => {
            const el = document.querySelector(ch.id);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const top = rect.top + scrollY;
            const height = el.offsetHeight;

            // Progress within this chapter
            let progress = (scrollY + windowHeight * 0.35 - top) / height;
            progress = Math.max(0, Math.min(1, progress));

            if (ch.fill) {
                ch.fill.style.width = `${(progress * 100).toFixed(1)}%`;
            }

            // Determine active chapter segment
            const isInView = rect.top <= windowHeight * 0.45 && rect.bottom >= windowHeight * 0.25;

            if (isInView && !activeFound) {
                document.querySelectorAll('.chapter-segment').forEach(s => s.classList.remove('active'));
                if (ch.segment) ch.segment.classList.add('active');
                activeFound = true;
            }
        });

        // Default to genesis if at the very top
        if (scrollY < 200 && chapters[0].segment) {
            document.querySelectorAll('.chapter-segment').forEach(s => s.classList.remove('active'));
            chapters[0].segment.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateChapterProgress, { passive: true });
    updateChapterProgress();
}

/* ==========================================================================
   3. INTERACTIVE DUAL ENGINE TERMINAL SWITCHER
   ========================================================================== */
function initDualEngineTerminal() {
    const tabs = document.querySelectorAll('.engine-tab');
    const panes = document.querySelectorAll('.engine-pane');
    if (!tabs.length || !panes.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const engine = tab.getAttribute('data-engine');
            if (!engine) return;

            // Activate tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Activate corresponding pane
            panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${engine}`) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

/* ==========================================================================
   4. SPECULAR MOUSE LIGHT TRACKING & 3D CARD TILT
   ========================================================================== */
function initSpecularAndTilt() {
    const cards = document.querySelectorAll('.glass-card, .glass-panel, [data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mouse coordinates for radial specular highlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Subtle 3D perspective tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==========================================================================
   5. NUMBER COUNTER ANIMATIONS
   ========================================================================== */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target')) || 0;
                animateNumber(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    function animateNumber(element, target) {
        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            current = Math.floor(ease * target);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }
}

/* ==========================================================================
   6. COPY TO CLIPBOARD TELEMETRY TOAST
   ========================================================================== */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy]');
    const toastContainer = document.getElementById('toastContainer');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied to clipboard: ${textToCopy}`);
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                }, 2000);
            }).catch(() => {
                showToast('Unable to copy directly', 'error');
            });
        });
    });

    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}

/* ==========================================================================
   7. SMOOTH SCROLL ANCHORS
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}
