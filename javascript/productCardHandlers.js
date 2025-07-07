// productCardHandlers.js (UPDATED)
import { getCart, setCart, getWishlist, setWishlist, updateCartAndWishlistBadges, showCustomAlert } from './utils.js';
import { products } from './data.js'; // Ensure products are imported if needed here for stock checks
import { renderWishlist } from './wishlistPage.js'; // Import renderWishlist

/**
 * Attaches event listeners to "Add to Cart" and "Toggle Wishlist" buttons
 * within a given container (e.g., product listing, wishlist page).
 * @param {HTMLElement} containerElement - The DOM element containing the product cards.
 */
export function addProductCardEventListeners(containerElement) {
    // Event listeners for "Add to Cart" buttons
    containerElement.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.removeEventListener('click', handleAddToCartClick); // Remove existing to prevent duplicates
        button.addEventListener('click', handleAddToCartClick);
    });

    // Event listeners for "Toggle Wishlist" buttons
    containerElement.querySelectorAll('.toggle-wishlist-btn').forEach(button => {
        button.removeEventListener('click', handleToggleWishlistClick); // Remove existing to prevent duplicates
        button.addEventListener('click', handleToggleWishlistClick);
    });
}

/**
 * Handles adding a product to the cart.
 * If called from the wishlist page, it also removes the item from the wishlist.
 * @param {Event} event - The click event.
 */
function handleAddToCartClick(event) {
    const productId = event.currentTarget.dataset.productId;
    const productToAdd = products.find(p => p.id === productId);

    if (!productToAdd) {
        console.error('Product not found for ID:', productId);
        showCustomAlert('Error: Product not found!', 'danger');
        return;
    }

    if (productToAdd.stock <= 0) {
        showCustomAlert('This item is out of stock!', 'warning');
        return;
    }

    let cart = getCart();
    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        // Check if adding another quantity exceeds stock
        if (existingCartItem.quantity + 1 > productToAdd.stock) {
            showCustomAlert(`Cannot add more. Only ${productToAdd.stock} left in stock.`, 'warning');
            return;
        }
        existingCartItem.quantity += 1;
    } else {
        cart.push({ ...productToAdd, quantity: 1 });
    }

    setCart(cart);
    showCustomAlert('Product added to cart!', 'success');
    updateCartAndWishlistBadges();

   
    const wishlistContainer = document.getElementById('wishlistContainer');
    if (wishlistContainer && wishlistContainer.contains(event.currentTarget)) {
        let wishlist = getWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(updatedWishlist);
        showCustomAlert('Product moved from wishlist to cart!', 'info'); // More specific message
        renderWishlist(); // Re-render the wishlist page
    }
    // --- END NEW LOGIC ---
}

/**
 * Handles toggling a product in/out of the wishlist.
 * @param {Event} event - The click event.
 */
function handleToggleWishlistClick(event) {
    const productId = event.currentTarget.dataset.productId;
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }

    let wishlist = getWishlist();
    const isInWishlist = wishlist.some(item => item.id === productId);

    if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        showCustomAlert('Product removed from wishlist!', 'info');
    } else {
        // Add to wishlist
        wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image || product.img });
        showCustomAlert('Product added to wishlist!', 'success');
    }

    setWishlist(wishlist);
    updateCartAndWishlistBadges();

    // Re-render only if on the wishlist page to update the UI
    const wishlistContainer = document.getElementById('wishlistContainer');
    if (wishlistContainer && wishlistContainer.contains(event.currentTarget)) {
        renderWishlist();
    }
    // For product listing pages, you might want to update the button text/style directly
    // event.currentTarget.textContent = isInWishlist ? 'Add to Wishlist' : 'Remove from Wishlist';
    // event.currentTarget.classList.toggle('btn-danger', !isInWishlist);
    // event.currentTarget.classList.toggle('btn-outline-secondary', isInWishlist);
}