/* =========================================================
   GLOWSKIN ADMIN — BLOG
   File: assets/js/admin-blog.js
========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "glowskin_blogs";

    /* =====================================================
       DEFAULT BLOG POSTS
    ===================================================== */

    const defaultBlogs = [
        {
            id: "blog-vitamin-c",
            title: "Vitamin C: Benefits for Your Skin",
            category: "ingredients",
            author: "GlowSkin Team",
            excerpt: "Discover how Vitamin C can help brighten your skin and improve the appearance of dark spots.",
            content:
                "Vitamin C is one of the most popular skincare ingredients for achieving brighter-looking skin. It is commonly used to improve the appearance of dullness and uneven skin tone.\n\nFor best results, use a Vitamin C product consistently as part of your morning skincare routine and always follow with sunscreen.",
            image: "assets/images/blog/vitamin-c.jpg",
            date: "2026-01-15",
            status: "published",
            featured: true
        },
        {
            id: "blog-sunscreen",
            title: "Why Sunscreen Should Be a Daily Step",
            category: "sun-care",
            author: "GlowSkin Team",
            excerpt: "Learn why daily sunscreen is one of the most important steps in a simple skincare routine.",
            content:
                "Sunscreen helps protect your skin from UV radiation. Making sunscreen a daily part of your skincare routine is important even when the weather is cloudy.\n\nChoose a broad-spectrum sunscreen that suits your skin type and apply it as the final step of your morning skincare routine.",
            image: "assets/images/blog/sunscreen.jpg",
            date: "2026-01-22",
            status: "published",
            featured: true
        },
        {
            id: "blog-skincare-order",
            title: "The Right Order to Apply Skincare",
            category: "routine",
            author: "GlowSkin Team",
            excerpt: "A simple guide to applying your skincare products in the right order.",
            content:
                "A basic skincare routine can be simple when you know the correct order.\n\nStart with cleanser, followed by toner if you use one. Apply serums next, then moisturizer. In the morning, finish your routine with sunscreen.\n\nThe most important thing is consistency rather than having a large number of products.",
            image: "assets/images/blog/skincare-order.jpg",
            date: "2026-02-03",
            status: "published",
            featured: false
        },
        {
            id: "blog-oily-skin",
            title: "How to Take Care of Oily Skin",
            category: "skincare",
            author: "GlowSkin Team",
            excerpt: "Simple skincare tips to help maintain balanced-looking skin when you have excess oil.",
            content:
                "Oily skin can benefit from a gentle and consistent routine. Avoid overly harsh cleansing because it may leave the skin feeling dry and uncomfortable.\n\nLook for lightweight, non-heavy moisturizers and skincare products that fit your skin's needs. Regular cleansing and sunscreen are also important parts of a balanced routine.",
            image: "assets/images/blog/oily-skin.jpg",
            date: "2026-02-14",
            status: "published",
            featured: false
        },
        {
            id: "blog-dry-skin",
            title: "Simple Tips for Dry Skin",
            category: "skincare",
            author: "GlowSkin Team",
            excerpt: "Easy ways to build a gentle skincare routine for dry and dehydrated-looking skin.",
            content:
                "Dry skin often benefits from gentle cleansing and regular moisturization. Avoid very hot water and harsh cleansing products that can leave the skin feeling tight.\n\nA hydrating serum followed by a moisturizer can help support a comfortable skincare routine. Apply sunscreen during the daytime as well.",
            image: "assets/images/blog/dry-skin.jpg",
            date: "2026-02-25",
            status: "published",
            featured: false
        },
        {
            id: "blog-niacinamide",
            title: "Understanding Niacinamide",
            category: "ingredients",
            author: "GlowSkin Team",
            excerpt: "Learn what niacinamide is and why it is commonly used in modern skincare routines.",
            content:
                "Niacinamide is a form of Vitamin B3 commonly used in skincare products. It is popular because it can be incorporated into many different routines.\n\nMany people use niacinamide products as part of routines focused on the appearance of pores, uneven skin tone and excess oil.",
            image: "assets/images/blog/niacinamide.jpg",
            date: "2026-03-05",
            status: "published",
            featured: true
        }
    ];


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (id) => document.getElementById(id);

    const elements = {
        addButton: $("addBlogButton"),

        totalCount: $("blogsTotalCount"),
        publishedCount: $("blogsPublishedCount"),
        draftCount: $("blogsDraftCount"),
        featuredCount: $("blogsFeaturedCount"),

        search: $("blogSearch"),
        categoryFilter: $("blogCategoryFilter"),
        statusFilter: $("blogStatusFilter"),
        clearFilters: $("clearBlogFilters"),
        resultCount: $("blogResultCount"),

        tableBody: $("blogsTableBody"),
        emptyState: $("blogsEmptyState"),
        clearEmptyFilters: $("clearEmptyBlogFilters"),

        modal: $("blogModal"),
        modalTitle: $("blogModalTitle"),
        modalClose: $("blogModalClose"),
        form: $("blogForm"),

        id: $("blogId"),
        title: $("blogTitle"),
        category: $("blogCategory"),
        author: $("blogAuthor"),
        excerpt: $("blogExcerpt"),
        content: $("blogContent"),
        image: $("blogImage"),
        date: $("blogDate"),
        status: $("blogStatus"),
        featured: $("blogFeatured"),

        cancelButton: $("cancelBlogButton"),
        saveButton: $("saveBlogButton"),

        viewModal: $("viewBlogModal"),
        viewClose: $("viewBlogClose"),
        viewCategory: $("viewBlogCategory"),
        viewDate: $("viewBlogDate"),
        viewHeading: $("viewBlogHeading"),
        viewExcerpt: $("viewBlogExcerpt"),
        viewContent: $("viewBlogContent"),
        viewAuthor: $("viewBlogAuthor"),
        viewCancel: $("viewBlogCancel"),

        deleteModal: $("deleteBlogModal"),
        deleteClose: $("deleteBlogClose"),
        deleteName: $("deleteBlogName"),
        cancelDelete: $("cancelDeleteBlog"),
        confirmDelete: $("confirmDeleteBlog")
    };


    /* =====================================================
       STORAGE
    ===================================================== */

    function getBlogs() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultBlogs)
                );

                return [...defaultBlogs];
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(defaultBlogs)
                );

                return [...defaultBlogs];
            }

            return parsed;
        } catch (error) {
            console.error("GlowSkin blogs storage error:", error);
            return [...defaultBlogs];
        }
    }


    function saveBlogs(blogs) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(blogs)
        );

        window.dispatchEvent(
            new CustomEvent("glowskinBlogsUpdated", {
                detail: blogs
            })
        );
    }


    /* =====================================================
       UTILITIES
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function generateId() {
        return (
            "blog-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 8)
        );
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


    function getCategoryLabel(category) {
        const labels = {
            ingredients: "Ingredients",
            "sun-care": "Sun Care",
            routine: "Routine",
            skincare: "Skincare"
        };

        return labels[category] || category || "Uncategorized";
    }


    function getStatusLabel(status) {
        return status === "published"
            ? "Published"
            : "Draft";
    }


    function getToday() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    /* =====================================================
       STATS
    ===================================================== */

    function updateStats(blogs) {
        const published = blogs.filter(
            blog => blog.status === "published"
        ).length;

        const drafts = blogs.filter(
            blog => blog.status === "draft"
        ).length;

        const featured = blogs.filter(
            blog => blog.featured === true
        ).length;

        if (elements.totalCount) {
            elements.totalCount.textContent = blogs.length;
        }

        if (elements.publishedCount) {
            elements.publishedCount.textContent = published;
        }

        if (elements.draftCount) {
            elements.draftCount.textContent = drafts;
        }

        if (elements.featuredCount) {
            elements.featuredCount.textContent = featured;
        }
    }


    /* =====================================================
       FILTERING
    ===================================================== */

    function getFilteredBlogs(blogs) {
        const searchValue = (
            elements.search?.value || ""
        )
            .trim()
            .toLowerCase();

        const categoryValue =
            elements.categoryFilter?.value || "all";

        const statusValue =
            elements.statusFilter?.value || "all";

        return blogs.filter(blog => {
            const searchableText = [
                blog.title,
                blog.author,
                blog.excerpt,
                blog.content,
                getCategoryLabel(blog.category)
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchValue ||
                searchableText.includes(searchValue);

            const matchesCategory =
                categoryValue === "all" ||
                blog.category === categoryValue;

            const matchesStatus =
                statusValue === "all" ||
                blog.status === statusValue;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }


    /* =====================================================
       IMAGE HTML
    ===================================================== */

    function getThumbnailHTML(blog) {
        if (blog.image) {
            return `
                <div class="blog-post-thumbnail">
                    <img
                        src="${escapeHTML(blog.image)}"
                        alt="${escapeHTML(blog.title)}"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >
                </div>
            `;
        }

        return `
            <div class="blog-post-thumbnail" aria-hidden="true">
                📝
            </div>
        `;
    }


    /* =====================================================
       TABLE RENDER
    ===================================================== */

    function renderTable() {
        const blogs = getBlogs();
        const filteredBlogs = getFilteredBlogs(blogs);

        updateStats(blogs);

        if (elements.resultCount) {
            elements.resultCount.textContent =
                `${filteredBlogs.length} of ${blogs.length} posts`;
        }

        if (!elements.tableBody) {
            return;
        }

        elements.tableBody.innerHTML = "";

        if (filteredBlogs.length === 0) {
            if (elements.emptyState) {
                elements.emptyState.hidden = false;
            }

            return;
        }

        if (elements.emptyState) {
            elements.emptyState.hidden = true;
        }

        filteredBlogs.forEach(blog => {
            const row = document.createElement("tr");

            const featuredHTML = blog.featured
                ? `<span class="blog-featured active" title="Featured">★</span>`
                : `<span class="blog-featured" title="Not featured">☆</span>`;

            row.innerHTML = `
                <td>
                    <div class="blog-post-cell">
                        ${getThumbnailHTML(blog)}

                        <div class="blog-post-info">
                            <span class="blog-post-title">
                                ${escapeHTML(blog.title)}
                            </span>

                            <span class="blog-post-excerpt">
                                ${escapeHTML(blog.excerpt || "No description")}
                            </span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="blog-category-badge ${escapeHTML(blog.category || "")}">
                        ${escapeHTML(getCategoryLabel(blog.category))}
                    </span>
                </td>

                <td>
                    <span class="blog-author">
                        ${escapeHTML(blog.author || "GlowSkin Team")}
                    </span>
                </td>

                <td>
                    <span class="blog-date">
                        ${escapeHTML(formatDate(blog.date))}
                    </span>
                </td>

                <td>
                    <span class="blog-status-badge ${escapeHTML(blog.status || "draft")}">
                        ${escapeHTML(getStatusLabel(blog.status))}
                    </span>
                </td>

                <td>
                    ${featuredHTML}
                </td>

                <td>
                    <div class="blog-actions">

                        <button
                            type="button"
                            class="blog-action-button view"
                            data-action="view"
                            data-id="${escapeHTML(blog.id)}"
                            title="View blog"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="blog-action-button edit"
                            data-action="edit"
                            data-id="${escapeHTML(blog.id)}"
                            title="Edit blog"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="blog-action-button feature"
                            data-action="feature"
                            data-id="${escapeHTML(blog.id)}"
                            title="${blog.featured ? "Remove featured" : "Mark as featured"}"
                        >
                            ${blog.featured ? "★" : "☆"}
                        </button>

                        <button
                            type="button"
                            class="blog-action-button toggle"
                            data-action="toggle"
                            data-id="${escapeHTML(blog.id)}"
                            title="${blog.status === "published" ? "Move to draft" : "Publish"}"
                        >
                            ${blog.status === "published" ? "Draft" : "Publish"}
                        </button>

                        <button
                            type="button"
                            class="blog-action-button delete"
                            data-action="delete"
                            data-id="${escapeHTML(blog.id)}"
                            title="Delete blog"
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
       OPEN ADD MODAL
    ===================================================== */

    function openAddModal() {
        if (!elements.modal) {
            return;
        }

        elements.modalTitle.textContent = "Add Blog Post";

        elements.form?.reset();

        elements.id.value = "";

        if (elements.date) {
            elements.date.value = getToday();
        }

        if (elements.status) {
            elements.status.value = "draft";
        }

        if (elements.featured) {
            elements.featured.checked = false;
        }

        elements.modal.hidden = false;

        requestAnimationFrame(() => {
            elements.title?.focus();
        });
    }


    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    function openEditModal(id) {
        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === id
        );

        if (!blog || !elements.modal) {
            return;
        }

        elements.modalTitle.textContent = "Edit Blog Post";

        elements.id.value = blog.id || "";
        elements.title.value = blog.title || "";
        elements.category.value = blog.category || "skincare";
        elements.author.value = blog.author || "";
        elements.excerpt.value = blog.excerpt || "";
        elements.content.value = blog.content || "";
        elements.image.value = blog.image || "";
        elements.date.value = blog.date || getToday();
        elements.status.value = blog.status || "draft";
        elements.featured.checked = blog.featured === true;

        elements.modal.hidden = false;

        requestAnimationFrame(() => {
            elements.title?.focus();
        });
    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeBlogModal() {
        if (elements.modal) {
            elements.modal.hidden = true;
        }
    }


    function closeViewModal() {
        if (elements.viewModal) {
            elements.viewModal.hidden = true;
        }
    }


    function closeDeleteModal() {
        if (elements.deleteModal) {
            elements.deleteModal.hidden = true;
        }

        deleteTargetId = null;
    }


    /* =====================================================
       SAVE BLOG
    ===================================================== */

    function saveBlog(event) {
        event.preventDefault();

        const title = elements.title.value.trim();
        const category = elements.category.value;
        const author = elements.author.value.trim();
        const excerpt = elements.excerpt.value.trim();
        const content = elements.content.value.trim();
        const image = elements.image.value.trim();
        const date = elements.date.value;
        const status = elements.status.value;
        const featured = elements.featured.checked;

        if (!title) {
            elements.title.focus();

            window.glowSkinAdminToast?.(
                "Please enter a blog title."
            );

            return;
        }

        if (!category) {
            elements.category.focus();

            window.glowSkinAdminToast?.(
                "Please select a category."
            );

            return;
        }

        if (!author) {
            elements.author.focus();

            window.glowSkinAdminToast?.(
                "Please enter the author name."
            );

            return;
        }

        if (!excerpt) {
            elements.excerpt.focus();

            window.glowSkinAdminToast?.(
                "Please enter a short description."
            );

            return;
        }

        if (!content) {
            elements.content.focus();

            window.glowSkinAdminToast?.(
                "Please enter the blog content."
            );

            return;
        }

        if (!date) {
            elements.date.focus();

            window.glowSkinAdminToast?.(
                "Please select a publish date."
            );

            return;
        }

        const blogs = getBlogs();

        const blogData = {
            id: elements.id.value || generateId(),
            title,
            category,
            author,
            excerpt,
            content,
            image,
            date,
            status: status === "published"
                ? "published"
                : "draft",
            featured
        };

        const existingIndex = blogs.findIndex(
            blog => blog.id === blogData.id
        );

        if (existingIndex >= 0) {
            blogs[existingIndex] = blogData;

            saveBlogs(blogs);
            closeBlogModal();

            window.glowSkinAdminToast?.(
                "Blog post updated successfully."
            );
        } else {
            blogs.unshift(blogData);

            saveBlogs(blogs);
            closeBlogModal();

            window.glowSkinAdminToast?.(
                "Blog post added successfully."
            );
        }

        renderTable();
    }


    /* =====================================================
       VIEW BLOG
    ===================================================== */

    function viewBlog(id) {
        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === id
        );

        if (!blog || !elements.viewModal) {
            return;
        }

        elements.viewCategory.textContent =
            getCategoryLabel(blog.category);

        elements.viewDate.textContent =
            formatDate(blog.date);

        elements.viewHeading.textContent =
            blog.title || "Untitled Blog";

        elements.viewExcerpt.textContent =
            blog.excerpt || "";

        elements.viewContent.textContent =
            blog.content || "";

        elements.viewAuthor.textContent =
            blog.author || "GlowSkin Team";

        elements.viewModal.hidden = false;
    }


    /* =====================================================
       FEATURED TOGGLE
    ===================================================== */

    function toggleFeatured(id) {
        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === id
        );

        if (!blog) {
            return;
        }

        blog.featured = !blog.featured;

        saveBlogs(blogs);
        renderTable();

        window.glowSkinAdminToast?.(
            blog.featured
                ? "Blog marked as featured."
                : "Blog removed from featured."
        );
    }


    /* =====================================================
       PUBLISH / DRAFT TOGGLE
    ===================================================== */

    function toggleStatus(id) {
        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === id
        );

        if (!blog) {
            return;
        }

        blog.status =
            blog.status === "published"
                ? "draft"
                : "published";

        saveBlogs(blogs);
        renderTable();

        window.glowSkinAdminToast?.(
            blog.status === "published"
                ? "Blog published successfully."
                : "Blog moved to draft."
        );
    }


    /* =====================================================
       DELETE
    ===================================================== */

    let deleteTargetId = null;


    function openDeleteModal(id) {
        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === id
        );

        if (!blog || !elements.deleteModal) {
            return;
        }

        deleteTargetId = id;

        elements.deleteName.textContent =
            blog.title || "this blog post";

        elements.deleteModal.hidden = false;
    }


    function deleteBlog() {
        if (!deleteTargetId) {
            return;
        }

        const blogs = getBlogs();

        const blog = blogs.find(
            item => item.id === deleteTargetId
        );

        const updatedBlogs = blogs.filter(
            item => item.id !== deleteTargetId
        );

        saveBlogs(updatedBlogs);

        closeDeleteModal();
        renderTable();

        window.glowSkinAdminToast?.(
            blog
                ? `"${blog.title}" deleted successfully.`
                : "Blog post deleted successfully."
        );
    }


    /* =====================================================
       TABLE ACTIONS
    ===================================================== */

    function handleTableAction(event) {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const id =
            button.dataset.id;

        if (!id) {
            return;
        }

        switch (action) {
            case "view":
                viewBlog(id);
                break;

            case "edit":
                openEditModal(id);
                break;

            case "feature":
                toggleFeatured(id);
                break;

            case "toggle":
                toggleStatus(id);
                break;

            case "delete":
                openDeleteModal(id);
                break;

            default:
                break;
        }
    }


    /* =====================================================
       FILTER EVENTS
    ===================================================== */

    function clearFilters() {
        if (elements.search) {
            elements.search.value = "";
        }

        if (elements.categoryFilter) {
            elements.categoryFilter.value = "all";
        }

        if (elements.statusFilter) {
            elements.statusFilter.value = "all";
        }

        renderTable();
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    function handleEscape(event) {
        if (event.key !== "Escape") {
            return;
        }

        if (
            elements.deleteModal &&
            !elements.deleteModal.hidden
        ) {
            closeDeleteModal();
            return;
        }

        if (
            elements.viewModal &&
            !elements.viewModal.hidden
        ) {
            closeViewModal();
            return;
        }

        if (
            elements.modal &&
            !elements.modal.hidden
        ) {
            closeBlogModal();
        }
    }


    /* =====================================================
       MODAL BACKDROP
    ===================================================== */

    function handleModalBackdrop(event) {
        if (event.target === elements.modal) {
            closeBlogModal();
        }

        if (event.target === elements.viewModal) {
            closeViewModal();
        }

        if (event.target === elements.deleteModal) {
            closeDeleteModal();
        }
    }


    /* =====================================================
       EVENTS
    ===================================================== */

    elements.addButton?.addEventListener(
        "click",
        openAddModal
    );

    elements.modalClose?.addEventListener(
        "click",
        closeBlogModal
    );

    elements.cancelButton?.addEventListener(
        "click",
        closeBlogModal
    );

    elements.form?.addEventListener(
        "submit",
        saveBlog
    );

    elements.tableBody?.addEventListener(
        "click",
        handleTableAction
    );

    elements.viewClose?.addEventListener(
        "click",
        closeViewModal
    );

    elements.viewCancel?.addEventListener(
        "click",
        closeViewModal
    );

    elements.deleteClose?.addEventListener(
        "click",
        closeDeleteModal
    );

    elements.cancelDelete?.addEventListener(
        "click",
        closeDeleteModal
    );

    elements.confirmDelete?.addEventListener(
        "click",
        deleteBlog
    );

    elements.clearFilters?.addEventListener(
        "click",
        clearFilters
    );

    elements.clearEmptyFilters?.addEventListener(
        "click",
        clearFilters
    );

    elements.search?.addEventListener(
        "input",
        renderTable
    );

    elements.categoryFilter?.addEventListener(
        "change",
        renderTable
    );

    elements.statusFilter?.addEventListener(
        "change",
        renderTable
    );

    elements.modal?.addEventListener(
        "click",
        handleModalBackdrop
    );

    elements.viewModal?.addEventListener(
        "click",
        handleModalBackdrop
    );

    elements.deleteModal?.addEventListener(
        "click",
        handleModalBackdrop
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );


    /* =====================================================
       STORAGE / CUSTOM EVENT REFRESH
    ===================================================== */

    window.addEventListener(
        "storage",
        function (event) {
            if (event.key === STORAGE_KEY) {
                renderTable();
            }
        }
    );


    window.addEventListener(
        "glowskinBlogsUpdated",
        function () {
            renderTable();
        }
    );


    document.addEventListener(
        "visibilitychange",
        function () {
            if (!document.hidden) {
                renderTable();
            }
        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    getBlogs();
    renderTable();

})();
