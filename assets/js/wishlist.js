/* =========================================================
   GLOWSKIN — WISHLIST
   File: assets/js/wishlist.js
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const WISHLIST_KEY = "glowskin_wishlist";
  const CART_KEY = "glowskin_cart";


  /* =======================================================
     PRODUCT DATA
     ======================================================= */

  const PRODUCTS = {

    "vitamin-c-brightening-serum": {
      id: "vitamin-c-brightening-serum",
      name: "Vitamin C Brightening Serum",
      category: "serums",
      categoryName: "Serums",
      price: 599,
      mrp: 799,
      rating: 4.8,
      reviews: 124,
      image: "assets/images/products/vitamin-c-serum-1.jpg"
    },

    "daily-sunscreen-spf-50": {
      id: "daily-sunscreen-spf-50",
      name: "Daily Sunscreen SPF 50",
      category: "sunscreen",
      categoryName: "Sunscreen",
      price: 479,
      mrp: 599,
      rating: 4.7,
      reviews: 98,
      image: "assets/images/products/sunscreen-1.jpg"
    },

    "niacinamide-pore-serum": {
      id: "niacinamide-pore-serum",
      name: "Niacinamide Pore Serum",
      category: "serums",
      categoryName: "Serums",
      price: 549,
      mrp: null,
      rating: 4.6,
      reviews: 87,
      image: "assets/images/products/niacinamide-serum-1.jpg"
    },

    "daily-hydrating-moisturizer": {
      id: "daily-hydrating-moisturizer",
      name: "Daily Hydrating Moisturizer",
      category: "moisturizers",
      categoryName: "Moisturizers",
      price: 449,
      mrp: null,
      rating: 4.7,
      reviews: 76,
      image: "assets/images/products/moisturizer-1.jpg"
    },

    "gentle-foaming-face-wash": {
      id: "gentle-foaming-face-wash",
      name: "Gentle Foaming Face Wash",
      category: "face-wash",
      categoryName: "Face Wash",
      price: 349,
      mrp: null,
      rating: 4.5,
      reviews: 64,
      image: "assets/images/products/face-wash-1.jpg"
    },

    "hydrating-hyaluronic-serum": {
      id: "hydrating-hyaluronic-serum",
      name: "Hydrating Hyaluronic Serum",
      category: "serums",
      categoryName: "Serums",
      price: 699,
      mrp: null,
      rating: 4.8,
      reviews: 91,
      image: "assets/images/products/hyaluronic-serum-1.jpg"
    },

    "brightening-face-cleanser": {
      id: "brightening-face-cleanser",
      name: "Brightening Face Cleanser",
      category: "face-wash",
      categoryName: "Face Wash",
      price: 399,
      mrp: null,
      rating: 4.5,
      reviews: 58,
      image: "assets/images/products/brightening-cleanser-1.jpg"
    },

    "barrier-repair-moisturizer": {
      id: "barrier-repair-moisturizer",
      name: "Barrier Repair Moisturizer",
      category: "moisturizers",
      categoryName: "Moisturizers",
      price: 799,
      mrp: null,
      rating: 4.9,
      reviews: 112,
      image: "assets/images/products/barrier-moisturizer-1.jpg"
    },

    "hydrating-rose-toner": {
      id: "hydrating-rose-toner",
      name: "Hydrating Rose Toner",
      category: "toners",
      categoryName: "Toners",
      price: 429,
      mrp: null,
      rating: 4.6,
      reviews: 53,
      image: "assets/images/products/rose-toner-1.jpg"
    },

    "acne-control-face-wash": {
      id: "acne-control-face-wash",
      name: "Acne Control Face Wash",
      category: "face-wash",
      categoryName: "Face Wash",
      price: 499,
      mrp: 599,
      rating: 4.6,
      reviews: 83,
      image: "assets/images/products/acne-face-wash-1.jpg"
    },

    "spf-50-matte-sunscreen": {
      id: "spf-50-matte-sunscreen",
      name: "SPF 50 Matte Sunscreen",
      category: "sunscreen",
      categoryName: "Sunscreen",
      price: 599,
      mrp: null,
      rating: 4.7,
      reviews: 71,
      image: "assets/images/products/matte-sunscreen-1.jpg"
    },

    "nourishing-lip-care-balm": {
      id: "nourishing-lip-care-balm",
      name: "Nourishing Lip Care Balm",
      category: "lip-care",
      categoryName: "Lip Care",
      price: 299,
      mrp: null,
      rating: 4.5,
      reviews: 47,
      image: "assets/images/products/lip-balm-1.jpg"
    }

  };


  /* =======================================================
     DOM ELEMENTS
     ======================================================= */

  const grid = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("wishlistEmpty");
  const subtitle = document.getElementById("wishlistSubtitle");

  const wishlistCount = document.getElementById("wishlistCount");
  const cartCount = document.getElementById("cartCount");

  const toast = document.getElementById("wishlistToast");
  const toastText = document.getElementById("wishlistToastText");


  /* =======================================================
     SAFE STORAGE
     ======================================================= */

  function getStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return fallback;
      }

      const parsed = JSON.parse(value);

      return parsed ?? fallback;

    } catch (error) {
      return fallback;
    }
  }


  function setStorage(key, value) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    } catch (error) {
      return false;
    }
  }


  /* =======================================================
     GET WISHLIST
     ======================================================= */

  function getWishlist() {

    const wishlist = getStorage(
      WISHLIST_KEY,
      []
    );

    if (!Array.isArray(wishlist)) {
      return [];
    }

    return wishlist
      .map(function (item) {

        if (typeof item === "string") {
          return item;
        }

        if (item && item.id) {
          return item.id;
        }

        return null;

      })
      .filter(Boolean);

  }


  /* =======================================================
     SAVE WISHLIST
     ======================================================= */

  function saveWishlist(items) {

    setStorage(
      WISHLIST_KEY,
      items
    );

  }


  /* =======================================================
     GET CART
     ======================================================= */

  function getCart() {

    const cart = getStorage(
      CART_KEY,
      []
    );

    return Array.isArray(cart)
      ? cart
      : [];

  }


  /* =======================================================
     UPDATE HEADER COUNTS
     ======================================================= */

  function updateCounts() {

    const wishlist = getWishlist();
    const cart = getCart();


    /* Wishlist count */

    const wishlistTotal = wishlist.length;

    if (wishlistCount) {

      wishlistCount.textContent =
        wishlistTotal;

      wishlistCount.hidden =
        wishlistTotal === 0;

    }


    /* Cart count */

    let cartTotal = 0;

    cart.forEach(function (item) {

      const quantity =
        Number(item.quantity) || 1;

      cartTotal += quantity;

    });


    if (cartCount) {

      cartCount.textContent =
        cartTotal;

      cartCount.hidden =
        cartTotal === 0;

    }

  }


  /* =======================================================
     FORMAT PRICE
     ======================================================= */

  function formatPrice(price) {

    return "₹" +
      Number(price).toLocaleString("en-IN");

  }


  /* =======================================================
     CALCULATE DISCOUNT
     ======================================================= */

  function calculateDiscount(product) {

    if (
      !product.mrp ||
      product.mrp <= product.price
    ) {
      return null;
    }

    return Math.round(
      ((product.mrp - product.price) /
        product.mrp) *
        100
    );

  }


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     SHOW TOAST
     ======================================================= */

  let toastTimer = null;


  function showToast(message) {

    if (!toast) {
      return;
    }

    if (toastText) {
      toastText.textContent =
        message;
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
      function () {
        toast.classList.remove("show");
      },
      2500
    );

  }


  /* =======================================================
     ADD PRODUCT TO CART
     ======================================================= */

  function addToCart(productId) {

    const product =
      PRODUCTS[productId];

    if (!product) {
      return;
    }


    const cart =
      getCart();


    const existingIndex =
      cart.findIndex(function (item) {

        return item.id === productId;

      });


    if (existingIndex !== -1) {

      const currentQuantity =
        Number(
          cart[existingIndex].quantity
        ) || 1;

      cart[existingIndex].quantity =
        Math.min(
          currentQuantity + 1,
          10
        );

    } else {

      cart.push({
        id: productId,
        quantity: 1
      });

    }


    if (
      setStorage(
        CART_KEY,
        cart
      )
    ) {

      updateCounts();

      showToast(
        product.name +
        " added to cart"
      );

    }

  }


  /* =======================================================
     REMOVE FROM WISHLIST
     ======================================================= */

  function removeFromWishlist(productId) {

    let wishlist =
      getWishlist();


    wishlist =
      wishlist.filter(function (id) {

        return id !== productId;

      });


    saveWishlist(wishlist);

    updateCounts();

    renderWishlist();

    showToast(
      "Removed from wishlist"
    );

  }


  /* =======================================================
     PRODUCT CARD
     ======================================================= */

  function createProductCard(product) {

    const discount =
      calculateDiscount(product);


    const card =
      document.createElement("article");

    card.className =
      "wishlist-card";


    /* Image */

    const imageBox =
      document.createElement("div");

    imageBox.className =
      "wishlist-card-image";


    if (product.image) {

      const image =
        document.createElement("img");

      image.src =
        product.image;

      image.alt =
        product.name;

      image.loading =
        "lazy";


      image.addEventListener(
        "error",
        function () {

          image.remove();

          const placeholder =
            document.createElement("div");

          placeholder.className =
            "wishlist-image-placeholder";

          placeholder.textContent =
            "✨";

          imageBox.prepend(
            placeholder
          );

        }
      );


      imageBox.appendChild(
        image
      );

    } else {

      const placeholder =
        document.createElement("div");

      placeholder.className =
        "wishlist-image-placeholder";

      placeholder.textContent =
        "✨";

      imageBox.appendChild(
        placeholder
      );

    }


    /* Discount badge */

    if (discount) {

      const badge =
        document.createElement("span");

      badge.className =
        "wishlist-product-badge";

      badge.textContent =
        discount + "% OFF";

      imageBox.appendChild(
        badge
      );

    }


    /* Remove button */

    const removeButton =
      document.createElement("button");

    removeButton.type =
      "button";

    removeButton.className =
      "wishlist-remove";

    removeButton.setAttribute(
      "aria-label",
      "Remove " + product.name +
      " from wishlist"
    );

    removeButton.innerHTML =
      "♥";


    removeButton.addEventListener(
      "click",
      function () {

        removeFromWishlist(
          product.id
        );

      }
    );


    imageBox.appendChild(
      removeButton
    );


    /* Product information */

    const info =
      document.createElement("div");

    info.className =
      "wishlist-card-info";


    const category =
      document.createElement("span");

    category.className =
      "wishlist-card-category";

    category.textContent =
      product.categoryName;


    const title =
      document.createElement("a");

    title.className =
      "wishlist-card-title";

    title.href =
      "product.html?product=" +
      encodeURIComponent(
        product.id
      );

    title.textContent =
      product.name;


    /* Rating */

    const rating =
      document.createElement("div");

    rating.className =
      "wishlist-rating";


    const stars =
      document.createElement("span");

    stars.className =
      "wishlist-stars";

    stars.textContent =
      "★★★★★";


    const reviewCount =
      document.createElement("span");

    reviewCount.className =
      "wishlist-review-count";

    reviewCount.textContent =
      product.rating +
      " (" +
      product.reviews +
      ")";


    rating.appendChild(
      stars
    );

    rating.appendChild(
      reviewCount
    );


    /* Price */

    const priceRow =
      document.createElement("div");

    priceRow.className =
      "wishlist-price-row";


    const price =
      document.createElement("span");

    price.className =
      "wishlist-price";

    price.textContent =
      formatPrice(
        product.price
      );

    priceRow.appendChild(
      price
    );


    if (product.mrp) {

      const mrp =
        document.createElement("span");

      mrp.className =
        "wishlist-mrp";

      mrp.textContent =
        formatPrice(
          product.mrp
        );

      priceRow.appendChild(
        mrp
      );

    }


    if (discount) {

      const discountLabel =
        document.createElement("span");

      discountLabel.className =
        "wishlist-discount";

      discountLabel.textContent =
        discount + "% OFF";

      priceRow.appendChild(
        discountLabel
      );

    }


    /* Add to cart */

    const addButton =
      document.createElement("button");

    addButton.type =
      "button";

    addButton.className =
      "wishlist-add-cart";

    addButton.textContent =
      "Add to Cart";


    addButton.addEventListener(
      "click",
      function () {

        addToCart(
          product.id
        );

      }
    );


    /* View product */

    const viewProduct =
      document.createElement("a");

    viewProduct.className =
      "wishlist-view-product";

    viewProduct.href =
      "product.html?product=" +
      encodeURIComponent(
        product.id
      );

    viewProduct.textContent =
      "View Product →";


    /* Assemble */

    info.appendChild(
      category
    );

    info.appendChild(
      title
    );

    info.appendChild(
      rating
    );

    info.appendChild(
      priceRow
    );

    info.appendChild(
      addButton
    );

    info.appendChild(
      viewProduct
    );


    card.appendChild(
      imageBox
    );

    card.appendChild(
      info
    );


    return card;

  }


  /* =======================================================
     RENDER WISHLIST
     ======================================================= */

  function renderWishlist() {

    if (!grid || !emptyState) {
      return;
    }


    const wishlist =
      getWishlist();


    grid.innerHTML =
      "";


    const validProducts =
      wishlist
        .map(function (id) {

          return PRODUCTS[id];

        })
        .filter(Boolean);


    /* Empty */

    if (validProducts.length === 0) {

      grid.hidden =
        true;

      emptyState.hidden =
        false;


      if (subtitle) {

        subtitle.textContent =
          "You haven't saved any products yet.";

      }

      return;

    }


    /* Products */

    grid.hidden =
      false;

    emptyState.hidden =
      true;


    if (subtitle) {

      subtitle.textContent =
        validProducts.length +
        (
          validProducts.length === 1
            ? " product saved for later."
            : " products saved for later."
        );

    }


    validProducts.forEach(
      function (product) {

        grid.appendChild(
          createProductCard(
            product
          )
        );

      }
    );

  }


  /* =======================================================
     SEARCH
     ======================================================= */

  function initSearch() {

    const searchOpen =
      document.getElementById(
        "searchOpen"
      );

    const searchOverlay =
      document.getElementById(
        "searchOverlay"
      );

    const searchClose =
      document.getElementById(
        "searchClose"
      );

    const searchForm =
      document.getElementById(
        "searchForm"
      );

    const searchInput =
      document.getElementById(
        "searchInput"
      );


    if (
      !searchOpen ||
      !searchOverlay
    ) {
      return;
    }


    searchOpen.addEventListener(
      "click",
      function () {

        searchOverlay.classList.add(
          "active"
        );

        document.body.classList.add(
          "search-open"
        );


        if (searchInput) {

          setTimeout(
            function () {
              searchInput.focus();
            },
            100
          );

        }

      }
    );


    if (searchClose) {

      searchClose.addEventListener(
        "click",
        closeSearch
      );

    }


    searchOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          searchOverlay
        ) {
          closeSearch();
        }

      }
    );


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
            encodeURIComponent(
              query
            );

        }
      );

    }


    function closeSearch() {

      searchOverlay.classList.remove(
        "active"
      );

      document.body.classList.remove(
        "search-open"
      );

    }

  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  function initMobileMenu() {

    const toggle =
      document.getElementById(
        "mobileMenuToggle"
      );

    const menu =
      document.getElementById(
        "mobileMenu"
      );

    const close =
      document.getElementById(
        "mobileMenuClose"
      );


    if (!toggle || !menu) {
      return;
    }


    toggle.addEventListener(
      "click",
      function () {

        menu.classList.add(
          "active"
        );

        document.body.classList.add(
          "menu-open"
        );

      }
    );


    if (close) {

      close.addEventListener(
        "click",
        closeMenu
      );

    }


    menu.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          menu
        ) {
          closeMenu();
        }

      }
    );


    const links =
      menu.querySelectorAll(
        "a"
      );


    links.forEach(
      function (link) {

        link.addEventListener(
          "click",
          closeMenu
        );

      }
    );


    function closeMenu() {

      menu.classList.remove(
        "active"
      );

      document.body.classList.remove(
        "menu-open"
      );

    }

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  function initEscapeKey() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key !==
          "Escape"
        ) {
          return;
        }


        const searchOverlay =
          document.getElementById(
            "searchOverlay"
          );

        const mobileMenu =
          document.getElementById(
            "mobileMenu"
          );


        if (searchOverlay) {

          searchOverlay.classList.remove(
            "active"
          );

        }


        if (mobileMenu) {

          mobileMenu.classList.remove(
            "active"
          );

        }


        document.body.classList.remove(
          "search-open"
        );

        document.body.classList.remove(
          "menu-open"
        );

      }
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    renderWishlist();

    updateCounts();

    initSearch();

    initMobileMenu();

    initEscapeKey();

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
