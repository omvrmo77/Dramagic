const SUPABASE_URL = "https://ovvlhsezirovapuqlruw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dmxoc2V6aXJvdmFwdXFscnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzY2MTUsImV4cCI6MjA4ODIxMjYxNX0.Oo0gUIOTT0xEPEo-nIxqVnmMA_yAob95B66y8SpOUZc";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEMP_CEO_USERNAME = "omar";
const TEMP_CEO_PASSWORD = "ceo123";

let currentUser = null;
let currentProfile = null;
let students = [];
let expenses = [];

const money = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0
});

const authPage = document.getElementById("authPage");
const app = document.getElementById("app");

const showSignupBtn = document.getElementById("showSignupBtn");
const showSigninBtn = document.getElementById("showSigninBtn");
const signupForm = document.getElementById("signupForm");
const signinForm = document.getElementById("signinForm");

const signupMessage = document.getElementById("signupMessage");
const signinMessage = document.getElementById("signinMessage");

const roleBadge = document.getElementById("roleBadge");
const logoutBtn = document.getElementById("logoutBtn");

const pendingArea = document.getElementById("pendingArea");
const studentArea = document.getElementById("studentArea");
const teacherArea = document.getElementById("teacherArea");
const financeSection = document.getElementById("financial");

const studentForm = document.getElementById("studentForm");
const expenseForm = document.getElementById("expenseForm");
const studentSearch = document.getElementById("studentSearch");
const expenseSearch = document.getElementById("expenseSearch");

const studentsList = document.getElementById("studentsList");
const expensesList = document.getElementById("expensesList");

document.getElementById("year").textContent = new Date().getFullYear();

showSignupBtn.addEventListener("click", showSignup);
showSigninBtn.addEventListener("click", showSignin);

signupForm.addEventListener("submit", handleSignup);
signinForm.addEventListener("submit", handleSignin);
logoutBtn.addEventListener("click", handleLogout);

studentForm.addEventListener("submit", handleAddStudentPayment);
expenseForm.addEventListener("submit", handleAddExpense);

studentSearch.addEventListener("input", renderStudents);
expenseSearch.addEventListener("input", renderExpenses);

document.getElementById("resetBtn").addEventListener("click", handleResetFinance);

document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    const href = link.getAttribute("href");

    if (href === "#financial" && !isCEO()) {
      event.preventDefault();
      window.location.hash = "#home";
      return;
    }

    if (href === "#teacherArea" && !canSeeTeacherArea()) {
      event.preventDefault();
      window.location.hash = "#home";
      return;
    }

    document.querySelectorAll(".nav-link").forEach(function (item) {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

db.auth.onAuthStateChange(async function (_event, session) {
  currentUser = session?.user || null;

  if (currentUser) {
    await loadProfileAndApp();
  } else {
    showAuthPage();
  }
});

init();

async function init() {
  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error(error);
    showAuthPage();
    return;
  }

  currentUser = data.session?.user || null;

  if (currentUser) {
    await loadProfileAndApp();
  } else {
    showAuthPage();
  }
}

function showSignup() {
  signupForm.classList.remove("hidden");
  signinForm.classList.add("hidden");

  showSignupBtn.classList.add("active");
  showSigninBtn.classList.remove("active");

  clearMessages();
}

function showSignin() {
  signinForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  showSigninBtn.classList.add("active");
  showSignupBtn.classList.remove("active");

  clearMessages();
}

function clearMessages() {
  signupMessage.textContent = "";
  signupMessage.classList.remove("success");
  signinMessage.textContent = "";
  signinMessage.classList.remove("success");
}

async function handleSignup(event) {
  event.preventDefault();

  clearMessages();

  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const birthday = document.getElementById("signupBirthday").value;
  const studentIdNumber = document.getElementById("signupStudentId").value.replace(/\D/g, "");
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  if (!fullName || !email || !birthday || !studentIdNumber || !password || !confirmPassword) {
    showMessage(signupMessage, "Please fill all fields.");
    return;
  }

  if (studentIdNumber.length < 4) {
    showMessage(signupMessage, "Please enter a valid Dramagic ID number.");
    return;
  }

  if (password.length < 8) {
    showMessage(signupMessage, "Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(signupMessage, "Passwords do not match.");
    return;
  }

  setButtonLoading(signupForm, true);

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        birthday: birthday,
        student_id_number: studentIdNumber
      }
    }
  });

  setButtonLoading(signupForm, false);

  if (error) {
    showMessage(signupMessage, error.message);
    return;
  }

  signupForm.reset();

  if (data.session) {
    currentUser = data.user;
    await loadProfileAndApp();
  } else {
    showMessage(
      signupMessage,
      "Account created. Check your email to confirm, then sign in.",
      true
    );
    showSignin();
  }
}

async function handleSignin(event) {
  event.preventDefault();

  clearMessages();

  const emailOrUsername = document.getElementById("signinEmail").value.trim().toLowerCase();
  const password = document.getElementById("signinPassword").value;

  if (!emailOrUsername || !password) {
    showMessage(signinMessage, "Please enter your email/username and password.");
    return;
  }

  // TEMPORARY CEO LOGIN - FRONTEND TESTING ONLY
  if (emailOrUsername === TEMP_CEO_USERNAME && password === TEMP_CEO_PASSWORD) {
    currentUser = {
      id: "temp-ceo-user",
      email: "temp-ceo@dramagic.test"
    };

    currentProfile = {
      id: "temp-ceo-user",
      full_name: "Omar",
      email: "temp-ceo@dramagic.test",
      birthday: null,
      student_id_number: null,
      role: "ceo",
      account_status: "active"
    };

    authPage.classList.add("hidden");
    app.classList.remove("hidden");

    roleBadge.textContent = "Omar • CEO";

    applyRoleAccess();
    setTodayDate();

    // Demo empty finance data
    students = [];
    expenses = [];
    renderAll();

    window.location.hash = "#home";
    return;
  }

  setButtonLoading(signinForm, true);

  const { data, error } = await db.auth.signInWithPassword({
    email: emailOrUsername,
    password
  });

  setButtonLoading(signinForm, false);

  if (error) {
    showMessage(signinMessage, error.message);
    return;
  }

  currentUser = data.user;
  await loadProfileAndApp();
}

async function handleLogout() {
  await db.auth.signOut();
  currentUser = null;
  currentProfile = null;
  students = [];
  expenses = [];
  showAuthPage();
}

async function loadProfileAndApp() {
  const profile = await fetchProfile();

  if (!profile) {
    showAuthPage();
    showSignin();
    showMessage(signinMessage, "Your profile is not ready yet. Try signing in again in a few seconds.");
    return;
  }

  currentProfile = profile;

  authPage.classList.add("hidden");
  app.classList.remove("hidden");

  roleBadge.textContent = `${currentProfile.full_name || "User"} • ${currentProfile.role.toUpperCase()}`;

  applyRoleAccess();
  setTodayDate();

  if (isCEO()) {
    await loadFinanceData();
  } else {
    renderSummary();
  }

  window.location.hash = "#home";
}

async function fetchProfile() {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

function applyRoleAccess() {
  const role = currentProfile.role;
  const status = currentProfile.account_status;

  document.querySelectorAll(".finance-link").forEach(function (item) {
    item.classList.toggle("hidden", !isCEO());
  });

  document.querySelectorAll(".ceo-only").forEach(function (item) {
    item.classList.toggle("hidden", !isCEO());
  });

  document.querySelectorAll(".teacher-link").forEach(function (item) {
    item.classList.toggle("hidden", !canSeeTeacherArea());
  });

  financeSection.classList.toggle("hidden", !isCEO());
  teacherArea.classList.toggle("hidden", !canSeeTeacherArea());

  if (role === "pending" || status === "pending") {
    pendingArea.classList.remove("hidden");
    studentArea.classList.add("hidden");
  } else {
    pendingArea.classList.add("hidden");
    studentArea.classList.remove("hidden");
  }

  if (window.location.hash === "#financial" && !isCEO()) {
    window.location.hash = "#home";
  }

  if (window.location.hash === "#teacherArea" && !canSeeTeacherArea()) {
    window.location.hash = "#home";
  }
}

function showAuthPage() {
  authPage.classList.remove("hidden");
  app.classList.add("hidden");
  window.location.hash = "";
}

function isCEO() {
  return currentProfile && currentProfile.role === "ceo" && currentProfile.account_status === "active";
}

function canSeeTeacherArea() {
  return currentProfile &&
    currentProfile.account_status === "active" &&
    (currentProfile.role === "teacher" || currentProfile.role === "ceo");
}

function showMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

function setButtonLoading(form, isLoading) {
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

function setTodayDate() {
  const studentDate = document.getElementById("studentDate");
  const expenseDate = document.getElementById("expenseDate");

  if (!studentDate || !expenseDate) return;

  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  studentDate.value = local;
  expenseDate.value = local;
}

async function loadFinanceData() {
  if (!isCEO()) return;

  const [studentsResponse, expensesResponse] = await Promise.all([
    db.from("finance_students").select("*").order("created_at", { ascending: false }),
    db.from("finance_expenses").select("*").order("created_at", { ascending: false })
  ]);

  if (studentsResponse.error) {
    console.error(studentsResponse.error);
    students = [];
  } else {
    students = studentsResponse.data || [];
  }

  if (expensesResponse.error) {
    console.error(expensesResponse.error);
    expenses = [];
  } else {
    expenses = expensesResponse.data || [];
  }

  renderAll();
}

async function handleAddStudentPayment(event) {
  event.preventDefault();

  if (!isCEO()) return;

  const newRecord = {
    student_name: document.getElementById("studentName").value.trim(),
    course_group: document.getElementById("studentCourse").value.trim(),
    total_fee: Number(document.getElementById("studentFee").value),
    paid_amount: Number(document.getElementById("studentPaid").value),
    payment_at: document.getElementById("studentDate").value,
    notes: document.getElementById("studentNotes").value.trim()
  };

  const { error } = await db.from("finance_students").insert(newRecord);

  if (error) {
    alert(error.message);
    return;
  }

  studentForm.reset();
  setTodayDate();
  await loadFinanceData();
}

async function handleAddExpense(event) {
  event.preventDefault();

  if (!isCEO()) return;

  const newRecord = {
    title: document.getElementById("expenseTitle").value.trim(),
    category: document.getElementById("expenseCategory").value,
    amount: Number(document.getElementById("expenseAmount").value),
    paid_at: document.getElementById("expenseDate").value,
    notes: document.getElementById("expenseNotes").value.trim()
  };

  const { error } = await db.from("finance_expenses").insert(newRecord);

  if (error) {
    alert(error.message);
    return;
  }

  expenseForm.reset();
  setTodayDate();
  await loadFinanceData();
}

async function handleResetFinance() {
  if (!isCEO()) return;

  const sure = confirm("Are you sure? This will delete all finance data.");
  if (!sure) return;

  const studentsDelete = await db
    .from("finance_students")
    .delete()
    .not("id", "is", null);

  if (studentsDelete.error) {
    alert(studentsDelete.error.message);
    return;
  }

  const expensesDelete = await db
    .from("finance_expenses")
    .delete()
    .not("id", "is", null);

  if (expensesDelete.error) {
    alert(expensesDelete.error.message);
    return;
  }

  await loadFinanceData();
}

async function deleteStudent(id) {
  if (!isCEO()) return;

  const sure = confirm("Delete this student payment record?");
  if (!sure) return;

  const { error } = await db
    .from("finance_students")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadFinanceData();
}

async function deleteExpense(id) {
  if (!isCEO()) return;

  const sure = confirm("Delete this expense record?");
  if (!sure) return;

  const { error } = await db
    .from("finance_expenses")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadFinanceData();
}

function totals() {
  const revenue = students.reduce(function (sum, student) {
    return sum + Number(student.paid_amount || 0);
  }, 0);

  const fees = students.reduce(function (sum, student) {
    return sum + Number(student.total_fee || 0);
  }, 0);

  const totalExpenses = expenses.reduce(function (sum, expense) {
    return sum + Number(expense.amount || 0);
  }, 0);

  const remaining = Math.max(fees - revenue, 0);
  const profit = revenue - totalExpenses;
  const netProfit = Math.max(profit, 0);

  return {
    revenue,
    fees,
    totalExpenses,
    remaining,
    profit,
    partnerShare: netProfit * 0.3,
    ourShare: netProfit * 0.7
  };
}

function renderSummary() {
  const t = totals();

  document.getElementById("homeStudents").textContent = students.length;
  document.getElementById("homeRevenue").textContent = money.format(t.revenue);
  document.getElementById("homeProfit").textContent = money.format(t.profit);

  if (!isCEO()) return;

  document.getElementById("totalRevenue").textContent = money.format(t.revenue);
  document.getElementById("totalExpenses").textContent = money.format(t.totalExpenses);
  document.getElementById("totalRemaining").textContent = money.format(t.remaining);
  document.getElementById("totalProfit").textContent = money.format(t.profit);
  document.getElementById("partnerShare").textContent = money.format(t.partnerShare);
  document.getElementById("ourShare").textContent = money.format(t.ourShare);
}

function renderStudents() {
  if (!isCEO()) return;

  const search = studentSearch.value.trim().toLowerCase();

  const filtered = students.filter(function (student) {
    return `${student.student_name} ${student.course_group} ${student.notes}`
      .toLowerCase()
      .includes(search);
  });

  if (filtered.length === 0) {
    studentsList.innerHTML = `<div class="empty-message">No students added yet.</div>`;
    return;
  }

  studentsList.innerHTML = filtered.map(function (student) {
    const remaining = Math.max(Number(student.total_fee) - Number(student.paid_amount), 0);

    const remainingHTML = remaining <= 0
      ? `<span class="paid">Paid</span>`
      : `<span class="due">${money.format(remaining)}</span>`;

    return `
      <article class="record-card">
        <div class="record-row">
          <span class="record-label">Name</span>
          <span class="record-value"><strong>${clean(student.student_name)}</strong></span>
        </div>

        <div class="record-row">
          <span class="record-label">Course</span>
          <span class="record-value">${clean(student.course_group || "-")}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Fee</span>
          <span class="record-value">${money.format(student.total_fee)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Paid</span>
          <span class="record-value">${money.format(student.paid_amount)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Remaining</span>
          <span class="record-value">${remainingHTML}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Date</span>
          <span class="record-value">${formatDate(student.payment_at)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Notes</span>
          <span class="record-value">${clean(student.notes || "-")}</span>
        </div>

        <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
      </article>
    `;
  }).join("");
}

function renderExpenses() {
  if (!isCEO()) return;

  const search = expenseSearch.value.trim().toLowerCase();

  const filtered = expenses.filter(function (expense) {
    return `${expense.title} ${expense.category} ${expense.notes}`
      .toLowerCase()
      .includes(search);
  });

  if (filtered.length === 0) {
    expensesList.innerHTML = `<div class="empty-message">No expenses added yet.</div>`;
    return;
  }

  expensesList.innerHTML = filtered.map(function (expense) {
    return `
      <article class="record-card">
        <div class="record-row">
          <span class="record-label">Title</span>
          <span class="record-value"><strong>${clean(expense.title)}</strong></span>
        </div>

        <div class="record-row">
          <span class="record-label">Category</span>
          <span class="record-value">${clean(expense.category)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Amount</span>
          <span class="record-value">${money.format(expense.amount)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Date</span>
          <span class="record-value">${formatDate(expense.paid_at)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Notes</span>
          <span class="record-value">${clean(expense.notes || "-")}</span>
        </div>

        <button class="delete-btn" onclick="deleteExpense('${expense.id}')">Delete</button>
      </article>
    `;
  }).join("");
}

function renderAll() {
  renderSummary();
  renderStudents();
  renderExpenses();
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-EG", {
    dateStyle: "medium",
    timeStyle: "short"
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
function startScrollAnimations() {
  const animatedItems = document.querySelectorAll(
    ".section, .auth-hero, .auth-card, .info-card, .panel, .summary-card, .stat-card, .logo-stage, .status-card"
  );

  animatedItems.forEach(function (item) {
    item.classList.add("reveal-motion");
  });

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

startScrollAnimations();

