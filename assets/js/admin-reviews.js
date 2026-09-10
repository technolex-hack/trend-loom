/* =========================================================
   GLOWSKIN ADMIN — REVIEWS
   File: assets/js/admin-reviews.js
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY = "glowskin_reviews";

    let reviews = [];
    let selectedReviewId = null;
    let deleteReviewId = null;


    /* =====================================================
       DEFAULT REVIEWS
    ===================================================== */

    const defaultReviews = [
        {
            id: "review-001",
            customerName: "Aisha Rahman",
            customerEmail: "aisha@example.com",
            productId: "vitamin-c-brightening-serum",
            productName: "Vitamin C Brightening Serum",
            rating: 5,
            text: "This serum made my skin look brighter and more fresh. I have been using it every morning and I really like the texture.",
            date: "2026-09-07",
            status: "approved"
        },

        {
            id: "review-002",
            customerName: "Nihal P",
            customerEmail: "nihal@example.com",
            productId: "daily-sunscreen-spf-50",
            productName: "Daily Sunscreen SPF 50",
            rating: 5,
            text: "Very lightweight sunscreen. It does not feel heavy on my face and works well for everyday use.",
            date: "2026-09-06",
            status: "approved"
        },

        {
            id: "review-003",
            customerName: "Fathima K",
            customerEmail: "fathima@example.com",
            productId: "niacinamide-pore-serum",
            productName: "Niacinamide Pore Serum",
            rating: 4,
            text: "Good product with a smooth texture. My skin feels less oily after using it regularly.",
            date: "2026-09-05",
            status: "pending"
        },

        {
            id: "review-004",
            customerName: "Arjun M",
            customerEmail: "arjun@example.com",
            productId: "daily-hydrating-moisturizer",
            productName: "Daily Hydrating Moisturizer",
            rating: 4,
            text: "Nice moisturizer for daily use. It keeps my skin soft without feeling too greasy.",
            date: "2026-09-03",
            status: "approved"
        },

        {
            id: "review-005",
            customerName: "Hiba Salim",
            customerEmail: "hiba@example.com",
            productId: "gentle-foaming-face-wash",
            productName: "Gentle Foaming Face Wash",
            rating: 5,
            text: "Very gentle face wash. My skin feels clean and comfortable after every wash.",
            date: "2026-09-01",
            status: "pending"
        },

        {
            id: "review-006",
            customerName: "Rahul S",
            customerEmail: "rahul@example.com",
            productId: "hydrating-hyaluronic-serum",
            productName: "Hydrating Hyaluronic Serum",
            rating: 3,
            text: "The hydration is good, but I expected a little more from the product.",
            date: "2026-08-29",
            status: "hidden"
        }
    ];


    /* =====================================================
       DOM
    ===================================================== */

    const elements = {
        totalCount: document.getElementById("reviewsTotalCount"),
        pendingCount: document.getElementById("reviewsPendingCount"),
        approvedCount: document.getElementById("reviewsApprovedCount"),
        averageRating: document.getElementById("reviewsAverageRating"),

        search: document.getElementById("reviewSearch"),
        ratingFilter: document.getElementById("reviewRatingFilter"),
        statusFilter: document.getElementById("reviewStatusFilter"),
        clearFilters: document.getElementById("clearReviewFilters"),
        clearEmptyFilters: document.getElementById("clearEmptyReviewFilters"),

        resultCount: document.getElementById("reviewResultCount"),
        tableBody: document.getElementById("reviewsTableBody"),
        emptyState: document.getElementById("reviewsEmptyState"),

        reviewModal: document.getElementById("reviewModal"),
        reviewModalClose: document.getElementById("reviewModalClose"),
        reviewModalCancel: document.getElementById("reviewModalCancel"),
        reviewModalDelete: document.getElementById("reviewModalDelete"),
        reviewModalAction: document.getElementById("reviewModalAction"),

        detailAvatar: document.getElementById("reviewDetailAvatar"),
        detailCustomer: document.getElementById("reviewDetailCustomer"),
        detailEmail: document.getElementById("reviewDetailEmail"),
        detailProduct: document.getElementById("reviewDetailProduct"),
        detailRating: document.getElementById("reviewDetailRating"),
        detailText: document.getElementById("reviewDetailText"),
        detailDate: document.getElementById("reviewDetailDate"),
        detailStatus: document.getElementById("reviewDetailStatus"),

        deleteModal: document.getElementById("deleteReviewModal"),
        deleteModalClose: document.getElementById("deleteReviewClose"),
        cancelDelete: document.getElementById("cancelDeleteReview"),
        confirmDelete: document.getElementById("confirmDeleteReview"),
        deleteCustomer: document.getElementById("deleteReviewCustomer")
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getInitials(name) {
        const cleanName = String(name || "Customer").trim();

        if (!cleanName) {
            return "C";
        }

        const parts = cleanName.split(/\s+/);

        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }


    function formatDate(dateString) {
        if (!dateString) {
            return "—";
        }

        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function renderStars(rating) {
        const number = Math.max(
            0,
            Math.min(5, Number(rating) || 0)
        );

        let stars = "";

        for (let i = 1; i <= 5; i++) {
            stars += i <= number ? "★" : "☆";
        }

        return stars;
    }


    function getStatusLabel(status) {
        switch (status) {
            case "approved":
                return "Published";

            case "pending":
                return "Pending";

            case "hidden":
                return "Hidden";

            default:
                return "Pending";
        }
    }


    function getStatusClass(status) {
        if (
            status === "approved" ||
            status === "pending" ||
            status === "hidden"
        ) {
            return status;
        }

        return "pending";
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function loadReviews() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                reviews = defaultReviews.map(function (review) {
                    return { ...review };
                });

                saveReviews();
                return;
            }

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                reviews = parsed;
            } else {
                reviews = defaultReviews.map(function (review) {
                    return { ...review };
                });

                saveReviews();
            }

        } catch (error) {
            console.warn(
                "GlowSkin Reviews: Could not load reviews.",
                error
            );

            reviews = defaultReviews.map(function (review) {
                return { ...review };
            });
        }
    }


    function saveReviews() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(reviews)
            );

            window.dispatchEvent(
                new CustomEvent("glowskinReviewsUpdated")
            );

        } catch (error) {
            console.warn(
                "GlowSkin Reviews: Could not save reviews.",
                error
            );
        }
    }


    /* =====================================================
       FILTERING
    ===================================================== */

    function getFilteredReviews() {
        const searchTerm = String(
            elements.search?.value || ""
        )
            .trim()
            .toLowerCase();

        const ratingValue = String(
            elements.ratingFilter?.value || "all"
        );

        const statusValue = String(
            elements.statusFilter?.value || "all"
        );

        return reviews.filter(function (review) {

            const searchableText = [
                review.customerName,
                review.customerEmail,
                review.productName,
                review.text
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchTerm ||
                searchableText.includes(searchTerm);

            const matchesRating =
                ratingValue === "all" ||
                Number(review.rating) === Number(ratingValue);

            const matchesStatus =
                statusValue === "all" ||
                review.status === statusValue;

            return (
                matchesSearch &&
                matchesRating &&
                matchesStatus
            );
        });
    }


    /* =====================================================
       STATS
    ===================================================== */

    function updateStats() {
        const total = reviews.length;

        const pending = reviews.filter(function (review) {
            return review.status === "pending";
        }).length;

        const approved = reviews.filter(function (review) {
            return review.status === "approved";
        }).length;

        const ratingTotal = reviews.reduce(
            function (sum, review) {
                return sum + (Number(review.rating) || 0);
            },
            0
        );

        const average =
            total > 0
                ? ratingTotal / total
                : 0;

        if (elements.totalCount) {
            elements.totalCount.textContent = total;
        }

        if (elements.pendingCount) {
            elements.pendingCount.textContent = pending;
        }

        if (elements.approvedCount) {
            elements.approvedCount.textContent = approved;
        }

        if (elements.averageRating) {
            elements.averageRating.textContent =
                average.toFixed(1);
        }
    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderReviews() {
        if (!elements.tableBody) {
            return;
        }

        const filteredReviews = getFilteredReviews();

        elements.tableBody.innerHTML = "";

        if (elements.resultCount) {
            elements.resultCount.textContent =
                filteredReviews.length +
                (
                    filteredReviews.length === 1
                        ? " review"
                        : " reviews"
                );
        }

        if (filteredReviews.length === 0) {
            if (elements.emptyState) {
                elements.emptyState.hidden = false;
            }

            return;
        }

        if (elements.emptyState) {
            elements.emptyState.hidden = true;
        }

        filteredReviews.forEach(function (review) {

            const row = document.createElement("tr");

            const initials = getInitials(
                review.customerName
            );

            const statusLabel = getStatusLabel(
                review.status
            );

            const statusClass = getStatusClass(
                review.status
            );

            const actionButton =
                review.status === "approved"
                    ? `
                        <button
                            type="button"
                            class="review-action-button hide"
                            data-action="hide"
                            data-id="${escapeHTML(review.id)}"
                            title="Hide review"
                        >
                            Hide
                        </button>
                    `
                    : `
                        <button
                            type="button"
                            class="review-action-button approve"
                            data-action="approve"
                            data-id="${escapeHTML(review.id)}"
                            title="Approve review"
                        >
                            Approve
                        </button>
                    `;

            row.innerHTML = `
                <td>
                    <div class="review-customer-cell">

                        <div class="review-customer-avatar">
                            ${escapeHTML(initials)}
                        </div>

                        <div class="review-customer-info">

                            <span class="review-customer-name">
                                ${escapeHTML(review.customerName)}
                            </span>

                            <span class="review-customer-email">
                                ${escapeHTML(review.customerEmail)}
                            </span>

                        </div>

                    </div>
                </td>

                <td>
                    <div class="review-product-cell">
                        <span class="review-product-name">
                            ${escapeHTML(review.productName)}
                        </span>
                    </div>
                </td>

                <td>
                    <div class="review-rating-cell">

                        <div class="review-stars">
                            ${renderStars(review.rating)}
                        </div>

                        <span class="review-rating-number">
                            ${Number(review.rating) || 0}/5
                        </span>

                    </div>
                </td>

                <td>
                    <div class="review-text-cell">

                        <div class="review-text">
                            ${escapeHTML(review.text)}
                        </div>

                        <button
                            type="button"
                            class="review-read-more"
                            data-action="view"
                            data-id="${escapeHTML(review.id)}"
                        >
                            View
                        </button>

                    </div>
                </td>

                <td>
                    <div class="review-date-cell">
                        ${escapeHTML(formatDate(review.date))}
                    </div>
                </td>

                <td>
                    <span class="review-status-badge ${statusClass}">
                        ${escapeHTML(statusLabel)}
                    </span>
                </td>

                <td>
                    <div class="review-actions">

                        <button
                            type="button"
                            class="review-action-button"
                            data-action="view"
                            data-id="${escapeHTML(review.id)}"
                            title="View review"
                        >
                            View
                        </button>

                        ${actionButton}

                        <button
                            type="button"
                            class="review-action-button delete"
                            data-action="delete"
                            data-id="${escapeHTML(review.id)}"
                            title="Delete review"
                        >
                            Delete
                        </button>

                    </div>
                </td>
            `;

            elements.tableBody.appendChild(row);
        });
    }


    /* =====================================================
       FIND REVIEW
    ===================================================== */

    function findReview(id) {
        return reviews.find(function (review) {
            return String(review.id) === String(id);
        }) || null;
    }


    /* =====================================================
       VIEW REVIEW
    ===================================================== */

    function openReviewModal(id) {
        const review = findReview(id);

        if (!review || !elements.reviewModal) {
            return;
        }

        selectedReviewId = review.id;

        if (elements.detailAvatar) {
            elements.detailAvatar.textContent =
                getInitials(review.customerName);
        }

        if (elements.detailCustomer) {
            elements.detailCustomer.textContent =
                review.customerName || "Customer";
        }

        if (elements.detailEmail) {
            elements.detailEmail.textContent =
                review.customerEmail || "—";
        }

        if (elements.detailProduct) {
            elements.detailProduct.textContent =
                review.productName || "—";
        }

        if (elements.detailRating) {
            elements.detailRating.textContent =
                renderStars(review.rating);
        }

        if (elements.detailText) {
            elements.detailText.textContent =
                review.text || "No review text.";
        }

        if (elements.detailDate) {
            elements.detailDate.textContent =
                formatDate(review.date);
        }

        if (elements.detailStatus) {
            elements.detailStatus.textContent =
                getStatusLabel(review.status);

            elements.detailStatus.className =
                "review-status-badge " +
                getStatusClass(review.status);
        }

        if (elements.reviewModalAction) {

            if (review.status === "approved") {
                elements.reviewModalAction.textContent =
                    "Hide Review";

                elements.reviewModalAction.dataset.action =
                    "hide";
            } else {
                elements.reviewModalAction.textContent =
                    "Approve";

                elements.reviewModalAction.dataset.action =
                    "approve";
            }
        }

        elements.reviewModal.classList.add("open");
        elements.reviewModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("modal-open");
    }


    function closeReviewModal() {
        if (!elements.reviewModal) {
            return;
        }

        elements.reviewModal.classList.remove("open");
        elements.reviewModal.setAttribute(
            "aria-hidden",
            "true"
        );

        selectedReviewId = null;

        document.body.classList.remove("modal-open");
    }


    /* =====================================================
       DELETE MODAL
    ===================================================== */

    function openDeleteModal(id) {
        const review = findReview(id);

        if (!review || !elements.deleteModal) {
            return;
        }

        deleteReviewId = review.id;

        if (elements.deleteCustomer) {
            elements.deleteCustomer.textContent =
                review.customerName || "this customer";
        }

        elements.deleteModal.classList.add("open");
        elements.deleteModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add("modal-open");
    }


    function closeDeleteModal() {
        if (!elements.deleteModal) {
            return;
        }

        elements.deleteModal.classList.remove("open");
        elements.deleteModal.setAttribute(
            "aria-hidden",
            "true"
        );

        deleteReviewId = null;

        document.body.classList.remove("modal-open");
    }


    /* =====================================================
       CHANGE STATUS
    ===================================================== */

    function changeReviewStatus(id, newStatus) {
        const review = findReview(id);

        if (!review) {
            return;
        }

        review.status = newStatus;

        saveReviews();
        updateStats();
        renderReviews();

        if (selectedReviewId === review.id) {
            openReviewModal(review.id);
        }

        showToast(
            newStatus === "approved"
                ? "Review published successfully."
                : "Review hidden successfully."
        );
    }


    /* =====================================================
       DELETE
    ===================================================== */

    function deleteReview(id) {
        const index = reviews.findIndex(function (review) {
            return String(review.id) === String(id);
        });

        if (index === -1) {
            return;
        }

        reviews.splice(index, 1);

        saveReviews();
        updateStats();
        renderReviews();

        closeDeleteModal();
        closeReviewModal();

        showToast("Review deleted successfully.");
    }


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    function clearFilters() {
        if (elements.search) {
            elements.search.value = "";
        }

        if (elements.ratingFilter) {
            elements.ratingFilter.value = "all";
        }

        if (elements.statusFilter) {
            elements.statusFilter.value = "all";
        }

        renderReviews();
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {
        if (
            typeof window.glowSkinAdminToast ===
            "function"
        ) {
            window.glowSkinAdminToast(message);
            return;
        }

        let toast = document.getElementById(
            "reviewsFallbackToast"
        );

        if (!toast) {
            toast = document.createElement("div");

            toast.id = "reviewsFallbackToast";

            toast.style.position = "fixed";
            toast.style.left = "50%";
            toast.style.bottom = "24px";
            toast.style.zIndex = "99999";
            toast.style.transform = "translateX(-50%)";
            toast.style.padding = "12px 18px";
            toast.style.borderRadius = "10px";
            toast.style.background = "#211914";
            toast.style.color = "#ffffff";
            toast.style.fontSize = "13px";
            toast.style.fontWeight = "600";
            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.18)";

            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = "block";

        clearTimeout(toast._timer);

        toast._timer = setTimeout(function () {
            toast.style.display = "none";
        }, 2500);
    }


    /* =====================================================
       TABLE ACTIONS
    ===================================================== */

    function handleTableAction(event) {
        const button =
            event.target.closest(
                "[data-action][data-id]"
            );

        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "view") {
            openReviewModal(id);
            return;
        }

        if (action === "approve") {
            changeReviewStatus(id, "approved");
            return;
        }

        if (action === "hide") {
            changeReviewStatus(id, "hidden");
            return;
        }

        if (action === "delete") {
            openDeleteModal(id);
        }
    }


    /* =====================================================
       EVENTS
    ===================================================== */

    function bindEvents() {

        if (elements.search) {
            elements.search.addEventListener(
                "input",
                renderReviews
            );
        }

        if (elements.ratingFilter) {
            elements.ratingFilter.addEventListener(
                "change",
                renderReviews
            );
        }

        if (elements.statusFilter) {
            elements.statusFilter.addEventListener(
                "change",
                renderReviews
            );
        }

        if (elements.clearFilters) {
            elements.clearFilters.addEventListener(
                "click",
                clearFilters
            );
        }

        if (elements.clearEmptyFilters) {
            elements.clearEmptyFilters.addEventListener(
                "click",
                clearFilters
            );
        }

        if (elements.tableBody) {
            elements.tableBody.addEventListener(
                "click",
                handleTableAction
            );
        }


        /* REVIEW MODAL */

        if (elements.reviewModalClose) {
            elements.reviewModalClose.addEventListener(
                "click",
                closeReviewModal
            );
        }

        if (elements.reviewModalCancel) {
            elements.reviewModalCancel.addEventListener(
                "click",
                closeReviewModal
            );
        }

        if (elements.reviewModalDelete) {
            elements.reviewModalDelete.addEventListener(
                "click",
                function () {
                    if (selectedReviewId) {
                        openDeleteModal(
                            selectedReviewId
                        );
                    }
                }
            );
        }

        if (elements.reviewModalAction) {
            elements.reviewModalAction.addEventListener(
                "click",
                function () {

                    if (!selectedReviewId) {
                        return;
                    }

                    const action =
                        elements.reviewModalAction
                            .dataset.action;

                    if (action === "approve") {
                        changeReviewStatus(
                            selectedReviewId,
                            "approved"
                        );
                    }

                    if (action === "hide") {
                        changeReviewStatus(
                            selectedReviewId,
                            "hidden"
                        );
                    }
                }
            );
        }


        /* DELETE MODAL */

        if (elements.deleteModalClose) {
            elements.deleteModalClose.addEventListener(
                "click",
                closeDeleteModal
            );
        }

        if (elements.cancelDelete) {
            elements.cancelDelete.addEventListener(
                "click",
                closeDeleteModal
            );
        }

        if (elements.confirmDelete) {
            elements.confirmDelete.addEventListener(
                "click",
                function () {

                    if (!deleteReviewId) {
                        return;
                    }

                    deleteReview(deleteReviewId);
                }
            );
        }


        /* BACKDROPS */

        document.querySelectorAll(
            "[data-close-review-modal]"
        ).forEach(function (backdrop) {

            backdrop.addEventListener(
                "click",
                closeReviewModal
            );
        });


        document.querySelectorAll(
            "[data-close-delete-review]"
        ).forEach(function (backdrop) {

            backdrop.addEventListener(
                "click",
                closeDeleteModal
            );
        });


        /* ESC KEY */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }

                closeReviewModal();
                closeDeleteModal();
            }
        );


        /* STORAGE UPDATE */

        window.addEventListener(
            "storage",
            function (event) {

                if (event.key === STORAGE_KEY) {
                    loadReviews();
                    updateStats();
                    renderReviews();
                }
            }
        );


        /* CUSTOM UPDATE EVENT */

        window.addEventListener(
            "glowskinReviewsUpdated",
            function () {
                loadReviews();
                updateStats();
                renderReviews();
            }
        );


        /* TAB VISIBILITY */

        document.addEventListener(
            "visibilitychange",
            function () {

                if (
                    document.visibilityState ===
                    "visible"
                ) {
                    loadReviews();
                    updateStats();
                    renderReviews();
                }
            }
        );
    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {
        loadReviews();
        updateStats();
        renderReviews();
        bindEvents();
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
