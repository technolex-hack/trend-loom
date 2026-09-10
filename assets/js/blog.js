/* =========================================================
   GlowSkin — Blog
   File: assets/js/blog.js
   ========================================================= */

(function () {
  "use strict";

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";

  /* =========================================================
     STORAGE
     ========================================================= */

  function getStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }


  /* =========================================================
     HEADER COUNTS
     ========================================================= */

  function updateHeaderCounts() {
    const cart = getStorage(CART_KEY, []);
    const wishlist = getStorage(WISHLIST_KEY, []);

    const cartCount = document.getElementById("cartCount");
    const wishlistCount =
      document.getElementById("wishlistCount");

    const totalCartItems = cart.reduce(function (total, item) {
      return total + Math.max(1, Number(item.quantity) || 1);
    }, 0);

    if (cartCount) {
      cartCount.textContent = totalCartItems;
      cartCount.style.display =
        totalCartItems > 0 ? "flex" : "none";
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

    if (!overlay) return;

    function openSearch() {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("search-open");

      setTimeout(function () {
        if (input) {
          input.focus();
        }
      }, 100);
    }

    function closeSearch() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("search-open");
    }

    if (openButton) {
      openButton.addEventListener("click", openSearch);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeSearch);
    }

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeSearch();
      }
    });

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = input
          ? input.value.trim()
          : "";

        if (!query) {
          if (input) input.focus();
          return;
        }

        window.location.href =
          "shop.html?search=" +
          encodeURIComponent(query);
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
    const menu =
      document.getElementById("mobileMenu");

    const openButton =
      document.getElementById("mobileMenuOpen");

    const closeButton =
      document.getElementById("mobileMenuClose");

    if (!menu) return;

    function openMenu() {
      menu.classList.add("active");
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      menu.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    if (openButton) {
      openButton.addEventListener("click", openMenu);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    menu.addEventListener("click", function (event) {
      if (event.target === menu) {
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
    const header =
      document.querySelector(".site-header");

    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );
  }


  /* =========================================================
     BLOG CATEGORY FILTER
     ========================================================= */

  function initCategoryFilter() {
    const buttons =
      document.querySelectorAll(".blog-category");

    const articles =
      document.querySelectorAll(".article-card");

    const emptyState =
      document.getElementById("articlesEmpty");

    if (!buttons.length || !articles.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {

        const selectedCategory =
          button.dataset.category || "all";

        /* Active button */

        buttons.forEach(function (item) {
          item.classList.remove("active");
        });

        button.classList.add("active");


        /* Filter articles */

        let visibleCount = 0;

        articles.forEach(function (article) {

          const articleCategory =
            article.dataset.category || "";

          const shouldShow =
            selectedCategory === "all" ||
            articleCategory === selectedCategory;

          if (shouldShow) {
            article.hidden = false;
            article.style.display = "";
            visibleCount++;
          } else {
            article.hidden = true;
            article.style.display = "none";
          }
        });


        /* Empty state */

        if (emptyState) {
          if (visibleCount === 0) {
            emptyState.hidden = false;
            emptyState.style.display = "block";
          } else {
            emptyState.hidden = true;
            emptyState.style.display = "none";
          }
        }

      });
    });
  }


  /* =========================================================
     NEWSLETTER
     ========================================================= */

  function initNewsletter() {
    const form =
      document.getElementById(
        "blogNewsletterForm"
      );

    const email =
      document.getElementById(
        "blogNewsletterEmail"
      );

    const message =
      document.getElementById(
        "blogNewsletterMessage"
      );

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailValue =
        email ? email.value.trim() : "";

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(emailValue)) {
        if (message) {
          message.textContent =
            "Please enter a valid email address.";
        }

        if (email) {
          email.focus();
        }

        return;
      }

      if (message) {
        message.textContent =
          "Thank you! You are subscribed to GlowSkin updates.";
      }

      form.reset();
    });
  }


  /* =========================================================
     READ MORE / ARTICLE LINKS
     ========================================================= */

  function initArticleLinks() {
    const links =
      document.querySelectorAll(
        ".article-content a, .blog-read-more"
      );

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {

        const href =
          link.getAttribute("href");

        if (!href || href === "#articles") {
          event.preventDefault();

          const articles =
            document.getElementById("articles");

          if (articles) {
            articles.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }

      });
    });
  }


  /* =========================================================
     SMOOTH ANCHOR LINKS
     ========================================================= */

  function initSmoothLinks() {
    const links =
      document.querySelectorAll(
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

        if (!target) {
          return;
        }

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
    initCategoryFilter();
    initNewsletter();
    initArticleLinks();
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
