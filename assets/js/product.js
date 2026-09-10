/* =========================================================
   GLOWSKIN — PRODUCT DETAILS PAGE
   File: assets/js/product.js
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       STORAGE
    ===================================================== */

    const CART_KEY = "glowskin_cart";
    const WISHLIST_KEY = "glowskin_wishlist";


    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY));
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }


    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }


    function getWishlist() {
        try {
            const wishlist = JSON.parse(
                localStorage.getItem(WISHLIST_KEY)
            );

            return Array.isArray(wishlist) ? wishlist : [];
        } catch (error) {
            return [];
        }
    }


    function saveWishlist(wishlist) {
        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(wishlist)
        );
    }


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const products = {

        "vitamin-c-brightening-serum": {
            id: "vitamin-c-brightening-serum",
            name: "Vitamin C Brightening Serum",
            category: "serums",
            categoryName: "Serums",
            price: 599,
            mrp: 799,
            rating: 4.8,
            reviews: 124,

            description:
                "A lightweight Vitamin C serum that helps brighten dull skin and improve the appearance of dark spots for a healthy, glowing complexion.",

            images: [
                "assets/images/products/vitamin-c-serum-1.jpg",
                "assets/images/products/vitamin-c-serum-2.jpg",
                "assets/images/products/vitamin-c-serum-3.jpg",
                "assets/images/products/vitamin-c-serum-4.jpg"
            ]
        },


        "daily-sunscreen-spf-50": {
            id: "daily-sunscreen-spf-50",
            name: "Daily Sunscreen SPF 50",
            category: "sunscreen",
            categoryName: "Sunscreen",
            price: 479,
            mrp: 599,
            rating: 4.8,
            reviews: 98,

            description:
                "A lightweight daily sunscreen with SPF 50 protection that helps protect your skin from harmful UV rays.",

            images: [
                "assets/images/products/sunscreen-1.jpg",
                "assets/images/products/sunscreen-2.jpg",
                "assets/images/products/sunscreen-3.jpg"
            ]
        },


        "niacinamide-pore-serum": {
            id: "niacinamide-pore-serum",
            name: "Niacinamide Pore Serum",
            category: "serums",
            categoryName: "Serums",
            price: 549,
            mrp: 699,
            rating: 4.7,
            reviews: 86,

            description:
                "A lightweight niacinamide serum designed to help improve the appearance of pores and uneven skin texture.",

            images: [
                "assets/images/products/niacinamide-serum-1.jpg",
                "assets/images/products/niacinamide-serum-2.jpg",
                "assets/images/products/niacinamide-serum-3.jpg"
            ]
        },


        "daily-hydrating-moisturizer": {
            id: "daily-hydrating-moisturizer",
            name: "Daily Hydrating Moisturizer",
            category: "moisturizers",
            categoryName: "Moisturizers",
            price: 449,
            mrp: 549,
            rating: 4.6,
            reviews: 72,

            description:
                "A daily moisturizer that provides lightweight hydration and helps keep skin soft and comfortable.",

            images: [
                "assets/images/products/moisturizer-1.jpg",
                "assets/images/products/moisturizer-2.jpg",
                "assets/images/products/moisturizer-3.jpg"
            ]
        },


        "gentle-foaming-face-wash": {
            id: "gentle-foaming-face-wash",
            name: "Gentle Foaming Face Wash",
            category: "face-wash",
            categoryName: "Face Wash",
            price: 349,
            mrp: 449,
            rating: 4.7,
            reviews: 91,

            description:
                "A gentle foaming cleanser that removes dirt and excess oil without leaving the skin feeling dry.",

            images: [
                "assets/images/products/face-wash-1.jpg",
                "assets/images/products/face-wash-2.jpg",
                "assets/images/products/face-wash-3.jpg"
            ]
        },


        "hydrating-hyaluronic-serum": {
            id: "hydrating-hyaluronic-serum",
            name: "Hydrating Hyaluronic Serum",
            category: "serums",
            categoryName: "Serums",
            price: 699,
            mrp: 849,
            rating: 4.8,
            reviews: 65,

            description:
                "A hydrating serum formulated to provide moisture and help skin feel smoother and plumper.",

            images: [
                "assets/images/products/hyaluronic-serum-1.jpg",
                "assets/images/products/hyaluronic-serum-2.jpg",
                "assets/images/products/hyaluronic-serum-3.jpg"
            ]
        },


        "brightening-face-cleanser": {
            id: "brightening-face-cleanser",
            name: "Brightening Face Cleanser",
            category: "face-wash",
            categoryName: "Face Wash",
            price: 399,
            mrp: 499,
            rating: 4.6,
            reviews: 54,

            description:
                "A refreshing face cleanser that gently cleanses the skin and helps maintain a fresh-looking complexion.",

            images: [
                "assets/images/products/brightening-cleanser-1.jpg",
                "assets/images/products/brightening-cleanser-2.jpg"
            ]
        },


        "barrier-repair-moisturizer": {
            id: "barrier-repair-moisturizer",
            name: "Barrier Repair Moisturizer",
            category: "moisturizers",
            categoryName: "Moisturizers",
            price: 799,
            mrp: 949,
            rating: 4.9,
            reviews: 47,

            description:
                "A nourishing moisturizer designed to support the skin barrier and provide long-lasting hydration.",

            images: [
                "assets/images/products/barrier-moisturizer-1.jpg",
                "assets/images/products/barrier-moisturizer-2.jpg"
            ]
        },


        "hydrating-rose-toner": {
            id: "hydrating-rose-toner",
            name: "Hydrating Rose Toner",
            category: "toners",
            categoryName: "Toners",
            price: 429,
            mrp: 499,
            rating: 4.6,
            reviews: 38,

            description:
                "A refreshing rose toner that helps hydrate and refresh the skin after cleansing.",

            images: [
                "assets/images/products/rose-toner-1.jpg",
                "assets/images/products/rose-toner-2.jpg"
            ]
        },


        "acne-control-face-wash": {
            id: "acne-control-face-wash",
            name: "Acne Control Face Wash",
            category: "face-wash",
            categoryName: "Face Wash",
            price: 499,
            mrp: 599,
            rating: 4.7,
            reviews: 81,

            description:
                "A cleansing face wash designed for oily and acne-prone skin.",

            images: [
                "assets/images/products/acne-face-wash-1.jpg",
                "assets/images/products/acne-face-wash-2.jpg"
            ]
        },


        "spf-50-matte-sunscreen": {
            id: "spf-50-matte-sunscreen",
            name: "SPF 50 Matte Sunscreen",
            category: "sunscreen",
            categoryName: "Sunscreen",
            price: 599,
            mrp: 699,
            rating: 4.8,
            reviews: 76,

            description:
                "A lightweight matte sunscreen designed for everyday UV protection without a heavy feeling.",

            images: [
                "assets/images/products/matte-sunscreen-1.jpg",
                "assets/images/products/matte-sunscreen-2.jpg"
            ]
        },


        "nourishing-lip-care-balm": {
            id: "nourishing-lip-care-balm",
            name: "Nourishing Lip Care Balm",
            category: "lip-care",
            categoryName: "Lip Care",
            price: 299,
            mrp: 349,
            rating: 4.7,
            reviews: 43,

            description:
                "A nourishing lip balm that helps keep lips soft, smooth and moisturized.",

            images: [
                "assets/images/products/lip-balm-1.jpg",
                "assets/images/products/lip-balm-2.jpg"
            ]
        }

    };


    /* =====================================================
       GET PRODUCT FROM URL
       Example:
       product.html?product=vitamin-c-brightening-serum
    ===================================================== */

    const urlParams = new URLSearchParams(
        window.location.search
    );

    const productSlug =
        urlParams.get("product") ||
        "vitamin-c-brightening-serum";


    let currentProduct =
        products[productSlug] ||
        products["vitamin-c-brightening-serum"];


    let currentImageIndex = 0;


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const mainImage =
        document.getElementById("mainProductImage");

    const productName =
        document.getElementById("productName");

    const productCategory =
        document.getElementById("productCategory");

    const productPrice =
        document.getElementById("productPrice");

    const productMRP =
        document.getElementById("productMRP");

    const productDiscount =
        document.getElementById("productDiscount");

    const productDescription =
        document.getElementById("productDescription");

    const productRating =
        document.getElementById("productRating");

    const reviewCount =
        document.getElementById("reviewCount");

    const breadcrumbProduct =
        document.getElementById("breadcrumbProduct");

    const productQuantity =
        document.getElementById("productQuantity");

    const wishlistButton =
        document.getElementById("productWishlistBtn");

    const cartButton =
        document.getElementById("addToCartBtn");

    const buyNowButton =
        document.getElementById("buyNowBtn");

    const thumbnails =
        document.getElementById("productThumbnails");

    const cartCount =
        document.getElementById("cartCount");

    const wishlistCount =
        document.getElementById("wishlistCount");

    const cartToast =
        document.getElementById("cartToast");

    const toastProductName =
        document.getElementById("toastProductName");


    /* =====================================================
       CALCULATE DISCOUNT
    ===================================================== */

    function calculateDiscount(price, mrp) {

        if (!mrp || mrp <= price) {
            return 0;
        }

        return Math.round(
            ((mrp - price) / mrp) * 100
        );
    }


    /* =====================================================
       UPDATE COUNTS
    ===================================================== */

    function updateCounts() {

        const cart = getCart();
        const wishlist = getWishlist();


        if (cartCount) {

            const totalItems = cart.reduce(
                (total, item) => {
                    return total + (Number(item.quantity) || 1);
                },
                0
            );

            cartCount.textContent = totalItems;
        }


        if (wishlistCount) {
            wishlistCount.textContent =
                wishlist.length;
        }
    }


    /* =====================================================
       LOAD PRODUCT
    ===================================================== */

    function loadProduct() {

        if (!currentProduct) {
            return;
        }


        document.title =
            `${currentProduct.name} — GlowSkin`;


        if (productName) {
            productName.textContent =
                currentProduct.name;
        }


        if (productCategory) {
            productCategory.textContent =
                currentProduct.categoryName;
        }


        if (productPrice) {
            productPrice.textContent =
                `₹${currentProduct.price}`;
        }


        if (productMRP) {

            if (currentProduct.mrp) {

                productMRP.textContent =
                    `₹${currentProduct.mrp}`;

                productMRP.style.display =
                    "inline";
            } else {

                productMRP.style.display =
                    "none";
            }
        }


        if (productDiscount) {

            const discount =
                calculateDiscount(
                    currentProduct.price,
                    currentProduct.mrp
                );

            if (discount > 0) {

                productDiscount.textContent =
                    `${discount}% OFF`;

                productDiscount.style.display =
                    "inline-flex";

            } else {

                productDiscount.style.display =
                    "none";
            }
        }


        if (productDescription) {

            productDescription.textContent =
                currentProduct.description;
        }


        if (productRating) {

            productRating.textContent =
                currentProduct.rating;
        }


        if (reviewCount) {

            reviewCount.textContent =
                currentProduct.reviews;
        }


        if (breadcrumbProduct) {

            breadcrumbProduct.textContent =
                currentProduct.name;
        }


        currentImageIndex = 0;

        loadGallery();

        updateWishlistButton();

        updateCounts();

        loadRelatedProducts();
    }


    /* =====================================================
       IMAGE GALLERY
    ===================================================== */

    function loadGallery() {

        if (!mainImage) {
            return;
        }


        if (
            !currentProduct.images ||
            currentProduct.images.length === 0
        ) {

            mainImage.style.display = "none";

            return;
        }


        mainImage.style.display = "block";

        mainImage.src =
            currentProduct.images[currentImageIndex];

        mainImage.alt =
            currentProduct.name;


        renderThumbnails();
    }


    function renderThumbnails() {

        if (!thumbnails) {
            return;
        }


        thumbnails.innerHTML = "";


        currentProduct.images.forEach(
            (image, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "product-thumbnail" +
                    (index === currentImageIndex
                        ? " active"
                        : "");

                button.dataset.image = image;

                button.innerHTML = `
                    <img
                        src="${image}"
                        alt="${currentProduct.name} image ${index + 1}"
                        loading="lazy"
                    >
                `;


                button.addEventListener(
                    "click",
                    () => {

                        currentImageIndex =
                            index;

                        loadGallery();
                    }
                );


                thumbnails.appendChild(button);
            }
        );
    }


    function nextImage() {

        if (
            !currentProduct.images ||
            currentProduct.images.length === 0
        ) {
            return;
        }


        currentImageIndex++;

        if (
            currentImageIndex >=
            currentProduct.images.length
        ) {
            currentImageIndex = 0;
        }


        loadGallery();
    }


    function previousImage() {

        if (
            !currentProduct.images ||
            currentProduct.images.length === 0
        ) {
            return;
        }


        currentImageIndex--;

        if (currentImageIndex < 0) {

            currentImageIndex =
                currentProduct.images.length - 1;
        }


        loadGallery();
    }


    const galleryNext =
        document.getElementById("galleryNext");

    const galleryPrev =
        document.getElementById("galleryPrev");


    if (galleryNext) {

        galleryNext.addEventListener(
            "click",
            nextImage
        );
    }


    if (galleryPrev) {

        galleryPrev.addEventListener(
            "click",
            previousImage
        );
    }


    /* =====================================================
       QUANTITY
    ===================================================== */

    const quantityMinus =
        document.getElementById("quantityMinus");

    const quantityPlus =
        document.getElementById("quantityPlus");


    function getQuantity() {

        if (!productQuantity) {
            return 1;
        }

        const quantity =
            parseInt(
                productQuantity.value,
                10
            );


        if (Number.isNaN(quantity)) {
            return 1;
        }


        return Math.max(
            1,
            Math.min(quantity, 10)
        );
    }


    if (quantityMinus) {

        quantityMinus.addEventListener(
            "click",
            () => {

                const quantity =
                    getQuantity();

                if (quantity > 1) {

                    productQuantity.value =
                        quantity - 1;
                }
            }
        );
    }


    if (quantityPlus) {

        quantityPlus.addEventListener(
            "click",
            () => {

                const quantity =
                    getQuantity();

                if (quantity < 10) {

                    productQuantity.value =
                        quantity + 1;
                }
            }
        );
    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addProductToCart(
        product,
        quantity
    ) {

        const cart = getCart();


        const existingProduct =
            cart.find(
                item => item.id === product.id
            );


        if (existingProduct) {

            existingProduct.quantity =
                (Number(existingProduct.quantity) || 0)
                + quantity;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                mrp: product.mrp || product.price,

                quantity: quantity,

                image:
                    product.images &&
                    product.images.length
                        ? product.images[0]
                        : "",

                category: product.category

            });
        }


        saveCart(cart);

        updateCounts();

        showCartToast(product.name);
    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                const quantity =
                    getQuantity();

                addProductToCart(
                    currentProduct,
                    quantity
                );
            }
        );
    }


    /* =====================================================
       BUY NOW
    ===================================================== */

    if (buyNowButton) {

        buyNowButton.addEventListener(
            "click",
            () => {

                const quantity =
                    getQuantity();


                addProductToCart(
                    currentProduct,
                    quantity
                );


                window.location.href =
                    "cart.html";
            }
        );
    }


    /* =====================================================
       CART TOAST
    ===================================================== */

    let toastTimer;


    function showCartToast(name) {

        if (!cartToast) {
            return;
        }


        if (toastProductName) {

            toastProductName.textContent =
                name;
        }


        cartToast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(
                () => {

                    cartToast.classList.remove(
                        "show"
                    );

                },
                3000
            );
    }


    /* =====================================================
       WISHLIST
    ===================================================== */

    function updateWishlistButton() {

        if (!wishlistButton) {
            return;
        }


        const wishlist =
            getWishlist();


        const exists =
            wishlist.some(
                item => {

                    if (
                        typeof item === "string"
                    ) {
                        return item === currentProduct.id;
                    }

                    return item.id === currentProduct.id;
                }
            );


        if (exists) {

            wishlistButton.classList.add(
                "active"
            );

            wishlistButton.textContent =
                "♥";

        } else {

            wishlistButton.classList.remove(
                "active"
            );

            wishlistButton.textContent =
                "♡";
        }
    }


    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            () => {

                let wishlist =
                    getWishlist();


                const index =
                    wishlist.findIndex(
                        item => {

                            if (
                                typeof item === "string"
                            ) {
                                return (
                                    item ===
                                    currentProduct.id
                                );
                            }

                            return (
                                item.id ===
                                currentProduct.id
                            );
                        }
                    );


                if (index !== -1) {

                    wishlist.splice(
                        index,
                        1
                    );

                } else {

                    wishlist.push({

                        id: currentProduct.id,

                        name:
                            currentProduct.name,

                        price:
                            currentProduct.price,

                        image:
                            currentProduct.images[0] || ""

                    });
                }


                saveWishlist(wishlist);

                updateWishlistButton();

                updateCounts();
            }
        );
    }


    /* =====================================================
       RELATED PRODUCTS
    ===================================================== */

    function loadRelatedProducts() {

        const container =
            document.getElementById(
                "relatedProducts"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const relatedProducts =
            Object.values(products)
                .filter(
                    product =>
                        product.id !==
                        currentProduct.id &&
                        product.category ===
                        currentProduct.category
                )
                .slice(0, 4);


        if (relatedProducts.length === 0) {

            container.innerHTML =
                "<p>No related products found.</p>";

            return;
        }


        relatedProducts.forEach(
            product => {

                const card =
                    document.createElement("article");


                card.className =
                    "related-product-card";


                const image =
                    product.images &&
                    product.images.length
                        ? product.images[0]
                        : "";


                const discount =
                    calculateDiscount(
                        product.price,
                        product.mrp
                    );


                card.innerHTML = `

                    <a
                        href="product.html?product=${encodeURIComponent(product.id)}"
                        class="related-product-link"
                        aria-label="View ${escapeHtml(product.name)}"
                    >

                        <div class="related-product-image">

                            <img
                                src="${image}"
                                alt="${escapeHtml(product.name)}"
                                loading="lazy"
                            >

                        </div>

                    </a>


                    <div class="related-product-info">

                        <div class="related-product-category">
                            ${escapeHtml(product.categoryName)}
                        </div>

                        <h3>
                            ${escapeHtml(product.name)}
                        </h3>

                        <div class="related-product-price">

                            <strong>
                                ₹${product.price}
                            </strong>

                            ${
                                product.mrp &&
                                product.mrp > product.price
                                    ? `
                                        <del>
                                            ₹${product.mrp}
                                        </del>
                                      `
                                    : ""
                            }

                        </div>

                    </div>
                `;


                container.appendChild(card);
            }
        );
    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       PRODUCT TABS
    ===================================================== */

    const productTabs =
        document.querySelectorAll(
            ".product-tab"
        );


    const tabContents =
        document.querySelectorAll(
            ".product-tab-content"
        );


    productTabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.tab;


                    productTabs.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    tabContents.forEach(
                        content => {

                            content.classList.remove(
                                "active"
                            );
                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const targetContent =
                        document.getElementById(
                            target
                        );


                    if (targetContent) {

                        targetContent.classList.add(
                            "active"
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       KEYBOARD GALLERY CONTROL
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "ArrowRight"
            ) {

                nextImage();
            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousImage();
            }
        }
    );


    /* =====================================================
       IMAGE FALLBACK
    ===================================================== */

    if (mainImage) {

        mainImage.addEventListener(
            "error",
            () => {

                mainImage.onerror = null;

                mainImage.src =
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="600"
                            height="600"
                            viewBox="0 0 600 600"
                        >
                            <rect
                                width="600"
                                height="600"
                                fill="#f8f4f1"
                            />
                            <text
                                x="300"
                                y="290"
                                text-anchor="middle"
                                font-family="Arial"
                                font-size="28"
                                fill="#8f5b45"
                            >
                                GlowSkin
                            </text>
                            <text
                                x="300"
                                y="330"
                                text-anchor="middle"
                                font-family="Arial"
                                font-size="16"
                                fill="#999"
                            >
                                Product Image
                            </text>
                        </svg>
                    `);
            }
        );
    }


    /* =====================================================
       MOBILE SWIPE FOR IMAGE GALLERY
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    if (mainImage) {

        mainImage.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;
            },
            {
                passive: true
            }
        );


        mainImage.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                handleSwipe();
            },
            {
                passive: true
            }
        );
    }


    function handleSwipe() {

        const difference =
            touchEndX - touchStartX;


        if (Math.abs(difference) < 50) {
            return;
        }


        if (difference < 0) {

            nextImage();

        } else {

            previousImage();
        }
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        loadProduct();

        updateCounts();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
