/**
 * ============================================================================
 * BHUSHAN CHOUDHARY — NOIR EDITORIAL ENGINE (JASPREETSINGH.XYZ STYLE)
 * Signature Preloader (Swanky & Moo Moo) • Hairline Loader • Copy Toast
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initHomeLoader();
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
   2. COPY TO CLIPBOARD ACTIONS WITH TOAST
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
   3. NAVBAR SCROLL ENHANCEMENTS
   ========================================================================== */
function initNavbarScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.borderBottomColor = 'rgba(245, 240, 235, 0.15)';
            header.style.background = 'rgba(0, 0, 0, 0.85)';
        } else {
            header.style.borderBottomColor = 'rgba(245, 240, 235, 0.08)';
            header.style.background = 'rgba(0, 0, 0, 0.75)';
        }
    }, { passive: true });
}

/* ==========================================================================
   4. SMOOTH SCROLLING FOR ANCHORS
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
