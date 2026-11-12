/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — NOIR EDITORIAL ENGINE (JASPREETSINGH.XYZ STYLE)
 * Signature Preloader • Minimalist Kinetic Nebula • Cosmic Sky & Stars Parallax
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initHomeLoader();
    initKineticNebulaCanvas();
    initCosmicSkyCanvas();
    initScrollParallax();
    initCopyActions();
    initNavbarScroll();
    initSmoothScroll();
});

/* ==========================================================================
   1. SIGNATURE HOME LOADER (JASPREETSINGH.XYZ STYLE)
   ========================================================================== */
function initHomeLoader() {
    const loader = document.getElementById('loading');
    if (!loader) return;

    document.body.classList.add('is-loading');

    const fill = document.getElementById('loaderFill');
    const count = document.getElementById('loaderCount');

    let current = 0;
    const duration = 1200; // 1.2s smooth loader
    const startTime = performance.now();

    function updateLoader(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic ease out
        const ease = 1 - Math.pow(1 - progress, 2.5);
        current = Math.floor(ease * 100);

        if (fill) fill.style.transform = `scaleX(${progress})`;
        if (count) count.textContent = `${current}%`;

        if (progress < 1) {
            requestAnimationFrame(updateLoader);
        } else {
            const barWrap = loader.querySelector('.loader-bar-wrap');
            if (barWrap) barWrap.classList.add('bar-fade');
            setTimeout(completeLoader, 300);
        }
    }

    requestAnimationFrame(updateLoader);

    function completeLoader() {
        if (!loader || loader.classList.contains('loader-complete')) return;
        loader.classList.add('loader-complete');
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');

        setTimeout(() => {
            loader.style.display = 'none';
        }, 700);
    }

    // Allow user to click to dismiss immediately
    loader.addEventListener('click', completeLoader);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === ' ') completeLoader();
    });
}

/* ==========================================================================
   2. MINIMALIST KINETIC NEBULA CANVAS
   Floating stardust particles connecting into constellations with cursor gravity
   ========================================================================== */
function initKineticNebulaCanvas() {
    const canvas = document.getElementById('nebulaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];

    // Interactive mouse coordinates and click pulse
    const mouse = { x: -1000, y: -1000, isOver: false, radius: 160 };
    let clickPulse = null;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.isOver = false;
        mouse.x = -1000;
        mouse.y = -1000;
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        clickPulse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            radius: 0,
            maxRadius: 220,
            alpha: 0.8
        };
    });

    function resize() {
        const parent = canvas.parentElement;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        generateParticles();
    }

    function generateParticles() {
        particles = [];
        // Scale count with screen real estate
        const count = Math.min(Math.floor((width * height) / 9500), 125);

        const colors = [
            '#f5f0eb', // Warm sand
            '#f5f0eb', // Warm sand (predominant)
            '#38bdf8', // Starlight cyan
            '#a855f7', // Nebula violet
            '#e05344'  // Coral accent
        ];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: 1.2 + Math.random() * 1.8,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.35 + Math.random() * 0.6,
                twinkleSpeed: 0.8 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();

    function render(currentTime) {
        const time = (currentTime - startTime) * 0.001;
        ctx.clearRect(0, 0, width, height);

        // 1. Soft Ambient Nebula Light Glows in Background
        const ambientGrad = ctx.createRadialGradient(width * 0.75, height * 0.45, 10, width * 0.75, height * 0.45, width * 0.65);
        ambientGrad.addColorStop(0.0, 'rgba(168, 85, 247, 0.08)');
        ambientGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.04)');
        ambientGrad.addColorStop(0.8, 'rgba(224, 83, 68, 0.02)');
        ambientGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ambientGrad;
        ctx.fillRect(0, 0, width, height);

        // Update and Render Click Shockwave Pulse
        if (clickPulse) {
            clickPulse.radius += 5;
            clickPulse.alpha *= 0.95;

            ctx.strokeStyle = `rgba(56, 189, 248, ${clickPulse.alpha * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(clickPulse.x, clickPulse.y, clickPulse.radius, 0, Math.PI * 2);
            ctx.stroke();

            if (clickPulse.radius > clickPulse.maxRadius || clickPulse.alpha < 0.05) {
                clickPulse = null;
            }
        }

        // 2. Update & Move Particles
        const maxDist = 135;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Apply gentle velocity
            p.x += p.vx;
            p.y += p.vy;

            // Soft screen boundary bounce
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Interactive Cursor Gravity Well
            if (mouse.isOver) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (1 - dist / mouse.radius) * 0.035;
                    p.vx += dx * force;
                    p.vy += dy * force;

                    // Draw connecting constellation thread to cursor
                    const cursorAlpha = (1 - dist / mouse.radius) * 0.35;
                    ctx.strokeStyle = `rgba(245, 240, 235, ${cursorAlpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Click shockwave push
            if (clickPulse) {
                const cdx = p.x - clickPulse.x;
                const cdy = p.y - clickPulse.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                if (Math.abs(cdist - clickPulse.radius) < 35) {
                    const push = 1.8;
                    p.vx += (cdx / (cdist || 1)) * push;
                    p.vy += (cdy / (cdist || 1)) * push;
                }
            }

            // Velocity damping
            p.vx *= 0.985;
            p.vy *= 0.985;

            // 3. Constellation Proximity Links between nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const lineAlpha = (1 - dist / maxDist) * 0.16;

                    ctx.strokeStyle = `rgba(245, 240, 235, ${lineAlpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // 4. Draw Stardust Node
            const twinkle = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.phase);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha * twinkle;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Subtle glowing halo for larger nodes
            if (p.radius > 2.0) {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = (p.alpha * twinkle) * 0.25;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

/* ==========================================================================
   3. COSMIC SKY & PARALLAX STARS CANVAS (PANNING UPWARDS ON SCROLL)
   ========================================================================== */
function initCosmicSkyCanvas() {
    const canvas = document.getElementById('skyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let stars = [];
    let meteors = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        generateStars();
    }

    function generateStars() {
        stars = [];
        const starCount = Math.floor((width * height) / 3200); // ~400 stars on desktop

        const colors = [
            '#ffffff',               // Pure white
            '#f5f0eb',               // Warm sand
            '#e2e8f0',               // Cool silver
            '#bae6fd',               // Starlight blue
            '#fde68a'                // Warm starlight amber
        ];

        for (let i = 0; i < starCount; i++) {
            const layer = Math.random();
            let radius, speed, depth;

            if (layer < 0.6) {
                // Distant stars
                radius = 0.6 + Math.random() * 0.6;
                speed = 0.08;
                depth = 1;
            } else if (layer < 0.9) {
                // Mid stars
                radius = 1.2 + Math.random() * 0.8;
                speed = 0.16;
                depth = 2;
            } else {
                // Bright constellation stars
                radius = 2.0 + Math.random() * 0.8;
                speed = 0.25;
                depth = 3;
            }

            stars.push({
                x: Math.random() * width,
                baseY: Math.random() * height * 1.5 - height * 0.2, // Taller canvas virtual range
                radius: radius,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 0.5 + Math.random() * 2,
                twinklePhase: Math.random() * Math.PI * 2,
                speed: speed,
                hasSpike: depth === 3 && Math.random() > 0.5
            });
        }
    }

    // Shooting star (meteor) spawner
    function spawnMeteor() {
        if (meteors.length < 2 && Math.random() < 0.3) {
            meteors.push({
                x: Math.random() * width * 0.8,
                y: Math.random() * height * 0.4,
                length: 70 + Math.random() * 60,
                speed: 12 + Math.random() * 10,
                angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3,
                opacity: 1,
                life: 1
            });
        }
    }

    setInterval(spawnMeteor, 3800);

    window.addEventListener('resize', resize);
    resize();

    let lastTime = performance.now();

    function render(currentTime) {
        const time = currentTime * 0.001;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        ctx.clearRect(0, 0, width, height);

        // Background depth: Deep obsidian cosmic canvas
        const skyDarkness = Math.min(scrollY / 300, 1);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.85 + skyDarkness * 0.15})`;
        ctx.fillRect(0, 0, width, height);

        // Draw Stars with Parallax
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            // Parallax offset
            const scrollOffset = (scrollY * s.speed);
            const currentY = (s.baseY + scrollOffset) % (height + 40);

            // Twinkle calculation
            const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
            const currentAlpha = s.alpha * (0.4 + 0.6 * twinkle);

            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;

            ctx.beginPath();
            ctx.arc(s.x, currentY, s.radius, 0, Math.PI * 2);
            ctx.fill();

            // Subtle cross diffraction spike for bright stars
            if (s.hasSpike && twinkle > 0.8) {
                ctx.strokeStyle = s.color;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(s.x - s.radius * 2.5, currentY);
                ctx.lineTo(s.x + s.radius * 2.5, currentY);
                ctx.moveTo(s.x, currentY - s.radius * 2.5);
                ctx.lineTo(s.x, currentY + s.radius * 2.5);
                ctx.stroke();
            }
        }

        // Draw Meteors (Shooting Stars)
        for (let m = meteors.length - 1; m >= 0; m--) {
            const met = meteors[m];
            met.x += Math.cos(met.angle) * met.speed;
            met.y += Math.sin(met.angle) * met.speed;
            met.life -= 0.025;

            if (met.life <= 0 || met.x > width || met.y > height) {
                meteors.splice(m, 1);
                continue;
            }

            const tailX = met.x - Math.cos(met.angle) * met.length * met.life;
            const tailY = met.y - Math.sin(met.angle) * met.length * met.life;

            const grad = ctx.createLinearGradient(tailX, tailY, met.x, met.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, `rgba(255, 255, 255, ${met.life * 0.9})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.4;
            ctx.globalAlpha = met.life;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(met.x, met.y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

/* ==========================================================================
   4. SCROLL PARALLAX CAMERA
   ========================================================================== */
function initScrollParallax() {
    const nebulaCanvas = document.getElementById('nebulaCanvas');
    if (!nebulaCanvas) return;

    function handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY < 900) {
            const translateY = scrollY * 0.35;
            const opacity = Math.max(0, 1 - (scrollY / 600));
            nebulaCanvas.style.transform = `translate3d(0, ${translateY}px, 0)`;
            nebulaCanvas.style.opacity = opacity.toFixed(3);
        } else {
            nebulaCanvas.style.opacity = '0';
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ==========================================================================
   5. COPY TO CLIPBOARD ACTIONS WITH TOAST
   ========================================================================== */
function initCopyActions() {
    const copyBtns = document.querySelectorAll('[data-copy]');
    const toastContainer = document.getElementById('toastContainer');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
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
            setTimeout(() => toast.remove(), 350);
        }, 3000);
    }
}

/* ==========================================================================
   6. NAVBAR SCROLL ENHANCEMENTS
   ========================================================================== */
function initNavbarScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.borderBottomColor = 'rgba(245, 240, 235, 0.15)';
            header.style.background = 'rgba(0, 0, 0, 0.88)';
        } else {
            header.style.borderBottomColor = 'rgba(245, 240, 235, 0.08)';
            header.style.background = 'rgba(0, 0, 0, 0.75)';
        }
    }, { passive: true });
}

/* ==========================================================================
   7. SMOOTH SCROLLING FOR ANCHORS
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
