/**
 * ============================================
 * NEXUS - Student Innovation Club Website
 * Stage 2: Functionality
 * Author: Surya K
 * Description: Main JavaScript file containing
 * all interactive features and functionality
 * ============================================
 */

// ============================================
// Wait for DOM to be fully loaded before executing
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileNavigation();
    initScrollToTop();
    initDarkMode();
    initAnimatedCounters();
    initGalleryLightbox();
    initFormValidation();
    initEventFilter();
    initTypingAnimation();
    initScrollReveal();
    initToastNotifications();
    
    console.log('NEXUS Website - All features initialized successfully!');
});


// ============================================
// FEATURE 1: MOBILE NAVIGATION TOGGLE
// Handles hamburger menu for mobile devices
// ============================================
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Exit if elements don't exist on the page
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu when hamburger button is clicked
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        // Toggle hamburger animation
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when a navigation link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}


// ============================================
// FEATURE 2: SCROLL TO TOP BUTTON
// Shows a button when scrolled down to quickly return to top
// ============================================
function initScrollToTop() {
    // Create scroll to top button dynamically
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ============================================
// FEATURE 3: DARK MODE TOGGLE
// Allows users to switch between light and dark themes
// ============================================
function initDarkMode() {
    // Create dark mode toggle button dynamically
    const darkModeBtn = document.createElement('button');
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.setAttribute('aria-label', 'Toggle dark mode');
    darkModeBtn.setAttribute('title', 'Toggle dark/light mode');
    document.body.appendChild(darkModeBtn);
    
    // Check for saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }
    
    // Toggle dark mode on click
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update button icon and save preference
        if (document.body.classList.contains('dark-mode')) {
            darkModeBtn.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
            showToast('Dark mode enabled', 'info');
        } else {
            darkModeBtn.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
            showToast('Light mode enabled', 'info');
        }
    });
}


// ============================================
// FEATURE 4: ANIMATED COUNTERS
// Animates statistics numbers when they come into view
// ============================================
function initAnimatedCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Function to animate counting
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}


// ============================================
// FEATURE 5: GALLERY LIGHTBOX
// Opens images in a fullscreen modal when clicked
// ============================================
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;
    
    // Create lightbox modal structure
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">❮</button>
            <div class="lightbox-image-container">
                <div class="lightbox-placeholder"></div>
                <p class="lightbox-caption"></p>
            </div>
            <button class="lightbox-next" aria-label="Next">❯</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxPlaceholder = lightbox.querySelector('.lightbox-placeholder');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    const galleryData = [];
    
    // Collect gallery data
    galleryItems.forEach((item, index) => {
        const placeholder = item.querySelector('.gallery-placeholder');
        const caption = item.querySelector('.gallery-caption');
        galleryData.push({
            emoji: placeholder ? placeholder.textContent.trim().split('\n')[0] : '📷',
            caption: caption ? caption.textContent : `Image ${index + 1}`,
            background: placeholder ? getComputedStyle(placeholder).background : ''
        });
        
        // Open lightbox on click
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Open lightbox function
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Update lightbox content
    function updateLightbox() {
        const data = galleryData[currentIndex];
        lightboxPlaceholder.innerHTML = `<span style="font-size: 5rem;">${data.emoji}</span>`;
        lightboxPlaceholder.style.background = data.background || 'linear-gradient(135deg, #0d4f4f, #1a7a7a)';
        lightboxCaption.textContent = data.caption;
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateLightbox();
    }
    
    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateLightbox();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}


// ============================================
// FEATURE 6: FORM VALIDATION
// Real-time validation for contact form
// ============================================
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (!form) return;
    
    // Validation rules
    const validators = {
        name: {
            validate: (value) => value.trim().length >= 2,
            message: 'Name must be at least 2 characters'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        subject: {
            validate: (value) => value.trim().length >= 3,
            message: 'Subject must be at least 3 characters'
        },
        message: {
            validate: (value) => value.trim().length >= 10,
            message: 'Message must be at least 10 characters'
        }
    };
    
    // Add validation to each field
    Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`#${fieldName}`);
        if (!field) return;
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        field.parentNode.appendChild(errorDiv);
        
        // Validate on blur (when user leaves field)
        field.addEventListener('blur', () => validateField(field, validators[fieldName], errorDiv));
        
        // Clear error on input
        field.addEventListener('input', () => {
            if (validators[fieldName].validate(field.value)) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                errorDiv.textContent = '';
            }
        });
    });
    
    // Validate single field
    function validateField(field, validator, errorDiv) {
        if (!validator.validate(field.value)) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            errorDiv.textContent = validator.message;
            return false;
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorDiv.textContent = '';
            return true;
        }
    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        Object.keys(validators).forEach(fieldName => {
            const field = form.querySelector(`#${fieldName}`);
            const errorDiv = field?.parentNode.querySelector('.form-error');
            if (field && errorDiv) {
                if (!validateField(field, validators[fieldName], errorDiv)) {
                    isValid = false;
                }
            }
        });
        
        if (isValid) {
            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            // Remove valid classes
            form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
        } else {
            showToast('Please fix the errors in the form.', 'error');
        }
    });
}


// ============================================
// FEATURE 7: EVENT FILTER/SEARCH
// Filter events by category or search term
// ============================================
function initEventFilter() {
    const eventCards = document.querySelectorAll('.event-card');
    
    if (eventCards.length === 0) return;
    
    // Find the section containing events
    const eventsSection = eventCards[0].closest('.section');
    if (!eventsSection) return;
    
    // Create filter controls
    const filterContainer = document.createElement('div');
    filterContainer.className = 'event-filter';
    filterContainer.innerHTML = `
        <input type="text" class="filter-search" placeholder="Search events...">
        <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="hackathon">Hackathon</button>
            <button class="filter-btn" data-filter="workshop">Workshop</button>
            <button class="filter-btn" data-filter="seminar">Seminar</button>
            <button class="filter-btn" data-filter="networking">Networking</button>
        </div>
    `;
    
    // Insert filter before events grid
    const sectionTitle = eventsSection.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.insertAdjacentElement('afterend', filterContainer);
    }
    
    const searchInput = filterContainer.querySelector('.filter-search');
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    
    // Filter function
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        
        eventCards.forEach(card => {
            const tag = card.querySelector('.event-tag');
            const category = tag ? tag.textContent.toLowerCase() : '';
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.event-description')?.textContent.toLowerCase() || '';
            
            const matchesFilter = currentFilter === 'all' || category.includes(currentFilter);
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Search input event
    searchInput.addEventListener('input', filterEvents);
    
    // Filter button events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterEvents();
        });
    });
}


// ============================================
// FEATURE 8: TYPING ANIMATION
// Creates a typewriter effect for hero text
// ============================================
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (!heroTitle) return;
    
    // Check if already has typing animation span
    if (heroTitle.querySelector('.typing-cursor')) return;
    
    // Add cursor after the accent text
    const accentSpan = heroTitle.querySelector('.text-accent');
    if (accentSpan) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        accentSpan.appendChild(cursor);
    }
}


// ============================================
// FEATURE 9: SCROLL REVEAL ANIMATIONS
// Animate elements as they come into view
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.card, .event-card, .team-card, .gallery-item, .stat-item');
    
    if (revealElements.length === 0) return;
    
    // Add reveal class to elements
    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    });
    
    // Intersection Observer for reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}


// ============================================
// FEATURE 10: TOAST NOTIFICATIONS
// Display temporary notification messages
// ============================================
let toastContainer = null;

function initToastNotifications() {
    // Create toast container
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
}

// Global function to show toast messages
function showToast(message, type = 'info') {
    if (!toastContainer) {
        initToastNotifications();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('visible'), 10);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
    
    // Auto remove after 4 seconds
    setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
}


// ============================================
// UTILITY FUNCTIONS
// Helper functions used across features
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

