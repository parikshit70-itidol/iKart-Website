// wishlistPage.js (UPDATED)
import { getWishlist, getCart, setCart, setWishlist, updateCartAndWishlistBadges, showCustomAlert } from './utils.js';
import { addProductCardEventListeners } from './productCardHandlers.js'; // To re-attach listeners for "Add to Cart"
import { products } from './data.js'; // IMPORT PRODUCTS

/**
 * Renders the wishlist items on the wishlist page.
 * Assumes 'products' is globally available from data.js.
 */
export function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlistContainer');
    let currentWishlist = getWishlist();

    if (!wishlistContainer) {
        console.warn("Wishlist container not found. Skipping renderWishlist.");
        return;
    }

    if (currentWishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="col-12 text-center p-5">
                <p class="lead text-muted">Your wishlist is empty! Add items you love to save them for later.</p>
                <a href="product-listing.html" class="btn btn-primary rounded-md mt-3">Browse Products</a>
            </div>
        `;
        return;
    }

    wishlistContainer.innerHTML = currentWishlist.map(item => {
        // Find the full product details from the global 'products' array for stock info
        const product = products.find(p => p.id === item.id);
        const isStockAvailable = product && product.stock > 0;
        // Check current state for button (though toggle-wishlist-btn will handle this dynamically)
        const isInWishlist = getWishlist().some(wishItem => wishItem.id === item.id);

        return `
            <div class="col">
                <div class="card h-100 shadow-sm rounded-lg">
                    <img src="${item.image || item.img}" class="card-img-top rounded-t-lg" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-lg font-semibold">${item.name}</h5>
                        <p class="card-text text-muted mb-2">₹${item.price.toLocaleString('en-IN')} ${!isStockAvailable ? '<span class="badge bg-danger ms-2 rounded-md">Out of Stock</span>' : ''}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <a href="product-detail.html?id=${item.id}" class="btn btn-outline-primary btn-sm rounded-md">View Details</a>
                            ${isStockAvailable
                                ? `<button class="btn btn-primary btn-sm add-to-cart-btn rounded-md" data-product-id="${item.id}"><i class="bi bi-cart"></i> Add to Cart</button>`
                                : `<button class="btn btn-secondary btn-sm rounded-md" disabled><i class="bi bi-cart"></i> Out of Stock</button>`
                            }
                            <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn btn-sm rounded-md" data-product-id="${item.id}">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Re-attach event listeners for "Add to Cart" and "Toggle Wishlist" buttons on the rendered cards
    addProductCardEventListeners(wishlistContainer);
}
