// productDetailPage.js (UPDATED)
import { getCart, setCart, getWishlist, setWishlist, updateCartAndWishlistBadges, showCustomAlert } from './utils.js';
import { products } from './data.js'; // IMPORT PRODUCTS

/**
 * Renders the product details on the product detail page.
 * Assumes 'products' is globally available from data.js.
 */
export function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    // Find the product from the global 'products' array
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.querySelector('main .container').innerHTML = '<div class="alert alert-danger text-center py-5" role="alert">Product not found!</div>';
        return;
    }

    // Populate Product Details
    const productName = document.getElementById('productName');
    const productDescriptionLead = document.getElementById('productDescriptionLead');
    const productPrice = document.getElementById('productPrice');

    if (productName) productName.textContent = product.name;
    if (productDescriptionLead) productDescriptionLead.textContent = product.description;
    if (productPrice) {
        productPrice.innerHTML = `₹${product.price.toLocaleString('en-IN')}`;
        // Check if discount exists
        if (product.discount) {
            const discountSpan = document.createElement('span');
            discountSpan.className = 'badge bg-danger ms-2 rounded-md';
            discountSpan.textContent = `${product.discount}% OFF`;
            productPrice.appendChild(discountSpan);
        }
    }

    const addToCartBtnDetail = document.getElementById('addToCartBtnDetail');
    if (addToCartBtnDetail) {
        addToCartBtnDetail.dataset.productId = product.id;
        addToCartBtnDetail.addEventListener('click', () => {
            let currentCart = getCart();
            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                if (currentCart[existingItemIndex].quantity < product.stock) {
                    currentCart[existingItemIndex].quantity += 1;
                    showCustomAlert(`${product.name} quantity updated in cart!`, 'success');
                } else {
                    showCustomAlert(`Cannot add more ${product.name}. Max stock reached!`, 'warning');
                    return;
                }
            } else {
                if (product.stock > 0) {
                    currentCart.push({ id: product.id, name: product.name, price: product.price, image: product.image || product.img, quantity: 1, stock: product.stock });
                    showCustomAlert(`${product.name} added to cart!`, 'success');
                } else {
                    showCustomAlert(`${product.name} is out of stock!`, 'danger');
                    return;
                }
            }
            setCart(currentCart);
            updateCartAndWishlistBadges();
        });
    }

    const addToWishlistBtnDetail = document.getElementById('addToWishlistBtnDetail');
    if (addToWishlistBtnDetail) {
        addToWishlistBtnDetail.dataset.productId = product.id;
        addToWishlistBtnDetail.addEventListener('click', (e) => {
            let currentWishlist = getWishlist();
            const existingItemIndex = currentWishlist.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                currentWishlist.splice(existingItemIndex, 1);
                showCustomAlert(`${product.name} removed from wishlist.`, 'info');
            } else {
                currentWishlist.push(product); // Add full product to wishlist
                showCustomAlert(`${product.name} added to wishlist!`, 'success');
            }
            setWishlist(currentWishlist);
            updateCartAndWishlistBadges();
            // Update button text and class
            e.currentTarget.classList.toggle('btn-danger', existingItemIndex === -1);
            e.currentTarget.classList.toggle('btn-outline-secondary', existingItemIndex !== -1);
            e.currentTarget.querySelector('i').classList.toggle('bi-heart-fill', existingItemIndex === -1);
            e.currentTarget.querySelector('i').classList.toggle('bi-heart', existingItemIndex !== -1);
            e.currentTarget.lastChild.textContent = existingItemIndex === -1 ? 'Remove from Wishlist' : 'Add to Wishlist';
        });
        // Set initial state of wishlist button on load
        const currentWishlist = getWishlist();
        if (currentWishlist.some(item => item.id === product.id)) {
            addToWishlistBtnDetail.classList.remove('btn-outline-secondary');
            addToWishlistBtnDetail.classList.add('btn-danger');
            addToWishlistBtnDetail.querySelector('i').classList.remove('bi-heart');
            addToWishlistBtnDetail.querySelector('i').classList.add('bi-heart-fill');
            addToWishlistBtnDetail.lastChild.textContent = 'Remove from Wishlist';
        }
    }

    // Carousel Images
    const carouselInner = document.querySelector('#productCarousel .carousel-inner');
    const thumbnailsContainer = document.querySelector('.d-flex.mt-3');
    if (carouselInner && thumbnailsContainer && product.detailImages && product.detailImages.length > 0) {
        carouselInner.innerHTML = product.detailImages.map((img, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${img}" class="d-block w-100 rounded shadow-sm" alt="${product.name} Image ${index + 1}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
            </div>
        `).join('');
        thumbnailsContainer.innerHTML = product.detailImages.map((img, index) => `
            <img src="${img.replace('600x400', '100x70')}" class="img-thumbnail me-2 rounded-md" style="width: 100px; height: 70px; object-fit: cover; cursor: pointer;" data-bs-target="#productCarousel" data-bs-slide-to="${index}" alt="Thumbnail ${index + 1}" onerror="this.onerror=null;this.src='https://placehold.co/100x70/E0E0E0/000000?text=Thumb';">
        `).join('');
    } else if (carouselInner) {
        // Fallback if no detail images, use main image
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img src="${product.image || product.img}" class="d-block w-100 rounded shadow-sm" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
            </div>
        `;
        if (thumbnailsContainer) thumbnailsContainer.innerHTML = ''; // Clear thumbnails if none
    }


    // Description Tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab) descriptionTab.innerHTML = `<p class="text-muted">${product.description}</p>`;

    // Specifications Tab
    const specificationsContainer = document.getElementById('specifications');
    if (specificationsContainer && product.specifications && product.specifications.length > 0) {
        specificationsContainer.innerHTML = `
            <ul class="list-group list-group-flush rounded-md">
                ${product.specifications.map(spec => `<li class="list-group-item"><strong>${spec.key}:</strong> ${spec.value}</li>`).join('')}
            </ul>
        `;
    } else if (specificationsContainer) {
        specificationsContainer.innerHTML = '<p class="text-muted">No specifications available.</p>';
    }

    // Render related products (example: same category, different product)
    const relatedProductsContainer = document.getElementById('relatedProductsContainer');
    if (relatedProductsContainer) {
        const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4); // Get up to 4
        if (related.length > 0) {
            relatedProductsContainer.innerHTML = related.map(relProduct => `
                <div class="col">
                    <div class="card h-100 shadow-sm rounded-lg">
                        <img src="${relProduct.image || relProduct.img}" class="card-img-top rounded-t-lg" alt="${relProduct.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0E0E0/000000?text=Image+Not+Found';">
                        <div class="card-body text-center">
                            <h6 class="card-title text-base font-semibold">${relProduct.name}</h6>
                            <p class="card-text text-muted mb-2">₹${relProduct.price.toLocaleString('en-IN')}</p>
                            <a href="product-detail.html?id=${relProduct.id}" class="btn btn-outline-primary btn-sm rounded-md">View Details</a>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            // If no related products, hide the section
            const relatedProductsSection = document.getElementById('relatedProductsSection'); // Assuming you add an ID to the section
            if (relatedProductsSection) relatedProductsSection.remove();
        }
    }
}
