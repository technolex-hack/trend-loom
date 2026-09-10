/* =========================================================
   GLOWSKIN — PRIVACY POLICY JAVASCRIPT
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =======================================================
     STORAGE HELPER
     ======================================================= */

  function getStorageArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }


  /* =======================================================
     HEADER COUNTS
     ======================================================= */

  function updateHeaderCounts() {
    const cart = getStorageArray(CART_KEY);
    const wishlist = getStorageArray(WISHLIST_KEY);

    const cartCount =
      document.getElementById("cartCount");

    const wishlistCount =
      document.getElementById("wishlistCount");


    if (cartCount) {
      let total = 0;

      cart.forEach(function (item) {
        if (item && typeof item === "object") {
          total += Number(item.quantity) || 1;
        } else {
          total += 1;
        }
      });

      cartCount.textContent = total;
    }


    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
    }
  }


  /* =======================================================
     SEARCH
     ======================================================= */

  function setupSearch() {
    const overlay =
      document.getElementById("searchOverlay");

    const openButton =
      document.getElementById("searchOpen");

    const closeButton =
      document.getElementById("searchClose");

    const form =
      document.getElementById("searchForm");

    const input =
      document.getElementById("searchInput");


    function openSearch() {
      if (!overlay) {
        return;
      }

      overlay.classList.add("active");

      overlay.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add("search-open");


      if (input) {
        setTimeout(function () {
          input.focus();
        }, 50);
      }
    }


    function closeSearch() {
      if (!overlay) {
        return;
      }

      overlay.classList.remove("active");

      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove("search-open");
    }


    if (openButton) {
      openButton.addEventListener(
        "click",
        openSearch
      );
    }


    if (closeButton) {
      closeButton.addEventListener(
        "click",
        closeSearch
      );
    }


    if (overlay) {
      overlay.addEventListener(
        "click",
        function (event) {

          if (event.target === overlay) {
            closeSearch();
          }

        }
      );
    }


    if (form) {
      form.addEventListener(
        "submit",
        function (event) {

          event.preventDefault();

          const value =
            input ? input.value.trim() : "";


          if (!value) {
            if (input) {
              input.focus();
            }

            return;
          }


          window.location.href =
            "shop.html?search=" +
            encodeURIComponent(value);

        }
      );
    }


    return {
      closeSearch: closeSearch
    };
  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  function setupMobileMenu() {
    const menu =
      document.getElementById("mobileMenu");

    const openButton =
      document.getElementById("mobileMenuOpen");

    const closeButton =
      document.getElementById("mobileMenuClose");


    function openMenu() {
      if (!menu) {
        return;
      }

      menu.classList.add("active");

      document.body.classList.add("menu-open");
    }


    function closeMenu() {
      if (!menu) {
        return;
      }

      menu.classList.remove("active");

      document.body.classList.remove("menu-open");
    }


    if (openButton) {
      openButton.addEventListener(
        "click",
        openMenu
      );
    }


    if (closeButton) {
      closeButton.addEventListener(
        "click",
        closeMenu
      );
    }


    if (menu) {
      menu.addEventListener(
        "click",
        function (event) {

          if (event.target === menu) {
            closeMenu();
          }

        }
      );


      const links =
        menu.querySelectorAll("a");


      links.forEach(function (link) {

        link.addEventListener(
          "click",
          closeMenu
        );

      });
    }


    return {
      closeMenu: closeMenu
    };
  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  function setupEscapeKey(
    searchController,
    menuController
  ) {

    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key !== "Escape") {
          return;
        }


        if (searchController) {
          searchController.closeSearch();
        }


        if (menuController) {
          menuController.closeMenu();
        }

      }
    );
  }


  /* =======================================================
     HEADER SCROLL
     ======================================================= */

  function setupHeaderScroll() {
    const header =
      document.querySelector(".site-header");


    if (!header) {
      return;
    }


    function updateHeader() {

      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

    }


    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );


    updateHeader();
  }


  /* =======================================================
     SMOOTH SIDEBAR LINKS
     ======================================================= */

  function setupSmoothLinks() {
    const links =
      document.querySelectorAll(
        '.privacy-sidebar-card a[href^="#"]'
      );


    links.forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const targetId =
            link.getAttribute("href");


          if (!targetId || targetId === "#") {
            return;
          }


          const target =
            document.querySelector(targetId);


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });


          if (
            window.history &&
            window.history.replaceState
          ) {

            window.history.replaceState(
              null,
              "",
              targetId
            );

          }

        }
      );

    });
  }


  /* =======================================================
     ACTIVE SECTION
     ======================================================= */

  function setupActiveSection() {
    const links =
      Array.from(
        document.querySelectorAll(
          '.privacy-sidebar-card a[href^="#"]'
        )
      );


    const sections =
      Array.from(
        document.querySelectorAll(
          ".privacy-card[id]"
        )
      );


    if (!links.length || !sections.length) {
      return;
    }


    function updateActiveSection() {

      const position =
        window.scrollY + 160;


      let current =
        sections[0];


      sections.forEach(function (section) {

        if (
          section.offsetTop <= position
        ) {
          current = section;
        }

      });


      links.forEach(function (link) {

        const href =
          link.getAttribute("href");

        const active =
          href === "#" + current.id;


        link.classList.toggle(
          "active",
          active
        );

      });

    }


    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );


    updateActiveSection();
  }


  /* =======================================================
     SMOOTH NORMAL ANCHOR LINKS
     ======================================================= */

  function setupAnchorLinks() {
    const links =
      document.querySelectorAll(
        'a[href^="#"]:not(.privacy-sidebar-card a)'
      );


    links.forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const id =
            link.getAttribute("href");


          if (!id || id === "#") {
            return;
          }


          const target =
            document.querySelector(id);


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
  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    updateHeaderCounts();

    const searchController =
      setupSearch();

    const menuController =
      setupMobileMenu();

    setupEscapeKey(
      searchController,
      menuController
    );

    setupHeaderScroll();

    setupSmoothLinks();

    setupActiveSection();

    setupAnchorLinks();

  }


  /* =======================================================
     DOM READY
     ======================================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
