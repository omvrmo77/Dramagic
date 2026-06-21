/* =====================================================
   DRAMAGIC DEMO FRONTEND SCRIPT
   No Supabase. No backend. No email confirmation.
   Fake demo accounts only.
===================================================== */

/* ===============================
   DEMO ACCOUNTS
================================ */

const DEMO_USERS = [
  {
    username: "ceo",
    email: "ceo@dramagic.demo",
    password: "ceo123",
    full_name: "Omar Mohamed",
    role: "ceo",
    account_status: "active",
    classLetter: null
  },
  {
    username: "finance",
    email: "finance@dramagic.demo",
    password: "finance123",
    full_name: "Finance Entry",
    role: "finance",
    account_status: "active",
    classLetter: null
  },
  {
    username: "teacher",
    email: "teacher@dramagic.demo",
    password: "teacher123",
    full_name: "Demo Teacher",
    role: "teacher",
    account_status: "active",
    classLetter: null
  },
  {
    username: "student",
    email: "student@dramagic.demo",
    password: "student123",
    full_name: "Demo Student A",
    role: "student",
    account_status: "active",
    classLetter: "A",
    presentacyStudentId: "s1"
  },
  {
    username: "studentb",
    email: "studentb@dramagic.demo",
    password: "studentb123",
    full_name: "Demo Student B",
    role: "student",
    account_status: "active",
    classLetter: "B",
    presentacyStudentId: "s3"
  },
  {
    username: "parent",
    email: "parent@dramagic.demo",
    password: "parent123",
    full_name: "Sara Hassan",
    role: "parent",
    account_status: "active",
    classLetter: "A",
    linkedStudentId: "DRG-A-001",
    linkedStudentName: "Laila Hassan",
    children: [
      {
        studentId: "DRG-A-001",
        name: "Laila Hassan",
        classLetter: "A",
        className: "Class A",
        presentacyStudentId: "s1",
        attendanceText: "8 / 10",
        attendanceNote: "Demo attendance summary",
        badge: "🎤",
        badgeText: "Confident Speaker"
      },
      {
        studentId: "DRG-A-002",
        name: "Youssef Ali",
        classLetter: "A",
        className: "Class A",
        presentacyStudentId: "s2",
        attendanceText: "Open Sheet",
        attendanceNote: "View sessions, status, time, late records, and absences.",
        badge: "⭐",
        badgeText: "Top Performer"
      }
    ]
  }
];

const DEMO_CLASSES = ["A", "B", "C", "D"];

const DRAMAGIC_STUDENT_DIRECTORY = [
  {
    studentId: "DRG-A-001",
    legacyId: "74000757",
    parentCode: "8472",
    name: "Laila Hassan",
    classLetter: "A",
    className: "Class A",
    presentacyStudentId: "s1",
    attendanceText: "8 / 10",
    attendanceNote: "Present 8 sessions out of 10",
    badge: "🎤",
    badgeText: "Confident Speaker"
  },
  {
    studentId: "DRG-A-002",
    parentCode: "3921",
    name: "Youssef Ali",
    classLetter: "A",
    className: "Class A",
    presentacyStudentId: "s2",
    attendanceText: "9 / 10",
    attendanceNote: "Excellent attendance",
    badge: "⭐",
    badgeText: "Top Performer"
  },
  {
    studentId: "DRG-B-001",
    parentCode: "6150",
    name: "Mariam Tarek",
    classLetter: "B",
    className: "Class B",
    presentacyStudentId: "s3",
    attendanceText: "7 / 10",
    attendanceNote: "Needs stronger attendance",
    badge: "🎭",
    badgeText: "Creative Actor"
  },
  {
    studentId: "DRG-C-001",
    parentCode: "2048",
    name: "Omar Nabil",
    classLetter: "C",
    className: "Class C",
    presentacyStudentId: "s4",
    attendanceText: "10 / 10",
    attendanceNote: "Perfect attendance",
    badge: "🔥",
    badgeText: "Brave Performer"
  }
];

const STORAGE_KEYS = {
  session: "dramagic_demo_session",
  registeredUsers: "dramagic_demo_registered_users"
};

let currentUser = null;
let currentProfile = null;


/* ===============================
   ELEMENTS
================================ */

const authPage = document.getElementById("authPage");
const app = document.getElementById("app");

const showSignupBtn = document.getElementById("showSignupBtn");
const showSigninBtn = document.getElementById("showSigninBtn");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

const signupMessage = document.getElementById("signupMessage");
const signinMessage = document.getElementById("signinMessage");
const signupRole = document.getElementById("signupRole");
const signupFullName = document.getElementById("signupFullName");
const signupEmail = document.getElementById("signupEmail");
const signupPhoneWrap = document.getElementById("signupPhoneWrap");
const signupParentPhone = document.getElementById("signupParentPhone");
const signupBirthdayWrap = document.getElementById("signupBirthdayWrap");
const signupBirthday = document.getElementById("signupBirthday");
const signupStudentId = document.getElementById("signupStudentId");
const signupStudentIdLabel = document.getElementById("signupStudentIdLabel");
const signupParentCodeWrap = document.getElementById("signupParentCodeWrap");
const signupParentCode = document.getElementById("signupParentCode");
const parentSignupHint = document.getElementById("parentSignupHint");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");

const roleBadge = document.getElementById("roleBadge");
const logoutBtn = document.getElementById("logoutBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenuCloseBtn = document.getElementById("mobileMenuCloseBtn");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
const mobileNavPanel = document.getElementById("mobileNavPanel");
const mobileMenuRole = document.getElementById("mobileMenuRole");

const pendingArea = document.getElementById("pendingArea");
const studentArea = document.getElementById("studentArea");
const parentArea = document.getElementById("parentArea");
const teacherArea = document.getElementById("teacherArea");
const parentChildrenList = document.getElementById("parentChildrenList");
const parentChildDashboard = document.getElementById("parentChildDashboard");
const parentChildName = document.getElementById("parentChildName");
const parentChildMeta = document.getElementById("parentChildMeta");
const parentChildRank = document.getElementById("parentChildRank");
const parentChildPoints = document.getElementById("parentChildPoints");
const parentChildAttendance = document.getElementById("parentChildAttendance");
const parentChildAttendanceNote = document.getElementById("parentChildAttendanceNote");
const parentAttendanceLink = document.getElementById("parentAttendanceLink");
const parentAgendaLink = document.getElementById("parentAgendaLink");
const parentChildBadge = document.getElementById("parentChildBadge");
const parentChildBadgeText = document.getElementById("parentChildBadgeText");
const parentAnnouncementText = document.getElementById("parentAnnouncementText");



const year = document.getElementById("year");

const studentClassBadge = document.getElementById("studentClassBadge");



const userMenuBtn = document.getElementById("userMenuBtn");
const userDropdown = document.getElementById("userDropdown");
const navProfilePic = document.getElementById("navProfilePic");
const homeProfilePic = document.getElementById("homeProfilePic");
const navUserName = document.getElementById("navUserName");
const personalGreeting = document.getElementById("personalGreeting");
const personalMessage = document.getElementById("personalMessage");

const studentHomeLeaderboard = document.getElementById("studentHomeLeaderboard");
const homeLeaderboardTitle = document.getElementById("homeLeaderboardTitle");
const homeLeaderboardSubtitle = document.getElementById("homeLeaderboardSubtitle");
const homeMyRank = document.getElementById("homeMyRank");
const homeMyPoints = document.getElementById("homeMyPoints");
const homeNextGoal = document.getElementById("homeNextGoal");
const homeTopStudents = document.getElementById("homeTopStudents");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* ===============================
   INIT
================================ */

init();

function init() {
  if (showSignupBtn) showSignupBtn.addEventListener("click", showSignup);
  if (showSigninBtn) showSigninBtn.addEventListener("click", showSignin);
  if (signupRole) signupRole.addEventListener("change", updateSignupRoleFields);

  if (signupForm) signupForm.addEventListener("submit", handleSignupDemo);
  if (signinForm) signinForm.addEventListener("submit", handleSignin);

  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", handleLogout);

  setupMobileMenu();
setupNavigation();

  const savedSession = getSavedSession();
  const requestedAuthMode = window.location.hash === "#signup" ? "signup" : "signin";

  if (savedSession) {
    currentUser = normalizeSession(savedSession);
    currentProfile = currentUser;
    loadProfileAndApp();
  } else {
    showAuthPage();

    if (requestedAuthMode === "signup") {
      showSignup();
    } else {
      showSignin();
    }
  }

  setupUserMenu();
  applySavedTheme();
  setupPresentacyHomeSync();

  startScrollAnimations();
}

/* ===============================
   AUTH UI
================================ */

function showSignup() {
  if (!signupForm || !signinForm) return;

  signupForm.classList.remove("hidden");
  signinForm.classList.add("hidden");

  if (showSignupBtn) showSignupBtn.classList.add("active");
  if (showSigninBtn) showSigninBtn.classList.remove("active");

  clearMessages();
  updateSignupRoleFields();

  showMessage(
    signupMessage,
    "Signup is ready for backend connection. For now, it uses the current student directory until Supabase is connected.",
    true
  );
}

function showSignin() {
  if (!signupForm || !signinForm) return;

  signinForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  if (showSigninBtn) showSigninBtn.classList.add("active");
  if (showSignupBtn) showSignupBtn.classList.remove("active");

  clearMessages();
}

function clearMessages() {
  if (signupMessage) {
    signupMessage.textContent = "";
    signupMessage.classList.remove("success");
  }

  if (signinMessage) {
    signinMessage.textContent = "";
    signinMessage.classList.remove("success");
  }
}

function updateSignupRoleFields() {
  const role = signupRole ? signupRole.value : "student";
  const isParentSignup = role === "parent";

  if (signupPhoneWrap) signupPhoneWrap.classList.toggle("hidden", !isParentSignup);
  if (signupBirthdayWrap) signupBirthdayWrap.classList.toggle("hidden", isParentSignup);
  if (signupParentCodeWrap) signupParentCodeWrap.classList.toggle("hidden", !isParentSignup);
  if (parentSignupHint) parentSignupHint.classList.toggle("hidden", !isParentSignup);

  if (signupStudentIdLabel) {
    signupStudentIdLabel.textContent = isParentSignup
      ? "Child's Dramagic ID"
      : "Dramagic Student ID Number";
  }

  if (signupStudentId) {
    signupStudentId.placeholder = isParentSignup
      ? "Example: DRG-A-001"
      : "Example: DRG-A-001 or 74000757";
  }

  if (signupBirthday) signupBirthday.required = !isParentSignup;
  if (signupParentPhone) signupParentPhone.required = isParentSignup;
  if (signupParentCode) signupParentCode.required = isParentSignup;
}

function handleSignupDemo(event) {
  event.preventDefault();

  clearMessages();

  const role = signupRole ? signupRole.value : "student";
  const fullName = signupFullName ? signupFullName.value.trim() : "";
  const email = signupEmail ? signupEmail.value.trim().toLowerCase() : "";
  const studentIdValue = signupStudentId ? signupStudentId.value.trim() : "";
  const parentCodeValue = signupParentCode ? signupParentCode.value.trim() : "";
  const password = signupPassword ? signupPassword.value : "";
  const confirmPassword = signupConfirmPassword ? signupConfirmPassword.value : "";

  if (!fullName || !email || !studentIdValue || !password || !confirmPassword) {
    showMessage(signupMessage, "Please fill in all required fields.");
    return;
  }

  if (password.length < 6) {
    showMessage(signupMessage, "Use at least 6 characters for the password.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(signupMessage, "Passwords do not match.");
    return;
  }

  const existingUser = getAllDemoUsers().find(function (user) {
    return String(user.email || "").toLowerCase() === email;
  });

  if (existingUser) {
    showMessage(signupMessage, "This email already exists. Use Sign In instead.");
    return;
  }

  const studentRecord = findStudentDirectoryRecord(studentIdValue);

  if (!studentRecord) {
    showMessage(signupMessage, "This student ID was not found in the current student directory.");
    return;
  }

  if (role === "parent" && studentRecord.parentCode !== parentCodeValue) {
    showMessage(signupMessage, "The parent code does not match this child ID.");
    return;
  }

  const username = makeDemoUsername(email);
  const newUser = {
    id: username + "-demo-user",
    username: username,
    email: email,
    password: password,
    full_name: fullName,
    role: role,
    account_status: "active",
    classLetter: studentRecord.classLetter,
    linkedStudentId: studentRecord.studentId,
    linkedStudentName: studentRecord.name,
    presentacyStudentId: studentRecord.presentacyStudentId || null,
    parentPhone: role === "parent" && signupParentPhone ? signupParentPhone.value.trim() : "",
    children: role === "parent" ? [makeParentChildRecord(studentRecord)] : []
  };

  saveRegisteredUser(newUser);

  currentUser = normalizeSession(newUser);
  currentProfile = currentUser;
  saveSession(currentUser);

  showMessage(signupMessage, "Account created and linked successfully.", true);

  setTimeout(function () {
    loadProfileAndApp();
  }, 350);
}

function handleSignin(event) {
  event.preventDefault();

  clearMessages();

  const loginValue = document.getElementById("signinEmail").value.trim().toLowerCase();
  const password = document.getElementById("signinPassword").value;

  if (!loginValue || !password) {
    showMessage(signinMessage, "Please enter your demo email/username and password.");
    return;
  }

  setButtonLoading(signinForm, true);

  setTimeout(function () {
    const user = getAllDemoUsers().find(function (demoUser) {
      const emailMatch = demoUser.email.toLowerCase() === loginValue;
      const usernameMatch = demoUser.username.toLowerCase() === loginValue;
      const passwordMatch = demoUser.password === password;

      return (emailMatch || usernameMatch) && passwordMatch;
    });

    setButtonLoading(signinForm, false);

    if (!user) {
      showMessage(
        signinMessage,
        "Wrong login. This page is ready to connect to Supabase Auth; use a current test account only until the backend is connected."
      );
      return;
    }

    currentUser = {
      id: user.username + "-demo-user",
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      account_status: user.account_status,
      classLetter: user.classLetter || null,
      linkedStudentId: user.linkedStudentId || null,
      linkedStudentName: user.linkedStudentName || "",
      presentacyStudentId: user.presentacyStudentId || null,
      parentPhone: user.parentPhone || "",
      children: Array.isArray(user.children) ? user.children : []
    };

    currentProfile = currentUser;

    saveSession(currentUser);
    loadProfileAndApp();
  }, 350);
}

function handleLogout() {
  closeMobileMenu();

  currentUser = null;
  currentProfile = null;

  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem("presentacy_role");
  localStorage.removeItem("presentacy_student");
  localStorage.removeItem("presentacy_class");

  showAuthPage();
  showSignin();
}

function saveSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));

  // Keep role-based pages such as Presentacy in sync with the real logged-in account.
  if (user && user.role) {
    const role = String(user.role).toLowerCase();
    localStorage.setItem("presentacy_role", role);

    if (role === "student" && user.presentacyStudentId) {
      localStorage.setItem("presentacy_student", user.presentacyStudentId);
      localStorage.setItem("presentacy_class", String(getPresentacyClassFromLetter(user.classLetter || "A")));
    } else if (role === "parent" && Array.isArray(user.children) && user.children.length) {
      const selectedChild = user.children.find(function (child) {
        return child.studentId === localStorage.getItem("dramagic_selected_parent_child");
      }) || user.children[0];

      if (selectedChild.presentacyStudentId) {
        localStorage.setItem("presentacy_student", selectedChild.presentacyStudentId);
        localStorage.setItem("presentacy_class", String(getPresentacyClassFromLetter(selectedChild.classLetter || "A")));
      }
    }

    window.dispatchEvent(new Event("dramagicSessionUpdated"));
  }
}

function getSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
  } catch (error) {
    return null;
  }
}

function normalizeSession(session) {
  if (!session) return null;

  const cleanSession = {
    id: session.id || session.username + "-demo-user",
    email: session.email || "",
    username: session.username || "",
    full_name: session.full_name || "Demo User",
    role: session.role || "student",
    account_status: session.account_status || "active",
    classLetter: session.classLetter || null,
    linkedStudentId: session.linkedStudentId || null,
    linkedStudentName: session.linkedStudentName || "",
    presentacyStudentId: session.presentacyStudentId || null,
    parentPhone: session.parentPhone || "",
    children: Array.isArray(session.children) ? session.children : []
  };

  if ((cleanSession.role === "student" || cleanSession.role === "parent") && !cleanSession.classLetter) {
    cleanSession.classLetter = "A";
  }

  if (cleanSession.role === "parent" && !cleanSession.children.length && cleanSession.linkedStudentId) {
    const linked = findStudentDirectoryRecord(cleanSession.linkedStudentId);
    if (linked) cleanSession.children = [makeParentChildRecord(linked)];
  }

  if (cleanSession.role === "parent") {
    cleanSession.children = addParentPreviewChildren(cleanSession.children, cleanSession);
  }

  return cleanSession;
}

/* ===============================
   APP ACCESS
================================ */

function loadProfileAndApp() {
  if (!currentProfile) {
    showAuthPage();
    return;
  }

  if (authPage) authPage.classList.add("hidden");
  if (app) app.classList.remove("hidden");

  if (roleBadge) {
    const classText = currentProfile.classLetter ? ` • Class ${currentProfile.classLetter}` : "";
    const childText = currentProfile.role === "parent" && currentProfile.linkedStudentName
      ? ` • Parent of ${currentProfile.linkedStudentName}`
      : "";
    roleBadge.textContent = `${currentProfile.full_name} • ${currentProfile.role.toUpperCase()}${childText || classText}`;
  }

  if (mobileMenuRole) {
    const roleText = String(currentProfile.role || "user").toUpperCase();
    const classText = currentProfile.classLetter ? ` • Class ${currentProfile.classLetter}` : "";
    mobileMenuRole.textContent = `${roleText}${classText}`;
  }

  if (studentClassBadge) {
    studentClassBadge.textContent = `Class ${getCurrentStudentClass()}`;
  }

  renderPersonalization();

  applyRoleAccess();
  renderAll();

  window.location.hash = isParent() ? "#parentArea" : "#home";
}

function showAuthPage() {
  if (authPage) authPage.classList.remove("hidden");
  if (app) app.classList.add("hidden");

  window.location.hash = "";
}

function isCEO() {
  return currentProfile &&
    currentProfile.role === "ceo" &&
    currentProfile.account_status === "active";
}

function canSeeTeacherArea() {
  return currentProfile &&
    currentProfile.account_status === "active" &&
    (currentProfile.role === "teacher" || currentProfile.role === "ceo");
}

function isStudent() {
  return currentProfile &&
    currentProfile.role === "student" &&
    currentProfile.account_status === "active";
}

function isParent() {
  return currentProfile &&
    currentProfile.role === "parent" &&
    currentProfile.account_status === "active";
}

function canSeeFinanceEntry() {
  return currentProfile &&
    currentProfile.account_status === "active" &&
    (currentProfile.role === "finance" || currentProfile.role === "ceo");
}

function canSeeStudentArea() {
  return currentProfile &&
    currentProfile.account_status === "active" &&
    (currentProfile.role === "student" || currentProfile.role === "teacher" || currentProfile.role === "ceo");
}

function applyRoleAccess() {
  if (!currentProfile) return;

  const role = currentProfile.role;
  const status = currentProfile.account_status;

  document.querySelectorAll(".finance-link").forEach(function (item) {
    item.classList.toggle("hidden", !isCEO());
  });

  document.querySelectorAll(".finance-entry-link").forEach(function (item) {
    item.classList.toggle("hidden", !canSeeFinanceEntry());
  });

  document.querySelectorAll(".ceo-only").forEach(function (item) {
    item.classList.toggle("hidden", !isCEO());
  });

  document.querySelectorAll(".teacher-link").forEach(function (item) {
    item.classList.toggle("hidden", !canSeeTeacherArea());
  });

  document.querySelectorAll(".parent-link").forEach(function (item) {
    item.classList.toggle("hidden", !isParent());
  });

  /*
    Student Area access rule:
    - Students see their own student dashboard.
    - Teachers/CEO can also open it as a preview/control area.
    - Parents do NOT see it; they use the Parent Dashboard instead.
  */
  document.querySelectorAll(".student-link").forEach(function (item) {
    item.classList.toggle("hidden", !canSeeStudentArea());
  });

  if (parentArea) parentArea.classList.toggle("hidden", !isParent());
  if (teacherArea) teacherArea.classList.toggle("hidden", !canSeeTeacherArea());

  if (pendingArea) pendingArea.classList.add("hidden");

  if (studentArea) {
    studentArea.classList.toggle("hidden", !canSeeStudentArea());
  }


  if (window.location.hash === "#teacherArea" && !canSeeTeacherArea()) {
    window.location.hash = "#home";
  }

  if (window.location.hash === "#parentArea" && !isParent()) {
    window.location.hash = "#home";
  }

  if (window.location.hash === "#studentArea" && !canSeeStudentArea()) {
    window.location.hash = "#home";
  }
}

/* ===============================
   NAVIGATION
================================ */

function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (href === "#teacherArea" && !canSeeTeacherArea()) {
        event.preventDefault();
        window.location.hash = "#home";
        closeMobileMenu();
        setActiveNavLinks("#home");
        return;
      }

      if (href === "#parentArea" && !isParent()) {
        event.preventDefault();
        window.location.hash = "#home";
        closeMobileMenu();
        setActiveNavLinks("#home");
        return;
      }

      if (href === "#studentArea" && !canSeeStudentArea()) {
        event.preventDefault();
        window.location.hash = isParent() ? "#parentArea" : "#home";
        closeMobileMenu();
        setActiveNavLinks(window.location.hash || "#home");
        return;
      }

      setActiveNavLinks(href);
      closeMobileMenu();
    });
  });

  window.addEventListener("hashchange", function () {
    setActiveNavLinks(window.location.hash || "#home");
  });
}

function setActiveNavLinks(href) {
  if (!href || !href.startsWith("#")) return;

  document.querySelectorAll(".nav-link").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("href") === href);
  });
}

function setupMobileMenu() {
  if (!mobileMenuBtn || !mobileNavPanel || !mobileNavOverlay) return;

  mobileMenuBtn.addEventListener("click", function () {
    openMobileMenu();
  });

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener("click", function () {
      closeMobileMenu();
    });
  }

  mobileNavOverlay.addEventListener("click", function () {
    closeMobileMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  if (!mobileMenuBtn || !mobileNavPanel || !mobileNavOverlay) return;

  mobileNavPanel.classList.remove("hidden");
  mobileNavOverlay.classList.remove("hidden");
  document.body.classList.add("mobile-menu-open");
  mobileMenuBtn.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  if (!mobileMenuBtn || !mobileNavPanel || !mobileNavOverlay) return;

  mobileNavPanel.classList.add("hidden");
  mobileNavOverlay.classList.add("hidden");
  document.body.classList.remove("mobile-menu-open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
}


function getCurrentStudentClass() {
  if (currentProfile && currentProfile.classLetter) {
    return currentProfile.classLetter;
  }

  return "A";
}

function renderAll() {
  if (studentClassBadge && currentProfile && currentProfile.role === "student") {
    studentClassBadge.textContent = `Class ${getCurrentStudentClass()}`;
  }

  renderStudentHomeLeaderboard();
  renderParentDashboard();
}



/* ===============================
   PARENT + SIGNUP HELPERS
================================ */

function getAllDemoUsers() {
  return DEMO_USERS.concat(getRegisteredUsers());
}

function getRegisteredUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.registeredUsers));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsers().filter(function (savedUser) {
    return String(savedUser.email || "").toLowerCase() !== String(user.email || "").toLowerCase();
  });

  users.push(user);
  localStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(users));
}

function makeDemoUsername(email) {
  const base = String(email || "user").split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-") || "user";
  return `${base}-${Date.now().toString(36)}`;
}

function findStudentDirectoryRecord(value) {
  const normalized = String(value || "").trim().toUpperCase();

  return DRAMAGIC_STUDENT_DIRECTORY.find(function (student) {
    return String(student.studentId || "").toUpperCase() === normalized ||
      String(student.legacyId || "").toUpperCase() === normalized;
  }) || null;
}

function makeParentChildRecord(student) {
  return {
    studentId: student.studentId,
    name: student.name,
    classLetter: student.classLetter,
    className: student.className,
    presentacyStudentId: student.presentacyStudentId || null,
    attendanceText: "Open Sheet",
    attendanceNote: "View sessions, status, time, late records, and absences.",
    badge: student.badge || "🎭",
    badgeText: student.badgeText || "Dramagic Star"
  };
}

function shouldAddParentPreviewChild(profile) {
  if (!profile || profile.role !== "parent") return false;

  const email = String(profile.email || "").toLowerCase();
  const username = String(profile.username || "").toLowerCase();
  const hasLaila = Array.isArray(profile.children) && profile.children.some(function (child) {
    return String(child.studentId || child.code || "").toUpperCase() === "DRG-A-001";
  });

  return email === "parent@dramagic.demo" || username === "parent" || hasLaila;
}

function addParentPreviewChildren(children, profile) {
  const list = Array.isArray(children) ? children.slice() : [];

  if (!shouldAddParentPreviewChild(profile)) {
    return list;
  }

  ["DRG-A-001", "DRG-A-002"].forEach(function (studentId) {
    const exists = list.some(function (child) {
      return String(child.studentId || child.code || "").toUpperCase() === studentId;
    });

    if (!exists) {
      const record = findStudentDirectoryRecord(studentId);
      if (record) list.push(makeParentChildRecord(record));
    }
  });

  return list;
}

function renderParentDashboard() {
  if (!parentArea) return;

  const shouldShow = isParent();
  parentArea.classList.toggle("hidden", !shouldShow);

  if (!shouldShow) return;

  const children = getParentChildren();

  if (!children.length) {
    if (parentChildrenList) {
      parentChildrenList.innerHTML = `<div class="empty-message">No child is linked to this parent account yet.</div>`;
    }
    if (parentChildDashboard) parentChildDashboard.classList.add("hidden");
    return;
  }

  const selectedChildId = localStorage.getItem("dramagic_selected_parent_child") || children[0].studentId;
  const selectedChild = children.find(function (child) { return child.studentId === selectedChildId; }) || children[0];

  localStorage.setItem("dramagic_selected_parent_child", selectedChild.studentId);

  if (parentChildrenList) {
    parentChildrenList.innerHTML = children.map(function (child) {
      const active = child.studentId === selectedChild.studentId;
      return `
        <button class="parent-child-card ${active ? "active" : ""}" type="button" data-parent-child="${clean(child.studentId)}">
          <span>👧</span>
          <strong>${clean(child.name)}</strong>
          <small>${clean(child.className || `Class ${child.classLetter || ""}`)}</small>
        </button>
      `;
    }).join("");

    parentChildrenList.querySelectorAll("[data-parent-child]").forEach(function (button) {
      button.addEventListener("click", function () {
        localStorage.setItem("dramagic_selected_parent_child", button.dataset.parentChild);
        renderParentDashboard();
      });
    });
  }

  renderParentChildDetails(selectedChild);
}

function getParentChildren() {
  if (!currentProfile || currentProfile.role !== "parent") return [];

  let children = [];

  if (Array.isArray(currentProfile.children) && currentProfile.children.length) {
    children = currentProfile.children.map(function (child) {
      const directoryRecord = findStudentDirectoryRecord(child.studentId) || {};
      return Object.assign({}, directoryRecord, child);
    });
  } else if (currentProfile.linkedStudentId) {
    const child = findStudentDirectoryRecord(currentProfile.linkedStudentId);
    children = child ? [makeParentChildRecord(child)] : [];
  }

  children = addParentPreviewChildren(children, currentProfile);

  if (children.length) {
    currentProfile.children = children;
    currentUser = Object.assign({}, currentUser || {}, { children: children });
    saveSession(Object.assign({}, currentProfile, { children: children }));
  }

  return children;
}

function renderParentChildDetails(child) {
  if (!parentChildDashboard || !child) return;

  parentChildDashboard.classList.remove("hidden");

  const leaderboardData = getParentLeaderboardData(child);

  if (parentChildName) parentChildName.textContent = child.name || "Dramagic Student";
  if (parentChildMeta) parentChildMeta.textContent = `${child.className || `Class ${child.classLetter || ""}`} • ${child.studentId || "Student ID"}`;
  if (parentChildRank) parentChildRank.textContent = leaderboardData.rank ? `#${leaderboardData.rank}` : "#-";
  if (parentChildPoints) parentChildPoints.textContent = leaderboardData.points;

  const attendanceUrl = buildChildAttendanceUrl(child);
  if (parentAttendanceLink) parentAttendanceLink.href = attendanceUrl;
  if (parentChildAttendance) parentChildAttendance.textContent = "Open Sheet";
  if (parentChildAttendanceNote) {
    parentChildAttendanceNote.textContent = `View ${child.name || "your child"}'s sessions, status, arrival time, late records, and absences.`;
  }

  if (parentAgendaLink) parentAgendaLink.href = buildAgendaUrl(child);
  if (parentChildBadge) parentChildBadge.textContent = child.badge || "🎭";
  if (parentChildBadgeText) parentChildBadgeText.textContent = child.badgeText || "Dramagic Star";
  if (parentAnnouncementText) parentAnnouncementText.textContent = `Check the Weekly Agenda for ${child.name || "your child"} to see the next session plan and preparation notes.`;
}


function buildChildAttendanceUrl(child) {
  const params = new URLSearchParams();

  params.set("view", "child");

  if (child.studentId) params.set("studentId", child.studentId);
  if (child.classLetter) params.set("class", child.classLetter);
  if (child.name) params.set("name", child.name);

  return `attendance.html?${params.toString()}#sheet`;
}

function buildAgendaUrl(child) {
  const params = new URLSearchParams();

  if (child.classLetter) params.set("class", child.classLetter);
  if (child.studentId) params.set("studentId", child.studentId);
  if (child.name) params.set("name", child.name);

  return `agenda.html?${params.toString()}`;
}

function getParentLeaderboardData(child) {
  const students = getPresentacyStudentsForHome();
  const classId = getPresentacyClassFromLetter(child.classLetter);
  const classStudents = students
    .filter(function (student) { return student.classId === classId; })
    .sort(function (a, b) { return Number(b.points || 0) - Number(a.points || 0); });

  const matched = classStudents.find(function (student) {
    return student.id === child.presentacyStudentId ||
      String(student.name || "").trim().toLowerCase() === String(child.name || "").trim().toLowerCase();
  });

  if (!matched) {
    return { rank: null, points: 0 };
  }

  return {
    rank: classStudents.findIndex(function (student) { return student.id === matched.id; }) + 1,
    points: Number(matched.points || 0)
  };
}

function getPresentacyClassFromLetter(letter) {
  const map = {
    A: "kids-a",
    B: "kids-b",
    C: "teens",
    D: "adults"
  };

  return map[letter] || "kids-a";
}

/* ===============================
   STUDENT HOME LEADERBOARD
================================ */

const HOME_PRESENTACY_DEFAULT_STUDENTS = [
  { id: "s1", name: "Laila Hassan", classId: "kids-a", className: "Kids A", presented: false, points: 42 },
  { id: "s2", name: "Youssef Ali", classId: "kids-a", className: "Kids A", presented: true, points: 65 },
  { id: "s3", name: "Mariam Tarek", classId: "kids-b", className: "Kids B", presented: false, points: 38 },
  { id: "s4", name: "Omar Nabil", classId: "teens", className: "Teens", presented: true, points: 81 },
  { id: "s5", name: "Nour Ahmed", classId: "teens", className: "Teens", presented: false, points: 58 },
  { id: "s6", name: "Malak Samir", classId: "adults", className: "Adults", presented: true, points: 74 }
];

function setupPresentacyHomeSync() {
  window.addEventListener("storage", function (event) {
    if (event.key === "presentacy_students") {
      renderStudentHomeLeaderboard();
    }
  });
}

function renderStudentHomeLeaderboard() {
  if (!studentHomeLeaderboard) return;

  const shouldShow = currentProfile &&
    currentProfile.account_status === "active" &&
    currentProfile.role === "student";

  studentHomeLeaderboard.classList.toggle("hidden", !shouldShow);

  if (!shouldShow) return;

  const students = getPresentacyStudentsForHome();
  const classId = getPresentacyClassForCurrentStudent();
  const classStudents = students
    .filter(function (student) {
      return student.classId === classId;
    })
    .sort(function (a, b) {
      return Number(b.points || 0) - Number(a.points || 0);
    });

  if (!classStudents.length) {
    if (homeLeaderboardTitle) homeLeaderboardTitle.textContent = "Your class leaderboard is waiting ✨";
    if (homeLeaderboardSubtitle) homeLeaderboardSubtitle.textContent = "Once your teacher adds students and points, rankings will appear here.";
    if (homeMyRank) homeMyRank.textContent = "#-";
    if (homeMyPoints) homeMyPoints.textContent = "0";
    if (homeNextGoal) homeNextGoal.textContent = "No class points yet.";
    if (homeTopStudents) homeTopStudents.innerHTML = `<p class="empty-message">No leaderboard data yet.</p>`;
    return;
  }

  const selectedStudent = findHomeLeaderboardStudent(classStudents);
  const selectedIndex = selectedStudent
    ? classStudents.findIndex(function (student) { return student.id === selectedStudent.id; })
    : -1;

  const selectedRank = selectedIndex >= 0 ? selectedIndex + 1 : null;
  const classLabel = formatHomeClassName(getCurrentStudentClass(), classStudents[0].className);
  const shownStudent = selectedStudent || classStudents[0];

  if (homeLeaderboardTitle) {
    homeLeaderboardTitle.textContent = `${classLabel} leaderboard`;
  }

  if (homeLeaderboardSubtitle) {
    homeLeaderboardSubtitle.textContent = selectedRank
      ? `${shownStudent.name} is currently #${selectedRank}. Keep collecting points through Presentacy, challenges, and class work.`
      : `Watch the top speakers in your class and try to climb the board.`;
  }

  if (homeMyRank) homeMyRank.textContent = selectedRank ? `#${selectedRank}` : "#-";
  if (homeMyPoints) homeMyPoints.textContent = Number(shownStudent.points || 0);

  if (homeNextGoal) {
    homeNextGoal.textContent = getHomeNextGoalText(classStudents, shownStudent, selectedRank);
  }

  if (homeTopStudents) {
    homeTopStudents.innerHTML = classStudents.slice(0, 3).map(function (student, index) {
      const mine = shownStudent && student.id === shownStudent.id;

      return `
        <div class="home-top-row ${mine ? "mine" : ""}">
          <b>#${index + 1}</b>
          <strong>${clean(student.name)}</strong>
          <span>${Number(student.points || 0)} pts</span>
        </div>
      `;
    }).join("");
  }
}

function getPresentacyStudentsForHome() {
  try {
    const saved = JSON.parse(localStorage.getItem("presentacy_students"));

    if (Array.isArray(saved) && saved.length) {
      return saved.map(normalizeHomePresentacyStudent);
    }
  } catch {
    // Use default demo students below.
  }

  return HOME_PRESENTACY_DEFAULT_STUDENTS.map(normalizeHomePresentacyStudent);
}

function normalizeHomePresentacyStudent(student) {
  return {
    id: student.id || makeId(),
    name: student.name || "Dramagic Student",
    classId: student.classId || "kids-a",
    className: student.className || "Kids A",
    points: Number(student.points || 0),
    presented: Boolean(student.presented)
  };
}

function getPresentacyClassForCurrentStudent() {
  return getPresentacyClassFromLetter(getCurrentStudentClass());
}

function findHomeLeaderboardStudent(classStudents) {
  if (!classStudents.length || !currentProfile) return null;

  if (currentProfile.presentacyStudentId) {
    const idMatch = classStudents.find(function (student) {
      return student.id === currentProfile.presentacyStudentId;
    });

    if (idMatch) return idMatch;
  }

  const profileName = (currentProfile.linkedStudentName || currentProfile.full_name || "").trim().toLowerCase();

  const exactMatch = classStudents.find(function (student) {
    return student.name.trim().toLowerCase() === profileName;
  });

  if (exactMatch) return exactMatch;

  const savedPresentacyStudentId = localStorage.getItem("presentacy_student");
  const savedMatch = classStudents.find(function (student) {
    return student.id === savedPresentacyStudentId;
  });

  if (savedMatch) return savedMatch;

  return classStudents[0];
}

function getHomeNextGoalText(classStudents, student, rank) {
  if (!student) return "Start earning points to join the leaderboard.";

  if (rank === 1) {
    const second = classStudents[1];
    if (!second) return "You are leading your class. Keep the crown!";
    const gap = Number(student.points || 0) - Number(second.points || 0);
    return `You are leading by ${gap} point${gap === 1 ? "" : "s"}. Protect your rank!`;
  }

  if (rank && rank > 1) {
    const ahead = classStudents[rank - 2];
    const needed = Number(ahead.points || 0) - Number(student.points || 0) + 1;
    return `${needed} point${needed === 1 ? "" : "s"} to reach #${rank - 1}.`;
  }

  return "Earn points in Presentacy to appear in the race.";
}

function formatHomeClassName(letter, fallbackName) {
  if (letter) return `Class ${letter}`;
  return fallbackName || "Your class";
}


/* ===============================
   HELPERS
================================ */

function showMessage(element, message, success = false) {
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("success", success);
}

function setButtonLoading(form, isLoading) {
  if (!form) return;

  const button = form.querySelector("button[type='submit']");
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = "Please wait...";
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}


function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-EG", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function formatMessageTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-EG", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function clean(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "demo-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

/* ===============================
   SCROLL ANIMATION
================================ */

function startScrollAnimations() {
  const animatedItems = document.querySelectorAll(
    ".section, .auth-hero, .auth-card, .info-card, .panel, .summary-card, .stat-card, .logo-stage, .status-card"
  );

  animatedItems.forEach(function (item) {
    item.classList.add("reveal-motion");
  });

  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach(function (item) {
      item.classList.add("show-motion");
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-motion");
      }
    });
  }, {
    threshold: 0.12
  });

  animatedItems.forEach(function (item) {
    observer.observe(item);
  });
}

/* ===============================
   GLOBAL BUTTON FUNCTIONS
================================ */


function setupUserMenu() {
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", function () {
      userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
      const clickedInside = userMenuBtn.contains(event.target) || userDropdown.contains(event.target);

      if (!clickedInside) {
        userDropdown.classList.add("hidden");
      }
    });
  }
}

function getProfileStorageKey() {
  const userId = currentProfile?.id || currentUser?.id || "guest";
  return `dramagic_profile_${userId}`;
}

function getSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(getProfileStorageKey())) || {};
  } catch {
    return {};
  }
}

function getDefaultAvatar(role) {
  if (role === "ceo") {
    return avatarSvg("👑", "#08a9d9", "#007aa7");
  }

  if (role === "parent") {
    return avatarSvg("👨‍👩‍👧", "#08a9d9", "#7edcff");
  }

  if (role === "teacher") {
    return avatarSvg("🎭", "#08a9d9", "#6fdfff");
  }

  if (role === "finance") {
    return avatarSvg("🧾", "#08a9d9", "#007aa7");
  }

  return avatarSvg("🌟", "#08a9d9", "#7edcff");
}

function renderPersonalization() {
  if (!currentProfile) return;

  const savedProfile = getSavedProfile();
  const displayName = getProfileDisplayName(savedProfile);
  const avatar = getCurrentUserAvatar();

  if (navUserName) navUserName.textContent = displayName;
  if (navProfilePic) navProfilePic.src = avatar;
  if (homeProfilePic) homeProfilePic.src = avatar;

  if (personalGreeting) {
    personalGreeting.textContent = getGreeting(displayName);
  }

  if (personalMessage) {
    personalMessage.textContent = getRoleMessage(currentProfile.role, currentProfile.classLetter);
  }
}

function getProfileDisplayName(savedProfile = {}) {
  const savedName = String(savedProfile.displayName || "").trim();
  const profileName = String(currentProfile?.full_name || "").trim();
  const fallback = currentProfile?.role === "parent" ? "Parent" : "Dramagic Star";
  let name = savedName || profileName || fallback;

  // Old demo sessions sometimes saved the child name as "Laila's Parent".
  // Do not show that as the greeting. Backend will provide the real parent name.
  if (currentProfile?.role === "parent" && /\bparent$/i.test(name) && name.includes("'s ")) {
    name = savedName || currentProfile.parentName || "Parent";
  }

  return name;
}

function getGreeting(name) {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good morning, ${name} ✨`;
  }

  if (hour < 18) {
    return `Welcome back, ${name} 🎭`;
  }

  return `Good evening, ${name} 🌙`;
}

function getRoleMessage(role, classLetter) {
  if (role === "student") {
    return `Ready for your Dramagic mission today? Your class is ${classLetter || "not selected yet"}.`;
  }

  if (role === "parent") {
    return `Your dashboard is ready${currentProfile?.linkedStudentName ? ` for ${currentProfile.linkedStudentName}` : ""}. Check attendance and the weekly agenda from your dashboard.`;
  }

  if (role === "teacher") {
    return "Your classes, weekly agenda, and Presentacy students are waiting for you.";
  }

  if (role === "ceo") {
    return "Your academy dashboard is ready: students, finance, memories, and progress.";
  }

  if (role === "finance") {
    return "Your payment-entry workspace is ready. You can add student payments and follow remaining balances without opening the full finance dashboard.";
  }

  return "Your Dramagic journey is ready.";
}

function applySavedTheme() {
  let theme = localStorage.getItem("dramagic_theme") || "light";

  try {
    const settings = JSON.parse(localStorage.getItem("dramagic_settings")) || {};
    theme = settings.theme || theme;
  } catch {
    /* keep normal theme */
  }

  const systemWantsDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = theme === "dark" || (theme === "system" && systemWantsDark);

  document.body.classList.toggle("dark-mode", shouldUseDark);
  document.documentElement.classList.toggle("dark-mode", shouldUseDark);
}


function getCurrentUserAvatar() {
  const userId = currentProfile?.id || currentUser?.id || "guest";

  const possibleKeys = [
    `dramagic_profile_${userId}`,
    "dramagic_current_profile_picture",
    "dramagic_latest_profile_picture",
    "dramagic_profile_picture",
    "dramagic_profile_guest"
  ];

  for (const key of possibleKeys) {
    const avatar = readAvatarFromStorageKey(key);

    if (avatar) return avatar;
  }

  return getDefaultAvatar(currentProfile?.role || currentUser?.role || "student");
}

function readAvatarFromStorageKey(key) {
  const value = localStorage.getItem(key);
  if (!value) return "";

  if (value.startsWith("data:image")) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    return parsed.profilePic ||
      parsed.avatar ||
      parsed.picture ||
      parsed.photo ||
      parsed.pfp ||
      "";
  } catch {
    return "";
  }
}

function avatarSvg(icon, colorOne, colorTwo) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorOne}"/>
          <stop offset="100%" stop-color="${colorTwo}"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#g)"/>
      <circle cx="80" cy="80" r="58" fill="rgba(255,255,255,.18)"/>
      <text x="80" y="100" text-anchor="middle" font-size="64">${icon}</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}


/* =====================================================
   DRAMAGIC FIX — Dashboard connected points
   Presentacy + attendance adjustments are connected.
   Wordle/game points stay isolated in game.html/game.js.
===================================================== */
var DRAMAGIC_ATTENDANCE_POINTS_KEY = "dramagic_attendance_point_adjustments";

function readAttendancePointAdjustmentsForDashboard() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAMAGIC_ATTENDANCE_POINTS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function homeClassIdToLetter(classId) {
  const map = { "kids-a": "A", "kids-b": "B", teens: "C", adults: "D" };
  return map[classId] || "";
}

function getAttendanceAdjustmentForHomeStudent(student) {
  const name = String(student?.name || "").trim().toLowerCase();
  const classLetter = homeClassIdToLetter(student?.classId || "");
  return readAttendancePointAdjustmentsForDashboard().reduce(function (total, item) {
    const itemName = String(item.studentName || "").trim().toLowerCase();
    const itemClass = String(item.classLetter || "").trim().toUpperCase();
    const sameName = name && itemName === name;
    const sameClass = !classLetter || !itemClass || itemClass === classLetter;
    return sameName && sameClass ? total + Number(item.pointDelta || 0) : total;
  }, 0);
}

function getDramagicPointsForHomeStudent(student) {
  return Number(student?.points || 0) + getAttendanceAdjustmentForHomeStudent(student);
}

function getPresentacyStudentsForHome() {
  let source = [];
  try {
    const saved = JSON.parse(localStorage.getItem("presentacy_students"));
    if (Array.isArray(saved) && saved.length) source = saved;
  } catch {
    source = [];
  }

  if (!source.length) source = HOME_PRESENTACY_DEFAULT_STUDENTS;

  return source.map(function (student) {
    const normalized = normalizeHomePresentacyStudent(student);
    normalized.basePoints = Number(normalized.points || 0);
    normalized.attendanceAdjustment = getAttendanceAdjustmentForHomeStudent(normalized);
    normalized.points = normalized.basePoints + normalized.attendanceAdjustment;
    return normalized;
  });
}

function getParentLeaderboardData(child) {
  const students = getPresentacyStudentsForHome();
  const classId = getPresentacyClassFromLetter(child.classLetter);
  const classStudents = students
    .filter(function (student) { return student.classId === classId; })
    .sort(function (a, b) { return Number(b.points || 0) - Number(a.points || 0); });

  const matched = classStudents.find(function (student) {
    return student.id === child.presentacyStudentId ||
      String(student.name || "").trim().toLowerCase() === String(child.name || "").trim().toLowerCase();
  });

  if (!matched) return { rank: null, points: 0, basePoints: 0, attendanceAdjustment: 0 };

  return {
    rank: classStudents.findIndex(function (student) { return student.id === matched.id; }) + 1,
    points: Number(matched.points || 0),
    basePoints: Number(matched.basePoints || matched.points || 0),
    attendanceAdjustment: Number(matched.attendanceAdjustment || 0)
  };
}

function renderParentChildDetails(child) {
  if (!parentChildDashboard || !child) return;

  parentChildDashboard.classList.remove("hidden");
  const leaderboardData = getParentLeaderboardData(child);

  if (parentChildName) parentChildName.textContent = child.name || "Dramagic Student";
  if (parentChildMeta) parentChildMeta.textContent = `${child.className || `Class ${child.classLetter || ""}`} • ${child.studentId || "Student ID"}`;
  if (parentChildRank) parentChildRank.textContent = leaderboardData.rank ? `#${leaderboardData.rank}` : "#-";
  if (parentChildPoints) parentChildPoints.textContent = leaderboardData.points;

  const attendanceUrl = buildChildAttendanceUrl(child);
  if (parentAttendanceLink) parentAttendanceLink.href = attendanceUrl;
  if (parentChildAttendance) parentChildAttendance.textContent = "Open Attendance";
  if (parentChildAttendanceNote) {
    const adj = leaderboardData.attendanceAdjustment;
    parentChildAttendanceNote.textContent = adj
      ? `Attendance is included in Dramagic points (${adj} point${Math.abs(adj) === 1 ? "" : "s"}).`
      : `View ${child.name || "your child"}'s sessions, status, arrival time, late records, and absences.`;
  }

  if (parentAgendaLink) parentAgendaLink.href = buildAgendaUrl(child);
  if (parentChildBadge) parentChildBadge.textContent = child.badge || "🎭";
  if (parentChildBadgeText) parentChildBadgeText.textContent = child.badgeText || "Dramagic Star";
  if (parentAnnouncementText) parentAnnouncementText.textContent = `Check the Weekly Agenda for ${child.name || "your child"} to see the next session plan and preparation notes.`;
}

window.addEventListener("storage", function (event) {
  if (event.key === DRAMAGIC_ATTENDANCE_POINTS_KEY) {
    renderStudentHomeLeaderboard();
    renderParentDashboard();
  }
});
window.addEventListener("dramagicPointsChanged", function () {
  renderStudentHomeLeaderboard();
  renderParentDashboard();
});
