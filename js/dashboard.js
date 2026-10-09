(() => {
  const SESSION_KEY = "stackly_user";
  const ACCOUNTS_KEY = "stackly_accounts";
  const ORDERS_KEY = "stackly_orders";
  const SUBSCRIPTION_KEY = "stackly_subscription";
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const readJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const user = readJson(SESSION_KEY, null);
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  const accounts = readJson(ACCOUNTS_KEY, []);
  const accountIndex = accounts.findIndex(account => account.id && account.id === user.id);
  const saveUser = () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (accountIndex >= 0) {
      const account = { ...user, password: accounts[accountIndex].password };
      accounts[accountIndex] = account;
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  };
  const feedback = (id, text, success = false) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
    element.classList.toggle("is-success", success);
  };

  document.getElementById("welcomeTitle").textContent = `Welcome back, ${user.name || "there"}!`;
  const displayEmail = user.email || (user.phone ? `${user.phone}@stackly.com` : "user@stackly.com");
  const topUserEmailEl = document.getElementById("topUserEmail");
  if (topUserEmailEl) topUserEmailEl.textContent = displayEmail;
  const navUserEmailEl = document.getElementById("navUserEmail");
  if (navUserEmailEl) navUserEmailEl.textContent = displayEmail;

  document.getElementById("profileName").value = user.name || "";
  document.getElementById("profileEmail").value = user.email || "";
  document.getElementById("profilePhone").value = user.phone || "";
  document.getElementById("profileCity").value = user.city || "";
  document.getElementById("profileDiet").value = user.diet || "veg";
  document.getElementById("walletBalance").textContent = `₹${Number(user.walletBalance || 0).toLocaleString("en-IN")}`;

  const userPhone = String(user.phone || "");
  const allOrders = readJson(ORDERS_KEY, []);
  const activeOrder = readJson("stackly_active_order", null) || readJson("rasoibox_active_order", null);
  if (activeOrder && String(activeOrder.customer?.phone || "") === userPhone && !allOrders.some(order => order.orderId === activeOrder.orderId)) {
    allOrders.unshift(activeOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
  }
  const orders = allOrders.filter(order => String(order.customer?.phone || "") === userPhone).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  document.getElementById("ordersTotal").textContent = String(orders.length);
  const orderBody = document.getElementById("ordersTableBody");
  const emptyOrders = document.getElementById("ordersEmptyState");
  emptyOrders.hidden = orders.length > 0;
  orderBody.innerHTML = orders.map(order => {
    const items = Array.isArray(order.items) ? order.items : [];
    const summary = items.map(item => `${item.title || item.name || "Meal"}${item.qty > 1 ? ` × ${item.qty}` : ""}`).join(", ") || "Meal order";
    const status = order.status || "Cooking";
    const statusClass = status.toLowerCase().replace(/[^a-z]+/g, "-");
    const dateValue = order.date || order.createdAt;
    const date = dateValue ? new Date(dateValue).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
    return `<tr><td>${escapeHtml(order.orderId || "—")}</td><td>${escapeHtml(date)}</td><td class="order-items-summary">${escapeHtml(summary)}</td><td>${escapeHtml(order.total || "₹0")}</td><td><span class="status-badge status-${escapeHtml(statusClass)}">${escapeHtml(status)}</span></td><td><button class="text-button reorder-button" type="button" data-order="${escapeHtml(order.orderId || "")}">Reorder</button></td></tr>`;
  }).join("");

  let subscription = readJson(SUBSCRIPTION_KEY, null);
  if (!subscription || String(subscription.phone || "") !== userPhone) {
    subscription = null;
    const subscriptionOrder = orders.find(order => (order.items || []).some(item => item.type === "subscription"));
    const subscriptionItem = subscriptionOrder?.items?.find(item => item.type === "subscription");
    if (subscriptionItem) {
      const durationMatch = String(subscriptionItem.id || "").match(/-(weekly|monthly|single)-/i);
      subscription = {
        phone: userPhone,
        planName: subscriptionItem.title,
        slot: subscriptionOrder.customer?.slot || "Lunch",
        daysRemaining: durationMatch?.[1] === "monthly" ? 30 : durationMatch?.[1] === "weekly" ? 7 : 1,
        deliveryAddress: subscriptionOrder.customer?.address || user.city,
        pausedForTomorrow: false
      };
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    }
  }
  const subscriptionDetails = document.getElementById("subscriptionDetails");
  const pauseButton = document.getElementById("pauseMealButton");
  if (subscription) {
    const remaining = Math.max(0, Number(subscription.daysRemaining) || 0);
    document.getElementById("daysRemaining").textContent = String(remaining);
    document.getElementById("subscriptionStatNote").textContent = subscription.pausedForTomorrow ? "Tomorrow’s meal is paused" : "Active meal plan";
    document.getElementById("subscriptionStatus").textContent = subscription.pausedForTomorrow ? "Paused tomorrow" : "Active";
    document.getElementById("subscriptionStatus").className = `status-badge ${subscription.pausedForTomorrow ? "status-muted" : "status-delivered"}`;
    subscriptionDetails.innerHTML = `<div><span>Current plan</span><strong>${escapeHtml(subscription.planName || "Tiffin subscription")}</strong></div><div><span>Delivery slot</span><strong>${escapeHtml(subscription.slot || "Lunch")}</strong></div><div><span>Days remaining</span><strong>${remaining} days</strong></div><div><span>Delivery address</span><strong id="subscriptionAddress">${escapeHtml(subscription.deliveryAddress || user.city || "Add an address")}</strong></div>`;
    pauseButton.disabled = remaining < 1;
    pauseButton.textContent = subscription.pausedForTomorrow ? "Resume Tomorrow’s Meal" : "Pause Meal for Tomorrow";
  } else {
    document.getElementById("daysRemaining").textContent = "0";
    subscriptionDetails.innerHTML = `<div class="no-subscription-copy"><strong>No active tiffin subscription yet.</strong><span>Choose a plan to get fresh meals delivered on your schedule.</span></div>`;
    pauseButton.disabled = true;
  }

  const addressesContainer = document.getElementById("savedAddresses");
  const renderAddresses = () => {
    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    addressesContainer.innerHTML = addresses.length ? addresses.map((entry, index) => `<article class="saved-address-card"><div><strong>${escapeHtml(entry.label || `Address ${index + 1}`)}</strong>${entry.isDefault ? '<span class="address-default">Default</span>' : ""}<p>${escapeHtml(entry.address)}</p></div><button type="button" class="text-button remove-address-button" data-address="${escapeHtml(entry.id)}" aria-label="Remove ${escapeHtml(entry.label || "address")}">Remove</button></article>`).join("") : `<p class="empty-account-state">No saved addresses yet. Add one to speed up checkout.</p>`;
    addressesContainer.querySelectorAll(".remove-address-button").forEach(button => button.addEventListener("click", () => {
      user.addresses = user.addresses.filter(entry => entry.id !== button.dataset.address);
      if (user.addresses.length && !user.addresses.some(entry => entry.isDefault)) user.addresses[0].isDefault = true;
      saveUser();
      renderAddresses();
    }));
  };
  renderAddresses();

  document.getElementById("profileForm").addEventListener("submit", event => {
    event.preventDefault();
    const phone = document.getElementById("profilePhone").value.trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      feedback("profileMessage", "Enter a valid 10-digit phone number.");
      return;
    }
    user.name = document.getElementById("profileName").value.trim();
    user.email = document.getElementById("profileEmail").value.trim().toLowerCase();
    user.phone = phone;
    user.city = document.getElementById("profileCity").value.trim();
    user.diet = document.getElementById("profileDiet").value;
    saveUser();
    document.getElementById("welcomeTitle").textContent = `Welcome back, ${user.name}!`;
    if (topUserEmailEl) topUserEmailEl.textContent = user.email;
    if (navUserEmailEl) navUserEmailEl.textContent = user.email;
    feedback("profileMessage", "Profile saved.", true);
  });

  document.getElementById("addAddressButton").addEventListener("click", () => {
    const label = window.prompt("Give this address a label, such as Home or Work:");
    if (label === null) return;
    const address = window.prompt("Enter the full delivery address:");
    if (address === null || !address.trim()) return;
    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    addresses.push({ id: `address-${Date.now()}`, label: label.trim() || `Address ${addresses.length + 1}`, address: address.trim(), isDefault: addresses.length === 0 });
    user.addresses = addresses;
    saveUser();
    renderAddresses();
  });

  document.getElementById("changeAddressButton").addEventListener("click", () => {
    if (!subscription) {
      feedback("subscriptionFeedback", "Choose a tiffin plan before changing its delivery address.");
      return;
    }
    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    const options = addresses.map((entry, index) => `${index + 1}. ${entry.label}: ${entry.address}`).join("\n");
    const choice = window.prompt(`Choose a saved address by number, or enter a new address:\n${options}`, "1");
    if (choice === null || !choice.trim()) return;
    const selectedIndex = Number(choice) - 1;
    subscription.deliveryAddress = Number.isInteger(selectedIndex) && addresses[selectedIndex] ? addresses[selectedIndex].address : choice.trim();
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    const address = document.getElementById("subscriptionAddress");
    if (address) address.textContent = subscription.deliveryAddress;
    feedback("subscriptionFeedback", "Delivery address updated.", true);
  });

  pauseButton.addEventListener("click", () => {
    if (!subscription) return;
    subscription.pausedForTomorrow = !subscription.pausedForTomorrow;
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    document.getElementById("subscriptionStatNote").textContent = subscription.pausedForTomorrow ? "Tomorrow’s meal is paused" : "Active meal plan";
    document.getElementById("subscriptionStatus").textContent = subscription.pausedForTomorrow ? "Paused tomorrow" : "Active";
    document.getElementById("subscriptionStatus").className = `status-badge ${subscription.pausedForTomorrow ? "status-muted" : "status-delivered"}`;
    pauseButton.textContent = subscription.pausedForTomorrow ? "Resume Tomorrow’s Meal" : "Pause Meal for Tomorrow";
    feedback("subscriptionFeedback", subscription.pausedForTomorrow ? "Tomorrow’s meal has been paused." : "Tomorrow’s meal is back on.", true);
  });

  orderBody.addEventListener("click", event => {
    const button = event.target.closest(".reorder-button");
    if (!button) return;
    const order = orders.find(entry => String(entry.orderId || "") === button.dataset.order);
    if (!order) return;
    const cart = readJson("stackly_cart", null) || readJson("rasoibox_cart", []);
    (order.items || []).forEach(item => {
      const existing = cart.find(entry => entry.id === item.id);
      if (existing) existing.qty = (Number(existing.qty) || 1) + (Number(item.qty) || 1);
      else cart.push({ ...item, qty: Number(item.qty) || 1 });
    });
    localStorage.setItem("stackly_cart", JSON.stringify(cart));
    localStorage.setItem("rasoibox_cart", JSON.stringify(cart));
    window.location.href = "cart.html";
  });

  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });
})();
