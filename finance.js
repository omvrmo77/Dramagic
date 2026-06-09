/* =====================================================
   DRAMAGIC FINANCE - ARABIC SEPARATE TAB
   Frontend demo storage only. Real security later needs Supabase/backend.
===================================================== */

const FINANCE_PASSWORD_HASH = "9757950df41be4bbb3e1d9b4d2450b8a67f25e62c08199da36e9edc77ece1a14";
const FINANCE_UNLOCK_KEY = "dramagic_finance_unlocked";

const STORAGE_KEYS = {
  students: "dramagic_demo_finance_students",
  expenses: "dramagic_demo_finance_expenses",
  receiptCounter: "dramagic_finance_receipt_counter"
};

let students = [];
let installmentStudentId = null;
let expenses = [];

const financeLock = document.getElementById("financeLock");
const financeApp = document.getElementById("financeApp");
const passwordForm = document.getElementById("passwordForm");
const financePassword = document.getElementById("financePassword");
const passwordMessage = document.getElementById("passwordMessage");
const lockFinanceBtn = document.getElementById("lockFinanceBtn");

const studentForm = document.getElementById("studentForm");
const expenseForm = document.getElementById("expenseForm");
const receiptForm = document.getElementById("receiptForm");
const reportSettingsForm = document.getElementById("reportSettingsForm");
const resetBtn = document.getElementById("resetBtn");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const printReportBtn = document.getElementById("printReportBtn");
const downloadReceiptPdfBtn = document.getElementById("downloadReceiptPdfBtn");
const downloadReportPdfBtn = document.getElementById("downloadReportPdfBtn");
const updateReportBtn = document.getElementById("updateReportBtn");

const studentSearch = document.getElementById("studentSearch");
const expenseSearch = document.getElementById("expenseSearch");
const studentsList = document.getElementById("studentsList");
const expensesList = document.getElementById("expensesList");

const money = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0
});

init();

function init() {
  if (passwordForm) passwordForm.addEventListener("submit", handlePasswordSubmit);
  if (lockFinanceBtn) lockFinanceBtn.addEventListener("click", lockFinance);

  if (studentForm) studentForm.addEventListener("submit", handleAddStudentPayment);
  if (expenseForm) expenseForm.addEventListener("submit", handleAddExpense);
  if (receiptForm) receiptForm.addEventListener("submit", handleReceiptPreview);
  if (reportSettingsForm) reportSettingsForm.addEventListener("input", renderClosingReport);
  setupSharePercentSync();
  setupFinanceTabs();
  if (printReceiptBtn) printReceiptBtn.addEventListener("click", printReceipt);
  if (printReportBtn) printReportBtn.addEventListener("click", printClosingReport);
  if (downloadReceiptPdfBtn) downloadReceiptPdfBtn.addEventListener("click", downloadReceiptPdf);
  if (downloadReportPdfBtn) downloadReportPdfBtn.addEventListener("click", downloadClosingReportPdf);
  if (updateReportBtn) updateReportBtn.addEventListener("click", renderClosingReport);
  if (resetBtn) resetBtn.addEventListener("click", handleResetFinance);

  if (studentSearch) studentSearch.addEventListener("input", renderStudents);
  if (expenseSearch) expenseSearch.addEventListener("input", renderExpenses);

  setTodayDates();
  setReportDefaultDates();
  setNextReceiptNumber();

  if (sessionStorage.getItem(FINANCE_UNLOCK_KEY) === "yes") {
    unlockFinance();
  } else {
    showLock();
  }
}

async function handlePasswordSubmit(event) {
  event.preventDefault();

  const password = financePassword.value.trim();

  if (!password) {
    showPasswordMessage("اكتب كلمة المرور أولاً.");
    return;
  }

  try {
    const hash = await sha256(password);

    if (hash === FINANCE_PASSWORD_HASH) {
      sessionStorage.setItem(FINANCE_UNLOCK_KEY, "yes");
      financePassword.value = "";
      unlockFinance();
      return;
    }

    showPasswordMessage("كلمة المرور غير صحيحة.");
  } catch (error) {
    showPasswordMessage("افتح الصفحة من موقع أو Live Server حتى تعمل حماية كلمة المرور.");
  }
}

async function sha256(value) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto is not available.");
  }

  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function showPasswordMessage(message) {
  if (passwordMessage) passwordMessage.textContent = message;
}

function unlockFinance() {
  if (financeLock) financeLock.classList.add("hidden");
  if (financeApp) financeApp.classList.remove("hidden");

  seedDemoFinanceData();
  loadFinanceData();
  renderAll();
}

function showLock() {
  if (financeLock) financeLock.classList.remove("hidden");
  if (financeApp) financeApp.classList.add("hidden");
}

function lockFinance() {
  sessionStorage.removeItem(FINANCE_UNLOCK_KEY);
  showLock();
}

function seedDemoFinanceData() {
  const hasStudents = localStorage.getItem(STORAGE_KEYS.students);
  const hasExpenses = localStorage.getItem(STORAGE_KEYS.expenses);

  if (!hasStudents) {
    const demoStudents = [
      {
        id: makeId(),
        student_name: "جنا أحمد",
        parent_name: "أحمد محمد",
        course_group: "كورس الصيف",
        total_fee: 3000,
        paid_amount: 1500,
        payment_at: new Date().toISOString(),
        payment_method: "كاش",
        payment_for: "دفعة أولى من اشتراك الكورس",
        notes: "تم الدفع كاش والمتبقي الأسبوع القادم.",
        created_at: new Date().toISOString()
      },
      {
        id: makeId(),
        student_name: "يوسف علي",
        parent_name: "علي حسن",
        course_group: "مجموعة Presentacy A",
        total_fee: 3000,
        paid_amount: 3000,
        payment_at: new Date().toISOString(),
        payment_method: "إنستاباي",
        payment_for: "اشتراك الكورس كامل",
        notes: "تم السداد بالكامل.",
        created_at: new Date().toISOString()
      }
    ];

    localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(demoStudents));
  }

  if (!hasExpenses) {
    const demoExpenses = [
      {
        id: makeId(),
        title: "إيجار المسرح",
        category: "المكان / المسرح",
        amount: 35000,
        paid_at: new Date().toISOString(),
        payment_method: "تحويل بنكي",
        notes: "دفعة تجريبية لإيجار المسرح.",
        created_at: new Date().toISOString()
      },
      {
        id: makeId(),
        title: "طباعة المواد",
        category: "طباعة",
        amount: 2500,
        paid_at: new Date().toISOString(),
        payment_method: "كاش",
        notes: "طباعة بوكليتات وورق تدريبات.",
        created_at: new Date().toISOString()
      }
    ];

    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(demoExpenses));
  }
}

function loadFinanceData() {
  students = normalizeStudentInstallments(readArray(STORAGE_KEYS.students));
  expenses = readArray(STORAGE_KEYS.expenses);
  saveFinanceData();
}

function normalizeStudentInstallments(list) {
  return list.map((student) => {
    const paid = Number(student.paid_amount || 0);

    return {
      ...student,
      total_fee: Number(student.total_fee || 0),
      paid_amount: paid,
      payments: Array.isArray(student.payments) && student.payments.length
        ? student.payments
        : paid > 0
          ? [
              {
                id: makeId(),
                amount: paid,
                payment_at: student.payment_at || student.created_at || new Date().toISOString(),
                payment_method: student.payment_method || "كاش",
                payment_for: student.payment_for || "دفعة من اشتراك الكورس",
                notes: student.notes || ""
              }
            ]
          : []
    };
  });
}

function saveFinanceData() {
  localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function handleAddStudentPayment(event) {
  event.preventDefault();

  const paidAmount = Number(getValue("studentPaid"));
  const totalFee = Number(getValue("studentFee"));

  if (!paidAmount || paidAmount <= 0) {
    alert("اكتب قيمة الدفعة أولاً.");
    return;
  }

  const payment = {
    id: makeId(),
    amount: paidAmount,
    payment_at: getValue("studentDate"),
    payment_method: getValue("studentPaymentMethod"),
    payment_for: getValue("studentPaymentFor") || "قسط من اشتراك الكورس",
    notes: getValue("studentNotes"),
    created_at: new Date().toISOString()
  };

  if (installmentStudentId) {
    const student = students.find((item) => item.id === installmentStudentId);

    if (!student) {
      alert("لم يتم العثور على الطالب.");
      installmentStudentId = null;
      return;
    }

    student.total_fee = totalFee || Number(student.total_fee || 0);
    student.payments = Array.isArray(student.payments) ? student.payments : [];
    student.payments.push(payment);
    student.paid_amount = student.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    student.payment_at = payment.payment_at;
    student.payment_method = payment.payment_method;
    student.payment_for = payment.payment_for;
    student.notes = payment.notes || student.notes || "";

    saveFinanceData();
    studentForm.reset();
    setTodayDates();
    installmentStudentId = null;
    resetStudentFormMode();
    renderAll();
    buildReceiptFromStudentPayment(student, payment);
    return;
  }

  const newRecord = {
    id: makeId(),
    student_name: getValue("studentName"),
    parent_name: getValue("parentName"),
    course_group: getValue("studentCourse"),
    total_fee: totalFee,
    paid_amount: paidAmount,
    payment_at: payment.payment_at,
    payment_method: payment.payment_method,
    payment_for: payment.payment_for,
    notes: payment.notes,
    payments: [payment],
    created_at: new Date().toISOString()
  };

  students.unshift(newRecord);
  saveFinanceData();
  studentForm.reset();
  setTodayDates();
  renderAll();
  buildReceiptFromStudentPayment(newRecord, payment);
}

function startInstallmentPayment(id) {
  const student = students.find((item) => item.id === id);

  if (!student) return;

  installmentStudentId = id;

  setInputValue("studentName", student.student_name || "");
  setInputValue("parentName", student.parent_name || "");
  setInputValue("studentCourse", student.course_group || "");
  setInputValue("studentFee", student.total_fee || 0);
  setInputValue("studentPaid", "");
  setInputValue("studentPaymentFor", "قسط جديد من اشتراك الكورس");
  setInputValue("studentNotes", "");

  const submitBtn = studentForm ? studentForm.querySelector("button[type='submit']") : null;
  if (submitBtn) submitBtn.textContent = "حفظ القسط الجديد";

  switchFinanceTab("payments");

  const paidInput = document.getElementById("studentPaid");
  if (paidInput) paidInput.focus();

  studentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetStudentFormMode() {
  const submitBtn = studentForm ? studentForm.querySelector("button[type='submit']") : null;
  if (submitBtn) submitBtn.textContent = "حفظ دفعة الطالب";
}

function buildReceiptFromStudentPayment(student, payment) {
  const receipt = {
    type: "receipt",
    number: getValue("receiptNumber") || nextReceiptNumber(),
    date: payment.payment_at || new Date().toISOString(),
    method: payment.payment_method || "كاش",
    person: student.parent_name || student.student_name,
    student: student.student_name,
    group: student.course_group || "-",
    amount: Number(payment.amount || 0),
    reason: payment.payment_for || "قسط من اشتراك كورس Dramagic",
    receiver: getValue("receiptReceiver") || "إدارة Dramagic",
    notes: payment.notes || "-"
  };

  fillReceiptForm(receipt);
  renderReceipt(receipt);
  switchFinanceTab("receipts", false);
}

function handleAddExpense(event) {
  event.preventDefault();

  const newRecord = {
    id: makeId(),
    title: getValue("expenseTitle"),
    category: getValue("expenseCategory"),
    amount: Number(getValue("expenseAmount")),
    paid_at: getValue("expenseDate"),
    payment_method: getValue("expensePaymentMethod"),
    notes: getValue("expenseNotes"),
    created_at: new Date().toISOString()
  };

  expenses.unshift(newRecord);
  saveFinanceData();
  expenseForm.reset();
  setTodayDates();
  renderAll();
  buildVoucherFromExpense(newRecord);
}

function handleResetFinance() {
  const sure = confirm("هل أنت متأكد من مسح كل بيانات المالية التجريبية؟");
  if (!sure) return;

  localStorage.removeItem(STORAGE_KEYS.students);
  localStorage.removeItem(STORAGE_KEYS.expenses);
  localStorage.removeItem(STORAGE_KEYS.receiptCounter);

  seedDemoFinanceData();
  loadFinanceData();
  setNextReceiptNumber();
  renderAll();
}

function deleteStudent(id) {
  const sure = confirm("حذف سجل دفعة الطالب؟");
  if (!sure) return;

  students = students.filter((student) => student.id !== id);
  saveFinanceData();
  renderAll();
}

function deleteExpense(id) {
  const sure = confirm("حذف سجل المصروف؟");
  if (!sure) return;

  expenses = expenses.filter((expense) => expense.id !== id);
  saveFinanceData();
  renderAll();
}

function totals() {
  const revenue = students.reduce((sum, student) => {
    const paid = Array.isArray(student.payments)
      ? student.payments.reduce((paymentSum, payment) => paymentSum + Number(payment.amount || 0), 0)
      : Number(student.paid_amount || 0);

    return sum + paid;
  }, 0);

  const fees = students.reduce((sum, student) => sum + Number(student.total_fee || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const remaining = Math.max(fees - revenue, 0);
  const profit = revenue - totalExpenses;
  const netProfit = Math.max(profit, 0);

  return {
    revenue,
    totalExpenses,
    remaining,
    profit,
    partnerShare: netProfit * 0.3,
    ourShare: netProfit * 0.7
  };
}

function renderAll() {
  renderSummary();
  renderStudents();
  renderExpenses();
  renderClosingReport();
}

function renderSummary() {
  const t = totals();

  setText("totalRevenue", money.format(t.revenue));
  setText("totalExpenses", money.format(t.totalExpenses));
  setText("totalRemaining", money.format(t.remaining));
  setText("totalProfit", money.format(t.profit));
  setText("partnerShare", money.format(t.partnerShare));
  setText("ourShare", money.format(t.ourShare));
}

function renderStudents() {
  if (!studentsList) return;

  const search = studentSearch ? studentSearch.value.trim().toLowerCase() : "";
  const filtered = students.filter((student) => `${student.student_name} ${student.parent_name || ""} ${student.course_group || ""} ${student.notes || ""}`.toLowerCase().includes(search));

  if (!filtered.length) {
    studentsList.innerHTML = `<div class="empty-message">لا توجد مدفوعات طلاب حتى الآن.</div>`;
    return;
  }

  studentsList.innerHTML = filtered.map((student) => {
    const paidTotal = Array.isArray(student.payments)
  ? student.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  : Number(student.paid_amount || 0);

student.paid_amount = paidTotal;

const remaining = Math.max(Number(student.total_fee || 0) - paidTotal, 0);
    const remainingHTML = remaining <= 0
      ? `<span class="paid">مدفوع بالكامل</span>`
      : `<span class="due">${money.format(remaining)}</span>`;

    return `
      <article class="record-card">
        <div class="record-title-row">
          <div>
            <h3>${clean(student.student_name)}</h3>
            <p>${clean(student.course_group || "بدون مجموعة")}</p>
          </div>
          <div class="record-actions">
            <button class="small-btn installment-btn" type="button" onclick="startInstallmentPayment('${student.id}')">إضافة قسط</button>
            <button class="small-btn print-btn" type="button" onclick="buildReceiptFromStudentById('${student.id}')">طباعة إيصال</button>
            <button class="small-btn delete-btn" type="button" onclick="deleteStudent('${student.id}')">حذف</button>
          </div>
        </div>

        <div class="record-grid">
          <div><span>ولي الأمر</span><strong>${clean(student.parent_name || "-")}</strong></div>
          <div><span>إجمالي المصروفات</span><strong>${money.format(student.total_fee || 0)}</strong></div>
          <div><span>المدفوع</span><strong>${money.format(paidTotal)}</strong></div>
          <div><span>عدد الأقساط</span><strong>${student.payments ? student.payments.length : 1}</strong></div>
          <div><span>المتبقي</span><strong>${remainingHTML}</strong></div>
          <div><span>طريقة الدفع</span><strong>${clean(student.payment_method || "-")}</strong></div>
          <div><span>التاريخ</span><strong>${formatDate(student.payment_at)}</strong></div>
          <div><span>البيان</span><strong>${clean(student.payment_for || "-")}</strong></div>
          <div><span>ملاحظات</span><strong>${clean(student.notes || "-")}</strong></div>
        </div>
      </article>
    `;
  }).join("");
}

function renderExpenses() {
  if (!expensesList) return;

  const search = expenseSearch ? expenseSearch.value.trim().toLowerCase() : "";
  const filtered = expenses.filter((expense) => `${expense.title} ${expense.category} ${expense.notes || ""}`.toLowerCase().includes(search));

  if (!filtered.length) {
    expensesList.innerHTML = `<div class="empty-message">لا توجد مصروفات حتى الآن.</div>`;
    return;
  }

  expensesList.innerHTML = filtered.map((expense) => {
    return `
      <article class="record-card">
        <div class="record-title-row">
          <div>
            <h3>${clean(expense.title)}</h3>
            <p>${clean(expense.category || "بدون تصنيف")}</p>
          </div>
          <div class="record-actions">
            <button class="small-btn print-btn" type="button" onclick="buildVoucherFromExpenseById('${expense.id}')">طباعة سند</button>
            <button class="small-btn delete-btn" type="button" onclick="deleteExpense('${expense.id}')">حذف</button>
          </div>
        </div>

        <div class="record-grid">
          <div><span>المبلغ</span><strong>${money.format(expense.amount || 0)}</strong></div>
          <div><span>طريقة الدفع</span><strong>${clean(expense.payment_method || "-")}</strong></div>
          <div><span>التاريخ</span><strong>${formatDate(expense.paid_at)}</strong></div>
          <div><span>التفاصيل</span><strong>${clean(expense.notes || "-")}</strong></div>
        </div>
      </article>
    `;
  }).join("");
}

function handleReceiptPreview(event) {
  event.preventDefault();

  const receipt = {
    type: getValue("receiptType"),
    number: getValue("receiptNumber"),
    date: getValue("receiptDate"),
    method: getValue("receiptMethod"),
    person: getValue("receiptPerson"),
    student: getValue("receiptStudent"),
    group: getValue("receiptGroup"),
    amount: Number(getValue("receiptAmount")),
    reason: getValue("receiptReason"),
    receiver: getValue("receiptReceiver"),
    notes: getValue("receiptNotes")
  };

  renderReceipt(receipt);
  increaseReceiptCounter();
  setNextReceiptNumber();
}

function buildReceiptFromStudentById(id) {
  const student = students.find((item) => item.id === id);
  if (student) buildReceiptFromStudent(student);
}

function buildVoucherFromExpenseById(id) {
  const expense = expenses.find((item) => item.id === id);
  if (expense) buildVoucherFromExpense(expense);
}

function buildReceiptFromStudent(student) {
  const receipt = {
    type: "receipt",
    number: getValue("receiptNumber") || nextReceiptNumber(),
    date: student.payment_at || new Date().toISOString(),
    method: student.payment_method || "كاش",
    person: student.parent_name || student.student_name,
    student: student.student_name,
    group: student.course_group || "-",
    amount: Number(student.paid_amount || 0),
    reason: student.payment_for || "دفعة من اشتراك كورس Dramagic",
    receiver: getValue("receiptReceiver") || "إدارة Dramagic",
    notes: student.notes || "-"
  };

  fillReceiptForm(receipt);
  renderReceipt(receipt);
  switchFinanceTab("receipts", false);
}

function buildVoucherFromExpense(expense) {
  const receipt = {
    type: "voucher",
    number: getValue("receiptNumber") || nextReceiptNumber(),
    date: expense.paid_at || new Date().toISOString(),
    method: expense.payment_method || "كاش",
    person: expense.title,
    student: expense.title,
    group: expense.category || "-",
    amount: Number(expense.amount || 0),
    reason: expense.notes || `مصروف خاص ببند ${expense.title}`,
    receiver: getValue("receiptReceiver") || "إدارة Dramagic",
    notes: expense.notes || "-"
  };

  fillReceiptForm(receipt);
  renderReceipt(receipt);
  switchFinanceTab("receipts", false);
}

function fillReceiptForm(receipt) {
  setInputValue("receiptType", receipt.type);
  setInputValue("receiptNumber", receipt.number);
  setInputValue("receiptDate", toDatetimeLocal(receipt.date));
  setInputValue("receiptMethod", receipt.method);
  setInputValue("receiptPerson", receipt.person);
  setInputValue("receiptStudent", receipt.student);
  setInputValue("receiptGroup", receipt.group);
  setInputValue("receiptAmount", receipt.amount);
  setInputValue("receiptReason", receipt.reason);
  setInputValue("receiptReceiver", receipt.receiver);
  setInputValue("receiptNotes", receipt.notes);
}

function renderReceipt(receipt) {
  const isVoucher = receipt.type === "voucher";
  const title = isVoucher ? "سند صرف" : "إيصال قبض";

  setText("paperTitle", title);
  setText("paperNumber", receipt.number || "---");
  setText("paperDate", formatDate(receipt.date));
  setText("paperPerson", receipt.person || "---");
  setText("paperStudent", receipt.student || "---");
  setText("paperGroup", receipt.group || "---");
  setText("paperAmount", money.format(receipt.amount || 0));
  setText("paperMethod", receipt.method || "---");
  setText("paperReason", receipt.reason || "---");
  setText("paperNotes", receipt.notes || "---");
  setText("paperReceiver", receipt.receiver || "---");

  const text = isVoucher
    ? `تم صرف مبلغ وقدره ${money.format(receipt.amount || 0)} إلى / ${receipt.person || "---"}، وذلك عن: ${receipt.reason || "---"}.`
    : `استلمت أكاديمية Dramagic من السيد/السيدة ${receipt.person || "---"} مبلغًا وقدره ${money.format(receipt.amount || 0)}، وذلك عن: ${receipt.reason || "---"}.`;

  setText("paperMainText", text);
}

function printReceipt() {
  printSection("printing-receipt");
}

function printClosingReport() {
  renderClosingReport();
  printSection("printing-report");
}

async function downloadReceiptPdf() {
  await downloadFinancePdf({
    elementId: "receiptPaper",
    fileName: `Dramagic-${getValue("receiptNumber") || "receipt"}.pdf`,
    orientation: "portrait",
    pdfClass: "pdf-receipt-portrait",
    margin: 8,
    beforeDownload: function () {
      const receipt = {
        type: getValue("receiptType"),
        number: getValue("receiptNumber"),
        date: getValue("receiptDate"),
        method: getValue("receiptMethod"),
        person: getValue("receiptPerson"),
        student: getValue("receiptStudent"),
        group: getValue("receiptGroup"),
        amount: Number(getValue("receiptAmount")),
        reason: getValue("receiptReason"),
        receiver: getValue("receiptReceiver"),
        notes: getValue("receiptNotes")
      };
      renderReceipt(receipt);
    },
    fallbackPrintClass: "printing-receipt"
  });
}

async function downloadClosingReportPdf() {
  renderClosingReport();
  const reportNumber = getValue("reportNumber") || "final-report";
  await downloadFinancePdf({
    elementId: "financialReportPaper",
    fileName: `Dramagic-Financial-Report-${reportNumber}.pdf`,
    orientation: "landscape",
    pdfClass: "pdf-report-landscape",
    margin: 6,
    fallbackPrintClass: "printing-report"
  });
}

async function downloadFinancePdf({ elementId, fileName, beforeDownload, fallbackPrintClass, orientation = "portrait", pdfClass = "", margin = 8 }) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (typeof beforeDownload === "function") beforeDownload();

  const safeFileName = sanitizeFileName(fileName || "Dramagic-finance.pdf");

  if (!window.html2pdf) {
    alert("تحميل PDF المباشر يحتاج اتصال بالإنترنت لتحميل مكتبة PDF المجانية. سيتم فتح الطباعة بدلًا من ذلك، ويمكنك اختيار Save as PDF من المتصفح.");
    printSection(fallbackPrintClass || "printing-report");
    return;
  }

  document.body.classList.add("downloading-pdf");
  if (pdfClass) document.body.classList.add(pdfClass);

  try {
    await html2pdf()
      .set({
        margin: margin,
        filename: safeFileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: Math.min(window.devicePixelRatio || 2, 2.5),
          useCORS: true,
          backgroundColor: "#ffffff",
          scrollY: 0
        },
        jsPDF: { unit: "mm", format: "a4", orientation: orientation },
        pagebreak: { mode: ["css", "legacy"] }
      })
      .from(element)
      .save();
  } catch (error) {
    console.error(error);
    alert("حدثت مشكلة أثناء تحميل PDF. سيتم فتح الطباعة بدلًا من ذلك.");
    printSection(fallbackPrintClass || "printing-report");
  } finally {
    document.body.classList.remove("downloading-pdf");
    if (pdfClass) document.body.classList.remove(pdfClass);
  }
}

function sanitizeFileName(value) {
  return String(value || "Dramagic-finance.pdf")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function printSection(className) {
  document.body.classList.remove("printing-receipt", "printing-report");
  document.body.classList.add(className);

  const orientation = className === "printing-report" ? "landscape" : "portrait";
  setDynamicPrintOrientation(orientation);

  const cleanPrintClass = function () {
    document.body.classList.remove(className);
    removeDynamicPrintOrientation();
    window.removeEventListener("afterprint", cleanPrintClass);
  };

  window.addEventListener("afterprint", cleanPrintClass);

  setTimeout(function () {
    window.print();
  }, 100);
}

function setDynamicPrintOrientation(orientation) {
  removeDynamicPrintOrientation();

  const style = document.createElement("style");
  style.id = "financePrintOrientationStyle";
  style.textContent = `@media print { @page { size: A4 ${orientation}; margin: ${orientation === "landscape" ? "7mm" : "8mm"}; } }`;
  document.head.appendChild(style);
}

function removeDynamicPrintOrientation() {
  const existing = document.getElementById("financePrintOrientationStyle");
  if (existing) existing.remove();
}


function setupSharePercentSync() {
  const partnerInput = document.getElementById("reportPartnerPercent");
  const ourInput = document.getElementById("reportOurPercent");

  if (!partnerInput || !ourInput) return;

  partnerInput.addEventListener("input", function () {
    const partnerValue = clampNumber(Number(partnerInput.value || 0), 0, 100);
    ourInput.value = Math.max(100 - partnerValue, 0);
    renderClosingReport();
  });

  ourInput.addEventListener("input", function () {
    renderClosingReport();
  });
}

function reportSettings() {
  const partnerPercent = clampNumber(Number(getValue("reportPartnerPercent") || 30), 0, 100);
  const ourPercentInput = getValue("reportOurPercent");
  const ourPercent = ourPercentInput === ""
    ? Math.max(100 - partnerPercent, 0)
    : clampNumber(Number(ourPercentInput), 0, 100);

  return {
    courseName: getValue("reportCourseName") || "Dramagic Course",
    reportNumber: getValue("reportNumber") || "FR-0001",
    fromDate: getValue("reportFromDate"),
    toDate: getValue("reportToDate"),
    mainTrainer: getValue("reportMainTrainer") || "---",
    assistantTrainer: getValue("reportAssistantTrainer") || "---",
    partnerName: getValue("reportPartnerName") || "الشريك",
    preparedBy: getValue("reportPreparedBy") || "إدارة Dramagic",
    partnerPercent,
    ourPercent,
    finalNotes: getValue("reportFinalNotes") || "تم إعداد هذا التقرير بناءً على سجلات المدفوعات والمصروفات المسجلة في لوحة مالية Dramagic."
  };
}

function renderClosingReport() {
  const settings = reportSettings();
  const t = totals();
  const positiveNet = Math.max(t.profit, 0);
  const partnerShare = positiveNet * (settings.partnerPercent / 100);
  const ourShare = positiveNet * (settings.ourPercent / 100);
  const uniqueStudents = countUniqueStudents(students);

  setText("paperReportNumber", settings.reportNumber);
  setText("paperReportCourse", settings.courseName);
  setText("paperReportPeriod", formatReportPeriod(settings.fromDate, settings.toDate));
  setText("paperReportDate", formatDate(new Date().toISOString()));
  setText("paperMainTrainer", settings.mainTrainer);
  setText("paperAssistantTrainer", settings.assistantTrainer);
  setText("reportStudentCount", arabicNumber(uniqueStudents));
  setText("reportPaymentCount", arabicNumber(students.length));
  setText("reportRevenueTotal", money.format(t.revenue));
  setText("reportExpenseTotal", money.format(t.totalExpenses));
  setText("reportRemainingTotal", money.format(t.remaining));
  setText("reportNetProfit", money.format(t.profit));
  setText("paperPartnerLabel", `نصيب ${settings.partnerName} (${arabicNumber(settings.partnerPercent)}٪)`);
  setText("reportPartnerShare", money.format(partnerShare));
  setText("reportOurShare", money.format(ourShare));
  setText("reportShareNote", `تم احتساب نصيب ${settings.partnerName} ونصيب Dramagic من صافي الربح بعد خصم كل المصروفات. إذا كان صافي الربح بالسالب، لا يتم احتساب أرباح للتقسيم.`);
  setText("paperFinalNotes", settings.finalNotes);
  setText("paperPreparedBy", settings.preparedBy);

  const studentsTable = document.getElementById("reportStudentsTable");
  const expensesTable = document.getElementById("reportExpensesTable");

  if (studentsTable) studentsTable.innerHTML = buildStudentsReportTable();
  if (expensesTable) expensesTable.innerHTML = buildExpensesReportTable();
}

function buildStudentsReportTable() {
  if (!students.length) {
    return `<div class="empty-message">لا توجد مدفوعات طلاب مسجلة في التقرير.</div>`;
  }

  const rows = students.map((student, index) => {
    const totalFee = Number(student.total_fee || 0);
    const paid = Number(student.paid_amount || 0);
    const remaining = Math.max(totalFee - paid, 0);

    return `
      <tr>
        <td>${arabicNumber(index + 1)}</td>
        <td>${clean(student.student_name || "-")}</td>
        <td>${clean(student.parent_name || "-")}</td>
        <td>${clean(student.course_group || "-")}</td>
        <td>${money.format(totalFee)}</td>
        <td>${money.format(paid)}</td>
        <td>${money.format(remaining)}</td>
        <td>${clean(student.payment_method || "-")}</td>
        <td>${formatDate(student.payment_at)}</td>
        <td>${clean(student.notes || student.payment_for || "-")}</td>
      </tr>
    `;
  }).join("");

  return `
    <table class="report-table">
      <thead>
        <tr>
          <th>#</th>
          <th>اسم الطالب</th>
          <th>ولي الأمر</th>
          <th>المجموعة</th>
          <th>إجمالي الرسوم</th>
          <th>المدفوع</th>
          <th>المتبقي</th>
          <th>طريقة الدفع</th>
          <th>التاريخ</th>
          <th>ملاحظات</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildExpensesReportTable() {
  if (!expenses.length) {
    return `<div class="empty-message">لا توجد مصروفات مسجلة في التقرير.</div>`;
  }

  const rows = expenses.map((expense, index) => {
    return `
      <tr>
        <td>${arabicNumber(index + 1)}</td>
        <td>${clean(expense.title || "-")}</td>
        <td>${clean(expense.category || "-")}</td>
        <td>${money.format(Number(expense.amount || 0))}</td>
        <td>${clean(expense.payment_method || "-")}</td>
        <td>${formatDate(expense.paid_at)}</td>
        <td>${clean(expense.notes || "-")}</td>
      </tr>
    `;
  }).join("");

  return `
    <table class="report-table">
      <thead>
        <tr>
          <th>#</th>
          <th>البند</th>
          <th>التصنيف</th>
          <th>المبلغ</th>
          <th>طريقة الدفع</th>
          <th>التاريخ</th>
          <th>تفاصيل المصروف</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}


function setupFinanceTabs() {
  const tabButtons = Array.from(document.querySelectorAll("[data-finance-tab]"));
  const jumpButtons = Array.from(document.querySelectorAll("[data-finance-tab-jump]"));

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchFinanceTab(button.dataset.financeTab));
  });

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => switchFinanceTab(button.dataset.financeTabJump));
  });

  const saved = localStorage.getItem("dramagic_finance_active_tab") || "overview";
  switchFinanceTab(saved, false);
}

function switchFinanceTab(tabName, save = true) {
  const target = tabName || "overview";
  const tabButtons = Array.from(document.querySelectorAll("[data-finance-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-finance-panel]"));

  if (!panels.length) return;

  const exists = panels.some((panel) => panel.dataset.financePanel === target);
  const activeTab = exists ? target : "overview";

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.financeTab === activeTab);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.financePanel === activeTab);
  });

  if (save) {
    localStorage.setItem("dramagic_finance_active_tab", activeTab);
    const tabs = document.querySelector(".finance-tabs");
    if (tabs) tabs.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function countUniqueStudents(list) {
  const names = new Set();

  list.forEach((student) => {
    const name = String(student.student_name || "").trim().toLowerCase();
    if (name) names.add(name);
  });

  return names.size;
}

function formatReportPeriod(fromDate, toDate) {
  if (fromDate && toDate) {
    return `من ${formatDateOnly(fromDate)} إلى ${formatDateOnly(toDate)}`;
  }

  if (fromDate) return `من ${formatDateOnly(fromDate)}`;
  if (toDate) return `حتى ${formatDateOnly(toDate)}`;

  return "كل الفترة المسجلة";
}

function setReportDefaultDates() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date();

  if (!getValue("reportFromDate")) {
    setInputValue("reportFromDate", toDateInput(firstDay));
  }

  if (!getValue("reportToDate")) {
    setInputValue("reportToDate", toDateInput(today));
  }
}

function toDateInput(value) {
  const date = value instanceof Date ? value : new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDateOnly(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function arabicNumber(value) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 1 }).format(value || 0);
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function setTodayDates() {
  const local = toDatetimeLocal(new Date().toISOString());
  ["studentDate", "expenseDate", "receiptDate"].forEach((id) => setInputValue(id, local));
}

function setNextReceiptNumber() {
  setInputValue("receiptNumber", nextReceiptNumber());
}

function nextReceiptNumber() {
  const count = Number(localStorage.getItem(STORAGE_KEYS.receiptCounter) || 1);
  return `DM-${String(count).padStart(5, "0")}`;
}

function increaseReceiptCounter() {
  const count = Number(localStorage.getItem(STORAGE_KEYS.receiptCounter) || 1);
  localStorage.setItem(STORAGE_KEYS.receiptCounter, String(count + 1));
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setInputValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value ?? "";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function toDatetimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function clean(value) {
  return String(value ?? "")
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

window.deleteStudent = deleteStudent;
window.deleteExpense = deleteExpense;
window.buildReceiptFromStudentById = buildReceiptFromStudentById;
window.buildVoucherFromExpenseById = buildVoucherFromExpenseById;
