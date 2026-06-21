/* =====================================================
   DRAMAGIC PAYMENT ENTRY
   Restricted demo page for finance data-entry role.
   It uses the same student-payment storage as finance.js,
   but it never renders totals, expenses, profit, shares, reports,
   student count, reset, or full export controls.
===================================================== */

const ENTRY_STORAGE_KEYS = {
  students: "dramagic_demo_finance_students",
  receiptCounter: "dramagic_finance_receipt_counter"
};

const ENTRY_SESSION_KEY = "dramagic_demo_session";
const ENTRY_UNLOCK_KEY = "dramagic_finance_entry_unlocked";
// Temporary demo password: entry123
// Change the password by replacing this SHA-256 hash with a new one.
const ENTRY_PASSWORD_HASH = "e4b0f600a0aff32b06f7d0bffb5786e879af11d5cf40d1e146e4d37c8a863521";
const ENTRY_ALLOWED_ROLES = ["finance", "ceo"];

let entryStudents = [];
let entryInstallmentStudentId = null;
let entryAppStarted = false;

const entryAccessDenied = document.getElementById("entryAccessDenied");
const entryDeniedText = document.getElementById("entryDeniedText");
const entryApp = document.getElementById("entryApp");
const entryPasswordLock = document.getElementById("entryPasswordLock");
const entryPasswordForm = document.getElementById("entryPasswordForm");
const entryPassword = document.getElementById("entryPassword");
const entryPasswordMessage = document.getElementById("entryPasswordMessage");
const lockEntryPageBtn = document.getElementById("lockEntryPageBtn");

const entryStudentForm = document.getElementById("entryStudentForm");
const entryStudentName = document.getElementById("entryStudentName");
const entryParentName = document.getElementById("entryParentName");
const entryStudentCourse = document.getElementById("entryStudentCourse");
const entryStudentFee = document.getElementById("entryStudentFee");
const entryStudentPaid = document.getElementById("entryStudentPaid");
const entryStudentDate = document.getElementById("entryStudentDate");
const entryStudentPaymentMethod = document.getElementById("entryStudentPaymentMethod");
const entryStudentPaymentFor = document.getElementById("entryStudentPaymentFor");
const entryStudentNotes = document.getElementById("entryStudentNotes");
const entrySubmitBtn = document.getElementById("entrySubmitBtn");
const entryFormTitle = document.getElementById("entryFormTitle");
const entryModeNote = document.getElementById("entryModeNote");
const cancelInstallmentBtn = document.getElementById("cancelInstallmentBtn");

const entryStudentSearch = document.getElementById("entryStudentSearch");
const entryDueOnly = document.getElementById("entryDueOnly");
const entryStudentsList = document.getElementById("entryStudentsList");
const entryPrintReceiptBtn = document.getElementById("entryPrintReceiptBtn");

const entryMoney = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0
});

initEntryPage();

function initEntryPage() {
  bindEntryPasswordEvents();

  const session = getEntrySession();

  if (!canUseEntryPage(session)) {
    showEntryAccessDenied(session);
    return;
  }

  if (sessionStorage.getItem(ENTRY_UNLOCK_KEY) === "yes") {
    unlockEntryPage();
  } else {
    showEntryPasswordLock();
  }
}

function getEntrySession() {
  try {
    const session = JSON.parse(localStorage.getItem(ENTRY_SESSION_KEY));
    return session && typeof session === "object" ? session : {};
  } catch {
    return {};
  }
}

function canUseEntryPage(session) {
  const role = String(session.role || "").toLowerCase();
  const status = String(session.account_status || "active").toLowerCase();
  return ENTRY_ALLOWED_ROLES.includes(role) && status === "active";
}

function showEntryAccessDenied(session) {
  if (entryApp) entryApp.classList.add("hidden");
  if (entryPasswordLock) entryPasswordLock.classList.add("hidden");
  if (entryAccessDenied) entryAccessDenied.classList.remove("hidden");

  const role = String(session.role || "guest").toLowerCase();

  if (entryDeniedText) {
    entryDeniedText.textContent = role === "ceo"
      ? "حسابك يمكنه فتح هذه الصفحة، لكن حدثت مشكلة في قراءة الجلسة. سجّل الدخول مرة أخرى."
      : "هذه الصفحة لا تعرض إلا إدخال الدفعات والمتبقيات، ولا تفتح إلا لحساب Payment Entry أو حساب CEO.";
  }
}

function showEntryPasswordLock() {
  if (entryAccessDenied) entryAccessDenied.classList.add("hidden");
  if (entryApp) entryApp.classList.add("hidden");
  if (entryPasswordLock) entryPasswordLock.classList.remove("hidden");
  if (entryPassword) entryPassword.focus();
}

function showEntryApp() {
  if (entryAccessDenied) entryAccessDenied.classList.add("hidden");
  if (entryPasswordLock) entryPasswordLock.classList.add("hidden");
  if (entryApp) entryApp.classList.remove("hidden");
}

function bindEntryPasswordEvents() {
  if (entryPasswordForm) entryPasswordForm.addEventListener("submit", handleEntryPasswordSubmit);
  if (lockEntryPageBtn) lockEntryPageBtn.addEventListener("click", lockEntryPage);
}

async function handleEntryPasswordSubmit(event) {
  event.preventDefault();

  const password = entryPassword ? entryPassword.value.trim() : "";

  if (!password) {
    showEntryPasswordMessage("اكتب كلمة المرور أولاً.");
    return;
  }

  try {
    const hash = await entrySha256(password);

    if (hash === ENTRY_PASSWORD_HASH) {
      sessionStorage.setItem(ENTRY_UNLOCK_KEY, "yes");
      if (entryPassword) entryPassword.value = "";
      showEntryPasswordMessage("");
      unlockEntryPage();
      return;
    }

    showEntryPasswordMessage("كلمة المرور غير صحيحة.");
  } catch (error) {
    showEntryPasswordMessage("افتح الصفحة من موقع أو Live Server حتى تعمل حماية كلمة المرور.");
  }
}

function showEntryPasswordMessage(message) {
  if (entryPasswordMessage) entryPasswordMessage.textContent = message;
}

async function entrySha256(value) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto is not available.");
  }

  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function unlockEntryPage() {
  showEntryApp();
  startEntryAppOnce();
}

function lockEntryPage() {
  sessionStorage.removeItem(ENTRY_UNLOCK_KEY);
  showEntryPasswordLock();
}

function startEntryAppOnce() {
  if (entryAppStarted) {
    renderEntryStudents();
    return;
  }

  entryAppStarted = true;
  bindEntryEvents();
  seedDemoStudentsIfEmpty();
  loadEntryStudents();
  setEntryToday();
  resetEntryReceipt();
  renderEntryStudents();
}

function bindEntryEvents() {
  if (entryStudentForm) entryStudentForm.addEventListener("submit", handleEntryStudentPayment);
  if (entryStudentSearch) entryStudentSearch.addEventListener("input", renderEntryStudents);
  if (entryDueOnly) entryDueOnly.addEventListener("change", renderEntryStudents);
  if (cancelInstallmentBtn) cancelInstallmentBtn.addEventListener("click", resetEntryFormMode);
  if (entryPrintReceiptBtn) entryPrintReceiptBtn.addEventListener("click", printEntryReceipt);
}

function seedDemoStudentsIfEmpty() {
  if (localStorage.getItem(ENTRY_STORAGE_KEYS.students)) return;

  const now = new Date().toISOString();
  const demoStudents = [
    {
      id: entryMakeId(),
      student_name: "جنا أحمد",
      parent_name: "أحمد محمد",
      course_group: "كورس الصيف",
      total_fee: 3000,
      paid_amount: 1500,
      payment_at: now,
      payment_method: "كاش",
      payment_for: "دفعة أولى من اشتراك الكورس",
      notes: "تم الدفع كاش والمتبقي الأسبوع القادم.",
      payments: [
        {
          id: entryMakeId(),
          amount: 1500,
          payment_at: now,
          payment_method: "كاش",
          payment_for: "دفعة أولى من اشتراك الكورس",
          notes: "تم الدفع كاش والمتبقي الأسبوع القادم.",
          created_at: now
        }
      ],
      created_at: now
    },
    {
      id: entryMakeId(),
      student_name: "يوسف علي",
      parent_name: "علي حسن",
      course_group: "مجموعة Presentacy A",
      total_fee: 3000,
      paid_amount: 3000,
      payment_at: now,
      payment_method: "إنستاباي",
      payment_for: "اشتراك الكورس كامل",
      notes: "تم السداد بالكامل.",
      payments: [
        {
          id: entryMakeId(),
          amount: 3000,
          payment_at: now,
          payment_method: "إنستاباي",
          payment_for: "اشتراك الكورس كامل",
          notes: "تم السداد بالكامل.",
          created_at: now
        }
      ],
      created_at: now
    }
  ];

  localStorage.setItem(ENTRY_STORAGE_KEYS.students, JSON.stringify(demoStudents));
}

function loadEntryStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(ENTRY_STORAGE_KEYS.students));
    entryStudents = normalizeEntryStudents(Array.isArray(saved) ? saved : []);
  } catch {
    entryStudents = [];
  }

  saveEntryStudents();
}

function normalizeEntryStudents(list) {
  return list.map((student) => {
    const paid = Number(student.paid_amount || 0);
    const payments = Array.isArray(student.payments) && student.payments.length
      ? student.payments
      : paid > 0
        ? [
            {
              id: entryMakeId(),
              amount: paid,
              payment_at: student.payment_at || student.created_at || new Date().toISOString(),
              payment_method: student.payment_method || "كاش",
              payment_for: student.payment_for || "قسط من اشتراك الكورس",
              notes: student.notes || "",
              created_at: student.created_at || new Date().toISOString()
            }
          ]
        : [];

    const paidTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      ...student,
      total_fee: Number(student.total_fee || 0),
      paid_amount: paidTotal,
      payments
    };
  });
}

function saveEntryStudents() {
  localStorage.setItem(ENTRY_STORAGE_KEYS.students, JSON.stringify(entryStudents));
}

function handleEntryStudentPayment(event) {
  event.preventDefault();

  const paidAmount = Number(getEntryValue("entryStudentPaid"));
  const totalFee = Number(getEntryValue("entryStudentFee"));

  if (!paidAmount || paidAmount <= 0) {
    alert("اكتب قيمة الدفعة أولاً.");
    return;
  }

  if (!totalFee || totalFee <= 0) {
    alert("اكتب إجمالي مصروفات الطالب أولاً.");
    return;
  }

  const payment = {
    id: entryMakeId(),
    amount: paidAmount,
    payment_at: getEntryValue("entryStudentDate") || new Date().toISOString(),
    payment_method: getEntryValue("entryStudentPaymentMethod") || "كاش",
    payment_for: getEntryValue("entryStudentPaymentFor") || "قسط من اشتراك الكورس",
    notes: getEntryValue("entryStudentNotes"),
    created_at: new Date().toISOString()
  };

  if (entryInstallmentStudentId) {
    const student = entryStudents.find((item) => item.id === entryInstallmentStudentId);

    if (!student) {
      alert("لم يتم العثور على الطالب.");
      resetEntryFormMode();
      return;
    }

    student.student_name = getEntryValue("entryStudentName") || student.student_name;
    student.parent_name = getEntryValue("entryParentName") || student.parent_name || "";
    student.course_group = getEntryValue("entryStudentCourse") || student.course_group || "";
    student.total_fee = totalFee || Number(student.total_fee || 0);
    student.payments = Array.isArray(student.payments) ? student.payments : [];
    student.payments.push(payment);
    student.paid_amount = sumEntryPayments(student);
    student.payment_at = payment.payment_at;
    student.payment_method = payment.payment_method;
    student.payment_for = payment.payment_for;
    student.notes = payment.notes || student.notes || "";

    saveEntryStudents();
    renderEntryStudents();
    buildEntryReceipt(student, payment);
    resetEntryFormMode();
    return;
  }

  const newStudent = {
    id: entryMakeId(),
    student_name: getEntryValue("entryStudentName"),
    parent_name: getEntryValue("entryParentName"),
    course_group: getEntryValue("entryStudentCourse"),
    total_fee: totalFee,
    paid_amount: paidAmount,
    payment_at: payment.payment_at,
    payment_method: payment.payment_method,
    payment_for: payment.payment_for,
    notes: payment.notes,
    payments: [payment],
    created_at: new Date().toISOString()
  };

  entryStudents.unshift(newStudent);
  saveEntryStudents();
  renderEntryStudents();
  buildEntryReceipt(newStudent, payment);
  resetEntryFormMode();
}

function startEntryInstallmentPayment(id) {
  const student = entryStudents.find((item) => item.id === id);
  if (!student) return;

  entryInstallmentStudentId = id;

  setEntryValue("entryStudentName", student.student_name || "");
  setEntryValue("entryParentName", student.parent_name || "");
  setEntryValue("entryStudentCourse", student.course_group || "");
  setEntryValue("entryStudentFee", student.total_fee || 0);
  setEntryValue("entryStudentPaid", "");
  setEntryValue("entryStudentPaymentFor", "قسط جديد من اشتراك الكورس");
  setEntryValue("entryStudentNotes", "");
  setEntryToday();

  if (entryFormTitle) entryFormTitle.textContent = `إضافة قسط جديد: ${student.student_name || "طالب"}`;
  if (entryModeNote) entryModeNote.textContent = "سيتم إضافة هذه الدفعة إلى نفس سجل الطالب بدون إنشاء طالب جديد.";
  if (entrySubmitBtn) entrySubmitBtn.textContent = "حفظ القسط الجديد";
  if (cancelInstallmentBtn) cancelInstallmentBtn.classList.remove("hidden");

  const paidInput = document.getElementById("entryStudentPaid");
  if (paidInput) paidInput.focus();
  if (entryStudentForm) entryStudentForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetEntryFormMode() {
  entryInstallmentStudentId = null;

  if (entryStudentForm) entryStudentForm.reset();
  setEntryToday();

  if (entryFormTitle) entryFormTitle.textContent = "إضافة دفعة طالب";
  if (entryModeNote) entryModeNote.textContent = "أدخل بيانات الطالب والدفعة. إذا كان الطالب موجودًا، اضغط “إضافة قسط” من القائمة.";
  if (entrySubmitBtn) entrySubmitBtn.textContent = "حفظ الدفعة";
  if (cancelInstallmentBtn) cancelInstallmentBtn.classList.add("hidden");
}

function renderEntryStudents() {
  if (!entryStudentsList) return;

  const search = entryStudentSearch ? entryStudentSearch.value.trim().toLowerCase() : "";
  const dueOnly = entryDueOnly ? entryDueOnly.checked : true;

  const filtered = entryStudents
    .map((student) => ({ ...student, paidTotal: sumEntryPayments(student), remaining: getEntryRemaining(student) }))
    .filter((student) => {
      const haystack = `${student.student_name || ""} ${student.parent_name || ""} ${student.course_group || ""} ${student.notes || ""}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesDue = !dueOnly || student.remaining > 0;
      return matchesSearch && matchesDue;
    });

  if (!filtered.length) {
    entryStudentsList.innerHTML = `<div class="empty-message">لا توجد نتائج مطابقة الآن.</div>`;
    return;
  }

  entryStudentsList.innerHTML = filtered.map((student) => {
    const lastPayment = Array.isArray(student.payments) && student.payments.length
      ? student.payments[student.payments.length - 1]
      : null;

    const status = student.remaining > 0
      ? `<span class="entry-status-pill due">متبقي: ${entryMoney.format(student.remaining)}</span>`
      : `<span class="entry-status-pill paid">مدفوع بالكامل</span>`;

    return `
      <article class="record-card">
        <div class="record-title-row">
          <div>
            <h3>${entryClean(student.student_name || "-")}</h3>
            <p>${entryClean(student.course_group || "بدون مجموعة")}</p>
          </div>
          <div class="entry-actions">
            ${status}
            <button class="small-btn installment-btn" type="button" onclick="startEntryInstallmentPayment('${student.id}')">إضافة قسط</button>
            <button class="small-btn print-btn" type="button" onclick="buildEntryReceiptFromLastPayment('${student.id}')">إيصال آخر دفعة</button>
          </div>
        </div>

        <div class="record-grid">
          <div><span>ولي الأمر</span><strong>${entryClean(student.parent_name || "-")}</strong></div>
          <div><span>إجمالي مصروفات الطالب</span><strong>${entryMoney.format(student.total_fee || 0)}</strong></div>
          <div><span>آخر دفعة</span><strong>${entryMoney.format(lastPayment ? Number(lastPayment.amount || 0) : 0)}</strong></div>
          <div><span>آخر تاريخ دفع</span><strong>${entryFormatDate(lastPayment ? lastPayment.payment_at : student.payment_at)}</strong></div>
          <div><span>طريقة الدفع</span><strong>${entryClean(lastPayment ? lastPayment.payment_method : student.payment_method || "-")}</strong></div>
          <div><span>البيان</span><strong>${entryClean(lastPayment ? lastPayment.payment_for : student.payment_for || "-")}</strong></div>
          <div><span>ملاحظات</span><strong>${entryClean(lastPayment ? lastPayment.notes : student.notes || "-")}</strong></div>
        </div>
      </article>
    `;
  }).join("");
}

function sumEntryPayments(student) {
  if (Array.isArray(student.payments)) {
    return student.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  return Number(student.paid_amount || 0);
}

function getEntryRemaining(student) {
  return Math.max(Number(student.total_fee || 0) - sumEntryPayments(student), 0);
}

function buildEntryReceiptFromLastPayment(id) {
  const student = entryStudents.find((item) => item.id === id);
  if (!student) return;

  const payment = Array.isArray(student.payments) && student.payments.length
    ? student.payments[student.payments.length - 1]
    : {
        id: entryMakeId(),
        amount: student.paid_amount || 0,
        payment_at: student.payment_at,
        payment_method: student.payment_method,
        payment_for: student.payment_for,
        notes: student.notes
      };

  buildEntryReceipt(student, payment);
  document.getElementById("entryReceiptPaper")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function buildEntryReceipt(student, payment) {
  const number = nextEntryReceiptNumber();
  const amount = Number(payment.amount || 0);
  const payer = student.parent_name || student.student_name || "-";
  const reason = payment.payment_for || "قسط من اشتراك كورس Dramagic";

  setEntryText("entryPaperNumber", number);
  setEntryText("entryPaperDate", entryFormatDate(payment.payment_at || new Date().toISOString()));
  setEntryText("entryPaperPerson", payer);
  setEntryText("entryPaperStudent", student.student_name || "-");
  setEntryText("entryPaperGroup", student.course_group || "-");
  setEntryText("entryPaperAmount", entryMoney.format(amount));
  setEntryText("entryPaperMethod", payment.payment_method || "كاش");
  setEntryText("entryPaperReason", reason);
  setEntryText("entryPaperNotes", payment.notes || "-");
  setEntryText("entryPaperMainText", `استلمت أكاديمية Dramagic من السيد/السيدة ${payer} مبلغًا وقدره ${entryMoney.format(amount)}، وذلك عن: ${reason}.`);

  increaseEntryReceiptCounter();
}

function resetEntryReceipt() {
  setEntryText("entryPaperNumber", "---");
  setEntryText("entryPaperDate", "---");
  setEntryText("entryPaperPerson", "---");
  setEntryText("entryPaperStudent", "---");
  setEntryText("entryPaperGroup", "---");
  setEntryText("entryPaperAmount", "---");
  setEntryText("entryPaperMethod", "---");
  setEntryText("entryPaperReason", "---");
  setEntryText("entryPaperNotes", "---");
  setEntryText("entryPaperMainText", "سيظهر الإيصال هنا بعد حفظ دفعة طالب.");
}

function printEntryReceipt() {
  document.body.classList.add("printing-entry-receipt");
  window.print();
  setTimeout(() => document.body.classList.remove("printing-entry-receipt"), 500);
}

function setEntryToday() {
  if (entryStudentDate) entryStudentDate.value = toEntryDatetimeLocal(new Date().toISOString());
}

function nextEntryReceiptNumber() {
  const current = Number(localStorage.getItem(ENTRY_STORAGE_KEYS.receiptCounter) || 1);
  return `REC-${String(current).padStart(4, "0")}`;
}

function increaseEntryReceiptCounter() {
  const current = Number(localStorage.getItem(ENTRY_STORAGE_KEYS.receiptCounter) || 1);
  localStorage.setItem(ENTRY_STORAGE_KEYS.receiptCounter, String(current + 1));
}

function getEntryValue(id) {
  const input = document.getElementById(id);
  return input ? input.value.trim() : "";
}

function setEntryValue(id, value) {
  const input = document.getElementById(id);
  if (input) input.value = value;
}

function setEntryText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function toEntryDatetimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function entryFormatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function entryClean(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function entryMakeId() {
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

window.startEntryInstallmentPayment = startEntryInstallmentPayment;
window.buildEntryReceiptFromLastPayment = buildEntryReceiptFromLastPayment;
