// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==========================================
// SMOOTH SCROLLING
// ==========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Only intercept anchor links (starting with #), not page links like resume.html
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
    '.skill-category, .timeline-item, .project-card, .education-card, .contact-card, .about-text'
);

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
});

// ==========================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ==========================================
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ==========================================
// DYNAMIC TYPING EFFECT
// ==========================================
const roles = [
    'Full Stack Software Engineer',
    '.NET Developer',
    'Java Developer',
    'React Developer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const subtitle = document.querySelector('.hero-subtitle');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        subtitle.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        subtitle.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, pauseTime);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeEffect, speed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 500);
});

// ==========================================
// CURSOR TRAIL EFFECT (OPTIONAL)
// ==========================================
const coords = { x: 0, y: 0 };
const circles = [];
const numCircles = 20;

// Create cursor trail circles
for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement('div');
    circle.style.position = 'fixed';
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.borderRadius = '50%';
    circle.style.background = `rgba(99, 102, 241, ${1 - i / numCircles})`;
    circle.style.pointerEvents = 'none';
    circle.style.zIndex = '9999';
    circle.style.transition = 'transform 0.1s';
    circle.style.left = '0';
    circle.style.top = '0';
    document.body.appendChild(circle);
    circles.push(circle);
}

// Update cursor position
document.addEventListener('mousemove', (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

// Animate cursor trail
function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach((circle, index) => {
        circle.style.left = x - 5 + 'px';
        circle.style.top = y - 5 + 'px';
        circle.style.transform = `scale(${(numCircles - index) / numCircles})`;
        
        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.offsetLeft - circle.offsetLeft) * 0.3;
        y += (nextCircle.offsetTop - circle.offsetTop) * 0.3;
    });

    requestAnimationFrame(animateCircles);
}

animateCircles();

// ==========================================
// SKILL TAGS ANIMATION
// ==========================================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
});

// ==========================================
// PARALLAX EFFECT FOR HERO SECTION
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
const stats = document.querySelectorAll('.stat h3');
const statsSection = document.querySelector('.about-stats');
let hasAnimated = false;

const animateStats = () => {
    if (!statsSection || hasAnimated) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        hasAnimated = true;
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = stat.textContent;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                }
            }, 30);
        });
    }
};

window.addEventListener('scroll', animateStats);

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c👋 Welcome to my portfolio!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cLike what you see? Let\'s connect!', 'color: #8b5cf6; font-size: 16px;');
console.log('%cGitHub: https://github.com/74927bhushan', 'color: #ec4899; font-size: 14px;');

// ==========================================
// HANDLE EXTERNAL LINKS
// ==========================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Analytics could be added here
        console.log(`External link clicked: ${link.href}`);
    });
});

// ==========================================
// PREVENT CONTEXT MENU ON IMAGES (OPTIONAL)
// ==========================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
