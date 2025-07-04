// productCardHandlers.js (UPDATED)
import { getCart, setCart, getWishlist, setWishlist, updateCartAndWishlistBadges, showCustomAlert } from './utils.js';
import { products } from './data.js'; // IMPORT PRODUCTS

/**
 * Attaches event listeners to "Add to Cart" and "Toggle Wishlist" buttons
 * within a specified parent element.
 * Assumes 'products' is globally available from data.js.
 * @param {HTMLElement} parentElement - The DOM element containing the product cards.
 */
export function addProductCardEventListeners(parentElement) {
    if (!parentElement) {
        console.error("addProductCardEventListeners: Parent element is null or undefined.");
        return;
    }

    // Add to Cart buttons
    parentElement.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            // Access global products array (loaded from data.js)
            const product = products.find(p => p.id === productId);

            if (product) {
                let currentCart = getCart();
                const existingItemIndex = currentCart.findIndex(item => item.id === productId);

                if (existingItemIndex > -1) {
                    // Check stock before increasing quantity
                    if (currentCart[existingItemIndex].quantity < product.stock) {
                        currentCart[existingItemIndex].quantity += 1;
                        showCustomAlert(`${product.name} quantity updated in cart!`, 'success');
                    } else {
                        showCustomAlert(`Cannot add more ${product.name}. Max stock reached!`, 'warning');
                        return; // Do not proceed if stock limit reached
                    }
                } else {
                    // Check stock before adding new item
                    if (product.stock > 0) {
                        currentCart.push({ id: product.id, name: product.name, price: product.price, image: product.image || product.img, quantity: 1, stock: product.stock });
                        showCustomAlert(`${product.name} added to cart!`, 'success');
                    } else {
                        showCustomAlert(`${product.name} is out of stock!`, 'danger');
                        return; // Do not add if out of stock
                    }
                }
                setCart(currentCart);
                updateCartAndWishlistBadges();
            } else {
                console.error(`Product with ID ${productId} not found for adding to cart.`);
            }
        });
    });

    // Add/Remove from Wishlist buttons
    parentElement.querySelectorAll('.toggle-wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            // Access global products array (loaded from data.js)
            const product = products.find(p => p.id === productId);

            if (product) {
                let currentWishlist = getWishlist();
                const existingItemIndex = currentWishlist.findIndex(item => item.id === productId);

                if (existingItemIndex > -1) {
                    currentWishlist.splice(existingItemIndex, 1);
                    showCustomAlert(`${product.name} removed from wishlist.`, 'info');
                } else {
                    currentWishlist.push(product); // Add full product object to wishlist
                    showCustomAlert(`${product.name} added to wishlist!`, 'success');
                }
                setWishlist(currentWishlist);
                updateCartAndWishlistBadges();

                // Update the button's appearance immediately
                e.currentTarget.classList.toggle('btn-danger', existingItemIndex === -1);
                e.currentTarget.classList.toggle('btn-outline-secondary', existingItemIndex !== -1);
                e.currentTarget.querySelector('i').classList.toggle('bi-heart-fill', existingItemIndex === -1);
                e.currentTarget.querySelector('i').classList.toggle('bi-heart', existingItemIndex !== -1);
                e.currentTarget.lastChild.textContent = existingItemIndex === -1 ? 'Remove from Wishlist' : 'Add to Wishlist';
            } else {
                console.error(`Product with ID ${productId} not found for toggling wishlist.`);
            }
        });
    });
}
