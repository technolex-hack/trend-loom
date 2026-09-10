(() => {
  "use strict";

  /* =========================================
     GlowSkin — Checkout JavaScript
     ========================================= */

  const CART_KEY = "glowskin_cart";
  const ORDERS_KEY = "glowskin_orders";
  const LAST_ORDER_KEY = "glowskin_last_order";

  const FREE_SHIPPING_LIMIT = 999;
  const SHIPPING_CHARGE = 49;

  /* =========================================
     Product Data
     ========================================= */

  const products = {
    "vitamin-c-brightening-serum": {
      id: "vitamin-c-brightening-serum",
      name: "Vitamin C Brightening Serum",
      price: 599,
      image: "assets/images/products/vitamin-c-serum-1.jpg"
    },

    "daily-sunscreen-spf-50": {
      id: "daily-sunscreen-spf-50",
      name: "Daily Sunscreen SPF 50",
      price: 479,
      image: "assets/images/products/sunscreen-1.jpg"
    },

    "niacinamide-pore-serum": {
      id: "niacinamide-pore-serum",
      name: "Niacinamide Pore Serum",
      price: 549,
      image: "assets/images/products/niacinamide-serum-1.jpg"
    },

    "daily-hydrating-moisturizer": {
      id: "daily-hydrating-moisturizer",
      name: "Daily Hydrating Moisturizer",
      price: 449,
      image: "assets/images/products/moisturizer-1.jpg"
    },

    "gentle-foaming-face-wash": {
      id: "gentle-foaming-face-wash",
      name: "Gentle Foaming Face Wash",
      price: 349,
      image: "assets/images/products/face-wash-1.jpg"
    },

    "hydrating-hyaluronic-serum": {
      id: "hydrating-hyaluronic-serum",
      name: "Hydrating Hyaluronic Serum",
      price: 699,
      image: "assets/images/products/hyaluronic-serum-1.jpg"
    },

    "brightening-face-cleanser": {
      id: "brightening-face-cleanser",
      name: "Brightening Face Cleanser",
      price: 399,
      image: "assets/images/products/brightening-cleanser-1.jpg"
    },

    "barrier-repair-moisturizer": {
      id: "barrier-repair-moisturizer",
      name: "Barrier Repair Moisturizer",
      price: 799,
      image: "assets/images/products/barrier-moisturizer-1.jpg"
    },

    "hydrating-rose-toner": {
      id: "hydrating-rose-toner",
      name: "Hydrating Rose Toner",
      price: 429,
      image: "assets/images/products/rose-toner-1.jpg"
    },

    "acne-control-face-wash": {
      id: "acne-control-face-wash",
      name: "Acne Control Face Wash",
      price: 499,
      image: "assets/images/products/acne-face-wash-1.jpg"
    },

    "spf-50-matte-sunscreen": {
      id: "spf-50-matte-sunscreen",
      name: "SPF 50 Matte Sunscreen",
      price: 599,
      image: "assets/images/products/matte-sunscreen-1.jpg"
    },

    "nourishing-lip-care-balm": {
      id: "nourishing-lip-care-balm",
      name: "Nourishing Lip Care Balm",
      price: 299,
      image: "assets/images/products/lip-balm-1.jpg"
    }
  };

  /* =========================================
     Helpers
     ========================================= */

  const $ = (selector) => document.querySelector(selector);

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const getCart = () => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      const cart = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(cart)) {
        return [];
      }

      return cart;
    } catch (error) {
      console.error("Could not read cart:", error);
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const getQuantity = (item) => {
    const quantity = Number(item.quantity);

    if (Number.isFinite(quantity) && quantity > 0) {
      return Math.min(Math.max(Math.floor(quantity), 1), 10);
    }

    return 1;
  };

  const getProduct = (item) => {
    if (!item) return null;

    if (item.id && products[item.id]) {
      return products[item.id];
    }

    const oldName = String(item.productName || "").trim().toLowerCase();

    return Object.values(products).find(
      (product) => product.name.toLowerCase() === oldName
    ) || null;
  };

  const normalizeCart = () => {
    const rawCart = getCart();

    return rawCart
      .map((item) => {
        const product = getProduct(item);

        if (!product) {
          return null;
        }

        return {
          id: product.id,
          quantity: getQuantity(item)
        };
      })
      .filter(Boolean);
  };

  const calculateSubtotal = (cart) => {
    return cart.reduce((total, item) => {
      const product = getProduct(item);

      if (!product) return total;

      return total + product.price * getQuantity(item);
    }, 0);
  };

  /* =========================================
     DOM Elements
     ========================================= */

  const checkoutItems = $("#checkoutItems");
  const checkoutSubtotal = $("#checkoutSubtotal");
  const checkoutDiscountRow = $("#checkoutDiscountRow");
  const checkoutDiscount = $("#checkoutDiscount");
  const checkoutShipping = $("#checkoutShipping");
  const checkoutTotal = $("#checkoutTotal");
  const deliveryDate = $("#deliveryDate");

  const placeOrderBtn = $("#placeOrderBtn");

  const customerName = $("#customerName");
  const customerPhone = $("#customerPhone");
  const customerEmail = $("#customerEmail");
  const customerAddress = $("#customerAddress");
  const customerCity = $("#customerCity");
  const customerState = $("#customerState");
  const customerPincode = $("#customerPincode");

  const agreeTerms = $("#agreeTerms");

  const errorName = $("#errorName");
  const errorPhone = $("#errorPhone");
  const errorEmail = $("#errorEmail");
  const errorAddress = $("#errorAddress");
  const errorCity = $("#errorCity");
  const errorState = $("#errorState");
  const errorPincode = $("#errorPincode");
  const errorPayment = $("#errorPayment");
  const errorTerms = $("#errorTerms");

  /* =========================================
     Payment
     ========================================= */

  const getSelectedPaymentMethod = () => {
    const selected = document.querySelector(
      'input[name="paymentMethod"]:checked'
    );

    return selected ? selected.value : "";
  };

  /* =========================================
     Cart Rendering
     ========================================= */

  const renderCheckoutItems = (cart) => {
    if (!checkoutItems) return;

    if (!cart.length) {
      checkoutItems.innerHTML = `
        <div class="checkout-empty">
          <div class="checkout-empty-icon">🛍️</div>
          <h3>Your cart is empty</h3>
          <p>Add some skincare products before placing an order.</p>
          <a href="shop.html" class="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      `;

      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
      }

      return;
    }

    checkoutItems.innerHTML = cart
      .map((item) => {
        const product = getProduct(item);

        if (!product) return "";

        const quantity = getQuantity(item);
        const itemTotal = product.price * quantity;

        return `
          <div class="checkout-item">
            <div class="checkout-item-image">
              <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.style.display='none'; this.parentElement.classList.add('image-fallback');"
              >
            </div>

            <div class="checkout-item-info">
              <h4>${product.name}</h4>
              <p>Qty: ${quantity}</p>
              <strong>${formatPrice(itemTotal)}</strong>
            </div>
          </div>
        `;
      })
      .join("");

    if (placeOrderBtn) {
      placeOrderBtn.disabled = false;
    }
  };

  /* =========================================
     Order Summary
     ========================================= */

  const updateSummary = (cart) => {
    const subtotal = calculateSubtotal(cart);

    const shipping =
      subtotal >= FREE_SHIPPING_LIMIT
        ? 0
        : SHIPPING_CHARGE;

    const discount = 0;

    const total = subtotal - discount + shipping;

    if (checkoutSubtotal) {
      checkoutSubtotal.textContent = formatPrice(subtotal);
    }

    if (checkoutDiscount) {
      checkoutDiscount.textContent = `-${formatPrice(discount)}`;
    }

    if (checkoutDiscountRow) {
      checkoutDiscountRow.style.display =
        discount > 0 ? "flex" : "none";
    }

    if (checkoutShipping) {
      checkoutShipping.textContent =
        shipping === 0
          ? "FREE"
          : formatPrice(shipping);
    }

    if (checkoutTotal) {
      checkoutTotal.textContent = formatPrice(total);
    }

    if (deliveryDate) {
      deliveryDate.textContent = "3–7 business days";
    }

    return {
      subtotal,
      discount,
      shipping,
      total
    };
  };

  /* =========================================
     Validation Helpers
     ========================================= */

  const clearErrors = () => {
    const errors = [
      errorName,
      errorPhone,
      errorEmail,
      errorAddress,
      errorCity,
      errorState,
      errorPincode,
      errorPayment,
      errorTerms
    ];

    errors.forEach((element) => {
      if (element) {
        element.textContent = "";
      }
    });

    document
      .querySelectorAll(".error-field")
      .forEach((field) => {
        field.classList.remove("error-field");
      });
  };

  const setError = (input, errorElement, message) => {
    if (errorElement) {
      errorElement.textContent = message;
    }

    if (input) {
      input.classList.add("error-field");
    }

    return false;
  };

  const validateForm = () => {
    clearErrors();

    let valid = true;

    const name = customerName?.value.trim() || "";
    const phone = customerPhone?.value.replace(/\D/g, "") || "";
    const email = customerEmail?.value.trim() || "";
    const address = customerAddress?.value.trim() || "";
    const city = customerCity?.value.trim() || "";
    const state = customerState?.value || "";
    const pincode = customerPincode?.value.replace(/\D/g, "") || "";

    if (name.length < 2) {
      setError(
        customerName,
        errorName,
        "Please enter your full name."
      );
      valid = false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(
        customerPhone,
        errorPhone,
        "Enter a valid 10-digit mobile number."
      );
      valid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        customerEmail,
        errorEmail,
        "Enter a valid email address."
      );
      valid = false;
    }

    if (address.length < 5) {
      setError(
        customerAddress,
        errorAddress,
        "Please enter your complete address."
      );
      valid = false;
    }

    if (city.length < 2) {
      setError(
        customerCity,
        errorCity,
        "Please enter your city."
      );
      valid = false;
    }

    if (!state) {
      setError(
        customerState,
        errorState,
        "Please select your state."
      );
      valid = false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError(
        customerPincode,
        errorPincode,
        "Enter a valid 6-digit pincode."
      );
      valid = false;
    }

    const paymentMethod = getSelectedPaymentMethod();

    if (!paymentMethod) {
      if (errorPayment) {
        errorPayment.textContent =
          "Please select a payment method.";
      }

      valid = false;
    }

    if (!agreeTerms?.checked) {
      if (errorTerms) {
        errorTerms.textContent =
          "Please agree to the Terms & Conditions.";
      }

      valid = false;
    }

    return valid;
  };

  /* =========================================
     Generate Order ID
     ========================================= */

  const generateOrderId = () => {
    const now = new Date();

    const datePart =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const randomPart = Math.floor(
      100000 + Math.random() * 900000
    );

    return `GS${datePart}${randomPart}`;
  };

  /* =========================================
     Save Order
     ========================================= */

  const saveOrder = (cart, summary) => {
    const orderId = generateOrderId();

    const orderItems = cart.map((item) => {
      const product = getProduct(item);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: getQuantity(item),
        image: product.image
      };
    });

    const order = {
      id: orderId,

      createdAt: new Date().toISOString(),

      customer: {
        name: customerName.value.trim(),
        phone: customerPhone.value.replace(/\D/g, ""),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        city: customerCity.value.trim(),
        state: customerState.value,
        pincode: customerPincode.value.replace(/\D/g, "")
      },

      paymentMethod: getSelectedPaymentMethod(),

      items: orderItems,

      summary: {
        subtotal: summary.subtotal,
        discount: summary.discount,
        shipping: summary.shipping,
        total: summary.total
      },

      status: "Placed",

      estimatedDelivery: "3–7 business days"
    };

    let orders = [];

    try {
      const savedOrders = localStorage.getItem(ORDERS_KEY);
      orders = savedOrders ? JSON.parse(savedOrders) : [];

      if (!Array.isArray(orders)) {
        orders = [];
      }
    } catch (error) {
      orders = [];
    }

    orders.unshift(order);

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders)
    );

    localStorage.setItem(
      LAST_ORDER_KEY,
      JSON.stringify(order)
    );

    return order;
  };

  /* =========================================
     Place Order
     ========================================= */

  const handlePlaceOrder = () => {
    const cart = normalizeCart();

    if (!cart.length) {
      alert("Your cart is empty.");
      window.location.href = "shop.html";
      return;
    }

    if (!validateForm()) {
      const firstError = document.querySelector(".error-field");

      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      return;
    }

    const summary = updateSummary(cart);

    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.classList.add("loading");

      const originalText =
        placeOrderBtn.dataset.originalText ||
        placeOrderBtn.textContent.trim();

      placeOrderBtn.dataset.originalText = originalText;

      placeOrderBtn.innerHTML = `
        <span class="button-spinner"></span>
        Placing Order...
      `;
    }

    /*
      Small delay for a smooth checkout experience.
      No real payment gateway is connected yet.
    */

    setTimeout(() => {
      try {
        const order = saveOrder(cart, summary);

        saveCart([]);

        /*
          Make order data available to order-success.html
        */

        sessionStorage.setItem(
          "glowskin_current_order_id",
          order.id
        );

        window.location.href =
          `order-success.html?order=${encodeURIComponent(order.id)}`;

      } catch (error) {
        console.error("Order creation failed:", error);

        if (placeOrderBtn) {
          placeOrderBtn.disabled = false;
          placeOrderBtn.classList.remove("loading");

          placeOrderBtn.textContent =
            placeOrderBtn.dataset.originalText ||
            "Place Order";
        }

        alert(
          "Something went wrong while placing your order. Please try again."
        );
      }
    }, 700);
  };

  /* =========================================
     Input Formatting
     ========================================= */

  const setupInputFormatting = () => {
    if (customerPhone) {
      customerPhone.addEventListener("input", () => {
        customerPhone.value =
          customerPhone.value
            .replace(/\D/g, "")
            .slice(0, 10);
      });
    }

    if (customerPincode) {
      customerPincode.addEventListener("input", () => {
        customerPincode.value =
          customerPincode.value
            .replace(/\D/g, "")
            .slice(0, 6);
      });
    }
  };

  /* =========================================
     Remove Error While Typing
     ========================================= */

  const setupLiveValidation = () => {
    const fields = [
      [customerName, errorName],
      [customerPhone, errorPhone],
      [customerEmail, errorEmail],
      [customerAddress, errorAddress],
      [customerCity, errorCity],
      [customerState, errorState],
      [customerPincode, errorPincode]
    ];

    fields.forEach(([input, error]) => {
      if (!input) return;

      input.addEventListener("input", () => {
        input.classList.remove("error-field");

        if (error) {
          error.textContent = "";
        }
      });

      input.addEventListener("change", () => {
        input.classList.remove("error-field");

        if (error) {
          error.textContent = "";
        }
      });
    });

    document
      .querySelectorAll('input[name="paymentMethod"]')
      .forEach((radio) => {
        radio.addEventListener("change", () => {
          if (errorPayment) {
            errorPayment.textContent = "";
          }
        });
      });

    if (agreeTerms) {
      agreeTerms.addEventListener("change", () => {
        if (errorTerms) {
          errorTerms.textContent = "";
        }
      });
    }
  };

  /* =========================================
     Search Overlay
     ========================================= */

  const setupSearch = () => {
    const searchToggle = $("#searchToggle");
    const searchOverlay = $("#searchOverlay");
    const searchClose = $("#searchClose");
    const searchForm = $("#searchForm");
    const searchInput = $("#searchInput");

    const openSearch = () => {
      if (!searchOverlay) return;

      searchOverlay.classList.add("active");
      document.body.classList.add("search-open");

      setTimeout(() => {
        searchInput?.focus();
      }, 100);
    };

    const closeSearch = () => {
      if (!searchOverlay) return;

      searchOverlay.classList.remove("active");
      document.body.classList.remove("search-open");
    };

    searchToggle?.addEventListener("click", openSearch);
    searchClose?.addEventListener("click", closeSearch);

    searchOverlay?.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = searchInput?.value.trim();

      if (!query) return;

      window.location.href =
        `shop.html?search=${encodeURIComponent(query)}`;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    });
  };

  /* =========================================
     Mobile Menu
     ========================================= */

  const setupMobileMenu = () => {
    const menuToggle = $("#menuToggle");
    const mobileMenu = $("#mobileMenu");
    const mobileMenuClose = $("#mobileMenuClose");

    menuToggle?.addEventListener("click", () => {
      mobileMenu?.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    mobileMenuClose?.addEventListener("click", () => {
      mobileMenu?.classList.remove("active");
      document.body.classList.remove("menu-open");
    });

    mobileMenu?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  };

  /* =========================================
     Header Counts
     ========================================= */

  const updateHeaderCounts = () => {
    const cartCount = $("#cartCount");
    const wishlistCount = $("#wishlistCount");

    let cart = [];

    try {
      cart = getCart();
    } catch (error) {
      cart = [];
    }

    const totalCartQuantity = cart.reduce(
      (total, item) => total + getQuantity(item),
      0
    );

    if (cartCount) {
      cartCount.textContent = totalCartQuantity;
      cartCount.style.display =
        totalCartQuantity > 0 ? "flex" : "none";
    }

    try {
      const wishlist = JSON.parse(
        localStorage.getItem("glowskin_wishlist") || "[]"
      );

      if (wishlistCount) {
        wishlistCount.textContent =
          Array.isArray(wishlist) ? wishlist.length : 0;

        wishlistCount.style.display =
          Array.isArray(wishlist) && wishlist.length
            ? "flex"
            : "none";
      }
    } catch (error) {
      if (wishlistCount) {
        wishlistCount.style.display = "none";
      }
    }
  };

  /* =========================================
     Prevent Accidental Page Leave
     ========================================= */

  const setupFormProtection = () => {
    const form = document.querySelector(".checkout-form");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handlePlaceOrder();
    });
  };

  /* =========================================
     Initialize
     ========================================= */

  const init = () => {
    const cart = normalizeCart();

    /*
      Save normalized cart so older cart data
      also works with checkout.
    */

    if (cart.length) {
      saveCart(cart);
    }

    renderCheckoutItems(cart);
    updateSummary(cart);
    updateHeaderCounts();

    setupInputFormatting();
    setupLiveValidation();
    setupSearch();
    setupMobileMenu();
    setupFormProtection();

    placeOrderBtn?.addEventListener(
      "click",
      handlePlaceOrder
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
