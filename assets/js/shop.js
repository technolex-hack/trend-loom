/* =========================================================
   GLOWSKIN — SHOP PAGE JAVASCRIPT
   File: js/shop.js
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const SHOP_CART_KEY = "glowskin_cart";
const SHOP_WISHLIST_KEY = "glowskin_wishlist";


function getShopStorage(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed) ? parsed : fallback;

    } catch (error) {
        console.warn("Storage error:", error);
        return fallback;
    }
}


function saveShopStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn("Unable to save storage:", error);
    }
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const productGrid = document.getElementById("productGrid");
const productCards = Array.from(
    document.querySelectorAll(".shop-product-card")
);

const productCount = document.getElementById("productCount");

const sortProducts = document.getElementById("sortProducts");

const clearFilters = document.getElementById("clearFilters");

const resetProducts = document.getElementById("resetProducts");

const noProducts = document.getElementById("noProducts");

const pagination = document.getElementById("pagination");

const filterToggle = document.getElementById("filterToggle");

const shopSidebar = document.getElementById("shopSidebar");

const activeSearch = document.getElementById("activeSearch");

const searchTerm = document.getElementById("searchTerm");

const clearSearch = document.getElementById("clearSearch");

const searchForm = document.getElementById("searchForm");

const searchInput = document.getElementById("searchInput");

const searchOverlay = document.getElementById("searchOverlay");

const closeSearch = document.getElementById("closeSearch");

const searchBtn = document.getElementById("searchBtn");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");

const mainNav = document.getElementById("mainNav");

const cartCount = document.getElementById("cartCount");

const wishlistCount = document.getElementById("wishlistCount");

const cartToast = document.getElementById("cartToast");

const toastProductName = document.getElementById(
    "toastProductName"
);

const closeToast = document.getElementById("closeToast");


/* =========================================================
   SHOP STATE
   ========================================================= */

let cart = getShopStorage(SHOP_CART_KEY);

let wishlist = getShopStorage(SHOP_WISHLIST_KEY);

let currentSearch = "";

let currentCategory = "all";

let currentPrice = "all";

let currentPage = 1;

const productsPerPage = 6;


/* =========================================================
   URL PARAMETERS
   ========================================================= */

function readURLParameters() {

    const params = new URLSearchParams(
        window.location.search
    );

    const category = params.get("category");

    const search = params.get("search");

    if (category) {

        const validCategories = [
            "face-wash",
            "serums",
            "moisturizers",
            "sunscreen",
            "toners",
            "lip-care",
            "offers"
        ];

        if (validCategories.includes(category)) {

            currentCategory = category;

            const categoryInput = document.querySelector(
                `input[name="category"][value="${category}"]`
            );

            if (categoryInput) {
                categoryInput.checked = true;
            }

        }
    }

    if (search) {

        currentSearch = search.trim();

        if (searchInput) {
            searchInput.value = currentSearch;
        }

        if (activeSearch && searchTerm) {

            searchTerm.textContent = currentSearch;

            activeSearch.hidden = false;

        }
    }
}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateShopCartCount() {

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => {

            const quantity = Number(item.quantity) || 1;

            return total + quantity;

        },
        0
    );

    cartCount.textContent = totalItems;
}


/* =========================================================
   UPDATE WISHLIST COUNT
   ========================================================= */

function updateShopWishlistCount() {

    if (!wishlistCount) {
        return;
    }

    wishlistCount.textContent = wishlist.length;
}


/* =========================================================
   PRODUCT ID
   ========================================================= */

function createShopProductId(name) {

    return String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addShopProductToCart(name, price) {

    const productPrice = Number(price);

    const existingProduct = cart.find(
        item =>
            String(item.name).toLowerCase() ===
            String(name).toLowerCase()
    );

    if (existingProduct) {

        existingProduct.quantity =
            (Number(existingProduct.quantity) || 1) + 1;

    } else {

        cart.push({
            id: createShopProductId(name),
            name: name,
            price: productPrice,
            quantity: 1
        });

    }

    saveShopStorage(SHOP_CART_KEY, cart);

    updateShopCartCount();

    showShopToast(name);
}


/* =========================================================
   CART BUTTONS
   ========================================================= */

function setupCartButtons() {

    const buttons = document.querySelectorAll(
        ".shop-product-card .quick-add"
    );

    buttons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            const name = button.dataset.product;

            const price = button.dataset.price;

            if (!name || !price) {
                return;
            }

            addShopProductToCart(name, price);

        });

    });
}


/* =========================================================
   SHOW CART TOAST
   ========================================================= */

let toastTimer = null;


function showShopToast(productName) {

    if (!cartToast) {
        return;
    }

    if (toastProductName) {
        toastProductName.textContent = productName;
    }

    cartToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        cartToast.classList.remove("show");

    }, 3500);
}


/* =========================================================
   CLOSE TOAST
   ========================================================= */

if (closeToast) {

    closeToast.addEventListener("click", () => {

        cartToast.classList.remove("show");

        clearTimeout(toastTimer);

    });

}


/* =========================================================
   WISHLIST
   ========================================================= */

function isShopProductInWishlist(productName) {

    const id = createShopProductId(productName);

    return wishlist.some(item => {

        if (typeof item === "string") {
            return item === id || item === productName;
        }

        return (
            item.id === id ||
            String(item.name).toLowerCase() ===
            String(productName).toLowerCase()
        );

    });
}


/* =========================================================
   UPDATE WISHLIST BUTTON
   ========================================================= */

function updateWishlistButton(button, productName) {

    const active = isShopProductInWishlist(productName);

    button.classList.toggle("active", active);

    button.innerHTML = active ? "♥" : "♡";

    button.setAttribute(
        "aria-label",
        active
            ? "Remove from wishlist"
            : "Add to wishlist"
    );

}


/* =========================================================
   TOGGLE WISHLIST
   ========================================================= */

function toggleShopWishlist(productName) {

    const id = createShopProductId(productName);

    const existingIndex = wishlist.findIndex(item => {

        if (typeof item === "string") {
            return item === id || item === productName;
        }

        return (
            item.id === id ||
            String(item.name).toLowerCase() ===
            String(productName).toLowerCase()
        );

    });


    if (existingIndex !== -1) {

        wishlist.splice(existingIndex, 1);

    } else {

        wishlist.push({
            id: id,
            name: productName
        });

    }


    saveShopStorage(
        SHOP_WISHLIST_KEY,
        wishlist
    );

    updateShopWishlistCount();

    updateAllWishlistButtons();

}


/* =========================================================
   WISHLIST BUTTONS
   ========================================================= */

function setupWishlistButtons() {

    const buttons = document.querySelectorAll(
        ".shop-product-card .wishlist-btn"
    );

    buttons.forEach(button => {

        const productName = button.dataset.product;

        if (!productName) {
            return;
        }

        updateWishlistButton(
            button,
            productName
        );


        button.addEventListener("click", event => {

            event.preventDefault();

            event.stopPropagation();

            toggleShopWishlist(productName);

        });

    });

}


/* =========================================================
   UPDATE ALL WISHLIST BUTTONS
   ========================================================= */

function updateAllWishlistButtons() {

    const buttons = document.querySelectorAll(
        ".shop-product-card .wishlist-btn"
    );

    buttons.forEach(button => {

        const productName = button.dataset.product;

        if (productName) {

            updateWishlistButton(
                button,
                productName
            );

        }

    });

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function setupCategoryFilters() {

    const categoryInputs = document.querySelectorAll(
        'input[name="category"]'
    );

    categoryInputs.forEach(input => {

        input.addEventListener("change", () => {

            if (!input.checked) {
                return;
            }

            currentCategory = input.value;

            currentPage = 1;

            applyFilters();

            closeMobileSidebar();

        });

    });

}


/* =========================================================
   PRICE FILTER
   ========================================================= */

function setupPriceFilters() {

    const priceInputs = document.querySelectorAll(
        'input[name="price"]'
    );

    priceInputs.forEach(input => {

        input.addEventListener("change", () => {

            if (!input.checked) {
                return;
            }

            currentPrice = input.value;

            currentPage = 1;

            applyFilters();

            closeMobileSidebar();

        });

    });

}


/* =========================================================
   SKIN CONCERN FILTER
   ========================================================= */

function setupConcernFilters() {

    const concernInputs = document.querySelectorAll(
        'input[name="concern"]'
    );

    concernInputs.forEach(input => {

        input.addEventListener("change", () => {

            currentPage = 1;

            applyFilters();

        });

    });

}


/* =========================================================
   PRICE MATCH
   ========================================================= */

function matchesPrice(price) {

    const amount = Number(price);

    switch (currentPrice) {

        case "under-500":
            return amount < 500;

        case "500-1000":
            return amount >= 500 && amount <= 1000;

        case "1000-1500":
            return amount > 1000 && amount <= 1500;

        case "above-1500":
            return amount > 1500;

        default:
            return true;

    }

}


/* =========================================================
   CONCERN MATCH
   ========================================================= */

function matchesConcerns(card) {

    const selectedConcerns = Array.from(
        document.querySelectorAll(
            'input[name="concern"]:checked'
        )
    ).map(input => input.value);


    if (selectedConcerns.length === 0) {
        return true;
    }


    const productConcerns =
        String(card.dataset.concerns || "")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);


    return selectedConcerns.some(
        concern => productConcerns.includes(concern)
    );

}


/* =========================================================
   SEARCH MATCH
   ========================================================= */

function matchesSearch(card) {

    if (!currentSearch) {
        return true;
    }

    const productName =
        String(card.dataset.name || "")
            .toLowerCase();

    const category =
        String(card.dataset.category || "")
            .toLowerCase();

    const search =
        currentSearch.toLowerCase().trim();


    return (
        productName.includes(search) ||
        category.includes(search)
    );

}


/* =========================================================
   CATEGORY MATCH
   ========================================================= */

function matchesCategory(card) {

    if (
        currentCategory === "all" ||
        currentCategory === "offers"
    ) {
        return true;
    }

    return (
        String(card.dataset.category)
            .toLowerCase() ===
        currentCategory.toLowerCase()
    );

}


/* =========================================================
   GET FILTERED PRODUCTS
   ========================================================= */

function getFilteredProducts() {

    return productCards.filter(card => {

        const categoryMatch =
            matchesCategory(card);

        const priceMatch =
            matchesPrice(card.dataset.price);

        const concernMatch =
            matchesConcerns(card);

        const searchMatch =
            matchesSearch(card);


        return (
            categoryMatch &&
            priceMatch &&
            concernMatch &&
            searchMatch
        );

    });

}


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

function sortProductCards(cards) {

    const sortedCards = [...cards];

    const sortValue =
        sortProducts
            ? sortProducts.value
            : "default";


    switch (sortValue) {

        case "price-low":

            sortedCards.sort(
                (a, b) =>
                    Number(a.dataset.price) -
                    Number(b.dataset.price)
            );

            break;


        case "price-high":

            sortedCards.sort(
                (a, b) =>
                    Number(b.dataset.price) -
                    Number(a.dataset.price)
            );

            break;


        case "name-a-z":

            sortedCards.sort(
                (a, b) =>
                    String(a.dataset.name)
                        .localeCompare(
                            String(b.dataset.name)
                        )
            );

            break;


        case "name-z-a":

            sortedCards.sort(
                (a, b) =>
                    String(b.dataset.name)
                        .localeCompare(
                            String(a.dataset.name)
                        )
            );

            break;


        default:

            break;

    }


    return sortedCards;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    let filteredProducts =
        getFilteredProducts();


    filteredProducts =
        sortProductCards(filteredProducts);


    const totalProducts =
        filteredProducts.length;


    if (productCount) {

        productCount.textContent =
            totalProducts;

    }


    productCards.forEach(card => {

        card.style.display = "none";

    });


    if (totalProducts === 0) {

        if (noProducts) {
            noProducts.hidden = false;
        }

        if (pagination) {
            pagination.hidden = true;
        }

        return;

    }


    if (noProducts) {
        noProducts.hidden = true;
    }


    const totalPages =
        Math.ceil(
            totalProducts /
            productsPerPage
        );


    if (currentPage > totalPages) {
        currentPage = totalPages;
    }


    const startIndex =
        (currentPage - 1) *
        productsPerPage;


    const endIndex =
        startIndex +
        productsPerPage;


    const pageProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    pageProducts.forEach(card => {

        card.style.display = "";

        productGrid.appendChild(card);

    });


    renderPagination(totalPages);

}


/* =========================================================
   PAGINATION
   ========================================================= */

function renderPagination(totalPages) {

    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    if (totalPages <= 1) {

        pagination.hidden = true;

        return;

    }


    pagination.hidden = false;


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "pagination-btn";


        if (page === currentPage) {
            button.classList.add("active");
        }


        button.dataset.page = page;

        button.textContent = page;


        button.addEventListener(
            "click",
            () => {

                currentPage = page;

                renderProducts();

                scrollToProducts();

            }
        );


        pagination.appendChild(button);

    }


    if (currentPage < totalPages) {

        const nextButton =
            document.createElement("button");


        nextButton.type = "button";

        nextButton.className =
            "pagination-next";

        nextButton.dataset.page =
            currentPage + 1;

        nextButton.setAttribute(
            "aria-label",
            "Next page"
        );

        nextButton.textContent = "→";


        nextButton.addEventListener(
            "click",
            () => {

                currentPage++;

                renderProducts();

                scrollToProducts();

            }
        );


        pagination.appendChild(nextButton);

    }

}


/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {

    renderProducts();

    updateSearchDisplay();

}


/* =========================================================
   SORT EVENT
   ========================================================= */

if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        () => {

            currentPage = 1;

            renderProducts();

        }
    );

}


/* =========================================================
   CLEAR FILTERS
   ========================================================= */

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        () => {

            resetAllFilters();

        }
    );

}


/* =========================================================
   RESET ALL FILTERS
   ========================================================= */

function resetAllFilters() {

    currentCategory = "all";

    currentPrice = "all";

    currentSearch = "";

    currentPage = 1;


    const categoryAll =
        document.querySelector(
            'input[name="category"][value="all"]'
        );

    if (categoryAll) {
        categoryAll.checked = true;
    }


    const priceAll =
        document.querySelector(
            'input[name="price"][value="all"]'
        );

    if (priceAll) {
        priceAll.checked = true;
    }


    document
        .querySelectorAll(
            'input[name="concern"]'
        )
        .forEach(input => {

            input.checked = false;

        });


    if (searchInput) {
        searchInput.value = "";
    }


    if (sortProducts) {
        sortProducts.value = "default";
    }


    updateURL();

    updateSearchDisplay();

    renderProducts();

    closeMobileSidebar();

}


/* =========================================================
   RESET PRODUCTS BUTTON
   ========================================================= */

if (resetProducts) {

    resetProducts.addEventListener(
        "click",
        () => {

            resetAllFilters();

        }
    );

}


/* =========================================================
   SEARCH DISPLAY
   ========================================================= */

function updateSearchDisplay() {

    if (!activeSearch || !searchTerm) {
        return;
    }


    if (currentSearch) {

        searchTerm.textContent =
            currentSearch;

        activeSearch.hidden = false;

    } else {

        activeSearch.hidden = true;

        searchTerm.textContent = "";

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const value =
                searchInput
                    ? searchInput.value.trim()
                    : "";


            currentSearch = value;

            currentPage = 1;


            updateURL();

            updateSearchDisplay();

            renderProducts();

            closeSearchOverlay();

        }
    );

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            currentSearch = "";

            currentPage = 1;


            if (searchInput) {
                searchInput.value = "";
            }


            updateURL();

            updateSearchDisplay();

            renderProducts();

        }
    );

}


/* =========================================================
   UPDATE URL
   ========================================================= */

function updateURL() {

    const params =
        new URLSearchParams();


    if (
        currentCategory &&
        currentCategory !== "all"
    ) {

        params.set(
            "category",
            currentCategory
        );

    }


    if (currentSearch) {

        params.set(
            "search",
            currentSearch
        );

    }


    const queryString =
        params.toString();


    const newURL =
        queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;


    window.history.replaceState(
        {},
        "",
        newURL
    );

}


/* =========================================================
   SEARCH OVERLAY
   ========================================================= */

function openSearchOverlay() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.add("open");

    searchOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(() => {

        if (searchInput) {
            searchInput.focus();
        }

    }, 100);

}


function closeSearchOverlay() {

    if (!searchOverlay) {
        return;
    }

    searchOverlay.classList.remove("open");

    searchOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        openSearchOverlay
    );

}


if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        closeSearchOverlay
    );

}


if (searchOverlay) {

    searchOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                searchOverlay
            ) {

                closeSearchOverlay();

            }

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (mobileMenuBtn && mainNav) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle("open");


            mobileMenuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
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
                        "open"
                    );

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* =========================================================
   MOBILE FILTER SIDEBAR
   ========================================================= */

if (filterToggle) {

    filterToggle.addEventListener(
        "click",
        () => {

            if (shopSidebar) {

                shopSidebar.classList.toggle(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE MOBILE SIDEBAR
   ========================================================= */

function closeMobileSidebar() {

    if (shopSidebar) {

        shopSidebar.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeSearchOverlay();

            closeMobileSidebar();

        }

    }
);


/* =========================================================
   SCROLL TO PRODUCTS
   ========================================================= */

function scrollToProducts() {

    const shopSection =
        document.querySelector(
            ".shop-section"
        );


    if (!shopSection) {
        return;
    }


    const top =
        shopSection.getBoundingClientRect().top +
        window.scrollY -
        90;


    window.scrollTo({
        top: top,
        behavior: "smooth"
    });

}


/* =========================================================
   PRODUCT CARD CLICK
   ========================================================= */

productCards.forEach(card => {

    card.addEventListener(
        "click",
        event => {

            const clickedButton =
                event.target.closest(
                    "button"
                );


            if (clickedButton) {
                return;
            }


            const productName =
                card.dataset.name;


            if (!productName) {
                return;
            }


            /*
             * Product details page will be
             * connected in Step 3.
             */

            console.log(
                "Product clicked:",
                productName
            );

        }
    );

});


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeShopPage() {

    readURLParameters();

    updateShopCartCount();

    updateShopWishlistCount();

    setupCartButtons();

    setupWishlistButtons();

    setupCategoryFilters();

    setupPriceFilters();

    setupConcernFilters();

    updateSearchDisplay();

    renderProducts();

}


/* =========================================================
   RUN
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeShopPage
    );

} else {

    initializeShopPage();

                                }
