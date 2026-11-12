/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — NOIR EDITORIAL ENGINE (JASPREETSINGH.XYZ STYLE)
 * Signature Preloader • Moving Grass Wind Simulation • Cosmic Sky & Stars Parallax
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initHomeLoader();
    initMovingGrassCanvas();
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
   2. PROCEDURAL MOVING GRASS SIMULATION (LIKE LIVE VIDEO)
   Physics: Multistage harmonic wind oscillation, gust waves, and mouse deflection
   ========================================================================== */
function initMovingGrassCanvas() {
    const canvas = document.getElementById('grassCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let blades = [];

    // Mouse tracking for interactive blade bending
    const mouse = { x: -1000, y: -1000, isOver: false };

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

    function resize() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.offsetHeight || 190;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        generateBlades();
    }

    function generateBlades() {
        blades = [];
        const bladeCount = Math.floor(width / 2.8); // High density

        // Palette layers: back silhouette, middle sunset grass, front golden rim
        const layers = [
            { count: Math.floor(bladeCount * 0.35), minH: 70, maxH: 110, w: 2.2, color: 'rgba(10, 16, 10, 0.95)', speed: 0.8, amp: 14 },
            { count: Math.floor(bladeCount * 0.40), minH: 95, maxH: 145, w: 3.0, color: 'rgba(20, 32, 18, 0.95)', speed: 1.0, amp: 22 },
            { count: Math.floor(bladeCount * 0.25), minH: 120, maxH: 175, w: 3.8, color: 'rgba(38, 56, 30, 0.95)', speed: 1.2, amp: 30 }
        ];

        layers.forEach((layer) => {
            for (let i = 0; i < layer.count; i++) {
                const x = Math.random() * width;
                const h = layer.minH + Math.random() * (layer.maxH - layer.minH);
                const naturalCurve = (Math.random() - 0.5) * 15;
                blades.push({
                    x: x,
                    baseY: height,
                    height: h,
                    width: layer.w,
                    color: layer.color,
                    speed: layer.speed * (0.85 + Math.random() * 0.3),
                    amplitude: layer.amp * (0.85 + Math.random() * 0.3),
                    phase: Math.random() * Math.PI * 2,
                    naturalCurve: naturalCurve,
                    currentSway: 0
                });
            }
        });

        // Sort so back blades render first
        blades.sort((a, b) => a.height - b.height);
    }

    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();

    function render(currentTime) {
        const time = (currentTime - startTime) * 0.001;
        ctx.clearRect(0, 0, width, height);

        // Global wind wave traveling across screen
        const globalWave = Math.sin(time * 1.5) * 8 + Math.sin(time * 0.6) * 12;
        const gust = Math.sin(time * 0.4) > 0.5 ? Math.pow(Math.sin(time * 0.4) - 0.5, 2) * 45 : 0;

        for (let i = 0; i < blades.length; i++) {
            const b = blades[i];

            // Harmonic wind calculation
            const harmonic = Math.sin(time * b.speed * 2 + b.phase + (b.x * 0.008));
            let targetSway = b.naturalCurve + harmonic * b.amplitude + globalWave * 0.6 + gust;

            // Interactive mouse repulsion
            if (mouse.isOver) {
                const dx = b.x - mouse.x;
                const dy = (height - b.height * 0.8) - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    const force = (1 - dist / 110) * 45;
                    targetSway += dx > 0 ? force : -force;
                }
            }

            // Smooth spring damping towards target sway
            b.currentSway += (targetSway - b.currentSway) * 0.12;

            const tipX = b.x + b.currentSway;
            const tipY = height - b.height;
            const ctrlX = b.x + b.currentSway * 0.45;
            const ctrlY = height - b.height * 0.55;

            // Draw tapered blade with quadratic curve
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.moveTo(b.x - b.width * 0.5, b.baseY);
            ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
            ctx.quadraticCurveTo(ctrlX + b.width * 0.3, ctrlY, b.x + b.width * 0.5, b.baseY);
            ctx.closePath();
            ctx.fill();
        }

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

        // Background depth: When scroll is 0, sky canvas is transparent to show sunset.
        // As you scroll down, a deep obsidian nebula fades in to envelope the stars.
        const skyDarkness = Math.min(scrollY / 400, 1);
        if (skyDarkness > 0.01) {
            ctx.fillStyle = `rgba(0, 0, 0, ${skyDarkness * 0.92})`;
            ctx.fillRect(0, 0, width, height);
        }

        // Draw Stars with Parallax (stars shift downwards as user scrolls down = camera ascends into sky)
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
   4. SCROLL PARALLAX CAMERA (TRANSITIONING FROM HILLTOP UPWARDS TO HEAVENS)
   ========================================================================== */
function initScrollParallax() {
    const heroBackdrop = document.getElementById('heroBackdrop');
    if (!heroBackdrop) return;

    function handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // When scrolling down, the hilltop sinks downwards and dissolves into the night sky
        if (scrollY < 850) {
            const translateY = scrollY * 0.42;
            const opacity = Math.max(0, 1 - (scrollY / 550));
            heroBackdrop.style.transform = `translate3d(0, ${translateY}px, 0)`;
            heroBackdrop.style.opacity = opacity.toFixed(3);
        } else {
            heroBackdrop.style.opacity = '0';
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
