// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenu) return;

    mobileMenu.classList.toggle('active');
}


/* =========================================================
   CLOSE MOBILE MENU WHEN USER SCROLLS DOWN
   ========================================================= */

let lastScrollPosition = window.scrollY;

window.addEventListener('scroll', function () {

    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenu) return;

    const currentScrollPosition = window.scrollY;

    // If user is scrolling DOWN, close the menu
    if (
        currentScrollPosition > lastScrollPosition &&
        currentScrollPosition > 30
    ) {
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }

    lastScrollPosition = currentScrollPosition;

}, { passive: true });


/* =========================================================
   CLOSE MOBILE MENU WHEN A LINK IS CLICKED
   ========================================================= */

document.addEventListener('click', function (event) {

    const clickedLink =
        event.target.closest('#mobileMenu .nav-link');

    if (!clickedLink) return;

    const mobileMenu =
        document.getElementById('mobileMenu');

    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }

});

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
function openProductModal(
    name,
    price,
    category,
    image,
    description,
    dietary,
    rating,
    calories,
    protein,
    carbs,
    fat
) {
    const modal = document.getElementById('productModal');

    // =====================================================
    // SET MODAL CONTENT
    // =====================================================

    document.getElementById('modalTitle').textContent = name;

    document.getElementById('modalPrice').textContent =
        '$' + price;

    document.getElementById('modalCategory').textContent =
        category;

    document.getElementById('modalImage').src =
        image;

    document.getElementById('modalImage').alt =
        name;

    document.getElementById('modalDescription').textContent =
        description;

    document.getElementById('modalDietary').textContent =
        dietary;


    // =====================================================
    // SET RATING STARS
    // =====================================================

    const ratingElement =
        document.getElementById('modalRating');

    let stars = '';

    for (let i = 0; i < 5; i++) {

        if (i < parseInt(rating)) {
            stars += '★';
        } else {
            stars += '☆';
        }

    }

    ratingElement.textContent = stars;


    // =====================================================
    // SET NUTRITIONAL INFORMATION
    // =====================================================

    document.getElementById('modalCalories').textContent =
        calories + ' kcal';

    document.getElementById('modalProtein').textContent =
        protein + 'g';

    document.getElementById('modalCarbs').textContent =
        carbs + 'g';

    document.getElementById('modalFat').textContent =
        fat + 'g';


    // =====================================================
    // SET GALLERY THUMBNAILS
    // =====================================================

    const thumbnails =
        document.querySelectorAll(
            '.gallery-thumb img'
        );

    thumbnails.forEach((thumb, index) => {

        thumb.src = image;

        thumb.alt =
            name + ' view ' + (index + 1);

    });


    // =====================================================
    // IMPORTANT:
    // UPDATE FAVORITES BUTTON FOR THIS EXACT DISH
    // =====================================================

    if (typeof updateFavoriteButton === 'function') {

        updateFavoriteButton(name);

    }


    // =====================================================
    // SHOW MODAL
    // =====================================================

    modal.classList.add('active');

    document.body.style.overflow =
        'hidden';


    // =====================================================
    // ADD ANIMATION
    // =====================================================

    setTimeout(() => {

        const modalContent =
            modal.querySelector('.modal-content');

        if (modalContent) {

            modalContent.style.animation =
                'scaleIn 0.3s ease';

        }

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

// ==================== SHOPPING CART SYSTEM ====================

let cart = JSON.parse(localStorage.getItem('rusticSpoonCart')) || [];


// ==================== SAVE CART ====================

function saveCart() {
    localStorage.setItem('rusticSpoonCart', JSON.stringify(cart));
}


// ==================== ADD TO CART ====================

function addToCart() {

    const productNameElement =
        document.getElementById('modalTitle');

    const productPriceElement =
        document.getElementById('modalPrice');

    const productImageElement =
        document.getElementById('modalImage');

    const productDescriptionElement =
        document.getElementById('modalDescription');


    // ==============================
    // CHECK PRODUCT INFORMATION
    // ==============================

    if (!productNameElement || !productPriceElement) {

        console.error('Product modal elements not found.');

        return;
    }


    const productName =
        productNameElement.textContent.trim();


    const productPrice =
        parseFloat(
            productPriceElement.textContent
                .replace(/[^0-9.]/g, '')
        );


    const productImage =
        productImageElement
            ? productImageElement.src
            : '';


    const productDescription =
        productDescriptionElement
            ? productDescriptionElement.textContent.trim()
            : '';


    if (!productName || isNaN(productPrice)) {

        console.error('Invalid product information.');

        return;
    }


    // ==============================
    // CHECK IF PRODUCT ALREADY EXISTS
    // ==============================

    const existingItem =
        cart.find(
            item => item.name === productName
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            name: productName,

            price: productPrice,

            image: productImage,

            description: productDescription,

            quantity: 1

        });
    }


    // ==============================
    // SAVE + UPDATE CART
    // ==============================

    saveCart();

    updateCartCount();

    renderCart();


    // ==============================
    // NEW: CART FEEDBACK
    // ==============================

    if (
        typeof showCartAddedNotification === 'function'
    ) {

        showCartAddedNotification(productName);

    } else {

        // Fallback to your existing notification

        showNotification(
            `${productName} added to cart!`
        );
    }


    // ==============================
    // CLOSE PRODUCT MODAL
    // ==============================

    closeProductModal();

}


// ==================== ORDER NOW ====================
// Keeps your existing Order Now button working.

function orderNow() {
    addToCart();
}


// ==================== UPDATE CART COUNT ====================

function updateCartCount() {

    const cartCountElement = document.getElementById('cartCount');

    if (!cartCountElement) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCountElement.textContent = totalItems;

    if (totalItems > 0) {

        cartCountElement.style.display = 'flex';

    } else {

        cartCountElement.style.display = 'none';

    }
}


// ==================== OPEN / CLOSE CART ====================

function toggleCart() {

    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');

    if (!drawer || !overlay) {
        console.error('Cart drawer elements not found.');
        return;
    }

    drawer.classList.toggle('active');
    overlay.classList.toggle('active');

    renderCart();
}


// ==================== RENDER CART ====================

function renderCart() {

    const cartItemsContainer =
        document.getElementById('cartItems');

    const emptyCart =
        document.getElementById('emptyCart');

    const cartTotal =
        document.getElementById('cartTotal');

    if (!cartItemsContainer || !emptyCart || !cartTotal) {
        return;
    }

    cartItemsContainer.innerHTML = '';

    // Empty cart
    if (cart.length === 0) {

        emptyCart.style.display = 'block';

        cartTotal.textContent = '₹0';

        return;
    }

    emptyCart.style.display = 'none';

    let total = 0;


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        const cartItem =
            document.createElement('div');

        cartItem.className = 'cart-item';


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                class="cart-item-image"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <div class="cart-item-price">
                    ₹${item.price.toFixed(2)}
                </div>

                <div class="cart-quantity">

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `;

        cartItemsContainer.appendChild(cartItem);

    });


    cartTotal.textContent =
        `₹${total.toFixed(2)}`;
}


// ==================== CHANGE QUANTITY ====================

function changeQuantity(index, change) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCartCount();

    renderCart();
}


// ==================== REMOVE ITEM ====================

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    updateCartCount();

    renderCart();
}


// ==================== CLEAR CART ====================

function clearCart() {

    if (cart.length === 0) {
        return;
    }

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();

    showNotification('Cart cleared!');
}


// ==================== CHECKOUT ====================

function checkoutCart() {

    // Check cart
    if (!cart || cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Get logged-in customer
    const user =
        typeof window.cafeCurrentUser === 'function'
            ? window.cafeCurrentUser()
            : null;

    // Customer must be signed in
    if (!user) {

        showNotification(
            'Please sign in before checkout.'
        );

        if (typeof window.openAuthModal === 'function') {
            window.openAuthModal();
        }

        return;
    }

    // Find checkout modal
    const checkoutModal =
        document.getElementById('checkoutModal');

    const checkoutItems =
        document.getElementById('checkoutItems');

    const checkoutTotal =
        document.getElementById('checkoutTotal');

    const customerName =
        document.getElementById('checkoutCustomerName');

    const customerEmail =
        document.getElementById('checkoutCustomerEmail');

    // Make sure checkout HTML exists
    if (!checkoutModal) {

        console.error(
            'checkoutModal was not found in menu.html'
        );

        showNotification(
            'Checkout screen is not available.'
        );

        return;
    }

    // Clear previous checkout items
    checkoutItems.innerHTML = '';

    let total = 0;

    // Display every cart item
    cart.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total += itemTotal;

        const row =
            document.createElement('div');

        row.className = 'checkout-item';

        row.innerHTML = `
            <span>
                ${item.name} × ${item.quantity}
            </span>

            <strong>
                ₹${itemTotal.toFixed(2)}
            </strong>
        `;

        checkoutItems.appendChild(row);

    });

    // Display total
    checkoutTotal.textContent =
        `₹${total.toFixed(2)}`;

    // Display customer information
    customerName.textContent =
        user.displayName || 'Customer';

    customerEmail.textContent =
        user.email || '';

    // Open checkout
    checkoutModal.classList.add('active');
}
async function placeOrder() {

    // Check cart
    if (!cart || cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Get logged-in customer
    const user =
        typeof window.cafeCurrentUser === 'function'
            ? window.cafeCurrentUser()
            : null;

    if (!user) {

        showNotification(
            'Please sign in before placing your order.'
        );

        return;
    }

    // Get NEW Google Sheets order URL
    const orderUrl =
        window.CAFE_FIREBASE_CONFIG
            ?.googleSheetsOrderWebAppUrl;

    if (!orderUrl) {

        console.error(
            'googleSheetsOrderWebAppUrl is missing.'
        );

        showNotification(
            'Order system is not configured.'
        );

        return;
    }

    // Place Order button
    const button =
        document.querySelector(
            '.place-order-button'
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            'Placing Order...';

    }

    // Calculate total
    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),
            0
        );

    // Generate order ID
    const orderId =
        'RS-' + Date.now();

    // Prepare items
    const orderItems =
        cart.map(item => ({

            name: item.name,

            price: Number(item.price),

            quantity: Number(item.quantity)

        }));

    // Prepare order
    const orderData = {

        orderId: orderId,

        customerId: user.uid,

        customerName:
            user.displayName ||
            'Customer',

        email:
            user.email ||
            '',

        items: orderItems,

        total:
            Number(total.toFixed(2)),

        status: 'New'

    };

    try {

        // Send order to Google Sheets
        await fetch(
            orderUrl,
            {
                method: 'POST',

                mode: 'no-cors',

                headers: {
                    'Content-Type':
                        'text/plain;charset=utf-8'
                },

                body:
                    JSON.stringify(orderData)
            }
        );


        // ==============================
        // SAVE ORDER FOR CUSTOMER
        // ==============================

        const customerDb =
            window.cafeDb;

        if (customerDb) {

            await customerDb
                .collection('customers')
                .doc(user.uid)
                .collection('orders')
                .add({

                    orderId: orderId,

                    itemName:
                        orderItems
                            .map(item =>
                                `${item.name} × ${item.quantity}`
                            )
                            .join(', '),

                    items:
                        orderItems,

                    total:
                        Number(total.toFixed(2)),

                    status:
                        'New',

                    createdAt:
                        firebase.firestore
                            .FieldValue
                            .serverTimestamp()

                });

        }


        // ==============================
        // CLEAR CART
        // ==============================

        cart = [];

        saveCart();

        updateCartCount();

        renderCart();


        // ==============================
        // CLOSE CHECKOUT
        // ==============================

        closeCheckout();


        // ==============================
        // CLOSE CART DRAWER
        // ==============================

        const drawer =
            document.getElementById(
                'cartDrawer'
            );

        const overlay =
            document.getElementById(
                'cartOverlay'
            );

        drawer?.classList.remove('active');

        overlay?.classList.remove('active');


        // ==============================
        // SUCCESS
        // ==============================

        showNotification(
            `Order ${orderId} placed successfully!`
        );


        // Refresh account order history
        if (
            typeof refreshAccountPanel ===
            'function'
        ) {

            await refreshAccountPanel();

        }

    } catch (error) {

        console.error(
            'Order placement failed:',
            error
        );

        showNotification(
            'Could not place your order. Please try again.'
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                'Place Order';

        }

    }
}
function closeCheckout() {

    const modal =
        document.getElementById(
            'checkoutModal'
        );

    if (modal) {
        modal.classList.remove('active');
    }

}


// ==================== INITIALIZE CART ====================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        updateCartCount();

        renderCart();

    }
);



let wishlist = JSON.parse(
    localStorage.getItem('rusticSpoonWishlist') || '[]'
);


// =========================================================
// GET FAVORITES BUTTON
// =========================================================

function getFavoritesButton() {

    return document.querySelector(
        '#productModal .modal-action-btn.secondary'
    );

}


// =========================================================
// UPDATE FAVORITES BUTTON FOR CURRENT PRODUCT
// =========================================================

function updateFavoriteButton(productName) {

    const button = getFavoritesButton();

    if (!button) return;

    const text =
        button.querySelector('span');

    const isWishlisted =
        wishlist.includes(productName);


    if (isWishlisted) {

        button.classList.add('wishlisted');

        if (text) {
            text.textContent =
                'Added to Favorites';
        }

        button.setAttribute(
            'aria-label',
            'Remove from favorites'
        );

    } else {

        button.classList.remove('wishlisted');

        if (text) {
            text.textContent =
                'Add to Favorites';
        }

        button.setAttribute(
            'aria-label',
            'Add to favorites'
        );
    }

}


// =========================================================
// ADD / REMOVE CURRENT PRODUCT
// =========================================================

function addToFavorites() {

    const titleElement =
        document.getElementById('modalTitle');

    if (!titleElement) return;

    const productName =
        titleElement.textContent.trim();

    if (!productName) return;


    const index =
        wishlist.indexOf(productName);


    // REMOVE
    if (index !== -1) {

        wishlist.splice(index, 1);

        showNotification(
            `${productName} removed from favorites!`
        );

    }

    // ADD
    else {

        wishlist.push(productName);

        showNotification(
            `${productName} added to favorites!`
        );
    }


    // Save
    localStorage.setItem(
        'rusticSpoonWishlist',
        JSON.stringify(wishlist)
    );


    // IMPORTANT:
    // Update ONLY the current modal product
    updateFavoriteButton(productName);


    // Update the matching card star
    updateProductCardStar(productName);
}


// =========================================================
// UPDATE STAR ON THE EXACT PRODUCT CARD
// =========================================================

function updateProductCardStar(productName) {

    const menuItems =
        document.querySelectorAll('.menu-item');


    menuItems.forEach(item => {

        const title =
            item.querySelector('h3');

        if (!title) return;


        const cardName =
            title.textContent.trim();


        if (cardName !== productName) {
            return;
        }


        const alreadyWishlisted =
            wishlist.includes(productName);


        let star =
            item.querySelector('.wishlist-star');


        // ADD STAR
        if (alreadyWishlisted) {

            if (!star) {

                star =
                    document.createElement('div');

                star.className =
                    'wishlist-star';

                star.textContent = '★';

                item.appendChild(star);
            }

        }


        // REMOVE STAR
        else {

            if (star) {
                star.remove();
            }
        }

    });
}


// =========================================================
// RESTORE ALL SAVED STARS
// =========================================================

function restoreWishlistStars() {

    wishlist.forEach(productName => {

        updateProductCardStar(
            productName
        );

    });
}


// =========================================================
// RESTORE WHEN PAGE LOADS
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        restoreWishlistStars();

    }
);


// =========================================================
// UPDATE PRODUCT CARD
// =========================================================

function updateProductWishlist(productName) {

    const menuItems =
        document.querySelectorAll(
            '.menu-item'
        );


    menuItems.forEach(item => {

        const title =
            item.querySelector('h3');


        if (!title) return;


        const cardName =
            title.textContent.trim();


        // THIS IS THE IMPORTANT PART
        // Only match the exact product

        if (cardName === productName) {

            const isWishlisted =
                wishlist.includes(productName);


            item.classList.toggle(
                'wishlisted',
                isWishlisted
            );


            let star =
                item.querySelector(
                    '.wishlist-star'
                );


            // Add star

            if (isWishlisted) {

                if (!star) {

                    star =
                        document.createElement(
                            'div'
                        );

                    star.className =
                        'wishlist-star';

                    star.textContent = '★';

                    item.appendChild(star);
                }

            }

            // Remove star

            else {

                if (star) {
                    star.remove();
                }
            }
        }

    });
}


// =========================================================
// UPDATE MODAL FAVORITE BUTTON
// =========================================================

function updateFavoriteButton(productName) {

    const button =
        document.querySelector(
            '#productModal .modal-action-btn.secondary'
        );


    if (!button) return;


    const isWishlisted =
        wishlist.includes(productName);


    const text =
        button.querySelector('span');


    if (isWishlisted) {

        button.classList.add(
            'wishlisted'
        );

        if (text) {
            text.textContent =
                'Added to Favorites';
        }

    }

    else {

        button.classList.remove(
            'wishlisted'
        );

        if (text) {
            text.textContent =
                'Add to Favorites';
        }
    }
}


// =========================================================
// UPDATE ALL SAVED PRODUCTS ON PAGE LOAD
// =========================================================

function restoreWishlist() {

    wishlist.forEach(
        productName => {

            updateProductWishlist(
                productName
            );

        }
    );
}


// =========================================================
// RUN AFTER PAGE LOAD
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        restoreWishlist();

    }
);
// =========================================================
// UPDATE WISHLIST VISUAL STATE
// =========================================================

function updateWishlistState(productName) {

    const isWishlisted =
        wishlist.includes(productName);


    /*
     * Find the currently opened product's
     * wishlist button.
     */

    const favoriteButton =
        document.querySelector(
            '#productModal .favorite-btn, ' +
            '#productModal .wishlist-btn, ' +
            '#productModal .add-favorite-btn'
        );


    if (!favoriteButton) return;


    if (isWishlisted) {

        favoriteButton.classList.add(
            'wishlisted'
        );

        favoriteButton.innerHTML =
            '★ Added to Wishlist';

        favoriteButton.setAttribute(
            'aria-label',
            'Remove from wishlist'
        );

    } else {

        favoriteButton.classList.remove(
            'wishlisted'
        );

        favoriteButton.innerHTML =
            '☆ Add to Wishlist';

        favoriteButton.setAttribute(
            'aria-label',
            'Add to wishlist'
        );
    }
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
/* =========================================================
   ADD TO CART FEEDBACK
   ========================================================= */

function showCartAddedNotification(itemName) {

    let notification =
        document.querySelector('.cart-add-notification');

    if (!notification) {

        notification = document.createElement('div');

        notification.className =
            'cart-add-notification';

        document.body.appendChild(notification);
    }

    notification.textContent =
        `🛒 ${itemName} added to cart`;

    /* Restart animation if clicked repeatedly */

    notification.classList.remove('show');

    void notification.offsetWidth;

    notification.classList.add('show');


    /* Find cart button */

    const cartButton =
        document.querySelector(
            '.cart-trigger, .cart-button, .cart-icon, #cartButton'
        );

    if (cartButton) {

        cartButton.classList.remove('cart-bounce');

        void cartButton.offsetWidth;

        cartButton.classList.add('cart-bounce');
    }


    /* Hide notification */

    clearTimeout(window.cartNotificationTimer);

    window.cartNotificationTimer =
        setTimeout(() => {

            notification.classList.remove('show');

        }, 1800);
}