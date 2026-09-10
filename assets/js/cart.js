/* =========================================================
   GLOWSKIN — CART PAGE JAVASCRIPT
   File: assets/js/cart.js
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       STORAGE
    ===================================================== */

    const CART_KEY = "glowskin_cart";
    const WISHLIST_KEY = "glowskin_wishlist";


    /* =====================================================
       PRODUCT DATA
       Same products used in Product Details page
    ===================================================== */

    const products = {

        "vitamin-c-brightening-serum": {
            id: "vitamin-c-brightening-serum",
            name: "Vitamin C Brightening Serum",
            category: "Serums",
            price: 599,
            mrp: 799,
            image: "assets/images/products/vitamin-c-serum-1.jpg"
        },

        "daily-sunscreen-spf-50": {
            id: "daily-sunscreen-spf-50",
            name: "Daily Sunscreen SPF 50",
            category: "Sunscreen",
            price: 479,
            mrp: 599,
            image: "assets/images/products/sunscreen-1.jpg"
        },

        "niacinamide-pore-serum": {
            id: "niacinamide-pore-serum",
            name: "Niacinamide Pore Serum",
            category: "Serums",
            price: 549,
            mrp: 699,
            image: "assets/images/products/niacinamide-serum-1.jpg"
        },

        "daily-hydrating-moisturizer": {
            id: "daily-hydrating-moisturizer",
            name: "Daily Hydrating Moisturizer",
            category: "Moisturizers",
            price: 449,
            mrp: 599,
            image: "assets/images/products/moisturizer-1.jpg"
        },

        "gentle-foaming-face-wash": {
            id: "gentle-foaming-face-wash",
            name: "Gentle Foaming Face Wash",
            category: "Face Wash",
            price: 349,
            mrp: 449,
            image: "assets/images/products/face-wash-1.jpg"
        },

        "hydrating-hyaluronic-serum": {
            id: "hydrating-hyaluronic-serum",
            name: "Hydrating Hyaluronic Serum",
            category: "Serums",
            price: 699,
            mrp: 899,
            image: "assets/images/products/hyaluronic-serum-1.jpg"
        },

        "brightening-face-cleanser": {
            id: "brightening-face-cleanser",
            name: "Brightening Face Cleanser",
            category: "Face Wash",
            price: 399,
            mrp: 499,
            image: "assets/images/products/brightening-cleanser-1.jpg"
        },

        "barrier-repair-moisturizer": {
            id: "barrier-repair-moisturizer",
            name: "Barrier Repair Moisturizer",
            category: "Moisturizers",
            price: 799,
            mrp: 999,
            image: "assets/images/products/barrier-moisturizer-1.jpg"
        },

        "hydrating-rose-toner": {
            id: "hydrating-rose-toner",
            name: "Hydrating Rose Toner",
            category: "Toners",
            price: 429,
            mrp: 549,
            image: "assets/images/products/rose-toner-1.jpg"
        },

        "acne-control-face-wash": {
            id: "acne-control-face-wash",
            name: "Acne Control Face Wash",
            category: "Face Wash",
            price: 499,
            mrp: 599,
            image: "assets/images/products/acne-face-wash-1.jpg"
        },

        "spf-50-matte-sunscreen": {
            id: "spf-50-matte-sunscreen",
            name: "SPF 50 Matte Sunscreen",
            category: "Sunscreen",
            price: 599,
            mrp: 699,
            image: "assets/images/products/matte-sunscreen-1.jpg"
        },

        "nourishing-lip-care-balm": {
            id: "nourishing-lip-care-balm",
            name: "Nourishing Lip Care Balm",
            category: "Lip Care",
            price: 299,
            mrp: 399,
            image: "assets/images/products/lip-balm-1.jpg"
        }

    };


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const cartLayout = document.getElementById("cartLayout");
    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");

    const cartItemLabel = document.getElementById("cartItemLabel");

    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartShipping = document.getElementById("cartShipping");
    const cartDiscount = document.getElementById("cartDiscount");
    const cartTotal = document.getElementById("cartTotal");

    const discountRow = document.getElementById("discountRow");

    const freeShippingMessage =
        document.getElementById("freeShippingMessage");

    const couponInput =
        document.getElementById("couponInput");

    const applyCoupon =
        document.getElementById("applyCoupon");

    const couponMessage =
        document.getElementById("couponMessage");

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    const cartToast =
        document.getElementById("cartToast");

    const toastMessage =
        document.getElementById("toastMessage");


    /* =====================================================
       STATE
    ===================================================== */

    let cart = [];
    let appliedCoupon = null;


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function readStorage(key, fallback = []) {

        try {

            const data = localStorage.getItem(key);

            if (!data) {
                return fallback;
            }

            const parsed = JSON.parse(data);

            return Array.isArray(parsed)
                ? parsed
                : fallback;

        } catch (error) {

            console.error(
                `Could not read ${key}:`,
                error
            );

            return fallback;
        }
    }


    function saveCart() {

        try {

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Could not save cart:",
                error
            );
        }
    }


    /* =====================================================
       NORMALIZE CART
    ===================================================== */

    function normalizeCart() {

        cart = cart
            .map(item => {

                /*
                 Supports both:
                 { id, quantity }
                 and older format:
                 { productName, productPrice }
                */

                let id = item.id;

                if (!id && item.productName) {

                    const found = Object.values(products)
                        .find(product =>
                            product.name === item.productName
                        );

                    if (found) {
                        id = found.id;
                    }
                }

                const product = products[id];

                if (!product) {
                    return null;
                }

                let quantity = Number(item.quantity);

                if (!Number.isFinite(quantity)) {
                    quantity = 1;
                }

                quantity = Math.max(
                    1,
                    Math.min(10, Math.floor(quantity))
                );

                return {
                    id: product.id,
                    quantity
                };

            })
            .filter(Boolean);

        saveCart();
    }


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(value) {

        return "₹" + Number(value).toLocaleString("en-IN");
    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateHeaderCounts() {

        const cartCount =
            document.getElementById("cartCount");

        const wishlistCount =
            document.getElementById("wishlistCount");

        const totalItems = cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (wishlistCount) {

            const wishlist =
                readStorage(WISHLIST_KEY);

            wishlistCount.textContent =
                wishlist.length;
        }
    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;

    function showToast(message) {

        if (!cartToast) {
            return;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        cartToast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            cartToast.classList.remove("show");

        }, 2500);
    }


    /* =====================================================
       CALCULATE SUBTOTAL
    ===================================================== */

    function calculateSubtotal() {

        return cart.reduce(
            (total, item) => {

                const product =
                    products[item.id];

                if (!product) {
                    return total;
                }

                return total +
                    product.price * item.quantity;

            },
            0
        );
    }


    /* =====================================================
       SHIPPING
    ===================================================== */

    function calculateShipping(subtotal) {

        /*
         Free shipping above ₹999
         Otherwise ₹49
        */

        if (subtotal <= 0) {
            return 0;
        }

        if (subtotal >= 999) {
            return 0;
        }

        return 49;
    }


    /* =====================================================
       COUPON
    ===================================================== */

    function calculateDiscount(subtotal) {

        if (!appliedCoupon) {
            return 0;
        }

        /*
         GLOW10
         10% discount
         Minimum order ₹499
         Maximum discount ₹200
        */

        if (appliedCoupon === "GLOW10") {

            if (subtotal < 499) {
                return 0;
            }

            return Math.min(
                Math.round(subtotal * 0.10),
                200
            );
        }

        return 0;
    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        if (!cartItems) {
            return;
        }

        if (cart.length === 0) {

            if (cartLayout) {
                cartLayout.style.display = "none";
            }

            if (emptyCart) {
                emptyCart.classList.add("show");
            }

            updateSummary();

            updateHeaderCounts();

            return;
        }


        if (cartLayout) {
            cartLayout.style.display = "grid";
        }

        if (emptyCart) {
            emptyCart.classList.remove("show");
        }


        cartItems.innerHTML = "";


        cart.forEach((item, index) => {

            const product =
                products[item.id];

            if (!product) {
                return;
            }


            const itemTotal =
                product.price * item.quantity;


            const discountPercent =
                product.mrp > product.price
                    ? Math.round(
                        ((product.mrp - product.price) /
                            product.mrp) * 100
                    )
                    : 0;


            const article =
                document.createElement("article");

            article.className = "cart-item";

            article.dataset.id = product.id;


            article.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${product.image}"
                        alt="${escapeHtml(product.name)}"
                        loading="lazy"
                    >

                </div>


                <div class="cart-item-info">

                    <span class="cart-item-category">
                        ${escapeHtml(product.category)}
                    </span>

                    <a
                        href="product.html?product=${encodeURIComponent(product.id)}"
                        class="cart-item-name"
                    >
                        ${escapeHtml(product.name)}
                    </a>


                    <div class="cart-item-price">

                        <span class="cart-item-current-price">
                            ${formatPrice(product.price)}
                        </span>

                        ${
                            product.mrp > product.price
                                ? `
                                    <span class="cart-item-old-price">
                                        ${formatPrice(product.mrp)}
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <div
                        class="cart-quantity"
                        aria-label="Quantity"
                    >

                        <button
                            type="button"
                            class="quantity-minus"
                            data-index="${index}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <input
                            type="number"
                            value="${item.quantity}"
                            min="1"
                            max="10"
                            class="quantity-input"
                            data-index="${index}"
                            aria-label="Product quantity"
                        >


                        <button
                            type="button"
                            class="quantity-plus"
                            data-index="${index}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="cart-item-right">

                    <div class="cart-item-total">
                        ${formatPrice(itemTotal)}
                    </div>

                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}"
                    >
                        🗑 Remove
                    </button>

                </div>

            `;


            const image =
                article.querySelector("img");

            if (image) {

                image.addEventListener(
                    "error",
                    () => {

                        image.style.display = "none";

                        const placeholder =
                            document.createElement("div");

                        placeholder.className =
                            "cart-item-placeholder";

                        placeholder.textContent = "🧴";

                        image.parentElement.appendChild(
                            placeholder
                        );

                    },
                    { once: true }
                );
            }


            cartItems.appendChild(article);

        });


        updateSummary();
        updateHeaderCounts();
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateSummary() {

        const subtotal =
            calculateSubtotal();

        const shipping =
            calculateShipping(subtotal);

        const discount =
            calculateDiscount(subtotal);

        const total =
            Math.max(
                0,
                subtotal + shipping - discount
            );


        const totalItems =
            cart.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );


        if (cartItemLabel) {

            cartItemLabel.textContent =
                `${totalItems} ${
                    totalItems === 1
                        ? "item"
                        : "items"
                }`;
        }


        if (cartSubtotal) {
            cartSubtotal.textContent =
                formatPrice(subtotal);
        }


        if (cartShipping) {

            cartShipping.textContent =
                shipping === 0
                    ? "FREE"
                    : formatPrice(shipping);
        }


        if (cartDiscount) {

            cartDiscount.textContent =
                "-" + formatPrice(discount);
        }


        if (cartTotal) {
            cartTotal.textContent =
                formatPrice(total);
        }


        /* Coupon row */

        if (discountRow) {

            if (discount > 0) {
                discountRow.classList.add("show");
            } else {
                discountRow.classList.remove("show");
            }
        }


        /* Free shipping message */

        if (freeShippingMessage) {

            if (subtotal <= 0) {

                freeShippingMessage.textContent =
                    "Add products to your cart to continue shopping.";

                freeShippingMessage.classList.remove(
                    "free"
                );

            } else if (subtotal >= 999) {

                freeShippingMessage.textContent =
                    "✓ You have unlocked FREE shipping!";

                freeShippingMessage.classList.add(
                    "free"
                );

            } else {

                const remaining =
                    999 - subtotal;

                freeShippingMessage.textContent =
                    `Add ${formatPrice(remaining)} more to get FREE shipping.`;

                freeShippingMessage.classList.remove(
                    "free"
                );
            }
        }


        /* Checkout */

        if (checkoutBtn) {

            checkoutBtn.disabled =
                cart.length === 0;
        }
    }


    /* =====================================================
       CHANGE QUANTITY
    ===================================================== */

    function changeQuantity(index, change) {

        const item = cart[index];

        if (!item) {
            return;
        }

        const newQuantity =
            item.quantity + change;

        if (newQuantity < 1) {

            removeItem(index);

            return;
        }

        if (newQuantity > 10) {

            showToast(
                "Maximum quantity is 10."
            );

            return;
        }

        item.quantity = newQuantity;

        saveCart();

        renderCart();

        showToast(
            "Cart quantity updated."
        );
    }


    /* =====================================================
       SET QUANTITY
    ===================================================== */

    function setQuantity(index, value) {

        const item = cart[index];

        if (!item) {
            return;
        }

        let quantity =
            parseInt(value, 10);

        if (!Number.isFinite(quantity)) {
            quantity = 1;
        }

        quantity = Math.max(
            1,
            Math.min(10, quantity)
        );

        item.quantity = quantity;

        saveCart();

        renderCart();
    }


    /* =====================================================
       REMOVE ITEM
    ===================================================== */

    function removeItem(index) {

        const item = cart[index];

        if (!item) {
            return;
        }

        const product =
            products[item.id];

        const productName =
            product
                ? product.name
                : "Product";


        cart.splice(index, 1);

        saveCart();

        renderCart();

        showToast(
            `${productName} removed from cart.`
        );
    }


    /* =====================================================
       CART EVENTS
    ===================================================== */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            event => {

                const minus =
                    event.target.closest(
                        ".quantity-minus"
                    );

                const plus =
                    event.target.closest(
                        ".quantity-plus"
                    );

                const remove =
                    event.target.closest(
                        ".remove-item"
                    );


                if (minus) {

                    const index =
                        Number(minus.dataset.index);

                    changeQuantity(index, -1);

                    return;
                }


                if (plus) {

                    const index =
                        Number(plus.dataset.index);

                    changeQuantity(index, 1);

                    return;
                }


                if (remove) {

                    const index =
                        Number(remove.dataset.index);

                    removeItem(index);

                    return;
                }

            }
        );


        cartItems.addEventListener(
            "change",
            event => {

                if (
                    event.target.classList.contains(
                        "quantity-input"
                    )
                ) {

                    const index =
                        Number(
                            event.target.dataset.index
                        );

                    setQuantity(
                        index,
                        event.target.value
                    );
                }

            }
        );

    }


    /* =====================================================
       APPLY COUPON
    ===================================================== */

    if (applyCoupon) {

        applyCoupon.addEventListener(
            "click",
            applyCouponCode
        );
    }


    if (couponInput) {

        couponInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    applyCouponCode();
                }

            }
        );
    }


    function applyCouponCode() {

        if (!couponInput || !couponMessage) {
            return;
        }


        const code =
            couponInput.value
                .trim()
                .toUpperCase();


        couponMessage.className =
            "coupon-message";


        if (!code) {

            couponMessage.textContent =
                "Please enter a coupon code.";

            couponMessage.classList.add(
                "error"
            );

            return;
        }


        const subtotal =
            calculateSubtotal();


        if (code === "GLOW10") {

            if (subtotal < 499) {

                couponMessage.textContent =
                    "Minimum order value for GLOW10 is ₹499.";

                couponMessage.classList.add(
                    "error"
                );

                return;
            }


            appliedCoupon = code;

            couponMessage.textContent =
                "✓ GLOW10 applied — 10% off your order.";

            couponMessage.classList.add(
                "success"
            );

            updateSummary();

            showToast(
                "Coupon applied successfully."
            );

            return;
        }


        appliedCoupon = null;

        couponMessage.textContent =
            "Invalid coupon code.";

        couponMessage.classList.add(
            "error"
        );

        updateSummary();
    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    showToast(
                        "Your cart is empty."
                    );

                    return;
                }


                /*
                 * Checkout page will be created
                 * in a later step.
                 */

                window.location.href =
                    "checkout.html";

            }
        );
    }


    /* =====================================================
       SEARCH OVERLAY
    ===================================================== */

    const searchBtn =
        document.getElementById("searchBtn");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const closeSearch =
        document.getElementById("closeSearch");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");


    if (searchBtn && searchOverlay) {

        searchBtn.addEventListener(
            "click",
            () => {

                searchOverlay.classList.add(
                    "show"
                );

                document.body.classList.add(
                    "search-open"
                );

                setTimeout(() => {

                    if (searchInput) {
                        searchInput.focus();
                    }

                }, 100);

            }
        );
    }


    if (closeSearch && searchOverlay) {

        closeSearch.addEventListener(
            "click",
            closeSearchOverlay
        );
    }


    function closeSearchOverlay() {

        if (!searchOverlay) {
            return;
        }

        searchOverlay.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "search-open"
        );
    }


    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const query =
                    searchInput
                        ? searchInput.value.trim()
                        : "";


                if (!query) {
                    return;
                }


                window.location.href =
                    "shop.html?search=" +
                    encodeURIComponent(query);
            }
        );
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const mainNav =
        document.getElementById("mainNav");


    if (mobileMenuBtn && mainNav) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                mainNav.classList.toggle(
                    "show"
                );

                mobileMenuBtn.classList.toggle(
                    "active"
                );

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mainNav.classList.remove(
                            "show"
                        );

                        mobileMenuBtn.classList.remove(
                            "active"
                        );

                    }
                );

            });
    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeSearchOverlay();

            }

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        cart =
            readStorage(
                CART_KEY,
                []
            );


        normalizeCart();

        renderCart();

    }


    init();

})();
