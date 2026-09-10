(function () {
    "use strict";

    /* =========================================================
       GlowSkin Admin — Orders
       File: assets/js/admin-orders.js
       ========================================================= */

    const ORDERS_KEY = "glowskin_orders";
    const CART_KEY = "glowskin_cart";
    const WISHLIST_KEY = "glowskin_wishlist";

    const STATUS = {
        PLACED: "Placed",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled"
    };

    const PAYMENT_NAMES = {
        cod: "Cash on Delivery",
        upi: "UPI",
        card: "Card",
        cashondelivery: "Cash on Delivery",
        "cash on delivery": "Cash on Delivery",
        "credit card": "Card",
        "debit card": "Card"
    };

    /* =========================
       DOM REFERENCES
       ========================= */

    const orderSearch = document.getElementById("orderSearch");
    const orderStatusFilter = document.getElementById("orderStatusFilter");
    const orderPaymentFilter = document.getElementById("orderPaymentFilter");
    const clearOrderFilters = document.getElementById("clearOrderFilters");

    const orderResultCount = document.getElementById("orderResultCount");
    const ordersTableBody = document.getElementById("ordersTableBody");
    const ordersEmptyState = document.getElementById("ordersEmptyState");

    const ordersTotalCount = document.getElementById("ordersTotalCount");
    const ordersPendingCount = document.getElementById("ordersPendingCount");
    const ordersShippedCount = document.getElementById("ordersShippedCount");
    const ordersDeliveredCount = document.getElementById("ordersDeliveredCount");

    const orderDetailsModal = document.getElementById("orderDetailsModal");
    const orderDetailsTitle = document.getElementById("orderDetailsTitle");
    const orderDetailsBody = document.getElementById("orderDetailsBody");
    const orderDetailsClose = document.getElementById("orderDetailsClose");
    const closeOrderDetailsButton = document.getElementById("closeOrderDetailsButton");

    const orderStatusModal = document.getElementById("orderStatusModal");
    const statusOrderId = document.getElementById("statusOrderId");
    const newOrderStatus = document.getElementById("newOrderStatus");
    const orderStatusClose = document.getElementById("orderStatusClose");
    const cancelStatusButton = document.getElementById("cancelStatusButton");
    const saveStatusButton = document.getElementById("saveStatusButton");

    let allOrders = [];
    let filteredOrders = [];
    let editingOrderId = null;


    /* =========================
       STORAGE HELPERS
       ========================= */

    function getStorageArray(key) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);

            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn("GlowSkin storage read error:", error);
            return [];
        }
    }


    function saveOrders(orders) {
        try {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            return true;
        } catch (error) {
            console.warn("GlowSkin order save error:", error);
            return false;
        }
    }


    /* =========================
       STRING HELPERS
       ========================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function normalizeText(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }


    /* =========================
       MONEY
       ========================= */

    function formatINR(value) {
        const number = Number(value) || 0;

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(number);
    }


    /* =========================
       STATUS HELPERS
       ========================= */

    function normalizeStatus(status) {
        const value = normalizeText(status);

        if (value === "placed") {
            return STATUS.PLACED;
        }

        if (
            value === "processing" ||
            value === "processed" ||
            value === "confirmed"
        ) {
            return STATUS.PROCESSING;
        }

        if (
            value === "shipped" ||
            value === "shipping" ||
            value === "in transit"
        ) {
            return STATUS.SHIPPED;
        }

        if (
            value === "delivered" ||
            value === "complete" ||
            value === "completed"
        ) {
            return STATUS.DELIVERED;
        }

        if (
            value === "cancelled" ||
            value === "canceled"
        ) {
            return STATUS.CANCELLED;
        }

        return STATUS.PLACED;
    }


    function getStatusClass(status) {
        return normalizeStatus(status)
            .toLowerCase()
            .replace(/\s+/g, "-");
    }


    /* =========================
       PAYMENT HELPERS
       ========================= */

    function normalizePayment(payment) {
        const value = normalizeText(payment);

        if (PAYMENT_NAMES[value]) {
            return PAYMENT_NAMES[value];
        }

        if (value.includes("upi")) {
            return "UPI";
        }

        if (value.includes("card")) {
            return "Card";
        }

        if (value.includes("cash") || value.includes("cod")) {
            return "Cash on Delivery";
        }

        return payment
            ? String(payment)
            : "Not specified";
    }


    /* =========================
       DATE HELPERS
       ========================= */

    function getOrderDate(order) {
        return (
            order.createdAt ||
            order.date ||
            order.orderDate ||
            order.created ||
            order.timestamp ||
            ""
        );
    }


    function formatDate(value) {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return escapeHTML(value);
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(date);
    }


    function formatDateTime(value) {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return escapeHTML(value);
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }


    /* =========================
       ORDER ID
       ========================= */

    function getOrderId(order) {
        return (
            order.id ||
            order.orderId ||
            order.orderID ||
            order.number ||
            "Unknown"
        );
    }


    /* =========================
       CUSTOMER HELPERS
       ========================= */

    function getCustomer(order) {
        const customer = order.customer || order.customerDetails || {};

        return {
            name:
                customer.name ||
                order.customerName ||
                order.name ||
                "Guest Customer",

            email:
                customer.email ||
                order.customerEmail ||
                order.email ||
                "",

            phone:
                customer.phone ||
                customer.mobile ||
                order.customerPhone ||
                order.phone ||
                "",

            address:
                customer.address ||
                order.customerAddress ||
                order.address ||
                "",

            city:
                customer.city ||
                order.customerCity ||
                order.city ||
                "",

            state:
                customer.state ||
                order.customerState ||
                order.state ||
                "",

            pincode:
                customer.pincode ||
                customer.pin ||
                order.customerPincode ||
                order.pincode ||
                ""
        };
    }


    /* =========================
       ORDER ITEMS
       ========================= */

    function getOrderItems(order) {
        if (Array.isArray(order.items)) {
            return order.items;
        }

        if (Array.isArray(order.products)) {
            return order.products;
        }

        return [];
    }


    function getItemName(item) {
        return (
            item.name ||
            item.productName ||
            item.title ||
            "Product"
        );
    }


    function getItemQuantity(item) {
        const quantity =
            item.quantity ||
            item.qty ||
            item.count ||
            1;

        return Math.max(1, Number(quantity) || 1);
    }


    function getItemPrice(item) {
        return Number(
            item.price ??
            item.productPrice ??
            item.unitPrice ??
            0
        ) || 0;
    }


    function getItemImage(item) {
        return (
            item.image ||
            item.imagePath ||
            item.productImage ||
            ""
        );
    }


    /* =========================
       ORDER TOTALS
       ========================= */

    function getOrderSubtotal(order) {
        if (order.summary && order.summary.subtotal != null) {
            return Number(order.summary.subtotal) || 0;
        }

        if (order.subtotal != null) {
            return Number(order.subtotal) || 0;
        }

        const items = getOrderItems(order);

        return items.reduce(function (total, item) {
            return total + (getItemPrice(item) * getItemQuantity(item));
        }, 0);
    }


    function getOrderDiscount(order) {
        if (order.summary && order.summary.discount != null) {
            return Number(order.summary.discount) || 0;
        }

        return Number(order.discount) || 0;
    }


    function getOrderShipping(order) {
        if (order.summary && order.summary.shipping != null) {
            return Number(order.summary.shipping) || 0;
        }

        if (order.shipping != null) {
            return Number(order.shipping) || 0;
        }

        const subtotal = getOrderSubtotal(order);

        return subtotal >= 999 ? 0 : 49;
    }


    function getOrderTotal(order) {
        if (order.summary && order.summary.total != null) {
            return Number(order.summary.total) || 0;
        }

        if (order.total != null) {
            return Number(order.total) || 0;
        }

        return (
            getOrderSubtotal(order) -
            getOrderDiscount(order) +
            getOrderShipping(order)
        );
    }


    /* =========================
       LOAD ORDERS
       ========================= */

    function loadOrders() {
        allOrders = getStorageArray(ORDERS_KEY);

        /*
         * Newest orders first.
         * Orders without dates remain in their current order.
         */
        allOrders.sort(function (a, b) {
            const dateA = new Date(getOrderDate(a)).getTime();
            const dateB = new Date(getOrderDate(b)).getTime();

            if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
                return 0;
            }

            return dateB - dateA;
        });

        applyFilters();
    }


    /* =========================
       FILTERS
       ========================= */

    function applyFilters() {
        const searchValue = normalizeText(
            orderSearch ? orderSearch.value : ""
        );

        const statusValue =
            orderStatusFilter
                ? normalizeText(orderStatusFilter.value)
                : "";

        const paymentValue =
            orderPaymentFilter
                ? normalizeText(orderPaymentFilter.value)
                : "";

        filteredOrders = allOrders.filter(function (order) {
            const customer = getCustomer(order);
            const orderId = normalizeText(getOrderId(order));
            const customerName = normalizeText(customer.name);
            const customerEmail = normalizeText(customer.email);

            const status = normalizeText(
                normalizeStatus(order.status)
            );

            const payment = normalizeText(
                normalizePayment(
                    order.paymentMethod ||
                    order.payment ||
                    (order.payment && order.payment.method)
                )
            );

            const matchesSearch =
                !searchValue ||
                orderId.includes(searchValue) ||
                customerName.includes(searchValue) ||
                customerEmail.includes(searchValue);

            const matchesStatus =
                !statusValue ||
                status === statusValue;

            const matchesPayment =
                !paymentValue ||
                payment === paymentValue;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment
            );
        });

        renderOrders();
        updateStats();
    }


    /* =========================
       RENDER ORDERS
       ========================= */

    function renderOrders() {
        if (!ordersTableBody) {
            return;
        }

        ordersTableBody.innerHTML = "";

        if (orderResultCount) {
            orderResultCount.textContent =
                filteredOrders.length +
                (filteredOrders.length === 1 ? " order" : " orders");
        }

        if (!filteredOrders.length) {
            if (ordersEmptyState) {
                ordersEmptyState.classList.add("show");
            }

            return;
        }

        if (ordersEmptyState) {
            ordersEmptyState.classList.remove("show");
        }

        const fragment = document.createDocumentFragment();

        filteredOrders.forEach(function (order) {
            const row = document.createElement("tr");

            const orderId = getOrderId(order);
            const customer = getCustomer(order);

            const payment = normalizePayment(
                order.paymentMethod ||
                order.payment ||
                (order.payment && order.payment.method)
            );

            const status = normalizeStatus(order.status);

            row.innerHTML = `
                <td class="order-id-cell">
                    #${escapeHTML(orderId)}
                </td>

                <td class="order-customer-cell">
                    <span class="order-customer-name">
                        ${escapeHTML(customer.name)}
                    </span>

                    ${
                        customer.email
                            ? `
                                <span class="order-customer-email">
                                    ${escapeHTML(customer.email)}
                                </span>
                              `
                            : ""
                    }
                </td>

                <td class="order-date-cell">
                    ${formatDate(getOrderDate(order))}
                </td>

                <td class="order-price-cell">
                    ${formatINR(getOrderTotal(order))}
                </td>

                <td class="order-payment-cell">
                    <span class="order-payment-label">
                        ${escapeHTML(payment)}
                    </span>
                </td>

                <td>
                    <span class="order-status-badge ${getStatusClass(status)}">
                        ${escapeHTML(status)}
                    </span>
                </td>

                <td class="order-action-cell">
                    <div class="order-action-buttons">
                        <button
                            type="button"
                            class="order-action-button"
                            data-action="view"
                            data-order-id="${escapeHTML(orderId)}"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="order-action-button primary"
                            data-action="status"
                            data-order-id="${escapeHTML(orderId)}"
                        >
                            Status
                        </button>
                    </div>
                </td>
            `;

            fragment.appendChild(row);
        });

        ordersTableBody.appendChild(fragment);
    }


    /* =========================
       UPDATE STATS
       ========================= */

    function updateStats() {
        const total = allOrders.length;

        let pending = 0;
        let shipped = 0;
        let delivered = 0;

        allOrders.forEach(function (order) {
            const status = normalizeStatus(order.status);

            if (
                status === STATUS.PLACED ||
                status === STATUS.PROCESSING
            ) {
                pending++;
            }

            if (status === STATUS.SHIPPED) {
                shipped++;
            }

            if (status === STATUS.DELIVERED) {
                delivered++;
            }
        });

        if (ordersTotalCount) {
            ordersTotalCount.textContent = total;
        }

        if (ordersPendingCount) {
            ordersPendingCount.textContent = pending;
        }

        if (ordersShippedCount) {
            ordersShippedCount.textContent = shipped;
        }

        if (ordersDeliveredCount) {
            ordersDeliveredCount.textContent = delivered;
        }
    }


    /* =========================
       FIND ORDER
       ========================= */

    function findOrder(orderId) {
        const target = normalizeText(orderId);

        return allOrders.find(function (order) {
            return normalizeText(getOrderId(order)) === target;
        });
    }


    /* =========================
       ORDER DETAILS
       ========================= */

    function renderOrderDetails(order) {
        if (!orderDetailsBody || !order) {
            return;
        }

        const orderId = getOrderId(order);
        const customer = getCustomer(order);

        const payment = normalizePayment(
            order.paymentMethod ||
            order.payment ||
            (order.payment && order.payment.method)
        );

        const status = normalizeStatus(order.status);
        const items = getOrderItems(order);

        const subtotal = getOrderSubtotal(order);
        const discount = getOrderDiscount(order);
        const shipping = getOrderShipping(order);
        const total = getOrderTotal(order);

        const delivery =
            order.estimatedDelivery ||
            order.deliveryDate ||
            order.expectedDelivery ||
            "3–7 business days";

        const itemsHTML = items.length
            ? items.map(function (item) {
                const name = getItemName(item);
                const quantity = getItemQuantity(item);
                const price = getItemPrice(item);
                const image = getItemImage(item);

                const itemTotal = price * quantity;

                return `
                    <div class="order-details-item">

                        <div class="order-details-item-image">
                            ${
                                image
                                    ? `
                                        <img
                                            src="${escapeHTML(image)}"
                                            alt="${escapeHTML(name)}"
                                            onerror="this.style.display='none';"
                                        >
                                      `
                                    : ""
                            }
                        </div>

                        <div class="order-details-item-info">
                            <p class="order-details-item-name">
                                ${escapeHTML(name)}
                            </p>

                            <p class="order-details-item-meta">
                                Qty: ${quantity}
                                × ${formatINR(price)}
                            </p>
                        </div>

                        <div class="order-details-item-price">
                            ${formatINR(itemTotal)}
                        </div>

                    </div>
                `;
            }).join("")
            : `
                <p style="margin:0;color:var(--admin-muted);font-size:13px;">
                    No item details available for this order.
                </p>
            `;

        const fullAddress = [
            customer.address,
            customer.city,
            customer.state,
            customer.pincode
        ]
            .filter(Boolean)
            .join(", ");

        orderDetailsBody.innerHTML = `
            <div class="order-details-grid">

                <section class="order-details-section">
                    <h3>Order Information</h3>

                    <dl class="order-details-list">

                        <div class="order-details-row">
                            <dt>Order ID</dt>
                            <dd>#${escapeHTML(orderId)}</dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Date</dt>
                            <dd>
                                ${formatDateTime(getOrderDate(order))}
                            </dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Status</dt>
                            <dd>
                                <span class="order-status-badge ${getStatusClass(status)}">
                                    ${escapeHTML(status)}
                                </span>
                            </dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Payment</dt>
                            <dd>${escapeHTML(payment)}</dd>
                        </div>

                    </dl>
                </section>


                <section class="order-details-section">
                    <h3>Customer Information</h3>

                    <dl class="order-details-list">

                        <div class="order-details-row">
                            <dt>Name</dt>
                            <dd>${escapeHTML(customer.name)}</dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Email</dt>
                            <dd>${escapeHTML(customer.email || "—")}</dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Phone</dt>
                            <dd>${escapeHTML(customer.phone || "—")}</dd>
                        </div>

                    </dl>
                </section>


                <section class="order-details-section">
                    <h3>Delivery Information</h3>

                    <dl class="order-details-list">

                        <div class="order-details-row">
                            <dt>Address</dt>
                            <dd>${escapeHTML(fullAddress || "—")}</dd>
                        </div>

                        <div class="order-details-row">
                            <dt>Expected Delivery</dt>
                            <dd>${escapeHTML(delivery)}</dd>
                        </div>

                    </dl>
                </section>


                <section class="order-details-section">
                    <h3>Order Summary</h3>

                    <div class="order-details-summary">

                        <div class="order-summary-row">
                            <span>Subtotal</span>
                            <strong>${formatINR(subtotal)}</strong>
                        </div>

                        <div class="order-summary-row">
                            <span>Discount</span>
                            <strong>− ${formatINR(discount)}</strong>
                        </div>

                        <div class="order-summary-row">
                            <span>Shipping</span>
                            <strong>
                                ${
                                    shipping === 0
                                        ? "FREE"
                                        : formatINR(shipping)
                                }
                            </strong>
                        </div>

                        <div class="order-summary-row total">
                            <span>Total</span>
                            <strong>${formatINR(total)}</strong>
                        </div>

                    </div>
                </section>


                <section class="order-details-section full">
                    <h3>Products</h3>

                    <div class="order-details-items">
                        ${itemsHTML}
                    </div>
                </section>

            </div>
        `;
    }


    function openOrderDetails(orderId) {
        const order = findOrder(orderId);

        if (!order) {
            showToast("Order not found.");
            return;
        }

        if (orderDetailsTitle) {
            orderDetailsTitle.textContent =
                "Order #" + getOrderId(order);
        }

        renderOrderDetails(order);

        if (orderDetailsModal) {
            openModal(orderDetailsModal);
        }
    }


    /* =========================
       STATUS MODAL
       ========================= */

    function openStatusModal(orderId) {
        const order = findOrder(orderId);

        if (!order) {
            showToast("Order not found.");
            return;
        }

        editingOrderId = getOrderId(order);

        if (statusOrderId) {
            statusOrderId.textContent =
                "#" + editingOrderId;
        }

        if (newOrderStatus) {
            newOrderStatus.value =
                normalizeStatus(order.status);
        }

        if (orderStatusModal) {
            openModal(orderStatusModal);
        }
    }


    function updateOrderStatus() {
        if (!editingOrderId || !newOrderStatus) {
            return;
        }

        const selectedStatus =
            normalizeStatus(newOrderStatus.value);

        const orderIndex = allOrders.findIndex(function (order) {
            return normalizeText(getOrderId(order)) ===
                normalizeText(editingOrderId);
        });

        if (orderIndex === -1) {
            showToast("Order not found.");
            return;
        }

        allOrders[orderIndex].status = selectedStatus;

        /*
         * Keep status updatedAt available for future backend use,
         * without requiring a backend right now.
         */
        allOrders[orderIndex].updatedAt =
            new Date().toISOString();

        const saved = saveOrders(allOrders);

        if (!saved) {
            showToast("Could not save order status.");
            return;
        }

        closeModal(orderStatusModal);

        showToast(
            "Order status updated to " + selectedStatus + "."
        );

        editingOrderId = null;

        applyFilters();

        /*
         * Refresh dashboard data if dashboard is open
         * in another tab/window.
         */
        try {
            window.dispatchEvent(
                new StorageEvent(
                    "storage",
                    {
                        key: ORDERS_KEY,
                        newValue: JSON.stringify(allOrders)
                    }
                )
            );
        } catch (error) {
            /* Ignore unsupported StorageEvent construction */
        }
    }


    /* =========================
       MODAL HELPERS
       ========================= */

    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("admin-modal-open");
    }


    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        if (
            (!orderDetailsModal ||
                !orderDetailsModal.classList.contains("active")) &&
            (!orderStatusModal ||
                !orderStatusModal.classList.contains("active"))
        ) {
            document.body.classList.remove("admin-modal-open");
        }
    }


    /* =========================
       TOAST
       ========================= */

    function showToast(message) {
        if (
            typeof window.glowSkinAdminToast ===
            "function"
        ) {
            window.glowSkinAdminToast(message);
            return;
        }

        /*
         * Fallback if admin.js is unavailable.
         */
        let toast = document.getElementById(
            "ordersFallbackToast"
        );

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "ordersFallbackToast";

            toast.style.position = "fixed";
            toast.style.right = "20px";
            toast.style.bottom = "20px";
            toast.style.zIndex = "99999";
            toast.style.padding = "12px 16px";
            toast.style.borderRadius = "10px";
            toast.style.background = "#211914";
            toast.style.color = "#fff";
            toast.style.fontSize = "13px";
            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.18)";

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(toast._timer);

        toast._timer = setTimeout(function () {
            toast.style.display = "none";
        }, 3000);
    }


    /* =========================
       FILTER EVENTS
       ========================= */

    function setupFilters() {
        if (orderSearch) {
            orderSearch.addEventListener(
                "input",
                applyFilters
            );
        }

        if (orderStatusFilter) {
            orderStatusFilter.addEventListener(
                "change",
                applyFilters
            );
        }

        if (orderPaymentFilter) {
            orderPaymentFilter.addEventListener(
                "change",
                applyFilters
            );
        }

        if (clearOrderFilters) {
            clearOrderFilters.addEventListener(
                "click",
                function () {
                    if (orderSearch) {
                        orderSearch.value = "";
                    }

                    if (orderStatusFilter) {
                        orderStatusFilter.value = "";
                    }

                    if (orderPaymentFilter) {
                        orderPaymentFilter.value = "";
                    }

                    applyFilters();
                }
            );
        }
    }


    /* =========================
       TABLE ACTIONS
       ========================= */

    function setupTableActions() {
        if (!ordersTableBody) {
            return;
        }

        ordersTableBody.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button[data-action]"
                    );

                if (!button) {
                    return;
                }

                const action =
                    button.getAttribute("data-action");

                const orderId =
                    button.getAttribute("data-order-id");

                if (action === "view") {
                    openOrderDetails(orderId);
                }

                if (action === "status") {
                    openStatusModal(orderId);
                }
            }
        );
    }


    /* =========================
       MODAL EVENTS
       ========================= */

    function setupModalEvents() {
        if (orderDetailsClose) {
            orderDetailsClose.addEventListener(
                "click",
                function () {
                    closeModal(orderDetailsModal);
                }
            );
        }

        if (closeOrderDetailsButton) {
            closeOrderDetailsButton.addEventListener(
                "click",
                function () {
                    closeModal(orderDetailsModal);
                }
            );
        }

        if (orderStatusClose) {
            orderStatusClose.addEventListener(
                "click",
                function () {
                    closeModal(orderStatusModal);
                    editingOrderId = null;
                }
            );
        }

        if (cancelStatusButton) {
            cancelStatusButton.addEventListener(
                "click",
                function () {
                    closeModal(orderStatusModal);
                    editingOrderId = null;
                }
            );
        }

        if (saveStatusButton) {
            saveStatusButton.addEventListener(
                "click",
                updateOrderStatus
            );
        }

        /*
         * Close modal when clicking the backdrop.
         */
        [orderDetailsModal, orderStatusModal].forEach(
            function (modal) {
                if (!modal) {
                    return;
                }

                modal.addEventListener(
                    "click",
                    function (event) {
                        if (event.target === modal) {
                            closeModal(modal);

                            if (modal === orderStatusModal) {
                                editingOrderId = null;
                            }
                        }
                    }
                );
            }
        );
    }


    /* =========================
       KEYBOARD
       ========================= */

    function setupKeyboard() {
        document.addEventListener(
            "keydown",
            function (event) {
                if (event.key !== "Escape") {
                    return;
                }

                if (
                    orderStatusModal &&
                    orderStatusModal.classList.contains("active")
                ) {
                    closeModal(orderStatusModal);
                    editingOrderId = null;
                    return;
                }

                if (
                    orderDetailsModal &&
                    orderDetailsModal.classList.contains("active")
                ) {
                    closeModal(orderDetailsModal);
                }
            }
        );
    }


    /* =========================
       STORAGE / VISIBILITY
       ========================= */

    function setupRefreshEvents() {
        window.addEventListener(
            "storage",
            function (event) {
                if (event.key === ORDERS_KEY) {
                    loadOrders();
                }
            }
        );

        document.addEventListener(
            "visibilitychange",
            function () {
                if (
                    document.visibilityState ===
                    "visible"
                ) {
                    loadOrders();
                }
            }
        );
    }


    /* =========================
       ADMIN COUNTS
       ========================= */

    function updateSharedAdminCounts() {
        /*
         * admin.js already manages sidebar counts.
         * This function provides extra compatibility
         * for IDs that may exist on future admin pages.
         */

        const sidebarOrderCount =
            document.getElementById(
                "sidebarOrderCount"
            );

        if (sidebarOrderCount) {
            sidebarOrderCount.textContent =
                allOrders.length;
        }

        const adminCartCount =
            document.getElementById(
                "adminCartCount"
            );

        if (adminCartCount) {
            adminCartCount.textContent =
                getStorageArray(CART_KEY).length;
        }

        const adminWishlistCount =
            document.getElementById(
                "adminWishlistCount"
            );

        if (adminWishlistCount) {
            adminWishlistCount.textContent =
                getStorageArray(WISHLIST_KEY).length;
        }
    }


    /* =========================
       INITIALIZE
       ========================= */

    function init() {
        setupFilters();
        setupTableActions();
        setupModalEvents();
        setupKeyboard();
        setupRefreshEvents();

        loadOrders();
        updateSharedAdminCounts();
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
