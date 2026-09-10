/* =========================================================
   GLOWSKIN ADMIN — PAYMENTS
   File: assets/js/admin-payments.js
========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "glowskin_payments";

    /* =====================================================
       DEFAULT SETTINGS
    ===================================================== */

    const defaultSettings = {
        codPaymentEnabled: true,
        upiPaymentEnabled: true,
        cardPaymentEnabled: true,
        netBankingEnabled: true,
        walletPaymentEnabled: true,

        codCharge: 30,
        codMaximumAmount: 5000,

        minimumPaymentAmount: 0,
        maximumPaymentAmount: 0,

        paymentGateway: "none",
        paymentMode: "test",

        paymentNote:
            "Secure payment options are available at checkout."
    };


    /* =====================================================
       DOM HELPER
    ===================================================== */

    const $ = (id) => document.getElementById(id);


    const elements = {
        saveButton: $("savePaymentButton"),
        saveButtonBottom: $("savePaymentButtonBottom"),

        methodsCount: $("paymentMethodsCount"),
        upiDisplay: $("upiPaymentDisplay"),
        cardDisplay: $("cardPaymentDisplay"),
        codDisplay: $("codPaymentDisplay"),

        codEnabled: $("codPaymentEnabled"),
        upiEnabled: $("upiPaymentEnabled"),
        cardEnabled: $("cardPaymentEnabled"),
        netBankingEnabled: $("netBankingEnabled"),
        walletEnabled: $("walletPaymentEnabled"),

        codCharge: $("codCharge"),
        codMaximumAmount: $("codMaximumAmount"),

        minimumAmount: $("minimumPaymentAmount"),
        maximumAmount: $("maximumPaymentAmount"),

        gateway: $("paymentGateway"),
        mode: $("paymentMode"),

        paymentNote: $("paymentNote")
    };


    /* =====================================================
       STORAGE
    ===================================================== */

    function getSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultSettings)
                );

                return {
                    ...defaultSettings
                };
            }

            const parsed = JSON.parse(saved);

            if (
                !parsed ||
                typeof parsed !== "object" ||
                Array.isArray(parsed)
            ) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultSettings)
                );

                return {
                    ...defaultSettings
                };
            }

            return {
                ...defaultSettings,
                ...parsed
            };

        } catch (error) {
            console.error(
                "GlowSkin payment storage error:",
                error
            );

            return {
                ...defaultSettings
            };
        }
    }


    function saveSettings(settings) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

        window.dispatchEvent(
            new CustomEvent(
                "glowskinPaymentsUpdated",
                {
                    detail: settings
                }
            )
        );
    }


    /* =====================================================
       NUMBER HELPER
    ===================================================== */

    function getNumber(input, fallback = 0) {
        const value = Number(input?.value);

        if (!Number.isFinite(value)) {
            return fallback;
        }

        return Math.max(0, value);
    }


    /* =====================================================
       READ FORM
    ===================================================== */

    function readForm() {
        return {
            codPaymentEnabled:
                Boolean(elements.codEnabled?.checked),

            upiPaymentEnabled:
                Boolean(elements.upiEnabled?.checked),

            cardPaymentEnabled:
                Boolean(elements.cardEnabled?.checked),

            netBankingEnabled:
                Boolean(elements.netBankingEnabled?.checked),

            walletPaymentEnabled:
                Boolean(elements.walletEnabled?.checked),

            codCharge:
                getNumber(elements.codCharge),

            codMaximumAmount:
                getNumber(elements.codMaximumAmount),

            minimumPaymentAmount:
                getNumber(elements.minimumAmount),

            maximumPaymentAmount:
                getNumber(elements.maximumAmount),

            paymentGateway:
                elements.gateway?.value || "none",

            paymentMode:
                elements.mode?.value || "test",

            paymentNote:
                elements.paymentNote?.value.trim() ||
                ""
        };
    }


    /* =====================================================
       APPLY SETTINGS
    ===================================================== */

    function applySettings(settings) {
        if (!settings) {
            return;
        }

        if (elements.codEnabled) {
            elements.codEnabled.checked =
                settings.codPaymentEnabled !== false;
        }

        if (elements.upiEnabled) {
            elements.upiEnabled.checked =
                settings.upiPaymentEnabled !== false;
        }

        if (elements.cardEnabled) {
            elements.cardEnabled.checked =
                settings.cardPaymentEnabled !== false;
        }

        if (elements.netBankingEnabled) {
            elements.netBankingEnabled.checked =
                settings.netBankingEnabled !== false;
        }

        if (elements.walletEnabled) {
            elements.walletEnabled.checked =
                settings.walletPaymentEnabled !== false;
        }

        if (elements.codCharge) {
            elements.codCharge.value =
                settings.codCharge;
        }

        if (elements.codMaximumAmount) {
            elements.codMaximumAmount.value =
                settings.codMaximumAmount;
        }

        if (elements.minimumAmount) {
            elements.minimumAmount.value =
                settings.minimumPaymentAmount;
        }

        if (elements.maximumAmount) {
            elements.maximumAmount.value =
                settings.maximumPaymentAmount;
        }

        if (elements.gateway) {
            elements.gateway.value =
                settings.paymentGateway;
        }

        if (elements.mode) {
            elements.mode.value =
                settings.paymentMode;
        }

        if (elements.paymentNote) {
            elements.paymentNote.value =
                settings.paymentNote;
        }

        updateSummary(settings);
    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateSummary(settings) {

        const enabledMethods = [
            settings.codPaymentEnabled,
            settings.upiPaymentEnabled,
            settings.cardPaymentEnabled,
            settings.netBankingEnabled,
            settings.walletPaymentEnabled
        ].filter(Boolean).length;


        if (elements.methodsCount) {
            elements.methodsCount.textContent =
                enabledMethods;
        }


        if (elements.upiDisplay) {
            elements.upiDisplay.textContent =
                settings.upiPaymentEnabled
                    ? "Enabled"
                    : "Disabled";
        }


        if (elements.cardDisplay) {
            elements.cardDisplay.textContent =
                settings.cardPaymentEnabled
                    ? "Enabled"
                    : "Disabled";
        }


        if (elements.codDisplay) {
            elements.codDisplay.textContent =
                settings.codPaymentEnabled
                    ? "Enabled"
                    : "Disabled";
        }
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateSettings(settings) {

        /*
         * Minimum / Maximum payment validation
         */

        if (
            settings.maximumPaymentAmount > 0 &&
            settings.minimumPaymentAmount >
            settings.maximumPaymentAmount
        ) {
            window.glowSkinAdminToast?.(
                "Maximum payment amount must be greater than minimum payment amount."
            );

            elements.maximumAmount?.focus();

            return false;
        }


        /*
         * COD maximum validation
         */

        if (
            settings.codMaximumAmount > 0 &&
            settings.codMaximumAmount <
            settings.minimumPaymentAmount
        ) {
            window.glowSkinAdminToast?.(
                "COD maximum amount cannot be lower than the minimum payment amount."
            );

            elements.codMaximumAmount?.focus();

            return false;
        }


        /*
         * Gateway + Live Mode warning
         */

        if (
            settings.paymentMode === "live" &&
            settings.paymentGateway === "none"
        ) {
            window.glowSkinAdminToast?.(
                "Select a payment gateway before enabling Live Mode."
            );

            elements.gateway?.focus();

            return false;
        }


        /*
         * At least one payment method
         */

        const methodCount = [
            settings.codPaymentEnabled,
            settings.upiPaymentEnabled,
            settings.cardPaymentEnabled,
            settings.netBankingEnabled,
            settings.walletPaymentEnabled
        ].filter(Boolean).length;


        if (methodCount === 0) {
            window.glowSkinAdminToast?.(
                "Enable at least one payment method."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       SAVE PAYMENTS
    ===================================================== */

    function savePayments() {

        const settings = readForm();

        if (!validateSettings(settings)) {
            return;
        }

        saveSettings(settings);

        updateSummary(settings);

        window.glowSkinAdminToast?.(
            "Payment settings saved successfully."
        );
    }


    /* =====================================================
       LIVE SUMMARY UPDATE
    ===================================================== */

    function handleInputChange() {

        const settings = readForm();

        updateSummary(settings);
    }


    /* =====================================================
       SAVE BUTTON EVENTS
    ===================================================== */

    elements.saveButton?.addEventListener(
        "click",
        savePayments
    );

    elements.saveButtonBottom?.addEventListener(
        "click",
        savePayments
    );


    /* =====================================================
       FORM EVENTS
    ===================================================== */

    const formControls = [
        elements.codEnabled,
        elements.upiEnabled,
        elements.cardEnabled,
        elements.netBankingEnabled,
        elements.walletEnabled,

        elements.codCharge,
        elements.codMaximumAmount,

        elements.minimumAmount,
        elements.maximumAmount,

        elements.gateway,
        elements.mode,

        elements.paymentNote
    ];


    formControls.forEach((element) => {

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            handleInputChange
        );

        element.addEventListener(
            "change",
            handleInputChange
        );
    });


    /* =====================================================
       CUSTOM EVENT
    ===================================================== */

    window.addEventListener(
        "glowskinPaymentsUpdated",
        function (event) {

            if (
                event.detail &&
                typeof event.detail === "object"
            ) {
                applySettings(event.detail);
            }
        }
    );


    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key !== STORAGE_KEY) {
                return;
            }

            const settings = getSettings();

            applySettings(settings);
        }
    );


    /* =====================================================
       VISIBILITY REFRESH
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {
                return;
            }

            const settings = getSettings();

            applySettings(settings);
        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    const initialSettings = getSettings();

    applySettings(initialSettings);

})();
