/* =========================================================
   GlowSkin — Skin Type Guide
   File: assets/js/skin-type-guide.js
   ========================================================= */

(function () {
  "use strict";

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";

  /* =========================================================
     HELPERS
     ========================================================= */

  function getStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function updateHeaderCounts() {
    const cart = getStorage(CART_KEY, []);
    const wishlist = getStorage(WISHLIST_KEY, []);

    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");

    const cartTotal = cart.reduce(function (total, item) {
      return total + Math.max(1, Number(item.quantity) || 1);
    }, 0);

    if (cartCount) {
      cartCount.textContent = cartTotal;
      cartCount.style.display = cartTotal > 0 ? "flex" : "none";
    }

    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
      wishlistCount.style.display =
        wishlist.length > 0 ? "flex" : "none";
    }
  }


  /* =========================================================
     SEARCH
     ========================================================= */

  function initSearch() {
    const searchOverlay = document.getElementById("searchOverlay");
    const searchOpen = document.getElementById("searchOpen");
    const searchClose = document.getElementById("searchClose");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (!searchOverlay) return;

    function openSearch() {
      searchOverlay.classList.add("active");
      document.body.classList.add("search-open");

      setTimeout(function () {
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }

    function closeSearch() {
      searchOverlay.classList.remove("active");
      document.body.classList.remove("search-open");
    }

    if (searchOpen) {
      searchOpen.addEventListener("click", openSearch);
    }

    if (searchClose) {
      searchClose.addEventListener("click", closeSearch);
    }

    searchOverlay.addEventListener("click", function (event) {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = searchInput
          ? searchInput.value.trim()
          : "";

        if (!query) {
          return;
        }

        window.location.href =
          "shop.html?search=" + encodeURIComponent(query);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSearch();
      }
    });
  }


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function initMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuOpen =
      document.getElementById("mobileMenuOpen");
    const mobileMenuClose =
      document.getElementById("mobileMenuClose");

    if (!mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add("active");
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    if (mobileMenuOpen) {
      mobileMenuOpen.addEventListener("click", openMenu);
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMenu);
    }

    mobileMenu.addEventListener("click", function (event) {
      if (event.target === mobileMenu) {
        closeMenu();
      }

      const link = event.target.closest("a");

      if (link) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }


  /* =========================================================
     HEADER SCROLL
     ========================================================= */

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");

    if (!header) return;

    function checkScroll() {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    checkScroll();

    window.addEventListener(
      "scroll",
      checkScroll,
      { passive: true }
    );
  }


  /* =========================================================
     SKIN TYPE TEST
     ========================================================= */

  function initSkinTest() {
    const form = document.getElementById("skinTestForm");

    const result = document.getElementById("skinTestResult");
    const resultTitle =
      document.getElementById("skinTestResultTitle");
    const resultText =
      document.getElementById("skinTestResultText");
    const shopLink =
      document.getElementById("skinTestShopLink");
    const resetButton =
      document.getElementById("skinTestReset");

    if (!form || !result) return;


    /* ---------------------------------------------------------
       Skin type information
       --------------------------------------------------------- */

    const skinTypes = {
      oily: {
        title: "Oily Skin",
        text:
          "Your answers suggest oily skin. Your skin may produce more natural oil, especially around the forehead, nose and chin. Look for lightweight, non-comedogenic products and avoid overly heavy formulas.",
        link: "shop.html?category=face-wash"
      },

      dry: {
        title: "Dry Skin",
        text:
          "Your answers suggest dry skin. Your skin may feel tight, rough or flaky. Focus on gentle cleansers, hydrating serums and moisturizers that help support your skin barrier.",
        link: "shop.html?concern=dryness"
      },

      combination: {
        title: "Combination Skin",
        text:
          "Your answers suggest combination skin. Some areas may feel oily while other areas feel normal or dry. A balanced routine with lightweight hydration can work well.",
        link: "shop.html"
      },

      normal: {
        title: "Normal Skin",
        text:
          "Your answers suggest normal skin. Your skin appears relatively balanced. Focus on a simple routine with gentle cleansing, hydration and daily sunscreen.",
        link: "shop.html"
      },

      sensitive: {
        title: "Sensitive Skin",
        text:
          "Your answers suggest that your skin may be sensitive. Choose gentle, fragrance-free products where possible and introduce new skincare products gradually.",
        link: "shop.html"
      }
    };


    /* ---------------------------------------------------------
       Calculate result
       --------------------------------------------------------- */

    function calculateSkinType() {
      const answers = [];

      const selectedOptions =
        form.querySelectorAll(
          'input[type="radio"]:checked'
        );

      selectedOptions.forEach(function (input) {
        answers.push(input.value);
      });

      if (answers.length < 3) {
        return null;
      }

      const counts = {};

      answers.forEach(function (answer) {
        counts[answer] = (counts[answer] || 0) + 1;
      });

      let highestType = "normal";
      let highestCount = 0;

      Object.keys(counts).forEach(function (type) {
        if (counts[type] > highestCount) {
          highestCount = counts[type];
          highestType = type;
        }
      });

      /*
       * Sensitive skin is treated as an important modifier.
       * If sensitive appears once and there is no clear winner,
       * show Sensitive Skin.
       */
      if (
        counts.sensitive &&
        highestCount <= 1
      ) {
        highestType = "sensitive";
      }

      return highestType;
    }


    /* ---------------------------------------------------------
       Show result
       --------------------------------------------------------- */

    function showResult(type) {
      const data = skinTypes[type];

      if (!data) return;

      if (resultTitle) {
        resultTitle.textContent = data.title;
      }

      if (resultText) {
        resultText.textContent = data.text;
      }

      if (shopLink) {
        shopLink.href = data.link;
      }

      result.hidden = false;
      result.style.display = "block";

      result.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }


    /* ---------------------------------------------------------
       Form submit
       --------------------------------------------------------- */

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const skinType = calculateSkinType();

      if (!skinType) {
        alert("Please answer all questions to find your skin type.");
        return;
      }

      showResult(skinType);
    });


    /* ---------------------------------------------------------
       Reset test
       --------------------------------------------------------- */

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        form.reset();

        result.hidden = true;
        result.style.display = "none";

        const firstQuestion =
          form.querySelector(".test-question");

        if (firstQuestion) {
          firstQuestion.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      });
    }
  }


  /* =========================================================
     SMOOTH ANCHOR SCROLL
     ========================================================= */

  function initSmoothLinks() {
    const links = document.querySelectorAll(
      'a[href^="#"]'
    );

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
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

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }


  /* =========================================================
     IMAGE FALLBACK
     ========================================================= */

  function initImageFallback() {
    const images =
      document.querySelectorAll("img");

    images.forEach(function (image) {
      image.addEventListener("error", function () {
        image.style.display = "none";
      });
    });
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {
    updateHeaderCounts();
    initSearch();
    initMobileMenu();
    initHeaderScroll();
    initSkinTest();
    initSmoothLinks();
    initImageFallback();
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
