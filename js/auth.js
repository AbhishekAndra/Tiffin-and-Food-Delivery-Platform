(() => {
  const ACCOUNTS_KEY = "stackly_accounts";
  const SESSION_KEY = "stackly_user";
  const readAccounts = () => {
    try {
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
      return Array.isArray(accounts) ? accounts : [];
    } catch {
      return [];
    }
  };
  const normalize = value => value.trim().toLowerCase();
  const setMessage = (element, message, success = false) => {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-success", success);
  };
  const saveSession = account => {
    const { password, ...profile } = account;
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    window.location.href = "dashboard.html";
  };

  let hasSession = false;
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    hasSession = !!(session && typeof session === "object" && (session.email || session.phone));
  } catch { /* Ignore an invalid local session and allow login. */ }
  if ((document.getElementById("loginForm") || document.getElementById("signupForm")) && hasSession) {
    window.location.replace("dashboard.html");
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const message = document.getElementById("loginMessage");
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const rawIdentity = (document.getElementById("loginIdentity").value || "").trim();
      const password = (document.getElementById("loginPassword").value || "").trim();

      if (!rawIdentity) {
        setMessage(message, "Please enter your email or username.");
        document.getElementById("loginIdentity").focus();
        return;
      }
      if (!password) {
        setMessage(message, "Please enter your password.");
        document.getElementById("loginPassword").focus();
        return;
      }

      const identity = normalize(rawIdentity);
      const accounts = readAccounts();
      let account = accounts.find(user =>
        (normalize(user.email || "") === identity || String(user.phone || "") === identity)
      );

      const isEmail = identity.includes("@");
      const defaultEmail = isEmail ? rawIdentity : `${identity}@example.com`;
      const derivedName = isEmail 
        ? rawIdentity.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        : rawIdentity.replace(/\b\w/g, c => c.toUpperCase());

      if (!account) {
        // Accept ANY email & ANY password: create account dynamically
        const phone = /^[0-9]{10}$/.test(rawIdentity) ? rawIdentity : "9876543210";

        account = {
          id: `user-${Date.now()}`,
          name: derivedName || "Stackly Member",
          email: defaultEmail,
          phone: phone,
          city: "Mumbai Central",
          diet: "veg",
          addresses: [{ id: `address-${Date.now()}`, label: "Home", address: "Mumbai Central", isDefault: true }],
          walletBalance: 250,
          createdAt: new Date().toISOString(),
          password: password
        };
        accounts.push(account);
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      } else {
        // Existing account: allow any password entered and ensure email is preserved
        if (password) {
          account.password = password;
        }
        if (isEmail) {
          account.email = rawIdentity;
        }
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }

      account.rememberMe = document.getElementById("rememberMe") ? document.getElementById("rememberMe").checked : true;
      setMessage(message, "Logging you in...", true);
      setTimeout(() => {
        saveSession(account);
      }, 150);
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const message = document.getElementById("signupMessage");
    signupForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = normalize(document.getElementById("signupEmail").value);
      const phone = document.getElementById("signupPhone").value.trim();
      const city = document.getElementById("signupCity").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;
      if (!name || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage(message, "Enter your name, a valid email address, and your delivery area.");
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        setMessage(message, "Enter a valid 10-digit phone number.");
        return;
      }
      if (password.length < 8) {
        setMessage(message, "Choose a password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage(message, "Your passwords don’t match. Please check and try again.");
        return;
      }
      if (!document.getElementById("signupTerms").checked) {
        setMessage(message, "Please agree to the Terms & Conditions to continue.");
        return;
      }
      const accounts = readAccounts();
      if (accounts.some(user => normalize(user.email || "") === email || String(user.phone || "") === phone)) {
        setMessage(message, "An account already uses that email or phone number. Log in instead.");
        return;
      }
      const user = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        city,
        diet: document.getElementById("signupDiet").value,
        addresses: [{ id: `address-${Date.now()}`, label: "Home", address: city, isDefault: true }],
        walletBalance: 0,
        createdAt: new Date().toISOString(),
        password
      };
      accounts.push(user);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      saveSession(user);
    });
  }
})();
