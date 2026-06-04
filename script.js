const accounts = [
  {
    username: "student",
    password: "student123",
    role: "student",
    name: "Student"
  },
  {
    username: "teacher",
    password: "teacher123",
    role: "teacher",
    name: "Teacher"
  },
  {
    username: "omar",
    password: "ceo123",
    role: "ceo",
    name: "Omar"
  },
  {
    username: "founder",
    password: "ceo456",
    role: "ceo",
    name: "Founder"
  }
];

let currentUser = JSON.parse(sessionStorage.getItem("dramagic_current_user")) || null;
let students = JSON.parse(localStorage.getItem("dramagic_students")) || [];
let expenses = JSON.parse(localStorage.getItem("dramagic_expenses")) || [];

const money = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0
});

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const guestBtn = document.getElementById("guestBtn");
const loginError = document.getElementById("loginError");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const roleBadge = document.getElementById("roleBadge");
const logoutBtn = document.getElementById("logoutBtn");

const financeSection = document.getElementById("financial");
const teacherSection = document.getElementById("teacherArea");

const studentForm = document.getElementById("studentForm");
const expenseForm = document.getElementById("expenseForm");
const studentSearch = document.getElementById("studentSearch");
const expenseSearch = document.getElementById("expenseSearch");

const studentsList = document.getElementById("studentsList");
const expensesList = document.getElementById("expensesList");

document.getElementById("year").textContent = new Date().getFullYear();

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  const foundAccount = accounts.find(function (account) {
    return account.username === username && account.password === password;
  });

  if (!foundAccount) {
    loginError.textContent = "Wrong username or password.";
    return;
  }

  login(foundAccount);
});

guestBtn.addEventListener("click", function () {
  login({
    username: "guest",
    password: "",
    role: "guest",
    name: "Guest"
  });
});

logoutBtn.addEventListener("click", logout);

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!isCEO()) return;

  const student = {
    id: Date.now().toString(),
    name: document.getElementById("studentName").value.trim(),
    course: document.getElementById("studentCourse").value.trim(),
    fee: Number(document.getElementById("studentFee").value),
    paid: Number(document.getElementById("studentPaid").value),
    date: document.getElementById("studentDate").value,
    notes: document.getElementById("studentNotes").value.trim()
  };

  students.unshift(student);
  saveData();
  renderAll();

  studentForm.reset();
  setTodayDate();
});

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!isCEO()) return;

  const expense = {
    id: Date.now().toString(),
    title: document.getElementById("expenseTitle").value.trim(),
    category: document.getElementById("expenseCategory").value,
    amount: Number(document.getElementById("expenseAmount").value),
    date: document.getElementById("expenseDate").value,
    notes: document.getElementById("expenseNotes").value.trim()
  };

  expenses.unshift(expense);
  saveData();
  renderAll();

  expenseForm.reset();
  setTodayDate();
});

studentSearch.addEventListener("input", renderStudents);
expenseSearch.addEventListener("input", renderExpenses);

document.getElementById("resetBtn").addEventListener("click", function () {
  if (!isCEO()) return;

  const sure = confirm("Are you sure? This will delete all saved finance data on this device.");

  if (!sure) return;

  students = [];
  expenses = [];

  saveData();
  renderAll();
});

document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    const href = link.getAttribute("href");

    if (href === "#financial" && !isCEO()) {
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

function login(user) {
  currentUser = user;
  sessionStorage.setItem("dramagic_current_user", JSON.stringify(currentUser));
  showApp();
  window.location.hash = "#home";
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem("dramagic_current_user");

  app.classList.add("hidden");
  loginPage.classList.remove("hidden");

  document.body.classList.remove("app-mode");
  document.body.classList.add("login-mode");

  usernameInput.value = "";
  passwordInput.value = "";
  loginError.textContent = "";
  window.location.hash = "";
}

function showApp() {
  if (!currentUser) {
    app.classList.add("hidden");
    loginPage.classList.remove("hidden");

    document.body.classList.remove("app-mode");
    document.body.classList.add("login-mode");
    return;
  }

  loginPage.classList.add("hidden");
  app.classList.remove("hidden");

  document.body.classList.remove("login-mode");
  document.body.classList.add("app-mode");

  roleBadge.textContent = `${currentUser.name} • ${currentUser.role.toUpperCase()}`;

  applyRoleAccess();
  setTodayDate();
  renderAll();
}

function applyRoleAccess() {
  const role = currentUser.role;

  document.querySelectorAll(".finance-link").forEach(function (item) {
    item.classList.toggle("hidden", role !== "ceo");
  });

  document.querySelectorAll(".ceo-only").forEach(function (item) {
    item.classList.toggle("hidden", role !== "ceo");
  });

  financeSection.classList.toggle("hidden", role !== "ceo");

  if (role === "guest" || role === "student") {
    teacherSection.classList.add("hidden");
    document.querySelectorAll(".teacher-link").forEach(function (item) {
      item.classList.add("hidden");
    });
  } else {
    teacherSection.classList.remove("hidden");
    document.querySelectorAll(".teacher-link").forEach(function (item) {
      item.classList.remove("hidden");
    });
  }

  if (window.location.hash === "#financial" && role !== "ceo") {
    window.location.hash = "#home";
  }

  if (window.location.hash === "#teacherArea" && role !== "teacher" && role !== "ceo") {
    window.location.hash = "#home";
  }
}

function isCEO() {
  return currentUser && currentUser.role === "ceo";
}

function saveData() {
  localStorage.setItem("dramagic_students", JSON.stringify(students));
  localStorage.setItem("dramagic_expenses", JSON.stringify(expenses));
}

function setTodayDate() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  document.getElementById("studentDate").value = local;
  document.getElementById("expenseDate").value = local;
}

function totals() {
  const revenue = students.reduce(function (sum, student) {
    return sum + Number(student.paid || 0);
  }, 0);

  const fees = students.reduce(function (sum, student) {
    return sum + Number(student.fee || 0);
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
    return `${student.name} ${student.course} ${student.notes}`.toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    studentsList.innerHTML = `<div class="empty-message">No students added yet.</div>`;
    return;
  }

  studentsList.innerHTML = filtered.map(function (student) {
    const remaining = Math.max(Number(student.fee) - Number(student.paid), 0);

    const remainingHTML = remaining <= 0
      ? `<span class="paid">Paid</span>`
      : `<span class="due">${money.format(remaining)}</span>`;

    return `
      <article class="record-card">
        <div class="record-row">
          <span class="record-label">Name</span>
          <span class="record-value"><strong>${clean(student.name)}</strong></span>
        </div>

        <div class="record-row">
          <span class="record-label">Course</span>
          <span class="record-value">${clean(student.course || "-")}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Fee</span>
          <span class="record-value">${money.format(student.fee)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Paid</span>
          <span class="record-value">${money.format(student.paid)}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Remaining</span>
          <span class="record-value">${remainingHTML}</span>
        </div>

        <div class="record-row">
          <span class="record-label">Date</span>
          <span class="record-value">${formatDate(student.date)}</span>
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
    return `${expense.title} ${expense.category} ${expense.notes}`.toLowerCase().includes(search);
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
          <span class="record-value">${formatDate(expense.date)}</span>
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

function deleteStudent(id) {
  if (!isCEO()) return;

  const sure = confirm("Delete this student record?");
  if (!sure) return;

  students = students.filter(function (student) {
    return student.id !== id;
  });

  saveData();
  renderAll();
}

function deleteExpense(id) {
  if (!isCEO()) return;

  const sure = confirm("Delete this expense record?");
  if (!sure) return;

  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  saveData();
  renderAll();
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

function renderAll() {
  renderSummary();
  renderStudents();
  renderExpenses();
}

showApp();
