// cartPage.js (UPDATED)
import { getCart, setCart, updateCartAndWishlistBadges, showCustomAlert } from './utils.js';
import { products } from './data.js'; // IMPORT PRODUCTS

const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotalSpan = document.getElementById('cartSubtotal');
const cartShippingSpan = document.getElementById('cartShipping');
const cartTaxSpan = document.getElementById('cartTax');
const cartTotalSpan = document.getElementById('cartTotal');
const cartTitle = document.getElementById('cartTitle');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const updateCartBtn = document.getElementById('updateCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

/**
 * Renders the shopping cart items and updates the summary.
 * Assumes 'products' is globally available from data.js.
 */
export function renderCart() {
    let currentCart = getCart();

    if (!cartItemsContainer) {
        console.warn("Cart items container not found. Skipping renderCart.");
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (currentCart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none'; // Hide the table
        if (updateCartBtn) updateCartBtn.style.display = 'none';
        if (checkoutBtn) checkoutBtn.classList.add('disabled'); // Disable checkout button
        if (cartTitle) cartTitle.textContent = "Your Shopping Cart (0 items)";
        // Clear summary display when cart is empty
        if (cartSubtotalSpan) cartSubtotalSpan.textContent = '₹0.00';
        if (cartShippingSpan) cartShippingSpan.textContent = '₹0.00';
        if (cartTaxSpan) cartTaxSpan.textContent = '₹0.00';
        if (cartTotalSpan) cartTotalSpan.textContent = '₹0.00';
        return; // Stop here if cart is empty
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block'; // Show the table
        if (updateCartBtn) updateCartBtn.style.display = 'inline-block';
        if (checkoutBtn) checkoutBtn.classList.remove('disabled'); // Enable checkout button
        if (cartTitle) {
            const totalQuantity = currentCart.reduce((sum, item) => sum + item.quantity, 0);
            cartTitle.textContent = `Your Shopping Cart (${totalQuantity} items)`;
        }
    }

    currentCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id); // Find full product details
        if (product) {
            const itemTotalPrice = (product.price * cartItem.quantity);

            const cartItemHtml = `
                <div class="row align-items-center mb-3 pb-3 border-bottom cart-item" data-product-id="${product.id}">
                    <div class="col-md-2 col-4">
                        <img src="${product.image || product.img}" class="img-fluid rounded shadow-sm" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/100x70/E0E0E0/000000?text=Image+Not+Found';">
                    </div>
                    <div class="col-md-4 col-8">
                        <h5 class="mb-0 text-base font-semibold">${product.name}</h5>
                        <small class="text-muted">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}</small>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0">
                        <span class="fw-bold">₹${product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0">
                        <input type="number" class="form-control form-control-sm quantity-input rounded-md" value="${cartItem.quantity}" min="1" max="${product.stock || 99}" data-product-id="${product.id}">
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0 text-end">
                        <span class="fw-bold item-total-price">₹${itemTotalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        <button class="btn btn-danger btn-sm ms-2 rounded-md remove-from-cart-btn" data-product-id="${product.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
        } else {
            console.warn(`Product with ID ${cartItem.id} not found in products data for cart rendering.`);
            // It's a good idea to filter out invalid items from the cart array itself
            // This would typically be done when `getCart()` is called or when the cart is loaded.
        }
    });

    // Attach event listeners after all items are rendered
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            removeCartItem(productId);
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = e.currentTarget.dataset.productId;
            const newQuantity = parseInt(e.currentTarget.value);
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    // The "Update Cart" button functionality (optional, as individual updates already trigger re-render)
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', () => {
            renderCart(); // Force re-render to ensure all totals are fresh
            updateCartAndWishlistBadges();
            showCustomAlert("Cart updated!", 'success');
        });
    }

    calculateCartSummary(); // Calculate and display summary
}

/**
 * Updates the quantity of a specific item in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
function updateCartItemQuantity(productId, newQuantity) {
    let currentCart = getCart();
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found for quantity update.`);
            return;
        }

        if (newQuantity <= 0) {
            currentCart.splice(itemIndex, 1); // Remove if quantity is 0 or less
            showCustomAlert(`${product.name} removed from cart.`, 'info');
        } else {
            if (newQuantity > product.stock) {
                showCustomAlert(`Sorry, only ${product.stock} units of ${product.name} are available.`, 'warning');
                currentCart[itemIndex].quantity = product.stock; // Set to max available stock
            } else {
                currentCart[itemIndex].quantity = newQuantity;
                showCustomAlert(`${product.name} quantity updated.`, 'success');
            }
        }
        setCart(currentCart);
        renderCart(); // Re-render the cart to update totals and display
        updateCartAndWishlistBadges(); // Update navbar badge
    }
}

/**
 * Removes a specific item from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeCartItem(productId) {
    let currentCart = getCart();
    const product = products.find(p => p.id === productId); // Get product name for alert
    currentCart = currentCart.filter(item => item.id !== productId);
    setCart(currentCart);
    renderCart(); // Re-render the cart
    updateCartAndWishlistBadges(); // Update navbar badge
    if (product) {
        showCustomAlert(`${product.name} removed from cart.`, 'info');
    }
}

/**
 * Calculates and displays the cart summary (subtotal, shipping, tax, total).
 * Assumes 'products' is globally available from data.js.
 */
function calculateCartSummary() {
    const currentCart = getCart();

    const cartSubtotalSpan = document.getElementById('cartSubtotal');
    const cartShippingSpan = document.getElementById('cartShipping');
    const cartTaxSpan = document.getElementById('cartTax');
    const cartTotalSpan = document.getElementById('cartTotal');

    if (!cartSubtotalSpan || !cartShippingSpan || !cartTaxSpan || !cartTotalSpan) {
        console.warn("Cart summary elements not found. Skipping calculateCartSummary.");
        return;
    }

    let subtotal = 0;
    currentCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });

    const shipping = subtotal > 0 ? 100.00 : 0.00; // Example: Flat shipping fee (₹100) if items are in cart
    const taxRate = 0.18; // 18% GST example
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    cartSubtotalSpan.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    cartShippingSpan.textContent = `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    cartTaxSpan.textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    cartTotalSpan.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
