(() => {
  "use strict";

  /* =========================================
     STORAGE KEYS
  ========================================= */

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =========================================
     DOM ELEMENTS
  ========================================= */

  const cartCount = document.getElementById("cartCount");
  const wishlistCount = document.getElementById("wishlistCount");

  const searchOverlay = document.getElementById("searchOverlay");
  const searchOpen = document.getElementById("searchOpen");
  const searchClose = document.getElementById("searchClose");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

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

      const parsed = JSON.parse(value);

      return parsed ?? fallback;

    } catch (error) {
      console.warn(`GlowSkin storage error: ${key}`, error);
      return fallback;
    }
  }


  /* =========================================
     CART COUNT
  ========================================= */

  function getCartQuantity(item) {
    const quantity = Number(
      item?.quantity ??
      item?.qty ??
      1
    );

    return Math.max(1, Math.min(10, quantity));
  }


  function updateCartCount() {
    if (!cartCount) {
      return;
    }

    const cart = getStorage(CART_KEY, []);

    const items = Array.isArray(cart)
      ? cart
      : [];

    const total = items.reduce(
      (sum, item) => {
        return sum + getCartQuantity(item);
      },
      0
    );

    cartCount.textContent = total;

    cartCount.hidden = total === 0;
  }


  /* =========================================
     WISHLIST COUNT
  ========================================= */

  function updateWishlistCount() {
    if (!wishlistCount) {
      return;
    }

    const wishlist = getStorage(
      WISHLIST_KEY,
      []
    );

    const items = Array.isArray(wishlist)
      ? wishlist
      : [];

    wishlistCount.textContent = items.length;

    wishlistCount.hidden = items.length === 0;
  }


  function updateHeaderCounts() {
    updateCartCount();
    updateWishlistCount();
  }


  /* =========================================
     SEARCH OVERLAY
  ========================================= */

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

    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
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
      event => {
        if (event.target === searchOverlay) {
          closeSearch();
        }
      }
    );
  }


  /* =========================================
     SEARCH FORM
  ========================================= */

  if (searchForm) {
    searchForm.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        const query =
          searchInput?.value.trim() || "";

        if (!query) {
          if (searchInput) {
            searchInput.focus();
          }

          return;
        }

        window.location.href =
          `shop.html?search=${encodeURIComponent(query)}`;
      }
    );
  }


  /* =========================================
     MOBILE MENU
  ========================================= */

  function openMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.add("active");

    mobileMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("menu-open");
  }


  function closeMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove("active");

    mobileMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("menu-open");
  }


  if (mobileMenuOpen) {
    mobileMenuOpen.addEventListener(
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
      event => {
        if (event.target === mobileMenu) {
          closeMobileMenu();
        }
      }
    );
  }


  /* =========================================
     CLOSE MENU WHEN LINK IS CLICKED
  ========================================== */

  if (mobileMenu) {
    const mobileLinks =
      mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {
      link.addEventListener(
        "click",
        closeMobileMenu
      );
    });
  }


  /* =========================================
     KEYBOARD
  ========================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeSearch();
        closeMobileMenu();
      }

    }
  );


  /* =========================================
     SMOOTH SCROLL
  ========================================== */

  const concernLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  concernLinks.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
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

      }
    );

  });


  /* =========================================
     HEADER SCROLL EFFECT
  ========================================== */

  function handleHeaderScroll() {

    const header =
      document.querySelector(".site-header");

    if (!header) {
      return;
    }

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  }


  window.addEventListener(
    "scroll",
    handleHeaderScroll,
    {
      passive: true
    }
  );


  /* =========================================
     INITIALIZE
  ========================================== */

  function init() {
    updateHeaderCounts();
    handleHeaderScroll();
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
