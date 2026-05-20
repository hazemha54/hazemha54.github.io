// ============================================
// WORKFLOW BACKGROUND SCROLL ANIMATION
// ============================================

const workflowBg = document.getElementById('workflowBackground');
const workflowDiagram = document.getElementById('workflowDiagram');
const connectionLines = document.querySelectorAll('.connection-line');

// Animate connections on load
window.addEventListener('load', () => {
    anime({
        targets: '.connection-line',
        strokeDashoffset: [1000, 0],
        easing: 'easeInOutSine',
        duration: 2000,
        delay: anime.stagger(200)
    });
});

// Scroll-based animation for workflow background
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    // Rotate and scale the workflow diagram based on scroll
    const rotation = scrollPercent * 360;
    const scale = 1 + (scrollPercent * 0.3);
    const opacity = 0.4 - (scrollPercent * 0.2);
    
    workflowDiagram.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    workflowBg.style.opacity = Math.max(0.2, opacity);
    
    // Parallax effect for individual nodes
    document.querySelectorAll('.workflow-node').forEach((node, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const yOffset = scrollY * speed * 0.1;
        node.style.transform = `translateY(${yOffset}px)`;
    });
    
    lastScrollY = scrollY;
});

// Pulse animation for workflow nodes
anime({
    targets: '.workflow-node',
    opacity: [0.8, 1],
    scale: [1, 1.05, 1],
    easing: 'easeInOutQuad',
    duration: 2000,
    delay: anime.stagger(300),
    loop: true
});

// ============================================
// HERO ANIMATIONS
// ============================================

anime.timeline({ loop: false })
    .add({
        targets: '.profile-image',
        scale: [0, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 1200
    })
    .add({
        targets: '.btn-download',
        translateY: [30, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800
    }, '-=600')
    .add({
        targets: '.hero-title .line',
        translateY: [100, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1400,
        delay: (el, i) => 100 * i
    }, '-=400')
    .add({
        targets: '.hero-subtitle',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000
    }, '-=800')
    .add({
        targets: '.cta-buttons .btn',
        scale: [0, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 1200,
        delay: anime.stagger(150)
    }, '-=600');

// Code block typing animation
anime({
    targets: '.code-line',
    opacity: [0, 1],
    translateX: [-20, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: anime.stagger(200, { start: 1000 })
});

// Profile ring pulse
anime({
    targets: '.profile-ring',
    scale: [1, 1.1],
    opacity: [0.3, 0.1],
    easing: 'easeInOutQuad',
    duration: 2000,
    loop: true
});

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

// Skills section animation
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: '.skill-card',
                translateY: [100, 0],
                opacity: [0, 1],
                rotateX: [-90, 0],
                easing: 'easeOutExpo',
                duration: 1200,
                delay: anime.stagger(150)
            });

            // Skill progress bars
            document.querySelectorAll('.skill-progress').forEach(bar => {
                const progress = bar.dataset.progress;
                anime({
                    targets: bar,
                    width: ['0%', progress + '%'],
                    easing: 'easeOutExpo',
                    duration: 2000,
                    delay: 500
                });
            });

            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// Timeline animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: '.timeline-item',
                translateX: [-100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1000,
                delay: anime.stagger(200)
            });

            anime({
                targets: '.timeline-marker',
                scale: [0, 1],
                easing: 'easeOutElastic(1, .5)',
                duration: 1200,
                delay: anime.stagger(200)
            });

            timelineObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const timelineSection = document.querySelector('.experience');
if (timelineSection) timelineObserver.observe(timelineSection);

// Badges animation
const badgesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: '.badge-item',
                scale: [0.5, 1],
                opacity: [0, 1],
                rotateY: [90, 0],
                easing: 'easeOutExpo',
                duration: 1200
            });

            badgesObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const badgesSection = document.querySelector('.badges');
if (badgesSection) badgesObserver.observe(badgesSection);

// ============================================
// FORM INPUT ANIMATIONS
// ============================================
// FORM INPUT ANIMATIONS
// ============================================

document.querySelectorAll('.badge-item').forEach(badge => {
    badge.addEventListener('mouseenter', (e) => {
        anime({
            targets: e.currentTarget,
            translateY: -15,
            scale: 1.1,
            easing: 'easeOutExpo',
            duration: 300
        });

        anime({
            targets: e.currentTarget.querySelector('.badge-image'),
            rotate: 360,
            easing: 'easeInOutQuad',
            duration: 800
        });
    });

    badge.addEventListener('mouseleave', (e) => {
        anime({
            targets: e.currentTarget,
            translateY: 0,
            scale: 1,
            easing: 'easeOutExpo',
            duration: 300
        });
    });
});

// ============================================
// LIGHTBOX
// ============================================

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ============================================
// FORCE DOWNLOAD CV
// ============================================

document.querySelector('.btn-download').addEventListener('click', (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = 'Hazem_Hadj_Ahmed.pdf';
    link.download = 'Hazem_Hadj_Ahmed.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.8)';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// SKILL CARD HOVER EFFECTS
// ============================================

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        anime({
            targets: e.currentTarget,
            scale: 1.05,
            translateY: -10,
            easing: 'easeOutExpo',
            duration: 300
        });

        anime({
            targets: e.currentTarget.querySelector('.skill-icon svg'),
            rotate: 360,
            easing: 'easeInOutQuad',
            duration: 600
        });
    });

    card.addEventListener('mouseleave', (e) => {
        anime({
            targets: e.currentTarget,
            scale: 1,
            translateY: 0,
            easing: 'easeOutExpo',
            duration: 300
        });
    });
});
