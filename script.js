// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

// Menu Category Switching
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Hide all menu categories
        document.querySelectorAll('.menu-category').forEach(cat => cat.classList.remove('active'));
        // Show selected category
        const categoryId = this.getAttribute('data-category');
        document.getElementById(categoryId).classList.add('active');
    });
});

// Google Sheets Configuration
// REPLACE THIS URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOMbyDWldTdbtCLuG45vTLoEM05fSACr2M7E95bDLYcVbK18C0oFJyGJcH4YDMSCcFLw/exec';

// Reservation Form Handling with Google Sheets Integration
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitReservation');
    const statusDiv = document.getElementById('reservationStatus');
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '<p class="loading">Sending your reservation request...</p>';
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        guests: document.getElementById('guests').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        occasions: document.getElementById('occasions').value,
        requests: document.getElementById('requests').value
    };
    
    // Send to Google Sheets
    if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Success response (no-cors mode means we can't read the response)
            showNotification('Reservation submitted successfully! We will confirm within 24 hours.');
            statusDiv.innerHTML = '<p class="success">✓ Your reservation has been submitted successfully!</p>';
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error submitting reservation. Please try again.');
            statusDiv.innerHTML = '<p class="error">✗ Error submitting reservation. Please try again or call us.</p>';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Reservation';
            setTimeout(() => statusDiv.innerHTML = '', 5000);
        });
    } else {
        // Fallback if Google Sheets URL is not configured
        console.log('Reservation Form Data:', formData);
        showNotification('Reservation request submitted! We will confirm within 24 hours.');
        statusDiv.innerHTML = '<p class="success">✓ Your reservation has been submitted successfully!</p>';
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Reservation';
        setTimeout(() => statusDiv.innerHTML = '', 5000);
    }
});
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    showNotification('Message sent successfully! We will get back to you soon.');
    
    // Reset form
    this.reset();
    
    // Log form data (in real app, this would be sent to server)
    console.log('Contact Form Data:', formData);
});
}

// Newsletter Form Handling
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Show success message
        showNotification('Thank you for subscribing to our newsletter!');
        
        // Reset form
        this.reset();
        
        // Log email (in real app, this would be sent to server)
        console.log('Newsletter Subscription:', email);
    });
});

// Set minimum date for reservation to today
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Smooth scrolling for anchor links
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

// Notification System
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #8B4513;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-family: Georgia, 'Times New Roman', serif;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll Progress Bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

createScrollProgressBar();

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(44, 24, 16, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(44, 24, 16, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    // Set initial opacity for loading effect
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});

// Current day highlighting for hours
function updateHoursHighlight() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    // This could be used to highlight today's hours in the info section
    console.log('Today is:', today);
}

updateHoursHighlight();

// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            const delay = index * 0.1;
            entry.target.style.animationDelay = `${delay}s`;
            entry.target.classList.add('animate-fadeInUp');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animation with different effects
document.querySelectorAll('.featured-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.classList.add('animate-fadeInUp');
    el.style.animationDelay = `${index * 0.15}s`;
    observer.observe(el);
});

document.querySelectorAll('.testimonial-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.classList.add('animate-scaleIn');
    el.style.animationDelay = `${index * 0.2}s`;
    observer.observe(el);
});

document.querySelectorAll('.value-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.classList.add('animate-fadeInUp');
    el.style.animationDelay = `${index * 0.15}s`;
    observer.observe(el);
});

document.querySelectorAll('.team-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.classList.add('animate-fadeInLeft');
    el.style.animationDelay = `${index * 0.2}s`;
    observer.observe(el);
});

document.querySelectorAll('.menu-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.classList.add('animate-fadeInUp');
    el.style.animationDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// Add floating animation to hero buttons
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
heroButtons.forEach((btn, index) => {
    btn.style.animation = `fadeInUp 1s ease ${0.5 + index * 0.2}s forwards`;
    btn.style.opacity = '0';
});

// Add hover effect enhancement
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Magnetic button effect
document.querySelectorAll('.reserve-btn-nav').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.transform = 'translate(' + ((x - rect.width/2) * 0.1) + 'px, ' + ((y - rect.height/2) * 0.1) + 'px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ef4444';
            showNotification('Please enter a valid email address');
        } else {
            this.style.borderColor = '#DEB887';
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#ef4444';
            showNotification('Please enter a valid phone number');
        } else {
            this.style.borderColor = '#DEB887';
        }
    });
});

// Product Modal Functions
function openProductModal(name, price, category, image, description, dietary, rating, calories, protein, carbs, fat) {
    const modal = document.getElementById('productModal');
    
    // Set modal content
    document.getElementById('modalTitle').textContent = name;
    document.getElementById('modalPrice').textContent = '$' + price;
    document.getElementById('modalCategory').textContent = category;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalImage').alt = name;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalDietary').textContent = dietary;
    
    // Set rating stars
    const ratingElement = document.getElementById('modalRating');
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < parseInt(rating)) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    ratingElement.textContent = stars;
    
    // Set nutritional information
    document.getElementById('modalCalories').textContent = calories + ' kcal';
    document.getElementById('modalProtein').textContent = protein + 'g';
    document.getElementById('modalCarbs').textContent = carbs + 'g';
    document.getElementById('modalFat').textContent = fat + 'g';
    
    // Set gallery thumbnails (using same image for demo)
    const thumbnails = document.querySelectorAll('.gallery-thumb img');
    thumbnails.forEach((thumb, index) => {
        thumb.src = image;
        thumb.alt = name + ' view ' + (index + 1);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Add animation class
    setTimeout(() => {
        modal.querySelector('.modal-content').style.animation = 'scaleIn 0.3s ease';
    }, 10);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function changeModalImage(thumbnail) {
    const mainImage = document.getElementById('modalImage');
    const thumbnailImg = thumbnail.querySelector('img');
    
    // Update main image
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = thumbnailImg.src;
        mainImage.style.opacity = '1';
    }, 200);
    
    // Update active thumbnail
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

function orderNow() {
    const productName = document.getElementById('modalTitle').textContent;
    const productPrice = document.getElementById('modalPrice').textContent;
    if (typeof window.saveCustomerOrder === 'function') {
        window.saveCustomerOrder(productName, productPrice).catch(() => {
            showNotification('Your order could not be saved. Please try again.');
        });
    }
    showNotification('Adding ' + productName + ' to your order!');
    
    // In a real application, this would add to a shopping cart
    setTimeout(() => {
        closeProductModal();
    }, 1000);
}

function addToFavorites() {
    const productName = document.getElementById('modalTitle').textContent;
    showNotification(productName + ' added to favorites!');
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Close modal when clicking outside content
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('modal-overlay')) {
        closeProductModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Rustic Spoon website loaded successfully!');
    
    // Add current year to footer
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = `© ${currentYear} The Rustic Spoon. All rights reserved.`;
    }
    
    // Initialize new features
    initializeSearch();
    initializeTheme();
    initializeBackToTop();
    initializeCookieConsent();
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterMenuItems(searchTerm);
        });
    }
}

function filterMenuItems(searchTerm) {
    const menuItems = document.querySelectorAll('.menu-item, .featured-card');
    const noResults = document.querySelector('.no-results');
    
    let visibleCount = 0;
    
    menuItems.forEach(item => {
        const title = item.querySelector('h3, .menu-title')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p, .menu-description')?.textContent.toLowerCase() || '';
        const category = item.querySelector('.menu-category, .dietary')?.textContent.toLowerCase() || '';
        
        const matchesSearch = title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           category.includes(searchTerm);
        
        if (matchesSearch || searchTerm === '') {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    if (noResults) {
        if (visibleCount === 0 && searchTerm !== '') {
            noResults.classList.add('show');
        } else {
            noResults.classList.remove('show');
        }
    }
}

// Dark Mode Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

// Keep the account button responsive even while the Firebase module loads.
// auth.js replaces this function with the full Firebase-aware version.
window.openAuthModal = function() {
    const modal = document.getElementById('accountModal');
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
};

window.closeAuthModal = function() {
    const modal = document.getElementById('accountModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
};

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function applyTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', selectedTheme);
    updateThemeIcon(selectedTheme === 'dark');

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.title = selectedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        themeToggle.setAttribute('aria-label', themeToggle.title);
    }
}

// Keep an already-open page in sync when the theme is changed in another tab.
window.addEventListener('storage', function(event) {
    if (event.key === 'theme') {
        applyTheme(event.newValue || 'light');
    }
});

function updateThemeIcon(isDark) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (isDark) {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }
}

// Print Menu
function printMenu() {
    window.print();
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Cookie Consent
function initializeCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        setTimeout(() => {
            document.getElementById('cookieConsent').classList.add('show');
        }, 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent').classList.remove('show');
    showNotification('Cookies accepted!');
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieConsent').classList.remove('show');
    showNotification('Cookies declined. Some features may be limited.');
}
