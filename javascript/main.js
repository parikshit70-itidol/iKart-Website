// javascript/main.js
import { updateCartAndWishlistBadges, getCurrentUser, logoutUser } from './utils.js';
import { renderHomePageFeaturedProducts } from './homePage.js';
import { initProductListingPage } from './productListingPage.js';
import { renderProductDetail } from './productDetailPage.js';
import { renderCart } from './cartPage.js';
import { renderWishlist } from './wishlistPage.js';
import { renderCheckoutSummary } from './checkoutPage.js';
import './auth.js'; // This import ensures auth.js's DOMContentLoaded listener runs

// List of pages that require authentication
const PROTECTED_PAGES = [
    'index.html',
    'product-listing.html',
    'product-detail.html',
    'cart.html',
    'wishlist.html',
    'checkout.html',
    'my-account.html',
    'my-orders.html'
];

/**
 * Updates the visibility of login/logout links and displays the username in the navbar.
 */
function updateAuthUI() {
    const currentUser = getCurrentUser();

    const navLoginLink = document.getElementById('navLoginLink');
    const navSignupLink = document.getElementById('navSignupLink');
    const userDropdownContainer = document.getElementById('userDropdownContainer');
    const userDropdownToggle = document.getElementById('navbarDropdown');
    const userDisplayName = document.getElementById('userDisplayName');
    const myAccountLink = document.getElementById('myAccountLink');
    const myOrdersLink = document.getElementById('myOrdersLink');
    const logoutDropdownItem = document.getElementById('logoutDropdownItem');

    console.log('MAIN.JS: updateAuthUI - Current User:', currentUser);

    if (currentUser) {
        // User is logged in
        if (navLoginLink) navLoginLink.style.display = 'none'; else console.log('MAIN.JS: navLoginLink not found.');
        if (navSignupLink) navSignupLink.style.display = 'none'; else console.log('MAIN.JS: navSignupLink not found.');

        if (userDropdownContainer) userDropdownContainer.style.display = 'block'; else console.log('MAIN.JS: userDropdownContainer not found.');
        if (userDropdownToggle) userDropdownToggle.style.display = 'block'; else console.log('MAIN.JS: userDropdownToggle not found.');
        if (userDisplayName) userDisplayName.textContent = currentUser.username; else console.log('MAIN.JS: userDisplayName not found.');

        if (myAccountLink) myAccountLink.style.display = 'block'; else console.log('MAIN.JS: myAccountLink not found.');
        if (myOrdersLink) myOrdersLink.style.display = 'block'; else console.log('MAIN.JS: myOrdersLink not found.');
        if (logoutDropdownItem) logoutDropdownItem.style.display = 'block'; else console.log('MAIN.JS: logoutDropdownItem not found.');

    } else {
        // User is logged out
        if (navLoginLink) navLoginLink.style.display = 'block'; else console.log('MAIN.JS: navLoginLink not found.');
        if (navSignupLink) navSignupLink.style.display = 'block'; else console.log('MAIN.JS: navSignupLink not found.');

        if (userDropdownContainer) userDropdownContainer.style.display = 'none'; else console.log('MAIN.JS: userDropdownContainer not found.');
        if (userDropdownToggle) userDropdownToggle.style.display = 'none'; else console.log('MAIN.JS: userDropdownToggle not found.');
        if (userDisplayName) userDisplayName.textContent = ''; else console.log('MAIN.JS: userDisplayName not found.');

        if (myAccountLink) myAccountLink.style.display = 'none'; else console.log('MAIN.JS: myAccountLink not found.');
        if (myOrdersLink) myOrdersLink.style.display = 'none'; else console.log('MAIN.JS: myOrdersLink not found.');
        if (logoutDropdownItem) logoutDropdownItem.style.display = 'none'; else console.log('MAIN.JS: logoutDropdownItem not found.');
    }
}


// Ensure the DOM is fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    console.log('MAIN.JS: DOMContentLoaded - Current Path:', path);

    // --- Authentication Check for Protected Pages ---
    const currentUser = getCurrentUser(); // This call will log its status
    if (PROTECTED_PAGES.includes(path) && !currentUser) {
        if (path !== 'login.html' && path !== 'signup.html') {
            console.warn('MAIN.JS: User not authenticated on protected page. Redirecting to login.html');
            window.location.href = 'login.html';
            return;
        }
    }

    // Update UI elements related to authentication status
    updateAuthUI();
    updateCartAndWishlistBadges();

    // --- Page Specific Logic based on URL ---
    if (path === 'index.html' || path === '') {
        console.log('MAIN.JS: Rendering Home Page Featured Products.');
        renderHomePageFeaturedProducts();
    } else if (path === 'product-listing.html') {
        console.log('MAIN.JS: Initializing Product Listing Page.');
        initProductListingPage();
    } else if (path === 'product-detail.html') {
        console.log('MAIN.JS: Rendering Product Detail Page.');
        renderProductDetail();
    } else if (path === 'cart.html') {
        console.log('MAIN.JS: Rendering Cart Page.');
        renderCart();
    } else if (path === 'wishlist.html') {
        console.log('MAIN.JS: Rendering Wishlist Page.');
        renderWishlist();
    } else if (path === 'checkout.html') {
        console.log('MAIN.JS: Rendering Checkout Summary.');
        renderCheckoutSummary();
    }

    // Attach logout listener to the dropdown item (if it exists)
    const logoutDropdownItem = document.getElementById('logoutDropdownItem');
    if (logoutDropdownItem) {
        console.log('MAIN.JS: Logout dropdown item found. Attaching event listener.');
        logoutDropdownItem.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('MAIN.JS: Logout button clicked in navbar.');
            logoutUser();
            window.location.href = 'login.html';
        });
    } else {
        console.log('MAIN.JS: Logout dropdown item (id="logoutDropdownItem") not found.');
    }

    // Bootstrap form validation logic (remains inline for forms as per your original structure)
    (function () {
        'use strict'
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })()
});
