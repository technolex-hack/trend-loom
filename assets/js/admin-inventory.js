/* =========================================================
   GlowSkin Admin — Inventory
   File: assets/js/admin-inventory.js
   ========================================================= */

(function () {
    "use strict";

    const PRODUCTS_KEY = "glowskin_products";

    const LOW_STOCK_LIMIT = 10;

    const DEFAULT_PRODUCTS = [
        {
            id: "vitamin-c-brightening-serum",
            name: "Vitamin C Brightening Serum",
            category: "serums",
            price: 599,
            mrp: 799,
            stock: 24,
            status: "active",
            image: "../assets/images/products/vitamin-c-serum-1.jpg",
            description: "Brightening serum with Vitamin C.",
            featured: true
        },
        {
            id: "daily-sunscreen-spf-50",
            name: "Daily Sunscreen SPF 50",
            category: "sunscreen",
            price: 479,
            mrp: 599,
            stock: 18,
            status: "active",
            image: "../assets/images/products/sunscreen-1.jpg",
            description: "Daily broad-spectrum SPF 50 sunscreen.",
            featured: true
        },
        {
            id: "niacinamide-pore-serum",
            name: "Niacinamide Pore Serum",
            category: "serums",
            price: 549,
            mrp: 699,
            stock: 12,
            status: "active",
            image: "../assets/images/products/niacinamide-serum-1.jpg",
            description: "Niacinamide serum for pores and uneven skin.",
            featured: true
        },
        {
            id: "daily-hydrating-moisturizer",
            name: "Daily Hydrating Moisturizer",
            category: "moisturizers",
            price: 449,
            mrp: 549,
            stock: 8,
            status: "active",
            image: "../assets/images/products/moisturizer-1.jpg",
            description: "Lightweight daily hydrating moisturizer.",
            featured: true
        },
        {
            id: "gentle-foaming-face-wash",
            name: "Gentle Foaming Face Wash",
            category: "face-wash",
            price: 349,
            mrp: 449,
            stock: 31,
            status: "active",
            image: "../assets/images/products/face-wash-1.jpg",
            description: "Gentle cleanser for everyday use.",
            featured: false
        },
        {
            id: "hydrating-hyaluronic-serum",
            name: "Hydrating Hyaluronic Serum",
            category: "serums",
            price: 699,
            mrp: 849,
            stock: 6,
            status: "active",
            image: "../assets/images/products/hyaluronic-serum-1.jpg",
            description: "Hydrating serum with hyaluronic acid.",
            featured: false
        },
        {
            id: "brightening-face-cleanser",
            name: "Brightening Face Cleanser",
            category: "face-wash",
            price: 399,
            mrp: 499,
            stock: 15,
            status: "active",
            image: "../assets/images/products/brightening-cleanser-1.jpg",
            description: "Brightening cleanser for dull-looking skin.",
            featured: false
        },
        {
            id: "barrier-repair-moisturizer",
            name: "Barrier Repair Moisturizer",
            category: "moisturizers",
            price: 799,
            mrp: 999,
            stock: 4,
            status: "active",
            image: "../assets/images/products/barrier-moisturizer-1.jpg",
            description: "Moisturizer designed to support the skin barrier.",
            featured: false
        },
        {
            id: "hydrating-rose-toner",
            name: "Hydrating Rose Toner",
            category: "toners",
            price: 429,
            mrp: 499,
            stock: 19,
            status: "active",
            image: "../assets/images/products/rose-toner-1.jpg",
            description: "Refreshing hydrating rose toner.",
            featured: false
        },
        {
            id: "acne-control-face-wash",
            name: "Acne Control Face Wash",
            category: "face-wash",
            price: 499,
            mrp: 599,
            stock: 7,
            status: "active",
            image: "../assets/images/products/acne-face-wash-1.jpg",
            description: "Face wash for acne-prone skin.",
            featured: false
        },
        {
            id: "spf-50-matte-sunscreen",
            name: "SPF 50 Matte Sunscreen",
            category: "sunscreen",
            price: 599,
            mrp: 699,
            stock: 0,
            status: "out-of-stock",
            image: "../assets/images/products/matte-sunscreen-1.jpg",
            description: "Lightweight matte sunscreen with SPF 50.",
            featured: false
        },
        {
            id: "nourishing-lip-care-balm",
            name: "Nourishing Lip Care Balm",
            category: "lip-care",
            price: 299,
            mrp: 349,
            stock: 22,
            status: "active",
            image: "../assets/images/products/lip-balm-1.jpg",
            description: "Nourishing lip balm for dry lips.",
            featured: false
        }
    ];


    /* =========================
       DOM ELEMENTS
       ========================= */

    const searchInput =
        document.getElementById("inventorySearch");

    const categoryFilter =
        document.getElementById("inventoryCategory");

    const statusFilter =
        document.getElementById("inventoryStatus");

    const clearFiltersButton =
        document.getElementById("clearInventoryFilters");

    const resultCount =
        document.getElementById("inventoryResultCount");

    const tableBody =
        document.getElementById("inventoryTableBody");

    const emptyState =
        document.getElementById("inventoryEmptyState");


    /* Stats */

    const totalProducts =
        document.getElementById("inventoryTotalProducts");

    const inStockProducts =
        document.getElementById("inventoryInStock");

    const lowStockProducts =
        document.getElementById("inventoryLowStock");

    const outOfStockProducts =
        document.getElementById("inventoryOutOfStock");


    /* Modal */

    const updateModal =
        document.getElementById("inventoryUpdateModal");

    const updateTitle =
        document.getElementById("inventoryUpdateTitle");

    const updateSubtitle =
        document.getElementById("inventoryUpdateSubtitle");

    const updateClose =
        document.getElementById("inventoryUpdateClose");

    const productIdInput =
        document.getElementById("inventoryProductId");

    const productImage =
        document.getElementById("inventoryProductImage");

    const productName =
        document.getElementById("inventoryProductName");

    const productCategory =
        document.getElementById("inventoryProductCategory");

    const stockInput =
        document.getElementById("inventoryStockInput");

    const currentStock =
        document.getElementById("inventoryCurrentStock");

    const cancelUpdate =
        document.getElementById("cancelInventoryUpdate");

    const saveUpdate =
        document.getElementById("saveInventoryUpdate");


    let products = [];
    let selectedProduct = null;


    /* =========================
       HELPERS
       ========================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatINR(value) {
        const number = Number(value) || 0;

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(number);
    }


    function normalizeStock(value) {
        const stock = Number(value);

        if (!Number.isFinite(stock) || stock < 0) {
            return 0;
        }

        return Math.floor(stock);
    }


    function getStockStatus(stock) {
        stock = normalizeStock(stock);

        if (stock <= 0) {
            return "out-of-stock";
        }

        if (stock <= LOW_STOCK_LIMIT) {
            return "low-stock";
        }

        return "in-stock";
    }


    function getStockLabel(stock) {
        const status = getStockStatus(stock);

        if (status === "out-of-stock") {
            return "Out of Stock";
        }

        if (status === "low-stock") {
            return "Low Stock";
        }

        return "In Stock";
    }


    function getCategoryLabel(category) {
        const categories = {
            "face-wash": "Face Wash",
            "serums": "Serums",
            "moisturizers": "Moisturizers",
            "sunscreen": "Sunscreen",
            "toners": "Toners",
            "lip-care": "Lip Care"
        };

        return categories[category] ||
            String(category || "Other")
                .replace(/-/g, " ")
                .replace(/\b\w/g, function (char) {
                    return char.toUpperCase();
                });
    }


    function showToast(message) {
        if (typeof window.glowSkinAdminToast === "function") {
            window.glowSkinAdminToast(message);
            return;
        }

        console.log(message);
    }


    /* =========================
       STORAGE
       ========================= */

    function loadProducts() {
        try {
            const stored =
                localStorage.getItem(PRODUCTS_KEY);

            if (!stored) {
                products = DEFAULT_PRODUCTS.map(function (product) {
                    return { ...product };
                });

                saveProducts(false);
                return;
            }

            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                products = parsed.map(function (product) {
                    return {
                        ...product,
                        stock: normalizeStock(product.stock)
                    };
                });
            } else {
                products = DEFAULT_PRODUCTS.map(function (product) {
                    return { ...product };
                });

                saveProducts(false);
            }

        } catch (error) {
            console.error(
                "GlowSkin Inventory: Unable to load products.",
                error
            );

            products = DEFAULT_PRODUCTS.map(function (product) {
                return { ...product };
            });
        }
    }


    function saveProducts(showMessage) {
        try {
            localStorage.setItem(
                PRODUCTS_KEY,
                JSON.stringify(products)
            );

            window.dispatchEvent(
                new CustomEvent("glowskinProductsUpdated")
            );

            if (showMessage) {
                showToast("Inventory updated successfully.");
            }

        } catch (error) {
            console.error(
                "GlowSkin Inventory: Unable to save products.",
                error
            );

            showToast("Unable to save inventory.");
        }
    }


    /* =========================
       FILTERING
       ========================= */

    function getFilteredProducts() {
        const search =
            String(searchInput?.value || "")
                .trim()
                .toLowerCase();

        const category =
            categoryFilter?.value || "all";

        const status =
            statusFilter?.value || "all";

        return products.filter(function (product) {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const id =
                String(product.id || "")
                    .toLowerCase();

            const matchesSearch =
                !search ||
                name.includes(search) ||
                id.includes(search);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            const stockStatus =
                getStockStatus(product.stock);

            const matchesStatus =
                status === "all" ||
                stockStatus === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }


    /* =========================
       STATS
       ========================= */

    function updateStats() {

        const total = products.length;

        const inStock = products.filter(function (product) {
            return getStockStatus(product.stock) === "in-stock";
        }).length;

        const lowStock = products.filter(function (product) {
            return getStockStatus(product.stock) === "low-stock";
        }).length;

        const outOfStock = products.filter(function (product) {
            return getStockStatus(product.stock) === "out-of-stock";
        }).length;


        if (totalProducts) {
            totalProducts.textContent = total;
        }

        if (inStockProducts) {
            inStockProducts.textContent = inStock;
        }

        if (lowStockProducts) {
            lowStockProducts.textContent = lowStock;
        }

        if (outOfStockProducts) {
            outOfStockProducts.textContent = outOfStock;
        }


        if (typeof window.updateAdminCounts === "function") {
            window.updateAdminCounts();
        }
    }


    /* =========================
       TABLE
       ========================= */

    function renderProducts() {

        if (!tableBody) {
            return;
        }

        const filtered =
            getFilteredProducts();

        if (resultCount) {
            resultCount.textContent =
                filtered.length +
                (filtered.length === 1
                    ? " product"
                    : " products");
        }


        if (!filtered.length) {

            tableBody.innerHTML = "";

            if (emptyState) {
                emptyState.classList.add("show");
            }

            return;
        }


        if (emptyState) {
            emptyState.classList.remove("show");
        }


        tableBody.innerHTML =
            filtered.map(function (product) {

                const stock =
                    normalizeStock(product.stock);

                const status =
                    getStockStatus(stock);

                const statusLabel =
                    getStockLabel(stock);

                const stockPercent =
                    Math.min(
                        100,
                        Math.max(
                            0,
                            (stock / 50) * 100
                        )
                    );


                let stockNumberClass = "healthy";

                if (status === "low-stock") {
                    stockNumberClass = "low";
                }

                if (status === "out-of-stock") {
                    stockNumberClass = "out";
                }


                const image =
                    product.image || "";


                return `
                    <tr data-product-id="${escapeHTML(product.id)}">

                        <td>
                            <div class="inventory-product-cell">

                                <div class="inventory-product-image-small">

                                    ${
                                        image
                                            ? `
                                                <img
                                                    src="${escapeHTML(image)}"
                                                    alt="${escapeHTML(product.name)}"
                                                    loading="lazy"
                                                    onerror="
                                                        this.style.display='none';
                                                        this.parentElement
                                                            .querySelector('span')
                                                            .style.display='flex';
                                                    "
                                                >
                                            `
                                            : ""
                                    }

                                    <span
                                        style="
                                            display:${image ? "none" : "flex"};
                                            align-items:center;
                                            justify-content:center;
                                            width:100%;
                                            height:100%;
                                        "
                                    >
                                        GS
                                    </span>

                                </div>


                                <div class="inventory-product-info">

                                    <span class="inventory-product-name">
                                        ${escapeHTML(product.name)}
                                    </span>

                                    <span class="inventory-product-id">
                                        ${escapeHTML(product.id)}
                                    </span>

                                </div>

                            </div>
                        </td>


                        <td>
                            <span class="inventory-category">
                                ${escapeHTML(
                                    getCategoryLabel(product.category)
                                )}
                            </span>
                        </td>


                        <td>
                            <span class="inventory-price">
                                ${formatINR(product.price)}
                            </span>
                        </td>


                        <td>
                            <div class="inventory-stock-cell">

                                <span
                                    class="inventory-stock-number ${stockNumberClass}"
                                >
                                    ${stock}
                                </span>

                                <div class="inventory-stock-bar">

                                    <span
                                        class="${status === "low-stock"
                                            ? "low"
                                            : status === "out-of-stock"
                                                ? "out"
                                                : ""}"
                                        style="
                                            width:${stockPercent}%;
                                        "
                                    ></span>

                                </div>

                            </div>
                        </td>


                        <td>
                            <span
                                class="
                                    inventory-status-badge
                                    ${status}
                                "
                            >
                                ${statusLabel}
                            </span>
                        </td>


                        <td class="inventory-action-cell">

                            <button
                                type="button"
                                class="inventory-update-button"
                                data-update-product="${escapeHTML(product.id)}"
                            >
                                Update Stock
                            </button>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    /* =========================
       MODAL
       ========================= */

    function openUpdateModal(product) {

        if (!product || !updateModal) {
            return;
        }

        selectedProduct = product;


        if (productIdInput) {
            productIdInput.value =
                product.id || "";
        }


        if (productName) {
            productName.textContent =
                product.name || "Product";
        }


        if (productCategory) {
            productCategory.textContent =
                getCategoryLabel(product.category);
        }


        if (updateTitle) {
            updateTitle.textContent =
                "Update Stock";
        }


        if (updateSubtitle) {
            updateSubtitle.textContent =
                "Update the available quantity for this product.";
        }


        const image =
            product.image || "";


        if (productImage) {

            productImage.innerHTML = image
                ? `
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        onerror="
                            this.style.display='none';
                            this.parentElement
                                .querySelector('span')
                                .style.display='flex';
                        "
                    >
                    <span style="
                        display:none;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        height:100%;
                    ">
                        GS
                    </span>
                `
                : `
                    <span style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        height:100%;
                    ">
                        GS
                    </span>
                `;
        }


        const stock =
            normalizeStock(product.stock);


        if (stockInput) {
            stockInput.value = stock;
            stockInput.min = "0";
        }


        if (currentStock) {
            currentStock.textContent =
                stock + " unit" +
                (stock === 1 ? "" : "s");
        }


        updateModal.classList.add("active");

        document.body.classList.add(
            "admin-modal-open"
        );


        setTimeout(function () {
            if (stockInput) {
                stockInput.focus();
                stockInput.select();
            }
        }, 100);
    }


    function closeUpdateModal() {

        if (!updateModal) {
            return;
        }

        updateModal.classList.remove("active");

        document.body.classList.remove(
            "admin-modal-open"
        );

        selectedProduct = null;

        if (productIdInput) {
            productIdInput.value = "";
        }
    }


    /* =========================
       SAVE STOCK
       ========================= */

    function saveStock() {

        if (!selectedProduct) {
            return;
        }

        let newStock =
            Number(stockInput?.value);

        if (!Number.isFinite(newStock)) {
            newStock = 0;
        }

        newStock = Math.floor(newStock);

        if (newStock < 0) {
            newStock = 0;
        }


        const product =
            products.find(function (item) {
                return item.id === selectedProduct.id;
            });


        if (!product) {
            showToast("Product not found.");
            closeUpdateModal();
            return;
        }


        product.stock = newStock;


        /*
         * If stock becomes zero, mark the product
         * as out-of-stock.
         *
         * If stock becomes greater than zero,
         * keep an existing inactive status inactive.
         * Otherwise use active.
         */
        if (newStock === 0) {
            product.status = "out-of-stock";
        } else if (
            product.status === "out-of-stock"
        ) {
            product.status = "active";
        }


        saveProducts(false);

        closeUpdateModal();

        updateStats();
        renderProducts();

        showToast(
            product.name +
            " stock updated to " +
            newStock +
            "."
        );
    }


    /* =========================
       FILTER EVENTS
       ========================= */

    function handleFilters() {
        renderProducts();
    }


    function clearFilters() {

        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (statusFilter) {
            statusFilter.value = "all";
        }

        renderProducts();
    }


    /* =========================
       TABLE EVENTS
       ========================= */

    function handleTableClick(event) {

        const button =
            event.target.closest(
                "[data-update-product]"
            );

        if (!button) {
            return;
        }


        const productId =
            button.getAttribute(
                "data-update-product"
            );


        const product =
            products.find(function (item) {
                return item.id === productId;
            });


        if (product) {
            openUpdateModal(product);
        }
    }


    /* =========================
       MODAL EVENTS
       ========================= */

    function setupModalEvents() {

        if (updateClose) {
            updateClose.addEventListener(
                "click",
                closeUpdateModal
            );
        }


        if (cancelUpdate) {
            cancelUpdate.addEventListener(
                "click",
                closeUpdateModal
            );
        }


        if (saveUpdate) {
            saveUpdate.addEventListener(
                "click",
                saveStock
            );
        }


        if (updateModal) {

            updateModal.addEventListener(
                "click",
                function (event) {

                    /*
                     * Close only when clicking the modal
                     * backdrop, not its content.
                     */
                    if (
                        event.target === updateModal
                    ) {
                        closeUpdateModal();
                    }
                }
            );
        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    updateModal &&
                    updateModal.classList.contains("active")
                ) {
                    closeUpdateModal();
                }


                if (
                    event.key === "Enter" &&
                    updateModal &&
                    updateModal.classList.contains("active") &&
                    document.activeElement === stockInput
                ) {
                    event.preventDefault();
                    saveStock();
                }
            }
        );
    }


    /* =========================
       STOCK INPUT
       ========================= */

    function setupStockInput() {

        if (!stockInput) {
            return;
        }


        stockInput.addEventListener(
            "input",
            function () {

                let value =
                    Number(stockInput.value);

                if (
                    !Number.isFinite(value) ||
                    value < 0
                ) {
                    stockInput.value = "0";
                    value = 0;
                }

                value = Math.floor(value);

                stockInput.value = value;


                if (currentStock) {
                    currentStock.textContent =
                        value +
                        " unit" +
                        (value === 1 ? "" : "s");
                }
            }
        );
    }


    /* =========================
       PRODUCTS UPDATED EVENT
       ========================= */

    function setupProductUpdateListener() {

        window.addEventListener(
            "glowskinProductsUpdated",
            function () {

                loadProducts();

                updateStats();
                renderProducts();
            }
        );


        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key === PRODUCTS_KEY
                ) {
                    loadProducts();

                    updateStats();
                    renderProducts();
                }
            }
        );
    }


    /* =========================
       VISIBILITY REFRESH
       ========================= */

    function setupVisibilityRefresh() {

        document.addEventListener(
            "visibilitychange",
            function () {

                if (
                    document.visibilityState ===
                    "visible"
                ) {
                    loadProducts();

                    updateStats();
                    renderProducts();
                }
            }
        );
    }


    /* =========================
       INITIALIZATION
       ========================= */

    function init() {

        loadProducts();

        updateStats();

        renderProducts();


        if (searchInput) {
            searchInput.addEventListener(
                "input",
                handleFilters
            );
        }


        if (categoryFilter) {
            categoryFilter.addEventListener(
                "change",
                handleFilters
            );
        }


        if (statusFilter) {
            statusFilter.addEventListener(
                "change",
                handleFilters
            );
        }


        if (clearFiltersButton) {
            clearFiltersButton.addEventListener(
                "click",
                clearFilters
            );
        }


        if (tableBody) {
            tableBody.addEventListener(
                "click",
                handleTableClick
            );
        }


        setupModalEvents();
        setupStockInput();
        setupProductUpdateListener();
        setupVisibilityRefresh();
    }


    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }

})();
