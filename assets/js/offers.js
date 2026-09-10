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

  const offersToast = document.getElementById("offersToast");
  const offersToastText = document.getElementById("offersToastText");

  const copyButtons = document.querySelectorAll(".copy-coupon");

  const searchOverlay = document.getElementById("searchOverlay");
  const searchOpen = document.getElementById("searchOpen");
  const searchClose = document.getElementById("searchClose");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOpen = document.getElementById("mobileMenuOpen");
  const mobileMenuClose = document.getElementById("mobileMenuClose");


  /* =========================================
     STORAGE
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


  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`GlowSkin save error: ${key}`, error);
      return false;
    }
  }


  /* =========================================
     CART HELPERS
  ========================================= */

  function getCart() {
    const cart = getStorage(CART_KEY, []);

    return Array.isArray(cart) ? cart : [];
  }


  function getCartItemQuantity(item) {
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

    const cart = getCart();

    const totalQuantity = cart.reduce(
      (total, item) => {
        return total + getCartItemQuantity(item);
      },
      0
    );

    cartCount.textContent = totalQuantity;

    cartCount.hidden = totalQuantity === 0;
  }


  /* =========================================
     WISHLIST
  ========================================= */

  function getWishlist() {
    const wishlist = getStorage(WISHLIST_KEY, []);

    return Array.isArray(wishlist)
      ? wishlist
      : [];
  }


  function updateWishlistCount() {
    if (!wishlistCount) {
      return;
    }

    const wishlist = getWishlist();

    wishlistCount.textContent = wishlist.length;

    wishlistCount.hidden = wishlist.length === 0;
  }


  function updateHeaderCounts() {
    updateCartCount();
    updateWishlistCount();
  }


  /* =========================================
     TOAST
  ========================================= */

  let toastTimer = null;

  function showToast(message) {
    if (!offersToast || !offersToastText) {
      return;
    }

    offersToastText.textContent = message;

    offersToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      offersToast.classList.remove("show");
    }, 2200);
  }


  /* =========================================
     COPY COUPON
  ========================================= */

  async function copyCoupon(code, button) {
    const couponCode = String(code || "").trim();

    if (!couponCode) {
      return;
    }

    let copied = false;

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(couponCode);

        copied = true;
      }
    } catch (error) {
      copied = false;
    }


    /* Fallback for older browsers */

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");

        textarea.value = couponCode;

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        copied = document.execCommand("copy");

        textarea.remove();

      } catch (error) {
        copied = false;
      }
    }


    if (copied) {
      showToast(`${couponCode} copied!`);

      if (button) {
        const originalText = button.textContent;

        button.textContent = "Copied!";

        button.disabled = true;

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 1500);
      }

    } else {
      showToast(`Coupon code: ${couponCode}`);
    }
  }


  copyButtons.forEach(button => {
    button.addEventListener("click", () => {
      const code = button.dataset.code;

      copyCoupon(code, button);
    });
  });


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

    setTimeout(() => {
      searchInput?.focus();
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
    searchOverlay.addEventListener("click", event => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }


  if (searchForm) {
    searchForm.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        const query =
          searchInput?.value.trim() || "";

        if (!query) {
          searchInput?.focus();
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

    if (offersToast) {
      offersToast.classList.remove("show");
    }
  });


  /* =========================================
     INITIALIZE
  ========================================= */

  function init() {
    updateHeaderCounts();
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
