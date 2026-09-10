(() => {
  "use strict";

  /* =========================================
     GlowSkin — Order Success JavaScript
     ========================================= */

  const ORDERS_KEY = "glowskin_orders";
  const LAST_ORDER_KEY = "glowskin_last_order";
  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =========================================
     Helpers
     ========================================= */

  const $ = (selector) => document.querySelector(selector);

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };


  /* =========================================
     Get Order ID
     ========================================= */

  const getOrderId = () => {
    const params = new URLSearchParams(
      window.location.search
    );

    const urlOrderId = params.get("order");

    if (urlOrderId) {
      return urlOrderId;
    }

    const sessionOrderId =
      sessionStorage.getItem(
        "glowskin_current_order_id"
      );

    if (sessionOrderId) {
      return sessionOrderId;
    }

    try {
      const lastOrder = JSON.parse(
        localStorage.getItem(LAST_ORDER_KEY) || "null"
      );

      return lastOrder?.id || null;
    } catch (error) {
      return null;
    }
  };


  /* =========================================
     Find Order
     ========================================= */

  const getOrder = (orderId) => {
    if (!orderId) {
      return null;
    }

    try {
      const orders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );

      if (!Array.isArray(orders)) {
        return null;
      }

      return (
        orders.find(
          (order) => order.id === orderId
        ) || null
      );
    } catch (error) {
      console.error(
        "Unable to read order:",
        error
      );

      return null;
    }
  };


  /* =========================================
     Payment Method
     ========================================= */

  const getPaymentName = (method) => {
    const paymentMethods = {
      cod: "Cash on Delivery",
      upi: "UPI",
      card: "Credit / Debit Card",
      "cash-on-delivery": "Cash on Delivery"
    };

    return (
      paymentMethods[method] ||
      method ||
      "—"
    );
  };


  /* =========================================
     Render Order
     ========================================= */

  const renderOrder = (order) => {
    if (!order) {
      showOrderNotFound();
      return;
    }

    const customerName = $("#customerName");
    const orderId = $("#orderId");
    const orderTotal = $("#orderTotal");
    const paymentMethod = $("#paymentMethod");
    const orderStatus = $("#orderStatus");
    const deliveryDate = $("#deliveryDate");

    if (customerName) {
      customerName.textContent =
        order.customer?.name || "Customer";
    }

    if (orderId) {
      orderId.textContent =
        order.id || "—";
    }

    if (orderTotal) {
      orderTotal.textContent =
        formatPrice(
          order.summary?.total || 0
        );
    }

    if (paymentMethod) {
      paymentMethod.textContent =
        getPaymentName(
          order.paymentMethod
        );
    }

    if (orderStatus) {
      orderStatus.textContent =
        order.status || "Placed";
    }

    if (deliveryDate) {
      deliveryDate.textContent =
        order.estimatedDelivery ||
        "3–7 business days";
    }

    updateTrackOrderLink(order.id);
  };


  /* =========================================
     Track Order
     ========================================= */

  const updateTrackOrderLink = (orderId) => {
    const trackButton =
      $("#trackOrderBtn");

    if (!trackButton || !orderId) {
      return;
    }

    trackButton.href =
      `track-order.html?order=${encodeURIComponent(
        orderId
      )}`;
  };


  /* =========================================
     Order Not Found
     ========================================= */

  const showOrderNotFound = () => {
    const successCard =
      $(".success-card");

    if (!successCard) {
      return;
    }

    successCard.innerHTML = `
      <div class="success-icon">
        !
      </div>

      <p class="success-label">
        ORDER INFORMATION
      </p>

      <h1>
        Order Not Found
      </h1>

      <p class="success-message">
        We couldn't find the order details on this
        device. Please check your order history or
        contact our support team.
      </p>

      <div class="success-actions">

        <a
          href="shop.html"
          class="btn btn-primary"
        >
          Continue Shopping
        </a>

        <a
          href="index.html"
          class="btn btn-outline"
        >
          Back to Home
        </a>

      </div>

      <a
        href="contact.html"
        class="back-home"
      >
        Need help? Contact Us
      </a>
    `;
  };


  /* =========================================
     Header Counts
     ========================================= */

  const updateHeaderCounts = () => {

    /* Cart */

    let cart = [];

    try {
      cart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch (error) {
      cart = [];
    }

    const cartCount =
      $("#cartCount");

    const totalCartItems =
      cart.reduce(
        (total, item) => {
          const quantity =
            Number(item.quantity);

          return total +
            (
              Number.isFinite(quantity) &&
              quantity > 0
                ? Math.floor(quantity)
                : 1
            );
        },
        0
      );

    if (cartCount) {
      cartCount.textContent =
        totalCartItems;

      cartCount.style.display =
        totalCartItems > 0
          ? "flex"
          : "none";
    }


    /* Wishlist */

    const wishlistCount =
      $("#wishlistCount");

    try {
      const wishlist = JSON.parse(
        localStorage.getItem(WISHLIST_KEY) || "[]"
      );

      const count =
        Array.isArray(wishlist)
          ? wishlist.length
          : 0;

      if (wishlistCount) {
        wishlistCount.textContent =
          count;

        wishlistCount.style.display =
          count > 0
            ? "flex"
            : "none";
      }
    } catch (error) {
      if (wishlistCount) {
        wishlistCount.style.display =
          "none";
      }
    }
  };


  /* =========================================
     Search Overlay
     ========================================= */

  const setupSearch = () => {

    const searchToggle =
      $("#searchToggle");

    const searchOverlay =
      $("#searchOverlay");

    const searchClose =
      $("#searchClose");

    const searchForm =
      $("#searchForm");

    const searchInput =
      $("#searchInput");


    const openSearch = () => {

      if (!searchOverlay) {
        return;
      }

      searchOverlay.classList.add(
        "active"
      );

      document.body.classList.add(
        "search-open"
      );

      setTimeout(() => {
        searchInput?.focus();
      }, 100);
    };


    const closeSearch = () => {

      if (!searchOverlay) {
        return;
      }

      searchOverlay.classList.remove(
        "active"
      );

      document.body.classList.remove(
        "search-open"
      );
    };


    searchToggle?.addEventListener(
      "click",
      openSearch
    );


    searchClose?.addEventListener(
      "click",
      closeSearch
    );


    searchOverlay?.addEventListener(
      "click",
      (event) => {

        if (
          event.target === searchOverlay
        ) {
          closeSearch();
        }

      }
    );


    searchForm?.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const query =
          searchInput?.value.trim();

        if (!query) {
          return;
        }

        window.location.href =
          `shop.html?search=${encodeURIComponent(
            query
          )}`;
      }
    );


    document.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Escape") {
          closeSearch();
        }

      }
    );
  };


  /* =========================================
     Mobile Menu
     ========================================= */

  const setupMobileMenu = () => {

    const menuToggle =
      $("#menuToggle");

    const mobileMenu =
      $("#mobileMenu");

    const mobileMenuClose =
      $("#mobileMenuClose");


    menuToggle?.addEventListener(
      "click",
      () => {

        mobileMenu?.classList.toggle(
          "active"
        );

        document.body.classList.toggle(
          "menu-open"
        );
      }
    );


    mobileMenuClose?.addEventListener(
      "click",
      () => {

        mobileMenu?.classList.remove(
          "active"
        );

        document.body.classList.remove(
          "menu-open"
        );
      }
    );


    mobileMenu
      ?.querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            mobileMenu.classList.remove(
              "active"
            );

            document.body.classList.remove(
              "menu-open"
            );
          }
        );

      });
  };


  /* =========================================
     Copy Order ID
     ========================================= */

  const setupOrderIdCopy = () => {

    const orderIdElement =
      $("#orderId");

    if (!orderIdElement) {
      return;
    }

    orderIdElement.style.cursor =
      "pointer";

    orderIdElement.title =
      "Click to copy order ID";

    orderIdElement.addEventListener(
      "click",
      async () => {

        const orderId =
          orderIdElement.textContent.trim();

        if (!orderId || orderId === "—") {
          return;
        }

        try {

          await navigator.clipboard.writeText(
            orderId
          );

          const originalText =
            orderIdElement.textContent;

          orderIdElement.textContent =
            "Copied!";

          setTimeout(() => {
            orderIdElement.textContent =
              originalText;
          }, 1200);

        } catch (error) {

          console.log(
            "Clipboard access unavailable."
          );

        }
      }
    );
  };


  /* =========================================
     Initialize
     ========================================= */

  const init = () => {

    const orderId =
      getOrderId();

    const order =
      getOrder(orderId);

    renderOrder(order);

    updateHeaderCounts();

    setupSearch();

    setupMobileMenu();

    setupOrderIdCopy();
  };


  /* =========================================
     DOM Ready
     ========================================= */

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
