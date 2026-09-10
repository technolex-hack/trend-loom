/* =========================================================
   GLOWSKIN ADMIN — COMMON JAVASCRIPT
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";
  const ORDERS_KEY = "glowskin_orders";
  const USERS_KEY = "glowskin_users";


  /* =======================================================
     STORAGE HELPER
     ======================================================= */

  function getStorageArray(key) {
    try {
      const data = JSON.parse(
        localStorage.getItem(key)
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }


  /* =======================================================
     ADMIN SIDEBAR
     ======================================================= */

  function setupSidebar() {

    const sidebar =
      document.getElementById("adminSidebar");

    const sidebarOpen =
      document.getElementById("adminSidebarOpen");

    const sidebarClose =
      document.getElementById("adminSidebarClose");

    const sidebarOverlay =
      document.getElementById("adminSidebarOverlay");


    if (!sidebar) {
      return {
        closeSidebar: function () {}
      };
    }


    function openSidebar() {

      sidebar.classList.add("active");

      if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
      }

      document.body.classList.add(
        "admin-sidebar-open"
      );
    }


    function closeSidebar() {

      sidebar.classList.remove("active");

      if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
      }

      document.body.classList.remove(
        "admin-sidebar-open"
      );
    }


    if (sidebarOpen) {

      sidebarOpen.addEventListener(
        "click",
        openSidebar
      );

    }


    if (sidebarClose) {

      sidebarClose.addEventListener(
        "click",
        closeSidebar
      );

    }


    if (sidebarOverlay) {

      sidebarOverlay.addEventListener(
        "click",
        closeSidebar
      );

    }


    /* Close menu after clicking a link on mobile */

    const navLinks =
      sidebar.querySelectorAll(
        ".admin-nav-item, .view-store-link"
      );


    navLinks.forEach(function (link) {

      link.addEventListener(
        "click",
        function () {

          if (window.innerWidth <= 800) {
            closeSidebar();
          }

        }
      );

    });


    /* Close when screen becomes desktop */

    window.addEventListener(
      "resize",
      function () {

        if (window.innerWidth > 800) {
          closeSidebar();
        }

      }
    );


    return {
      openSidebar: openSidebar,
      closeSidebar: closeSidebar
    };
  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  function setupEscapeKey(
    sidebarController
  ) {

    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key !== "Escape") {
          return;
        }


        if (sidebarController) {
          sidebarController.closeSidebar();
        }


        const modal =
          document.querySelector(
            ".admin-modal.active"
          );


        if (modal) {
          modal.classList.remove("active");
        }

      }
    );
  }


  /* =======================================================
     TOAST
     ======================================================= */

  function showAdminToast(
    message,
    duration
  ) {

    let toast =
      document.getElementById(
        "adminToast"
      );


    /* Create toast automatically if page
       does not already contain one */

    if (!toast) {

      toast =
        document.createElement("div");

      toast.id = "adminToast";

      toast.className =
        "admin-toast";

      document.body.appendChild(toast);

    }


    toast.textContent =
      message || "Done";


    toast.classList.add("show");


    clearTimeout(
      toast._hideTimer
    );


    toast._hideTimer =
      setTimeout(
        function () {

          toast.classList.remove(
            "show"
          );

        },
        duration || 2500
      );
  }


  /* Make toast available to other admin scripts */

  window.glowSkinAdminToast =
    showAdminToast;


  /* =======================================================
     MODAL HELPERS
     ======================================================= */

  function setupModals() {

    const modalCloseButtons =
      document.querySelectorAll(
        ".admin-modal-close"
      );


    modalCloseButtons.forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const modal =
              button.closest(
                ".admin-modal"
              );


            if (modal) {
              modal.classList.remove(
                "active"
              );
            }

          }
        );

      }
    );


    const modals =
      document.querySelectorAll(
        ".admin-modal"
      );


    modals.forEach(function (modal) {

      modal.addEventListener(
        "click",
        function (event) {

          if (event.target === modal) {
            modal.classList.remove(
              "active"
            );
          }

        }
      );

    });


    /* Global helper */

    window.openGlowSkinAdminModal =
      function (modalId) {

        const modal =
          document.getElementById(
            modalId
          );


        if (!modal) {
          return;
        }


        modal.classList.add(
          "active"
        );

      };


    window.closeGlowSkinAdminModal =
      function (modalId) {

        const modal =
          document.getElementById(
            modalId
          );


        if (!modal) {
          return;
        }


        modal.classList.remove(
          "active"
        );

      };

  }


  /* =======================================================
     ADMIN COUNTS
     ======================================================= */

  function updateAdminCounts() {

    const orders =
      getStorageArray(ORDERS_KEY);

    const users =
      getStorageArray(USERS_KEY);

    const cart =
      getStorageArray(CART_KEY);

    const wishlist =
      getStorageArray(WISHLIST_KEY);


    /* Sidebar order count */

    const sidebarOrderCount =
      document.getElementById(
        "sidebarOrderCount"
      );


    if (sidebarOrderCount) {
      sidebarOrderCount.textContent =
        orders.length;
    }


    /* Optional customer count */

    const customerCount =
      document.getElementById(
        "adminCustomerCount"
      );


    if (customerCount) {
      customerCount.textContent =
        users.length;
    }


    /* Optional cart count */

    const adminCartCount =
      document.getElementById(
        "adminCartCount"
      );


    if (adminCartCount) {

      let total = 0;

      cart.forEach(function (item) {

        if (
          item &&
          typeof item === "object"
        ) {

          total +=
            Number(item.quantity) || 1;

        } else {

          total += 1;

        }

      });


      adminCartCount.textContent =
        total;

    }


    /* Optional wishlist count */

    const adminWishlistCount =
      document.getElementById(
        "adminWishlistCount"
      );


    if (adminWishlistCount) {

      adminWishlistCount.textContent =
        wishlist.length;

    }

  }


  /* =======================================================
     ACTIVE NAV ITEM
     ======================================================= */

  function setupActiveNavigation() {

    const navItems =
      document.querySelectorAll(
        ".admin-nav-item"
      );


    if (!navItems.length) {
      return;
    }


    const currentPath =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    navItems.forEach(function (item) {

      const href =
        item.getAttribute("href");


      if (!href) {
        return;
      }


      const linkPath =
        href
          .split("?")[0]
          .split("#")[0]
          .toLowerCase();


      if (
        linkPath === currentPath ||
        (
          currentPath === "" &&
          linkPath === "index.html"
        )
      ) {

        navItems.forEach(
          function (navItem) {
            navItem.classList.remove(
              "active"
            );
          }
        );


        item.classList.add(
          "active"
        );

      }

    });

  }


  /* =======================================================
     CONFIRM ACTION
     ======================================================= */

  function setupConfirmActions() {

    const confirmButtons =
      document.querySelectorAll(
        "[data-admin-confirm]"
      );


    confirmButtons.forEach(
      function (button) {

        button.addEventListener(
          "click",
          function (event) {

            const message =
              button.getAttribute(
                "data-admin-confirm"
              ) ||
              "Are you sure you want to continue?";


            if (
              !window.confirm(message)
            ) {

              event.preventDefault();

            }

          }
        );

      }
    );

  }


  /* =======================================================
     FORM SUBMIT LOADING
     ======================================================= */

  function setupLoadingButtons() {

    const forms =
      document.querySelectorAll(
        "form[data-admin-loading]"
      );


    forms.forEach(function (form) {

      form.addEventListener(
        "submit",
        function () {

          const button =
            form.querySelector(
              'button[type="submit"]'
            );


          if (!button) {
            return;
          }


          button.dataset.originalText =
            button.textContent;


          button.disabled = true;


          button.innerHTML =
            '<span class="admin-spinner"></span> Saving...';

        }
      );

    });

  }


  /* =======================================================
     PREVENT DOUBLE SUBMISSION
     ======================================================= */

  function setupSubmitProtection() {

    const forms =
      document.querySelectorAll(
        "form"
      );


    forms.forEach(function (form) {

      form.addEventListener(
        "submit",
        function () {

          const submitButton =
            form.querySelector(
              'button[type="submit"]'
            );


          if (
            submitButton &&
            submitButton.dataset.submitting === "true"
          ) {

            return;

          }


          if (submitButton) {

            submitButton.dataset.submitting =
              "true";

          }

        }
      );

    });

  }


  /* =======================================================
     NUMBER INPUT HELPERS
     ======================================================= */

  function setupNumberInputs() {

    const inputs =
      document.querySelectorAll(
        'input[type="number"]'
      );


    inputs.forEach(function (input) {

      input.addEventListener(
        "input",
        function () {

          const min =
            input.getAttribute("min");

          const max =
            input.getAttribute("max");


          let value =
            input.value;


          if (
            value !== "" &&
            min !== null &&
            Number(value) < Number(min)
          ) {

            input.value = min;

          }


          if (
            value !== "" &&
            max !== null &&
            Number(value) > Number(max)
          ) {

            input.value = max;

          }

        }
      );

    });

  }


  /* =======================================================
     PAGE VISIBILITY
     ======================================================= */

  function setupPageVisibility() {

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
          "visible"
        ) {

          updateAdminCounts();

        }

      }
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    const sidebarController =
      setupSidebar();


    setupEscapeKey(
      sidebarController
    );


    setupModals();

    updateAdminCounts();

    setupActiveNavigation();

    setupConfirmActions();

    setupLoadingButtons();

    setupSubmitProtection();

    setupNumberInputs();

    setupPageVisibility();

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
