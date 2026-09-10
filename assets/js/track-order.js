(() => {
  "use strict";

  /* =========================================
     STORAGE KEYS
  ========================================= */

  const ORDERS_KEY = "glowskin_orders";
  const LAST_ORDER_KEY = "glowskin_last_order";
  const CURRENT_ORDER_KEY = "glowskin_current_order_id";
  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =========================================
     DOM ELEMENTS
  ========================================= */

  const trackOrderForm = document.getElementById("trackOrderForm");
  const orderIdInput = document.getElementById("orderIdInput");
  const trackOrderBtn = document.getElementById("trackOrderBtn");
  const trackFormError = document.getElementById("trackFormError");

  const trackResult = document.getElementById("trackResult");
  const trackNotFound = document.getElementById("trackNotFound");
  const tryAgainBtn = document.getElementById("tryAgainBtn");

  const resultOrderId = document.getElementById("resultOrderId");
  const resultStatus = document.getElementById("resultStatus");
  const resultCustomer = document.getElementById("resultCustomer");
  const resultTotal = document.getElementById("resultTotal");
  const resultPayment = document.getElementById("resultPayment");
  const resultDelivery = document.getElementById("resultDelivery");

  const resultItemCount = document.getElementById("resultItemCount");
  const trackItemsList = document.getElementById("trackItemsList");
  const deliveryInfoText = document.getElementById("deliveryInfoText");

  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");

  const searchOverlay = document.getElementById("searchOverlay");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchOpen = document.getElementById("searchOpen");

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOpen = document.getElementById("mobileMenuOpen");
  const mobileMenuClose = document.getElementById("mobileMenuClose");


  /* =========================================
     STORAGE HELPERS
  ========================================= */

  function getStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallback;
      }

      return JSON.parse(value);
    } catch (error) {
      console.warn(`GlowSkin storage error: ${key}`, error);
      return fallback;
    }
  }


  function getSessionStorage(key, fallback = null) {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }


  /* =========================================
     BASIC HELPERS
  ========================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function formatPrice(value) {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }


  function normalizeOrderId(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();
  }


  function getPaymentName(payment) {
    const value = String(payment || "").toLowerCase();

    if (value === "cod") {
      return "Cash on Delivery";
    }

    if (value === "upi") {
      return "UPI";
    }

    if (value === "card") {
      return "Credit / Debit Card";
    }

    return payment || "Not specified";
  }


  /* =========================================
     ORDER DATA
  ========================================= */

  function getOrders() {
    const orders = getStorage(ORDERS_KEY, []);

    return Array.isArray(orders) ? orders : [];
  }


  function findOrder(orderId) {
    const normalizedId = normalizeOrderId(orderId);

    if (!normalizedId) {
      return null;
    }

    const orders = getOrders();

    return orders.find(order => {
      return normalizeOrderId(order.id) === normalizedId;
    }) || null;
  }


  function getInitialOrderId() {
    const params = new URLSearchParams(window.location.search);

    const urlOrder = params.get("order");

    if (urlOrder) {
      return normalizeOrderId(urlOrder);
    }

    const sessionOrder = getSessionStorage(CURRENT_ORDER_KEY);

    if (sessionOrder) {
      return normalizeOrderId(sessionOrder);
    }

    const lastOrder = getStorage(LAST_ORDER_KEY, null);

    if (lastOrder && lastOrder.id) {
      return normalizeOrderId(lastOrder.id);
    }

    return "";
  }


  /* =========================================
     STATUS HELPERS
  ========================================= */

  function normalizeStatus(status) {
    const value = String(status || "")
      .trim()
      .toLowerCase();

    if (value === "placed") {
      return "Placed";
    }

    if (value === "processing") {
      return "Processing";
    }

    if (value === "shipped") {
      return "Shipped";
    }

    if (value === "delivered") {
      return "Delivered";
    }

    if (value === "cancelled" || value === "canceled") {
      return "Cancelled";
    }

    return "Placed";
  }


  function getStatusLevel(status) {
    const normalized = normalizeStatus(status);

    switch (normalized) {
      case "Processing":
        return 2;

      case "Shipped":
        return 3;

      case "Delivered":
        return 4;

      case "Cancelled":
        return 0;

      case "Placed":
      default:
        return 1;
    }
  }


  function updateTimeline(status) {
    const steps = document.querySelectorAll(".timeline-step");

    if (!steps.length) {
      return;
    }

    const normalizedStatus = normalizeStatus(status);
    const currentLevel = getStatusLevel(normalizedStatus);

    steps.forEach(step => {
      const stepStatus = String(
        step.dataset.status || ""
      ).toLowerCase();

      step.classList.remove("active", "completed", "cancelled");

      if (normalizedStatus === "Cancelled") {
        if (stepStatus === "placed") {
          step.classList.add("completed");
        }

        step.classList.add("cancelled");
        return;
      }

      let stepLevel = 0;

      if (stepStatus === "placed") {
        stepLevel = 1;
      } else if (stepStatus === "processing") {
        stepLevel = 2;
      } else if (stepStatus === "shipped") {
        stepLevel = 3;
      } else if (stepStatus === "delivered") {
        stepLevel = 4;
      }

      if (stepLevel < currentLevel) {
        step.classList.add("completed");
      } else if (stepLevel === currentLevel) {
        step.classList.add("active");
      }
    });
  }


  /* =========================================
     PRODUCT IMAGE
  ========================================= */

  function getItemImage(item) {
    if (item && item.image) {
      return item.image;
    }

    if (item && item.productImage) {
      return item.productImage;
    }

    if (item && item.images && Array.isArray(item.images)) {
      return item.images[0] || "";
    }

    return "";
  }


  function getItemName(item) {
    return (
      item?.name ||
      item?.productName ||
      item?.title ||
      "GlowSkin Product"
    );
  }


  function getItemPrice(item) {
    return Number(
      item?.price ??
      item?.productPrice ??
      0
    );
  }


  function getItemQuantity(item) {
    const quantity = Number(
      item?.quantity ??
      item?.qty ??
      1
    );

    return Math.max(1, Math.min(10, quantity));
  }


  /* =========================================
     RENDER ORDER ITEMS
  ========================================= */

  function renderOrderItems(order) {
    if (!trackItemsList) {
      return;
    }

    const items = Array.isArray(order.items)
      ? order.items
      : [];

    const totalQuantity = items.reduce(
      (total, item) => total + getItemQuantity(item),
      0
    );

    if (resultItemCount) {
      resultItemCount.textContent =
        `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`;
    }

    if (!items.length) {
      trackItemsList.innerHTML = `
        <div class="checkout-empty">
          <p>Order item details are not available.</p>
        </div>
      `;
      return;
    }

    trackItemsList.innerHTML = items.map(item => {
      const name = getItemName(item);
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);
      const image = getItemImage(item);

      const imageHTML = image
        ? `
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(name)}"
            class="track-item-image"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <div class="track-item-placeholder" style="display:none;">
            <span>✦</span>
          </div>
        `
        : `
          <div class="track-item-placeholder">
            <span>✦</span>
          </div>
        `;

      return `
        <div class="track-item">
          <div class="track-item-image-wrap">
            ${imageHTML}
          </div>

          <div class="track-item-info">
            <h4>${escapeHTML(name)}</h4>
            <p>Quantity: ${quantity}</p>
          </div>

          <div class="track-item-price">
            ${formatPrice(price * quantity)}
          </div>
        </div>
      `;
    }).join("");
  }


  /* =========================================
     RENDER ORDER
  ========================================= */

  function renderOrder(order) {
    if (!order) {
      showNotFound();
      return;
    }

    const status = normalizeStatus(order.status);

    const customerName =
      order.customer?.name ||
      order.customerName ||
      "Customer";

    const total =
      order.summary?.total ??
      order.total ??
      order.orderTotal ??
      0;

    const payment =
      order.paymentMethod ||
      order.payment ||
      order.payment_type ||
      "";

    const delivery =
      order.estimatedDelivery ||
      order.deliveryDate ||
      "3–7 business days";

    if (resultOrderId) {
      resultOrderId.textContent = order.id || "—";
    }

    if (resultStatus) {
      resultStatus.textContent = status;

      resultStatus.classList.remove(
        "status-success",
        "status-processing",
        "status-shipped",
        "status-delivered",
        "status-cancelled"
      );

      if (status === "Placed") {
        resultStatus.classList.add("status-success");
      } else if (status === "Processing") {
        resultStatus.classList.add("status-processing");
      } else if (status === "Shipped") {
        resultStatus.classList.add("status-shipped");
      } else if (status === "Delivered") {
        resultStatus.classList.add("status-delivered");
      } else if (status === "Cancelled") {
        resultStatus.classList.add("status-cancelled");
      }
    }

    if (resultCustomer) {
      resultCustomer.textContent = customerName;
    }

    if (resultTotal) {
      resultTotal.textContent = formatPrice(total);
    }

    if (resultPayment) {
      resultPayment.textContent = getPaymentName(payment);
    }

    if (resultDelivery) {
      resultDelivery.textContent = delivery;
    }

    if (deliveryInfoText) {
      if (status === "Delivered") {
        deliveryInfoText.textContent =
          "Your order has been delivered successfully.";
      } else if (status === "Shipped") {
        deliveryInfoText.textContent =
          `Your order is on the way. Estimated delivery: ${delivery}.`;
      } else if (status === "Processing") {
        deliveryInfoText.textContent =
          `Your order is being prepared. Estimated delivery: ${delivery}.`;
      } else if (status === "Cancelled") {
        deliveryInfoText.textContent =
          "This order has been cancelled.";
      } else {
        deliveryInfoText.textContent =
          `Your order has been placed. Estimated delivery: ${delivery}.`;
      }
    }

    renderOrderItems(order);
    updateTimeline(status);

    if (orderIdInput) {
      orderIdInput.value = order.id || "";
    }

    if (trackResult) {
      trackResult.hidden = false;
    }

    if (trackNotFound) {
      trackNotFound.hidden = true;
    }

    if (trackFormError) {
      trackFormError.textContent = "";
      trackFormError.hidden = true;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* =========================================
     NOT FOUND
  ========================================= */

  function showNotFound() {
    if (trackResult) {
      trackResult.hidden = true;
    }

    if (trackNotFound) {
      trackNotFound.hidden = false;
    }

    if (trackFormError) {
      trackFormError.textContent =
        "We couldn't find an order with that order ID.";
      trackFormError.hidden = false;
    }
  }


  /* =========================================
     TRACK ORDER
  ========================================= */

  function trackOrder(orderId) {
    const normalizedId = normalizeOrderId(orderId);

    if (!normalizedId) {
      if (trackFormError) {
        trackFormError.textContent =
          "Please enter your order ID.";
        trackFormError.hidden = false;
      }

      if (trackResult) {
        trackResult.hidden = true;
      }

      if (trackNotFound) {
        trackNotFound.hidden = true;
      }

      orderIdInput?.focus();

      return;
    }

    const order = findOrder(normalizedId);

    if (!order) {
      showNotFound();
      return;
    }

    renderOrder(order);

    const newUrl =
      `${window.location.pathname}?order=${encodeURIComponent(order.id)}`;

    window.history.replaceState({}, "", newUrl);
  }


  /* =========================================
     FORM SUBMIT
  ========================================= */

  if (trackOrderForm) {
    trackOrderForm.addEventListener("submit", event => {
      event.preventDefault();

      trackOrder(orderIdInput?.value || "");
    });
  }


  /* =========================================
     TRY AGAIN
  ========================================= */

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", () => {
      if (trackResult) {
        trackResult.hidden = true;
      }

      if (trackNotFound) {
        trackNotFound.hidden = true;
      }

      if (trackFormError) {
        trackFormError.textContent = "";
        trackFormError.hidden = true;
      }

      if (orderIdInput) {
        orderIdInput.value = "";
        orderIdInput.focus();
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =========================================
     CART / WISHLIST COUNTS
  ========================================= */

  function updateCounts() {
    const cart = getStorage(CART_KEY, []);
    const wishlist = getStorage(WISHLIST_KEY, []);

    const cartItems = Array.isArray(cart)
      ? cart
      : [];

    const wishlistItems = Array.isArray(wishlist)
      ? wishlist
      : [];

    const cartTotal = cartItems.reduce((total, item) => {
      return total + getItemQuantity(item);
    }, 0);

    if (cartCount) {
      cartCount.textContent = cartTotal;
      cartCount.hidden = cartTotal === 0;
    }

    if (wishlistCount) {
      wishlistCount.textContent = wishlistItems.length;
      wishlistCount.hidden = wishlistItems.length === 0;
    }
  }


  /* =========================================
     SEARCH
  ========================================= */

  function openSearch() {
    if (!searchOverlay) {
      return;
    }

    searchOverlay.classList.add("active");
    searchOverlay.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  }


  function closeSearch() {
    if (!searchOverlay) {
      return;
    }

    searchOverlay.classList.remove("active");
    searchOverlay.setAttribute("aria-hidden", "true");
  }


  if (searchOpen) {
    searchOpen.addEventListener("click", openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }


  if (searchOverlay) {
    searchOverlay.addEventListener("click", event => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }


  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();

      const query = searchInput?.value.trim() || "";

      if (!query) {
        searchInput?.focus();
        return;
      }

      window.location.href =
        `shop.html?search=${encodeURIComponent(query)}`;
    });
  }


  /* =========================================
     MOBILE MENU
  ========================================= */

  function openMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.add("active");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  }


  function closeMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }


  if (mobileMenuOpen) {
    mobileMenuOpen.addEventListener("click", openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }


  if (mobileMenu) {
    mobileMenu.addEventListener("click", event => {
      if (event.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") {
      return;
    }

    closeSearch();
    closeMobileMenu();
  });


  /* =========================================
     INITIAL LOAD
  ========================================= */

  function init() {
    updateCounts();

    const initialOrderId = getInitialOrderId();

    if (initialOrderId) {
      const order = findOrder(initialOrderId);

      if (order) {
        renderOrder(order);
      } else {
        showNotFound();
      }
    } else {
      if (trackResult) {
        trackResult.hidden = true;
      }

      if (trackNotFound) {
        trackNotFound.hidden = true;
      }
    }
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
