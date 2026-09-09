/* =========================================================
   GLOWSKIN — MAIN STORE JAVASCRIPT
   File: js/script.js
========================================================= */

"use strict";


/* =========================================================
   1. STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
    cart: "glowskin_cart",
    wishlist: "glowskin_wishlist"
};


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");

const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

const cartCountElement = document.getElementById("cartCount");
const wishlistCountElement = document.getElementById("wishlistCount");

const cartToast = document.getElementById("cartToast");

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");

const quickAddButtons = document.querySelectorAll(".quick-add");
const wishlistButtons = document.querySelectorAll(".wishlist-btn");


/* =========================================================
   3. SAFE STORAGE FUNCTIONS
========================================================= */

function getStorageData(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsedData = JSON.parse(data);

        return Array.isArray(parsedData)
            ? parsedData
            : fallback;

    } catch (error) {
        console.error("Storage read error:", error);
        return fallback;
    }
}


function saveStorageData(key, data) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    } catch (error) {
        console.error("Storage save error:", error);
    }
}


/* =========================================================
   4. CART DATA
========================================================= */

let cart = getStorageData(
    STORAGE_KEYS.cart,
    []
);


/* =========================================================
   5. WISHLIST DATA
========================================================= */

let wishlist = getStorageData(
    STORAGE_KEYS.wishlist,
    []
);


/* =========================================================
   6. UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    if (!cartCountElement) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => {
            return total + Number(item.quantity || 0);
        },
        0
    );

    cartCountElement.textContent = totalItems;
}


/* =========================================================
   7. UPDATE WISHLIST COUNT
========================================================= */

function updateWishlistCount() {

    if (!wishlistCountElement) {
        return;
    }

    wishlistCountElement.textContent =
        wishlist.length;
}


/* =========================================================
   8. ADD PRODUCT TO CART
========================================================= */

function addToCart(productName, productPrice) {

    const price = Number(productPrice);

    if (!productName || Number.isNaN(price)) {
        return;
    }

    const existingProduct = cart.find(
        item => item.name === productName
    );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: createProductId(productName),
            name: productName,
            price: price,
            quantity: 1
        });

    }


    saveStorageData(
        STORAGE_KEYS.cart,
        cart
    );

    updateCartCount();

    showCartToast(productName);
}


/* =========================================================
   9. CREATE SIMPLE PRODUCT ID
========================================================= */

function createProductId(name) {

    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}


/* =========================================================
   10. QUICK ADD BUTTONS
========================================================= */

quickAddButtons.forEach(button => {

    button.addEventListener("click", function () {

        const productName =
            this.dataset.product;

        const productPrice =
            this.dataset.price;

        addToCart(
            productName,
            productPrice
        );

    });

});


/* =========================================================
   11. CART TOAST
========================================================= */

let toastTimer;


function showCartToast(productName = "Product") {

    if (!cartToast) {
        return;
    }

    const toastText =
        cartToast.querySelector("p");

    if (toastText) {

        toastText.textContent =
            `${productName} added successfully.`;

    }


    cartToast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        cartToast.classList.remove("show");

    }, 3500);
}


/* =========================================================
   12. WISHLIST
========================================================= */

wishlistButtons.forEach((button, index) => {

    const productCard =
        button.closest(".product-card");

    if (!productCard) {
        return;
    }


    const productNameElement =
        productCard.querySelector("h3 a");

    if (!productNameElement) {
        return;
    }


    const productName =
        productNameElement.textContent.trim();


    const alreadyInWishlist =
        wishlist.some(
            item => item.name === productName
        );


    if (alreadyInWishlist) {
        button.classList.add("active");
        button.textContent = "♥";
    }


    button.addEventListener(
        "click",
        function () {

            toggleWishlist(
                productName,
                this
            );

        }
    );

});


/* =========================================================
   13. TOGGLE WISHLIST
========================================================= */

function toggleWishlist(
    productName,
    button
) {

    const existingIndex =
        wishlist.findIndex(
            item => item.name === productName
        );


    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

        button.classList.remove("active");
        button.textContent = "♡";

    } else {

        wishlist.push({
            id: createProductId(productName),
            name: productName
        });

        button.classList.add("active");
        button.textContent = "♥";

    }


    saveStorageData(
        STORAGE_KEYS.wishlist,
        wishlist
    );

    updateWishlistCount();
}


/* =========================================================
   14. INITIAL COUNTS
========================================================= */

updateCartCount();
updateWishlistCount();


/* =========================================================
   15. MOBILE MENU
========================================================= */

if (mobileMenuBtn && mainNav) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle("active");

            const isOpen =
                mainNav.classList.contains("active");

            document.body.classList.toggle(
                "no-scroll",
                isOpen
            );


            this.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            this.textContent =
                isOpen ? "×" : "☰";

        }
    );


    const navLinks =
        mainNav.querySelectorAll("a");


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "no-scroll"
                );

                mobileMenuBtn.textContent = "☰";

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}


/* =========================================================
   16. SEARCH OPEN
========================================================= */

function openSearch() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");


    setTimeout(() => {

        if (searchInput) {
            searchInput.focus();
        }

    }, 200);
}


/* =========================================================
   17. SEARCH CLOSE
========================================================= */

function closeSearchOverlay() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.remove("active");

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =========================================================
   18. SEARCH BUTTON
========================================================= */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        openSearch
    );

}


/* =========================================================
   19. CLOSE SEARCH BUTTON
========================================================= */

if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        closeSearchOverlay
    );

}


/* =========================================================
   20. CLICK OUTSIDE SEARCH BOX
========================================================= */

if (searchOverlay) {

    searchOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === searchOverlay
            ) {

                closeSearchOverlay();

            }

        }
    );

}


/* =========================================================
   21. ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSearchOverlay();

            if (
                mainNav &&
                mainNav.classList.contains("active")
            ) {

                mainNav.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "no-scroll"
                );

                if (mobileMenuBtn) {

                    mobileMenuBtn.textContent =
                        "☰";

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }

    }
);


/* =========================================================
   22. SEARCH FORM
========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const query =
                searchInput
                    ? searchInput.value.trim()
                    : "";


            if (!query) {

                if (searchInput) {
                    searchInput.focus();
                }

                return;
            }


            /*
                Later this can be connected
                to a real product search page.

                Example:
                shop.html?search=serum
            */

            const encodedQuery =
                encodeURIComponent(query);


            window.location.href =
                `shop.html?search=${encodedQuery}`;

        }
    );

}


/* =========================================================
   23. NEWSLETTER
========================================================= */

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                newsletterEmail
                    ? newsletterEmail.value.trim()
                    : "";


            if (!email) {
                return;
            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /*
                This is frontend-only for now.

                Later:
                Newsletter can be connected
                to backend/email service.
            */


            showMessage(
                "Thank you for subscribing! ✨",
                "success"
            );


            newsletterForm.reset();

        }
    );

}


/* =========================================================
   24. EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);
}


/* =========================================================
   25. MESSAGE FUNCTION
========================================================= */

function showMessage(
    message,
    type = "success"
) {

    const existingMessage =
        document.querySelector(
            ".js-message"
        );


    if (existingMessage) {
        existingMessage.remove();
    }


    const messageElement =
        document.createElement("div");


    messageElement.className =
        `js-message js-message-${type}`;


    messageElement.textContent =
        message;


    messageElement.style.position =
        "fixed";

    messageElement.style.left =
        "50%";

    messageElement.style.bottom =
        "25px";

    messageElement.style.transform =
        "translateX(-50%)";

    messageElement.style.zIndex =
        "5000";

    messageElement.style.padding =
        "13px 20px";

    messageElement.style.borderRadius =
        "8px";

    messageElement.style.background =
        type === "error"
            ? "#b04b4b"
            : "#4e8061";

    messageElement.style.color =
        "#ffffff";

    messageElement.style.fontSize =
        "13px";

    messageElement.style.fontWeight =
        "600";

    messageElement.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.18)";


    document.body.appendChild(
        messageElement
    );


    setTimeout(() => {

        messageElement.remove();

    }, 3000);
}


/* =========================================================
   26. PRODUCT CARD HOVER TOUCH SUPPORT
========================================================= */

document
    .querySelectorAll(".product-card")
    .forEach(card => {

        card.addEventListener(
            "touchstart",
            () => {

                card.classList.add(
                    "touch-active"
                );

            },
            {
                passive: true
            }
        );

    });


/* =========================================================
   27. CLOSE TOAST WHEN CART LINK IS CLICKED
========================================================= */

const cartLink =
    document.querySelector(
        ".cart-icon"
    );


if (cartLink) {

    cartLink.addEventListener(
        "click",
        () => {

            if (cartToast) {

                cartToast.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   28. HEADER SCROLL EFFECT
========================================================= */

const header =
    document.querySelector(".header");


if (header) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 20) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   29. SMOOTH INTERNAL LINKS
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


/* =========================================================
   30. IMAGE ERROR HANDLER
========================================================= */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.addEventListener(
            "error",
            function () {

                this.style.display =
                    "none";

            }
        );

    });


/* =========================================================
   31. PAGE READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();
        updateWishlistCount();

        console.log(
            "GlowSkin store initialized successfully."
        );

    }
);


/* =========================================================
   END OF FILE
========================================================= */
