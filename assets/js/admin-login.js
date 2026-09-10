/* =========================================================
   GLOWSKIN ADMIN — LOGIN / SECURITY
   File: assets/js/admin-login.js
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const SESSION_KEY = "glowskin_admin_session";

    const ADMIN_EMAIL = "admin@glowskin.com";
    const ADMIN_PASSWORD = "admin123";


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type) {

        let toast =
            document.getElementById("adminLoginToast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "adminLoginToast";

            toast.style.position = "fixed";
            toast.style.left = "50%";
            toast.style.bottom = "24px";
            toast.style.transform = "translateX(-50%)";
            toast.style.zIndex = "99999";

            toast.style.padding = "12px 18px";
            toast.style.borderRadius = "10px";

            toast.style.color = "#ffffff";

            toast.style.fontFamily =
                '"DM Sans", Arial, sans-serif';

            toast.style.fontSize = "13px";
            toast.style.fontWeight = "700";

            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.18)";

            toast.style.transition =
                "opacity .2s ease";

            document.body.appendChild(toast);
        }


        toast.textContent = message;

        toast.style.background =
            type === "error"
                ? "#c94b4b"
                : "#2f8f5b";

        toast.style.opacity = "1";


        clearTimeout(toast._timer);

        toast._timer = setTimeout(function () {

            toast.style.opacity = "0";

        }, 3000);
    }


    /* =====================================================
       SESSION
    ===================================================== */

    function getSession() {

        try {

            const session =
                localStorage.getItem(SESSION_KEY);

            if (!session) {
                return null;
            }

            return JSON.parse(session);

        } catch (error) {

            console.error(
                "Admin session error:",
                error
            );

            return null;
        }
    }


    function createSession(remember) {

        const session = {
            authenticated: true,
            email: ADMIN_EMAIL,
            role: "admin",
            loginAt: new Date().toISOString(),
            remember: Boolean(remember)
        };


        try {

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            /*
             * Global helper for other admin pages.
             */
            window.glowSkinAdminSession = session;

            return true;

        } catch (error) {

            console.error(
                "Unable to create admin session:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       CHECK EXISTING SESSION
    ===================================================== */

    function checkExistingSession() {

        const session = getSession();

        if (
            session &&
            session.authenticated === true
        ) {

            /*
             * If already logged in, go directly
             * to the Admin Dashboard.
             */
            window.location.replace(
                "index.html"
            );

            return true;
        }

        return false;
    }


    /* =====================================================
       LOGIN FORM
    ===================================================== */

    function setupLoginForm() {

        const form =
            getElement("adminLoginForm");

        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailInput =
                    getElement("adminEmail");

                const passwordInput =
                    getElement("adminPassword");

                const rememberInput =
                    getElement("rememberAdmin");

                const loginButton =
                    getElement("adminLoginButton");


                const email =
                    String(
                        emailInput
                            ? emailInput.value
                            : ""
                    )
                    .trim()
                    .toLowerCase();


                const password =
                    String(
                        passwordInput
                            ? passwordInput.value
                            : ""
                    );


                const remember =
                    Boolean(
                        rememberInput &&
                        rememberInput.checked
                    );


                /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

                if (!email) {

                    showToast(
                        "Please enter your email address.",
                        "error"
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;
                }


                if (!isValidEmail(email)) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;
                }


                if (!password) {

                    showToast(
                        "Please enter your password.",
                        "error"
                    );

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                    return;
                }


                if (password.length < 6) {

                    showToast(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    if (passwordInput) {
                        passwordInput.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   LOADING STATE
                ----------------------------------------- */

                setLoadingState(
                    loginButton,
                    true
                );


                /*
                 * Small delay makes the demo feel
                 * like a real authentication request.
                 */
                setTimeout(function () {

                    const credentialsMatch =
                        email === ADMIN_EMAIL &&
                        password === ADMIN_PASSWORD;


                    if (!credentialsMatch) {

                        setLoadingState(
                            loginButton,
                            false
                        );

                        showToast(
                            "Invalid admin email or password.",
                            "error"
                        );

                        if (passwordInput) {
                            passwordInput.focus();
                            passwordInput.select();
                        }

                        return;
                    }


                    /* -------------------------------------
                       CREATE SESSION
                    ------------------------------------- */

                    const created =
                        createSession(remember);


                    if (!created) {

                        setLoadingState(
                            loginButton,
                            false
                        );

                        showToast(
                            "Unable to create admin session.",
                            "error"
                        );

                        return;
                    }


                    showToast(
                        "Login successful. Welcome to GlowSkin Admin."
                    );


                    /*
                     * Redirect to dashboard.
                     */
                    setTimeout(function () {

                        window.location.replace(
                            "index.html"
                        );

                    }, 650);

                }, 450);
            }
        );
    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );
    }


    /* =====================================================
       LOADING STATE
    ===================================================== */

    function setLoadingState(
        button,
        loading
    ) {

        if (!button) {
            return;
        }


        const text =
            button.querySelector(
                ".admin-login-button-text"
            );

        if (loading) {

            button.disabled = true;

            button.classList.add(
                "loading"
            );

            if (text) {
                text.textContent = "Signing In...";
            }

        } else {

            button.disabled = false;

            button.classList.remove(
                "loading"
            );

            if (text) {
                text.textContent = "Sign In";
            }
        }
    }


    /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

    function setupPasswordToggle() {

        const button =
            getElement("togglePassword");

        const password =
            getElement("adminPassword");


        if (!button || !password) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const isPassword =
                    password.type === "password";


                password.type =
                    isPassword
                        ? "text"
                        : "password";


                button.textContent =
                    isPassword
                        ? "🙈"
                        : "👁";


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );
            }
        );
    }


    /* =====================================================
       FORGOT PASSWORD MODAL
    ===================================================== */

    function setupForgotPassword() {

        const openButton =
            getElement("forgotPasswordButton");

        const modal =
            getElement("forgotPasswordModal");

        const closeButton =
            getElement("closeForgotModal");

        const overlay =
            modal
                ? modal.querySelector(
                    ".admin-modal-overlay"
                )
                : null;

        const form =
            getElement("forgotPasswordForm");

        const resetEmail =
            getElement("resetEmail");


        if (
            !openButton ||
            !modal
        ) {
            return;
        }


        function openModal() {

            modal.classList.add("open");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            const adminEmail =
                getElement("adminEmail");


            if (
                resetEmail &&
                adminEmail &&
                adminEmail.value.trim()
            ) {

                resetEmail.value =
                    adminEmail.value.trim();
            }


            if (resetEmail) {
                setTimeout(function () {
                    resetEmail.focus();
                }, 50);
            }
        }


        function closeModal() {

            modal.classList.remove("open");

            modal.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        openButton.addEventListener(
            "click",
            openModal
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeModal
            );
        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeModal
            );
        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    modal.classList.contains("open")
                ) {

                    closeModal();
                }
            }
        );


        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const email =
                        String(
                            resetEmail
                                ? resetEmail.value
                                : ""
                        )
                        .trim()
                        .toLowerCase();


                    if (!email) {

                        showToast(
                            "Please enter your admin email.",
                            "error"
                        );

                        if (resetEmail) {
                            resetEmail.focus();
                        }

                        return;
                    }


                    if (!isValidEmail(email)) {

                        showToast(
                            "Please enter a valid email address.",
                            "error"
                        );

                        if (resetEmail) {
                            resetEmail.focus();
                        }

                        return;
                    }


                    if (email !== ADMIN_EMAIL) {

                        showToast(
                            "This email is not registered as an admin.",
                            "error"
                        );

                        return;
                    }


                    closeModal();


                    showToast(
                        "Demo reset instructions: use admin123 as the password."
                    );
                }
            );
        }
    }


    /* =====================================================
       DEMO CREDENTIAL CLICK HELP
    ===================================================== */

    function setupDemoCredentials() {

        const demoBox =
            document.querySelector(
                ".admin-demo-box"
            );

        if (!demoBox) {
            return;
        }


        demoBox.addEventListener(
            "click",
            function () {

                const emailInput =
                    getElement("adminEmail");

                const passwordInput =
                    getElement("adminPassword");


                if (emailInput) {
                    emailInput.value =
                        ADMIN_EMAIL;
                }

                if (passwordInput) {
                    passwordInput.value =
                        ADMIN_PASSWORD;
                }


                if (emailInput) {
                    emailInput.focus();
                }
            }
        );


        demoBox.style.cursor = "pointer";
        demoBox.title =
            "Click to fill demo credentials";
    }


    /* =====================================================
       ENTER KEY / ESCAPE
    ===================================================== */

    function setupKeyboardHelpers() {

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * Ctrl/Cmd + Enter submits login form.
                 */
                if (
                    event.key === "Enter" &&
                    (event.ctrlKey || event.metaKey)
                ) {

                    const form =
                        getElement(
                            "adminLoginForm"
                        );

                    if (form) {
                        form.requestSubmit();
                    }
                }
            }
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        /*
         * Prevent the login page from appearing
         * when an admin is already authenticated.
         */
        if (checkExistingSession()) {
            return;
        }


        setupLoginForm();

        setupPasswordToggle();

        setupForgotPassword();

        setupDemoCredentials();

        setupKeyboardHelpers();
    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
