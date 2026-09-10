/* =========================================================
   GlowSkin — Login / Register
   File: assets/js/login.js

   Frontend demo authentication using localStorage.
   NOTE: This is NOT real secure authentication.
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE KEYS
     ======================================================= */

  const USERS_KEY = "glowskin_users";
  const CURRENT_USER_KEY = "glowskin_current_user";
  const CART_KEY = "glowskin_cart";
  const WISHLIST_KEY = "glowskin_wishlist";


  /* =======================================================
     DOM HELPERS
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =======================================================
     STORAGE HELPERS
     ======================================================= */

  function getUsers() {
    try {
      const users = JSON.parse(
        localStorage.getItem(USERS_KEY)
      );

      return Array.isArray(users) ? users : [];
    } catch (error) {
      return [];
    }
  }


  function saveUsers(users) {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  }


  function getCurrentUser() {
    try {
      return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
      );
    } catch (error) {
      return null;
    }
  }


  function saveCurrentUser(user) {
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(safeUser)
    );
  }


  function removeCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  }


  /* =======================================================
     COMMON HELPERS
     ======================================================= */

  function normalizeEmail(email) {
    return email.trim().toLowerCase();
  }


  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
  }


  function generateUserId() {
    return (
      "USR" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    );
  }


  function showMessage(element, message, type = "info") {
    if (!element) return;

    element.textContent = message;

    element.className =
      "auth-message show " + type;
  }


  function clearMessage(element) {
    if (!element) return;

    element.textContent = "";

    element.className = "auth-message";
  }


  function setError(input, errorElement, message) {
    if (input) {
      input.classList.add("invalid");
      input.classList.remove("valid");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }
  }


  function setValid(input, errorElement) {
    if (input) {
      input.classList.remove("invalid");
      input.classList.add("valid");
    }

    if (errorElement) {
      errorElement.textContent = "";
    }
  }


  function clearFieldState(input, errorElement) {
    if (input) {
      input.classList.remove("invalid", "valid");
    }

    if (errorElement) {
      errorElement.textContent = "";
    }
  }


  function clearFormErrors(form) {
    if (!form) return;

    $$(".field-error", form).forEach(function (error) {
      error.textContent = "";
    });

    $$("input", form).forEach(function (input) {
      input.classList.remove("invalid", "valid");
    });
  }


  /* =======================================================
     COUNTS
     ======================================================= */

  function updateHeaderCounts() {
    let cart = [];
    let wishlist = [];

    try {
      cart = JSON.parse(
        localStorage.getItem(CART_KEY)
      ) || [];
    } catch (error) {
      cart = [];
    }

    try {
      wishlist = JSON.parse(
        localStorage.getItem(WISHLIST_KEY)
      ) || [];
    } catch (error) {
      wishlist = [];
    }

    const cartCount = $("#cartCount");
    const wishlistCount = $("#wishlistCount");

    const cartTotal = Array.isArray(cart)
      ? cart.reduce(function (sum, item) {
          return sum + Math.max(1, Number(item.quantity) || 1);
        }, 0)
      : 0;

    const wishlistTotal = Array.isArray(wishlist)
      ? wishlist.length
      : 0;

    if (cartCount) {
      cartCount.textContent = cartTotal;
      cartCount.hidden = cartTotal === 0;
    }

    if (wishlistCount) {
      wishlistCount.textContent = wishlistTotal;
      wishlistCount.hidden = wishlistTotal === 0;
    }
  }


  /* =======================================================
     AUTH TABS
     ======================================================= */

  const authTabs = $$(".auth-tab");
  const authForms = $$(".auth-form");

  function switchAuthTab(tabName) {
    authTabs.forEach(function (tab) {
      const active =
        tab.dataset.tab === tabName;

      tab.classList.toggle("active", active);
      tab.setAttribute(
        "aria-selected",
        active ? "true" : "false"
      );
    });

    authForms.forEach(function (form) {
      const active =
        form.dataset.form === tabName;

      form.classList.toggle("active", active);
    });

    const forgotPanel = $("#forgotPanel");

    if (forgotPanel) {
      forgotPanel.classList.remove("active");
    }

    clearAllMessages();
  }


  authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchAuthTab(tab.dataset.tab);
    });
  });


  /* =======================================================
     MESSAGES
     ======================================================= */

  const loginMessage = $("#loginMessage");
  const registerMessage = $("#registerMessage");
  const forgotMessage = $("#forgotMessage");

  function clearAllMessages() {
    clearMessage(loginMessage);
    clearMessage(registerMessage);
    clearMessage(forgotMessage);
  }


  /* =======================================================
     LOGIN ELEMENTS
     ======================================================= */

  const loginForm = $("#loginForm");
  const loginEmail = $("#loginEmail");
  const loginPassword = $("#loginPassword");
  const rememberMe = $("#rememberMe");

  const loginEmailError = $("#loginEmailError");
  const loginPasswordError = $("#loginPasswordError");


  /* =======================================================
     LOGIN VALIDATION
     ======================================================= */

  function validateLoginEmail() {
    const email =
      loginEmail.value.trim();

    if (!email) {
      setError(
        loginEmail,
        loginEmailError,
        "Please enter your email address."
      );

      return false;
    }

    if (!isValidEmail(email)) {
      setError(
        loginEmail,
        loginEmailError,
        "Please enter a valid email address."
      );

      return false;
    }

    setValid(loginEmail, loginEmailError);

    return true;
  }


  function validateLoginPassword() {
    const password =
      loginPassword.value;

    if (!password) {
      setError(
        loginPassword,
        loginPasswordError,
        "Please enter your password."
      );

      return false;
    }

    setValid(
      loginPassword,
      loginPasswordError
    );

    return true;
  }


  if (loginEmail) {
    loginEmail.addEventListener(
      "blur",
      validateLoginEmail
    );
  }


  if (loginPassword) {
    loginPassword.addEventListener(
      "blur",
      validateLoginPassword
    );
  }


  /* =======================================================
     LOGIN
     ======================================================= */

  if (loginForm) {
    loginForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        clearMessage(loginMessage);

        const emailValid =
          validateLoginEmail();

        const passwordValid =
          validateLoginPassword();

        if (!emailValid || !passwordValid) {
          showMessage(
            loginMessage,
            "Please correct the highlighted fields.",
            "error"
          );

          return;
        }

        const email =
          normalizeEmail(loginEmail.value);

        const password =
          loginPassword.value;

        const users = getUsers();

        const user = users.find(function (item) {
          return (
            normalizeEmail(item.email) === email &&
            item.password === password
          );
        });

        if (!user) {
          showMessage(
            loginMessage,
            "Incorrect email or password.",
            "error"
          );

          loginPassword.classList.add("invalid");

          return;
        }


        /* Save logged-in user */

        saveCurrentUser(user);


        /* Remember option */

        if (rememberMe && rememberMe.checked) {
          localStorage.setItem(
            "glowskin_remember_login",
            "true"
          );
        } else {
          localStorage.removeItem(
            "glowskin_remember_login"
          );
        }


        showMessage(
          loginMessage,
          "Login successful! Redirecting...",
          "success"
        );


        const submitButton =
          loginForm.querySelector(
            ".auth-submit"
          );

        if (submitButton) {
          submitButton.classList.add("loading");
          submitButton.disabled = true;
        }


        setTimeout(function () {
          window.location.href = "index.html";
        }, 900);
      }
    );
  }


  /* =======================================================
     REGISTER ELEMENTS
     ======================================================= */

  const registerForm = $("#registerForm");

  const registerName = $("#registerName");
  const registerEmail = $("#registerEmail");
  const registerPhone = $("#registerPhone");
  const registerPassword = $("#registerPassword");
  const registerConfirmPassword =
    $("#registerConfirmPassword");

  const registerTerms = $("#registerTerms");

  const registerNameError =
    $("#registerNameError");

  const registerEmailError =
    $("#registerEmailError");

  const registerPhoneError =
    $("#registerPhoneError");

  const registerPasswordError =
    $("#registerPasswordError");

  const registerConfirmPasswordError =
    $("#registerConfirmPasswordError");

  const registerTermsError =
    $("#registerTermsError");


  /* =======================================================
     REGISTER VALIDATION
     ======================================================= */

  function validateRegisterName() {
    const name =
      registerName.value.trim();

    if (!name) {
      setError(
        registerName,
        registerNameError,
        "Please enter your name."
      );

      return false;
    }

    if (name.length < 2) {
      setError(
        registerName,
        registerNameError,
        "Name must contain at least 2 characters."
      );

      return false;
    }

    setValid(
      registerName,
      registerNameError
    );

    return true;
  }


  function validateRegisterEmail() {
    const email =
      normalizeEmail(registerEmail.value);

    if (!email) {
      setError(
        registerEmail,
        registerEmailError,
        "Please enter your email address."
      );

      return false;
    }

    if (!isValidEmail(email)) {
      setError(
        registerEmail,
        registerEmailError,
        "Please enter a valid email address."
      );

      return false;
    }

    const users = getUsers();

    const exists = users.some(function (user) {
      return (
        normalizeEmail(user.email) === email
      );
    });

    if (exists) {
      setError(
        registerEmail,
        registerEmailError,
        "An account with this email already exists."
      );

      return false;
    }

    setValid(
      registerEmail,
      registerEmailError
    );

    return true;
  }


  function validateRegisterPhone() {
    const phone =
      registerPhone.value.trim();

    if (!phone) {
      setError(
        registerPhone,
        registerPhoneError,
        "Please enter your mobile number."
      );

      return false;
    }

    if (!isValidPhone(phone)) {
      setError(
        registerPhone,
        registerPhoneError,
        "Enter a valid 10-digit Indian mobile number."
      );

      return false;
    }

    setValid(
      registerPhone,
      registerPhoneError
    );

    return true;
  }


  function validateRegisterPassword() {
    const password =
      registerPassword.value;

    if (!password) {
      setError(
        registerPassword,
        registerPasswordError,
        "Please create a password."
      );

      return false;
    }

    if (password.length < 6) {
      setError(
        registerPassword,
        registerPasswordError,
        "Password must contain at least 6 characters."
      );

      return false;
    }

    setValid(
      registerPassword,
      registerPasswordError
    );

    return true;
  }


  function validateConfirmPassword() {
    const password =
      registerPassword.value;

    const confirm =
      registerConfirmPassword.value;

    if (!confirm) {
      setError(
        registerConfirmPassword,
        registerConfirmPasswordError,
        "Please confirm your password."
      );

      return false;
    }

    if (password !== confirm) {
      setError(
        registerConfirmPassword,
        registerConfirmPasswordError,
        "Passwords do not match."
      );

      return false;
    }

    setValid(
      registerConfirmPassword,
      registerConfirmPasswordError
    );

    return true;
  }


  function validateRegisterTerms() {
    if (!registerTerms.checked) {
      if (registerTermsError) {
        registerTermsError.textContent =
          "Please accept the terms to continue.";
      }

      return false;
    }

    if (registerTermsError) {
      registerTermsError.textContent = "";
    }

    return true;
  }


  /* =======================================================
     REGISTER FIELD EVENTS
     ======================================================= */

  if (registerName) {
    registerName.addEventListener(
      "blur",
      validateRegisterName
    );
  }


  if (registerEmail) {
    registerEmail.addEventListener(
      "blur",
      validateRegisterEmail
    );
  }


  if (registerPhone) {
    registerPhone.addEventListener(
      "input",
      function () {
        this.value =
          this.value
            .replace(/\D/g, "")
            .slice(0, 10);
      }
    );

    registerPhone.addEventListener(
      "blur",
      validateRegisterPhone
    );
  }


  if (registerPassword) {
    registerPassword.addEventListener(
      "blur",
      validateRegisterPassword
    );

    registerPassword.addEventListener(
      "input",
      function () {
        if (
          registerConfirmPassword &&
          registerConfirmPassword.value
        ) {
          validateConfirmPassword();
        }
      }
    );
  }


  if (registerConfirmPassword) {
    registerConfirmPassword.addEventListener(
      "blur",
      validateConfirmPassword
    );
  }


  if (registerTerms) {
    registerTerms.addEventListener(
      "change",
      validateRegisterTerms
    );
  }


  /* =======================================================
     REGISTER
     ======================================================= */

  if (registerForm) {
    registerForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        clearMessage(registerMessage);

        const validations = [
          validateRegisterName(),
          validateRegisterEmail(),
          validateRegisterPhone(),
          validateRegisterPassword(),
          validateConfirmPassword(),
          validateRegisterTerms()
        ];

        const isValid =
          validations.every(Boolean);

        if (!isValid) {
          showMessage(
            registerMessage,
            "Please correct the highlighted fields.",
            "error"
          );

          return;
        }


        const users = getUsers();

        const email =
          normalizeEmail(registerEmail.value);

        /* Double-check duplicate email */

        const alreadyExists =
          users.some(function (user) {
            return (
              normalizeEmail(user.email) === email
            );
          });

        if (alreadyExists) {
          setError(
            registerEmail,
            registerEmailError,
            "An account with this email already exists."
          );

          showMessage(
            registerMessage,
            "This email is already registered.",
            "error"
          );

          return;
        }


        /* Create user */

        const newUser = {
          id: generateUserId(),

          name:
            registerName.value.trim(),

          email: email,

          phone:
            registerPhone.value.trim(),

          password:
            registerPassword.value,

          createdAt:
            new Date().toISOString()
        };


        users.push(newUser);

        saveUsers(users);

        saveCurrentUser(newUser);


        showMessage(
          registerMessage,
          "Account created successfully! Redirecting...",
          "success"
        );


        const submitButton =
          registerForm.querySelector(
            ".auth-submit"
          );

        if (submitButton) {
          submitButton.classList.add("loading");
          submitButton.disabled = true;
        }


        setTimeout(function () {
          window.location.href = "index.html";
        }, 1000);
      }
    );
  }


  /* =======================================================
     PASSWORD SHOW / HIDE
     ======================================================= */

  const passwordToggles =
    $$(".password-toggle");

  passwordToggles.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const targetId =
          button.dataset.target;

        const input =
          document.getElementById(targetId);

        if (!input) return;


        const isPassword =
          input.type === "password";

        input.type =
          isPassword
            ? "text"
            : "password";


        button.setAttribute(
          "aria-label",
          isPassword
            ? "Hide password"
            : "Show password"
        );


        button.textContent =
          isPassword
            ? "🙈"
            : "👁";
      }
    );

  });


  /* =======================================================
     FORGOT PASSWORD
     ======================================================= */

  const forgotPasswordBtn =
    $("#forgotPasswordBtn");

  const forgotPanel =
    $("#forgotPanel");

  const forgotBack =
    $("#forgotBack");

  const forgotForm =
    $("#forgotForm");

  const forgotEmail =
    $("#forgotEmail");

  const forgotEmailError =
    $("#forgotEmailError");


  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener(
      "click",
      function () {

        authForms.forEach(function (form) {
          form.classList.remove("active");
        });

        authTabs.forEach(function (tab) {
          tab.classList.remove("active");
        });

        if (forgotPanel) {
          forgotPanel.classList.add("active");
        }

        clearAllMessages();

        if (forgotEmail) {
          forgotEmail.focus();
        }
      }
    );
  }


  if (forgotBack) {
    forgotBack.addEventListener(
      "click",
      function () {
        switchAuthTab("login");
      }
    );
  }


  if (forgotForm) {
    forgotForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        clearMessage(forgotMessage);

        const email =
          normalizeEmail(
            forgotEmail.value
          );


        if (!email) {
          setError(
            forgotEmail,
            forgotEmailError,
            "Please enter your email address."
          );

          return;
        }


        if (!isValidEmail(email)) {
          setError(
            forgotEmail,
            forgotEmailError,
            "Please enter a valid email address."
          );

          return;
        }


        setValid(
          forgotEmail,
          forgotEmailError
        );


        const users = getUsers();

        const exists =
          users.some(function (user) {
            return (
              normalizeEmail(user.email) === email
            );
          });


        /*
          This is only a frontend demo.
          No real reset email can be sent without
          a backend/email service.
        */

        if (exists) {

          showMessage(
            forgotMessage,
            "This frontend demo does not have email/password-reset functionality yet. A real reset system will be connected when the backend is added.",
            "info"
          );

        } else {

          showMessage(
            forgotMessage,
            "If an account exists for this email, a password reset would normally be sent by the backend.",
            "info"
          );

        }

      }
    );
  }


  /* =======================================================
     EMAIL LOWERCASE
     ======================================================= */

  [loginEmail, registerEmail, forgotEmail]
    .filter(Boolean)
    .forEach(function (input) {

      input.addEventListener(
        "blur",
        function () {
          this.value =
            this.value.trim().toLowerCase();
        }
      );

    });


  /* =======================================================
     CURRENT USER
     ======================================================= */

  function handleExistingLogin() {

    const currentUser =
      getCurrentUser();

    if (!currentUser) return;

    /*
      We don't automatically redirect.
      User can still open the login page.
    */

  }


  /* =======================================================
     MOBILE PHONE — REGISTER
     ======================================================= */

  if (registerPhone) {

    registerPhone.addEventListener(
      "keydown",
      function (event) {

        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Home",
          "End"
        ];

        if (
          allowedKeys.includes(event.key)
        ) {
          return;
        }

        if (
          !/^\d$/.test(event.key)
        ) {
          event.preventDefault();
        }

      }
    );

  }


  /* =======================================================
     SEARCH OVERLAY
     ======================================================= */

  const searchOverlay =
    $("#searchOverlay");

  const searchOpen =
    $("#searchOpen");

  const searchClose =
    $("#searchClose");

  const searchInput =
    $("#searchInput");

  const searchForm =
    $("#searchForm");


  function openSearch() {

    if (!searchOverlay) return;

    searchOverlay.classList.add("active");

    document.body.classList.add(
      "search-open"
    );

    setTimeout(function () {

      if (searchInput) {
        searchInput.focus();
      }

    }, 100);

  }


  function closeSearch() {

    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");

    document.body.classList.remove(
      "search-open"
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
    searchOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target === searchOverlay
        ) {
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

        const query =
          searchInput
            ? searchInput.value.trim()
            : "";

        if (!query) return;

        window.location.href =
          "shop.html?search=" +
          encodeURIComponent(query);

      }
    );
  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const mobileMenuToggle =
    $("#mobileMenuToggle");

  const mobileMenu =
    $("#mobileMenu");

  const mobileMenuClose =
    $("#mobileMenuClose");


  function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    document.body.classList.add(
      "menu-open"
    );

  }


  function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    document.body.classList.remove(
      "menu-open"
    );

  }


  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener(
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
      function (event) {

        if (
          event.target === mobileMenu
        ) {
          closeMobileMenu();
        }

      }
    );
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

      closeSearch();
      closeMobileMenu();

    }
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    updateHeaderCounts();

    handleExistingLogin();

    /*
      Default tab = Login
    */

    switchAuthTab("login");

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
