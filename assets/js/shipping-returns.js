/* =========================================================
   GLOWSKIN — SHIPPING & RETURNS JAVASCRIPT
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
     UPDATE HEADER COUNTS
     ======================================================= */

  function updateHeaderCounts() {
    const cart = getStorageArray(CART_KEY);
    const wishlist = getStorageArray(WISHLIST_KEY);

    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");


    if (cartCount) {
      let totalItems = 0;

      cart.forEach(function (item) {
        if (item && typeof item === "object") {
          totalItems += Number(item.quantity) || 1;
        } else {
          totalItems += 1;
        }
      });

      cartCount.textContent = totalItems;
    }


    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
    }
  }


  /* =======================================================
     SEARCH OVERLAY
     ======================================================= */

  function setupSearch() {
    const searchOverlay =
      document.getElementById("searchOverlay");

    const searchOpen =
      document.getElementById("searchOpen");

    const searchClose =
      document.getElementById("searchClose");

    const searchForm =
      document.getElementById("searchForm");

    const searchInput =
      document.getElementById("searchInput");


    function openSearch() {
      if (!searchOverlay) {
        return;
      }

      searchOverlay.classList.add("active");

      searchOverlay.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add("search-open");


      if (searchInput) {
        setTimeout(function () {
          searchInput.focus();
        }, 50);
      }
    }


    function closeSearch() {
      if (!searchOverlay) {
        return;
      }

      searchOverlay.classList.remove("active");

      searchOverlay.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove("search-open");
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

          if (event.target === searchOverlay) {
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

          const searchValue = searchInput
            ? searchInput.value.trim()
            : "";


          if (!searchValue) {
            if (searchInput) {
              searchInput.focus();
            }

            return;
          }


          window.location.href =
            "shop.html?search=" +
            encodeURIComponent(searchValue);

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
    const mobileMenu =
      document.getElementById("mobileMenu");

    const mobileMenuOpen =
      document.getElementById("mobileMenuOpen");

    const mobileMenuClose =
      document.getElementById("mobileMenuClose");


    function openMenu() {
      if (!mobileMenu) {
        return;
      }

      mobileMenu.classList.add("active");

      document.body.classList.add("menu-open");
    }


    function closeMenu() {
      if (!mobileMenu) {
        return;
      }

      mobileMenu.classList.remove("active");

      document.body.classList.remove("menu-open");
    }


    if (mobileMenuOpen) {
      mobileMenuOpen.addEventListener(
        "click",
        openMenu
      );
    }


    if (mobileMenuClose) {
      mobileMenuClose.addEventListener(
        "click",
        closeMenu
      );
    }


    if (mobileMenu) {
      mobileMenu.addEventListener(
        "click",
        function (event) {

          if (event.target === mobileMenu) {
            closeMenu();
          }

        }
      );


      const mobileLinks =
        mobileMenu.querySelectorAll("a");


      mobileLinks.forEach(function (link) {

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
     SMOOTH POLICY NAVIGATION
     ======================================================= */

  function setupSmoothLinks() {
    const links =
      document.querySelectorAll(
        '.policy-sidebar-card a[href^="#"]'
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


          /*
           * Update the URL without jumping.
           */

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
     ACTIVE POLICY SECTION
     ======================================================= */

  function setupActivePolicyLink() {
    const links =
      Array.from(
        document.querySelectorAll(
          '.policy-sidebar-card a[href^="#"]'
        )
      );


    const sections =
      Array.from(
        document.querySelectorAll(
          ".policy-card[id]"
        )
      );


    if (!links.length || !sections.length) {
      return;
    }


    function updateActiveLink() {

      const scrollPosition =
        window.scrollY + 150;


      let currentSection = sections[0];


      sections.forEach(function (section) {

        if (
          section.offsetTop <= scrollPosition
        ) {
          currentSection = section;
        }

      });


      links.forEach(function (link) {

        const href =
          link.getAttribute("href");


        const isActive =
          href === "#" + currentSection.id;


        link.classList.toggle(
          "active",
          isActive
        );

      });

    }


    window.addEventListener(
      "scroll",
      updateActiveLink,
      { passive: true }
    );


    updateActiveLink();
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

    setupActivePolicyLink();

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
