
import { getWishlist } from './utils.js';
import { addProductCardEventListeners } from './productCardHandlers.js';
import { products } from './data.js'; // IMPORT PRODUCTS

/**
 * Renders featured products on the home page.
 * Assumes 'products' is globally available from data.js.
 */
export function renderHomePageFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProductsContainer');
    if (featuredProductsContainer) {
        // Display a subset of products or specific ones
        const featuredProductIds = ['tech-001', 'tech-002', 'audio-001', 'phone-001']; // Use IDs that exist in your products array
        // Filter products from the global 'products' array
        const featured = products.filter(p => featuredProductIds.includes(p.id));

        featuredProductsContainer.innerHTML = featured.map(product => {
            const isInWishlist = getWishlist().some(item => item.id === product.id);
            return `
                <div class="col">
                    <div class="card h-100 shadow-sm rounded-lg">
                        <img src="${product.image || product.img}" class="card-img-top rounded-t-lg" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-lg font-semibold">${product.name}</h5>
                            <p class="card-text text-muted mb-2">₹${product.price.toLocaleString('en-IN')}</p>
                            <div class="mt-auto d-grid gap-2">
                                <a href="product-detail.html?id=${product.id}" class="btn btn-dark rounded-md">View Details</a>
                                <button class="btn btn-dark add-to-cart-btn rounded-md" data-product-id="${product.id}"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
                                <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn rounded-md" data-product-id="${product.id}">
                                    <i class="bi bi-heart${isInWishlist ? '-fill' : ''} me-2"></i>${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        addProductCardEventListeners(featuredProductsContainer); // Attach listeners to newly rendered products
    }
}
