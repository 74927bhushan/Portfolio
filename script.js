/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — NOIR EDITORIAL ENGINE (JASPREETSINGH.XYZ STYLE)
 * Signature Preloader • 3D Dual-Core Reactor • Command Palette (Ctrl+K)
 * Minimalist Kinetic Nebula • Project Architecture Inspector • Cosmic Sky Parallax
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initHomeLoader();
    initDualCoreReactor();
    initCommandPalette();
    initProjectInspector();
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
   2. INTERACTIVE 3D DUAL-CORE REACTOR CANVAS (.NET 8 + JAVA 21 + REACT)
   3D Projected Orbital Rings with drag rotation and live telemetry switcher
   ========================================================================== */
function initDualCoreReactor() {
    const canvas = document.getElementById('reactorCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let activeCore = 'dotnet'; // 'dotnet' | 'java' | 'react'

    // 3D Rotation angles and momentum
    let rotX = 0.35;
    let rotY = 0.55;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let velX = 0.005;
    let velY = 0.008;

    // Handle drag rotation
    const wrap = canvas.parentElement;
    wrap.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        velY = dx * 0.005;
        velX = dy * 0.005;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile
    wrap.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Core Tabs Click Handling
    const tabs = document.querySelectorAll('.core-tab');
    const panes = document.querySelectorAll('.telemetry-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const core = tab.getAttribute('data-core');
            if (!core) return;
            activeCore = core;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `telemetry-${core}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    function resize() {
        width = wrap.offsetWidth;
        height = wrap.offsetHeight || 220;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize);
    resize();

    // 3D Point Projection Helper
    function project(x, y, z) {
        // Rotate around X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;

        // Rotate around Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;

        // Perspective division
        const fov = 340;
        const scale = fov / (fov + z2 + 180);
        return {
            x: (width / 2) + x2 * scale,
            y: (height / 2) + y1 * scale,
            scale: scale,
            z: z2
        };
    }

    let startTime = performance.now();

    function render(currentTime) {
        const time = (currentTime - startTime) * 0.001;
        ctx.clearRect(0, 0, width, height);

        // Auto rotation when not dragging
        if (!isDragging) {
            rotY += velY * 0.4 + 0.008;
            rotX += velX * 0.4 + Math.sin(time * 0.5) * 0.002;
            velX *= 0.95;
            velY *= 0.95;
        }

        const cx = width / 2;
        const cy = height / 2;

        // 1. Central UI Nexus Core (React Fiber Core)
        const coreGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 38);
        const coreAlpha = activeCore === 'react' ? 0.9 : 0.4;
        coreGlow.addColorStop(0, `rgba(56, 189, 248, ${coreAlpha})`);
        coreGlow.addColorStop(0.5, `rgba(168, 85, 247, ${coreAlpha * 0.5})`);
        coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fill();

        // 2. Draw Ring 1: .NET Core CLR Ring (Tilted Orbital 1)
        draw3DRing({
            radius: 72,
            tiltAngle: Math.PI / 4,
            color: '#a855f7',
            particleColor: '#c4b5fd',
            particleCount: 16,
            timeOffset: time * 1.8,
            isActive: activeCore === 'dotnet'
        });

        // 3. Draw Ring 2: Java Spring Boot JVM Ring (Tilted Orbital 2)
        draw3DRing({
            radius: 82,
            tiltAngle: -Math.PI / 4,
            color: '#f59e0b',
            particleColor: '#fde68a',
            particleCount: 18,
            timeOffset: -time * 1.5,
            isActive: activeCore === 'java'
        });

        // 4. Draw Ring 3: React / Node Event Loop (Equatorial Outer Ring)
        draw3DRing({
            radius: 96,
            tiltAngle: 0,
            color: '#38bdf8',
            particleColor: '#bae6fd',
            particleCount: 22,
            timeOffset: time * 2.2,
            isActive: activeCore === 'react'
        });

        requestAnimationFrame(render);
    }

    function draw3DRing(config) {
        const segments = 48;
        const points = [];

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            // Elliptical ring rotated by tiltAngle in Z plane
            const rawX = Math.cos(angle) * config.radius;
            const rawY = Math.sin(angle) * config.radius * Math.cos(config.tiltAngle);
            const rawZ = Math.sin(angle) * config.radius * Math.sin(config.tiltAngle);

            points.push(project(rawX, rawY, rawZ));
        }

        // Draw Ring Path
        ctx.strokeStyle = config.isActive ? config.color : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = config.isActive ? 1.8 : 0.8;
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Draw Orbiting Telemetry Particles along ring
        for (let p = 0; p < config.particleCount; p++) {
            const pAngle = ((p / config.particleCount) * Math.PI * 2) + config.timeOffset;
            const px = Math.cos(pAngle) * config.radius;
            const py = Math.sin(pAngle) * config.radius * Math.cos(config.tiltAngle);
            const pz = Math.sin(pAngle) * config.radius * Math.sin(config.tiltAngle);

            const proj = project(px, py, pz);

            ctx.fillStyle = config.isActive ? config.particleColor : 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            const pRadius = (config.isActive ? 2.4 : 1.4) * proj.scale;
            ctx.arc(proj.x, proj.y, Math.max(0.8, pRadius), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    requestAnimationFrame(render);
}

/* ==========================================================================
   3. DEVELOPER COMMAND PALETTE (CTRL + K / ⌘K)
   Instant keyboard search, jump commands, and quick action dispatching
   ========================================================================== */
function initCommandPalette() {
    const trigger = document.getElementById('cmdTrigger');
    const backdrop = document.getElementById('cmdPalette');
    const input = document.getElementById('cmdInput');
    const closeBtn = document.getElementById('cmdCloseBtn');
    const items = document.querySelectorAll('.cmd-item');

    if (!backdrop || !input) return;

    let selectedIndex = 0;

    function openPalette() {
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        input.value = '';
        filterItems('');
        input.focus();
        updateSelected(0);
    }

    function closePalette() {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
    }

    // Trigger on button click
    if (trigger) trigger.addEventListener('click', openPalette);
    if (closeBtn) closeBtn.addEventListener('click', closePalette);

    // Click outside to dismiss
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
    });

    // Global Key Listener: Ctrl+K / ⌘K / Escape
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('open')) closePalette();
            else openPalette();
        }

        if (e.key === 'Escape' && backdrop.classList.contains('open')) {
            closePalette();
        }
    });

    // Real-time Search Filtering
    input.addEventListener('input', () => {
        filterItems(input.value.trim().toLowerCase());
    });

    function filterItems(query) {
        let visibleCount = 0;
        items.forEach((item, idx) => {
            const title = item.querySelector('.cmd-item-title')?.textContent.toLowerCase() || '';
            const desc = item.querySelector('.cmd-item-desc')?.textContent.toLowerCase() || '';
            const matches = !query || title.includes(query) || desc.includes(query);

            item.style.display = matches ? 'flex' : 'none';
            if (matches) visibleCount++;
        });

        updateSelected(0);
    }

    // Keyboard Arrow Selection
    input.addEventListener('keydown', (e) => {
        const visibleItems = Array.from(items).filter(it => it.style.display !== 'none');
        if (!visibleItems.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % visibleItems.length;
            highlightItem(visibleItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
            highlightItem(visibleItems);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (visibleItems[selectedIndex]) {
                executeAction(visibleItems[selectedIndex]);
            }
        }
    });

    function updateSelected(index) {
        selectedIndex = index;
        const visibleItems = Array.from(items).filter(it => it.style.display !== 'none');
        highlightItem(visibleItems);
    }

    function highlightItem(visibleItems) {
        items.forEach(it => it.classList.remove('selected'));
        if (visibleItems[selectedIndex]) {
            visibleItems[selectedIndex].classList.add('selected');
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Item Click Action
    items.forEach(item => {
        item.addEventListener('click', () => {
            executeAction(item);
        });
    });

    function executeAction(item) {
        const action = item.getAttribute('data-action');
        closePalette();

        if (action === 'link') {
            const url = item.getAttribute('data-url');
            if (url) window.open(url, '_blank');
        } else if (action === 'scroll') {
            const target = item.getAttribute('data-target');
            const el = document.querySelector(target);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (action === 'download') {
            const url = item.getAttribute('data-url');
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = url;
                a.click();
            }
        } else if (action === 'copy') {
            const copyText = item.getAttribute('data-copy');
            if (copyText) {
                navigator.clipboard.writeText(copyText).then(() => {
                    if (window.showSiteToast) window.showSiteToast(`Copied to clipboard: ${copyText}`);
                });
            }
        }
    }
}

/* ==========================================================================
   4. INTERACTIVE PROJECT ARCHITECTURE INSPECTOR TABS
   ========================================================================== */
function initProjectInspector() {
    const tabs = document.querySelectorAll('.inspect-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            if (!targetId) return;

            const card = tab.closest('.work-item');
            if (!card) return;

            // Toggle active tab inside this card
            card.querySelectorAll('.inspect-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Toggle active panel inside this card
            card.querySelectorAll('.inspect-panel').forEach(p => {
                p.classList.remove('active');
                if (p.id === targetId) p.classList.add('active');
            });
        });
    });
}

/* ==========================================================================
   5. MINIMALIST KINETIC NEBULA CANVAS
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

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            if (mouse.isOver) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (1 - dist / mouse.radius) * 0.035;
                    p.vx += dx * force;
                    p.vy += dy * force;

                    const cursorAlpha = (1 - dist / mouse.radius) * 0.35;
                    ctx.strokeStyle = `rgba(245, 240, 235, ${cursorAlpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

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

            p.vx *= 0.985;
            p.vy *= 0.985;

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

            const twinkle = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.phase);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha * twinkle;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

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
   6. COSMIC SKY & PARALLAX STARS CANVAS
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
        const starCount = Math.floor((width * height) / 3200);

        const colors = ['#ffffff', '#f5f0eb', '#e2e8f0', '#bae6fd', '#fde68a'];

        for (let i = 0; i < starCount; i++) {
            const layer = Math.random();
            let radius, speed, depth;

            if (layer < 0.6) {
                radius = 0.6 + Math.random() * 0.6;
                speed = 0.08;
                depth = 1;
            } else if (layer < 0.9) {
                radius = 1.2 + Math.random() * 0.8;
                speed = 0.16;
                depth = 2;
            } else {
                radius = 2.0 + Math.random() * 0.8;
                speed = 0.25;
                depth = 3;
            }

            stars.push({
                x: Math.random() * width,
                baseY: Math.random() * height * 1.5 - height * 0.2,
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

    function render(currentTime) {
        const time = currentTime * 0.001;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        ctx.clearRect(0, 0, width, height);

        const skyDarkness = Math.min(scrollY / 300, 1);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.85 + skyDarkness * 0.15})`;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            const scrollOffset = (scrollY * s.speed);
            const currentY = (s.baseY + scrollOffset) % (height + 40);

            const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
            const currentAlpha = s.alpha * (0.4 + 0.6 * twinkle);

            ctx.fillStyle = s.color;
            ctx.globalAlpha = currentAlpha;

            ctx.beginPath();
            ctx.arc(s.x, currentY, s.radius, 0, Math.PI * 2);
            ctx.fill();

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
   7. SCROLL PARALLAX CAMERA
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
   8. COPY TO CLIPBOARD ACTIONS WITH TOAST
   ========================================================================== */
function initCopyActions() {
    const copyBtns = document.querySelectorAll('[data-copy]');
    const toastContainer = document.getElementById('toastContainer');

    window.showSiteToast = function(message, type = 'success') {
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
    };

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                window.showSiteToast(`Copied to clipboard: ${textToCopy}`);
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                }, 2000);
            }).catch(() => {
                window.showSiteToast('Unable to copy directly', 'error');
            });
        });
    });
}

/* ==========================================================================
   9. NAVBAR SCROLL ENHANCEMENTS
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
   10. SMOOTH SCROLLING FOR ANCHORS
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
