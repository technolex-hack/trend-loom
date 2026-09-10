/* =========================================================
   GLOWSKIN — CONTACT PAGE JAVASCRIPT
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =======================================================
     DOM READY
     ======================================================= */

  document.addEventListener("DOMContentLoaded", function () {

    initCounts();
    initSearch();
    initMobileMenu();
    initHeaderScroll();
    initContactForm();
    initMessageCounter();

  });


  /* =======================================================
     SAFE STORAGE
     ======================================================= */

  function getStorageArray(key) {

    try {

      const data = localStorage.getItem(key);

      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);

      return Array.isArray(parsed) ? parsed : [];

    } catch (error) {

      return [];

    }

  }


  /* =======================================================
     CART & WISHLIST COUNTS
     ======================================================= */

  function initCounts() {

    const cartCount =
      document.getElementById("cartCount");

    const wishlistCount =
      document.getElementById("wishlistCount");


    const cart =
      getStorageArray(CART_KEY);

    const wishlist =
      getStorageArray(WISHLIST_KEY);


    let totalCartItems = 0;


    cart.forEach(function (item) {

      if (
        typeof item === "object" &&
        item !== null
      ) {

        const quantity =
          Number(item.quantity) || 1;

        totalCartItems += Math.max(
          1,
          quantity
        );

      } else {

        totalCartItems += 1;

      }

    });


    if (cartCount) {

      cartCount.textContent =
        totalCartItems;

    }


    if (wishlistCount) {

      wishlistCount.textContent =
        wishlist.length;

    }

  }


  /* =======================================================
     SEARCH
     ======================================================= */

  function initSearch() {

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


    if (!searchOverlay) {
      return;
    }


    /* Open search */

    if (searchOpen) {

      searchOpen.addEventListener(
        "click",
        function () {

          searchOverlay.classList.add("active");

          searchOverlay.setAttribute(
            "aria-hidden",
            "false"
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
      );

    }


    /* Close search */

    if (searchClose) {

      searchClose.addEventListener(
        "click",
        closeSearch
      );

    }


    /* Search form */

    if (searchForm) {

      searchForm.addEventListener(
        "submit",
        function (event) {

          event.preventDefault();


          const query = searchInput
            ? searchInput.value.trim()
            : "";


          if (!query) {

            if (searchInput) {
              searchInput.focus();
            }

            return;

          }


          window.location.href =
            "shop.html?search=" +
            encodeURIComponent(query);

        }
      );

    }


    /* Click outside */

    searchOverlay.addEventListener(
      "click",
      function (event) {

        if (event.target === searchOverlay) {
          closeSearch();
        }

      }
    );


    function closeSearch() {

      searchOverlay.classList.remove(
        "active"
      );

      searchOverlay.setAttribute(
        "aria-hidden",
        "true"
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

    const mobileMenu =
      document.getElementById("mobileMenu");

    const mobileMenuOpen =
      document.getElementById("mobileMenuOpen");

    const mobileMenuClose =
      document.getElementById("mobileMenuClose");


    if (!mobileMenu) {
      return;
    }


    /* Open */

    if (mobileMenuOpen) {

      mobileMenuOpen.addEventListener(
        "click",
        function () {

          mobileMenu.classList.add(
            "active"
          );

          document.body.classList.add(
            "menu-open"
          );

        }
      );

    }


    /* Close */

    if (mobileMenuClose) {

      mobileMenuClose.addEventListener(
        "click",
        closeMenu
      );

    }


    /* Click outside */

    mobileMenu.addEventListener(
      "click",
      function (event) {

        if (event.target === mobileMenu) {
          closeMenu();
        }

      }
    );


    /* Close after clicking link */

    const links =
      mobileMenu.querySelectorAll("a");


    links.forEach(function (link) {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


    function closeMenu() {

      mobileMenu.classList.remove(
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

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key !== "Escape") {
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

        searchOverlay.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.classList.remove(
          "search-open"
        );

      }


      if (mobileMenu) {

        mobileMenu.classList.remove(
          "active"
        );

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );


  /* =======================================================
     HEADER SCROLL
     ======================================================= */

  function initHeaderScroll() {

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


    updateHeader();


    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );

  }


  /* =======================================================
     CONTACT FORM
     ======================================================= */

  function initContactForm() {

    const form =
      document.getElementById("contactForm");


    if (!form) {
      return;
    }


    const nameInput =
      document.getElementById("contactName");

    const emailInput =
      document.getElementById("contactEmail");

    const phoneInput =
      document.getElementById("contactPhone");

    const subjectInput =
      document.getElementById("contactSubject");

    const messageInput =
      document.getElementById("contactMessage");


    const submitButton =
      document.getElementById(
        "contactSubmitBtn"
      );


    const successBox =
      document.getElementById(
        "contactSuccess"
      );


    /* Remove error while typing */

    [
      nameInput,
      emailInput,
      phoneInput,
      subjectInput,
      messageInput
    ].forEach(function (input) {

      if (!input) {
        return;
      }


      input.addEventListener(
        "input",
        function () {

          clearFieldError(input);

        }
      );


      input.addEventListener(
        "change",
        function () {

          clearFieldError(input);

        }
      );

    });


    /* Phone only numbers */

    if (phoneInput) {

      phoneInput.addEventListener(
        "input",
        function () {

          phoneInput.value =
            phoneInput.value
              .replace(/\D/g, "")
              .slice(0, 10);

        }
      );

    }


    /* Submit */

    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const isValid =
          validateForm();


        if (!isValid) {
          return;
        }


        /* Loading state */

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.textContent =
            "Sending...";

        }


        /*
         * This is a frontend-only contact form.
         * No real email/backend service is connected yet.
         */

        setTimeout(function () {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
              "Send Message";

          }


          form.reset();


          updateMessageCounter();


          if (successBox) {

            successBox.hidden = false;

          }


          showToast(
            "Your message has been sent!"
          );


          if (successBox) {

            successBox.scrollIntoView({
              behavior: "smooth",
              block: "nearest"
            });

          }

        }, 700);

      }
    );


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateForm() {

      let valid = true;


      const name =
        nameInput
          ? nameInput.value.trim()
          : "";


      const email =
        emailInput
          ? emailInput.value.trim()
          : "";


      const phone =
        phoneInput
          ? phoneInput.value.trim()
          : "";


      const subject =
        subjectInput
          ? subjectInput.value
          : "";


      const message =
        messageInput
          ? messageInput.value.trim()
          : "";


      /* Name */

      if (name.length < 2) {

        setFieldError(
          nameInput,
          "Please enter your full name."
        );

        valid = false;

      }


      /* Email */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        setFieldError(
          emailInput,
          "Please enter a valid email address."
        );

        valid = false;

      }


      /* Phone */

      if (
        !/^[6-9]\d{9}$/.test(phone)
      ) {

        setFieldError(
          phoneInput,
          "Please enter a valid 10-digit mobile number."
        );

        valid = false;

      }


      /* Subject */

      if (!subject) {

        setFieldError(
          subjectInput,
          "Please select a subject."
        );

        valid = false;

      }


      /* Message */

      if (message.length < 10) {

        setFieldError(
          messageInput,
          "Please enter at least 10 characters."
        );

        valid = false;

      }


      return valid;

    }


    /* =====================================================
       SET ERROR
       ===================================================== */

    function setFieldError(
      input,
      message
    ) {

      if (!input) {
        return;
      }


      const group =
        input.closest(
          ".contact-form-group"
        );


      if (!group) {
        return;
      }


      group.classList.add(
        "has-error"
      );


      const error =
        group.querySelector(
          ".contact-error"
        );


      if (error) {

        error.textContent =
          message;

      }

    }


    /* =====================================================
       CLEAR ERROR
       ===================================================== */

    function clearFieldError(input) {

      if (!input) {
        return;
      }


      const group =
        input.closest(
          ".contact-form-group"
        );


      if (!group) {
        return;
      }


      group.classList.remove(
        "has-error"
      );


      const error =
        group.querySelector(
          ".contact-error"
        );


      if (error) {

        error.textContent = "";

      }

    }

  }


  /* =======================================================
     MESSAGE CHARACTER COUNTER
     ======================================================= */

  function initMessageCounter() {

    const messageInput =
      document.getElementById(
        "contactMessage"
      );

    const messageCount =
      document.getElementById(
        "messageCount"
      );


    if (!messageInput || !messageCount) {
      return;
    }


    function updateMessageCounter() {

      messageCount.textContent =
        messageInput.value.length;

    }


    messageInput.addEventListener(
      "input",
      updateMessageCounter
    );


    updateMessageCounter();

  }


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    const toast =
      document.getElementById(
        "contactToast"
      );

    const toastText =
      document.getElementById(
        "contactToastText"
      );


    if (!toast) {
      return;
    }


    if (toastText) {

      toastText.textContent =
        message;

    }


    toast.classList.add("show");


    clearTimeout(
      toast._hideTimer
    );


    toast._hideTimer =
      setTimeout(function () {

        toast.classList.remove(
          "show"
        );

      }, 3000);

  }

})();
