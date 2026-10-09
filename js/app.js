// ==========================================================================
// Stackly - Core Application Logic (Multi-Page Supported)
// Pure Vanilla JavaScript (ES6+) - Frontend Only
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Helper to load localStorage with fallback
  function getStoredJson(key, fallbackKey, defaultVal) {
    try {
      const data = localStorage.getItem(key) || localStorage.getItem(fallbackKey);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  // Application State
  const state = {
    selectedDuration: "weekly", // 'single' | 'weekly' | 'monthly'
    planFilter: "all",          // 'all' | 'veg' | 'nonveg' | 'fitness'
    menuFilter: "all",
    searchQuery: "",
    cart: getStoredJson("stackly_cart", "rasoibox_cart", []),
    appliedCoupon: getStoredJson("stackly_coupon", "rasoibox_coupon", null),
    activeOrder: getStoredJson("stackly_active_order", "rasoibox_active_order", null),
    selectedSubPlan: null
  };

  // Coupons database
  const AVAILABLE_COUPONS = {
    "FIRSTTIFFIN": { code: "FIRSTTIFFIN", type: "percent", value: 20, desc: "20% off on your entire cart" },
    "FREEDEL": { code: "FREEDEL", type: "free_delivery", value: 30, desc: "Free Delivery on your order" },
    "DESI50": { code: "DESI50", type: "flat", value: 50, desc: "Flat ₹50 instant discount" }
  };

  // DOM Elements (may be null depending on the page)
  const plansGrid = document.getElementById("plansGrid");
  const menuItemsGrid = document.getElementById("menuItemsGrid");
  const todayDishList = document.getElementById("todayDishList");
  const reviewsGrid = document.getElementById("reviewsGrid");
  const faqList = document.getElementById("faqList");
  const cartBadge = document.getElementById("cartBadge");

  // Modals
  const cartModal = document.getElementById("cartModal");
  const checkoutModal = document.getElementById("checkoutModal");
  const subModal = document.getElementById("subModal");
  const trackerModal = document.getElementById("trackerModal");

  // Dedicated Cart Page Elements
  const cartPageItemsList = document.getElementById("cartPageItemsList");
  const cartPageEmptyState = document.getElementById("cartPageEmptyState");
  const cartPageContentWrapper = document.getElementById("cartPageContentWrapper");

  // Cart Modal Elements
  const cartItemsList = document.getElementById("cartItemsList");
  const cartEmptyState = document.getElementById("cartEmptyState");
  const cartContentWrapper = document.getElementById("cartContentWrapper");
  const cartFooter = document.getElementById("cartFooter");

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================
  function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "🔔";
    if (type === "success") icon = "✅";
    if (type === "warn") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================================
  // Cart Badge Counter (Present on all pages)
  // ==========================================================================
  function updateBadge() {
    if (cartBadge) {
      const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
      cartBadge.textContent = totalCount;
    }
  }

  // ==========================================================================
  // Render: Today's Live Kitchen Thali
  // ==========================================================================
  function renderTodaySpecial() {
    if (!todayDishList || typeof TODAY_SCHEDULE === "undefined") return;
    todayDishList.innerHTML = TODAY_SCHEDULE.dishes.map(dish => `
      <li class="today-dish-item">
        <span class="dish-name">✨ ${dish.name}</span>
        <span class="dish-type">${dish.type}</span>
      </li>
    `).join("");
  }

  const btnOrderTodaySpecial = document.getElementById("btnOrderTodaySpecial");
  if (btnOrderTodaySpecial) {
    btnOrderTodaySpecial.addEventListener("click", () => {
      addToCart({
        id: "today-thali-special",
        title: "Today's Live Lunch Thali (Special)",
        subtitle: "Freshly Cooked Homely Meal",
        price: 120,
        veg: true,
        type: "meal",
        image: "images/food/photo-1546833999-b9f581a1996d.webp"
      });
      showToast("Today's Lunch Thali added to your cart!", "success");
    });
  }

  // ==========================================================================
  // Render: Tiffin Subscription Plans (plans.html & index.html)
  // ==========================================================================
  function renderPlans() {
    if (!plansGrid || typeof TIFFIN_PLANS === "undefined") return;

    let filtered = TIFFIN_PLANS.filter(plan => {
      if (state.planFilter === "all") return true;
      if (state.planFilter === "veg") return plan.veg === true;
      if (state.planFilter === "nonveg") return plan.veg === false;
      if (state.planFilter === "fitness") return plan.fitness === true || plan.id.startsWith("plan-fitness");
      return true;
    });

    plansGrid.innerHTML = filtered.map(plan => {
      let price = plan.pricing[state.selectedDuration];
      let periodLabel = state.selectedDuration === "single" ? "/ trial meal" :
                         state.selectedDuration === "weekly" ? "/ 7-day plan" : "/ 30-day plan";

      return `
        <div class="plan-card" data-id="${plan.id}">
          <div class="plan-card-img-wrapper">
            <img src="${plan.image}" alt="${plan.title}" loading="lazy">
            <span class="plan-badge ${plan.badgeColor}">${plan.badge}</span>
            <div class="diet-indicator ${plan.veg ? 'veg' : 'nonveg'}" title="${plan.veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}"></div>
          </div>

          <div class="plan-body">
            <div class="plan-meta">
              <div class="plan-rating">
                <span class="star">★</span>
                <span>${plan.rating}</span>
                <span style="color: var(--muted); font-size: 0.78rem;">(${plan.reviewsCount})</span>
              </div>
              <div class="plan-calories">🔥 ${plan.calories}</div>
            </div>

            <h3 class="plan-title">${plan.title}</h3>
            <p class="plan-desc">${plan.subtitle}</p>

            ${plan.dishesHighlight && plan.dishesHighlight.length > 0 ? `
              <div class="plan-dish-tags" aria-label="Key dishes included">
                ${plan.dishesHighlight.map(dish => `<span class="plan-dish-tag">✨ ${dish}</span>`).join("")}
              </div>
            ` : ""}

            <div class="includes-header">What's in the Dabba:</div>
            <ul class="plan-includes-list">
              ${plan.includes.map(inc => `<li>${inc}</li>`).join("")}
            </ul>

            <div class="plan-footer">
              <div class="plan-price-block">
                <span class="price-label">Starting at</span>
                <span class="price-val">₹${price}</span>
                <span class="price-period">${periodLabel}</span>
              </div>
              <button class="btn-plan-action btn-subscribe" data-id="${plan.id}">
                Subscribe →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach Subscribe Listeners
    plansGrid.querySelectorAll(".btn-subscribe").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const planId = e.currentTarget.getAttribute("data-id");
        openSubscriptionModal(planId);
      });
    });
  }

  // Duration Tabs Listener
  const durationTabs = document.querySelectorAll(".duration-tab");
  durationTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      durationTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.selectedDuration = tab.getAttribute("data-duration");
      renderPlans();
    });
  });

  // Diet Filter Buttons
  const dietFilterBtns = document.querySelectorAll("#planDietFilters .filter-btn");
  dietFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dietFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.planFilter = btn.getAttribute("data-filter");
      renderPlans();
    });
  });

  // ==========================================================================
  // Subscription Modal Logic
  // ==========================================================================
  function openSubscriptionModal(planId) {
    if (!subModal || typeof TIFFIN_PLANS === "undefined") {
      // If modal is not on this page, redirect to plans.html
      window.location.href = `plans.html#${planId}`;
      return;
    }

    const plan = TIFFIN_PLANS.find(p => p.id === planId);
    if (!plan) return;

    state.selectedSubPlan = plan;

    document.getElementById("subModalPlanName").textContent = plan.title;
    document.getElementById("subModalPlanDesc").textContent = plan.subtitle;
    document.getElementById("subDurationSelect").value = state.selectedDuration;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDateInput = document.getElementById("subStartDate");
    if (startDateInput) startDateInput.value = tomorrow.toISOString().split("T")[0];

    updateSubscriptionModalPrice();
    subModal.classList.add("active");
  }

  function updateSubscriptionModalPrice() {
    if (!state.selectedSubPlan) return;
    const duration = document.getElementById("subDurationSelect").value;
    const mealTime = document.getElementById("subMealTiming").value;

    let basePrice = state.selectedSubPlan.pricing[duration];
    let multiplier = mealTime === "Both Lunch & Dinner" ? 2 : 1;
    let finalPrice = basePrice * multiplier;

    const priceElem = document.getElementById("subCalculatedPrice");
    if (priceElem) priceElem.textContent = `₹${finalPrice}`;
  }

  const subDurationSelect = document.getElementById("subDurationSelect");
  if (subDurationSelect) subDurationSelect.addEventListener("change", updateSubscriptionModalPrice);

  const subMealTiming = document.getElementById("subMealTiming");
  if (subMealTiming) subMealTiming.addEventListener("change", updateSubscriptionModalPrice);

  const btnCloseSubModal = document.getElementById("btnCloseSubModal");
  if (btnCloseSubModal) btnCloseSubModal.addEventListener("click", () => subModal.classList.remove("active"));

  const btnCancelSub = document.getElementById("btnCancelSub");
  if (btnCancelSub) btnCancelSub.addEventListener("click", () => subModal.classList.remove("active"));

  const btnAddSubToCart = document.getElementById("btnAddSubToCart");
  if (btnAddSubToCart) {
    btnAddSubToCart.addEventListener("click", () => {
      const plan = state.selectedSubPlan;
      const duration = document.getElementById("subDurationSelect").value;
      const mealTime = document.getElementById("subMealTiming").value;
      const startDate = document.getElementById("subStartDate") ? document.getElementById("subStartDate").value : "Tomorrow";

      let basePrice = plan.pricing[duration];
      let multiplier = mealTime === "Both Lunch & Dinner" ? 2 : 1;
      let finalPrice = basePrice * multiplier;

      const subItem = {
        id: `${plan.id}-${duration}-${mealTime.replace(/\s+/g, "_")}`,
        title: `${plan.title} (${duration.toUpperCase()})`,
        subtitle: `${mealTime} | Starts: ${startDate}`,
        price: finalPrice,
        veg: plan.veg,
        type: "subscription",
        image: plan.image
      };

      addToCart(subItem);
      subModal.classList.remove("active");
      showToast(`Subscription to ${plan.title} added!`, "success");
      
      // If on plans.html, offer to go to cart or open modal
      if (cartModal) openCartModal();
      else window.location.href = "cart.html";
    });
  }

  // ==========================================================================
  // Render: A La Carte & Instant Food Delivery Menu (menu.html & index.html)
  // ==========================================================================
  function renderMenuItems() {
    if (!menuItemsGrid || typeof MENU_ITEMS === "undefined") return;

    let items = MENU_ITEMS.filter(item => {
      const matchesCategory = state.menuFilter === "all" || item.category === state.menuFilter;
      const query = state.searchQuery.toLowerCase().trim();
      const matchesSearch = query === "" ||
                            item.name.toLowerCase().includes(query) ||
                            item.description.toLowerCase().includes(query) ||
                            (item.tag && item.tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (items.length === 0) {
      menuItemsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #FFF; border-radius: var(--radius-lg); border: 1px solid var(--border);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🍲</div>
          <h4 style="font-weight: 800; color: var(--dark); margin-bottom: 4px;">No dishes match your search</h4>
          <p style="color: var(--muted); font-size: 0.9rem;">Try searching for "Paneer", "Paratha", "Khichdi", or switch categories.</p>
        </div>
      `;
      return;
    }

    menuItemsGrid.innerHTML = items.map(item => {
      const cartItem = state.cart.find(c => c.id === item.id);
      const inCart = !!cartItem;
      const qty = inCart ? cartItem.qty : 0;

      return `
        <div class="food-card" data-id="${item.id}">
          <div class="food-card-img-wrapper">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            ${item.tag ? `<span class="food-tag-badge">${item.tag}</span>` : ''}
            <div class="diet-indicator ${item.veg ? 'veg' : 'nonveg'}" style="position: absolute; top: 12px; right: 12px;" title="${item.veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}"></div>
          </div>

          <div class="food-card-body">
            <div class="food-header">
              <h4 class="food-title">${item.name}</h4>
            </div>

            <div class="food-meta">
              <div class="plan-rating">
                <span class="star">★</span>
                <span>${item.rating}</span>
              </div>
              <div class="prep-time">⏱️ ${item.prepTime}</div>
            </div>

            <p class="food-desc">${item.description}</p>

            <div class="food-footer">
              <div class="food-price">₹${item.price}</div>
              <div class="food-action-area">
                ${!inCart ? `
                  <button class="btn-add-cart" data-id="${item.id}">Add +</button>
                ` : `
                  <div class="qty-stepper">
                    <button class="qty-btn btn-minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${qty}</span>
                    <button class="qty-btn btn-plus" data-id="${item.id}">+</button>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach Click Handlers
    menuItemsGrid.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const food = MENU_ITEMS.find(m => m.id === id);
        if (food) {
          addToCart({
            id: food.id,
            title: food.name,
            subtitle: "Single Portion Meal",
            price: food.price,
            veg: food.veg,
            type: "dish",
            image: food.image
          });
          renderMenuItems();
        }
      });
    });

    menuItemsGrid.querySelectorAll(".btn-plus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        updateCartQty(id, 1);
        renderMenuItems();
      });
    });

    menuItemsGrid.querySelectorAll(".btn-minus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        updateCartQty(id, -1);
        renderMenuItems();
      });
    });
  }

  // Category Tabs Listener
  const categoryTabs = document.querySelectorAll(".category-tab");
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.menuFilter = tab.getAttribute("data-category");
      renderMenuItems();
    });
  });

  // Search Input Listener
  const menuSearchInput = document.getElementById("menuSearchInput");
  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderMenuItems();
    });
  }

  // Parse incoming URL query params (?search=... or ?category=...) from Hero search/cards
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get("search");
    const urlCategory = urlParams.get("category");
    if (urlSearch) {
      state.searchQuery = urlSearch;
      if (menuSearchInput) menuSearchInput.value = urlSearch;
    }
    if (urlCategory) {
      state.menuFilter = urlCategory;
      categoryTabs.forEach(tab => {
        if (tab.getAttribute("data-category") === urlCategory) {
          categoryTabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
        }
      });
    }
  } catch (err) {}

  // ==========================================================================
  // Cart Logic & State Management (Shared across all pages)
  // ==========================================================================
  function saveCart() {
    localStorage.setItem("stackly_cart", JSON.stringify(state.cart));
    localStorage.setItem("rasoibox_cart", JSON.stringify(state.cart));
    if (state.appliedCoupon) {
      localStorage.setItem("stackly_coupon", JSON.stringify(state.appliedCoupon));
      localStorage.setItem("rasoibox_coupon", JSON.stringify(state.appliedCoupon));
    } else {
      localStorage.removeItem("stackly_coupon");
      localStorage.removeItem("rasoibox_coupon");
    }
    updateBadge();
    updateCartUI();
  }

  function addToCart(item) {
    const existing = state.cart.find(c => c.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ ...item, qty: 1 });
    }
    saveCart();
    showToast(`Added "${item.title}" to cart!`, "success");
  }

  function updateCartQty(id, delta) {
    const item = state.cart.find(c => c.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(c => c.id !== id);
    }
    saveCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter(c => c.id !== id);
    saveCart();
    showToast("Item removed from cart.", "info");
  }

  function updateCartUI() {
    updateBadge();

    // 1. If on Dedicated Cart Page (cart.html)
    if (cartPageItemsList) {
      renderDedicatedCartPage();
    }

    // 2. If Cart Modal is on current page
    if (cartItemsList) {
      renderCartModal();
    }
  }

  function renderCartModal() {
    if (state.cart.length === 0) {
      if (cartEmptyState) cartEmptyState.style.display = "block";
      if (cartContentWrapper) cartContentWrapper.style.display = "none";
      if (cartFooter) cartFooter.style.display = "none";
      return;
    }

    if (cartEmptyState) cartEmptyState.style.display = "none";
    if (cartContentWrapper) cartContentWrapper.style.display = "block";
    if (cartFooter) cartFooter.style.display = "flex";

    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.veg ? '🟢' : '🔴'} ${item.title}</div>
          <div class="cart-item-meta">${item.subtitle}</div>
          <div class="cart-item-price">₹${item.price * item.qty} <span style="font-size: 0.75rem; color: var(--muted); font-weight: normal;">(₹${item.price} each)</span></div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="qty-stepper">
            <button class="qty-btn" onclick="app.updateCartQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="app.updateCartQty('${item.id}', 1)">+</button>
          </div>
          <button style="color: #EF4444; font-size: 1.1rem; padding: 4px;" onclick="app.removeFromCart('${item.id}')" title="Remove item">🗑️</button>
        </div>
      </div>
    `).join("");

    updateBillCalculations(
      document.getElementById("billSubtotal"),
      document.getElementById("billDelivery"),
      document.getElementById("billTax"),
      document.getElementById("billDiscountRow"),
      document.getElementById("billDiscount"),
      document.getElementById("billTotal"),
      document.getElementById("cartFooterTotal")
    );
  }

  function renderDedicatedCartPage() {
    if (state.cart.length === 0) {
      if (cartPageEmptyState) cartPageEmptyState.style.display = "block";
      if (cartPageContentWrapper) cartPageContentWrapper.style.display = "none";
      return;
    }

    if (cartPageEmptyState) cartPageEmptyState.style.display = "none";
    if (cartPageContentWrapper) cartPageContentWrapper.style.display = "grid";

    cartPageItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.veg ? '🟢' : '🔴'} ${item.title}</div>
          <div class="cart-item-meta">${item.subtitle}</div>
          <div class="cart-item-price">₹${item.price * item.qty} <span style="font-size: 0.75rem; color: var(--muted); font-weight: normal;">(₹${item.price} each)</span></div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="qty-stepper">
            <button class="qty-btn" onclick="app.updateCartQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="app.updateCartQty('${item.id}', 1)">+</button>
          </div>
          <button style="color: #EF4444; font-size: 1.1rem; padding: 4px;" onclick="app.removeFromCart('${item.id}')" title="Remove item">🗑️</button>
        </div>
      </div>
    `).join("");

    updateBillCalculations(
      document.getElementById("pageSubtotal"),
      document.getElementById("pageDelivery"),
      document.getElementById("pageTax"),
      document.getElementById("pageDiscountRow"),
      document.getElementById("pageDiscount"),
      document.getElementById("pageTotal"),
      document.getElementById("pagePayBtnAmount")
    );
  }

  function updateBillCalculations(subtotalEl, delivEl, taxEl, discRowEl, discEl, totalEl, payBtnEl) {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 199 || (state.appliedCoupon && state.appliedCoupon.type === "free_delivery") ? 0 : 30;
    const taxes = Math.round(subtotal * 0.05);

    let discount = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon.type === "percent") {
        discount = Math.round((subtotal * state.appliedCoupon.value) / 100);
      } else if (state.appliedCoupon.type === "flat") {
        discount = Math.min(state.appliedCoupon.value, subtotal);
      } else if (state.appliedCoupon.type === "free_delivery") {
        discount = 30;
      }
    }

    const grandTotal = Math.max(0, (subtotal + (delivery > 0 ? delivery : 0) + taxes) - (state.appliedCoupon && state.appliedCoupon.type !== "free_delivery" ? discount : 0));

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (delivEl) {
      delivEl.textContent = delivery === 0 ? "FREE" : `₹${delivery}`;
      delivEl.style.color = delivery === 0 ? "var(--secondary)" : "var(--dark)";
    }
    if (taxEl) taxEl.textContent = `₹${taxes}`;

    if (discRowEl && discEl) {
      if (discount > 0) {
        discRowEl.style.display = "flex";
        discEl.textContent = `-₹${discount}`;
      } else {
        discRowEl.style.display = "none";
      }
    }

    if (totalEl) totalEl.textContent = `₹${grandTotal}`;
    if (payBtnEl) payBtnEl.textContent = `Pay ₹${grandTotal}`;
  }

  // Coupon apply
  function handleCouponApply(inputElem, msgElem) {
    const code = inputElem.value.trim().toUpperCase();
    if (!code) {
      showToast("Please enter a coupon code.", "warn");
      return;
    }

    if (AVAILABLE_COUPONS[code]) {
      state.appliedCoupon = AVAILABLE_COUPONS[code];
      if (msgElem) {
        msgElem.style.color = "var(--secondary)";
        msgElem.textContent = `🎉 Coupon applied: ${AVAILABLE_COUPONS[code].desc}`;
      }
      showToast(`Promo ${code} applied successfully!`, "success");
      saveCart();
    } else {
      if (msgElem) {
        msgElem.style.color = "#EF4444";
        msgElem.textContent = "Invalid coupon code. Try FIRSTTIFFIN or DESI50.";
      }
      showToast("Invalid promo code.", "warn");
    }
  }

  const btnApplyCoupon = document.getElementById("btnApplyCoupon");
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener("click", () => {
      handleCouponApply(document.getElementById("couponInput"), document.getElementById("couponMessage"));
    });
  }

  const btnApplyPageCoupon = document.getElementById("btnApplyPageCoupon");
  if (btnApplyPageCoupon) {
    btnApplyPageCoupon.addEventListener("click", () => {
      handleCouponApply(document.getElementById("pageCouponInput"), document.getElementById("pageCouponMessage"));
    });
  }

  // Cart Open handler in Nav
  const btnOpenCart = document.getElementById("btnOpenCart");
  if (btnOpenCart) {
    btnOpenCart.addEventListener("click", (e) => {
      if (cartModal) {
        openCartModal();
      } else {
        window.location.href = "cart.html";
      }
    });
  }

  function openCartModal() {
    if (!cartModal) return;
    updateCartUI();
    cartModal.classList.add("active");
  }

  const btnCloseCart = document.getElementById("btnCloseCart");
  if (btnCloseCart) btnCloseCart.addEventListener("click", () => cartModal.classList.remove("active"));

  const btnCartExploreMenu = document.getElementById("btnCartExploreMenu");
  if (btnCartExploreMenu) {
    btnCartExploreMenu.addEventListener("click", () => {
      if (cartModal) cartModal.classList.remove("active");
      window.location.href = "menu.html";
    });
  }

  // Checkout modal flow on index.html
  const btnProceedCheckout = document.getElementById("btnProceedCheckout");
  if (btnProceedCheckout) {
    btnProceedCheckout.addEventListener("click", () => {
      if (state.cart.length === 0) {
        showToast("Your cart is empty!", "warn");
        return;
      }
      cartModal.classList.remove("active");
      if (checkoutModal) checkoutModal.classList.add("active");
      else window.location.href = "cart.html";
    });
  }

  const btnCloseCheckout = document.getElementById("btnCloseCheckout");
  if (btnCloseCheckout) btnCloseCheckout.addEventListener("click", () => checkoutModal.classList.remove("active"));

  const btnBackToCart = document.getElementById("btnBackToCart");
  if (btnBackToCart) {
    btnBackToCart.addEventListener("click", () => {
      checkoutModal.classList.remove("active");
      cartModal.classList.add("active");
    });
  }

  // Payment Option Selection
  document.querySelectorAll(".payment-option-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".payment-option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });

  // Confirm Order Function
  function confirmOrder(name, phone, address, slot) {
    if (!name || !phone || !address) {
      showToast("Please fill in your name, phone, and delivery address.", "warn");
      return false;
    }
    if (phone.length < 10) {
      showToast("Please enter a valid 10-digit mobile number.", "warn");
      return false;
    }

    const orderId = "STK-" + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      orderId: orderId,
      customer: { name, phone, address, slot },
      items: [...state.cart],
      total: document.getElementById("billTotal") ? document.getElementById("billTotal").textContent : "₹0",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      status: "Cooking"
    };

    state.activeOrder = newOrder;
    localStorage.setItem("stackly_active_order", JSON.stringify(newOrder));
    localStorage.setItem("rasoibox_active_order", JSON.stringify(newOrder));
    const orderHistory = JSON.parse(localStorage.getItem("stackly_orders") || "[]");
    orderHistory.unshift(newOrder);
    localStorage.setItem("stackly_orders", JSON.stringify(orderHistory));
    const subscriptionItem = newOrder.items.find(item => item.type === "subscription");
    if (subscriptionItem) {
      const duration = String(subscriptionItem.id).match(/-(weekly|monthly|single)-/i)?.[1] || "weekly";
      localStorage.setItem("stackly_subscription", JSON.stringify({
        phone,
        planName: subscriptionItem.title,
        slot,
        daysRemaining: duration === "monthly" ? 30 : duration === "weekly" ? 7 : 1,
        deliveryAddress: address,
        pausedForTomorrow: false
      }));
    }
    state.cart = [];
    state.appliedCoupon = null;
    saveCart();

    showToast(`Order #${orderId} placed successfully!`, "success");

    if (checkoutModal) checkoutModal.classList.remove("active");

    // Redirect to track.html or open tracker modal
    if (trackerModal) {
      openOrderTracker();
    } else {
      window.location.href = "track.html";
    }
    return true;
  }

  const btnConfirmOrder = document.getElementById("btnConfirmOrder");
  if (btnConfirmOrder) {
    btnConfirmOrder.addEventListener("click", (e) => {
      e.preventDefault();
      confirmOrder(
        document.getElementById("custName").value.trim(),
        document.getElementById("custPhone").value.trim(),
        document.getElementById("custAddress").value.trim(),
        document.getElementById("custSlot") ? document.getElementById("custSlot").value : "Lunch"
      );
    });
  }

  // Dedicated Cart Page Submit
  const btnPlaceOrderPage = document.getElementById("btnPlaceOrderPage");
  if (btnPlaceOrderPage) {
    btnPlaceOrderPage.addEventListener("click", (e) => {
      e.preventDefault();
      confirmOrder(
        document.getElementById("pageCustName").value.trim(),
        document.getElementById("pageCustPhone").value.trim(),
        document.getElementById("pageCustAddress").value.trim(),
        document.getElementById("pageCustSlot") ? document.getElementById("pageCustSlot").value : "Lunch"
      );
    });
  }

  // ==========================================================================
  // Live Order Tracking (track.html & Tracker Modal)
  // ==========================================================================
  function openOrderTracker() {
    if (trackerModal) {
      const noOrder = document.getElementById("noActiveOrderMsg");
      const activeContent = document.getElementById("activeOrderContent");

      if (!state.activeOrder) {
        if (noOrder) noOrder.style.display = "block";
        if (activeContent) activeContent.style.display = "none";
      } else {
        if (noOrder) noOrder.style.display = "none";
        if (activeContent) activeContent.style.display = "block";
        const oId = document.getElementById("trackOrderId");
        if (oId) oId.textContent = `#${state.activeOrder.orderId}`;
      }
      trackerModal.classList.add("active");
    } else {
      window.location.href = "track.html";
    }
  }

  const btnTrackOrderNav = document.getElementById("btnTrackOrderNav");
  if (btnTrackOrderNav) {
    btnTrackOrderNav.addEventListener("click", (e) => {
      if (window.location.pathname.includes("track.html")) return;
      if (trackerModal) openOrderTracker();
      else window.location.href = "track.html";
    });
  }

  const btnCloseTracker = document.getElementById("btnCloseTracker");
  if (btnCloseTracker) btnCloseTracker.addEventListener("click", () => trackerModal.classList.remove("active"));

  const btnDismissTracker = document.getElementById("btnDismissTracker");
  if (btnDismissTracker) btnDismissTracker.addEventListener("click", () => trackerModal.classList.remove("active"));

  // Track Page Dedicated View (track.html)
  const trackPageActiveContent = document.getElementById("trackPageActiveContent");
  const trackPageNoOrder = document.getElementById("trackPageNoOrder");
  if (trackPageActiveContent) {
    if (!state.activeOrder) {
      trackPageNoOrder.style.display = "block";
      trackPageActiveContent.style.display = "none";
    } else {
      trackPageNoOrder.style.display = "none";
      trackPageActiveContent.style.display = "block";
      document.getElementById("pageTrackOrderId").textContent = `#${state.activeOrder.orderId}`;
      document.getElementById("pageTrackCustName").textContent = state.activeOrder.customer.name;
      document.getElementById("pageTrackAddress").textContent = state.activeOrder.customer.address;
      document.getElementById("pageTrackSlot").textContent = state.activeOrder.customer.slot;
      
      const itemsListEl = document.getElementById("pageTrackItemsList");
      if (itemsListEl && state.activeOrder.items) {
        itemsListEl.innerHTML = state.activeOrder.items.map(it => `
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 6px 0; border-bottom: 1px dashed var(--border-light);">
            <span>${it.title} × ${it.qty}</span>
            <span style="font-weight: 700;">₹${it.price * it.qty}</span>
          </div>
        `).join("");
      }
    }
  }

  // Camera view switcher for track.html
  const camTabs = document.querySelectorAll(".track-cam-tab");
  const cardCam1 = document.getElementById("cardCam1");
  const cardCam2 = document.getElementById("cardCam2");
  const trackVideosGrid = document.getElementById("trackVideosGrid");

  if (camTabs.length && trackVideosGrid) {
    camTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        camTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const view = tab.dataset.view;

        if (view === "cam1") {
          if (cardCam1) cardCam1.style.display = "block";
          if (cardCam2) cardCam2.style.display = "none";
          trackVideosGrid.style.gridTemplateColumns = "1fr";
        } else if (view === "cam2") {
          if (cardCam1) cardCam1.style.display = "none";
          if (cardCam2) cardCam2.style.display = "block";
          trackVideosGrid.style.gridTemplateColumns = "1fr";
        } else {
          if (cardCam1) cardCam1.style.display = "block";
          if (cardCam2) cardCam2.style.display = "block";
          trackVideosGrid.style.gridTemplateColumns = window.innerWidth <= 768 ? "1fr" : "1fr 1fr";
        }
      });
    });
  }

  // Demo order launcher on track.html
  const btnLaunchDemoTracking = document.getElementById("btnLaunchDemoTracking");
  if (btnLaunchDemoTracking) {
    btnLaunchDemoTracking.addEventListener("click", () => {
      const demoOrder = {
        orderId: "STK-98214",
        createdAt: new Date().toISOString(),
        customer: {
          name: "Ananya Sharma",
          phone: "9876543210",
          address: "Flat 402, Green Palms, 12th Main, Indiranagar, Bengaluru",
          slot: "Lunch (12:30 PM - 2:00 PM)"
        },
        items: [
          { title: "Standard Homely Thali", qty: 1, price: 120 },
          { title: "Gulab Jamun (2 pcs)", qty: 1, price: 50 }
        ],
        bill: { total: 170 }
      };
      state.activeOrder = demoOrder;
      localStorage.setItem("stackly_active_order", JSON.stringify(demoOrder));
      showToast("🚀 Loaded Live Dual-Cam Fleet Simulation", "success");
      window.location.reload();
    });
  }

  // ==========================================================================
  // Reviews & FAQs
  // ==========================================================================
  function renderReviews() {
    if (!reviewsGrid || typeof TESTIMONIALS === "undefined") return;
    reviewsGrid.innerHTML = TESTIMONIALS.map(t => `
      <div class="review-card">
        <div>
          <div class="review-stars">${"★".repeat(t.rating)}</div>
          <p class="review-text">"${t.comment}"</p>
        </div>
        <div class="reviewer-meta">
          <img src="${t.avatar}" alt="${t.name}" class="reviewer-avatar">
          <div>
            <div class="reviewer-name">${t.name}</div>
            <div class="reviewer-role">${t.role}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderFAQs() {
    if (!faqList || typeof FAQS === "undefined") return;
    faqList.innerHTML = FAQS.map(faq => `
      <div class="faq-item">
        <button class="faq-question">
          <span>${faq.q}</span>
          <span class="faq-chevron">▼</span>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join("");

    faqList.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        const item = q.parentElement;
        item.classList.toggle("open");
      });
    });
  }

  // ==========================================================================
  // Location System & Delivery Hubs
  // ==========================================================================
  const DELIVERY_LOCATIONS = [
    // Bengaluru
    { id: "blr-ind", name: "Indiranagar", city: "Bengaluru", pincodes: ["560038", "560008"], hub: "100ft Road Central Kitchen", time: "20-30 mins", state: "Karnataka" },
    { id: "blr-kor", name: "Koramangala", city: "Bengaluru", pincodes: ["560034", "560095"], hub: "5th Block Cloud Kitchen", time: "20-25 mins", state: "Karnataka" },
    { id: "blr-hsr", name: "HSR Layout", city: "Bengaluru", pincodes: ["560102"], hub: "Sector 2 Dispatch Hub", time: "25-35 mins", state: "Karnataka" },
    { id: "blr-wfd", name: "Whitefield", city: "Bengaluru", pincodes: ["560066"], hub: "ITPB Express Kitchen", time: "30-40 mins", state: "Karnataka" },
    { id: "blr-ecity", name: "Electronic City", city: "Bengaluru", pincodes: ["560100"], hub: "Phase 1 Tech Kitchen", time: "30-40 mins", state: "Karnataka" },
    { id: "blr-bel", name: "Bellandur", city: "Bengaluru", pincodes: ["560103"], hub: "Outer Ring Road Hub", time: "25-35 mins", state: "Karnataka" },
    { id: "blr-btm", name: "BTM Layout", city: "Bengaluru", pincodes: ["560068", "560076"], hub: "Udupi Garden Hub", time: "25-30 mins", state: "Karnataka" },
    { id: "blr-mrt", name: "Marathahalli", city: "Bengaluru", pincodes: ["560037"], hub: "Bridge Junction Kitchen", time: "25-35 mins", state: "Karnataka" },
    { id: "blr-jnr", name: "Jayanagar", city: "Bengaluru", pincodes: ["560011", "560041"], hub: "4th Block Heritage Kitchen", time: "25-35 mins", state: "Karnataka" },

    // Mumbai
    { id: "bom-and", name: "Andheri West", city: "Mumbai", pincodes: ["400053", "400058"], hub: "Lokhandwala Cloud Kitchen", time: "25-35 mins", state: "Maharashtra" },
    { id: "bom-ban", name: "Bandra West", city: "Mumbai", pincodes: ["400050"], hub: "Hill Road Gourmet Kitchen", time: "20-30 mins", state: "Maharashtra" },
    { id: "bom-pow", name: "Powai", city: "Mumbai", pincodes: ["400076"], hub: "Hiranandani Kitchen Hub", time: "25-35 mins", state: "Maharashtra" },
    { id: "bom-lp", name: "Lower Parel", city: "Mumbai", pincodes: ["400013"], hub: "Kamala Mills Express Kitchen", time: "20-30 mins", state: "Maharashtra" },
    { id: "bom-bkc", name: "BKC", city: "Mumbai", pincodes: ["400051"], hub: "G-Block Corporate Hub", time: "20-25 mins", state: "Maharashtra" },
    { id: "bom-mal", name: "Malad West", city: "Mumbai", pincodes: ["400064"], hub: "Link Road Kitchen", time: "30-40 mins", state: "Maharashtra" },
    { id: "bom-tha", name: "Thane West", city: "Mumbai", pincodes: ["400601", "400602"], hub: "Ghodbunder Road Hub", time: "30-40 mins", state: "Maharashtra" },

    // Delhi NCR
    { id: "del-cyb", name: "Cyber City, Gurugram", city: "Delhi NCR", pincodes: ["122002"], hub: "DLF Cyber Hub Kitchen", time: "20-25 mins", state: "Haryana" },
    { id: "del-sec29", name: "Sector 29, Gurugram", city: "Delhi NCR", pincodes: ["122001"], hub: "Central Gurugram Hub", time: "25-30 mins", state: "Haryana" },
    { id: "del-dlf5", name: "DLF Phase 5, Gurugram", city: "Delhi NCR", pincodes: ["122009"], hub: "Golf Course Rd Kitchen", time: "25-35 mins", state: "Haryana" },
    { id: "del-noi62", name: "Noida Sector 62", city: "Delhi NCR", pincodes: ["201301", "201309"], hub: "TechZone Noida Kitchen", time: "25-35 mins", state: "Uttar Pradesh" },
    { id: "del-cp", name: "Connaught Place", city: "Delhi NCR", pincodes: ["110001"], hub: "Inner Circle Central Kitchen", time: "25-35 mins", state: "Delhi" },
    { id: "del-sex", name: "South Extension", city: "Delhi NCR", pincodes: ["110049"], hub: "Ring Road Express Hub", time: "25-35 mins", state: "Delhi" },

    // Hyderabad
    { id: "hyd-hit", name: "Hitec City", city: "Hyderabad", pincodes: ["500081"], hub: "Cyber Towers Kitchen Hub", time: "20-30 mins", state: "Telangana" },
    { id: "hyd-gac", name: "Gachibowli", city: "Hyderabad", pincodes: ["500032"], hub: "Financial District Hub", time: "25-35 mins", state: "Telangana" },
    { id: "hyd-mad", name: "Madhapur", city: "Hyderabad", pincodes: ["500081"], hub: "Ayyappa Society Kitchen", time: "20-30 mins", state: "Telangana" },
    { id: "hyd-jub", name: "Jubilee Hills", city: "Hyderabad", pincodes: ["500033"], hub: "Road No 36 Gourmet Hub", time: "25-35 mins", state: "Telangana" },
    { id: "hyd-kon", name: "Kondapur", city: "Hyderabad", pincodes: ["500084"], hub: "RTO Junction Kitchen", time: "25-35 mins", state: "Telangana" },

    // Pune
    { id: "pun-hin", name: "Hinjawadi", city: "Pune", pincodes: ["411057"], hub: "Phase 1 Tech Park Kitchen", time: "25-35 mins", state: "Maharashtra" },
    { id: "pun-kot", name: "Kothrud", city: "Pune", pincodes: ["411038"], hub: "Paud Road Homestyle Hub", time: "20-30 mins", state: "Maharashtra" },
    { id: "pun-vim", name: "Viman Nagar", city: "Pune", pincodes: ["411014"], hub: "Phoenix Hub Kitchen", time: "20-30 mins", state: "Maharashtra" },
    { id: "pun-ban", name: "Baner", city: "Pune", pincodes: ["411045"], hub: "High Street Cloud Kitchen", time: "25-35 mins", state: "Maharashtra" },
    { id: "pun-wak", name: "Wakad", city: "Pune", pincodes: ["411057"], hub: "Datta Mandir Rd Hub", time: "25-35 mins", state: "Maharashtra" }
  ];

  function getStoredLocation() {
    try {
      const saved = localStorage.getItem("stackly_selected_location");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DELIVERY_LOCATIONS[0]; // Default: Indiranagar, Bengaluru
  }

  function saveUserLocation(loc) {
    try {
      localStorage.setItem("stackly_selected_location", JSON.stringify(loc));
    } catch (e) {}
    updateNavbarLocation(loc);
  }

  function updateNavbarLocation(loc) {
    const locTextElements = document.querySelectorAll("#currentLocationText");
    locTextElements.forEach(el => {
      el.textContent = `${loc.name}, ${loc.city}`;
    });

    const qummyHeroLocText = document.getElementById("qummyHeroLocText");
    if (qummyHeroLocText) {
      qummyHeroLocText.textContent = `${loc.name}, ${loc.city}`;
    }

    const orderLocBadges = document.querySelectorAll(".order-delivery-loc-name");
    orderLocBadges.forEach(el => {
      el.textContent = `${loc.name}, ${loc.city} (~${loc.time})`;
    });
  }

  let currentActiveCityTab = "all";

  // Ensure Location Modal DOM exists dynamically on whichever page is open
  function ensureLocationModal() {
    let locModal = document.getElementById("locationModal");
    if (!locModal) {
      locModal = document.createElement("div");
      locModal.className = "modal-overlay";
      locModal.id = "locationModal";
      locModal.innerHTML = `
        <div class="modal-window loc-modal-window">
          <div class="modal-header">
            <div>
              <h3 class="modal-title" style="margin-bottom: 2px;">Choose Delivery Location</h3>
              <p style="font-size: 0.82rem; color: var(--muted); margin: 0;">Select your locality to see menus & live delivery times</p>
            </div>
            <button class="btn-close-modal" id="btnCloseLocationModal">&times;</button>
          </div>
          <div class="loc-modal-body">
            <!-- GPS Button -->
            <button type="button" class="loc-gps-btn" id="locDetectGpsBtn">
              <span class="loc-gps-icon">🎯</span>
              <span class="loc-gps-text">
                <span id="locGpsLabel">Detect My Current Location</span>
                <small id="locGpsSub">Using GPS / Browser Geolocation</small>
              </span>
              <span style="font-size: 0.82rem; font-weight: 800; color: var(--primary);">Locate Me →</span>
            </button>

            <!-- Search Field -->
            <div class="loc-search-wrap">
              <span class="loc-search-icon">🔍</span>
              <input type="text" class="loc-search-input" id="locSearchInput" placeholder="Search locality, city, or 6-digit pincode (e.g. Indiranagar, 560038)...">
            </div>

            <!-- City Tabs -->
            <div class="loc-city-tabs" id="locCityTabs">
              <button type="button" class="loc-city-tab active" data-city="all">All Cities</button>
              <button type="button" class="loc-city-tab" data-city="Bengaluru">Bengaluru</button>
              <button type="button" class="loc-city-tab" data-city="Mumbai">Mumbai</button>
              <button type="button" class="loc-city-tab" data-city="Delhi NCR">Delhi NCR</button>
              <button type="button" class="loc-city-tab" data-city="Hyderabad">Hyderabad</button>
              <button type="button" class="loc-city-tab" data-city="Pune">Pune</button>
            </div>

            <!-- Localities Grid -->
            <div class="loc-cards-grid" id="locCardsGrid"></div>
          </div>
        </div>
      `;
      document.body.appendChild(locModal);

      // Wire close handlers
      const btnClose = locModal.querySelector("#btnCloseLocationModal");
      if (btnClose) btnClose.addEventListener("click", closeLocationModal);
      locModal.addEventListener("click", (e) => {
        if (e.target === locModal) closeLocationModal();
      });

      // Wire search filter
      const searchInput = locModal.querySelector("#locSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          renderLocationCards(currentActiveCityTab, e.target.value.trim());
        });
      }

      // Wire city tabs
      const tabs = locModal.querySelectorAll(".loc-city-tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          currentActiveCityTab = tab.dataset.city;
          const searchVal = searchInput ? searchInput.value.trim() : "";
          renderLocationCards(currentActiveCityTab, searchVal);
        });
      });

      // Wire GPS button
      const gpsBtn = locModal.querySelector("#locDetectGpsBtn");
      if (gpsBtn) {
        gpsBtn.addEventListener("click", handleGpsLocation);
      }
    }
    return locModal;
  }

  function renderLocationCards(cityFilter = "all", searchQuery = "") {
    const grid = document.getElementById("locCardsGrid");
    if (!grid) return;

    const currentLoc = getStoredLocation();
    const query = searchQuery.toLowerCase();

    let filtered = DELIVERY_LOCATIONS.filter(loc => {
      const matchCity = cityFilter === "all" || loc.city === cityFilter;
      const matchQuery = !query || 
        loc.name.toLowerCase().includes(query) || 
        loc.city.toLowerCase().includes(query) ||
        loc.pincodes.some(p => p.includes(query)) ||
        loc.hub.toLowerCase().includes(query);
      return matchCity && matchQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px 10px; color: var(--muted);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📍</div>
          <h4 style="color: var(--dark); margin-bottom: 4px; font-weight: 700;">No location match found</h4>
          <p style="font-size: 0.85rem;">Try searching for "Indiranagar", "Koramangala", "Andheri", "Cyber City", or a pincode like "560038".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(loc => {
      const isSelected = currentLoc && currentLoc.id === loc.id;
      return `
        <div class="locality-card ${isSelected ? 'active-selected' : ''}" data-loc-id="${loc.id}">
          <div class="locality-icon">📍</div>
          <div class="locality-info">
            <div class="locality-name">
              <span>${loc.name}</span>
              ${isSelected ? '<span style="color: var(--primary); font-size: 0.75rem;">(Active)</span>' : ''}
            </div>
            <div class="locality-city">${loc.city}, ${loc.state}</div>
            <div class="locality-meta">
              <span class="locality-badge">⚡ ${loc.time}</span>
              <span class="locality-pin">PIN: ${loc.pincodes[0]}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach click handlers to cards
    grid.querySelectorAll(".locality-card").forEach(card => {
      card.addEventListener("click", () => {
        const locId = card.dataset.locId;
        const selected = DELIVERY_LOCATIONS.find(l => l.id === locId);
        if (selected) {
          saveUserLocation(selected);
          showToast(`📍 Delivery location set to: ${selected.name}, ${selected.city} (${selected.time})`, "success");
          closeLocationModal();
        }
      });
    });
  }

  function openLocationModal(presetCity = "all") {
    const modal = ensureLocationModal();
    currentActiveCityTab = presetCity;

    // Reset tabs
    const tabs = modal.querySelectorAll(".loc-city-tab");
    tabs.forEach(t => {
      t.classList.toggle("active", t.dataset.city === presetCity);
    });

    // Reset search
    const searchInput = modal.querySelector("#locSearchInput");
    if (searchInput) searchInput.value = "";

    renderLocationCards(presetCity);
    modal.classList.add("active");
  }

  function closeLocationModal() {
    const modal = document.getElementById("locationModal");
    if (modal) modal.classList.remove("active");
  }

  function handleGpsLocation() {
    const gpsLabel = document.getElementById("locGpsLabel");
    if (gpsLabel) gpsLabel.textContent = "Detecting current coordinates...";

    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser. Please select an area below.", "info");
      if (gpsLabel) gpsLabel.textContent = "Detect My Current Location";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const matched = DELIVERY_LOCATIONS[0]; // Primary Flagship hub with GPS tag
        const gpsLoc = {
          ...matched,
          name: `${matched.name} (GPS Verified)`,
          coords: { lat: latitude.toFixed(4), lng: longitude.toFixed(4) }
        };
        saveUserLocation(gpsLoc);
        showToast(`🎯 GPS Location detected: ${matched.name}, ${matched.city} (Accuracy ±${Math.round(pos.coords.accuracy)}m)`, "success");
        if (gpsLabel) gpsLabel.textContent = "Detect My Current Location";
        closeLocationModal();
      },
      (err) => {
        showToast("GPS access permission denied or timed out. Please select your area below.", "info");
        if (gpsLabel) gpsLabel.textContent = "Detect My Current Location";
      },
      { timeout: 7000 }
    );
  }

  // Bind location selector buttons in header across all pages
  const locBtn = document.getElementById("locationPickerBtn");
  if (locBtn) {
    locBtn.addEventListener("click", () => {
      openLocationModal("all");
    });
  }

  // Bind footer city tags and any data-city elements
  document.querySelectorAll(".footer-city-tag, .city-hub-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const city = e.currentTarget.dataset.city || "all";
      openLocationModal(city);
    });
  });

  // Bind homepage zone tags
  document.querySelectorAll(".zone-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const locName = tag.dataset.loc;
      const matched = DELIVERY_LOCATIONS.find(l => `${l.name}, ${l.city}`.toLowerCase() === locName.toLowerCase()) || 
                      DELIVERY_LOCATIONS.find(l => locName.toLowerCase().includes(l.name.toLowerCase()));
      if (matched) {
        saveUserLocation(matched);
        showToast(`📍 Delivery location set to: ${matched.name}, ${matched.city}`, "success");
      }
    });
  });

  // Bind change order location links in checkout/cart
  document.querySelectorAll(".btn-change-order-loc").forEach(btn => {
    btn.addEventListener("click", () => {
      openLocationModal("all");
    });
  });

  // Homepage Pincode / Area Checker
  const btnCheckPincode = document.getElementById("btnCheckPincode");
  const pincodeCheckInput = document.getElementById("pincodeCheckInput");
  const pincodeResultBox = document.getElementById("pincodeResultBox");

  function runPincodeCheck() {
    if (!pincodeCheckInput || !pincodeResultBox) return;
    const query = pincodeCheckInput.value.trim().toLowerCase();
    if (!query) {
      showToast("Please enter an area name or 6-digit pincode", "info");
      pincodeCheckInput.focus();
      return;
    }

    const matched = DELIVERY_LOCATIONS.find(l => 
      l.name.toLowerCase().includes(query) || 
      l.city.toLowerCase().includes(query) || 
      l.pincodes.some(p => p.includes(query))
    );

    if (matched) {
      pincodeResultBox.className = "loc-checker-result success";
      pincodeResultBox.innerHTML = `
        <div>
          <strong>🎉 We Deliver Here!</strong> ${matched.name}, ${matched.city} (PIN: ${matched.pincodes.join(", ")}) is covered by our ${matched.hub}. Estimated delivery: <strong>${matched.time}</strong>.
        </div>
        <button type="button" class="btn-primary" id="btnDeliverHere" style="padding: 6px 14px; font-size: 0.8rem; white-space: nowrap;">
          Set as My Area & Order →
        </button>
      `;
      const btnSet = document.getElementById("btnDeliverHere");
      if (btnSet) {
        btnSet.addEventListener("click", () => {
          saveUserLocation(matched);
          showToast(`📍 Delivery location set to: ${matched.name}, ${matched.city}`, "success");
          window.location.href = "menu.html";
        });
      }
    } else {
      pincodeResultBox.className = "loc-checker-result warning";
      pincodeResultBox.innerHTML = `
        📍 Stackly is not live in "<strong>${pincodeCheckInput.value.trim()}</strong>" yet. We are actively expanding! We currently deliver hot meals across <strong>Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Pune</strong>.
        <a href="javascript:void(0)" id="linkViewServedAreas" style="color: var(--primary); font-weight: 700; text-decoration: underline; margin-left: 8px;">View Active Areas</a>
      `;
      const linkView = document.getElementById("linkViewServedAreas");
      if (linkView) {
        linkView.addEventListener("click", () => openLocationModal("all"));
      }
    }
  }

  if (btnCheckPincode) btnCheckPincode.addEventListener("click", runPincodeCheck);
  if (pincodeCheckInput) {
    pincodeCheckInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        runPincodeCheck();
      }
    });
  }

  // Hero Carousel & Search Controls (Qummy Section)
  const btnHeroPrev = document.getElementById("btnHeroPrev");
  const btnHeroNext = document.getElementById("btnHeroNext");
  const qummyCardsTrack = document.getElementById("qummyCardsTrack");
  if (btnHeroPrev && qummyCardsTrack) {
    btnHeroPrev.addEventListener("click", () => {
      qummyCardsTrack.scrollBy({ left: -160, behavior: "smooth" });
    });
  }
  if (btnHeroNext && qummyCardsTrack) {
    btnHeroNext.addEventListener("click", () => {
      qummyCardsTrack.scrollBy({ left: 160, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // Hero Platter Automatic Designer Dish Swiper
  // ==========================================================================
  const heroDishSwiper = document.getElementById("heroDishSwiper");
  const dishSlides = document.querySelectorAll(".dish-swiper-slide");
  const dishDots = document.querySelectorAll("#dishSwiperDots .swiper-dot");
  const heroBadgeIcon = document.getElementById("heroBadgeIcon");
  const heroBadgeText = document.getElementById("heroBadgeText");

  if (heroDishSwiper && dishSlides.length > 0) {
    let currentDishIndex = 0;
    let swiperTimer = null;
    const totalSlides = dishSlides.length;

    function showDishSlide(index) {
      currentDishIndex = (index + totalSlides) % totalSlides;
      dishSlides.forEach((slide, i) => {
        slide.classList.remove("active", "prev-slide");
        if (i === currentDishIndex) {
          slide.classList.add("active");
        } else if (i < currentDishIndex) {
          slide.classList.add("prev-slide");
        }
      });

      dishDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentDishIndex);
      });

      const activeSlide = dishSlides[currentDishIndex];
      if (activeSlide && heroBadgeText) {
        if (heroBadgeIcon && activeSlide.dataset.badgeIcon) {
          heroBadgeIcon.textContent = activeSlide.dataset.badgeIcon;
        }
        if (activeSlide.dataset.badgeText) {
          heroBadgeText.textContent = activeSlide.dataset.badgeText;
        }
      }
    }

    function startSwiperAutoplay() {
      stopSwiperAutoplay();
      swiperTimer = setInterval(() => {
        showDishSlide(currentDishIndex + 1);
      }, 3200);
    }

    function stopSwiperAutoplay() {
      if (swiperTimer) {
        clearInterval(swiperTimer);
        swiperTimer = null;
      }
    }

    dishDots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const slideIdx = parseInt(dot.getAttribute("data-slide"), 10);
        if (!isNaN(slideIdx)) {
          showDishSlide(slideIdx);
          startSwiperAutoplay();
        }
      });
    });

    // Touch gesture swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    heroDishSwiper.addEventListener("touchstart", (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    heroDishSwiper.addEventListener("touchend", (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDiff = touchEndX - touchStartX;
        if (Math.abs(swipeDiff) > 40) {
          if (swipeDiff < 0) {
            showDishSlide(currentDishIndex + 1); // Swiped left -> next
          } else {
            showDishSlide(currentDishIndex - 1); // Swiped right -> prev
          }
          startSwiperAutoplay();
        }
      }
    }, { passive: true });

    // Initial run
    showDishSlide(0);
    startSwiperAutoplay();
  }

  const qummyHeroLocTag = document.getElementById("qummyHeroLocTag");
  if (qummyHeroLocTag) {
    qummyHeroLocTag.addEventListener("click", () => {
      openLocationModal("all");
    });
  }

  const heroDishSearchForm = document.getElementById("heroDishSearchForm");
  const heroDishSearchInput = document.getElementById("heroDishSearchInput");
  if (heroDishSearchForm) {
    heroDishSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = heroDishSearchInput ? heroDishSearchInput.value.trim() : "";
      if (val) {
        window.location.href = `menu.html?search=${encodeURIComponent(val)}`;
      } else {
        window.location.href = "menu.html";
      }
    });
  }

  // Expose global methods
  window.app = {
    updateCartQty,
    removeFromCart,
    openSubscriptionModal,
    openLocationModal,
    closeLocationModal,
    saveUserLocation,
    DELIVERY_LOCATIONS
  };

  // Run initial renders & restore location
  updateNavbarLocation(getStoredLocation());
  updateBadge();
  renderTodaySpecial();
  renderPlans();
  renderMenuItems();
  renderReviews();
  renderFAQs();
  updateCartUI();
});
