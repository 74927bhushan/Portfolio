/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — APPLE FLUID ENGINE & INTERACTION LOGIC
 * Liquid Water Ripples | 3D Specular Tilt | Smooth Spring Physics
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initFluidWaterCanvas();
    initNavbar();
    initCardTiltAndSpecular();
    initActiveNavHighlight();
    initScrollAnimations();
});

/* ==========================================================================
   1. INTERACTIVE LIQUID WATER CANVAS SIMULATION
   Creates silky water ripples and fluid light trails that react to mouse/touch.
   ========================================================================== */
function initFluidWaterCanvas() {
    const canvas = document.getElementById('fluid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ripple collection
    const ripples = [];
    const MAX_RIPPLES = 45;

    // Pointer state with velocity
    let lastX = width / 2;
    let lastY = height / 2;
    let isMoving = false;
    let moveTimeout;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });

    class Ripple {
        constructor(x, y, strength = 1) {
            this.x = x;
            this.y = y;
            this.radius = 2;
            this.maxRadius = Math.min(140 * strength, 260);
            this.alpha = 0.45 * Math.min(strength, 1.2);
            this.growth = 2.4 + strength * 1.8;
            this.decay = 0.007 + (1 - Math.min(strength, 1)) * 0.005;
            this.hue = 195 + Math.random() * 30; // Cyan to soft sapphire (195-225)
        }

        update() {
            this.radius += this.growth;
            this.growth *= 0.985; // Natural fluid wave damping
            this.alpha -= this.decay;
        }

        draw(ctx) {
            if (this.alpha <= 0.01) return;

            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            // Water ripple refraction gradient
            const grad = ctx.createRadialGradient(
                this.x, this.y, Math.max(0, this.radius - 12),
                this.x, this.y, this.radius
            );
            grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
            grad.addColorStop(0.7, `hsla(${this.hue}, 90%, 65%, ${this.alpha * 0.6})`);
            grad.addColorStop(1, `hsla(${this.hue + 10}, 100%, 75%, ${this.alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = Math.max(1.2, (1 - this.radius / this.maxRadius) * 2.8);
            ctx.stroke();

            // Inner subtle specular fluid core
            if (this.radius < 50) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 90%, 80%, ${this.alpha * 0.12})`;
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function addRipple(x, y, strength = 1) {
        if (ripples.length >= MAX_RIPPLES) {
            ripples.shift();
        }
        ripples.push(new Ripple(x, y, strength));
    }

    // Pointer move listener (Desktop & Mobile)
    function onPointerMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - lastX;
        const dy = clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Emit ripple if distance threshold reached
        if (dist > 14) {
            const velocity = Math.min(dist / 14, 2.2);
            addRipple(clientX, clientY, velocity);
            lastX = clientX;
            lastY = clientY;
        }

        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 120);
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('click', (e) => {
        addRipple(e.clientX, e.clientY, 2.0);
    }, { passive: true });

    // Ambient background liquid wave generator (gentle periodic fluid drop)
    let ambientCounter = 0;
    function triggerAmbientRipple() {
        ambientCounter++;
        if (ambientCounter % 140 === 0 && !isMoving && ripples.length < 8) {
            const rx = Math.random() * width;
            const ry = Math.random() * height * 0.8 + height * 0.1;
            addRipple(rx, ry, 0.8 + Math.random() * 0.5);
        }
    }

    // Main 60fps render loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        triggerAmbientRipple();

        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.update();
            r.draw(ctx);
            if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
                ripples.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. NAVBAR & MOBILE DRAWER LOGIC
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll state with threshold
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileDrawer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileDrawer.classList.toggle('open');
        });

        // Close mobile drawer on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileDrawer.classList.remove('open');
            });
        });
    }

    // Smooth scroll for nav links (avoid intercepting resume.html)
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = targetId === '#home' ? 0 : targetEl.offsetTop - 85;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   3. 3D CARD PARALLAX TILT & SPECULAR CURSOR TRACKING
   Tracks cursor coordinates across Apple cards for specular light highlight.
   ========================================================================== */
function initCardTiltAndSpecular() {
    // 3D Tilt for Hero Console Card
    const heroCard = document.getElementById('hero-tilt-card');
    if (heroCard && window.matchMedia('(min-width: 992px)').matches) {
        const wrapper = heroCard.closest('.hero-visual-col');

        if (wrapper) {
            let targetRotX = 0;
            let targetRotY = 0;
            let currentRotX = 0;
            let currentRotY = 0;

            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Subtle Apple spring angle (max ±9 degrees)
                targetRotY = (x / (rect.width / 2)) * 8;
                targetRotX = -(y / (rect.height / 2)) * 8;
            });

            wrapper.addEventListener('mouseleave', () => {
                targetRotX = 0;
                targetRotY = 0;
            });

            function smoothTiltLoop() {
                currentRotX += (targetRotX - currentRotX) * 0.08;
                currentRotY += (targetRotY - currentRotY) * 0.08;

                heroCard.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
                requestAnimationFrame(smoothTiltLoop);
            }
            smoothTiltLoop();
        }
    }

    // Specular Cursor Tracking on Glass Panels
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   4. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
   ========================================================================== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 140;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER FOR FLUID REVEALS
   ========================================================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.bento-card, .skill-bento-card, .timeline-entry, .showcase-card, .edu-card, .contact-bento'
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
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}
