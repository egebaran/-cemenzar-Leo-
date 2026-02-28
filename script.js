// Initialize Lucide Icons
lucide.createIcons();

// DOM Elements
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .project-card, .timeline-content, .team-card');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');
const heroElements = document.querySelectorAll('.hero .fade-up');
const revealElements = document.querySelectorAll('.reveal');

// 1. Custom Cursor Logic (Only for non-touch devices)
if (window.matchMedia("(any-pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant movement for small dot
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth following for large circle
    function animateCursor() {
        // Linear interpolation for smooth trailing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// 2. Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Change icon between menu and x
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// 4. Initial Hero Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);
});

// 5. Scroll Reveal Animation using Intersection Observer
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        // observer.unobserve(entry.target);
    });
}, revealOptions);

// Also observe plain fade-ups that are not in hero
const fadeUpElements = document.querySelectorAll('.section .fade-up');

revealElements.forEach(el => revealObserver.observe(el));
fadeUpElements.forEach(el => revealObserver.observe(el));

// 6. Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 7. Gallery Modal Logic
const galleryModal = document.getElementById('gallery-modal');
const galleryImage = document.getElementById('gallery-image');
const modalCloseBtn = document.querySelector('.modal-close');
const modalPrevBtn = document.getElementById('modal-next'); // Fixed logic bug (prev was next html id)
const modalNextBtn = document.getElementById('modal-prev');
const modalIndicator = document.getElementById('modal-indicator');

// Data for different galleries
const galleries = {
    'egitim': [
        'gallery/img1.jpg',
        'gallery/img2.jpg',
        'gallery/img3.jpg',
        'gallery/img4.jpg',
        'gallery/img5.jpg',
        'gallery/img7.jpg'
    ],
    'leo-market': [
        'leo_market_yeni_afis.jpg',
        'leo_market_1.jpg',
        'leo_market_2.jpg',
        'leo_market_3.jpg'
    ],
    'karaoke': [
        'karaoke_bagis.jpg',
        'gallery/karaoke_1.jpg',
        'gallery/karaoke_2.jpg',
        'gallery/karaoke_3.jpg',
        'gallery/karaoke_4.jpg'
    ],
    'dunya-lions': [
        'gallery/dunya_lions_1.png',
        'gallery/dunya_lions_2.png',
        'gallery/dunya_lions_3.png',
        'gallery/dunya_lions_4.png',
        'gallery/dunya_lions_5.png',
        'gallery/dunya_lions_6.png',
        'gallery/dunya_lions_7.png',
        'gallery/dunya_lions_8.png',
        'gallery/dunya_lions_9.png',
        'gallery/dunya_lions_10.png'
    ]
};

let currentGallery = [];
let currentImageIndex = 0;

function updateGalleryImage() {
    if (currentGallery.length === 0) return;
    galleryImage.src = currentGallery[currentImageIndex];
    modalIndicator.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
}

function openGallery(galleryName) {
    if (galleries[galleryName]) {
        currentGallery = galleries[galleryName];
        currentImageIndex = 0;
        updateGalleryImage();
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Add click listeners to all gallery triggers
document.querySelectorAll('.gallery-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const galleryName = trigger.getAttribute('data-gallery');
        openGallery(galleryName);
    });
});

if (galleryModal) {
    // Close modal
    modalCloseBtn.addEventListener('click', () => {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on background click
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Next image (Fixing id mapping: modal-next is actually the right arrow)
    document.getElementById('modal-next').addEventListener('click', () => {
        if (currentGallery.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        updateGalleryImage();
    });

    // Previous image (Fixing id mapping: modal-prev is actually the left arrow)
    document.getElementById('modal-prev').addEventListener('click', () => {
        if (currentGallery.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        updateGalleryImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            updateGalleryImage();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            updateGalleryImage();
        }
    });

    // Touch swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;

    galleryModal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryModal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (!galleryModal.classList.contains('active')) return;
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) { // Swipe left -> next
            if (currentGallery.length === 0) return;
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            updateGalleryImage();
        } else if (touchEndX > touchStartX + threshold) { // Swipe right -> prev
            if (currentGallery.length === 0) return;
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            updateGalleryImage();
        }
    }
}
