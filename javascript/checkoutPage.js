// checkoutPage.js (UPDATED)
import { getCart, showCustomAlert } from './utils.js';
import { products } from './data.js'; // IMPORT PRODUCTS

/**
 * Renders the checkout summary section, including cart items and totals.
 * Assumes 'products' is globally available from data.js.
 */
export function renderCheckoutSummary() {
    const checkoutCartItemCount = document.getElementById('checkoutCartItemCount');
    const checkoutCartItemsContainer = document.getElementById('checkoutCartItemsContainer');
    const checkoutEmptyCartMessage = document.getElementById('checkoutEmptyCartMessage');
    const checkoutCartSubtotal = document.getElementById('checkoutCartSubtotal');
    const checkoutCartShipping = document.getElementById('checkoutCartShipping');
    const checkoutCartTax = document.getElementById('checkoutCartTax');
    const checkoutCartTotal = document.getElementById('checkoutCartTotal');
    const checkoutSubmitButton = document.getElementById('checkoutSubmitButton'); // The bottom button

    // Essential elements check: If these aren't found, something is wrong with the HTML structure.
    if (!checkoutCartItemsContainer || !checkoutCartItemCount || !checkoutCartSubtotal || !checkoutCartShipping || !checkoutCartTax || !checkoutCartTotal) {
        console.warn("Checkout summary elements not found. Skipping renderCheckoutSummary.");
        return;
    }

    let currentCart = getCart();
    checkoutCartItemsContainer.innerHTML = ''; // Clear existing items

    if (currentCart.length === 0) {
        if (checkoutEmptyCartMessage) checkoutEmptyCartMessage.style.display = 'block';
        if (checkoutCartItemsContainer) checkoutCartItemsContainer.style.display = 'none'; // Hide the list
        if (checkoutSubmitButton) checkoutSubmitButton.classList.add('disabled'); // Disable submit button
        checkoutCartItemCount.textContent = '0';
        checkoutCartSubtotal.textContent = '₹0.00';
        checkoutCartShipping.textContent = '₹0.00';
        checkoutCartTax.textContent = '₹0.00';
        checkoutCartTotal.textContent = '₹0.00';
        return; // Exit if cart is empty
    } else {
        if (checkoutEmptyCartMessage) checkoutEmptyCartMessage.style.display = 'none';
        if (checkoutCartItemsContainer) checkoutCartItemsContainer.style.display = 'block'; // Show the list
        if (checkoutSubmitButton) checkoutSubmitButton.classList.remove('disabled'); // Enable submit button
    }

    let subtotal = 0;
    let totalItems = 0;

    currentCart.forEach(cartItem => {
        // Access global products array (loaded from data.js)
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            const itemTotalPrice = product.price * cartItem.quantity;
            subtotal += itemTotalPrice;
            totalItems += cartItem.quantity;

            // Create list item for each cart product in the checkout summary
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-sm');
            listItem.innerHTML = `
                <div>
                    <h6 class="my-0">${product.name}</h6>
                    <small class="text-muted">Quantity: ${cartItem.quantity}</small>
                </div>
                <span class="text-muted">₹${itemTotalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            `;
            checkoutCartItemsContainer.appendChild(listItem);
        } else {
            console.warn(`Product with ID ${cartItem.id} not found in global products array for checkout summary. It might be outdated or removed.`);
            // Optionally, you might want to remove such items from the cart here
            // showCustomAlert(`Product with ID ${cartItem.id} not found and removed from cart.`, 'warning');
            // currentCart = currentCart.filter(item => item.id !== cartItem.id);
            // setCart(currentCart); // Save the updated cart
        }
    });

    const shipping = subtotal > 0 ? 100.00 : 0.00; // Example: Flat shipping fee (₹100) if items are in cart
    const taxRate = 0.18; // 18% GST example
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    // Update the summary details
    checkoutCartItemCount.textContent = totalItems;
    checkoutCartSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    checkoutCartShipping.textContent = `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    checkoutCartTax.textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    checkoutCartTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
