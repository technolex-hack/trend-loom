(function () {
    "use strict";

    const BANNERS_KEY = "glowskin_banners";

    const DEFAULT_BANNERS = [
        {
            id: "banner-hero-1",
            title: "Your Skin. Your Glow.",
            subtitle: "Premium skincare for healthy, glowing skin.",
            position: "hero",
            buttonText: "Shop Now",
            link: "shop.html",
            desktopImage: "assets/images/banners/hero-1.jpg",
            mobileImage: "assets/images/banners/hero-1-mobile.jpg",
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            status: "active",
            displayOrder: 1,
            featured: true
        },
        {
            id: "banner-promo-1",
            title: "Glow More, Pay Less",
            subtitle: "Get special offers on selected skincare.",
            position: "promo",
            buttonText: "View Offers",
            link: "offers.html",
            desktopImage: "assets/images/banners/promo-1.jpg",
            mobileImage: "",
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            status: "active",
            displayOrder: 2,
            featured: true
        }
    ];

    const addBannerButton =
        document.getElementById("addBannerButton");

    const emptyAddBannerButton =
        document.getElementById("emptyAddBannerButton");

    const searchInput =
        document.getElementById("bannerSearch");

    const statusFilter =
        document.getElementById("bannerStatusFilter");

    const positionFilter =
        document.getElementById("bannerPositionFilter");

    const clearFiltersButton =
        document.getElementById("clearBannerFilters");

    const resultCount =
        document.getElementById("bannerResultCount");

    const tableBody =
        document.getElementById("bannersTableBody");

    const emptyState =
        document.getElementById("bannersEmptyState");

    const totalCount =
        document.getElementById("bannersTotalCount");

    const activeCount =
        document.getElementById("bannersActiveCount");

    const scheduledCount =
        document.getElementById("bannersScheduledCount");

    const inactiveCount =
        document.getElementById("bannersInactiveCount");

    const bannerModal =
        document.getElementById("bannerModal");

    const bannerModalTitle =
        document.getElementById("bannerModalTitle");

    const bannerModalClose =
        document.getElementById("bannerModalClose");

    const bannerId =
        document.getElementById("bannerId");

    const bannerTitle =
        document.getElementById("bannerTitle");

    const bannerSubtitle =
        document.getElementById("bannerSubtitle");

    const bannerPosition =
        document.getElementById("bannerPosition");

    const bannerButtonText =
        document.getElementById("bannerButtonText");

    const bannerLink =
        document.getElementById("bannerLink");

    const bannerDesktopImage =
        document.getElementById("bannerDesktopImage");

    const bannerMobileImage =
        document.getElementById("bannerMobileImage");

    const bannerImagePreview =
        document.getElementById("bannerImagePreview");

    const bannerStartDate =
        document.getElementById("bannerStartDate");

    const bannerEndDate =
        document.getElementById("bannerEndDate");

    const bannerStatus =
        document.getElementById("bannerStatus");

    const bannerOrder =
        document.getElementById("bannerOrder");

    const bannerFeatured =
        document.getElementById("bannerFeatured");

    const cancelBannerButton =
        document.getElementById("cancelBannerButton");

    const saveBannerButton =
        document.getElementById("saveBannerButton");

    const deleteBannerModal =
        document.getElementById("deleteBannerModal");

    const deleteBannerClose =
        document.getElementById("deleteBannerClose");

    const deleteBannerName =
        document.getElementById("deleteBannerName");

    const cancelDeleteBanner =
        document.getElementById("cancelDeleteBanner");

    const confirmDeleteBanner =
        document.getElementById("confirmDeleteBanner");


    let banners = [];
    let bannerToDelete = null;


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


    function formatDate(value) {
        if (!value) {
            return "—";
        }

        const date =
            new Date(value + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
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


    function normalizeBanner(banner) {
        return {
            id:
                banner.id ||
                `banner-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,

            title:
                String(banner.title || "").trim(),

            subtitle:
                String(banner.subtitle || "").trim(),

            position:
                banner.position || "hero",

            buttonText:
                String(banner.buttonText || "").trim(),

            link:
                String(banner.link || "").trim(),

            desktopImage:
                String(banner.desktopImage || "").trim(),

            mobileImage:
                String(banner.mobileImage || "").trim(),

            startDate:
                banner.startDate || "",

            endDate:
                banner.endDate || "",

            status:
                banner.status === "inactive"
                    ? "inactive"
                    : "active",

            displayOrder:
                Math.max(
                    1,
                    Number(banner.displayOrder) || 1
                ),

            featured:
                Boolean(banner.featured)
        };
    }


    /* =========================
       STORAGE
       ========================= */

    function loadBanners() {
        try {
            const stored =
                localStorage.getItem(BANNERS_KEY);

            if (!stored) {
                banners =
                    DEFAULT_BANNERS.map(normalizeBanner);

                saveBanners(false);
                return;
            }

            const parsed =
                JSON.parse(stored);

            if (Array.isArray(parsed)) {
                banners =
                    parsed.map(normalizeBanner);
            } else {
                banners =
                    DEFAULT_BANNERS.map(normalizeBanner);

                saveBanners(false);
            }

        } catch (error) {
            console.error(
                "GlowSkin Banners: Unable to load banners.",
                error
            );

            banners =
                DEFAULT_BANNERS.map(normalizeBanner);
        }
    }


    function saveBanners(showMessage) {
        try {
            localStorage.setItem(
                BANNERS_KEY,
                JSON.stringify(banners)
            );

            window.dispatchEvent(
                new CustomEvent(
                    "glowskinBannersUpdated"
                )
            );

            if (showMessage) {
                showToast(
                    "Banner saved successfully."
                );
            }

        } catch (error) {
            console.error(
                "GlowSkin Banners: Unable to save banners.",
                error
            );

            showToast(
                "Unable to save banner."
            );
        }
    }


    /* =========================
       STATUS
       ========================= */

    function getBannerStatus(banner) {
        const today =
            getTodayString();

        if (
            banner.endDate &&
            banner.endDate < today
        ) {
            return "expired";
        }

        if (
            banner.startDate &&
            banner.startDate > today
        ) {
            return "scheduled";
        }

        if (
            banner.status === "inactive"
        ) {
            return "inactive";
        }

        return "active";
    }


    function getStatusLabel(banner) {
        const status =
            getBannerStatus(banner);

        if (status === "scheduled") {
            return "Scheduled";
        }

        if (status === "expired") {
            return "Expired";
        }

        if (status === "inactive") {
            return "Inactive";
        }

        return "Active";
    }


    /* =========================
       FILTER
       ========================= */

    function getFilteredBanners() {
        const search =
            String(searchInput?.value || "")
                .trim()
                .toLowerCase();

        const selectedStatus =
            statusFilter?.value || "all";

        const selectedPosition =
            positionFilter?.value || "all";

        return banners
            .filter(function (banner) {

                const title =
                    banner.title.toLowerCase();

                const subtitle =
                    banner.subtitle.toLowerCase();

                const matchesSearch =
                    !search ||
                    title.includes(search) ||
                    subtitle.includes(search);

                const matchesPosition =
                    selectedPosition === "all" ||
                    banner.position === selectedPosition;

                const matchesStatus =
                    selectedStatus === "all" ||
                    getBannerStatus(banner) ===
                        selectedStatus;

                return (
                    matchesSearch &&
                    matchesPosition &&
                    matchesStatus
                );
            })
            .sort(function (a, b) {
                return (
                    Number(a.displayOrder) -
                    Number(b.displayOrder)
                );
            });
    }


    /* =========================
       STATS
       ========================= */

    function updateStats() {
        let active = 0;
        let scheduled = 0;
        let inactive = 0;

        banners.forEach(function (banner) {

            const status =
                getBannerStatus(banner);

            if (status === "active") {
                active++;
            }

            if (status === "scheduled") {
                scheduled++;
            }

            if (
                status === "inactive" ||
                status === "expired"
            ) {
                inactive++;
            }
        });


        if (totalCount) {
            totalCount.textContent =
                banners.length;
        }

        if (activeCount) {
            activeCount.textContent =
                active;
        }

        if (scheduledCount) {
            scheduledCount.textContent =
                scheduled;
        }

        if (inactiveCount) {
            inactiveCount.textContent =
                inactive;
        }
    }


    /* =========================
       IMAGE FALLBACK
       ========================= */

    function imageFallback(element) {
        if (!element) {
            return;
        }

        element.style.display = "none";

        const parent =
            element.parentElement;

        if (!parent) {
            return;
        }

        parent.innerHTML =
            '<div class="banner-thumbnail-placeholder">▧</div>';
    }


    /* =========================
       RENDER
       ========================= */

    function renderBanners() {
        if (!tableBody) {
            return;
        }

        const filtered =
            getFilteredBanners();


        if (resultCount) {
            resultCount.textContent =
                `${filtered.length} ${
                    filtered.length === 1
                        ? "banner"
                        : "banners"
                }`;
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
            filtered.map(function (banner) {

                const status =
                    getBannerStatus(banner);

                const statusLabel =
                    getStatusLabel(banner);


                const image =
                    banner.desktopImage ||
                    banner.mobileImage;


                return `
                    <tr
                        data-banner-id="${escapeHTML(
                            banner.id
                        )}"
                    >

                        <td>

                            <div class="banner-cell">

                                <div class="banner-thumbnail">

                                    ${
                                        image
                                            ? `
                                                <img
                                                    src="${escapeHTML(
                                                        image
                                                    )}"
                                                    alt="${escapeHTML(
                                                        banner.title
                                                    )}"
                                                    onerror="this.style.display='none';this.parentElement.innerHTML='<div class=&quot;banner-thumbnail-placeholder&quot;>▧</div>';"
                                                >
                                            `
                                            : `
                                                <div class="banner-thumbnail-placeholder">
                                                    ▧
                                                </div>
                                            `
                                    }

                                </div>


                                <div class="banner-main-info">

                                    <span class="banner-title">
                                        ${escapeHTML(
                                            banner.title ||
                                            "Untitled Banner"
                                        )}
                                    </span>

                                    <span class="banner-subtitle">
                                        ${escapeHTML(
                                            banner.subtitle ||
                                            "No subtitle"
                                        )}
                                    </span>

                                    <span class="banner-id">
                                        ${escapeHTML(
                                            banner.id
                                        )}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>

                            <span class="banner-position">
                                ${escapeHTML(
                                    banner.position
                                )}
                            </span>

                        </td>


                        <td>

                            <div class="banner-validity">

                                <span class="banner-date">
                                    <span class="banner-date-label">
                                        From
                                    </span>
                                    ${escapeHTML(
                                        formatDate(
                                            banner.startDate
                                        )
                                    )}
                                </span>

                                <span class="banner-date">
                                    <span class="banner-date-label">
                                        To
                                    </span>
                                    ${escapeHTML(
                                        formatDate(
                                            banner.endDate
                                        )
                                    )}
                                </span>

                            </div>

                        </td>


                        <td>

                            <div class="banner-button-info">

                                <span class="banner-button-text">
                                    ${
                                        escapeHTML(
                                            banner.buttonText ||
                                            "No button"
                                        )
                                    }
                                </span>

                                <span class="banner-link">
                                    ${
                                        escapeHTML(
                                            banner.link ||
                                            "No link"
                                        )
                                    }
                                </span>

                            </div>

                        </td>


                        <td>

                            <span
                                class="
                                    banner-status-badge
                                    ${escapeHTML(status)}
                                "
                            >
                                ${escapeHTML(statusLabel)}
                            </span>

                        </td>


                        <td>

                            <div class="banner-actions">

                                <button
                                    type="button"
                                    class="
                                        banner-action-button
                                        edit
                                    "
                                    data-edit-banner="${escapeHTML(
                                        banner.id
                                    )}"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="
                                        banner-action-button
                                        toggle
                                    "
                                    data-toggle-banner="${escapeHTML(
                                        banner.id
                                    )}"
                                >
                                    ${
                                        banner.status === "active"
                                            ? "Disable"
                                            : "Enable"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="
                                        banner-action-button
                                        delete
                                    "
                                    data-delete-banner="${escapeHTML(
                                        banner.id
                                    )}"
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
       IMAGE PREVIEW
       ========================= */

    function updateImagePreview() {
        if (!bannerImagePreview) {
            return;
        }

        const desktop =
            String(
                bannerDesktopImage?.value || ""
            ).trim();

        const mobile =
            String(
                bannerMobileImage?.value || ""
            ).trim();

        const image =
            desktop || mobile;


        if (!image) {
            bannerImagePreview.innerHTML =
                `
                    <div class="banner-preview-placeholder">
                        Image preview will appear here
                    </div>
                `;

            return;
        }


        bannerImagePreview.innerHTML =
            `
                <img
                    src="${escapeHTML(image)}"
                    alt="Banner preview"
                >
            `;


        const previewImage =
            bannerImagePreview.querySelector("img");


        if (previewImage) {
            previewImage.addEventListener(
                "error",
                function () {

                    bannerImagePreview.innerHTML =
                        `
                            <div class="banner-preview-placeholder">
                                Unable to load this image path.
                            </div>
                        `;
                }
            );
        }
    }


    /* =========================
       OPEN MODAL
       ========================= */

    function openBannerModal(banner) {

        if (!bannerModal) {
            return;
        }


        if (banner) {

            bannerModalTitle.textContent =
                "Edit Banner";

            bannerId.value =
                banner.id || "";

            bannerTitle.value =
                banner.title || "";

            bannerSubtitle.value =
                banner.subtitle || "";

            bannerPosition.value =
                banner.position || "hero";

            bannerButtonText.value =
                banner.buttonText || "";

            bannerLink.value =
                banner.link || "";

            bannerDesktopImage.value =
                banner.desktopImage || "";

            bannerMobileImage.value =
                banner.mobileImage || "";

            bannerStartDate.value =
                banner.startDate || "";

            bannerEndDate.value =
                banner.endDate || "";

            bannerStatus.value =
                banner.status || "active";

            bannerOrder.value =
                Number(banner.displayOrder) || 1;

            bannerFeatured.checked =
                Boolean(banner.featured);

        } else {

            bannerModalTitle.textContent =
                "Add Banner";

            bannerId.value = "";

            bannerTitle.value = "";

            bannerSubtitle.value = "";

            bannerPosition.value =
                "hero";

            bannerButtonText.value =
                "Shop Now";

            bannerLink.value =
                "shop.html";

            bannerDesktopImage.value = "";

            bannerMobileImage.value = "";

            bannerStartDate.value =
                getTodayString();

            bannerEndDate.value =
                "";

            bannerStatus.value =
                "active";

            bannerOrder.value =
                String(
                    banners.length + 1
                );

            bannerFeatured.checked =
                false;
        }


        updateImagePreview();


        bannerModal.classList.add("active");

        bannerModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "admin-modal-open"
        );


        setTimeout(function () {

            if (bannerTitle) {
                bannerTitle.focus();
            }

        }, 100);
    }


    function closeBannerModal() {

        if (!bannerModal) {
            return;
        }

        bannerModal.classList.remove(
            "active"
        );

        bannerModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "admin-modal-open"
        );
    }


    /* =========================
       VALIDATION
       ========================= */

    function validateBanner() {

        const title =
            String(
                bannerTitle?.value || ""
            ).trim();

        const subtitle =
            String(
                bannerSubtitle?.value || ""
            ).trim();

        const position =
            bannerPosition?.value || "hero";

        const buttonText =
            String(
                bannerButtonText?.value || ""
            ).trim();

        const link =
            String(
                bannerLink?.value || ""
            ).trim();

        const desktopImage =
            String(
                bannerDesktopImage?.value || ""
            ).trim();

        const mobileImage =
            String(
                bannerMobileImage?.value || ""
            ).trim();

        const startDate =
            bannerStartDate?.value || "";

        const endDate =
            bannerEndDate?.value || "";

        const displayOrder =
            Number(
                bannerOrder?.value
            );


        if (!title) {
            showToast(
                "Please enter a banner title."
            );

            bannerTitle.focus();
            return null;
        }


        if (!desktopImage && !mobileImage) {
            showToast(
                "Please enter at least one banner image path."
            );

            bannerDesktopImage.focus();
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

            bannerEndDate.focus();
            return null;
        }


        if (
            !Number.isFinite(displayOrder) ||
            displayOrder < 1
        ) {
            showToast(
                "Display order must be at least 1."
            );

            bannerOrder.focus();
            return null;
        }


        return {
            title,
            subtitle,
            position,
            buttonText,
            link,
            desktopImage,
            mobileImage,
            startDate,
            endDate,
            status:
                bannerStatus.value === "inactive"
                    ? "inactive"
                    : "active",
            displayOrder:
                Math.floor(displayOrder),
            featured:
                Boolean(
                    bannerFeatured.checked
                )
        };
    }


    /* =========================
       SAVE BANNER
       ========================= */

    function saveBanner() {

        const data =
            validateBanner();


        if (!data) {
            return;
        }


        const editingId =
            bannerId.value;


        if (editingId) {

            const index =
                banners.findIndex(function (banner) {
                    return banner.id === editingId;
                });


            if (index === -1) {
                showToast(
                    "Banner not found."
                );
                return;
            }


            banners[index] = {
                ...banners[index],
                ...data
            };


            saveBanners(false);

            closeBannerModal();

            updateStats();
            renderBanners();

            showToast(
                "Banner updated successfully."
            );

        } else {

            const newBanner = {
                id:
                    "banner-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2, 7),

                ...data
            };


            banners.push(newBanner);

            saveBanners(false);

            closeBannerModal();

            updateStats();
            renderBanners();

            showToast(
                "Banner created successfully."
            );
        }
    }


    /* =========================
       TOGGLE BANNER
       ========================= */

    function toggleBanner(id) {

        const banner =
            banners.find(function (item) {
                return item.id === id;
            });


        if (!banner) {
            return;
        }


        const currentStatus =
            getBannerStatus(banner);


        if (currentStatus === "expired") {

            showToast(
                "This banner has expired. Edit the end date first."
            );

            return;
        }


        if (currentStatus === "scheduled") {

            showToast(
                "This banner is scheduled for a future date."
            );

            return;
        }


        banner.status =
            banner.status === "active"
                ? "inactive"
                : "active";


        saveBanners(false);

        updateStats();
        renderBanners();


        showToast(
            banner.status === "active"
                ? "Banner enabled."
                : "Banner disabled."
        );
    }


    /* =========================
       DELETE MODAL
       ========================= */

    function openDeleteModal(banner) {

        if (
            !deleteBannerModal ||
            !banner
        ) {
            return;
        }


        bannerToDelete =
            banner;


        if (deleteBannerName) {
            deleteBannerName.textContent =
                banner.title ||
                "this banner";
        }


        deleteBannerModal.classList.add(
            "active"
        );

        deleteBannerModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "admin-modal-open"
        );
    }


    function closeDeleteModal() {

        if (!deleteBannerModal) {
            return;
        }


        deleteBannerModal.classList.remove(
            "active"
        );

        deleteBannerModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "admin-modal-open"
        );

        bannerToDelete = null;
    }


    function deleteBanner() {

        if (!bannerToDelete) {
            return;
        }


        const id =
            bannerToDelete.id;


        const index =
            banners.findIndex(function (banner) {
                return banner.id === id;
            });


        if (index === -1) {
            closeDeleteModal();
            return;
        }


        const title =
            banners[index].title;


        banners.splice(index, 1);

        saveBanners(false);

        closeDeleteModal();

        updateStats();
        renderBanners();


        showToast(
            `${title || "Banner"} deleted successfully.`
        );
    }


    /* =========================
       TABLE EVENTS
       ========================= */

    function handleTableClick(event) {

        const editButton =
            event.target.closest(
                "[data-edit-banner]"
            );


        if (editButton) {

            const id =
                editButton.getAttribute(
                    "data-edit-banner"
                );


            const banner =
                banners.find(function (item) {
                    return item.id === id;
                });


            if (banner) {
                openBannerModal(banner);
            }

            return;
        }


        const toggleButton =
            event.target.closest(
                "[data-toggle-banner]"
            );


        if (toggleButton) {

            const id =
                toggleButton.getAttribute(
                    "data-toggle-banner"
                );

            toggleBanner(id);

            return;
        }


        const deleteButton =
            event.target.closest(
                "[data-delete-banner]"
            );


        if (deleteButton) {

            const id =
                deleteButton.getAttribute(
                    "data-delete-banner"
                );


            const banner =
                banners.find(function (item) {
                    return item.id === id;
                });


            if (banner) {
                openDeleteModal(banner);
            }
        }
    }


    /* =========================
       FILTER EVENTS
       ========================= */

    function clearFilters() {

        if (searchInput) {
            searchInput.value = "";
        }

        if (statusFilter) {
            statusFilter.value = "all";
        }

        if (positionFilter) {
            positionFilter.value = "all";
        }

        renderBanners();
    }


    /* =========================
       MODAL EVENTS
       ========================= */

    function setupModalEvents() {

        if (addBannerButton) {

            addBannerButton.addEventListener(
                "click",
                function () {
                    openBannerModal(null);
                }
            );
        }


        if (emptyAddBannerButton) {

            emptyAddBannerButton.addEventListener(
                "click",
                function () {
                    openBannerModal(null);
                }
            );
        }


        if (bannerModalClose) {

            bannerModalClose.addEventListener(
                "click",
                closeBannerModal
            );
        }


        if (cancelBannerButton) {

            cancelBannerButton.addEventListener(
                "click",
                closeBannerModal
            );
        }


        if (saveBannerButton) {

            saveBannerButton.addEventListener(
                "click",
                saveBanner
            );
        }


        if (deleteBannerClose) {

            deleteBannerClose.addEventListener(
                "click",
                closeDeleteModal
            );
        }


        if (cancelDeleteBanner) {

            cancelDeleteBanner.addEventListener(
                "click",
                closeDeleteModal
            );
        }


        if (confirmDeleteBanner) {

            confirmDeleteBanner.addEventListener(
                "click",
                deleteBanner
            );
        }


        if (bannerModal) {

            bannerModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        bannerModal
                    ) {
                        closeBannerModal();
                    }
                }
            );
        }


        if (deleteBannerModal) {

            deleteBannerModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        deleteBannerModal
                    ) {
                        closeDeleteModal();
                    }
                }
            );
        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                if (
                    bannerModal &&
                    bannerModal.classList.contains(
                        "active"
                    )
                ) {
                    closeBannerModal();
                    return;
                }


                if (
                    deleteBannerModal &&
                    deleteBannerModal.classList.contains(
                        "active"
                    )
                ) {
                    closeDeleteModal();
                }
            }
        );
    }


    /* =========================
       INPUT EVENTS
       ========================= */

    function setupInputEvents() {

        [
            bannerDesktopImage,
            bannerMobileImage
        ].forEach(function (input) {

            if (!input) {
                return;
            }

            input.addEventListener(
                "input",
                updateImagePreview
            );

            input.addEventListener(
                "change",
                updateImagePreview
            );
        });


        if (bannerOrder) {

            bannerOrder.addEventListener(
                "input",
                function () {

                    let value =
                        Number(
                            bannerOrder.value
                        );


                    if (
                        !Number.isFinite(value) ||
                        value < 1
                    ) {
                        value = 1;
                    }


                    bannerOrder.value =
                        Math.floor(value);
                }
            );
        }
    }


    /* =========================
       KEYBOARD
       ========================= */

    function setupKeyboardSubmit() {

        if (!bannerModal) {
            return;
        }


        bannerModal.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    event.target.tagName !== "TEXTAREA"
                ) {

                    /*
                     * Do not submit when focus is
                     * inside a select element.
                     */
                    if (
                        event.target.tagName ===
                        "SELECT"
                    ) {
                        return;
                    }


                    event.preventDefault();

                    saveBanner();
                }
            }
        );
    }


    /* =========================
       EXTERNAL UPDATES
       ========================= */

    function setupListeners() {

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key === BANNERS_KEY
                ) {

                    loadBanners();

                    updateStats();
                    renderBanners();
                }
            }
        );


        window.addEventListener(
            "glowskinBannersUpdated",
            function () {

                updateStats();
                renderBanners();
            }
        );


        document.addEventListener(
            "visibilitychange",
            function () {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    loadBanners();

                    updateStats();
                    renderBanners();
                }
            }
        );
    }


    /* =========================
       INITIALIZATION
       ========================= */

    function init() {

        loadBanners();

        updateStats();

        renderBanners();


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderBanners
            );
        }


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                renderBanners
            );
        }


        if (positionFilter) {

            positionFilter.addEventListener(
                "change",
                renderBanners
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
        setupInputEvents();
        setupKeyboardSubmit();
        setupListeners();
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
