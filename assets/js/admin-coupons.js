/* =========================================================
   GlowSkin Admin — Coupons
   File: assets/js/admin-coupons.js
   ========================================================= */

(function () {
    "use strict";

    const COUPONS_KEY = "glowskin_coupons";

    const DEFAULT_COUPONS = [
        {
            id: "coupon-glow10",
            code: "GLOW10",
            name: "GlowSkin 10% Off",
            type: "percentage",
            value: 10,
            minOrder: 499,
            maxDiscount: 200,
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            usageLimit: 0,
            usedCount: 0,
            status: "active"
        },
        {
            id: "coupon-welcome100",
            code: "WELCOME100",
            name: "Welcome Offer",
            type: "fixed",
            value: 100,
            minOrder: 799,
            maxDiscount: 0,
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            usageLimit: 100,
            usedCount: 24,
            status: "active"
        },
        {
            id: "coupon-summer20",
            code: "SUMMER20",
            name: "Summer Glow Sale",
            type: "percentage",
            value: 20,
            minOrder: 999,
            maxDiscount: 300,
            startDate: "2026-04-01",
            endDate: "2026-06-30",
            usageLimit: 500,
            usedCount: 500,
            status: "active"
        }
    ];


    /* =========================
       DOM ELEMENTS
       ========================= */

    const addCouponButton =
        document.getElementById("addCouponButton");

    const searchInput =
        document.getElementById("couponSearch");

    const typeFilter =
        document.getElementById("couponTypeFilter");

    const statusFilter =
        document.getElementById("couponStatusFilter");

    const clearFiltersButton =
        document.getElementById("clearCouponFilters");

    const resultCount =
        document.getElementById("couponResultCount");

    const tableBody =
        document.getElementById("couponsTableBody");

    const emptyState =
        document.getElementById("couponsEmptyState");


    /* Stats */

    const totalCount =
        document.getElementById("couponsTotalCount");

    const activeCount =
        document.getElementById("couponsActiveCount");

    const expiredCount =
        document.getElementById("couponsExpiredCount");

    const totalUses =
        document.getElementById("couponsTotalUses");


    /* Coupon modal */

    const couponModal =
        document.getElementById("couponModal");

    const couponModalTitle =
        document.getElementById("couponModalTitle");

    const couponModalClose =
        document.getElementById("couponModalClose");

    const couponId =
        document.getElementById("couponId");

    const couponCode =
        document.getElementById("couponCode");

    const couponName =
        document.getElementById("couponName");

    const couponType =
        document.getElementById("couponType");

    const couponValue =
        document.getElementById("couponValue");

    const couponMinOrder =
        document.getElementById("couponMinOrder");

    const maxDiscountGroup =
        document.getElementById("maxDiscountGroup");

    const couponMaxDiscount =
        document.getElementById("couponMaxDiscount");

    const couponStartDate =
        document.getElementById("couponStartDate");

    const couponEndDate =
        document.getElementById("couponEndDate");

    const couponUsageLimit =
        document.getElementById("couponUsageLimit");

    const couponStatus =
        document.getElementById("couponStatus");

    const cancelCouponButton =
        document.getElementById("cancelCouponButton");

    const saveCouponButton =
        document.getElementById("saveCouponButton");


    /* Delete modal */

    const deleteCouponModal =
        document.getElementById("deleteCouponModal");

    const deleteCouponClose =
        document.getElementById("deleteCouponClose");

    const deleteCouponName =
        document.getElementById("deleteCouponName");

    const cancelDeleteCoupon =
        document.getElementById("cancelDeleteCoupon");

    const confirmDeleteCoupon =
        document.getElementById("confirmDeleteCoupon");


    let coupons = [];
    let couponToDelete = null;


    /* =========================
       HELPERS
       ========================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatINR(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }


    function formatDate(dateString) {

        if (!dateString) {
            return "—";
        }

        const date =
            new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function getTodayString() {

        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function getCouponDateStatus(coupon) {

        const today = getTodayString();

        if (
            coupon.endDate &&
            coupon.endDate < today
        ) {
            return "expired";
        }

        return coupon.status === "active"
            ? "active"
            : "inactive";
    }


    function getCouponStatusLabel(coupon) {

        const status =
            getCouponDateStatus(coupon);

        if (status === "expired") {
            return "Expired";
        }

        if (status === "inactive") {
            return "Inactive";
        }

        return "Active";
    }


    function showToast(message) {

        if (
            typeof window.glowSkinAdminToast ===
            "function"
        ) {
            window.glowSkinAdminToast(message);
        } else {
            console.log(message);
        }
    }


    /* =========================
       STORAGE
       ========================= */

    function loadCoupons() {

        try {

            const stored =
                localStorage.getItem(COUPONS_KEY);

            if (!stored) {

                coupons =
                    DEFAULT_COUPONS.map(function (coupon) {
                        return { ...coupon };
                    });

                saveCoupons(false);

                return;
            }


            const parsed =
                JSON.parse(stored);


            if (Array.isArray(parsed)) {

                coupons =
                    parsed.map(function (coupon) {

                        return {
                            ...coupon,
                            code:
                                String(coupon.code || "")
                                    .toUpperCase(),
                            value:
                                Number(coupon.value) || 0,
                            minOrder:
                                Number(coupon.minOrder) || 0,
                            maxDiscount:
                                Number(coupon.maxDiscount) || 0,
                            usageLimit:
                                Number(coupon.usageLimit) || 0,
                            usedCount:
                                Number(coupon.usedCount) || 0
                        };

                    });

            } else {

                coupons =
                    DEFAULT_COUPONS.map(function (coupon) {
                        return { ...coupon };
                    });

                saveCoupons(false);
            }

        } catch (error) {

            console.error(
                "GlowSkin Coupons: Unable to load coupons.",
                error
            );

            coupons =
                DEFAULT_COUPONS.map(function (coupon) {
                    return { ...coupon };
                });
        }
    }


    function saveCoupons(showMessage) {

        try {

            localStorage.setItem(
                COUPONS_KEY,
                JSON.stringify(coupons)
            );


            window.dispatchEvent(
                new CustomEvent(
                    "glowskinCouponsUpdated"
                )
            );


            if (showMessage) {
                showToast(
                    "Coupon saved successfully."
                );
            }

        } catch (error) {

            console.error(
                "GlowSkin Coupons: Unable to save coupons.",
                error
            );

            showToast(
                "Unable to save coupon."
            );
        }
    }


    /* =========================
       FILTERING
       ========================= */

    function getFilteredCoupons() {

        const search =
            String(searchInput?.value || "")
                .trim()
                .toLowerCase();

        const type =
            typeFilter?.value || "all";

        const status =
            statusFilter?.value || "all";


        return coupons.filter(function (coupon) {

            const code =
                String(coupon.code || "")
                    .toLowerCase();

            const name =
                String(coupon.name || "")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                code.includes(search) ||
                name.includes(search);


            const matchesType =
                type === "all" ||
                coupon.type === type;


            const actualStatus =
                getCouponDateStatus(coupon);


            const matchesStatus =
                status === "all" ||
                actualStatus === status;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );
        });
    }


    /* =========================
       STATS
       ========================= */

    function updateStats() {

        const today =
            getTodayString();


        const active =
            coupons.filter(function (coupon) {

                return (
                    coupon.status === "active" &&
                    (!coupon.endDate ||
                        coupon.endDate >= today)
                );

            }).length;


        const expired =
            coupons.filter(function (coupon) {

                return (
                    coupon.endDate &&
                    coupon.endDate < today
                );

            }).length;


        const uses =
            coupons.reduce(function (total, coupon) {

                return total +
                    (Number(coupon.usedCount) || 0);

            }, 0);


        if (totalCount) {
            totalCount.textContent =
                coupons.length;
        }

        if (activeCount) {
            activeCount.textContent =
                active;
        }

        if (expiredCount) {
            expiredCount.textContent =
                expired;
        }

        if (totalUses) {
            totalUses.textContent =
                uses;
        }


        if (
            typeof window.updateAdminCounts ===
            "function"
        ) {
            window.updateAdminCounts();
        }
    }


    /* =========================
       DISCOUNT TEXT
       ========================= */

    function getDiscountText(coupon) {

        if (coupon.type === "percentage") {
            return `${Number(coupon.value) || 0}%`;
        }

        return formatINR(coupon.value);
    }


    function getDiscountTypeText(coupon) {

        if (coupon.type === "percentage") {
            return "Percentage discount";
        }

        return "Fixed discount";
    }


    /* =========================
       USAGE
       ========================= */

    function getUsageText(coupon) {

        const used =
            Math.max(
                0,
                Number(coupon.usedCount) || 0
            );

        const limit =
            Math.max(
                0,
                Number(coupon.usageLimit) || 0
            );


        if (limit === 0) {
            return `${used} / Unlimited`;
        }

        return `${used} / ${limit}`;
    }


    function getUsagePercent(coupon) {

        const used =
            Math.max(
                0,
                Number(coupon.usedCount) || 0
            );

        const limit =
            Number(coupon.usageLimit) || 0;


        if (limit <= 0) {
            return 0;
        }


        return Math.min(
            100,
            Math.max(
                0,
                (used / limit) * 100
            )
        );
    }


    /* =========================
       RENDER
       ========================= */

    function renderCoupons() {

        if (!tableBody) {
            return;
        }


        const filtered =
            getFilteredCoupons();


        if (resultCount) {

            resultCount.textContent =
                filtered.length +
                (
                    filtered.length === 1
                        ? " coupon"
                        : " coupons"
                );
        }


        if (!filtered.length) {

            tableBody.innerHTML = "";

            if (emptyState) {
                emptyState.classList.add("show");
            }

            return;
        }


        if (emptyState) {
            emptyState.classList.remove("show");
        }


        tableBody.innerHTML =
            filtered.map(function (coupon) {

                const status =
                    getCouponDateStatus(coupon);

                const statusLabel =
                    getCouponStatusLabel(coupon);

                const usagePercent =
                    getUsagePercent(coupon);


                return `
                    <tr
                        data-coupon-id="${escapeHTML(
                            coupon.id
                        )}"
                    >

                        <!-- COUPON -->

                        <td>

                            <div class="coupon-cell">

                                <span class="coupon-code">
                                    ${escapeHTML(
                                        coupon.code
                                    )}
                                </span>

                                <span class="coupon-name">
                                    ${escapeHTML(
                                        coupon.name
                                    )}
                                </span>

                            </div>

                        </td>


                        <!-- DISCOUNT -->

                        <td>

                            <div class="coupon-discount">
                                ${escapeHTML(
                                    getDiscountText(coupon)
                                )}
                            </div>

                            <span class="coupon-discount-type">
                                ${escapeHTML(
                                    getDiscountTypeText(coupon)
                                )}
                            </span>

                        </td>


                        <!-- MIN ORDER -->

                        <td>

                            <span class="coupon-min-order">
                                ${
                                    Number(coupon.minOrder) > 0
                                        ? formatINR(
                                            coupon.minOrder
                                        )
                                        : "No minimum"
                                }
                            </span>

                        </td>


                        <!-- VALIDITY -->

                        <td>

                            <div class="coupon-validity">

                                <span class="coupon-date">
                                    <span class="coupon-date-label">
                                        From:
                                    </span>
                                    ${escapeHTML(
                                        formatDate(
                                            coupon.startDate
                                        )
                                    )}
                                </span>

                                <span class="coupon-date">
                                    <span class="coupon-date-label">
                                        To:
                                    </span>
                                    ${escapeHTML(
                                        formatDate(
                                            coupon.endDate
                                        )
                                    )}
                                </span>

                            </div>

                        </td>


                        <!-- USAGE -->

                        <td>

                            <div class="coupon-usage">

                                <span class="coupon-usage-number">
                                    ${escapeHTML(
                                        getUsageText(coupon)
                                    )}
                                </span>

                                <div class="coupon-usage-bar">

                                    <span
                                        style="
                                            width:${usagePercent}%;
                                        "
                                    ></span>

                                </div>

                            </div>

                        </td>


                        <!-- STATUS -->

                        <td>

                            <span
                                class="
                                    coupon-status-badge
                                    ${escapeHTML(status)}
                                "
                            >
                                ${escapeHTML(statusLabel)}
                            </span>

                        </td>


                        <!-- ACTIONS -->

                        <td>

                            <div class="coupon-actions">

                                <button
                                    type="button"
                                    class="
                                        coupon-action-button
                                        edit
                                    "
                                    data-edit-coupon="${escapeHTML(
                                        coupon.id
                                    )}"
                                    title="Edit coupon"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="
                                        coupon-action-button
                                        toggle
                                    "
                                    data-toggle-coupon="${escapeHTML(
                                        coupon.id
                                    )}"
                                    title="Toggle status"
                                >
                                    ${
                                        coupon.status === "active"
                                            ? "Disable"
                                            : "Enable"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="
                                        coupon-action-button
                                        delete
                                    "
                                    data-delete-coupon="${escapeHTML(
                                        coupon.id
                                    )}"
                                    title="Delete coupon"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    /* =========================
       MODAL HELPERS
       ========================= */

    function openCouponModal(coupon) {

        if (!couponModal) {
            return;
        }


        if (coupon) {

            couponModalTitle.textContent =
                "Edit Coupon";

            couponId.value =
                coupon.id || "";

            couponCode.value =
                coupon.code || "";

            couponName.value =
                coupon.name || "";

            couponType.value =
                coupon.type || "percentage";

            couponValue.value =
                Number(coupon.value) || 0;

            couponMinOrder.value =
                Number(coupon.minOrder) || 0;

            couponMaxDiscount.value =
                Number(coupon.maxDiscount) || 0;

            couponStartDate.value =
                coupon.startDate || "";

            couponEndDate.value =
                coupon.endDate || "";

            couponUsageLimit.value =
                Number(coupon.usageLimit) || 0;

            couponStatus.value =
                coupon.status || "active";

        } else {

            couponModalTitle.textContent =
                "Add Coupon";

            couponId.value = "";

            couponCode.value = "";

            couponName.value = "";

            couponType.value =
                "percentage";

            couponValue.value = "";

            couponMinOrder.value = "";

            couponMaxDiscount.value = "";

            couponStartDate.value =
                getTodayString();

            couponEndDate.value = "";

            couponUsageLimit.value = "0";

            couponStatus.value =
                "active";
        }


        updateMaxDiscountVisibility();


        couponModal.classList.add("active");

        couponModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "admin-modal-open"
        );


        setTimeout(function () {

            if (couponCode) {
                couponCode.focus();
            }

        }, 100);
    }


    function closeCouponModal() {

        if (!couponModal) {
            return;
        }


        couponModal.classList.remove("active");

        couponModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "admin-modal-open"
        );
    }


    /* =========================
       MAX DISCOUNT VISIBILITY
       ========================= */

    function updateMaxDiscountVisibility() {

        if (!maxDiscountGroup || !couponType) {
            return;
        }


        if (
            couponType.value ===
            "percentage"
        ) {

            maxDiscountGroup.style.display =
                "";

        } else {

            maxDiscountGroup.style.display =
                "none";

            if (couponMaxDiscount) {
                couponMaxDiscount.value = "0";
            }
        }
    }


    /* =========================
       VALIDATION
       ========================= */

    function validateCoupon() {

        const code =
            String(couponCode.value || "")
                .trim()
                .toUpperCase();

        const name =
            String(couponName.value || "")
                .trim();

        const type =
            couponType.value;

        const value =
            Number(couponValue.value);

        const minOrder =
            Number(couponMinOrder.value) || 0;

        const maxDiscount =
            Number(couponMaxDiscount.value) || 0;

        const startDate =
            couponStartDate.value;

        const endDate =
            couponEndDate.value;

        const usageLimit =
            Number(couponUsageLimit.value) || 0;


        if (!code) {
            showToast(
                "Please enter a coupon code."
            );
            couponCode.focus();
            return null;
        }


        if (!/^[A-Z0-9_-]+$/.test(code)) {
            showToast(
                "Coupon code can use letters, numbers, _ or - only."
            );
            couponCode.focus();
            return null;
        }


        if (!name) {
            showToast(
                "Please enter a coupon name."
            );
            couponName.focus();
            return null;
        }


        if (
            !Number.isFinite(value) ||
            value <= 0
        ) {
            showToast(
                "Please enter a valid discount value."
            );
            couponValue.focus();
            return null;
        }


        if (
            type === "percentage" &&
            value > 100
        ) {
            showToast(
                "Percentage discount cannot exceed 100%."
            );
            couponValue.focus();
            return null;
        }


        if (minOrder < 0) {
            showToast(
                "Minimum order cannot be negative."
            );
            couponMinOrder.focus();
            return null;
        }


        if (
            type === "percentage" &&
            maxDiscount < 0
        ) {
            showToast(
                "Maximum discount cannot be negative."
            );
            couponMaxDiscount.focus();
            return null;
        }


        if (
            startDate &&
            endDate &&
            endDate < startDate
        ) {
            showToast(
                "End date cannot be before start date."
            );
            couponEndDate.focus();
            return null;
        }


        if (usageLimit < 0) {
            showToast(
                "Usage limit cannot be negative."
            );
            couponUsageLimit.focus();
            return null;
        }


        const editingId =
            couponId.value;


        const duplicate =
            coupons.find(function (coupon) {

                return (
                    coupon.id !== editingId &&
                    String(coupon.code || "")
                        .toUpperCase() === code
                );

            });


        if (duplicate) {
            showToast(
                "This coupon code already exists."
            );
            couponCode.focus();
            return null;
        }


        return {
            code: code,
            name: name,
            type: type,
            value: Math.floor(value),
            minOrder: Math.floor(minOrder),
            maxDiscount:
                type === "percentage"
                    ? Math.floor(maxDiscount)
                    : 0,
            startDate: startDate || "",
            endDate: endDate || "",
            usageLimit:
                Math.floor(usageLimit),
            status:
                couponStatus.value === "inactive"
                    ? "inactive"
                    : "active"
        };
    }


    /* =========================
       SAVE COUPON
       ========================= */

    function saveCoupon() {

        const data =
            validateCoupon();


        if (!data) {
            return;
        }


        const editingId =
            couponId.value;


        if (editingId) {

            const index =
                coupons.findIndex(function (coupon) {
                    return coupon.id === editingId;
                });


            if (index === -1) {
                showToast(
                    "Coupon not found."
                );
                return;
            }


            const oldCoupon =
                coupons[index];


            coupons[index] = {
                ...oldCoupon,
                ...data
            };


            saveCoupons(false);

            closeCouponModal();

            updateStats();
            renderCoupons();

            showToast(
                "Coupon updated successfully."
            );

        } else {

            const newCoupon = {
                id:
                    "coupon-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2, 7),

                ...data,

                usedCount: 0
            };


            coupons.unshift(newCoupon);

            saveCoupons(false);

            closeCouponModal();

            updateStats();
            renderCoupons();

            showToast(
                "Coupon created successfully."
            );
        }
    }


    /* =========================
       TOGGLE COUPON
       ========================= */

    function toggleCoupon(id) {

        const coupon =
            coupons.find(function (item) {
                return item.id === id;
            });


        if (!coupon) {
            return;
        }


        const dateStatus =
            getCouponDateStatus(coupon);


        if (dateStatus === "expired") {

            showToast(
                "Expired coupons cannot be activated. Edit the end date first."
            );

            return;
        }


        coupon.status =
            coupon.status === "active"
                ? "inactive"
                : "active";


        saveCoupons(false);

        updateStats();
        renderCoupons();


        showToast(
            coupon.status === "active"
                ? "Coupon enabled."
                : "Coupon disabled."
        );
    }


    /* =========================
       DELETE MODAL
       ========================= */

    function openDeleteModal(coupon) {

        if (!deleteCouponModal || !coupon) {
            return;
        }


        couponToDelete =
            coupon;


        if (deleteCouponName) {
            deleteCouponName.textContent =
                coupon.code || "this coupon";
        }


        deleteCouponModal.classList.add(
            "active"
        );

        deleteCouponModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "admin-modal-open"
        );
    }


    function closeDeleteModal() {

        if (!deleteCouponModal) {
            return;
        }


        deleteCouponModal.classList.remove(
            "active"
        );

        deleteCouponModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "admin-modal-open"
        );

        couponToDelete = null;
    }


    function deleteCoupon() {

        if (!couponToDelete) {
            return;
        }


        const id =
            couponToDelete.id;


        const index =
            coupons.findIndex(function (coupon) {
                return coupon.id === id;
            });


        if (index === -1) {
            closeDeleteModal();
            return;
        }


        const deletedCode =
            coupons[index].code;


        coupons.splice(index, 1);

        saveCoupons(false);

        closeDeleteModal();

        updateStats();
        renderCoupons();


        showToast(
            deletedCode +
            " deleted successfully."
        );
    }


    /* =========================
       TABLE EVENTS
       ========================= */

    function handleTableClick(event) {

        const editButton =
            event.target.closest(
                "[data-edit-coupon]"
            );


        if (editButton) {

            const id =
                editButton.getAttribute(
                    "data-edit-coupon"
                );


            const coupon =
                coupons.find(function (item) {
                    return item.id === id;
                });


            if (coupon) {
                openCouponModal(coupon);
            }

            return;
        }


        const toggleButton =
            event.target.closest(
                "[data-toggle-coupon]"
            );


        if (toggleButton) {

            const id =
                toggleButton.getAttribute(
                    "data-toggle-coupon"
                );

            toggleCoupon(id);

            return;
        }


        const deleteButton =
            event.target.closest(
                "[data-delete-coupon]"
            );


        if (deleteButton) {

            const id =
                deleteButton.getAttribute(
                    "data-delete-coupon"
                );


            const coupon =
                coupons.find(function (item) {
                    return item.id === id;
                });


            if (coupon) {
                openDeleteModal(coupon);
            }
        }
    }


    /* =========================
       FILTER EVENTS
       ========================= */

    function renderAfterFilter() {
        renderCoupons();
    }


    function clearFilters() {

        if (searchInput) {
            searchInput.value = "";
        }

        if (typeFilter) {
            typeFilter.value = "all";
        }

        if (statusFilter) {
            statusFilter.value = "all";
        }

        renderCoupons();
    }


    /* =========================
       MODAL EVENTS
       ========================= */

    function setupModalEvents() {

        if (addCouponButton) {

            addCouponButton.addEventListener(
                "click",
                function () {
                    openCouponModal(null);
                }
            );
        }


        if (couponModalClose) {

            couponModalClose.addEventListener(
                "click",
                closeCouponModal
            );
        }


        if (cancelCouponButton) {

            cancelCouponButton.addEventListener(
                "click",
                closeCouponModal
            );
        }


        if (saveCouponButton) {

            saveCouponButton.addEventListener(
                "click",
                saveCoupon
            );
        }


        if (couponType) {

            couponType.addEventListener(
                "change",
                updateMaxDiscountVisibility
            );
        }


        if (deleteCouponClose) {

            deleteCouponClose.addEventListener(
                "click",
                closeDeleteModal
            );
        }


        if (cancelDeleteCoupon) {

            cancelDeleteCoupon.addEventListener(
                "click",
                closeDeleteModal
            );
        }


        if (confirmDeleteCoupon) {

            confirmDeleteCoupon.addEventListener(
                "click",
                deleteCoupon
            );
        }


        if (couponModal) {

            couponModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === couponModal
                    ) {
                        closeCouponModal();
                    }
                }
            );
        }


        if (deleteCouponModal) {

            deleteCouponModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        deleteCouponModal
                    ) {
                        closeDeleteModal();
                    }
                }
            );
        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }


                if (
                    couponModal &&
                    couponModal.classList.contains(
                        "active"
                    )
                ) {
                    closeCouponModal();
                    return;
                }


                if (
                    deleteCouponModal &&
                    deleteCouponModal.classList.contains(
                        "active"
                    )
                ) {
                    closeDeleteModal();
                }
            }
        );
    }


    /* =========================
       INPUT FORMATTING
       ========================= */

    function setupInputFormatting() {

        if (couponCode) {

            couponCode.addEventListener(
                "input",
                function () {

                    couponCode.value =
                        couponCode.value
                            .toUpperCase()
                            .replace(
                                /[^A-Z0-9_-]/g,
                                ""
                            );
                }
            );
        }


        const numericInputs = [
            couponValue,
            couponMinOrder,
            couponMaxDiscount,
            couponUsageLimit
        ];


        numericInputs.forEach(function (input) {

            if (!input) {
                return;
            }


            input.addEventListener(
                "input",
                function () {

                    let value =
                        Number(input.value);


                    if (
                        !Number.isFinite(value) ||
                        value < 0
                    ) {
                        value = 0;
                    }


                    input.value =
                        Math.floor(value);
                }
            );
        });
    }


    /* =========================
       GLOBAL UPDATE LISTENER
       ========================= */

    function setupStorageListeners() {

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key === COUPONS_KEY
                ) {

                    loadCoupons();

                    updateStats();
                    renderCoupons();
                }
            }
        );


        window.addEventListener(
            "glowskinCouponsUpdated",
            function () {

                /*
                 * Do not reload here because this
                 * event is also triggered by this page.
                 * Simply refresh the current UI.
                 */
                updateStats();
                renderCoupons();
            }
        );
    }


    /* =========================
       VISIBILITY REFRESH
       ========================= */

    function setupVisibilityRefresh() {

        document.addEventListener(
            "visibilitychange",
            function () {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    loadCoupons();

                    updateStats();
                    renderCoupons();
                }
            }
        );
    }


    /* =========================
       INITIALIZATION
       ========================= */

    function init() {

        loadCoupons();

        updateStats();

        renderCoupons();


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderAfterFilter
            );
        }


        if (typeFilter) {

            typeFilter.addEventListener(
                "change",
                renderAfterFilter
            );
        }


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                renderAfterFilter
            );
        }


        if (clearFiltersButton) {

            clearFiltersButton.addEventListener(
                "click",
                clearFilters
            );
        }


        if (tableBody) {

            tableBody.addEventListener(
                "click",
                handleTableClick
            );
        }


        setupModalEvents();
        setupInputFormatting();
        setupStorageListeners();
        setupVisibilityRefresh();
    }


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
