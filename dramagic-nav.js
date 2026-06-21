(function () {
  const navMount = document.getElementById("dramagicGlobalNav");
  if (!navMount) return;

  const SESSION_KEY = "dramagic_demo_session";
  let lastSignature = "";

  renderGlobalNav();
  watchForSessionChanges();

  window.dramagicRenderGlobalNav = renderGlobalNav;

  function renderGlobalNav() {
    const session = getSession();
    const role = String(session.role || "guest").toLowerCase();
    const name = session.full_name || session.fullName || session.name || getDomNameFallback() || "Dramagic User";
    const avatar = getAvatar(session, role);
    const signature = JSON.stringify({
      role,
      name,
      avatar,
      path: location.pathname,
      hash: location.hash,
      session: localStorage.getItem(SESSION_KEY) || ""
    });

    if (signature === lastSignature && navMount.dataset.ready === "yes") return;
    lastSignature = signature;
    navMount.dataset.ready = "yes";

    const links = getVisibleLinks(role);

    navMount.innerHTML = `
      <nav class="dramagic-global-nav" aria-label="Dramagic navigation">
        <a class="dramagic-nav-brand" href="auth.html#home">
          <img src="dramagic-logo.png" alt="Dramagic Logo">
          <div>
            <strong>Dramagic</strong>
            <span>${escapeHtml(getPageLabel())}</span>
          </div>
        </a>

        <div class="dramagic-nav-actions">
          <img class="dramagic-nav-pfp" src="${avatar}" alt="Profile">
          <button id="dramagicMenuBtn" class="dramagic-menu-btn" type="button" aria-label="Open menu" aria-expanded="false">
            <i class="dramagic-menu-icon"><span></span></i>
          </button>
        </div>
      </nav>

      <div id="dramagicDrawerBackdrop" class="dramagic-drawer-backdrop"></div>

      <aside id="dramagicDrawer" class="dramagic-drawer" aria-label="Dramagic menu">
        <div class="dramagic-drawer-head">
          <div class="dramagic-drawer-user">
            <img src="${avatar}" alt="Profile">
            <div>
              <strong>${escapeHtml(name)}</strong>
              <span>${escapeHtml(formatRole(role, session, name))}</span>
            </div>
          </div>

          <button id="dramagicDrawerClose" class="dramagic-drawer-close" type="button" aria-label="Close menu">×</button>
        </div>

        <div class="dramagic-drawer-links">
          ${links.map(function (link) {
            return `
              <a href="${link.href}" class="${isActiveLink(link.href) ? "active" : ""}">
                <span>${link.icon} ${escapeHtml(link.label)}</span>
                <b>›</b>
              </a>
            `;
          }).join("")}

          ${role !== "guest" ? `
            <button id="dramagicLogoutBtn" type="button">
              <span>🚪 Logout</span>
              <b>›</b>
            </button>
          ` : ""}
        </div>
      </aside>
    `;

    bindDrawerEvents();
  }

  function getVisibleLinks(role) {
    const links = [
      { label: "Dashboard", icon: "🏠", href: "auth.html#home", roles: ["student", "teacher", "ceo", "parent", "finance"] },
      { label: "Student Area", icon: "🎭", href: "auth.html#studentArea", roles: ["student", "teacher", "ceo"] },
      { label: "Parent Dashboard", icon: "👨‍👩‍👧", href: "auth.html#parentArea", roles: ["parent"] },
      { label: "Teacher Area", icon: "🧑‍🏫", href: "auth.html#teacherArea", roles: ["teacher", "ceo"] },
      { label: "My Attendance", icon: "✅", href: "attendance.html", roles: ["student"] },
      { label: "Child Attendance", icon: "✅", href: "attendance.html", roles: ["parent"] },
      { label: "Attendance Manager", icon: "✅", href: "attendance.html", roles: ["teacher", "ceo"] },
      { label: "Weekly Agenda", icon: "🗓️", href: "agenda.html", roles: ["student", "teacher", "ceo", "parent"] },
      { label: "Finance", icon: "💰", href: "finance.html", roles: ["ceo"] },
      { label: "Payment Entry", icon: "🧾", href: "finance-entry.html", roles: ["finance", "ceo"] },
      { label: "Presentacy", icon: "🎤", href: "presentacy.html", roles: ["student", "teacher", "ceo", "parent"] },
      { label: "Dramagic Memories", icon: "🖼️", href: "media.html", roles: ["student", "teacher", "ceo", "parent", "guest"] },
      { label: "Game Section", icon: "🟩", href: "game.html", roles: ["student", "teacher", "ceo"] },
      { label: "My Profile", icon: "👤", href: "profile.html", roles: ["student", "teacher", "ceo", "parent", "finance"] },
      { label: "Settings", icon: "⚙️", href: "settings.html", roles: ["student", "teacher", "ceo", "parent", "finance"] },
      { label: "Public Story", icon: "✨", href: "index.html", roles: ["student", "teacher", "ceo", "parent", "finance", "guest"] }
    ];

    return links.filter(function (link) {
      return link.roles.includes(role);
    });
  }

  function bindDrawerEvents() {
    const menuBtn = document.getElementById("dramagicMenuBtn");
    const closeBtn = document.getElementById("dramagicDrawerClose");
    const drawer = document.getElementById("dramagicDrawer");
    const backdrop = document.getElementById("dramagicDrawerBackdrop");
    const logoutBtn = document.getElementById("dramagicLogoutBtn");

    if (!menuBtn || !closeBtn || !drawer || !backdrop) return;

    function openDrawer() {
      // Important: re-check localStorage right before opening.
      // This fixes auth.html where the navbar loads before the user signs in.
      const currentSignature = JSON.stringify({
        session: localStorage.getItem(SESSION_KEY) || "",
        path: location.pathname,
        hash: location.hash
      });

      if (!lastSignature.includes(localStorage.getItem(SESSION_KEY) || "__guest__")) {
        renderGlobalNav();
        const refreshedMenuBtn = document.getElementById("dramagicMenuBtn");
        if (refreshedMenuBtn && refreshedMenuBtn !== menuBtn) {
          refreshedMenuBtn.click();
          return;
        }
      }

      drawer.classList.add("open");
      backdrop.classList.add("open");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", openDrawer);
    closeBtn.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(SESSION_KEY);
        document.body.style.overflow = "";
        window.location.href = "auth.html?loggedout=1#signin";
      });
    }
  }

  function watchForSessionChanges() {
    window.addEventListener("storage", function (event) {
      if (event.key === SESSION_KEY) renderGlobalNav();
    });

    window.addEventListener("pageshow", renderGlobalNav);
    window.addEventListener("focus", renderGlobalNav);
    window.addEventListener("hashchange", renderGlobalNav);

    const app = document.getElementById("app");
    if (app && "MutationObserver" in window) {
      const observer = new MutationObserver(renderGlobalNav);
      observer.observe(app, { attributes: true, attributeFilter: ["class"] });
    }

    // Same-tab localStorage changes do not fire the storage event, so check briefly after load/sign-in.
    let checks = 0;
    const interval = window.setInterval(function () {
      renderGlobalNav();
      checks += 1;
      if (checks > 30) window.clearInterval(interval);
    }, 300);
  }

  function getSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY));
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  }

  function getDomNameFallback() {
    const navName = document.getElementById("navUserName");
    if (navName && navName.textContent && navName.textContent.trim() !== "Loading...") {
      return navName.textContent.trim();
    }
    return "";
  }

  function getAvatar(user, role) {
    const userId = user.id || user.username || "guest";

    const keys = [
      `dramagic_profile_${userId}`,
      "dramagic_current_profile_picture",
      "dramagic_latest_profile_picture",
      "dramagic_profile_picture",
      "dramagic_profile_guest"
    ];

    for (const key of keys) {
      const avatar = readAvatar(key);
      if (avatar) return avatar;
    }

    const currentPageAvatar = document.getElementById("navProfilePic");
    if (currentPageAvatar && currentPageAvatar.src) return currentPageAvatar.src;

    return defaultAvatar(role);
  }

  function readAvatar(key) {
    const value = localStorage.getItem(key);
    if (!value) return "";

    if (value.startsWith("data:image")) return value;

    try {
      const parsed = JSON.parse(value);
      return parsed.profilePic || parsed.avatar || parsed.picture || parsed.photo || parsed.pfp || "";
    } catch {
      return "";
    }
  }

  function defaultAvatar(userRole) {
    const icon = userRole === "ceo" ? "👑" : userRole === "teacher" ? "🎭" : userRole === "finance" ? "🧾" : userRole === "parent" ? "👨‍👩‍👧" : userRole === "student" ? "🌟" : "✨";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#08a9d9"/>
            <stop offset="100%" stop-color="#007aa7"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" rx="80" fill="url(#g)"/>
        <circle cx="80" cy="80" r="58" fill="rgba(255,255,255,.18)"/>
        <text x="80" y="101" text-anchor="middle" font-size="62">${icon}</text>
      </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function formatRole(userRole, user, name) {
    if (userRole === "ceo") return `${name || user.full_name || "CEO"} • CEO`;
    if (userRole === "finance") return `${name || user.full_name || "Finance Entry"} • Payment Entry`;
    if (userRole === "teacher") return `${name || user.full_name || "Teacher"} • Teacher`;
    if (userRole === "parent") return `${name || user.full_name || "Parent"} • Parent`;
    if (userRole === "student") return `${name || user.full_name || "Dramagician"} • Dramagician`;
    return "Guest";
  }

  function getPageLabel() {
    const file = location.pathname.split("/").pop() || "index.html";

    const labels = {
      "auth.html": "Dashboard",
      "game.html": "Game Section",
      "presentacy.html": "Presentacy",
      "media.html": "Memories",
      "attendance.html": "Attendance",
      "agenda.html": "Weekly Agenda",
      "finance.html": "Finance",
      "finance-entry.html": "Payment Entry",
      "profile.html": "Profile",
      "settings.html": "Settings",
      "index.html": "Public Story",
      "guest.html": "Public Story"
    };

    return labels[file] || "English Drama Academy";
  }

  function isActiveLink(href) {
    const currentFile = location.pathname.split("/").pop() || "index.html";
    const [linkFile, linkHash] = href.split("#");

    if (linkFile !== currentFile) return false;
    if (linkHash) return location.hash === `#${linkHash}`;
    return !location.hash;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
