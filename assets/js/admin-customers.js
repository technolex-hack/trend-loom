(function () {
    "use strict";

    /* =========================================================
       GlowSkin Admin — Customers
       File: assets/js/admin-customers.js
       ========================================================= */

    const USERS_KEY = "glowskin_users";
    const ORDERS_KEY = "glowskin_orders";
    const CART_KEY = "glowskin_cart";
    const WISHLIST_KEY = "glowskin_wishlist";

    let allCustomers = [];
    let filteredCustomers = [];
    let selectedCustomer = null;


    /* =========================
       DOM REFERENCES
       ========================= */

    const customerSearch =
        document.getElementById("customerSearch");

    const customerSort =
        document.getElementById("customerSort");

    const clearCustomerFilters =
        document.getElementById("clearCustomerFilters");

    const customerResultCount =
        document.getElementById("customerResultCount");

    const customersTableBody =
        document.getElementById("customersTableBody");

    const customersEmptyState =
        document.getElementById("customersEmptyState");

    const customersTotalCount =
        document.getElementById("customersTotalCount");

    const customersNewCount =
        document.getElementById("customersNewCount");

    const customersWithOrdersCount =
        document.getElementById("customersWithOrdersCount");

    const customersTotalSpend =
        document.getElementById("customersTotalSpend");

    const sidebarCustomerCount =
        document.getElementById("sidebarCustomerCount");

    const sidebarOrderCount =
        document.getElementById("sidebarOrderCount");

    const customerDetailsModal =
        document.getElementById("customerDetailsModal");

    const customerDetailsTitle =
        document.getElementById("customerDetailsTitle");

    const customerDetailsSubtitle =
        document.getElementById("customerDetailsSubtitle");

    const customerDetailsBody =
        document.getElementById("customerDetailsBody");

    const customerDetailsClose =
        document.getElementById("customerDetailsClose");

    const closeCustomerDetailsButton =
        document.getElementById("closeCustomerDetailsButton");


    /* =========================
       STORAGE
       ========================= */

    function getStorageArray(key) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);

            return Array.isArray(parsed)
                ? parsed
                : [];
        } catch (error) {
            console.warn(
                "GlowSkin storage error:",
                error
            );

            return [];
        }
    }


    /* =========================
       HTML ESCAPE
       ========================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================
       TEXT NORMALIZE
       ========================= */

    function normalizeText(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }


    /* =========================
       INR
       ========================= */

    function formatINR(value) {
        const amount =
            Number(value) || 0;

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(amount);
    }


    /* =========================
       DATE
       ========================= */

    function parseDate(value) {
        if (!value) {
            return null;
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return null;
        }

        return date;
    }


    function formatDate(value) {
        const date = parseDate(value);

        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);
    }


    function formatDateTime(value) {
        const date = parseDate(value);

        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);
    }


    /* =========================
       CUSTOMER ID
       ========================= */

    function createCustomerId(
        user,
        index
    ) {
        if (user.id) {
            return String(user.id);
        }

        if (user.userId) {
            return String(user.userId);
        }

        if (user.email) {
            return (
                "CUS-" +
                normalizeText(user.email)
                    .replace(/[^a-z0-9]/g, "")
                    .slice(0, 10)
                    .toUpperCase()
            );
        }

        return (
            "CUS-" +
            String(index + 1)
                .padStart(4, "0")
        );
    }


    /* =========================
       USER DATA
       ========================= */

    function getUserName(user) {
        return (
            user.name ||
            user.fullName ||
            user.customerName ||
            [
                user.firstName,
                user.lastName
            ]
                .filter(Boolean)
                .join(" ") ||
            "Customer"
        );
    }


    function getUserEmail(user) {
        return (
            user.email ||
            user.emailAddress ||
            ""
        );
    }


    function getUserPhone(user) {
        return (
            user.phone ||
            user.mobile ||
            user.phoneNumber ||
            ""
        );
    }


    function getUserJoinedDate(user) {
        return (
            user.createdAt ||
            user.createdDate ||
            user.registeredAt ||
            user.joinedAt ||
            user.date ||
            ""
        );
    }


    /* =========================
       ORDER DATA
       ========================= */

    function getOrderId(order) {
        return (
            order.id ||
            order.orderId ||
            order.orderID ||
            order.number ||
            ""
        );
    }


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


    function getOrderCustomer(order) {
        const customer =
            order.customer ||
            order.customerDetails ||
            {};

        return {
            name:
                customer.name ||
                order.customerName ||
                order.name ||
                "",

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
                ""
        };
    }


    function getOrderItems(order) {
        if (
            Array.isArray(order.items)
        ) {
            return order.items;
        }

        if (
            Array.isArray(order.products)
        ) {
            return order.products;
        }

        return [];
    }


    function getItemPrice(item) {
        return Number(
            item.price ??
            item.productPrice ??
            item.unitPrice ??
            0
        ) || 0;
    }


    function getItemQuantity(item) {
        return Math.max(
            1,
            Number(
                item.quantity ??
                item.qty ??
                item.count ??
                1
            ) || 1
        );
    }


    function calculateItemsTotal(order) {
        const items =
            getOrderItems(order);

        return items.reduce(
            function (total, item) {
                return (
                    total +
                    (
                        getItemPrice(item) *
                        getItemQuantity(item)
                    )
                );
            },
            0
        );
    }


    function getOrderTotal(order) {
        if (
            order.summary &&
            order.summary.total != null
        ) {
            return (
                Number(
                    order.summary.total
                ) || 0
            );
        }

        if (
            order.total != null
        ) {
            return (
                Number(order.total) || 0
            );
        }

        const subtotal =
            order.summary &&
            order.summary.subtotal != null
                ? Number(
                    order.summary.subtotal
                ) || 0
                : calculateItemsTotal(
                    order
                );

        const discount =
            order.summary &&
            order.summary.discount != null
                ? Number(
                    order.summary.discount
                ) || 0
                : Number(
                    order.discount
                ) || 0;

        const shipping =
            order.summary &&
            order.summary.shipping != null
                ? Number(
                    order.summary.shipping
                ) || 0
                : (
                    subtotal >= 999
                        ? 0
                        : 49
                );

        return (
            subtotal -
            discount +
            shipping
        );
    }


    /* =========================
       CUSTOMER KEY
       ========================= */

    function getCustomerKey(
        name,
        email,
        phone
    ) {
        const normalizedEmail =
            normalizeText(email);

        const normalizedPhone =
            normalizeText(phone);

        if (normalizedEmail) {
            return "email:" + normalizedEmail;
        }

        if (normalizedPhone) {
            return "phone:" + normalizedPhone;
        }

        return (
            "name:" +
            normalizeText(name)
        );
    }


    /* =========================
       BUILD CUSTOMERS
       ========================= */

    function buildCustomers() {
        const users =
            getStorageArray(
                USERS_KEY
            );

        const orders =
            getStorageArray(
                ORDERS_KEY
            );

        const customerMap =
            new Map();

        /*
         * First add registered users.
         */
        users.forEach(
            function (user, index) {
                const name =
                    getUserName(user);

                const email =
                    getUserEmail(user);

                const phone =
                    getUserPhone(user);

                const key =
                    getCustomerKey(
                        name,
                        email,
                        phone
                    );

                customerMap.set(
                    key,
                    {
                        id:
                            createCustomerId(
                                user,
                                index
                            ),

                        name: name,

                        email: email,

                        phone: phone,

                        joinedAt:
                            getUserJoinedDate(
                                user
                            ),

                        orders: [],

                        orderCount: 0,

                        totalSpent: 0,

                        lastOrderDate: "",

                        lastOrderId: ""
                    }
                );
            }
        );


        /*
         * Then add customers found in orders.
         * This allows guest/order customers to appear
         * even when no registered account exists.
         */
        orders.forEach(
            function (order, orderIndex) {
                const customer =
                    getOrderCustomer(
                        order
                    );

                const name =
                    customer.name ||
                    "Guest Customer";

                const email =
                    customer.email ||
                    "";

                const phone =
                    customer.phone ||
                    "";

                const key =
                    getCustomerKey(
                        name,
                        email,
                        phone
                    );

                if (
                    !customerMap.has(key)
                ) {
                    customerMap.set(
                        key,
                        {
                            id:
                                "CUS-" +
                                String(
                                    orderIndex + 1
                                )
                                    .padStart(
                                        4,
                                        "0"
                                    ),

                            name: name,

                            email: email,

                            phone: phone,

                            joinedAt:
                                getOrderDate(
                                    order
                                ),

                            orders: [],

                            orderCount: 0,

                            totalSpent: 0,

                            lastOrderDate: "",

                            lastOrderId: ""
                        }
                    );
                }


                const customerData =
                    customerMap.get(
                        key
                    );

                customerData.orders.push(
                    order
                );

                customerData.orderCount =
                    customerData.orders.length;

                customerData.totalSpent +=
                    getOrderTotal(
                        order
                    );

                const currentDate =
                    parseDate(
                        getOrderDate(
                            order
                        )
                    );

                const previousDate =
                    parseDate(
                        customerData.lastOrderDate
                    );

                if (
                    currentDate &&
                    (
                        !previousDate ||
                        currentDate >
                        previousDate
                    )
                ) {
                    customerData.lastOrderDate =
                        getOrderDate(
                            order
                        );

                    customerData.lastOrderId =
                        getOrderId(
                            order
                        );
                }
            }
        );


        /*
         * Convert Map to Array.
         */
        allCustomers =
            Array.from(
                customerMap.values()
            );


        /*
         * If a registered user has no order,
         * still keep the customer.
         */
        allCustomers.forEach(
            function (customer) {
                if (
                    !customer.joinedAt &&
                    customer.orders.length
                ) {
                    customer.joinedAt =
                        getOrderDate(
                            customer.orders[0]
                        );
                }
            }
        );


        filteredCustomers =
            allCustomers.slice();
    }


    /* =========================
       NEW CUSTOMER COUNT
       ========================= */

    function isNewCustomer(customer) {
        const date =
            parseDate(
                customer.joinedAt
            );

        if (!date) {
            return false;
        }

        const now =
            new Date();

        const difference =
            now.getTime() -
            date.getTime();

        const days =
            difference /
            (1000 * 60 * 60 * 24);

        return (
            days >= 0 &&
            days <= 30
        );
    }


    /* =========================
       STATS
       ========================= */

    function updateStats() {
        const total =
            allCustomers.length;

        const newCustomers =
            allCustomers.filter(
                isNewCustomer
            ).length;

        const customersWithOrders =
            allCustomers.filter(
                function (customer) {
                    return (
                        customer.orderCount >
                        0
                    );
                }
            ).length;

        const totalSpend =
            allCustomers.reduce(
                function (
                    total,
                    customer
                ) {
                    return (
                        total +
                        customer.totalSpent
                    );
                },
                0
            );


        if (customersTotalCount) {
            customersTotalCount.textContent =
                total;
        }

        if (customersNewCount) {
            customersNewCount.textContent =
                newCustomers;
        }

        if (
            customersWithOrdersCount
        ) {
            customersWithOrdersCount.textContent =
                customersWithOrders;
        }

        if (customersTotalSpend) {
            customersTotalSpend.textContent =
                formatINR(
                    totalSpend
                );
        }

        if (sidebarCustomerCount) {
            sidebarCustomerCount.textContent =
                total;
        }

        if (sidebarOrderCount) {
            sidebarOrderCount.textContent =
                getStorageArray(
                    ORDERS_KEY
                ).length;
        }
    }


    /* =========================
       SORT
       ========================= */

    function sortCustomers() {
        const sortValue =
            customerSort
                ? customerSort.value
                : "newest";

        filteredCustomers.sort(
            function (a, b) {
                if (
                    sortValue ===
                    "name-asc"
                ) {
                    return a.name.localeCompare(
                        b.name
                    );
                }

                if (
                    sortValue ===
                    "name-desc"
                ) {
                    return b.name.localeCompare(
                        a.name
                    );
                }

                if (
                    sortValue ===
                    "spent-high"
                ) {
                    return (
                        b.totalSpent -
                        a.totalSpent
                    );
                }

                if (
                    sortValue ===
                    "spent-low"
                ) {
                    return (
                        a.totalSpent -
                        b.totalSpent
                    );
                }

                const dateA =
                    parseDate(
                        a.joinedAt
                    );

                const dateB =
                    parseDate(
                        b.joinedAt
                    );

                if (
                    !dateA &&
                    !dateB
                ) {
                    return 0;
                }

                if (!dateA) {
                    return 1;
                }

                if (!dateB) {
                    return -1;
                }

                if (
                    sortValue ===
                    "oldest"
                ) {
                    return (
                        dateA.getTime() -
                        dateB.getTime()
                    );
                }

                return (
                    dateB.getTime() -
                    dateA.getTime()
                );
            }
        );
    }


    /* =========================
       APPLY FILTERS
       ========================= */

    function applyFilters() {
        const search =
            normalizeText(
                customerSearch
                    ? customerSearch.value
                    : ""
            );

        filteredCustomers =
            allCustomers.filter(
                function (customer) {
                    if (!search) {
                        return true;
                    }

                    return (
                        normalizeText(
                            customer.name
                        ).includes(search) ||

                        normalizeText(
                            customer.email
                        ).includes(search) ||

                        normalizeText(
                            customer.phone
                        ).includes(search) ||

                        normalizeText(
                            customer.id
                        ).includes(search)
                    );
                }
            );

        sortCustomers();

        renderCustomers();
        updateStats();
    }


    /* =========================
       INITIALS
       ========================= */

    function getInitials(name) {
        const parts =
            String(name || "C")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (!parts.length) {
            return "C";
        }

        if (parts.length === 1) {
            return parts[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1]
                .charAt(0)
        ).toUpperCase();
    }


    /* =========================
       RENDER CUSTOMERS
       ========================= */

    function renderCustomers() {
        if (!customersTableBody) {
            return;
        }

        customersTableBody.innerHTML =
            "";

        if (customerResultCount) {
            customerResultCount.textContent =
                filteredCustomers.length +
                (
                    filteredCustomers.length ===
                    1
                        ? " customer"
                        : " customers"
                );
        }

        if (
            !filteredCustomers.length
        ) {
            if (customersEmptyState) {
                customersEmptyState.classList.add(
                    "show"
                );
            }

            return;
        }

        if (customersEmptyState) {
            customersEmptyState.classList.remove(
                "show"
            );
        }


        const fragment =
            document.createDocumentFragment();


        filteredCustomers.forEach(
            function (customer) {
                const row =
                    document.createElement(
                        "tr"
                    );

                const lastOrder =
                    customer.lastOrderDate
                        ? formatDate(
                            customer.lastOrderDate
                        )
                        : "No orders";

                row.innerHTML = `
                    <td>
                        <div class="customer-cell">

                            <div class="customer-avatar">
                                ${escapeHTML(
                                    getInitials(
                                        customer.name
                                    )
                                )}
                            </div>

                            <div class="customer-main-info">

                                <span class="customer-name">
                                    ${escapeHTML(
                                        customer.name
                                    )}
                                </span>

                                <span class="customer-id">
                                    ${escapeHTML(
                                        customer.id
                                    )}
                                </span>

                            </div>

                        </div>
                    </td>


                    <td>
                        <div class="customer-contact">

                            <span class="customer-email">
                                ${escapeHTML(
                                    customer.email ||
                                    "No email"
                                )}
                            </span>

                            <span class="customer-phone">
                                ${escapeHTML(
                                    customer.phone ||
                                    "No phone"
                                )}
                            </span>

                        </div>
                    </td>


                    <td class="customer-joined">
                        ${formatDate(
                            customer.joinedAt
                        )}
                    </td>


                    <td>
                        <span class="customer-orders-count">
                            ${customer.orderCount}
                        </span>
                    </td>


                    <td class="customer-spent">
                        ${formatINR(
                            customer.totalSpent
                        )}
                    </td>


                    <td class="customer-last-order">
                        ${escapeHTML(
                            lastOrder
                        )}
                    </td>


                    <td class="customer-action-cell">

                        <button
                            type="button"
                            class="customer-view-button"
                            data-customer-id="${escapeHTML(
                                customer.id
                            )}"
                        >
                            View
                        </button>

                    </td>
                `;

                fragment.appendChild(
                    row
                );
            }
        );


        customersTableBody.appendChild(
            fragment
        );
    }


    /* =========================
       FIND CUSTOMER
       ========================= */

    function findCustomerById(id) {
        return allCustomers.find(
            function (customer) {
                return (
                    String(
                        customer.id
                    ) ===
                    String(id)
                );
            }
        );
    }


    /* =========================
       CUSTOMER DETAILS
       ========================= */

    function renderCustomerDetails(
        customer
    ) {
        if (
            !customer ||
            !customerDetailsBody
        ) {
            return;
        }

        const orders =
            customer.orders
                .slice()
                .sort(
                    function (a, b) {
                        const dateA =
                            parseDate(
                                getOrderDate(a)
                            );

                        const dateB =
                            parseDate(
                                getOrderDate(b)
                            );

                        if (
                            !dateA ||
                            !dateB
                        ) {
                            return 0;
                        }

                        return (
                            dateB.getTime() -
                            dateA.getTime()
                        );
                    }
                );


        const orderHistoryHTML =
            orders.length
                ? orders.map(
                    function (order) {
                        const orderId =
                            getOrderId(
                                order
                            );

                        const status =
                            order.status ||
                            "Placed";

                        return `
                            <div class="customer-order-history-item">

                                <div>
                                    <div class="customer-order-history-id">
                                        #${escapeHTML(
                                            orderId ||
                                            "Order"
                                        )}
                                    </div>

                                    <div class="customer-order-history-date">
                                        ${formatDate(
                                            getOrderDate(
                                                order
                                            )
                                        )}
                                    </div>
                                </div>


                                <span
                                    class="order-status-badge ${String(
                                        status
                                    )
                                        .toLowerCase()
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        )}"
                                >
                                    ${escapeHTML(
                                        status
                                    )}
                                </span>


                                <div class="customer-order-history-total">
                                    ${formatINR(
                                        getOrderTotal(
                                            order
                                        )
                                    )}
                                </div>

                            </div>
                        `;
                    }
                ).join("")
                : `
                    <p
                        style="
                            margin:0;
                            color:var(--admin-muted);
                            font-size:13px;
                        "
                    >
                        This customer has not placed
                        any orders yet.
                    </p>
                `;


        customerDetailsBody.innerHTML = `

            <div class="customer-profile-box">

                <div class="customer-profile-avatar">
                    ${escapeHTML(
                        getInitials(
                            customer.name
                        )
                    )}
                </div>

                <div class="customer-profile-info">

                    <h3>
                        ${escapeHTML(
                            customer.name
                        )}
                    </h3>

                    <p>
                        Customer ID:
                        ${escapeHTML(
                            customer.id
                        )}
                    </p>

                </div>

            </div>


            <div class="customer-details-grid">

                <section class="customer-details-section">

                    <h3>
                        Contact Information
                    </h3>

                    <dl class="customer-details-list">

                        <div class="customer-details-row">
                            <dt>Email</dt>

                            <dd>
                                ${escapeHTML(
                                    customer.email ||
                                    "—"
                                )}
                            </dd>
                        </div>


                        <div class="customer-details-row">
                            <dt>Phone</dt>

                            <dd>
                                ${escapeHTML(
                                    customer.phone ||
                                    "—"
                                )}
                            </dd>
                        </div>


                        <div class="customer-details-row">
                            <dt>Joined</dt>

                            <dd>
                                ${formatDate(
                                    customer.joinedAt
                                )}
                            </dd>
                        </div>

                    </dl>

                </section>


                <section class="customer-details-section">

                    <h3>
                        Customer Summary
                    </h3>

                    <dl class="customer-details-list">

                        <div class="customer-details-row">
                            <dt>Total Orders</dt>

                            <dd>
                                ${customer.orderCount}
                            </dd>
                        </div>


                        <div class="customer-details-row">
                            <dt>Total Spent</dt>

                            <dd>
                                ${formatINR(
                                    customer.totalSpent
                                )}
                            </dd>
                        </div>


                        <div class="customer-details-row">
                            <dt>Last Order</dt>

                            <dd>
                                ${
                                    customer.lastOrderDate
                                        ? formatDate(
                                            customer.lastOrderDate
                                        )
                                        : "No orders"
                                }
                            </dd>
                        </div>

                    </dl>

                </section>


                <section class="customer-details-section full">

                    <h3>
                        Order History
                    </h3>

                    <div class="customer-order-history">

                        ${orderHistoryHTML}

                    </div>

                </section>

            </div>
        `;
    }


    /* =========================
       OPEN DETAILS
       ========================= */

    function openCustomerDetails(
        customerId
    ) {
        const customer =
            findCustomerById(
                customerId
            );

        if (!customer) {
            showToast(
                "Customer not found."
            );

            return;
        }

        selectedCustomer =
            customer;

        if (customerDetailsTitle) {
            customerDetailsTitle.textContent =
                customer.name;
        }

        if (
            customerDetailsSubtitle
        ) {
            customerDetailsSubtitle.textContent =
                customer.email ||
                customer.phone ||
                "Customer information";
        }

        renderCustomerDetails(
            customer
        );

        openModal(
            customerDetailsModal
        );
    }


    /* =========================
       MODAL
       ========================= */

    function openModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "admin-modal-open"
        );
    }


    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "admin-modal-open"
        );

        selectedCustomer = null;
    }


    /* =========================
       TOAST
       ========================= */

    function showToast(message) {
        if (
            typeof window.glowSkinAdminToast ===
            "function"
        ) {
            window.glowSkinAdminToast(
                message
            );

            return;
        }

        let toast =
            document.getElementById(
                "customersFallbackToast"
            );

        if (!toast) {
            toast =
                document.createElement(
                    "div"
                );

            toast.id =
                "customersFallbackToast";

            toast.style.position =
                "fixed";

            toast.style.right =
                "20px";

            toast.style.bottom =
                "20px";

            toast.style.zIndex =
                "99999";

            toast.style.padding =
                "12px 16px";

            toast.style.borderRadius =
                "10px";

            toast.style.background =
                "#211914";

            toast.style.color =
                "#fff";

            toast.style.fontSize =
                "13px";

            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.18)";

            document.body.appendChild(
                toast
            );
        }

        toast.textContent =
            message;

        toast.style.display =
            "block";

        clearTimeout(
            toast._timer
        );

        toast._timer =
            setTimeout(
                function () {
                    toast.style.display =
                        "none";
                },
                3000
            );
    }


    /* =========================
       EVENTS
       ========================= */

    function setupEvents() {
        if (customerSearch) {
            customerSearch.addEventListener(
                "input",
                applyFilters
            );
        }

        if (customerSort) {
            customerSort.addEventListener(
                "change",
                applyFilters
            );
        }


        if (clearCustomerFilters) {
            clearCustomerFilters.addEventListener(
                "click",
                function () {
                    if (customerSearch) {
                        customerSearch.value =
                            "";
                    }

                    if (customerSort) {
                        customerSort.value =
                            "newest";
                    }

                    applyFilters();
                }
            );
        }


        if (customersTableBody) {
            customersTableBody.addEventListener(
                "click",
                function (event) {
                    const button =
                        event.target.closest(
                            "[data-customer-id]"
                        );

                    if (!button) {
                        return;
                    }

                    openCustomerDetails(
                        button.getAttribute(
                            "data-customer-id"
                        )
                    );
                }
            );
        }


        if (customerDetailsClose) {
            customerDetailsClose.addEventListener(
                "click",
                function () {
                    closeModal(
                        customerDetailsModal
                    );
                }
            );
        }


        if (
            closeCustomerDetailsButton
        ) {
            closeCustomerDetailsButton.addEventListener(
                "click",
                function () {
                    closeModal(
                        customerDetailsModal
                    );
                }
            );
        }


        if (customerDetailsModal) {
            customerDetailsModal.addEventListener(
                "click",
                function (event) {
                    if (
                        event.target ===
                        customerDetailsModal
                    ) {
                        closeModal(
                            customerDetailsModal
                        );
                    }
                }
            );
        }


        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key ===
                    "Escape"
                ) {
                    if (
                        customerDetailsModal &&
                        customerDetailsModal.classList.contains(
                            "active"
                        )
                    ) {
                        closeModal(
                            customerDetailsModal
                        );
                    }
                }
            }
        );
    }


    /* =========================
       REFRESH
       ========================= */

    function setupRefresh() {
        window.addEventListener(
            "storage",
            function (event) {
                if (
                    event.key ===
                        USERS_KEY ||
                    event.key ===
                        ORDERS_KEY
                ) {
                    buildCustomers();
                    applyFilters();
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
                    buildCustomers();
                    applyFilters();
                }
            }
        );
    }


    /* =========================
       INITIALIZE
       ========================= */

    function init() {
        setupEvents();
        setupRefresh();

        buildCustomers();
        applyFilters();
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
