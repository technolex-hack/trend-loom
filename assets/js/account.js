/* =========================================================
   GlowSkin — Customer Account
   File: assets/js/account.js
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const USERS_KEY = "glowskin_users";
  const CURRENT_USER_KEY = "glowskin_current_user";
  const ORDERS_KEY = "glowskin_orders";
  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =======================================================
     HELPERS
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  function getJSON(key, fallback) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return data ?? fallback;
    } catch (error) {
      return fallback;
    }
  }


  function getCurrentUser() {
    return getJSON(CURRENT_USER_KEY, null);
  }


  function getOrders() {
    const orders = getJSON(ORDERS_KEY, []);
    return Array.isArray(orders) ? orders : [];
  }


  function getCart() {
    const cart = getJSON(CART_KEY, []);
    return Array.isArray(cart) ? cart : [];
  }


  function getWishlist() {
    const wishlist = getJSON(WISHLIST_KEY, []);
    return Array.isArray(wishlist) ? wishlist : [];
  }


  /* =======================================================
     FORMATTERS
     ======================================================= */

  function formatPrice(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  }


  function formatDate(dateValue) {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }


  function getInitial(name) {
    if (!name) return "G";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  }


  /* =======================================================
     USER CHECK
     ======================================================= */

  const currentUser = getCurrentUser();


  if (!currentUser) {
    window.location.href =
      "login.html";

    return;
  }


  /* =======================================================
     DOM ELEMENTS
     ======================================================= */

  const accountAvatar =
    $("#accountAvatar");

  const profileAvatar =
    $("#profileAvatar");

  const sidebarUserName =
    $("#sidebarUserName");

  const sidebarUserEmail =
    $("#sidebarUserEmail");

  const welcomeUserName =
    $("#welcomeUserName");

  const profileName =
    $("#profileName");

  const profileEmail =
    $("#profileEmail");

  const profileFullName =
    $("#profileFullName");

  const profileEmailAddress =
    $("#profileEmailAddress");

  const profilePhone =
    $("#profilePhone");

  const orderCount =
    $("#orderCount");

  const wishlistTotal =
    $("#wishlistTotal");

  const cartTotal =
    $("#cartTotal");

  const recentOrders =
    $("#recentOrders");

  const ordersList =
    $("#ordersList");

  const logoutBtn =
    $("#logoutBtn");


  /* =======================================================
     LOAD USER
     ======================================================= */

  function loadUser() {
    const name =
      currentUser.name || "Guest";

    const email =
      currentUser.email || "—";

    const phone =
      currentUser.phone || "—";

    const initial =
      getInitial(name);


    if (accountAvatar) {
      accountAvatar.textContent = initial;
    }

    if (profileAvatar) {
      profileAvatar.textContent = initial;
    }

    if (sidebarUserName) {
      sidebarUserName.textContent = name;
    }

    if (sidebarUserEmail) {
      sidebarUserEmail.textContent = email;
    }

    if (welcomeUserName) {
      welcomeUserName.textContent = name;
    }

    if (profileName) {
      profileName.textContent = name;
    }

    if (profileEmail) {
      profileEmail.textContent = email;
    }

    if (profileFullName) {
      profileFullName.textContent = name;
    }

    if (profileEmailAddress) {
      profileEmailAddress.textContent = email;
    }

    if (profilePhone) {
      profilePhone.textContent = phone;
    }
  }


  /* =======================================================
     USER ORDERS
     ======================================================= */

  function getUserOrders() {
    const orders = getOrders();

    return orders.filter(function (order) {

      if (!order || !order.customer) {
        return false;
      }

      const orderEmail =
        String(
          order.customer.email || ""
        ).trim().toLowerCase();

      const userEmail =
        String(
          currentUser.email || ""
        ).trim().toLowerCase();


      /*
        Match using email.

        This works with the order structure
        created by checkout.js.
      */

      return (
        orderEmail &&
        userEmail &&
        orderEmail === userEmail
      );
    });
  }


  /* =======================================================
     ORDER STATUS CLASS
     ======================================================= */

  function getStatusClass(status) {

    const value =
      String(status || "Placed")
        .toLowerCase();

    if (
      value.includes("deliver")
    ) {
      return "delivered";
    }

    if (
      value.includes("cancel")
    ) {
      return "cancelled";
    }

    if (
      value.includes("ship")
    ) {
      return "shipped";
    }

    return "placed";
  }


  /* =======================================================
     RENDER ORDER CARD
     ======================================================= */

  function createOrderCard(order) {

    const card =
      document.createElement("div");

    card.className =
      "order-card";


    const orderId =
      order.id || "—";

    const orderDate =
      order.createdAt ||
      order.date ||
      order.orderDate;

    const status =
      order.status ||
      "Placed";

    const payment =
      order.paymentMethod ||
      order.payment ||
      "Cash on Delivery";


    let total = 0;


    if (
      order.summary &&
      order.summary.total !== undefined
    ) {
      total =
        Number(order.summary.total) || 0;

    } else if (
      order.total !== undefined
    ) {
      total =
        Number(order.total) || 0;

    } else if (
      order.amount !== undefined
    ) {
      total =
        Number(order.amount) || 0;
    }


    const statusClass =
      getStatusClass(status);


    card.innerHTML = `
      <div class="order-card-top">

        <div>
          <div class="order-card-id">
            ${escapeHTML(orderId)}
          </div>

          <div class="order-card-date">
            ${formatDate(orderDate)}
          </div>
        </div>

        <span class="order-status ${statusClass}">
          ${escapeHTML(status)}
        </span>

      </div>

      <div class="order-card-bottom">

        <div>
          <div class="order-card-total">
            ${formatPrice(total)}
          </div>

          <div class="order-card-payment">
            ${escapeHTML(payment)}
          </div>
        </div>

        <a
          href="track-order.html?order=${encodeURIComponent(orderId)}"
          class="order-view-btn"
        >
          Track Order
        </a>

      </div>
    `;


    return card;
  }


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =======================================================
     EMPTY ORDERS
     ======================================================= */

  function createEmptyOrders() {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "account-empty-mini";

    wrapper.innerHTML = `
      <span>📦</span>

      <p>
        You haven't placed any orders yet.
      </p>

      <a href="shop.html">
        Start Shopping
      </a>
    `;

    return wrapper;
  }


  /* =======================================================
     RENDER ALL ORDERS
     ======================================================= */

  function renderOrders() {

    const userOrders =
      getUserOrders();


    /*
      Newest orders first.
    */

    userOrders.sort(function (a, b) {

      const dateA =
        new Date(
          a.createdAt ||
          a.date ||
          a.orderDate ||
          0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt ||
          b.date ||
          b.orderDate ||
          0
        ).getTime();

      return dateB - dateA;
    });


    if (orderCount) {
      orderCount.textContent =
        userOrders.length;
    }


    /* Full orders */

    if (ordersList) {

      ordersList.innerHTML = "";

      if (userOrders.length === 0) {

        ordersList.appendChild(
          createEmptyOrders()
        );

      } else {

        userOrders.forEach(function (order) {

          ordersList.appendChild(
            createOrderCard(order)
          );

        });

      }
    }


    /* Recent orders */

    if (recentOrders) {

      recentOrders.innerHTML = "";

      if (userOrders.length === 0) {

        recentOrders.appendChild(
          createEmptyOrders()
        );

      } else {

        userOrders
          .slice(0, 3)
          .forEach(function (order) {

            recentOrders.appendChild(
              createOrderCard(order)
            );

          });

      }
    }
  }


  /* =======================================================
     UPDATE SHOPPING COUNTS
     ======================================================= */

  function updateShoppingStats() {

    const cart =
      getCart();

    const wishlist =
      getWishlist();


    let cartItems = 0;

    cart.forEach(function (item) {

      const quantity =
        Number(item.quantity);

      cartItems +=
        quantity > 0
          ? quantity
          : 1;
    });


    if (cartTotal) {
      cartTotal.textContent =
        cartItems;
    }


    if (wishlistTotal) {
      wishlistTotal.textContent =
        wishlist.length;
    }


    /* Header counts */

    const headerCart =
      $("#cartCount");

    const headerWishlist =
      $("#wishlistCount");


    if (headerCart) {

      headerCart.textContent =
        cartItems;

      headerCart.hidden =
        cartItems === 0;
    }


    if (headerWishlist) {

      headerWishlist.textContent =
        wishlist.length;

      headerWishlist.hidden =
        wishlist.length === 0;
    }
  }


  /* =======================================================
     ACCOUNT NAVIGATION
     ======================================================= */

  const navItems =
    $$(".account-nav-item[data-section]");

  const sections = {
    overview: $("#overviewSection"),
    profile: $("#profileSection"),
    orders: $("#ordersSection")
  };


  function showSection(sectionName) {

    if (!sections[sectionName]) {
      return;
    }


    Object.keys(sections)
      .forEach(function (key) {

        if (sections[key]) {

          sections[key]
            .classList.toggle(
              "active",
              key === sectionName
            );

        }

      });


    navItems.forEach(function (item) {

      item.classList.toggle(
        "active",
        item.dataset.section === sectionName
      );

    });


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  navItems.forEach(function (item) {

    item.addEventListener(
      "click",
      function () {

        showSection(
          item.dataset.section
        );

      }
    );

  });


  /* =======================================================
     VIEW ALL ORDERS
     ======================================================= */

  $$(".view-all-btn").forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const target =
            button.dataset.sectionTarget ||
            "orders";

          showSection(target);

        }
      );

    }
  );


  /* =======================================================
     LOGOUT
     ======================================================= */

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      function () {

        const confirmLogout =
          window.confirm(
            "Are you sure you want to logout?"
          );


        if (!confirmLogout) {
          return;
        }


        localStorage.removeItem(
          CURRENT_USER_KEY
        );

        sessionStorage.removeItem(
          CURRENT_USER_KEY
        );


        window.location.href =
          "login.html";

      }
    );

  }


  /* =======================================================
     SEARCH OVERLAY
     ======================================================= */

  const searchOverlay =
    $("#searchOverlay");

  const searchOpen =
    $("#searchOpen");

  const searchClose =
    $("#searchClose");

  const searchInput =
    $("#searchInput");

  const searchForm =
    $("#searchForm");


  function openSearch() {

    if (!searchOverlay) {
      return;
    }

    searchOverlay.classList.add(
      "active"
    );

    document.body.classList.add(
      "search-open"
    );


    setTimeout(function () {

      if (searchInput) {
        searchInput.focus();
      }

    }, 100);
  }


  function closeSearch() {

    if (!searchOverlay) {
      return;
    }

    searchOverlay.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "search-open"
    );
  }


  if (searchOpen) {

    searchOpen.addEventListener(
      "click",
      openSearch
    );

  }


  if (searchClose) {

    searchClose.addEventListener(
      "click",
      closeSearch
    );

  }


  if (searchOverlay) {

    searchOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target === searchOverlay
        ) {
          closeSearch();
        }

      }
    );

  }


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
          return;
        }


        window.location.href =
          "shop.html?search=" +
          encodeURIComponent(query);

      }
    );

  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const mobileMenuToggle =
    $("#mobileMenuToggle");

  const mobileMenu =
    $("#mobileMenu");

  const mobileMenuClose =
    $("#mobileMenuClose");


  function openMobileMenu() {

    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.add(
      "active"
    );

    document.body.classList.add(
      "menu-open"
    );
  }


  function closeMobileMenu() {

    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }


  if (mobileMenuToggle) {

    mobileMenuToggle.addEventListener(
      "click",
      openMobileMenu
    );

  }


  if (mobileMenuClose) {

    mobileMenuClose.addEventListener(
      "click",
      closeMobileMenu
    );

  }


  if (mobileMenu) {

    mobileMenu.addEventListener(
      "click",
      function (event) {

        if (
          event.target === mobileMenu
        ) {
          closeMobileMenu();
        }

      }
    );

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key !== "Escape") {
        return;
      }

      closeSearch();
      closeMobileMenu();

    }
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    loadUser();

    renderOrders();

    updateShoppingStats();

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
