/* =========================================================
   GLOWSKIN ADMIN — SETTINGS
   File: assets/js/admin-settings.js
========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "glowskin_settings";

    const DEFAULT_SETTINGS = {
        storeName: "GlowSkin",
        storeEmail: "hello@glowskin.com",
        storePhone: "+91 83300 76133",
        storeWebsite: "",
        storeAddress: "Kerala, India",

        storeCurrency: "INR",
        storeLanguage: "English",
        storeTimezone: "Asia/Kolkata",

        orderPrefix: "GS",
        guestCheckoutEnabled: true,
        autoConfirmOrders: true,
        stockCheckEnabled: true,

        newOrderNotification: true,
        lowStockNotification: true,
        newCustomerNotification: true,
        newReviewNotification: true,

        storeLogo: "assets/images/logo/logo.png",
        storeFavicon: "assets/images/logo/favicon.png",
        storeAnnouncement: "✨ Free shipping on orders above ₹999"
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return { ...DEFAULT_SETTINGS };
            }

            const parsed = JSON.parse(saved);

            if (!parsed || typeof parsed !== "object") {
                return { ...DEFAULT_SETTINGS };
            }

            return {
                ...DEFAULT_SETTINGS,
                ...parsed
            };

        } catch (error) {
            console.error("GlowSkin settings load error:", error);

            return { ...DEFAULT_SETTINGS };
        }
    }


    function saveSettings(settings) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );

            return true;

        } catch (error) {
            console.error("GlowSkin settings save error:", error);

            return false;
        }
    }


    function cleanText(value) {
        return String(value || "").trim();
    }


    function setValue(id, value) {
        const element = getElement(id);

        if (!element) {
            return;
        }

        element.value = value ?? "";
    }


    function setChecked(id, value) {
        const element = getElement(id);

        if (!element) {
            return;
        }

        element.checked = Boolean(value);
    }


    function getValue(id) {
        const element = getElement(id);

        if (!element) {
            return "";
        }

        return cleanText(element.value);
    }


    function getChecked(id) {
        const element = getElement(id);

        return element ? Boolean(element.checked) : false;
    }


    /* =====================================================
       LOAD SETTINGS INTO FORM
    ===================================================== */

    function populateForm(settings) {

        /* Store Information */
        setValue("storeName", settings.storeName);
        setValue("storeEmail", settings.storeEmail);
        setValue("storePhone", settings.storePhone);
        setValue("storeWebsite", settings.storeWebsite);
        setValue("storeAddress", settings.storeAddress);


        /* Regional Settings */
        setValue("storeCurrency", settings.storeCurrency);
        setValue("storeLanguage", settings.storeLanguage);
        setValue("storeTimezone", settings.storeTimezone);


        /* Order Settings */
        setValue("orderPrefix", settings.orderPrefix);

        setChecked(
            "guestCheckoutEnabled",
            settings.guestCheckoutEnabled
        );

        setChecked(
            "autoConfirmOrders",
            settings.autoConfirmOrders
        );

        setChecked(
            "stockCheckEnabled",
            settings.stockCheckEnabled
        );


        /* Notifications */
        setChecked(
            "newOrderNotification",
            settings.newOrderNotification
        );

        setChecked(
            "lowStockNotification",
            settings.lowStockNotification
        );

        setChecked(
            "newCustomerNotification",
            settings.newCustomerNotification
        );

        setChecked(
            "newReviewNotification",
            settings.newReviewNotification
        );


        /* Store Appearance */
        setValue("storeLogo", settings.storeLogo);
        setValue("storeFavicon", settings.storeFavicon);
        setValue(
            "storeAnnouncement",
            settings.storeAnnouncement
        );
    }


    /* =====================================================
       READ FORM
    ===================================================== */

    function getFormSettings() {

        let orderPrefix = getValue("orderPrefix")
            .toUpperCase()
            .replace(/[^A-Z0-9_-]/g, "")
            .slice(0, 10);

        if (!orderPrefix) {
            orderPrefix = "GS";
        }


        return {

            /* Store Information */
            storeName: getValue("storeName"),
            storeEmail: getValue("storeEmail"),
            storePhone: getValue("storePhone"),
            storeWebsite: getValue("storeWebsite"),
            storeAddress: getValue("storeAddress"),


            /* Regional Settings */
            storeCurrency: getValue("storeCurrency") || "INR",
            storeLanguage: getValue("storeLanguage") || "English",
            storeTimezone:
                getValue("storeTimezone") || "Asia/Kolkata",


            /* Order Settings */
            orderPrefix: orderPrefix,

            guestCheckoutEnabled:
                getChecked("guestCheckoutEnabled"),

            autoConfirmOrders:
                getChecked("autoConfirmOrders"),

            stockCheckEnabled:
                getChecked("stockCheckEnabled"),


            /* Notifications */
            newOrderNotification:
                getChecked("newOrderNotification"),

            lowStockNotification:
                getChecked("lowStockNotification"),

            newCustomerNotification:
                getChecked("newCustomerNotification"),

            newReviewNotification:
                getChecked("newReviewNotification"),


            /* Store Appearance */
            storeLogo: getValue("storeLogo"),
            storeFavicon: getValue("storeFavicon"),
            storeAnnouncement:
                getValue("storeAnnouncement")
        };
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateSettings(settings) {

        if (!settings.storeName) {
            showToast(
                "Store name is required.",
                "error"
            );

            focusField("storeName");

            return false;
        }


        if (settings.storeEmail) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(settings.storeEmail)) {

                showToast(
                    "Please enter a valid store email.",
                    "error"
                );

                focusField("storeEmail");

                return false;
            }
        }


        if (settings.storePhone) {

            const phoneDigits =
                settings.storePhone.replace(/\D/g, "");

            if (
                phoneDigits.length < 7 ||
                phoneDigits.length > 15
            ) {

                showToast(
                    "Please enter a valid store phone number.",
                    "error"
                );

                focusField("storePhone");

                return false;
            }
        }


        if (!settings.orderPrefix) {

            showToast(
                "Order prefix is required.",
                "error"
            );

            focusField("orderPrefix");

            return false;
        }


        if (settings.storeWebsite) {

            let website = settings.storeWebsite;

            if (
                !website.startsWith("http://") &&
                !website.startsWith("https://")
            ) {
                website = "https://" + website;
            }

            try {
                new URL(website);
            } catch (error) {

                showToast(
                    "Please enter a valid website URL.",
                    "error"
                );

                focusField("storeWebsite");

                return false;
            }
        }


        return true;
    }


    function focusField(id) {

        const element = getElement(id);

        if (element) {
            element.focus();
        }
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type) {

        if (
            typeof window.glowSkinAdminToast === "function"
        ) {
            window.glowSkinAdminToast(message);

            return;
        }


        /* Fallback toast */

        let toast = document.getElementById(
            "settingsFallbackToast"
        );

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "settingsFallbackToast";

            toast.style.position = "fixed";
            toast.style.right = "20px";
            toast.style.bottom = "20px";
            toast.style.zIndex = "99999";
            toast.style.padding = "13px 17px";
            toast.style.borderRadius = "10px";
            toast.style.background = "#211914";
            toast.style.color = "#ffffff";
            toast.style.fontSize = "13px";
            toast.style.fontWeight = "600";
            toast.style.boxShadow =
                "0 8px 30px rgba(0,0,0,.18)";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        if (type === "error") {
            toast.style.background = "#c94b4b";
        } else {
            toast.style.background = "#211914";
        }

        clearTimeout(
            toast._hideTimer
        );

        toast._hideTimer = setTimeout(function () {
            toast.remove();
        }, 3000);
    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    function handleSave() {

        const settings = getFormSettings();

        if (!validateSettings(settings)) {
            return;
        }


        const saved = saveSettings(settings);

        if (!saved) {

            showToast(
                "Unable to save settings.",
                "error"
            );

            return;
        }


        /* Make settings available to other pages */
        window.glowSkinSettings = {
            ...settings
        };


        /* Notify other GlowSkin scripts */
        window.dispatchEvent(
            new CustomEvent(
                "glowskinSettingsUpdated",
                {
                    detail: {
                        ...settings
                    }
                }
            )
        );


        showToast(
            "Settings saved successfully."
        );
    }


    /* =====================================================
       RESET FORM FROM STORAGE
    ===================================================== */

    function refreshSettings() {

        const settings = loadSettings();

        populateForm(settings);

        window.glowSkinSettings = {
            ...settings
        };
    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    function setupSaveButtons() {

        const topButton =
            getElement("saveSettingsButton");

        const bottomButton =
            getElement("saveSettingsButtonBottom");


        if (topButton) {

            topButton.addEventListener(
                "click",
                handleSave
            );
        }


        if (bottomButton) {

            bottomButton.addEventListener(
                "click",
                handleSave
            );
        }
    }


    /* =====================================================
       INPUT CLEANUP
    ===================================================== */

    function setupInputEvents() {

        const orderPrefix =
            getElement("orderPrefix");

        if (orderPrefix) {

            orderPrefix.addEventListener(
                "input",
                function () {

                    this.value =
                        this.value
                            .toUpperCase()
                            .replace(
                                /[^A-Z0-9_-]/g,
                                ""
                            )
                            .slice(0, 10);
                }
            );
        }


        const storeWebsite =
            getElement("storeWebsite");

        if (storeWebsite) {

            storeWebsite.addEventListener(
                "blur",
                function () {

                    let value =
                        cleanText(this.value);

                    if (
                        value &&
                        !value.startsWith("http://") &&
                        !value.startsWith("https://")
                    ) {

                        this.value =
                            "https://" + value;
                    }
                }
            );
        }
    }


    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key !== STORAGE_KEY) {
                return;
            }

            refreshSettings();
        }
    );


    /* =====================================================
       VISIBILITY REFRESH
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState === "visible"
            ) {
                refreshSettings();
            }
        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        const settings = loadSettings();

        populateForm(settings);

        window.glowSkinSettings = {
            ...settings
        };

        setupSaveButtons();

        setupInputEvents();
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
