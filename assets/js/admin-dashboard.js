/* =========================================================
   GLOWSKIN ADMIN — DASHBOARD JAVASCRIPT
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const ORDERS_KEY = "glowskin_orders";
  const USERS_KEY = "glowskin_users";
  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =======================================================
     HELPERS
     ======================================================= */

  function getArray(key) {
    try {
      const data = JSON.parse(
        localStorage.getItem(key)
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }


  function formatPrice(value) {
    const amount = Number(value) || 0;

    return "₹" + amount.toLocaleString("en-IN");
  }


  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function getOrderTotal(order) {

    if (!order) {
      return 0;
    }


    if (
      order.summary &&
      order.summary.total !== undefined
    ) {

      return Number(
        order.summary.total
      ) || 0;

    }


    if (
      order.total !== undefined
    ) {

      return Number(order.total) || 0;

    }


    if (
      order.amount !== undefined
    ) {

      return Number(order.amount) || 0;

    }


    return 0;
  }


  function getCustomerName(order) {

    if (!order) {
      return "Customer";
    }


    if (
      order.customer &&
      order.customer.name
    ) {

      return order.customer.name;

    }


    if (order.customerName) {
      return order.customerName;
    }


    return "Customer";
  }


  function getOrderStatus(order) {

    const status =
      order &&
      (
        order.status ||
        (
          order.order &&
          order.order.status
        )
      );


    return status || "Placed";
  }


  /* =======================================================
     DASHBOARD STATISTICS
     ======================================================= */

  function updateStatistics() {

    const orders =
      getArray(ORDERS_KEY);

    const users =
      getArray(USERS_KEY);


    const totalOrders =
      document.getElementById(
        "totalOrders"
      );


    const totalRevenue =
      document.getElementById(
        "totalRevenue"
      );


    const totalCustomers =
      document.getElementById(
        "totalCustomers"
      );


    const totalProducts =
      document.getElementById(
        "totalProducts"
      );


    let revenue = 0;


    orders.forEach(function (order) {

      revenue +=
        getOrderTotal(order);

    });


    if (totalOrders) {

      totalOrders.textContent =
        orders.length;

    }


    if (totalRevenue) {

      totalRevenue.textContent =
        formatPrice(revenue);

    }


    if (totalCustomers) {

      totalCustomers.textContent =
        users.length;

    }


    if (totalProducts) {

      /*
       * Current GlowSkin catalogue
       * contains 12 products.
       *
       * Later this can be connected
       * to the admin product database.
       */

      const storedProducts =
        getArray(
          "glowskin_products"
        );


      totalProducts.textContent =
        storedProducts.length ||
        12;

    }

  }


  /* =======================================================
     RECENT ORDERS
     ======================================================= */

  function renderRecentOrders() {

    const container =
      document.getElementById(
        "recentOrders"
      );


    const emptyState =
      document.getElementById(
        "recentOrdersEmpty"
      );


    if (!container) {
      return;
    }


    const orders =
      getArray(ORDERS_KEY);


    if (!orders.length) {

      container.innerHTML = "";

      if (emptyState) {
        emptyState.style.display =
          "block";
      }

      return;

    }


    if (emptyState) {
      emptyState.style.display =
        "none";
    }


    /*
     * Newest orders first
     */

    const recentOrders =
      orders
        .slice()
        .reverse()
        .slice(0, 5);


    let html = `
      <table class="admin-recent-orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
    `;


    recentOrders.forEach(
      function (order) {

        const orderId =
          order.id ||
          order.orderId ||
          "GS-ORDER";


        const customer =
          getCustomerName(order);


        const total =
          getOrderTotal(order);


        const status =
          getOrderStatus(order);


        const normalizedStatus =
          String(status)
            .toLowerCase();


        let statusClass =
          "neutral";


        if (
          normalizedStatus ===
            "placed" ||
          normalizedStatus ===
            "processing"
        ) {

          statusClass =
            "warning";

        }


        if (
          normalizedStatus ===
            "shipped"
        ) {

          statusClass =
            "success";

        }


        if (
          normalizedStatus ===
            "delivered"
        ) {

          statusClass =
            "success";

        }


        html += `
          <tr>

            <td>
              <span class="admin-order-id">
                ${escapeHTML(orderId)}
              </span>
            </td>

            <td>
              <span class="admin-order-customer">
                ${escapeHTML(customer)}
              </span>
            </td>

            <td>
              <span class="admin-order-price">
                ${formatPrice(total)}
              </span>
            </td>

            <td>
              <span class="admin-status ${statusClass}">
                ${escapeHTML(status)}
              </span>
            </td>

            <td>
              <a
                href="orders.html?order=${encodeURIComponent(orderId)}"
                class="admin-order-link"
              >
                View
              </a>
            </td>

          </tr>
        `;

      }
    );


    html += `
        </tbody>
      </table>
    `;


    container.innerHTML =
      html;

  }


  /* =======================================================
     REFRESH DASHBOARD
     ======================================================= */

  function refreshDashboard() {

    updateStatistics();

    renderRecentOrders();

  }


  /* =======================================================
     LOCAL STORAGE CHANGE
     ======================================================= */

  function setupStorageListener() {

    window.addEventListener(
      "storage",
      function (event) {

        if (
          event.key === ORDERS_KEY ||
          event.key === USERS_KEY ||
          event.key === "glowskin_products"
        ) {

          refreshDashboard();

        }

      }
    );

  }


  /* =======================================================
     PERIODIC REFRESH
     ======================================================= */

  function setupAutoRefresh() {

    setInterval(
      function () {

        refreshDashboard();

      },
      5000
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    refreshDashboard();

    setupStorageListener();

    setupAutoRefresh();

  }


  /* =======================================================
     DOM READY
     ======================================================= */

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
