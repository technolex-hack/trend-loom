/* =========================================================
   GLOWSKIN ADMIN — SHIPPING
   File: assets/js/admin-shipping.js
========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "glowskin_shipping_settings";

    /* =====================================================
       DEFAULT SETTINGS
    ===================================================== */

    const defaultSettings = {
        standardShippingEnabled: true,
        standardShippingCharge: 49,
        freeShippingThreshold: 999,
        minimumOrderAmount: 0,
        maximumOrderAmount: 0,

        deliveryMinDays: 3,
        deliveryMaxDays: 7,
        deliveryMessage: "Delivered within 3–7 business days.",

        codEnabled: true,
        codCharge: 30,
        codMaximumAmount: 5000,

        shippingNote: "Free shipping is available on orders above ₹999."
    };


    /* =====================================================
       DOM HELPER
    ===================================================== */

    const $ = (id) => document.getElementById(id);


    const elements = {
        saveButton: $("saveShippingButton"),

        standardEnabled: $("standardShippingEnabled"),
        standardCharge: $("standardShippingCharge"),
        freeThreshold: $("freeShippingThreshold"),
        minimumOrder: $("minimumOrderAmount"),
        maximumOrder: $("maximumOrderAmount"),

        deliveryMinDays: $("deliveryMinDays"),
        deliveryMaxDays: $("deliveryMaxDays"),
        deliveryMessage: $("deliveryMessage"),

        codEnabled: $("codEnabled"),
        codCharge: $("codCharge"),
        codMaximumAmount: $("codMaximumAmount"),

        shippingNote: $("shippingNote"),

        standardDisplay: $("standardShippingDisplay"),
        freeDisplay: $("freeShippingDisplay"),
        codDisplay: $("codShippingDisplay"),
        deliveryDisplay: $("deliveryTimeDisplay")
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
                "GlowSkin shipping storage error:",
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
                "glowskinShippingUpdated",
                {
                    detail: settings
                }
            )
        );
    }


    /* =====================================================
       NUMBER HELPERS
    ===================================================== */

    function getNumber(input, fallback = 0) {
        const value = Number(input?.value);

        if (!Number.isFinite(value)) {
            return fallback;
        }

        return Math.max(0, value);
    }


    function formatINR(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "₹0";
        }

        return (
            "₹" +
            number.toLocaleString("en-IN", {
                maximumFractionDigits: 0
            })
        );
    }


    /* =====================================================
       READ FORM
    ===================================================== */

    function readForm() {
        return {
            standardShippingEnabled:
                Boolean(elements.standardEnabled?.checked),

            standardShippingCharge:
                getNumber(elements.standardCharge),

            freeShippingThreshold:
                getNumber(elements.freeThreshold),

            minimumOrderAmount:
                getNumber(elements.minimumOrder),

            maximumOrderAmount:
                getNumber(elements.maximumOrder),

            deliveryMinDays:
                Math.max(
                    1,
                    Math.floor(
                        getNumber(
                            elements.deliveryMinDays,
                            3
                        )
                    )
                ),

            deliveryMaxDays:
                Math.max(
                    1,
                    Math.floor(
                        getNumber(
                            elements.deliveryMaxDays,
                            7
                        )
                    )
                ),

            deliveryMessage:
                elements.deliveryMessage?.value.trim() ||
                "Delivered within 3–7 business days.",

            codEnabled:
                Boolean(elements.codEnabled?.checked),

            codCharge:
                getNumber(elements.codCharge),

            codMaximumAmount:
                getNumber(elements.codMaximumAmount),

            shippingNote:
                elements.shippingNote?.value.trim() ||
                ""
        };
    }


    /* =====================================================
       APPLY SETTINGS TO FORM
    ===================================================== */

    function applySettings(settings) {
        if (!settings) {
            return;
        }

        if (elements.standardEnabled) {
            elements.standardEnabled.checked =
                settings.standardShippingEnabled !== false;
        }

        if (elements.standardCharge) {
            elements.standardCharge.value =
                settings.standardShippingCharge;
        }

        if (elements.freeThreshold) {
            elements.freeThreshold.value =
                settings.freeShippingThreshold;
        }

        if (elements.minimumOrder) {
            elements.minimumOrder.value =
                settings.minimumOrderAmount;
        }

        if (elements.maximumOrder) {
            elements.maximumOrder.value =
                settings.maximumOrderAmount;
        }

        if (elements.deliveryMinDays) {
            elements.deliveryMinDays.value =
                settings.deliveryMinDays;
        }

        if (elements.deliveryMaxDays) {
            elements.deliveryMaxDays.value =
                settings.deliveryMaxDays;
        }

        if (elements.deliveryMessage) {
            elements.deliveryMessage.value =
                settings.deliveryMessage;
        }

        if (elements.codEnabled) {
            elements.codEnabled.checked =
                settings.codEnabled !== false;
        }

        if (elements.codCharge) {
            elements.codCharge.value =
                settings.codCharge;
        }

        if (elements.codMaximumAmount) {
            elements.codMaximumAmount.value =
                settings.codMaximumAmount;
        }

        if (elements.shippingNote) {
            elements.shippingNote.value =
                settings.shippingNote;
        }

        updateDisplays(settings);
    }


    /* =====================================================
       UPDATE SUMMARY CARDS
    ===================================================== */

    function updateDisplays(settings) {
        if (elements.standardDisplay) {
            elements.standardDisplay.textContent =
                settings.standardShippingEnabled
                    ? formatINR(settings.standardShippingCharge)
                    : "Disabled";
        }

        if (elements.freeDisplay) {
            const threshold =
                Number(settings.freeShippingThreshold) || 0;

            elements.freeDisplay.textContent =
                threshold > 0
                    ? formatINR(threshold)
                    : "Disabled";
        }

        if (elements.codDisplay) {
            elements.codDisplay.textContent =
                settings.codEnabled
                    ? formatINR(settings.codCharge)
                    : "Disabled";
        }

        if (elements.deliveryDisplay) {
            const min =
                Number(settings.deliveryMinDays) || 0;

            const max =
                Number(settings.deliveryMaxDays) || 0;

            if (min && max) {
                elements.deliveryDisplay.textContent =
                    `${min}–${max} Days`;
            } else if (min) {
                elements.deliveryDisplay.textContent =
                    `${min}+ Days`;
            } else {
                elements.deliveryDisplay.textContent =
                    "Not Set";
            }
        }
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateSettings(settings) {
        if (
            settings.deliveryMinDays >
            settings.deliveryMaxDays
        ) {
            window.glowSkinAdminToast?.(
                "Minimum delivery days cannot be greater than maximum delivery days."
            );

            elements.deliveryMinDays?.focus();

            return false;
        }


        if (
            settings.maximumOrderAmount > 0 &&
            settings.minimumOrderAmount >
            settings.maximumOrderAmount
        ) {
            window.glowSkinAdminToast?.(
                "Maximum order amount must be greater than minimum order amount."
            );

            elements.maximumOrder?.focus();

            return false;
        }


        if (
            settings.codMaximumAmount > 0 &&
            settings.codMaximumAmount <
            settings.minimumOrderAmount
        ) {
            window.glowSkinAdminToast?.(
                "COD maximum amount is below the minimum order amount."
            );

            elements.codMaximumAmount?.focus();

            return false;
        }


        return true;
    }


    /* =====================================================
       SAVE
    ===================================================== */

    function saveShipping() {
        const settings = readForm();

        if (!validateSettings(settings)) {
            return;
        }

        saveSettings(settings);

        updateDisplays(settings);

        window.glowSkinAdminToast?.(
            "Shipping settings saved successfully."
        );
    }


    /* =====================================================
       LIVE SUMMARY
    ===================================================== */

    function handleInputChange() {
        const settings = readForm();

        updateDisplays(settings);
    }


    /* =====================================================
       EVENTS
    ===================================================== */

    elements.saveButton?.addEventListener(
        "click",
        saveShipping
    );


    const formControls = [
        elements.standardEnabled,
        elements.standardCharge,
        elements.freeThreshold,
        elements.minimumOrder,
        elements.maximumOrder,
        elements.deliveryMinDays,
        elements.deliveryMaxDays,
        elements.deliveryMessage,
        elements.codEnabled,
        elements.codCharge,
        elements.codMaximumAmount,
        elements.shippingNote
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
       CUSTOM EVENT
    ===================================================== */

    window.addEventListener(
        "glowskinShippingUpdated",
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
