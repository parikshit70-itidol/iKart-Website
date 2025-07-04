// javascript/utils.js

/**
 * Retrieves the current cart from localStorage.
 * @returns {Array} An array of cart items, or an empty array if none exists.
 */
export const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Saves the given cart array to localStorage.
 * @param {Array} currentCart - The cart array to save.
 */
export const setCart = (currentCart) => localStorage.setItem('cart', JSON.stringify(currentCart));

/**
 * Retrieves the current wishlist from localStorage.
 * @returns {Array} An array of wishlist items, or an empty array if none exists.
 */
export const getWishlist = () => JSON.parse(localStorage.getItem('wishlist')) || [];

/**
 * Saves the given wishlist array to localStorage.
 * @param {Array} currentWishlist - The wishlist array to save.
 */
export const setWishlist = (currentWishlist) => localStorage.setItem('wishlist', JSON.stringify(currentWishlist));

/**
 * Updates the cart and wishlist badges in the navigation bar.
 */
export function updateCartAndWishlistBadges() {
    const currentCart = getCart();
    const currentWishlist = getWishlist();

    const cartBadge = document.querySelector('.navbar-nav .bi-cart + .badge');
    if (cartBadge) {
        cartBadge.textContent = currentCart.reduce((total, item) => total + item.quantity, 0);
    }

    const wishlistBadge = document.querySelector('.navbar-nav .bi-heart + .badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = currentWishlist.length;
    }
}

/**
 * Displays a custom alert message as a modal.
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert (e.g., 'success', 'danger', 'info', 'warning').
 */
export function showCustomAlert(message, type = 'info') {
    let alertContainer = document.getElementById('customAlertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'customAlertContainer';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '1050';
        alertContainer.style.maxWidth = '300px';
        alertContainer.style.pointerEvents = 'none'; // Allow clicks to pass through
        document.body.appendChild(alertContainer);
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show rounded shadow-sm`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.style.pointerEvents = 'auto'; // Make the alert itself clickable
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getInstance(alertDiv) || new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 3000);
}


// --- Authentication Functions ---

const USERS_STORAGE_KEY = 'ikart_users'; // Key for storing all registered users
const CURRENT_USER_STORAGE_KEY = 'ikart_current_user'; // Key for storing the logged-in user

/**
 * Retrieves all registered users from localStorage.
 * @returns {Array} An array of user objects.
 */
const getAllUsers = () => {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
        console.log('UTILS: getAllUsers - Retrieved users:', users);
        return users;
    } catch (e) {
        console.error('UTILS: getAllUsers - Error parsing users from localStorage:', e);
        return [];
    }
};

/**
 * Saves the array of all registered users to localStorage.
 * @param {Array} users - The array of user objects to save.
 */
const saveAllUsers = (users) => {
    try {
        console.log('UTILS: saveAllUsers - Attempting to save users:', users);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        console.log('UTILS: saveAllUsers - Users successfully saved to localStorage.');
    } catch (e) {
        console.error('UTILS: saveAllUsers - Error saving users to localStorage:', e);
        showCustomAlert('Error saving user data. Please try again.', 'danger');
    }
};

/**
 * Finds a user by email or username.
 * @param {string} identifier - The email or username to search for.
 * @returns {Object|null} The user object if found, otherwise null.
 */
export const findUser = (identifier) => {
    console.log(`UTILS: findUser - Searching for identifier: "${identifier}"`);
    const users = getAllUsers();
    const foundUser = users.find(user => user.email === identifier || user.username === identifier);
    console.log(`UTILS: findUser - Found user:`, foundUser);
    return foundUser;
};

/**
 * Registers a new user.
 * @param {string} email - The user's email.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password (plain text for this demo).
 * @returns {boolean} True if registration is successful, false if email/username already exists.
 */
export const signupUser = (email, username, password) => {
    console.log('UTILS: signupUser - Attempting to register new user:', { email, username, password });
    let users = getAllUsers();

    if (users.some(user => user.email === email)) {
        showCustomAlert('Email already registered!', 'danger');
        console.warn('UTILS: signupUser - Registration failed: Email already exists.');
        return false;
    }
    if (users.some(user => user.username === username)) {
        showCustomAlert('Username already taken!', 'danger');
        console.warn('UTILS: signupUser - Registration failed: Username already exists.');
        return false;
    }

    const newUser = { email, username, password };
    users.push(newUser);
    saveAllUsers(users);
    showCustomAlert('Registration successful! Please log in.', 'success');
    console.log('UTILS: signupUser - New user registered successfully:', newUser);
    return true;
};

/**
 * Logs in a user.
 * @param {string} identifier - The user's email or username.
 * @param {string} password - The user's password.
 * @returns {Object|null} The logged-in user object if successful, otherwise null.
 */
export const loginUser = (identifier, password) => {
    console.log('UTILS: loginUser - Attempting to log in with identifier:', identifier);
    const user = findUser(identifier);

    if (user && user.password === password) {
        try {
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
            showCustomAlert(`Welcome, ${user.username}!`, 'success');
            console.log('UTILS: loginUser - User logged in successfully:', user);
            return user;
        } catch (e) {
            console.error('UTILS: loginUser - Error saving current user to localStorage:', e);
            showCustomAlert('Login failed due to storage error. Please try again.', 'danger');
            return null;
        }
    } else {
        showCustomAlert('Invalid email/username or password.', 'danger');
        console.warn('UTILS: loginUser - Login failed: Invalid credentials.');
        return null;
    }
};

/**
 * Logs out the current user.
 */
export const logoutUser = () => {
    console.log('UTILS: logoutUser - Attempting to log out.');
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    showCustomAlert('You have been logged out.', 'info');
    console.log('UTILS: logoutUser - User logged out successfully.');
};

/**
 * Gets the currently logged-in user.
 * @returns {Object|null} The current user object if logged in, otherwise null.
 */
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        const currentUser = user ? JSON.parse(user) : null;
        console.log('UTILS: getCurrentUser - Retrieved current user:', currentUser);
        return currentUser;
    } catch (e) {
        console.error('UTILS: getCurrentUser - Error parsing current user from localStorage:', e);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY); // Clear potentially corrupted data
        return null;
    }
};
