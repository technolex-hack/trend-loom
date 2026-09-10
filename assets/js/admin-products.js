/* =========================================================
   GLOWSKIN ADMIN — PRODUCTS JAVASCRIPT
   ========================================================= */

(function () {
  "use strict";


  /* =======================================================
     STORAGE
     ======================================================= */

  const PRODUCTS_KEY = "glowskin_products";

  const DEFAULT_PRODUCTS = [
    {
      id: "vitamin-c-brightening-serum",
      name: "Vitamin C Brightening Serum",
      category: "serums",
      price: 599,
      mrp: 799,
      stock: 35,
      status: "active",
      image: "../assets/images/products/vitamin-c-serum-1.jpg",
      description:
        "A brightening serum designed to improve dull-looking skin and the appearance of dark spots.",
      featured: true
    },

    {
      id: "daily-sunscreen-spf-50",
      name: "Daily Sunscreen SPF 50",
      category: "sunscreen",
      price: 479,
      mrp: 599,
      stock: 42,
      status: "active",
      image: "../assets/images/products/sunscreen-1.jpg",
      description:
        "Lightweight daily sunscreen with SPF 50 protection.",
      featured: true
    },

    {
      id: "niacinamide-pore-serum",
      name: "Niacinamide Pore Serum",
      category: "serums",
      price: 549,
      mrp: 549,
      stock: 28,
      status: "active",
      image: "../assets/images/products/niacinamide-serum-1.jpg",
      description:
        "Niacinamide serum for the appearance of pores and uneven-looking skin.",
      featured: true
    },

    {
      id: "daily-hydrating-moisturizer",
      name: "Daily Hydrating Moisturizer",
      category: "moisturizers",
      price: 449,
      mrp: 449,
      stock: 31,
      status: "active",
      image: "../assets/images/products/moisturizer-1.jpg",
      description:
        "A daily moisturizer that helps keep skin feeling soft and hydrated.",
      featured: false
    },

    {
      id: "gentle-foaming-face-wash",
      name: "Gentle Foaming Face Wash",
      category: "face-wash",
      price: 349,
      mrp: 349,
      stock: 50,
      status: "active",
      image: "../assets/images/products/face-wash-1.jpg",
      description:
        "A gentle foaming cleanser suitable for everyday cleansing.",
      featured: false
    },

    {
      id: "hydrating-hyaluronic-serum",
      name: "Hydrating Hyaluronic Serum",
      category: "serums",
      price: 699,
      mrp: 699,
      stock: 24,
      status: "active",
      image: "../assets/images/products/hyaluronic-serum-1.jpg",
      description:
        "Hydrating serum designed to support soft and comfortable-looking skin.",
      featured: false
    },

    {
      id: "brightening-face-cleanser",
      name: "Brightening Face Cleanser",
      category: "face-wash",
      price: 399,
      mrp: 399,
      stock: 22,
      status: "active",
      image: "../assets/images/products/brightening-cleanser-1.jpg",
      description:
        "A refreshing cleanser for dull-looking skin.",
      featured: false
    },

    {
      id: "barrier-repair-moisturizer",
      name: "Barrier Repair Moisturizer",
      category: "moisturizers",
      price: 799,
      mrp: 799,
      stock: 15,
      status: "active",
      image: "../assets/images/products/barrier-moisturizer-1.jpg",
      description:
        "A rich moisturizer designed for dry and uncomfortable-feeling skin.",
      featured: false
    },

    {
      id: "hydrating-rose-toner",
      name: "Hydrating Rose Toner",
      category: "toners",
      price: 429,
      mrp: 429,
      stock: 19,
      status: "active",
      image: "../assets/images/products/rose-toner-1.jpg",
      description:
        "A refreshing toner for a hydrated and comfortable skin feel.",
      featured: false
    },

    {
      id: "acne-control-face-wash",
      name: "Acne Control Face Wash",
      category: "face-wash",
      price: 499,
      mrp: 599,
      stock: 18,
      status: "active",
      image: "../assets/images/products/acne-face-wash-1.jpg",
      description:
        "A cleansing face wash designed for acne-prone skin.",
      featured: false
    },

    {
      id: "spf-50-matte-sunscreen",
      name: "SPF 50 Matte Sunscreen",
      category: "sunscreen",
      price: 599,
      mrp: 599,
      stock: 27,
      status: "active",
      image: "../assets/images/products/matte-sunscreen-1.jpg",
      description:
        "A lightweight matte-finish sunscreen for daily use.",
      featured: false
    },

    {
      id: "nourishing-lip-care-balm",
      name: "Nourishing Lip Care Balm",
      category: "lip-care",
      price: 299,
      mrp: 299,
      stock: 45,
      status: "active",
      image: "../assets/images/products/lip-balm-1.jpg",
      description:
        "A nourishing lip balm for soft and moisturized lips.",
      featured: false
    }
  ];


  /* =======================================================
     STATE
     ======================================================= */

  let products = [];

  let deleteProductId = null;


  /* =======================================================
     DOM
     ======================================================= */

  const tableBody =
    document.getElementById(
      "productsTableBody"
    );

  const emptyState =
    document.getElementById(
      "productsEmptyState"
    );

  const searchInput =
    document.getElementById(
      "productSearch"
    );

  const categoryFilter =
    document.getElementById(
      "productCategory"
    );

  const statusFilter =
    document.getElementById(
      "productStatus"
    );

  const resultCount =
    document.getElementById(
      "productResultCount"
    );

  const clearFiltersButton =
    document.getElementById(
      "clearProductFilters"
    );

  const addProductButton =
    document.getElementById(
      "addProductButton"
    );

  const emptyAddProductButton =
    document.getElementById(
      "emptyAddProductButton"
    );

  const productModal =
    document.getElementById(
      "productModal"
    );

  const productModalTitle =
    document.getElementById(
      "productModalTitle"
    );

  const productModalClose =
    document.getElementById(
      "productModalClose"
    );

  const cancelProductButton =
    document.getElementById(
      "cancelProductButton"
    );

  const productForm =
    document.getElementById(
      "productForm"
    );

  const productIdInput =
    document.getElementById(
      "productId"
    );

  const productNameInput =
    document.getElementById(
      "productName"
    );

  const formCategoryInput =
    document.getElementById(
      "formProductCategory"
    );

  const productPriceInput =
    document.getElementById(
      "productPrice"
    );

  const productMrpInput =
    document.getElementById(
      "productMrp"
    );

  const productStockInput =
    document.getElementById(
      "productStock"
    );

  const formStatusInput =
    document.getElementById(
      "formProductStatus"
    );

  const productImageInput =
    document.getElementById(
      "productImage"
    );

  const productDescriptionInput =
    document.getElementById(
      "productDescription"
    );

  const productFeaturedInput =
    document.getElementById(
      "productFeatured"
    );

  const deleteModal =
    document.getElementById(
      "deleteProductModal"
    );

  const deleteProductName =
    document.getElementById(
      "deleteProductName"
    );

  const cancelDeleteButton =
    document.getElementById(
      "cancelDeleteButton"
    );

  const confirmDeleteButton =
    document.getElementById(
      "confirmDeleteButton"
    );


  /* =======================================================
     STORAGE FUNCTIONS
     ======================================================= */

  function loadProducts() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            PRODUCTS_KEY
          )
        );


      if (Array.isArray(saved)) {

        products = saved;

        return;

      }

    } catch (error) {
      // Use defaults below.
    }


    products =
      DEFAULT_PRODUCTS.map(
        function (product) {
          return {
            ...product
          };
        }
      );


    saveProducts();

  }


  function saveProducts() {

    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(products)
    );


    /*
     * Notify other GlowSkin tabs/pages.
     */

    window.dispatchEvent(
      new CustomEvent(
        "glowskinProductsUpdated"
      )
    );

  }


  /* =======================================================
     HELPERS
     ======================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function formatPrice(value) {

    return "₹" +
      (Number(value) || 0)
        .toLocaleString("en-IN");

  }


  function categoryName(category) {

    const names = {

      "face-wash": "Face Wash",

      "serums": "Serums",

      "moisturizers": "Moisturizers",

      "sunscreen": "Sunscreen",

      "toners": "Toners",

      "lip-care": "Lip Care"

    };


    return (
      names[category] ||
      category ||
      "Uncategorized"
    );

  }


  function getStatusClass(status) {

    if (
      status === "out-of-stock"
    ) {
      return "out-of-stock";
    }


    if (
      status === "draft"
    ) {
      return "draft";
    }


    return "active";

  }


  function getStockClass(stock) {

    const quantity =
      Number(stock) || 0;


    if (quantity <= 0) {
      return "stock-empty";
    }


    if (quantity <= 10) {
      return "stock-low";
    }


    return "stock-good";

  }


  function createProductId(name) {

    const base =
      String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      "product";


    let id = base;

    let number = 2;


    while (
      products.some(
        function (product) {
          return product.id === id;
        }
      )
    ) {

      id =
        base +
        "-" +
        number;

      number++;

    }


    return id;

  }


  /* =======================================================
     RENDER PRODUCTS
     ======================================================= */

  function getFilteredProducts() {

    const search =
      String(
        searchInput
          ? searchInput.value
          : ""
      )
        .trim()
        .toLowerCase();


    const category =
      categoryFilter
        ? categoryFilter.value
        : "all";


    const status =
      statusFilter
        ? statusFilter.value
        : "all";


    return products.filter(
      function (product) {

        const matchesSearch =
          !search ||
          String(product.name)
            .toLowerCase()
            .includes(search) ||
          String(product.id)
            .toLowerCase()
            .includes(search);


        const matchesCategory =
          category === "all" ||
          product.category === category;


        const matchesStatus =
          status === "all" ||
          product.status === status;


        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );

      }
    );

  }


  function renderProducts() {

    if (!tableBody) {
      return;
    }


    const filtered =
      getFilteredProducts();


    if (resultCount) {

      resultCount.textContent =
        filtered.length +
        (
          filtered.length === 1
            ? " product"
            : " products"
        );

    }


    if (!filtered.length) {

      tableBody.innerHTML = "";

      if (emptyState) {
        emptyState.style.display =
          "block";
      }

      return;

    }


    if (emptyState) {
      emptyState.style.display =
        "none";
    }


    tableBody.innerHTML =
      filtered
        .map(
          function (product) {

            const stock =
              Number(product.stock) || 0;


            const image =
              product.image
                ? `
                  <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                  >
                `
                : `
                  <span class="admin-product-image-placeholder">
                    G
                  </span>
                `;


            return `
              <tr>

                <td>

                  <div class="admin-product-cell">

                    <div class="admin-product-image">

                      ${image}

                    </div>


                    <div class="admin-product-info">

                      <span class="admin-product-name">
                        ${escapeHTML(product.name)}
                      </span>

                      <span class="admin-product-id">
                        ID: ${escapeHTML(product.id)}
                      </span>

                    </div>

                  </div>

                </td>


                <td>

                  <span class="admin-product-category">
                    ${escapeHTML(
                      categoryName(product.category)
                    )}
                  </span>

                </td>


                <td>

                  <span class="admin-product-price">
                    ${formatPrice(product.price)}
                  </span>

                  ${
                    Number(product.mrp) >
                    Number(product.price)
                      ? `
                        <span class="admin-product-mrp">
                          ${formatPrice(product.mrp)}
                        </span>
                      `
                      : ""
                  }

                </td>


                <td>

                  <span
                    class="admin-product-stock ${getStockClass(stock)}"
                  >
                    ${stock}
                  </span>

                </td>


                <td>

                  <span
                    class="admin-product-status ${getStatusClass(product.status)}"
                  >
                    ${escapeHTML(
                      product.status === "out-of-stock"
                        ? "Out of Stock"
                        : product.status
                    )}
                  </span>

                </td>


                <td>

                  <div class="admin-product-actions">

                    <button
                      type="button"
                      class="admin-product-action"
                      data-action="edit"
                      data-id="${escapeHTML(product.id)}"
                      aria-label="Edit ${escapeHTML(product.name)}"
                      title="Edit"
                    >
                      ✎
                    </button>


                    <button
                      type="button"
                      class="admin-product-action delete"
                      data-action="delete"
                      data-id="${escapeHTML(product.id)}"
                      aria-label="Delete ${escapeHTML(product.name)}"
                      title="Delete"
                    >
                      ×
                    </button>

                  </div>

                </td>

              </tr>
            `;

          }
        )
        .join("");


    setupImageFallbacks();

  }


  /* =======================================================
     IMAGE FALLBACK
     ======================================================= */

  function setupImageFallbacks() {

    const images =
      tableBody
        ? tableBody.querySelectorAll(
            ".admin-product-image img"
          )
        : [];


    images.forEach(
      function (image) {

        image.addEventListener(
          "error",
          function () {

            const wrapper =
              image.parentElement;


            if (!wrapper) {
              return;
            }


            wrapper.innerHTML =
              `
                <span class="admin-product-image-placeholder">
                  G
                </span>
              `;

          },
          {
            once: true
          }
        );

      }
    );

  }


  /* =======================================================
     OPEN PRODUCT MODAL
     ======================================================= */

  function openProductModal(product) {

    if (!productModal) {
      return;
    }


    if (product) {

      productModalTitle.textContent =
        "Edit Product";


      productIdInput.value =
        product.id || "";


      productNameInput.value =
        product.name || "";


      formCategoryInput.value =
        product.category || "";


      productPriceInput.value =
        product.price ?? "";


      productMrpInput.value =
        product.mrp ?? "";


      productStockInput.value =
        product.stock ?? "";


      formStatusInput.value =
        product.status || "active";


      productImageInput.value =
        product.image || "";


      productDescriptionInput.value =
        product.description || "";


      productFeaturedInput.checked =
        Boolean(product.featured);

    } else {

      productModalTitle.textContent =
        "Add Product";


      productForm.reset();

      productIdInput.value =
        "";

      formStatusInput.value =
        "active";

      productFeaturedInput.checked =
        false;

    }


    productModal.classList.add(
      "active"
    );

    productModal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "admin-modal-open"
    );


    setTimeout(
      function () {

        if (productNameInput) {
          productNameInput.focus();
        }

      },
      50
    );

  }


  /* =======================================================
     CLOSE PRODUCT MODAL
     ======================================================= */

  function closeProductModal() {

    if (!productModal) {
      return;
    }


    productModal.classList.remove(
      "active"
    );

    productModal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "admin-modal-open"
    );


    if (productForm) {
      productForm.reset();
    }

  }


  /* =======================================================
     VALIDATE PRODUCT
     ======================================================= */

  function validateProduct() {

    let valid = true;


    const name =
      productNameInput.value.trim();


    const category =
      formCategoryInput.value;


    const price =
      Number(
        productPriceInput.value
      );


    const mrp =
      Number(
        productMrpInput.value
      ) || price;


    const stock =
      Number(
        productStockInput.value
      );


    const nameError =
      document.getElementById(
        "productNameError"
      );


    if (!name) {

      valid = false;

      if (nameError) {
        nameError.textContent =
          "Product name is required.";
      }

    } else if (name.length < 2) {

      valid = false;

      if (nameError) {
        nameError.textContent =
          "Product name is too short.";
      }

    } else {

      if (nameError) {
        nameError.textContent = "";
      }

    }


    if (!category) {

      valid = false;

      formCategoryInput.style.borderColor =
        "var(--admin-danger)";

    } else {

      formCategoryInput.style.borderColor =
        "";

    }


    if (
      !Number.isFinite(price) ||
      price < 0
    ) {

      valid = false;

      productPriceInput.style.borderColor =
        "var(--admin-danger)";

    } else {

      productPriceInput.style.borderColor =
        "";

    }


    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {

      valid = false;

      productStockInput.style.borderColor =
        "var(--admin-danger)";

    } else {

      productStockInput.style.borderColor =
        "";

    }


    if (
      mrp < price
    ) {

      valid = false;

      productMrpInput.style.borderColor =
        "var(--admin-danger)";

    } else {

      productMrpInput.style.borderColor =
        "";

    }


    return valid;

  }


  /* =======================================================
     SAVE PRODUCT
     ======================================================= */

  function saveProduct(event) {

    event.preventDefault();


    if (!validateProduct()) {

      if (
        typeof window.glowSkinAdminToast ===
        "function"
      ) {

        window.glowSkinAdminToast(
          "Please check the product details."
        );

      }

      return;

    }


    const name =
      productNameInput.value.trim();


    const category =
      formCategoryInput.value;


    const price =
      Number(
        productPriceInput.value
      );


    const mrp =
      Number(
        productMrpInput.value
      ) || price;


    const stock =
      Number(
        productStockInput.value
      );


    const selectedStatus =
      formStatusInput.value;


    let status =
      selectedStatus;


    /*
     * If stock is zero, automatically
     * mark product as out of stock.
     */

    if (
      stock === 0 &&
      selectedStatus === "active"
    ) {

      status =
        "out-of-stock";

    }


    const productData = {

      id:
        productIdInput.value ||
        createProductId(name),

      name,

      category,

      price,

      mrp,

      stock,

      status,

      image:
        productImageInput.value.trim(),

      description:
        productDescriptionInput.value.trim(),

      featured:
        productFeaturedInput.checked

    };


    const existingIndex =
      products.findIndex(
        function (product) {

          return (
            product.id ===
            productData.id
          );

        }
      );


    if (
      existingIndex !== -1
    ) {

      products[existingIndex] =
        {
          ...products[existingIndex],
          ...productData
        };


      showToast(
        "Product updated successfully."
      );

    } else {

      products.unshift(
        productData
      );


      showToast(
        "Product added successfully."
      );

    }


    saveProducts();

    renderProducts();

    closeProductModal();

  }


  /* =======================================================
     DELETE PRODUCT
     ======================================================= */

  function openDeleteModal(productId) {

    const product =
      products.find(
        function (item) {
          return item.id === productId;
        }
      );


    if (!product) {
      return;
    }


    deleteProductId =
      productId;


    if (deleteProductName) {

      deleteProductName.textContent =
        product.name;

    }


    if (deleteModal) {

      deleteModal.classList.add(
        "active"
      );

      deleteModal.setAttribute(
        "aria-hidden",
        "false"
      );

    }


    document.body.classList.add(
      "admin-modal-open"
    );

  }


  function closeDeleteModal() {

    deleteProductId =
      null;


    if (deleteModal) {

      deleteModal.classList.remove(
        "active"
      );

      deleteModal.setAttribute(
        "aria-hidden",
        "true"
      );

    }


    document.body.classList.remove(
      "admin-modal-open"
    );

  }


  function deleteProduct() {

    if (!deleteProductId) {
      return;
    }


    const product =
      products.find(
        function (item) {
          return item.id ===
            deleteProductId;
        }
      );


    products =
      products.filter(
        function (item) {
          return item.id !==
            deleteProductId;
        }
      );


    saveProducts();

    renderProducts();

    closeDeleteModal();


    showToast(
      product
        ? `"${product.name}" deleted.`
        : "Product deleted."
    );

  }


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    if (
      typeof window.glowSkinAdminToast ===
      "function"
    ) {

      window.glowSkinAdminToast(
        message
      );

      return;

    }


    /*
     * Fallback toast in case admin.js
     * is unavailable.
     */

    let toast =
      document.getElementById(
        "productsFallbackToast"
      );


    if (!toast) {

      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "productsFallbackToast";


      toast.style.position =
        "fixed";

      toast.style.right =
        "20px";

      toast.style.bottom =
        "20px";

      toast.style.zIndex =
        "99999";

      toast.style.padding =
        "13px 18px";

      toast.style.background =
        "#211914";

      toast.style.color =
        "#ffffff";

      toast.style.borderRadius =
        "10px";

      toast.style.fontSize =
        "13px";

      toast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.15)";


      document.body.appendChild(
        toast
      );

    }


    toast.textContent =
      message;


    toast.style.display =
      "block";


    clearTimeout(
      toast._timer
    );


    toast._timer =
      setTimeout(
        function () {

          toast.style.display =
            "none";

        },
        3000
      );

  }


  /* =======================================================
     EVENTS — SEARCH / FILTER
     ======================================================= */

  function setupFilters() {

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        renderProducts
      );

    }


    if (categoryFilter) {

      categoryFilter.addEventListener(
        "change",
        renderProducts
      );

    }


    if (statusFilter) {

      statusFilter.addEventListener(
        "change",
        renderProducts
      );

    }


    if (clearFiltersButton) {

      clearFiltersButton.addEventListener(
        "click",
        function () {

          if (searchInput) {
            searchInput.value =
              "";
          }


          if (categoryFilter) {
            categoryFilter.value =
              "all";
          }


          if (statusFilter) {
            statusFilter.value =
              "all";
          }


          renderProducts();

        }
      );

    }

  }


  /* =======================================================
     EVENTS — PRODUCT ACTIONS
     ======================================================= */

  function setupTableActions() {

    if (!tableBody) {
      return;
    }


    tableBody.addEventListener(
      "click",
      function (event) {

        const button =
          event.target.closest(
            "[data-action]"
          );


        if (!button) {
          return;
        }


        const action =
          button.dataset.action;


        const id =
          button.dataset.id;


        if (
          action === "edit"
        ) {

          const product =
            products.find(
              function (item) {
                return item.id === id;
              }
            );


          if (product) {
            openProductModal(
              product
            );
          }

        }


        if (
          action === "delete"
        ) {

          openDeleteModal(id);

        }

      }
    );

  }


  /* =======================================================
     EVENTS — MODALS
     ======================================================= */

  function setupModalEvents() {

    if (addProductButton) {

      addProductButton.addEventListener(
        "click",
        function () {
          openProductModal();
        }
      );

    }


    if (emptyAddProductButton) {

      emptyAddProductButton.addEventListener(
        "click",
        function () {
          openProductModal();
        }
      );

    }


    if (productModalClose) {

      productModalClose.addEventListener(
        "click",
        closeProductModal
      );

    }


    if (cancelProductButton) {

      cancelProductButton.addEventListener(
        "click",
        closeProductModal
      );

    }


    if (productForm) {

      productForm.addEventListener(
        "submit",
        saveProduct
      );

    }


    if (cancelDeleteButton) {

      cancelDeleteButton.addEventListener(
        "click",
        closeDeleteModal
      );

    }


    if (confirmDeleteButton) {

      confirmDeleteButton.addEventListener(
        "click",
        deleteProduct
      );

    }


    /*
     * Close modal when clicking backdrop.
     */

    [productModal, deleteModal]
      .forEach(
        function (modal) {

          if (!modal) {
            return;
          }


          const backdrop =
            modal.querySelector(
              ".admin-modal-backdrop"
            );


          if (backdrop) {

            backdrop.addEventListener(
              "click",
              function () {

                if (
                  modal ===
                  productModal
                ) {

                  closeProductModal();

                } else {

                  closeDeleteModal();

                }

              }
            );

          }

        }
      );

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  function setupKeyboard() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key !==
          "Escape"
        ) {
          return;
        }


        if (
          productModal &&
          productModal.classList.contains(
            "active"
          )
        ) {

          closeProductModal();

          return;

        }


        if (
          deleteModal &&
          deleteModal.classList.contains(
            "active"
          )
        ) {

          closeDeleteModal();

        }

      }
    );

  }


  /* =======================================================
     PRODUCT UPDATE FROM OTHER TAB
     ======================================================= */

  function setupStorageListener() {

    window.addEventListener(
      "storage",
      function (event) {

        if (
          event.key ===
          PRODUCTS_KEY
        ) {

          loadProducts();

          renderProducts();

        }

      }
    );


    window.addEventListener(
      "glowskinProductsUpdated",
      function () {

        /*
         * Do not reload from storage here
         * because this event is fired after
         * saveProducts() in this same page.
         */

        renderProducts();

      }
    );

  }


  /* =======================================================
     PAGE VISIBILITY
     ======================================================= */

  function setupVisibilityRefresh() {

    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
          "visible"
        ) {

          loadProducts();

          renderProducts();

        }

      }
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    loadProducts();

    renderProducts();

    setupFilters();

    setupTableActions();

    setupModalEvents();

    setupKeyboard();

    setupStorageListener();

    setupVisibilityRefresh();

  }


  /* =======================================================
     DOM READY
     ======================================================= */

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
