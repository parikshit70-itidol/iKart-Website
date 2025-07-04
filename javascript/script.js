const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const setCart = (currentCart) => localStorage.setItem('cart', JSON.stringify(currentCart));

const getWishlist = () => JSON.parse(localStorage.getItem('wishlist')) || [];
const setWishlist = (currentWishlist) => localStorage.setItem('wishlist', JSON.stringify(currentWishlist));


// --- Global UI Updates ---
function updateCartAndWishlistBadges() {
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

// --- Common Event Listeners for Product Cards (Home, Product Listing, Wishlist) ---
// This function needs to be improved to pass the correct 'products' array from global scope
// when it saves to cart/wishlist.
function addProductCardEventListeners(parentElement) {
    if (!parentElement) return;

    // Add to Cart buttons
    parentElement.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            const product = products.find(p => p.id === productId); // Access global products

            if (product) {
                let currentCart = getCart(); // Get current cart
                const existingItemIndex = currentCart.findIndex(item => item.id === productId);

                if (existingItemIndex > -1) {
                    currentCart[existingItemIndex].quantity += 1;
                } else {
                    // Store relevant product details, not necessarily the full product object if it's too large
                    currentCart.push({ id: product.id, name: product.name, price: product.price, image: product.image || product.img, quantity: 1, stock: product.stock });
                }
                setCart(currentCart); // Save updated cart
                updateCartAndWishlistBadges();
                
            }
        });
    });

    // Add/Remove from Wishlist buttons
    parentElement.querySelectorAll('.toggle-wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            const product = products.find(p => p.id === productId); // Access global products

            if (product) {
                let currentWishlist = getWishlist(); // Get current wishlist
                const existingItemIndex = currentWishlist.findIndex(item => item.id === productId);

                if (existingItemIndex > -1) {
                    currentWishlist.splice(existingItemIndex, 1);
                    alert(`${product.name} removed from wishlist.`);
                } else {
                    currentWishlist.push(product); // Add full product to wishlist
                    alert(`${product.name} added to wishlist!`);
                }
                setWishlist(currentWishlist); // Save updated wishlist
                updateCartAndWishlistBadges();
                // Optionally update the button's appearance immediately
                e.currentTarget.classList.toggle('btn-danger', existingItemIndex === -1);
                e.currentTarget.classList.toggle('btn-outline-secondary', existingItemIndex !== -1);
                e.currentTarget.querySelector('i').classList.toggle('bi-heart-fill', existingItemIndex === -1);
                e.currentTarget.querySelector('i').classList.toggle('bi-heart', existingItemIndex !== -1);
                e.currentTarget.lastChild.textContent = existingItemIndex === -1 ? 'Remove from Wishlist' : 'Add to Wishlist';
            }
        });
    });
}


// --- Page Specific Render Functions ---

// 1. Home Page Specifics
function renderHomePageFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProductsContainer');
    if (featuredProductsContainer) {
        // Display a subset of products or specific ones
        const featuredProductIds = ['tech-001', 'tech-002', 'audio-001', 'phone-001']; // Use IDs that exist in your products array
        const featured = products.filter(p => featuredProductIds.includes(p.id));

        featuredProductsContainer.innerHTML = featured.map(product => {
            const isInWishlist = getWishlist().some(item => item.id === product.id);
            return `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.image || product.img}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted">₹${product.price.toLocaleString('en-IN')}</p>
                            <div class="mt-auto d-grid gap-2">
                                <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">View Details</a>
                                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
                                <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn" data-product-id="${product.id}">
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


// 2. Product Listing Page Specifics
const productGrid = document.getElementById('productGrid');
const categoryFilter = document.getElementById('categoryFilter');
const minPriceInput = document.getElementById('minPriceInput'); // Corrected ID from minPrice
const maxPriceInput = document.getElementById('maxPriceInput'); // Corrected ID from maxPrice
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const productCountDisplay = document.getElementById('productCountDisplay'); // Ensure this ID exists in HTML
const paginationContainer = document.getElementById('paginationContainer'); // Ensure this ID exists in HTML

let currentPage = 1;
const productsPerPage = 9; // Number of products to show per page
let filteredAndSortedProducts = [...products]; // Stores current filtered AND sorted products


const generateProductCard = (product) => {
    const currentWishlist = getWishlist();
    const isInWishlist = currentWishlist.some(item => item.id === product.id);
    const starRatingHtml = Array(5).fill().map((_, i) =>
        `<i class="bi bi-star${i < Math.floor(product.rating) ? '-fill' : (i + 0.5 === product.rating ? '-half' : '')} text-warning"></i>`
    ).join('');

    return `
        <div class="col">
            <div class="card h-100 shadow-sm">
                <img src="${product.img || product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fs-5 fw-bold">₹${product.price.toLocaleString('en-IN')}</span>
                        <div>
                            ${starRatingHtml} (${product.reviews})
                        </div>
                    </div>
                    <div class="mt-auto d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">View Details</a>
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
                        <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn" data-product-id="${product.id}">
                            <i class="bi bi-heart${isInWishlist ? '-fill' : ''} me-2"></i>${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};


const renderProducts = (productsToRender = filteredAndSortedProducts) => {
    if (!productGrid) {
        console.error("Error: productGrid not found.");
        return;
    }
    productGrid.innerHTML = ''; // Clear previous products

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = productsToRender.slice(start, end);

    if (paginatedProducts.length === 0) {
        productGrid.innerHTML = '<p class="text-center col-12">No products found matching your criteria.</p>';
    } else {
        paginatedProducts.forEach(product => {
            productGrid.innerHTML += generateProductCard(product);
        });
    }

    updateProductCountDisplay(productsToRender.length);
    renderPagination(productsToRender.length);
    addProductCardEventListeners(productGrid); // Attach event listeners after rendering
};

const updateProductCountDisplay = (totalProducts) => {
    if (productCountDisplay) {
        const start = (currentPage - 1) * productsPerPage + 1;
        const end = Math.min(start + productsPerPage - 1, totalProducts);
        productCountDisplay.textContent = `Showing ${start}-${end} of ${totalProducts} Products`;
    }
};

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
        li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${text}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isDisabled && !isActive) {
                currentPage = page;
                renderProducts(); // Re-render products for the new page
            }
        });
        return li;
    };

    paginationContainer.appendChild(createPageItem(currentPage - 1, '&laquo;', false, currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createPageItem(i, i, i === currentPage));
    }

    paginationContainer.appendChild(createPageItem(currentPage + 1, '&raquo;', false, currentPage === totalPages));
};

const filterAndRenderProducts = () => {
    let tempProducts = [...products]; // Start with all products

    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter-checkbox'))
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

    // Assign to filteredAndSortedProducts before sorting
    filteredAndSortedProducts = tempProducts;
    applySorting(); // Sorts and then calls renderProducts
};


const sortDropdownToggle = document.getElementById('sortDropdownToggle');
const sortOptions = document.getElementById('sortOptions');
let currentSortBy = 'popularity'; // Default sort

const applySorting = () => {
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


// 3. Product Detail Page Specifics
function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.querySelector('main .container').innerHTML = '<div class="alert alert-danger text-center" role="alert">Product not found!</div>';
        return;
    }

    // Populate Product Details
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescriptionLead').textContent = product.description;
    document.getElementById('productPrice').innerHTML = `₹${product.price.toLocaleString('en-IN')}`; // Adjusted currency symbol
    
    // Check if discount exists
    if (product.discount) {
        const discountSpan = document.createElement('span');
        discountSpan.className = 'badge bg-danger ms-2';
        discountSpan.textContent = `${product.discount}% OFF`;
        document.getElementById('productPrice').appendChild(discountSpan);
    }

    const addToCartBtnDetail = document.getElementById('addToCartBtnDetail');
    if (addToCartBtnDetail) {
        addToCartBtnDetail.dataset.productId = product.id;
        addToCartBtnDetail.addEventListener('click', () => {
            // Use the global addProductCardEventListeners functionality for detail page button
            // Or call addToCart directly (which is already linked via addProductCardEventListeners)
            let currentCart = getCart();
            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                currentCart[existingItemIndex].quantity += 1;
            } else {
                currentCart.push({ id: product.id, name: product.name, price: product.price, image: product.image || product.img, quantity: 1, stock: product.stock });
            }
            setCart(currentCart);
            updateCartAndWishlistBadges();
            
        });
    }

    const addToWishlistBtnDetail = document.getElementById('addToWishlistBtnDetail');
    if (addToWishlistBtnDetail) {
        addToWishlistBtnDetail.dataset.productId = product.id;
        addToWishlistBtnDetail.addEventListener('click', (e) => {
             // Directly call the toggleWishlist logic for detail page
            let currentWishlist = getWishlist();
            const existingItemIndex = currentWishlist.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                currentWishlist.splice(existingItemIndex, 1);
                alert(`${product.name} removed from wishlist.`);
            } else {
                currentWishlist.push(product); // Add full product to wishlist
                alert(`${product.name} added to wishlist!`);
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
        // Set initial state of wishlist button
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
                <img src="${img}" class="d-block w-100 rounded shadow-sm" alt="${product.name} Image ${index + 1}">
            </div>
        `).join('');
        thumbnailsContainer.innerHTML = product.detailImages.map((img, index) => `
            <img src="${img.replace('600x400', '100x70')}" class="img-thumbnail me-2" style="width: 100px; height: 70px; object-fit: cover; cursor: pointer;" data-bs-target="#productCarousel" data-bs-slide-to="${index}" alt="Thumbnail ${index + 1}">
        `).join('');
    } else if (carouselInner) {
         // Fallback if no detail images, use main image
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img src="${product.image || product.img}" class="d-block w-100 rounded shadow-sm" alt="${product.name}">
            </div>
        `;
        if (thumbnailsContainer) thumbnailsContainer.innerHTML = ''; // Clear thumbnails if none
    }


    // Description Tab
    document.getElementById('description').innerHTML = `<p>${product.description}</p>`;

    // Specifications Tab
    const specificationsContainer = document.getElementById('specifications');
    if (specificationsContainer && product.specifications && product.specifications.length > 0) {
        specificationsContainer.innerHTML = `
            <ul class="list-group list-group-flush">
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
                    <div class="card h-100 shadow-sm">
                        <img src="${relProduct.image || relProduct.img}" class="card-img-top" alt="${relProduct.name}">
                        <div class="card-body text-center">
                            <h6 class="card-title">${relProduct.name}</h6>
                            <p class="card-text text-muted">₹${relProduct.price.toLocaleString('en-IN')}</p>
                            <a href="product-detail.html?id=${relProduct.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                        </div>
                    </div>
                </div>
            `).join('');
            // No need for addProductCardEventListeners here, as these are typically just view links
        } else {
            // If no related products, hide the section
            const relatedProductsSection = document.querySelector('.mt-5.mb-4 + .row'); // Assuming the heading is just before the row
            if (relatedProductsSection) relatedProductsSection.previousElementSibling.remove(); // Remove heading
            if (relatedProductsContainer) relatedProductsContainer.remove(); // Remove container
        }
    }
}


// 4. Cart Page Specifics
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalSpan = document.getElementById('cartSubtotal'); // Re-using elements from previous HTML structure
    const cartShippingSpan = document.getElementById('cartShipping');
    const cartTaxSpan = document.getElementById('cartTax');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartTitle = document.getElementById('cartTitle');
    const emptyCartMessage = document.getElementById('emptyCartMessage'); // Element to show/hide for empty cart
    const updateCartBtn = document.getElementById('updateCartBtn'); // The 'Update Cart' button
    const checkoutBtn = document.getElementById('checkoutBtn'); // The 'Proceed to Checkout' button

    let currentCart = getCart();

    if (!cartItemsContainer) return; // Exit if not on cart page or elements not found

    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (currentCart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
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
        if (updateCartBtn) updateCartBtn.style.display = 'inline-block';
        if (checkoutBtn) checkoutBtn.classList.remove('disabled'); // Enable checkout button
        if (cartTitle) cartTitle.textContent = `Your Shopping Cart (${currentCart.length} items)`;
    }

    currentCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id); // Find full product details
        if (product) {
            const itemTotalPrice = (product.price * cartItem.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

            const cartItemHtml = `
                <div class="row align-items-center mb-3 pb-3 border-bottom cart-item" data-product-id="${product.id}">
                    <div class="col-md-2 col-4">
                        <img src="${product.image || product.img}" class="img-fluid rounded" alt="${product.name}">
                    </div>
                    <div class="col-md-4 col-8">
                        <h5 class="mb-0">${product.name}</h5>
                        <small class="text-muted">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}</small>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0">
                        <span class="fw-bold">₹${product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0">
                        <input type="number" class="form-control form-control-sm quantity-input" value="${cartItem.quantity}" min="1" max="${product.stock || 99}" data-product-id="${product.id}">
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0 text-end">
                        <span class="fw-bold item-total-price">${itemTotalPrice}</span>
                        <button class="btn btn-danger btn-sm ms-2 remove-from-cart-btn" data-product-id="${product.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
        } else {
            console.warn(`Product with ID ${cartItem.id} not found in products data. Removing from cart.`);
            // If product not found in main products list, it means it's outdated or invalid.
            // Remove it from the cart. This needs to be done carefully to avoid infinite loops.
            // It's better to remove it *before* rendering, in the getCart() or when loading cart.
            // For now, it will just not render. A better approach would be to filter out invalid items from cart on load.
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
            // No explicit action needed if quantity changes already re-render.
            // This button could be used to re-calculate only if you stop individual updates from re-rendering.
            renderCart(); // Force re-render to ensure all totals are fresh
            updateCartAndWishlistBadges();
            alert("Cart updated!");
        });
    }

    calculateCartSummary(); // Calculate and display summary
}

function updateCartItemQuantity(productId, newQuantity) {
    let currentCart = getCart();
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            currentCart.splice(itemIndex, 1); // Remove if quantity is 0 or less
        } else {
            const product = products.find(p => p.id === productId);
            if (product && newQuantity > product.stock) {
                alert(`Sorry, only ${product.stock} units of ${product.name} are available.`);
                currentCart[itemIndex].quantity = product.stock; // Set to max available stock
            } else {
                currentCart[itemIndex].quantity = newQuantity;
            }
        }
        setCart(currentCart);
        renderCart(); // Re-render the cart to update totals and display
        updateCartAndWishlistBadges(); // Update navbar badge
    }
}

function removeCartItem(productId) {
    let currentCart = getCart();
    currentCart = currentCart.filter(item => item.id !== productId);
    setCart(currentCart);
    renderCart(); // Re-render the cart
    updateCartAndWishlistBadges(); // Update navbar badge
}

function calculateCartSummary() {
    const currentCart = getCart();

    const cartSubtotalSpan = document.getElementById('cartSubtotal');
    const cartShippingSpan = document.getElementById('cartShipping');
    const cartTaxSpan = document.getElementById('cartTax');
    const cartTotalSpan = document.getElementById('cartTotal');

    if (!cartSubtotalSpan) return; // Exit if elements not found

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

    cartSubtotalSpan.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    cartShippingSpan.textContent = `₹${shipping.toLocaleString('en-IN')}`;
    cartTaxSpan.textContent = `₹${tax.toFixed(2)}`; // Fixed to 2 decimal places for tax
    cartTotalSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
}


// 5. Wishlist Page Specifics
function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlistContainer');
    let currentWishlist = getWishlist();

    if (!wishlistContainer) return; // Exit if not on wishlist page

    if (currentWishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="col-12 text-center p-5">
                <p class="lead">Your wishlist is empty! Add items you love to save them for later.</p>
                <a href="product-listing.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    wishlistContainer.innerHTML = currentWishlist.map(item => {
        const product = products.find(p => p.id === item.id); // Get full product details for stock
        const isStockAvailable = product && product.stock > 0;
        const isInWishlist = getWishlist().some(wishItem => wishItem.id === item.id); // Check current state for button

        return `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${item.image || item.img}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text text-muted">₹${item.price.toLocaleString('en-IN')} ${!isStockAvailable ? '<span class="badge bg-danger ms-2">Out of Stock</span>' : ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="product-detail.html?id=${item.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                            ${isStockAvailable ? `<button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${item.id}"><i class="bi bi-cart"></i> Add to Cart</button>` : `<button class="btn btn-secondary btn-sm" disabled><i class="bi bi-cart"></i> Out of Stock</button>`}
                            <button class="btn btn-${isInWishlist ? 'danger' : 'outline-secondary'} toggle-wishlist-btn" data-product-id="${item.id}"><i class="bi bi-trash"></i> Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach event listeners for buttons within wishlist items
    addProductCardEventListeners(wishlistContainer); // This handles both add to cart and toggle wishlist
}

function renderCheckoutCart() {
    const cartItemsContainer = document.getElementById('checkoutCartItemsContainer') || document.getElementById('cartItemsContainer');
    const cartSubtotalSpan = document.getElementById('checkoutCartSubtotal') || document.getElementById('cartSubtotal');
    const cartShippingSpan = document.getElementById('checkoutCartShipping') || document.getElementById('cartShipping');
    const cartTaxSpan = document.getElementById('checkoutCartTax') || document.getElementById('cartTax');
    const cartTotalSpan = document.getElementById('checkoutCartTotal') || document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('checkoutEmptyCartMessage') || document.getElementById('emptyCartMessage');
    const checkoutTitle = document.getElementById('checkoutCartTitle') || document.getElementById('cartTitle');

    let currentCart = getCart();

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (currentCart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (checkoutTitle) checkoutTitle.textContent = "Your Order Summary (0 items)";
        if (cartSubtotalSpan) cartSubtotalSpan.textContent = '₹0.00';
        if (cartShippingSpan) cartShippingSpan.textContent = '₹0.00';
        if (cartTaxSpan) cartTaxSpan.textContent = '₹0.00';
        if (cartTotalSpan) cartTotalSpan.textContent = '₹0.00';
        return;
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (checkoutTitle) checkoutTitle.textContent = `Your Order Summary (${currentCart.length} items)`;
    }

    currentCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            const itemTotalPrice = (product.price * cartItem.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

            const cartItemHtml = `
                <div class="row align-items-center mb-3 pb-3 border-bottom checkout-cart-item" data-product-id="${product.id}">
                    <div class="col-md-2 col-4">
                        <img src="${product.image || product.img}" class="img-fluid rounded" alt="${product.name}">
                    </div>
                    <div class="col-md-4 col-8">
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">Quantity: ${cartItem.quantity}</small>
                    </div>
                    <div class="col-md-2 col-4 mt-3 mt-md-0">
                        <span class="fw-bold">₹${product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="col-md-4 col-8 mt-3 mt-md-0 text-end">
                        <span class="fw-bold item-total-price">${itemTotalPrice}</span>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
        }
    });

    calculateCartSummary();
}

// script.js (add this function)

// 6. Checkout Page Specifics
function renderCheckoutSummary() {
    const checkoutCartItemCount = document.getElementById('checkoutCartItemCount');
    const checkoutCartItemsContainer = document.getElementById('checkoutCartItemsContainer');
    const checkoutEmptyCartMessage = document.getElementById('checkoutEmptyCartMessage');
    const checkoutCartSubtotal = document.getElementById('checkoutCartSubtotal');
    const checkoutCartShipping = document.getElementById('checkoutCartShipping');
    const checkoutCartTax = document.getElementById('checkoutCartTax');
    const checkoutCartTotal = document.getElementById('checkoutCartTotal');
    const checkoutSubmitButton = document.getElementById('checkoutSubmitButton'); // The bottom button

    // Ensure all target elements exist before proceeding
    if (!checkoutCartItemsContainer || !checkoutCartItemCount || !checkoutCartSubtotal) {
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
        const product = products.find(p => p.id === cartItem.id); // Find full product details from 'products' array
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
                <span class="text-muted">₹${itemTotalPrice.toLocaleString('en-IN')}</span>
            `;
            checkoutCartItemsContainer.appendChild(listItem);
        } else {
            console.warn(`Product with ID ${cartItem.id} not found in global products array for checkout summary.`);
            // Optionally remove invalid items from cart here if they shouldn't persist
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
    checkoutCartTax.textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`; // Use toLocaleString for tax too
    checkoutCartTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartAndWishlistBadges();

    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/') {
        renderHomePageFeaturedProducts();
    } else if (path.includes('product-listing.html')) {
        filterAndRenderProducts();

        const categoryCheckboxes = document.querySelectorAll('.category-filter-checkbox');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                currentPage = 1;
                filterAndRenderProducts();
            });
        });
        if (minPriceInput) minPriceInput.addEventListener('change', () => { currentPage = 1; filterAndRenderProducts(); });
        if (maxPriceInput) maxPriceInput.addEventListener('change', () => { currentPage = 1; filterAndRenderProducts(); });
        if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', () => { currentPage = 1; filterAndRenderProducts(); });


        if (sortOptions && sortDropdownToggle) {
            sortOptions.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('dropdown-item') && target.dataset.sortBy) {
                    currentSortBy = target.dataset.sortBy;
                    sortDropdownToggle.textContent = `Sort By: ${target.textContent}`;
                    currentPage = 1;
                    applySorting();
                }
            });
        }
    } else if (path.includes('product-detail.html')) {
        renderProductDetail();
    } else if (path.includes('cart.html')) {
        renderCart();
    } else if (path.includes('wishlist.html')) {
        renderWishlist();
    } else if (path.includes('checkout.html')) {
        renderCheckoutCart();
    }
});


// --- Initialize on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartAndWishlistBadges(); // Always update badges on all pages

    // Determine which page we are on and call relevant render functions
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/') {
        renderHomePageFeaturedProducts();
    } else if (path.includes('product-listing.html')) {
        // Initial render for product listing page
        // applyFilters() will call applySorting() which calls renderProducts()
        filterAndRenderProducts();

        // Event Listeners for Filters
        const categoryCheckboxes = document.querySelectorAll('.category-filter-checkbox');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                currentPage = 1; // Reset page on filter change
                filterAndRenderProducts();
            });
        });
        if (minPriceInput) minPriceInput.addEventListener('change', () => { currentPage = 1; filterAndRenderProducts(); });
        if (maxPriceInput) maxPriceInput.addEventListener('change', () => { currentPage = 1; filterAndRenderProducts(); });
        if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', () => { currentPage = 1; filterAndRenderProducts(); });


        // Event Listener for Sorting
        if (sortOptions && sortDropdownToggle) {
            sortOptions.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('dropdown-item') && target.dataset.sortBy) {
                    currentSortBy = target.dataset.sortBy;
                    sortDropdownToggle.textContent = `Sort By: ${target.textContent}`;
                    currentPage = 1; // Reset page on sort change
                    applySorting(); // Apply sorting and re-render
                }
            });
        }
    } else if (path.includes('product-detail.html')) {
        renderProductDetail();
    } else if (path.includes('cart.html')) {
        renderCart();
    } else if (path.includes('wishlist.html')) {
        renderWishlist();
    } else if (path.includes('checkout.html')) { // <-- ADD THIS BLOCK
        renderCheckoutSummary(); // Render checkout summary when on checkout page
    }
});


// Removed redundant addToCart and toggleWishlist functions from the bottom,
// as the addProductCardEventListeners handles this centrally now.