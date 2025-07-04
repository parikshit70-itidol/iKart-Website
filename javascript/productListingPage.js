// productListingPage.js (UPDATED)
import { getWishlist } from './utils.js';
import { addProductCardEventListeners } from './productCardHandlers.js';
import { products } from './data.js'; // IMPORT PRODUCTS

const productGrid = document.getElementById('productGrid');
const categoryFilterCheckboxes = document.querySelectorAll('.category-filter-checkbox');
const minPriceInput = document.getElementById('minPriceInput');
const maxPriceInput = document.getElementById('maxPriceInput');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const productCountDisplay = document.getElementById('productCountDisplay');
const paginationContainer = document.getElementById('paginationContainer');
const sortDropdownToggle = document.getElementById('sortDropdownToggle');
const sortOptions = document.getElementById('sortOptions');

let currentPage = 1;
const productsPerPage = 9; // Number of products to show per page
let filteredAndSortedProducts = []; // Will store products after filtering and sorting

/**
 * Generates the HTML string for a single product card.
 * @param {Object} product - The product object.
 * @returns {string} The HTML string for the product card.
 */
const generateProductCard = (product) => {
    const currentWishlist = getWishlist();
    const isInWishlist = currentWishlist.some(item => item.id === product.id);
    const starRatingHtml = Array(5).fill().map((_, i) =>
        `<i class="bi bi-star${i < Math.floor(product.rating) ? '-fill' : (i + 0.5 === product.rating ? '-half' : '')} text-warning"></i>`
    ).join('');

    return `
        <div class="col">
            <div class="card h-100 shadow-sm rounded-lg">
                <img src="${product.img || product.image}" class="card-img-top rounded-t-lg" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-lg font-semibold">${product.name}</h5>
                    <p class="card-text text-muted mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fs-5 fw-bold">₹${product.price.toLocaleString('en-IN')}</span>
                        <div>
                            ${starRatingHtml} (${product.reviews})
                        </div>
                    </div>
                    <div class="mt-auto d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary rounded-md">View Details</a>
                        <button class="btn btn-primary add-to-cart-btn rounded-md" data-product-id="${product.id}"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
                        <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn rounded-md" data-product-id="${product.id}">
                            <i class="bi bi-heart${isInWishlist ? '-fill' : ''} me-2"></i>${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Renders products into the product grid based on the current filtered and sorted list.
 * @param {Array} productsToRender - The array of products to display. Defaults to `filteredAndSortedProducts`.
 */
export const renderProducts = (productsToRender = filteredAndSortedProducts) => {
    if (!productGrid) {
        console.error("Error: productGrid element not found.");
        return;
    }
    productGrid.innerHTML = ''; // Clear previous products

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = productsToRender.slice(start, end);

    if (paginatedProducts.length === 0) {
        productGrid.innerHTML = '<p class="text-center col-12 text-muted py-5">No products found matching your criteria.</p>';
    } else {
        paginatedProducts.forEach(product => {
            productGrid.innerHTML += generateProductCard(product);
        });
    }

    updateProductCountDisplay(productsToRender.length);
    renderPagination(productsToRender.length);
    addProductCardEventListeners(productGrid); // Attach event listeners after rendering
};

/**
 * Updates the display showing the current range of products and total count.
 * @param {number} totalProducts - The total number of products after filtering.
 */
const updateProductCountDisplay = (totalProducts) => {
    if (productCountDisplay) {
        const start = (currentPage - 1) * productsPerPage + 1;
        const end = Math.min(start + productsPerPage - 1, totalProducts);
        productCountDisplay.textContent = `Showing ${totalProducts > 0 ? start : 0}-${end} of ${totalProducts} Products`;
    }
};

/**
 * Renders the pagination controls.
 * @param {number} totalProducts - The total number of products after filtering.
 */
const renderPagination = (totalProducts) => {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (totalPages <= 1) { // Hide pagination if only one page
        return;
    }

    const createPageItem = (page, text, isActive = false, isDisabled = false) => {
        const li = document.createElement('li');
        li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
        li.innerHTML = `<a class="page-link rounded-md" href="#" data-page="${page}">${text}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isDisabled && !isActive) {
                currentPage = page;
                renderProducts(); // Re-render products for the new page
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
            }
        });
        return li;
    };

    paginationContainer.appendChild(createPageItem(currentPage - 1, '&laquo;', false, currentPage === 1));

    // Render page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createPageItem(i, i, i === currentPage));
    }

    paginationContainer.appendChild(createPageItem(currentPage + 1, '&raquo;', false, currentPage === totalPages));
};

/**
 * Filters products based on selected categories and price range.
 * Assumes 'products' is globally available from data.js.
 */
export const filterAndRenderProducts = () => {
    let tempProducts = [...products]; // Start with all products from global 'products' array

    // Category filter
    const selectedCategories = Array.from(categoryFilterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.dataset.category);

    if (selectedCategories.length > 0) {
        tempProducts = tempProducts.filter(product => selectedCategories.includes(product.category));
    }

    // Price filter
    const minPrice = parseFloat(minPriceInput ? minPriceInput.value : '');
    const maxPrice = parseFloat(maxPriceInput ? maxPriceInput.value : '');

    if (!isNaN(minPrice) && minPrice >= 0) {
        tempProducts = tempProducts.filter(product => product.price >= minPrice);
    }
    if (!isNaN(maxPrice) && maxPrice >= 0) {
        tempProducts = tempProducts.filter(product => product.price <= maxPrice);
    }

    filteredAndSortedProducts = tempProducts; // Update the filtered list
    currentPage = 1; // Reset to first page after filtering
    applySorting(); // Sorts and then calls renderProducts
};

let currentSortBy = 'popularity'; // Default sort

/**
 * Applies sorting to the currently filtered products and re-renders them.
 */
export const applySorting = () => {
    let sorted = [...filteredAndSortedProducts]; // Sort the currently filtered products

    if (currentSortBy === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (currentSortBy === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (currentSortBy === 'newest') {
        sorted.sort((a, b) => {
            // Assuming IDs like 'tech-001', 'tech-002'. Sort by the numeric part in descending order.
            const aNum = parseInt(a.id.split('-').pop());
            const bNum = parseInt(b.id.split('-').pop());
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return bNum - aNum; // Higher number means newer
            }
            return 0; // Fallback for IDs without numbers or if numbers are same
        });
    } else { // Default to popularity
        sorted.sort((a, b) => b.reviews - a.reviews); // Higher reviews = more popular
    }
    filteredAndSortedProducts = sorted; // Update filteredAndSortedProducts with sorted array
    renderProducts(); // Re-render with the sorted products
};

/**
 * Initializes event listeners for filters and sorting on the product listing page.
 */
export function initProductListingPage() {
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterAndRenderProducts);
    }
    categoryFilterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterAndRenderProducts);
    });
    if (minPriceInput) minPriceInput.addEventListener('change', filterAndRenderProducts);
    if (maxPriceInput) maxPriceInput.addEventListener('change', filterAndRenderProducts);

    if (sortOptions) {
        sortOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                currentSortBy = e.target.dataset.sortBy;
                if (sortDropdownToggle) {
                    sortDropdownToggle.textContent = e.target.textContent; // Update button text
                }
                applySorting();
            }
        });
    }
    // Initial render and sort when the page loads
    filterAndRenderProducts(); // This will also call applySorting and renderProducts
}
