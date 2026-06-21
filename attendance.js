/* =====================================================
   DRAMAGIC ATTENDANCE BY NAME
   - QR scanner removed.
   - Choose class, choose Dramagician, mark attendance by name.
   - Saves locally first using IndexedDB.
   - Sync button stays for teacher/CEO until Supabase is connected.
===================================================== */

const DEMO_STUDENTS = [
  { id: "stu-a-001", code: "DRG-A-001", full_name: "Laila Hassan", classLetter: "A" },
  { id: "stu-a-002", code: "DRG-A-002", full_name: "Youssef Ali", classLetter: "A" },
  { id: "stu-a-003", code: "DRG-A-003", full_name: "Youssef Karim", classLetter: "A" },
  { id: "stu-a-004", code: "DRG-A-004", full_name: "Malak Samir", classLetter: "A" },
  { id: "stu-a-005", code: "DRG-A-005", full_name: "Seif Tamer", classLetter: "A" },
  { id: "stu-a-006", code: "DRG-A-006", full_name: "Nour Ahmed", classLetter: "A" },

  { id: "stu-b-001", code: "DRG-B-001", full_name: "Mariam Ali", classLetter: "B" },
  { id: "stu-b-002", code: "DRG-B-002", full_name: "Omar Hassan", classLetter: "B" },
  { id: "stu-b-003", code: "DRG-B-003", full_name: "Hana Adel", classLetter: "B" },
  { id: "stu-b-004", code: "DRG-B-004", full_name: "Yassin Hany", classLetter: "B" },
  { id: "stu-b-005", code: "DRG-B-005", full_name: "Jana Emad", classLetter: "B" },
  { id: "stu-b-006", code: "DRG-B-006", full_name: "Ali Tarek", classLetter: "B" },

  { id: "stu-c-001", code: "DRG-C-001", full_name: "Nour Ahmed", classLetter: "C" },
  { id: "stu-c-002", code: "DRG-C-002", full_name: "Malak Samir", classLetter: "C" },
  { id: "stu-c-003", code: "DRG-C-003", full_name: "Kareem Omar", classLetter: "C" },
  { id: "stu-c-004", code: "DRG-C-004", full_name: "Farida Wael", classLetter: "C" },
  { id: "stu-c-005", code: "DRG-C-005", full_name: "Youssef Sameh", classLetter: "C" },
  { id: "stu-c-006", code: "DRG-C-006", full_name: "Leila Amr", classLetter: "C" },

  { id: "stu-d-001", code: "DRG-D-001", full_name: "Seif Tamer", classLetter: "D" },
  { id: "stu-d-002", code: "DRG-D-002", full_name: "Salma Khaled", classLetter: "D" },
  { id: "stu-d-003", code: "DRG-D-003", full_name: "Ziad Mostafa", classLetter: "D" },
  { id: "stu-d-004", code: "DRG-D-004", full_name: "Kenzy Ahmed", classLetter: "D" },
  { id: "stu-d-005", code: "DRG-D-005", full_name: "Amir Hossam", classLetter: "D" },
  { id: "stu-d-006", code: "DRG-D-006", full_name: "Laila Fares", classLetter: "D" },

  { id: "stu-e-001", code: "DRG-E-001", full_name: "Yara Adel", classLetter: "E" },
  { id: "stu-e-002", code: "DRG-E-002", full_name: "Hassan Tarek", classLetter: "E" },
  { id: "stu-e-003", code: "DRG-E-003", full_name: "Maya Sherif", classLetter: "E" },
  { id: "stu-e-004", code: "DRG-E-004", full_name: "Mostafa Hany", classLetter: "E" },
  { id: "stu-e-005", code: "DRG-E-005", full_name: "Layla Yasser", classLetter: "E" },
  { id: "stu-e-006", code: "DRG-E-006", full_name: "Omar Nabil", classLetter: "E" },

  { id: "stu-f-001", code: "DRG-F-001", full_name: "Nouran Samy", classLetter: "F" },
  { id: "stu-f-002", code: "DRG-F-002", full_name: "Kareem Ashraf", classLetter: "F" },
  { id: "stu-f-003", code: "DRG-F-003", full_name: "Farah Mostafa", classLetter: "F" },
  { id: "stu-f-004", code: "DRG-F-004", full_name: "Youssef Amr", classLetter: "F" },
  { id: "stu-f-005", code: "DRG-F-005", full_name: "Malak Hossam", classLetter: "F" },
  { id: "stu-f-006", code: "DRG-F-006", full_name: "Seif Mohamed", classLetter: "F" }
];

const DB_NAME = "dramagic_attendance_by_name_db_v1";
const DB_VERSION = 1;
const SETTINGS_KEY = "dramagic_attendance_settings";

let db = null;
let activeClass = "A";
let activeSessionNumber = 1;
let activeStartTime = "17:00";
let activeSessionDate = getTodayDateValue();
let activeLateAfter = 15;
let activeSessionId = "";
let studentSearchTerm = "";
let pendingAttendanceStatus = "present";
let isUpdatingSheetDates = false;
let selectedAttendanceEditRecord = null;


function getTodayDateValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

const attendanceUrlParams = new URLSearchParams(window.location.search);
const childViewStudentCode = attendanceUrlParams.get("studentId") || "";
const childViewStudentName = attendanceUrlParams.get("name") || "";
const childViewClass = attendanceUrlParams.get("class") || "";
const isChildAttendanceView = attendanceUrlParams.get("view") === "child" || Boolean(childViewStudentCode);

const classSelect = document.getElementById("classSelect");
const sessionInput = document.getElementById("sessionInput");
const startTimeInput = document.getElementById("startTimeInput");
const sessionDateInput = document.getElementById("sessionDateInput");
const lateAfterSelect = document.getElementById("lateAfterSelect");
const prepareBtn = document.getElementById("prepareBtn");
const startSessionBtn = document.getElementById("startSessionBtn");
const syncBtn = document.getElementById("syncBtn");
const resetSessionBtn = document.getElementById("resetSessionBtn");
const connectionPill = document.getElementById("connectionPill");
const offlineReadyPill = document.getElementById("offlineReadyPill");
const syncPill = document.getElementById("syncPill");
const studentPicker = document.getElementById("studentPicker");
const quickStatusButtons = document.getElementById("quickStatusButtons");
const saveSelectedAttendanceBtn = document.getElementById("saveSelectedAttendanceBtn");
const pendingAttendanceHint = document.getElementById("pendingAttendanceHint");
const lastScanCard = document.getElementById("lastScanCard");
const studentSearchInput = document.getElementById("studentSearchInput");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const attendanceList = document.getElementById("attendanceList");
const presentCount = document.getElementById("presentCount");
const lateCount = document.getElementById("lateCount");
const absentCount = document.getElementById("absentCount");
const totalCount = document.getElementById("totalCount");
const queueList = document.getElementById("queueList");

const sheetClassSelect = document.getElementById("sheetClassSelect");
const sheetDateInput = document.getElementById("sheetDateInput");
const sheetSessionInput = document.getElementById("sheetSessionInput");
const exportSheetCsvBtn = document.getElementById("exportSheetCsvBtn");
const attendanceSheetBody = document.getElementById("attendanceSheetBody");
const sheetPresentCount = document.getElementById("sheetPresentCount");
const sheetLateCount = document.getElementById("sheetLateCount");
const sheetAbsentCount = document.getElementById("sheetAbsentCount");
const sheetTotalCount = document.getElementById("sheetTotalCount");
const attendanceHeroTitle = document.getElementById("attendanceHeroTitle");
const attendanceHeroSubtitle = document.getElementById("attendanceHeroSubtitle");
const readonlyAttendanceNotice = document.getElementById("readonlyAttendanceNotice");

init();

async function init() {
  applyAttendanceTheme();
  restoreSettings();
  configureChildAttendanceView();
  setupSheetDefaults();
  bindEvents();
  updateConnectionPill();

  try {
    db = await openAttendanceDB();
    await prepareOfflineAttendance({ silent: true });
    await renderEverything();
  } catch (error) {
    console.error(error);
    showLastScan("Database issue", "Could not open the offline database. Try another browser or clear site data.", "bad");
  }
}

function applyAttendanceTheme() {
  let theme = localStorage.getItem("dramagic_theme") || "light";

  try {
    const settings = JSON.parse(localStorage.getItem("dramagic_settings")) || {};
    theme = settings.theme || theme;
  } catch {
    // keep saved theme
  }

  const systemWantsDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = theme === "dark" || (theme === "system" && systemWantsDark);

  document.documentElement.classList.toggle("dark-mode", shouldUseDark);
  document.documentElement.classList.toggle("light-mode", !shouldUseDark);
  document.body.classList.toggle("dark-mode", shouldUseDark);
  document.body.classList.toggle("light-mode", !shouldUseDark);
}


function configureChildAttendanceView() {
  if (!isChildAttendanceView) return;

  document.body.classList.add("attendance-child-view");

  if (childViewClass) {
    activeClass = childViewClass.toUpperCase();
    if (classSelect) classSelect.value = activeClass;
  }

  if (attendanceHeroTitle) {
    attendanceHeroTitle.textContent = childViewStudentName
      ? `${childViewStudentName}'s Attendance`
      : "Child Attendance Sheet";
  }

  if (attendanceHeroSubtitle) {
    attendanceHeroSubtitle.textContent = "View session status, arrival time, late records, and absences for this Dramagician only.";
  }

  if (readonlyAttendanceNotice) readonlyAttendanceNotice.classList.remove("hidden");
}

function bindEvents() {
  window.addEventListener("online", updateConnectionPill);
  window.addEventListener("offline", updateConnectionPill);

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  classSelect.addEventListener("change", async () => {
    activeClass = classSelect.value;
    if (sheetClassSelect && sheetClassSelect.value !== "all") sheetClassSelect.value = activeClass;
    saveSettings();
    updateSessionId();
    await renderEverything();
  });

  sessionInput.addEventListener("change", async () => {
    activeSessionNumber = Number(sessionInput.value || 1);
    if (sheetSessionInput) sheetSessionInput.value = String(activeSessionNumber);
    saveSettings();
    updateSessionId();
    await renderEverything();
  });

  startTimeInput.addEventListener("change", () => {
    activeStartTime = startTimeInput.value || "17:00";
    saveSettings();
  });

  lateAfterSelect.addEventListener("change", () => {
    activeLateAfter = Number(lateAfterSelect.value || 15);
    saveSettings();
  });

  prepareBtn.addEventListener("click", async () => {
    await prepareOfflineAttendance();
  });

  startSessionBtn.addEventListener("click", async () => {
    updateSessionId();
    await renderEverything();
    showLastScan(`Class ${activeClass} Session ${activeSessionNumber}`, "Session is open. Choose a Dramagician and mark attendance by name.", "good");
  });

  quickStatusButtons.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => setPendingAttendanceStatus(button.dataset.status));
  });

  saveSelectedAttendanceBtn.addEventListener("click", () => saveSelectedAttendance());

  if (sheetClassSelect) sheetClassSelect.addEventListener("change", renderAttendanceSheet);
  if (sheetDateInput) sheetDateInput.addEventListener("change", renderAttendanceSheet);
  if (sheetSessionInput) sheetSessionInput.addEventListener("change", renderAttendanceSheet);
  if (exportSheetCsvBtn) exportSheetCsvBtn.addEventListener("click", exportAttendanceSheetCsv);

  syncBtn.addEventListener("click", demoSyncToSupabase);
  resetSessionBtn.addEventListener("click", resetCurrentSession);

  studentSearchInput.addEventListener("input", () => {
    studentSearchTerm = studentSearchInput.value.trim().toLowerCase();
    renderAttendanceList();
  });

  exportCsvBtn.addEventListener("click", exportCsvBackup);
}

function switchTab(tabName) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active-panel"));

  const targetPanel = document.getElementById(`${tabName}Panel`);
  if (targetPanel) targetPanel.classList.add("active-panel");

  if (tabName === "students") renderAttendanceList();
  if (tabName === "sheet") renderAttendanceSheet();
  if (tabName === "queue") renderQueueList();
}

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    activeClass = saved.activeClass || "A";
    activeSessionNumber = saved.activeSessionNumber || 1;
    activeStartTime = saved.activeStartTime || "17:00";
    activeSessionDate = saved.activeSessionDate || getTodayDateValue();
    activeLateAfter = saved.activeLateAfter || 15;
  } catch {
    // keep defaults
  }

  classSelect.value = activeClass;
  sessionInput.value = activeSessionNumber;
  startTimeInput.value = activeStartTime;
  if (sessionDateInput) sessionDateInput.value = activeSessionDate;
  lateAfterSelect.value = String(activeLateAfter);
  updateSessionId();
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    activeClass,
    activeSessionNumber,
    activeStartTime,
    activeSessionDate,
    activeLateAfter
  }));
}

function updateSessionId() {
  activeSessionDate = activeSessionDate || getTodayDateValue();
  activeSessionId = `${activeSessionDate}_CLASS_${activeClass}_SESSION_${activeSessionNumber}`;
}

function setupSheetDefaults() {
  if (sheetClassSelect) {
    sheetClassSelect.value = activeClass;
    if (isChildAttendanceView) sheetClassSelect.disabled = true;
  }

  if (sheetSessionInput) sheetSessionInput.value = String(activeSessionNumber);
}

function setPendingAttendanceStatus(status) {
  pendingAttendanceStatus = ["present", "late", "absent"].includes(status) ? status : "present";

  if (quickStatusButtons) {
    quickStatusButtons.querySelectorAll("[data-status]").forEach((button) => {
      button.classList.toggle("active", button.dataset.status === pendingAttendanceStatus);
    });
  }

  if (pendingAttendanceHint) {
    pendingAttendanceHint.textContent = `Selected status: ${capitalize(pendingAttendanceStatus)}. Press save to confirm.`;
  }
}

async function saveSelectedAttendance() {
  const studentId = studentPicker.value;

  if (!studentId) {
    showLastScan("Choose a Dramagician", "Select a name first, choose a status, then press Save Attendance.", "warn");
    return;
  }

  await markStudentById(studentId, pendingAttendanceStatus);
}

async function prepareOfflineAttendance(options = {}) {
  const tx = db.transaction(["students"], "readwrite");
  const store = tx.objectStore("students");

  DEMO_STUDENTS.forEach((student) => store.put(student));

  await txDone(tx);
  await renderEverything();

  if (!options.silent) {
    showLastScan("Student list ready ✅", "Class lists are saved on this device until Supabase student data is connected.", "good");
  }
}

async function renderEverything() {
  await renderOfflineReady();
  await renderStudentPicker();
  await renderAttendanceList();
  await populateSheetDateOptions();
  await renderAttendanceSheet();
  await renderQueueList();

  if (isChildAttendanceView) {
    switchTab("sheet");
  }
}

async function renderOfflineReady() {
  const students = await getAllStudents();
  const count = students.length;

  if (count > 0) {
    offlineReadyPill.textContent = `${count} Dramagicians prepared offline`;
    offlineReadyPill.className = "status-pill good";
  } else {
    offlineReadyPill.textContent = "Student list not prepared";
    offlineReadyPill.className = "status-pill warn";
  }

  const unsynced = await getUnsyncedRecords();
  syncPill.textContent = `${unsynced.length} unsynced`;
  syncPill.className = unsynced.length ? "status-pill warn" : "status-pill good";
}

function updateConnectionPill() {
  if (navigator.onLine) {
    connectionPill.textContent = "Online";
    connectionPill.className = "status-pill good";
  } else {
    connectionPill.textContent = "Offline mode";
    connectionPill.className = "status-pill warn";
  }
}

async function renderStudentPicker() {
  const students = (await getAllStudents())
    .filter((student) => student.classLetter === activeClass)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));

  if (!students.length) {
    studentPicker.innerHTML = `<option value="">No Dramagicians in Class ${clean(activeClass)}</option>`;
    return;
  }

  const previousValue = studentPicker.value;

  studentPicker.innerHTML = students.map((student) => `
    <option value="${clean(student.id)}">${clean(student.full_name)}</option>
  `).join("");

  if (previousValue && students.some((student) => student.id === previousValue)) {
    studentPicker.value = previousValue;
  }
}

async function markStudentById(studentId, mode) {
  updateSessionId();

  const students = await getAllStudents();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    showLastScan("Unknown Dramagician", "This name is not in the offline student list.", "bad");
    return;
  }

  if (student.classLetter !== activeClass) {
    showLastScan(student.full_name, `Wrong class. This Dramagician belongs to Class ${student.classLetter}.`, "bad");
    return;
  }

  const now = new Date();
  const status = ["present", "late", "absent"].includes(mode) ? mode : isLate(now) ? "late" : "present";

  const record = {
    id: `${activeSessionId}_${student.id}`,
    sessionId: activeSessionId,
    classLetter: activeClass,
    sessionNumber: activeSessionNumber,
    studentId: student.id,
    studentCode: student.code,
    studentName: student.full_name,
    status,
    scannedAt: now.toISOString(),
    synced: 0,
    markedBy: "teacher-local",
    method: "name"
  };

  await saveAttendanceRecord(record);

  showLastScan(student.full_name, `Class ${activeClass} • ${status.toUpperCase()} • ${formatTime(record.scannedAt)}`, status === "absent" ? "warn" : "good");
  await renderEverything();
}

function isLate(now) {
  const [hour, minute] = activeStartTime.split(":").map(Number);

  const classStart = new Date(now);
  classStart.setHours(hour || 0, minute || 0, 0, 0);

  const lateTime = new Date(classStart.getTime() + activeLateAfter * 60 * 1000);

  if (now >= lateTime) return true;

  const sixHours = 6 * 60 * 60 * 1000;
  const scanIsManyHoursBeforeStart = classStart.getTime() - now.getTime() > sixHours;

  if (scanIsManyHoursBeforeStart) {
    const now12Minutes = (now.getHours() % 12) * 60 + now.getMinutes();
    const start12Minutes = ((hour || 0) % 12) * 60 + (minute || 0);
    const late12Minutes = start12Minutes + activeLateAfter;
    return now12Minutes >= late12Minutes;
  }

  return false;
}

async function renderAttendanceList() {
  const students = (await getAllStudents())
    .filter((student) => student.classLetter === activeClass)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
  const records = await getRecordsForSession(activeSessionId);
  const byStudent = new Map(records.map((record) => [record.studentId, record]));

  let visible = students;
  if (studentSearchTerm) {
    visible = visible.filter((student) => {
      const haystack = `${student.full_name} ${student.code}`.toLowerCase();
      return haystack.includes(studentSearchTerm);
    });
  }

  let present = 0;
  let late = 0;

  students.forEach((student) => {
    const record = byStudent.get(student.id);
    if (record?.status === "present") present += 1;
    if (record?.status === "late") late += 1;
  });

  const absent = Math.max(students.length - present - late, 0);

  presentCount.textContent = present;
  lateCount.textContent = late;
  absentCount.textContent = absent;
  totalCount.textContent = students.length;

  if (!students.length) {
    attendanceList.innerHTML = `
      <div class="queue-card">
        <h2>No Dramagicians prepared yet</h2>
        <p>Tap “Prepare Student List” first.</p>
      </div>
    `;
    return;
  }

  attendanceList.innerHTML = visible.map((student) => {
    const record = byStudent.get(student.id);
    const status = record?.status || "absent";
    const time = record ? formatTime(record.scannedAt) : "Not marked yet";

    return `
      <article class="student-row">
        <div class="student-avatar">${clean(student.full_name.charAt(0))}</div>
        <div class="student-main">
          <strong>${clean(student.full_name)}</strong>
          <span>Class ${clean(student.classLetter)} • ${clean(time)}</span>
        </div>
        <div class="student-actions" data-student-id="${clean(student.id)}" data-current-status="${clean(status)}">
          <span class="status-badge status-${clean(status)}">${statusLabel(status)}</span>
          <button type="button" class="action-btn select-action">Select</button>
        </div>
      </article>
    `;
  }).join("");

  attendanceList.querySelectorAll("[data-student-id] button").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-student-id]");
      const studentId = row.dataset.studentId;
      const currentStatus = row.dataset.currentStatus || "present";

      studentPicker.value = studentId;
      setPendingAttendanceStatus(currentStatus === "absent" ? "absent" : currentStatus);
      studentPicker.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

async function populateSheetDateOptions() {
  if (!sheetDateInput || isUpdatingSheetDates) return;

  isUpdatingSheetDates = true;

  try {
    const currentValue = sheetDateInput.value;
    const today = getTodayDateValue();
    const sessionDay = activeSessionDate || today;
    const availableDates = await getAvailableAttendanceDates();

    if (!availableDates.includes(sessionDay)) {
      availableDates.unshift(sessionDay);
    }

    if (!availableDates.includes(today)) {
      availableDates.unshift(today);
    }

    const uniqueDates = Array.from(new Set(availableDates)).sort((a, b) => b.localeCompare(a));

    sheetDateInput.innerHTML = uniqueDates.map((dateValue) => `
      <option value="${clean(dateValue)}">${clean(formatSheetDateLabel(dateValue))}</option>
    `).join("");

    if (currentValue && uniqueDates.includes(currentValue)) {
      sheetDateInput.value = currentValue;
    } else {
      sheetDateInput.value = uniqueDates[0] || today;
    }
  } finally {
    isUpdatingSheetDates = false;
  }
}

async function getAvailableAttendanceDates() {
  const records = await getAllAttendanceRecords();
  const dates = new Set();

  records.forEach((record) => {
    const dateValue = getRecordDate(record);
    if (dateValue) dates.add(dateValue);
  });

  return Array.from(dates);
}

function getRecordDate(record) {
  const sessionMatch = String(record?.sessionId || "").match(/^(\d{4}-\d{2}-\d{2})_/);
  if (sessionMatch) return sessionMatch[1];

  if (record?.scannedAt) {
    return new Date(record.scannedAt).toISOString().slice(0, 10);
  }

  return "";
}

function formatSheetDateLabel(dateValue) {
  const today = getTodayDateValue();
  const date = new Date(`${dateValue}T12:00:00`);

  const formatted = new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);

  return dateValue === today ? `Today • ${formatted}` : formatted;
}

async function buildAttendanceSheetRows() {
  const selectedClass = sheetClassSelect ? sheetClassSelect.value : activeClass;
  const selectedDate = sheetDateInput && sheetDateInput.value ? sheetDateInput.value : (activeSessionDate || getTodayDateValue());
  const selectedSession = Number(sheetSessionInput && sheetSessionInput.value ? sheetSessionInput.value : activeSessionNumber || 1);

  const allStudents = (await getAllStudents()).sort((a, b) => {
    if (a.classLetter !== b.classLetter) return a.classLetter.localeCompare(b.classLetter);
    return a.full_name.localeCompare(b.full_name);
  });

  let students = allStudents.filter((student) => selectedClass === "all" || student.classLetter === selectedClass);

  if (isChildAttendanceView && childViewStudentCode) {
    const wanted = String(childViewStudentCode).trim().toUpperCase();
    students = students.filter((student) => {
      return String(student.code || "").toUpperCase() === wanted ||
        String(student.id || "").toUpperCase() === wanted;
    });
  }
  const recordsById = new Map();

  for (const classLetter of ["A", "B", "C", "D", "E", "F"]) {
    if (selectedClass !== "all" && selectedClass !== classLetter) continue;
    const sessionId = `${selectedDate}_CLASS_${classLetter}_SESSION_${selectedSession}`;
    const records = await getRecordsForSession(sessionId);
    records.forEach((record) => recordsById.set(record.studentId, record));
  }

  return students.map((student) => {
    const record = recordsById.get(student.id);
    return {
      classLetter: student.classLetter,
      studentName: student.full_name,
      studentId: student.id,
      status: record?.status || "absent",
      time: record?.scannedAt || "",
      sessionNumber: selectedSession
    };
  });
}

async function renderAttendanceSheet() {
  if (!attendanceSheetBody) return;
  if (sheetDateInput && !sheetDateInput.options.length && !isUpdatingSheetDates) {
    await populateSheetDateOptions();
  }

  const rows = await buildAttendanceSheetRows();
  const present = rows.filter((row) => row.status === "present").length;
  const late = rows.filter((row) => row.status === "late").length;
  const absent = rows.filter((row) => row.status === "absent").length;

  if (sheetPresentCount) sheetPresentCount.textContent = present;
  if (sheetLateCount) sheetLateCount.textContent = late;
  if (sheetAbsentCount) sheetAbsentCount.textContent = absent;
  if (sheetTotalCount) sheetTotalCount.textContent = rows.length;

  if (!rows.length) {
    attendanceSheetBody.innerHTML = `
      <tr>
        <td colspan="5" class="sheet-empty">No Dramagicians found for this class.</td>
      </tr>
    `;
    return;
  }

  attendanceSheetBody.innerHTML = rows.map((row) => `
    <tr>
      <td>Class ${clean(row.classLetter)}</td>
      <td>${clean(row.studentName)}</td>
      <td><span class="status-badge status-${clean(row.status)}">${statusLabel(row.status)}</span></td>
      <td>${row.time ? clean(formatTime(row.time)) : "—"}</td>
      <td>Session ${clean(row.sessionNumber)}</td>
    </tr>
  `).join("");
}

async function exportAttendanceSheetCsv() {
  const rows = await buildAttendanceSheetRows();
  const selectedDate = sheetDateInput && sheetDateInput.value ? sheetDateInput.value : (activeSessionDate || getTodayDateValue());
  const selectedClass = sheetClassSelect ? sheetClassSelect.value : activeClass;
  const selectedSession = Number(sheetSessionInput && sheetSessionInput.value ? sheetSessionInput.value : activeSessionNumber || 1);

  const csvRows = [
    ["date", "class", "session", "student_id", "student_name", "status", "time"]
  ];

  rows.forEach((row) => {
    csvRows.push([
      selectedDate,
      row.classLetter,
      selectedSession,
      row.studentId,
      row.studentName,
      row.status,
      row.time || ""
    ]);
  });

  const csv = csvRows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dramagic-attendance-sheet-${selectedClass}-session-${selectedSession}-${selectedDate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function renderQueueList() {
  const unsynced = await getUnsyncedRecords();

  syncPill.textContent = `${unsynced.length} unsynced`;
  syncPill.className = unsynced.length ? "status-pill warn" : "status-pill good";

  if (!unsynced.length) {
    queueList.innerHTML = `<article class="queue-row"><strong>Nothing waiting to sync ✅</strong><span class="status-badge status-present">Clean</span></article>`;
    return;
  }

  queueList.innerHTML = unsynced.map((record) => `
    <article class="queue-row">
      <div>
        <strong>${clean(record.studentName)}</strong>
        <span>Class ${clean(record.classLetter)} • Session ${clean(record.sessionNumber)} • ${clean(statusLabel(record.status))} • ${clean(formatTime(record.scannedAt))}</span>
      </div>
      <span class="status-badge status-late">Unsynced</span>
    </article>
  `).join("");
}

async function resetCurrentSession() {
  updateSessionId();

  const records = await getRecordsForSession(activeSessionId);
  if (!records.length) {
    showLastScan("Session already empty", "No attendance records were found for this class/session.", "warn");
    await renderEverything();
    return;
  }

  const ok = window.confirm(`Reset attendance for Class ${activeClass} Session ${activeSessionNumber}?`);
  if (!ok) return;

  const tx = db.transaction(["attendance"], "readwrite");
  const store = tx.objectStore("attendance");
  records.forEach((record) => store.delete(record.id));
  await txDone(tx);

  await renderEverything();
  showLastScan("Session reset ✅", "You can mark attendance again by name.", "good");
}

async function demoSyncToSupabase() {
  const unsynced = await getUnsyncedRecords();

  if (!unsynced.length) {
    showLastScan("No sync needed", "All records are already synced in this demo.", "good");
    return;
  }

  const tx = db.transaction(["attendance"], "readwrite");
  const store = tx.objectStore("attendance");
  unsynced.forEach((record) => store.put({ ...record, synced: 1, syncedAt: new Date().toISOString() }));
  await txDone(tx);

  await renderEverything();
  showLastScan("Synced demo ✅", `${unsynced.length} record(s) marked as synced. Later this uploads to Supabase.`, "good");
}

async function exportCsvBackup() {
  const students = (await getAllStudents()).filter((student) => student.classLetter === activeClass);
  const records = await getRecordsForSession(activeSessionId);
  const byStudent = new Map(records.map((record) => [record.studentId, record]));

  const rows = [
    ["session_id", "class", "session", "student_id", "student_name", "status", "mark_time", "method", "synced"]
  ];

  students.forEach((student) => {
    const record = byStudent.get(student.id);
    rows.push([
      activeSessionId,
      activeClass,
      activeSessionNumber,
      student.id,
      student.full_name,
      record?.status || "absent",
      record?.scannedAt || "",
      record?.method || "name",
      isRecordSynced(record) ? "yes" : "no"
    ]);
  });

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dramagic-attendance-class-${activeClass}-session-${activeSessionNumber}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function showLastScan(title, message, type) {
  lastScanCard.classList.remove("hidden");
  lastScanCard.innerHTML = `
    <strong>${clean(title)}</strong>
    <p>${clean(message)}</p>
  `;

  lastScanCard.style.borderColor = type === "bad"
    ? "rgba(214,40,40,.32)"
    : type === "good"
      ? "rgba(25,135,84,.32)"
      : "rgba(245,159,0,.32)";
}

function capitalize(value) {
  const text = String(value || "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function statusLabel(status) {
  if (status === "present") return "Present ✅";
  if (status === "late") return "Late 🟡";
  if (status === "excused") return "Excused 🔵";
  return "Absent ❌";
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clean(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   IndexedDB helpers
===================================================== */

function openAttendanceDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("students")) {
        const students = database.createObjectStore("students", { keyPath: "id" });
        students.createIndex("code", "code", { unique: true });
        students.createIndex("classLetter", "classLetter", { unique: false });
      }

      if (!database.objectStoreNames.contains("attendance")) {
        const attendance = database.createObjectStore("attendance", { keyPath: "id" });
        attendance.createIndex("sessionId", "sessionId", { unique: false });
        attendance.createIndex("studentId", "studentId", { unique: false });
        attendance.createIndex("synced", "synced", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["students"], "readonly");
    const request = tx.objectStore("students").getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function saveAttendanceRecord(record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["attendance"], "readwrite");
    const request = tx.objectStore("attendance").put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function deleteAttendanceRecord(sessionId, studentId) {
  return new Promise((resolve, reject) => {
    const id = `${sessionId}_${studentId}`;
    const tx = db.transaction(["attendance"], "readwrite");
    const request = tx.objectStore("attendance").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getRecordsForSession(sessionId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["attendance"], "readonly");
    const request = tx.objectStore("attendance").index("sessionId").getAll(sessionId);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function getAllAttendanceRecords() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["attendance"], "readonly");
    const request = tx.objectStore("attendance").getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function isRecordSynced(record) {
  return record?.synced === true || record?.synced === 1 || record?.synced === "yes";
}

function getUnsyncedRecords() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["attendance"], "readonly");
    const request = tx.objectStore("attendance").getAll();

    request.onsuccess = () => {
      const records = request.result || [];
      resolve(records.filter((record) => !isRecordSynced(record)));
    };

    request.onerror = () => reject(request.error);
  });
}

/* =====================================================
   ACCESS FIX — Parent / Dramagician attendance is view-only.
   Teachers/CEO can still mark attendance. Parents and Dramagicians
   only see their own child/self history, filtered automatically.
===================================================== */

function readAttendanceSession() {
  try {
    return JSON.parse(localStorage.getItem("dramagic_demo_session")) || {};
  } catch {
    return {};
  }
}

function getAttendanceRole() {
  return String(readAttendanceSession().role || "guest").toLowerCase();
}

function isAttendanceReadOnlyViewer() {
  const role = getAttendanceRole();
  return role === "parent" || role === "student" || isChildAttendanceView;
}

function addPreviewParentAttendanceChildren(children, session) {
  const list = Array.isArray(children) ? children.slice() : [];
  const role = String(session?.role || "").toLowerCase();
  const email = String(session?.email || "").toLowerCase();
  const username = String(session?.username || "").toLowerCase();
  const hasLaila = list.some((child) => String(child.studentId || child.code || "").toUpperCase() === "DRG-A-001");

  if (role !== "parent" || !(email === "parent@dramagic.demo" || username === "parent" || hasLaila)) {
    return list;
  }

  [
    { studentId: "DRG-A-001", code: "DRG-A-001", name: "Laila Hassan", classLetter: "A", className: "Class A" },
    { studentId: "DRG-A-002", code: "DRG-A-002", name: "Youssef Ali", classLetter: "A", className: "Class A" }
  ].forEach((child) => {
    const exists = list.some((saved) => String(saved.studentId || saved.code || "").toUpperCase() === child.studentId);
    if (!exists) list.push(child);
  });

  return list;
}

function getParentAttendanceChildren() {
  const session = readAttendanceSession();
  let children = [];

  if (Array.isArray(session.children) && session.children.length) {
    children = session.children.map((child) => ({
      studentId: child.studentId || child.code || child.id || "",
      code: child.studentId || child.code || child.id || "",
      name: child.name || child.full_name || child.fullName || "Dramagician",
      classLetter: String(child.classLetter || child.class || session.classLetter || "A").toUpperCase(),
      className: child.className || `Class ${String(child.classLetter || child.class || session.classLetter || "A").toUpperCase()}`
    }));
  } else if (session.linkedStudentId || session.linkedStudentName) {
    children = [{
      studentId: session.linkedStudentId || session.studentId || session.code || "",
      code: session.linkedStudentId || session.studentId || session.code || "",
      name: session.linkedStudentName || session.studentName || "Dramagician",
      classLetter: String(session.classLetter || "A").toUpperCase(),
      className: session.className || `Class ${String(session.classLetter || "A").toUpperCase()}`
    }];
  }

  return addPreviewParentAttendanceChildren(children, session);
}

function getSelectedAttendanceChild() {
  const session = readAttendanceSession();
  const role = getAttendanceRole();

  if (childViewStudentCode || childViewStudentName) {
    return {
      studentId: childViewStudentCode || "",
      code: childViewStudentCode || "",
      name: childViewStudentName || "Dramagician",
      classLetter: String(childViewClass || session.classLetter || "A").toUpperCase(),
      className: `Class ${String(childViewClass || session.classLetter || "A").toUpperCase()}`
    };
  }

  if (role === "parent") {
    const children = getParentAttendanceChildren();
    const stored = localStorage.getItem("dramagic_selected_parent_child") || "";
    return children.find((child) => child.studentId === stored || child.code === stored) || children[0] || null;
  }

  if (role === "student") {
    return {
      studentId: session.studentId || session.student_id || session.code || session.dramagicId || "",
      code: session.studentId || session.student_id || session.code || session.dramagicId || "",
      name: session.full_name || session.fullName || session.name || "Dramagician",
      classLetter: String(session.classLetter || session.class || "A").toUpperCase(),
      className: session.className || `Class ${String(session.classLetter || session.class || "A").toUpperCase()}`
    };
  }

  return null;
}

function ensureChildAttendanceSelector() {
  if (!isAttendanceReadOnlyViewer()) return;
  if (document.getElementById("childAttendanceSelectorCard")) return;

  const session = readAttendanceSession();
  const children = getParentAttendanceChildren();
  const selected = getSelectedAttendanceChild();
  const canChooseChild = getAttendanceRole() === "parent" && children.length > 1;

  const card = document.createElement("section");
  card.id = "childAttendanceSelectorCard";
  card.className = "child-attendance-selector-card";
  card.innerHTML = `
    <div>
      <p class="eyebrow">Attendance records</p>
      <h2>${clean(selected?.name || session.full_name || "Dramagician")}</h2>
      <p>${clean(selected?.className || `Class ${selected?.classLetter || ""}`)} • Choose the child you want to view.</p>
    </div>
    ${canChooseChild ? `
      <label>
        <span>Choose child</span>
        <select id="childAttendanceSelect">
          ${children.map((child) => `<option value="${clean(child.studentId || child.code)}">${clean(child.name)} • Class ${clean(child.classLetter)}</option>`).join("")}
        </select>
      </label>
    ` : ""}
  `;

  const sheetPanel = document.getElementById("sheetPanel");
  if (sheetPanel) {
    sheetPanel.parentNode.insertBefore(card, sheetPanel);
  }

  const select = document.getElementById("childAttendanceSelect");
  if (select && selected) {
    select.value = selected.studentId || selected.code || "";
    select.addEventListener("change", async function () {
      localStorage.setItem("dramagic_selected_parent_child", select.value);
      configureChildAttendanceView();
      await renderEverything();
    });
  }
}

function configureChildAttendanceView() {
  if (!isAttendanceReadOnlyViewer()) {
    document.body.classList.remove("attendance-readonly-view", "attendance-child-view");
    return;
  }

  const child = getSelectedAttendanceChild();
  document.body.classList.add("attendance-readonly-view", "attendance-child-view");

  if (child?.classLetter) {
    activeClass = child.classLetter;
    if (classSelect) classSelect.value = activeClass;
    if (sheetClassSelect) sheetClassSelect.value = activeClass;
  }

  if (attendanceHeroTitle) {
    attendanceHeroTitle.textContent = child?.name ? `${child.name}'s Attendance` : "Attendance History";
  }

  if (attendanceHeroSubtitle) {
    attendanceHeroSubtitle.textContent = child?.name ? `Attendance history for ${child.name}.` : "Attendance history.";
  }

  if (readonlyAttendanceNotice) {
    readonlyAttendanceNotice.classList.remove("hidden");
    readonlyAttendanceNotice.innerHTML = `
      <strong>Attendance records</strong>
      <span>${clean(child?.name || "This Dramagician")} • ${clean(child?.className || `Class ${child?.classLetter || ""}`)}</span>
    `;
  }

  if (offlineReadyPill) {
    offlineReadyPill.textContent = "Attendance history";
    offlineReadyPill.className = "status-pill good";
  }

  if (syncPill) {
    syncPill.textContent = "Private records";
    syncPill.className = "status-pill muted";
  }

  ensureChildAttendanceSelector();
}

function bindEvents() {
  window.addEventListener("online", updateConnectionPill);
  window.addEventListener("offline", updateConnectionPill);

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isAttendanceReadOnlyViewer()) {
        switchTab("sheet");
        return;
      }
      switchTab(button.dataset.tab);
    });
  });

  if (isAttendanceReadOnlyViewer()) {
    if (sheetClassSelect) sheetClassSelect.addEventListener("change", renderAttendanceSheet);
    if (sheetDateInput) sheetDateInput.addEventListener("change", renderAttendanceSheet);
    if (sheetSessionInput) sheetSessionInput.addEventListener("change", renderAttendanceSheet);
    return;
  }

  if (classSelect) classSelect.addEventListener("change", async () => {
    activeClass = classSelect.value;
    if (sheetClassSelect && sheetClassSelect.value !== "all") sheetClassSelect.value = activeClass;
    saveSettings();
    updateSessionId();
    await renderEverything();
  });

  if (sessionInput) sessionInput.addEventListener("change", async () => {
    activeSessionNumber = Number(sessionInput.value || 1);
    saveSettings();
    updateSessionId();
    await renderEverything();
  });

  if (sessionDateInput) sessionDateInput.addEventListener("change", async () => {
    activeSessionDate = sessionDateInput.value || getTodayDateValue();
    saveSettings();
    updateSessionId();
    await renderEverything();
  });

  if (startTimeInput) startTimeInput.addEventListener("change", () => {
    activeStartTime = startTimeInput.value || "17:00";
    saveSettings();
  });

  if (lateAfterSelect) lateAfterSelect.addEventListener("change", () => {
    activeLateAfter = Number(lateAfterSelect.value || 15);
    saveSettings();
  });

  if (prepareBtn) prepareBtn.addEventListener("click", () => prepareOfflineAttendance());
  if (startSessionBtn) startSessionBtn.addEventListener("click", async () => {
    activeSessionDate = sessionDateInput?.value || activeSessionDate || getTodayDateValue();
    saveSettings();
    updateSessionId();
    await renderEverything();
    showLastScan("Session opened ✅", `Class ${activeClass} • Session ${activeSessionNumber} • ${activeSessionDate}`, "good");
  });
  if (syncBtn) syncBtn.addEventListener("click", demoSyncToSupabase);
  if (resetSessionBtn) resetSessionBtn.addEventListener("click", resetCurrentSession);
  if (studentSearchInput) studentSearchInput.addEventListener("input", async () => {
    studentSearchTerm = studentSearchInput.value.trim().toLowerCase();
    await renderAttendanceList();
  });
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsvBackup);
  if (exportSheetCsvBtn) exportSheetCsvBtn.addEventListener("click", exportAttendanceSheetCsv);
  if (sheetClassSelect) sheetClassSelect.addEventListener("change", renderAttendanceSheet);
  if (sheetDateInput) sheetDateInput.addEventListener("change", renderAttendanceSheet);
  if (sheetSessionInput) sheetSessionInput.addEventListener("change", renderAttendanceSheet);
  if (quickStatusButtons) {
    quickStatusButtons.querySelectorAll("[data-status]").forEach((button) => {
      button.addEventListener("click", () => setPendingAttendanceStatus(button.dataset.status));
    });
  }
  if (saveSelectedAttendanceBtn) saveSelectedAttendanceBtn.addEventListener("click", saveSelectedAttendance);
}

async function init() {
  applyAttendanceTheme();
  restoreSettings();
  configureChildAttendanceView();
  setupSheetDefaults();
  bindEvents();
  updateConnectionPill();

  try {
    db = await openAttendanceDB();
    await prepareOfflineAttendance({ silent: true });
    await renderEverything();
  } catch (error) {
    console.error(error);
    if (lastScanCard) showLastScan("Database issue", "Could not open the offline database. Try another browser or clear site data.", "bad");
  }
}

async function renderEverything() {
  configureChildAttendanceView();
  await renderOfflineReady();

  if (isAttendanceReadOnlyViewer()) {
    switchTab("sheet");
    await renderAttendanceSheet();
    return;
  }

  await renderStudentPicker();
  await renderAttendanceList();
  await populateSheetDateOptions();
  await renderAttendanceSheet();
  await renderQueueList();
}

async function buildAttendanceSheetRows() {
  if (isAttendanceReadOnlyViewer()) {
    const child = getSelectedAttendanceChild();
    if (!child) return [];

    const wantedCode = String(child.code || child.studentId || "").trim().toUpperCase();
    const wantedName = String(child.name || "").trim().toLowerCase();
    const wantedClass = String(child.classLetter || "").trim().toUpperCase();
    const allStudents = await getAllStudents();
    const matchedStudent = allStudents.find((student) => {
      const studentCodeMatches = wantedCode && (String(student.code || "").toUpperCase() === wantedCode || String(student.id || "").toUpperCase() === wantedCode);
      const studentNameMatches = wantedName && String(student.full_name || "").toLowerCase() === wantedName;
      const studentClassMatches = !wantedClass || String(student.classLetter || "").toUpperCase() === wantedClass;
      return studentClassMatches && ((studentCodeMatches && (!wantedName || studentNameMatches)) || studentNameMatches);
    });

    const records = await getAllAttendanceRecords();
    const rows = records.filter((record) => {
      const recordCode = String(record.studentCode || "").toUpperCase();
      const recordId = String(record.studentId || "").toUpperCase();
      const recordName = String(record.studentName || "").toLowerCase();
      const recordClass = String(record.classLetter || "").toUpperCase();
      const nameIsCompatible = !wantedName || !recordName || recordName === wantedName;
      const classIsCompatible = !wantedClass || !recordClass || recordClass === wantedClass;

      if (!nameIsCompatible || !classIsCompatible) return false;
      if (matchedStudent && record.studentId === matchedStudent.id) return true;
      if (wantedCode && (recordCode === wantedCode || recordId === wantedCode)) return true;
      return Boolean(wantedName && recordName === wantedName);
    });

    return rows.sort((a, b) => String(b.scannedAt || "").localeCompare(String(a.scannedAt || ""))).map((record) => ({
      date: getRecordDate(record),
      classLetter: record.classLetter || child.classLetter || "",
      studentName: record.studentName || matchedStudent?.full_name || child.name || "Dramagician",
      studentId: record.studentId || matchedStudent?.id || child.studentId || "",
      status: record.status || "absent",
      time: record.scannedAt || "",
      sessionNumber: record.sessionNumber || 1
    }));
  }

  const selectedClass = sheetClassSelect ? sheetClassSelect.value : activeClass;
  const selectedDate = sheetDateInput && sheetDateInput.value ? sheetDateInput.value : (activeSessionDate || getTodayDateValue());
  const selectedSession = Number(sheetSessionInput && sheetSessionInput.value ? sheetSessionInput.value : activeSessionNumber || 1);

  const allStudents = (await getAllStudents()).sort((a, b) => {
    if (a.classLetter !== b.classLetter) return a.classLetter.localeCompare(b.classLetter);
    return a.full_name.localeCompare(b.full_name);
  });

  const students = allStudents.filter((student) => selectedClass === "all" || student.classLetter === selectedClass);
  const recordsById = new Map();

  for (const classLetter of ["A", "B", "C", "D", "E", "F"]) {
    if (selectedClass !== "all" && selectedClass !== classLetter) continue;
    const sessionId = `${selectedDate}_CLASS_${classLetter}_SESSION_${selectedSession}`;
    const records = await getRecordsForSession(sessionId);
    records.forEach((record) => recordsById.set(record.studentId, record));
  }

  return students.map((student) => {
    const record = recordsById.get(student.id);
    return {
      date: selectedDate,
      classLetter: student.classLetter,
      studentName: student.full_name,
      studentId: student.id,
      status: record?.status || "absent",
      time: record?.scannedAt || "",
      sessionNumber: selectedSession
    };
  });
}

async function renderAttendanceSheet() {
  if (!attendanceSheetBody) return;

  const tableHeadRow = document.querySelector(".attendance-sheet-table thead tr");
  const readOnly = isAttendanceReadOnlyViewer();

  if (!readOnly && sheetDateInput && !sheetDateInput.options.length && !isUpdatingSheetDates) {
    await populateSheetDateOptions();
  }

  if (tableHeadRow) {
    tableHeadRow.innerHTML = readOnly
      ? "<th>Date</th><th>Class</th><th>Dramagician</th><th>Status</th><th>Time</th><th>Session</th>"
      : "<th>Class</th><th>Dramagician</th><th>Status</th><th>Time</th><th>Session</th>";
  }

  const sheetHeading = document.querySelector("#sheetPanel .section-heading h2");
  const sheetSubtext = document.querySelector("#sheetPanel .section-heading p:not(.eyebrow)");

  if (readOnly) {
    const child = getSelectedAttendanceChild();
    if (sheetHeading) sheetHeading.textContent = child?.name ? `${child.name}'s Attendance History` : "Attendance History";
    if (sheetSubtext) sheetSubtext.textContent = "Every saved session appears here automatically.";
    if (exportSheetCsvBtn) exportSheetCsvBtn.classList.add("hidden");
  } else {
    if (sheetHeading) sheetHeading.textContent = "Class attendance by day";
    if (sheetSubtext) sheetSubtext.textContent = "Choose the class, available course day, and session to view the full attendance sheet.";
    if (exportSheetCsvBtn) exportSheetCsvBtn.classList.remove("hidden");
  }

  const rows = await buildAttendanceSheetRows();
  const present = rows.filter((row) => row.status === "present").length;
  const late = rows.filter((row) => row.status === "late").length;
  const absent = rows.filter((row) => row.status === "absent").length;

  if (sheetPresentCount) sheetPresentCount.textContent = present;
  if (sheetLateCount) sheetLateCount.textContent = late;
  if (sheetAbsentCount) sheetAbsentCount.textContent = absent;
  if (sheetTotalCount) sheetTotalCount.textContent = rows.length;

  if (!rows.length) {
    attendanceSheetBody.innerHTML = `
      <tr>
        <td colspan="${readOnly ? 6 : 5}" class="sheet-empty">${readOnly ? "No attendance records have been published for this Dramagician yet." : "No Dramagicians found for this class."}</td>
      </tr>
    `;
    return;
  }

  attendanceSheetBody.innerHTML = rows.map((row) => {
    const readOnlyDateCell = readOnly ? `<td>${clean(row.date ? formatSheetDateLabel(row.date).replace("Today • ", "") : "—")}</td>` : "";
    return `
      <tr>
        ${readOnlyDateCell}
        <td>Class ${clean(row.classLetter)}</td>
        <td>${clean(row.studentName)}</td>
        <td><span class="status-badge status-${clean(row.status)}">${statusLabel(row.status)}</span></td>
        <td>${row.time ? clean(formatTime(row.time)) : "—"}</td>
        <td>Session ${clean(row.sessionNumber)}</td>
      </tr>
    `;
  }).join("");
}

async function renderEverything() {
  configureChildAttendanceView();
  await renderOfflineReady();
  configureChildAttendanceView();

  if (isAttendanceReadOnlyViewer()) {
    switchTab("sheet");
    await renderAttendanceSheet();
    return;
  }

  await renderStudentPicker();
  await renderAttendanceList();
  await populateSheetDateOptions();
  await renderAttendanceSheet();
  await renderQueueList();
}


/* =====================================================
   DRAMAGIC FIX — Fixed late rule + point deductions
   Wordle is intentionally not connected to this points system.
===================================================== */
var DRAMAGIC_LATE_GRACE_MINUTES = 15;
var DRAMAGIC_LATE_BASE_DEDUCTION = 3;
var DRAMAGIC_LATE_EXTRA_STEP_MINUTES = 5;
var DRAMAGIC_ATTENDANCE_POINTS_KEY = "dramagic_attendance_point_adjustments";

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    activeClass = saved.activeClass || "A";
    activeSessionNumber = saved.activeSessionNumber || 1;
    activeStartTime = saved.activeStartTime || "17:00";
    activeSessionDate = saved.activeSessionDate || getTodayDateValue();
  } catch {
    activeClass = "A";
    activeSessionNumber = 1;
    activeStartTime = "17:00";
    activeSessionDate = getTodayDateValue();
  }

  activeLateAfter = DRAMAGIC_LATE_GRACE_MINUTES;

  if (classSelect) classSelect.value = activeClass;
  if (sessionInput) sessionInput.value = activeSessionNumber;
  if (startTimeInput) startTimeInput.value = activeStartTime;
  if (sessionDateInput) sessionDateInput.value = activeSessionDate;
  if (lateAfterSelect) lateAfterSelect.value = String(DRAMAGIC_LATE_GRACE_MINUTES);
  updateSessionId();
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    activeClass,
    activeSessionNumber,
    activeStartTime,
    activeSessionDate,
    activeLateAfter: DRAMAGIC_LATE_GRACE_MINUTES
  }));
}

function getLateMinutes(now = new Date()) {
  const [hour, minute] = String(activeStartTime || "17:00").split(":").map(Number);
  const classStart = new Date(now);
  classStart.setHours(hour || 0, minute || 0, 0, 0);
  return Math.max(0, Math.floor((now.getTime() - classStart.getTime()) / 60000));
}

function isLate(now) {
  return getLateMinutes(now) > DRAMAGIC_LATE_GRACE_MINUTES;
}

function calculateLateDeduction(lateMinutes) {
  const minutes = Number(lateMinutes || 0);
  if (minutes <= DRAMAGIC_LATE_GRACE_MINUTES) return 0;
  return DRAMAGIC_LATE_BASE_DEDUCTION + Math.floor((minutes - DRAMAGIC_LATE_GRACE_MINUTES - 1) / DRAMAGIC_LATE_EXTRA_STEP_MINUTES);
}

function readExcuseState() {
  const excusedToggle = document.getElementById("attendanceExcusedToggle");
  const reasonInput = document.getElementById("attendanceExcuseReason");
  return {
    excused: Boolean(excusedToggle && excusedToggle.checked),
    reason: reasonInput ? reasonInput.value.trim() : ""
  };
}

function updateLateDeductionPreview() {
  const box = document.getElementById("lateDeductionPreview");
  if (!box) return;

  const now = new Date();
  const lateMinutes = getLateMinutes(now);
  const autoStatus = pendingAttendanceStatus === "absent"
    ? "absent"
    : (pendingAttendanceStatus === "late" || lateMinutes > DRAMAGIC_LATE_GRACE_MINUTES ? "late" : "present");
  const { excused } = readExcuseState();
  const deduction = autoStatus === "late" && !excused ? calculateLateDeduction(lateMinutes) : 0;

  box.classList.remove("good", "bad");

  if (autoStatus === "absent") {
    box.textContent = "Absent is saved without automatic late deduction. Add a note if needed.";
    return;
  }

  if (autoStatus === "present") {
    box.classList.add("good");
    box.textContent = `Within the 15-minute grace period. No late deduction. (${lateMinutes} min after start)`;
    return;
  }

  if (excused) {
    box.classList.add("good");
    box.textContent = `Late by ${lateMinutes} min, but marked excused. No points deducted.`;
    return;
  }

  box.classList.add("bad");
  box.textContent = `Late by ${lateMinutes} min. Automatic deduction: -${deduction} point${deduction === 1 ? "" : "s"}.`;
}

function setPendingAttendanceStatus(status) {
  pendingAttendanceStatus = ["present", "late", "absent"].includes(status) ? status : "present";

  if (quickStatusButtons) {
    quickStatusButtons.querySelectorAll("[data-status]").forEach((button) => {
      button.classList.toggle("active", button.dataset.status === pendingAttendanceStatus);
    });
  }

  const now = new Date();
  const lateMinutes = getLateMinutes(now);
  const autoStatus = pendingAttendanceStatus === "absent"
    ? "absent"
    : (pendingAttendanceStatus === "late" || lateMinutes > DRAMAGIC_LATE_GRACE_MINUTES ? "late" : "present");

  if (pendingAttendanceHint) {
    const autoText = autoStatus !== pendingAttendanceStatus && pendingAttendanceStatus === "present"
      ? " This will be saved as Late because it is after the 15-minute grace period."
      : "";
    pendingAttendanceHint.textContent = `Selected status: ${capitalize(pendingAttendanceStatus)}.${autoText} Press save to confirm.`;
  }

  updateLateDeductionPreview();
}

async function saveSelectedAttendance() {
  const studentId = studentPicker ? studentPicker.value : "";

  if (!studentId) {
    showLastScan("Choose a Dramagician", "Select a name first, choose a status, then press Save Attendance.", "warn");
    return;
  }

  await markStudentById(studentId, pendingAttendanceStatus);
}

async function markStudentById(studentId, mode) {
  updateSessionId();

  const students = await getAllStudents();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    showLastScan("Unknown Dramagician", "This name is not in the offline student list.", "bad");
    return;
  }

  if (student.classLetter !== activeClass) {
    showLastScan(student.full_name, `Wrong class. This Dramagician belongs to Class ${student.classLetter}.`, "bad");
    return;
  }

  const now = new Date();
  const lateMinutes = getLateMinutes(now);
  const requestedStatus = ["present", "late", "absent"].includes(mode) ? mode : "present";
  const status = requestedStatus === "absent"
    ? "absent"
    : (requestedStatus === "late" || lateMinutes > DRAMAGIC_LATE_GRACE_MINUTES ? "late" : "present");
  const { excused, reason } = readExcuseState();
  const rawDeduction = status === "late" ? calculateLateDeduction(lateMinutes) : 0;
  const deductedPoints = excused ? 0 : rawDeduction;
  const pointDelta = deductedPoints ? -deductedPoints : 0;

  const record = {
    id: `${activeSessionId}_${student.id}`,
    sessionId: activeSessionId,
    classLetter: activeClass,
    sessionNumber: activeSessionNumber,
    studentId: student.id,
    studentCode: student.code,
    studentName: student.full_name,
    status,
    scannedAt: now.toISOString(),
    arrivalTime: now.toISOString(),
    lateMinutes: status === "late" ? lateMinutes : 0,
    deductedPoints,
    pointDelta,
    excused: Boolean(excused),
    deductionReason: reason,
    synced: 0,
    markedBy: "teacher-local",
    method: "name"
  };

  await saveAttendanceRecord(record);
  saveAttendancePointAdjustment(record);

  const pointsText = pointDelta ? ` • ${pointDelta} pts` : (record.excused ? " • excused" : " • no deduction");
  showLastScan(student.full_name, `Class ${activeClass} • ${status.toUpperCase()} • ${formatTime(record.scannedAt)}${pointsText}`, status === "absent" ? "warn" : "good");
  await renderEverything();
}

function readAttendancePointAdjustments() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAMAGIC_ATTENDANCE_POINTS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveAttendancePointAdjustments(list) {
  localStorage.setItem(DRAMAGIC_ATTENDANCE_POINTS_KEY, JSON.stringify(Array.isArray(list) ? list : []));
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: DRAMAGIC_ATTENDANCE_POINTS_KEY }));
  } catch {
    window.dispatchEvent(new Event("dramagicPointsChanged"));
  }
}

function saveAttendancePointAdjustment(record) {
  const list = readAttendancePointAdjustments().filter((item) => item.recordId !== record.id);

  if (record.pointDelta) {
    list.push({
      recordId: record.id,
      studentId: record.studentId || "",
      studentCode: record.studentCode || "",
      studentName: record.studentName || "",
      classLetter: record.classLetter || "",
      sessionNumber: record.sessionNumber || 1,
      date: getRecordDate(record),
      pointDelta: Number(record.pointDelta || 0),
      reason: record.deductionReason || `Late by ${record.lateMinutes || 0} minutes`,
      source: "attendance"
    });
  }

  saveAttendancePointAdjustments(list);
}

function removeAttendancePointAdjustment(recordId) {
  const list = readAttendancePointAdjustments().filter((item) => item.recordId !== recordId);
  saveAttendancePointAdjustments(list);
}

async function deleteAttendanceRecord(sessionId, studentId) {
  const id = `${sessionId}_${studentId}`;
  removeAttendancePointAdjustment(id);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["attendance"], "readwrite");
    const request = tx.objectStore("attendance").delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function renderAttendanceList() {
  if (!attendanceList) return;

  const students = (await getAllStudents())
    .filter((student) => student.classLetter === activeClass)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
  const records = await getRecordsForSession(activeSessionId);
  const byStudent = new Map(records.map((record) => [record.studentId, record]));

  let visible = students;
  if (studentSearchTerm) {
    visible = visible.filter((student) => {
      const haystack = `${student.full_name} ${student.code}`.toLowerCase();
      return haystack.includes(studentSearchTerm);
    });
  }

  const present = students.filter((student) => byStudent.get(student.id)?.status === "present").length;
  const late = students.filter((student) => byStudent.get(student.id)?.status === "late").length;
  const absent = Math.max(students.length - present - late, 0);

  if (presentCount) presentCount.textContent = present;
  if (lateCount) lateCount.textContent = late;
  if (absentCount) absentCount.textContent = absent;
  if (totalCount) totalCount.textContent = students.length;

  if (!students.length) {
    attendanceList.innerHTML = `
      <div class="queue-card">
        <h2>No Dramagicians prepared yet</h2>
        <p>Tap “Prepare Student List” first.</p>
      </div>
    `;
    return;
  }

  attendanceList.innerHTML = visible.map((student) => {
    const record = byStudent.get(student.id);
    const status = record?.status || "absent";
    const time = record ? formatTime(record.scannedAt) : "Not marked yet";
    const pointsLabel = record?.pointDelta ? `${record.pointDelta} pts` : (record?.excused ? "Excused" : "No deduction");
    const pointsClass = record?.pointDelta ? "penalty" : (record?.excused ? "excused" : "");
    const extraLine = record
      ? `${record.status === "late" ? `${record.lateMinutes || 0} min late • ` : ""}${record.deductionReason ? clean(record.deductionReason) : pointsLabel}`
      : "Not marked yet";

    return `
      <article class="student-row">
        <div class="student-avatar">${clean(student.full_name.charAt(0))}</div>
        <div class="student-main">
          <strong>${clean(student.full_name)}</strong>
          <span>Class ${clean(student.classLetter)} • ${clean(time)}</span>
          <div class="attendance-extra-line">${extraLine}</div>
        </div>
        <div class="student-actions" data-student-id="${clean(student.id)}" data-current-status="${clean(status)}" data-excused="${record?.excused ? "1" : "0"}" data-reason="${clean(record?.deductionReason || "")}" data-arrival-time="${clean(record?.scannedAt || "")}" data-late-minutes="${clean(record?.lateMinutes || 0)}">
          <span class="status-badge status-${clean(status)}">${statusLabel(status)}</span>
          ${record ? `<span class="points-badge ${pointsClass}">${clean(pointsLabel)}</span>` : ""}
          <button type="button" class="action-btn select-action">Select</button>
        </div>
      </article>
    `;
  }).join("");

  attendanceList.querySelectorAll("[data-student-id] button").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-student-id]");
      const studentId = row.dataset.studentId;
      const currentStatus = row.dataset.currentStatus || "present";
      const excusedToggle = document.getElementById("attendanceExcusedToggle");
      const reasonInput = document.getElementById("attendanceExcuseReason");

      if (studentPicker) studentPicker.value = studentId;
      if (excusedToggle) excusedToggle.checked = row.dataset.excused === "1";
      if (reasonInput) reasonInput.value = row.dataset.reason || "";
      setPendingAttendanceStatus(currentStatus === "absent" ? "absent" : currentStatus);
      if (studentPicker) studentPicker.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

async function buildAttendanceSheetRows() {
  if (isAttendanceReadOnlyViewer()) {
    const child = getSelectedAttendanceChild();
    if (!child) return [];

    const wantedCode = String(child.code || child.studentId || "").trim().toUpperCase();
    const wantedName = String(child.name || "").trim().toLowerCase();
    const wantedClass = String(child.classLetter || "").trim().toUpperCase();
    const allStudents = await getAllStudents();
    const matchedStudent = allStudents.find((student) => {
      const studentCodeMatches = wantedCode && (String(student.code || "").toUpperCase() === wantedCode || String(student.id || "").toUpperCase() === wantedCode);
      const studentNameMatches = wantedName && String(student.full_name || "").toLowerCase() === wantedName;
      const studentClassMatches = !wantedClass || String(student.classLetter || "").toUpperCase() === wantedClass;
      return studentClassMatches && ((studentCodeMatches && (!wantedName || studentNameMatches)) || studentNameMatches);
    });

    const records = await getAllAttendanceRecords();
    const rows = records.filter((record) => {
      const recordCode = String(record.studentCode || "").toUpperCase();
      const recordId = String(record.studentId || "").toUpperCase();
      const recordName = String(record.studentName || "").toLowerCase();
      const recordClass = String(record.classLetter || "").toUpperCase();
      const nameIsCompatible = !wantedName || !recordName || recordName === wantedName;
      const classIsCompatible = !wantedClass || !recordClass || recordClass === wantedClass;

      if (!nameIsCompatible || !classIsCompatible) return false;
      if (matchedStudent && record.studentId === matchedStudent.id) return true;
      if (wantedCode && (recordCode === wantedCode || recordId === wantedCode)) return true;
      return Boolean(wantedName && recordName === wantedName);
    });

    return rows.sort((a, b) => String(b.scannedAt || "").localeCompare(String(a.scannedAt || ""))).map((record) => ({
      date: getRecordDate(record),
      classLetter: record.classLetter || child.classLetter || "",
      studentName: record.studentName || matchedStudent?.full_name || child.name || "Dramagician",
      studentId: record.studentId || matchedStudent?.id || child.studentId || "",
      status: record.status || "absent",
      time: record.scannedAt || "",
      sessionNumber: record.sessionNumber || 1,
      lateMinutes: Number(record.lateMinutes || 0),
      deductedPoints: Number(record.deductedPoints || 0),
      pointDelta: Number(record.pointDelta || 0),
      excused: Boolean(record.excused),
      deductionReason: record.deductionReason || ""
    }));
  }

  const selectedClass = sheetClassSelect ? sheetClassSelect.value : activeClass;
  const selectedDate = sheetDateInput && sheetDateInput.value ? sheetDateInput.value : (activeSessionDate || getTodayDateValue());
  const selectedSession = Number(sheetSessionInput && sheetSessionInput.value ? sheetSessionInput.value : activeSessionNumber || 1);

  const allStudents = (await getAllStudents()).sort((a, b) => {
    if (a.classLetter !== b.classLetter) return a.classLetter.localeCompare(b.classLetter);
    return a.full_name.localeCompare(b.full_name);
  });

  const students = allStudents.filter((student) => selectedClass === "all" || student.classLetter === selectedClass);
  const recordsById = new Map();

  for (const classLetter of ["A", "B", "C", "D", "E", "F"]) {
    if (selectedClass !== "all" && selectedClass !== classLetter) continue;
    const sessionId = `${selectedDate}_CLASS_${classLetter}_SESSION_${selectedSession}`;
    const records = await getRecordsForSession(sessionId);
    records.forEach((record) => recordsById.set(record.studentId, record));
  }

  return students.map((student) => {
    const record = recordsById.get(student.id);
    return {
      date: selectedDate,
      classLetter: student.classLetter,
      studentName: student.full_name,
      studentId: student.id,
      status: record?.status || "absent",
      time: record?.scannedAt || "",
      sessionNumber: selectedSession,
      lateMinutes: Number(record?.lateMinutes || 0),
      deductedPoints: Number(record?.deductedPoints || 0),
      pointDelta: Number(record?.pointDelta || 0),
      excused: Boolean(record?.excused),
      deductionReason: record?.deductionReason || ""
    };
  });
}

async function renderAttendanceSheet() {
  if (!attendanceSheetBody) return;

  const tableHeadRow = document.querySelector(".attendance-sheet-table thead tr");
  const readOnly = isAttendanceReadOnlyViewer();

  if (!readOnly && sheetDateInput && !sheetDateInput.options.length && !isUpdatingSheetDates) {
    await populateSheetDateOptions();
  }

  if (tableHeadRow) {
    tableHeadRow.innerHTML = readOnly
      ? "<th>Date</th><th>Class</th><th>Dramagician</th><th>Status</th><th>Time</th><th>Session</th><th>Points</th><th>Note</th>"
      : "<th>Class</th><th>Dramagician</th><th>Status</th><th>Time</th><th>Session</th><th>Late</th><th>Points</th><th>Note</th>";
  }

  const sheetHeading = document.querySelector("#sheetPanel .section-heading h2");
  const sheetSubtext = document.querySelector("#sheetPanel .section-heading p:not(.eyebrow)");

  if (readOnly) {
    const child = getSelectedAttendanceChild();
    if (sheetHeading) sheetHeading.textContent = child?.name ? `${child.name}'s Attendance History` : "Attendance History";
    if (sheetSubtext) sheetSubtext.textContent = "Every saved session appears here automatically.";
    if (exportSheetCsvBtn) exportSheetCsvBtn.classList.add("hidden");
  } else {
    if (sheetHeading) sheetHeading.textContent = "Class attendance by day";
    if (sheetSubtext) sheetSubtext.textContent = "Choose the class, available course day, and session to view the full attendance sheet.";
    if (exportSheetCsvBtn) exportSheetCsvBtn.classList.remove("hidden");
  }

  const rows = await buildAttendanceSheetRows();
  const present = rows.filter((row) => row.status === "present").length;
  const late = rows.filter((row) => row.status === "late").length;
  const absent = rows.filter((row) => row.status === "absent").length;

  if (sheetPresentCount) sheetPresentCount.textContent = present;
  if (sheetLateCount) sheetLateCount.textContent = late;
  if (sheetAbsentCount) sheetAbsentCount.textContent = absent;
  if (sheetTotalCount) sheetTotalCount.textContent = rows.length;

  const colSpan = readOnly ? 8 : 8;
  if (!rows.length) {
    attendanceSheetBody.innerHTML = `
      <tr>
        <td colspan="${colSpan}" class="sheet-empty">${readOnly ? "No attendance records have been published for this Dramagician yet." : "No Dramagicians found for this class."}</td>
      </tr>
    `;
    return;
  }

  attendanceSheetBody.innerHTML = rows.map((row) => {
    const readOnlyDateCell = readOnly ? `<td>${clean(row.date ? formatSheetDateLabel(row.date).replace("Today • ", "") : "—")}</td>` : "";
    const lateCell = readOnly ? "" : `<td>${row.status === "late" ? `${clean(row.lateMinutes || 0)} min` : "—"}</td>`;
    const pointText = row.pointDelta ? `${row.pointDelta} pts` : (row.excused ? "Excused" : "—");
    const pointClass = row.pointDelta ? "penalty" : (row.excused ? "excused" : "");
    const noteText = row.deductionReason || (row.status === "late" && row.lateMinutes ? `Late by ${row.lateMinutes} min` : "—");
    return `
      <tr>
        ${readOnlyDateCell}
        <td>Class ${clean(row.classLetter)}</td>
        <td>${clean(row.studentName)}</td>
        <td><span class="status-badge status-${clean(row.status)}">${statusLabel(row.status)}</span></td>
        <td>${row.time ? clean(formatTime(row.time)) : "—"}</td>
        <td>Session ${clean(row.sessionNumber)}</td>
        ${lateCell}
        <td><span class="points-badge ${pointClass}">${clean(pointText)}</span></td>
        <td>${clean(noteText)}</td>
      </tr>
    `;
  }).join("");
}

async function exportAttendanceSheetCsv() {
  const rows = await buildAttendanceSheetRows();
  const selectedClass = sheetClassSelect ? sheetClassSelect.value : activeClass;
  const selectedDate = sheetDateInput && sheetDateInput.value ? sheetDateInput.value : (activeSessionDate || getTodayDateValue());
  const selectedSession = sheetSessionInput && sheetSessionInput.value ? sheetSessionInput.value : activeSessionNumber;
  const header = ["date", "class", "session", "student_id", "student_name", "status", "time", "late_minutes", "point_delta", "excused", "reason"];
  const csvRows = [header].concat(rows.map((row) => [
    row.date || selectedDate,
    row.classLetter,
    row.sessionNumber || selectedSession,
    row.studentId,
    row.studentName,
    row.status,
    row.time ? formatTime(row.time) : "",
    row.lateMinutes || 0,
    row.pointDelta || 0,
    row.excused ? "yes" : "no",
    row.deductionReason || ""
  ]));
  const csv = csvRows.map((cells) => cells.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dramagic-attendance-sheet-${selectedClass}-session-${selectedSession}-${selectedDate}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

document.addEventListener("DOMContentLoaded", function () {
  const excusedToggle = document.getElementById("attendanceExcusedToggle");
  const reasonInput = document.getElementById("attendanceExcuseReason");
  if (excusedToggle) excusedToggle.addEventListener("change", updateLateDeductionPreview);
  if (reasonInput) reasonInput.addEventListener("input", updateLateDeductionPreview);
  updateLateDeductionPreview();
});

/* =====================================================
   DRAMAGIC FIX — Automatic mark only + editable excuse
   Teacher chooses only the Dramagician. The system decides
   Present/Late from the fixed 15-minute rule. Unmarked = Absent.
===================================================== */
function getAutoAttendanceStatusForNow(now = new Date()) {
  return getLateMinutes(now) > DRAMAGIC_LATE_GRACE_MINUTES ? "late" : "present";
}

function setPendingAttendanceStatus() {
  pendingAttendanceStatus = "auto";

  if (quickStatusButtons) {
    quickStatusButtons.querySelectorAll("[data-status]").forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("tabindex", "-1");
    });
  }

  if (pendingAttendanceHint) {
    pendingAttendanceHint.textContent = "Automatic status: Save now to mark Present or Late. Any Dramagician you do not save remains Absent.";
  }

  updateLateDeductionPreview();
}

function updateLateDeductionPreview() {
  const box = document.getElementById("lateDeductionPreview");
  if (!box) return;

  const { excused } = readExcuseState();
  box.classList.remove("good", "bad");

  if (selectedAttendanceEditRecord && selectedAttendanceEditRecord.arrivalTime) {
    const savedStatus = selectedAttendanceEditRecord.status || "present";
    const savedLateMinutes = Number(selectedAttendanceEditRecord.lateMinutes || 0);

    if (savedStatus === "late") {
      const deduction = excused ? 0 : calculateLateDeduction(savedLateMinutes);
      box.classList.add(excused ? "good" : "bad");
      box.textContent = excused
        ? `Editing saved arrival: Late by ${savedLateMinutes} min at ${formatTime(selectedAttendanceEditRecord.arrivalTime)}, but excused. No points deducted.`
        : `Editing saved arrival: Late by ${savedLateMinutes} min at ${formatTime(selectedAttendanceEditRecord.arrivalTime)}. Deduction stays -${deduction} point${deduction === 1 ? "" : "s"}.`;
      return;
    }

    box.classList.add("good");
    box.textContent = `Editing saved arrival: Present at ${formatTime(selectedAttendanceEditRecord.arrivalTime)}. The original arrival time will not change.`;
    return;
  }

  const now = new Date();
  const lateMinutes = getLateMinutes(now);
  const autoStatus = getAutoAttendanceStatusForNow(now);
  const deduction = autoStatus === "late" && !excused ? calculateLateDeduction(lateMinutes) : 0;

  if (autoStatus === "present") {
    box.classList.add("good");
    box.textContent = `If saved now: Present. Within the 15-minute grace period. No deduction. (${lateMinutes} min after start)`;
    return;
  }

  if (excused) {
    box.classList.add("good");
    box.textContent = `If saved now: Late by ${lateMinutes} min, but excused. No points deducted.`;
    return;
  }

  box.classList.add("bad");
  box.textContent = `If saved now: Late by ${lateMinutes} min. Automatic deduction: -${deduction} point${deduction === 1 ? "" : "s"}.`;
}

async function getExistingRecordForStudentInActiveSession(studentId) {
  updateSessionId();
  if (!db || !studentId) return null;
  try {
    const records = await getRecordsForSession(activeSessionId);
    return records.find((record) => record.studentId === studentId) || null;
  } catch {
    return null;
  }
}

async function saveSelectedAttendance() {
  const studentId = studentPicker ? studentPicker.value : "";

  if (!studentId) {
    showLastScan("Choose a Dramagician", "Select a name, then press Save Attendance.", "warn");
    return;
  }

  await markStudentById(studentId, "auto");
}

async function markStudentById(studentId, mode = "auto") {
  updateSessionId();

  const students = await getAllStudents();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    showLastScan("Unknown Dramagician", "This name is not in the offline student list.", "bad");
    return;
  }

  if (student.classLetter !== activeClass) {
    showLastScan(student.full_name, `Wrong class. This Dramagician belongs to Class ${student.classLetter}.`, "bad");
    return;
  }

  const now = new Date();
  const existingRecord = await getExistingRecordForStudentInActiveSession(studentId);
  const isEditingExistingRecord = Boolean(existingRecord);
  const originalTime = existingRecord?.scannedAt || existingRecord?.arrivalTime || now.toISOString();
  const originalDate = originalTime ? new Date(originalTime) : now;
  const savedLateMinutes = Number(existingRecord?.lateMinutes);
  const originalLateMinutes = existingRecord && Number.isFinite(savedLateMinutes)
    ? savedLateMinutes
    : (existingRecord?.status === "late" ? getLateMinutes(originalDate) : 0);
  const newLateMinutes = getLateMinutes(now);

  let status = existingRecord?.status || getAutoAttendanceStatusForNow(now);
  let lateMinutes = status === "late" ? (isEditingExistingRecord ? originalLateMinutes : newLateMinutes) : 0;

  // Only keep manually-created absent records absent. New saves never create absent records.
  if (!isEditingExistingRecord && mode === "absent") {
    status = "absent";
    lateMinutes = 0;
  }

  const { excused, reason } = readExcuseState();
  const rawDeduction = status === "late" ? calculateLateDeduction(lateMinutes) : 0;
  const deductedPoints = status === "late" && excused ? 0 : rawDeduction;
  const pointDelta = deductedPoints ? -deductedPoints : 0;

  const record = {
    ...(existingRecord || {}),
    id: `${activeSessionId}_${student.id}`,
    sessionId: activeSessionId,
    classLetter: activeClass,
    sessionNumber: activeSessionNumber,
    studentId: student.id,
    studentCode: student.code,
    studentName: student.full_name,
    status,
    scannedAt: isEditingExistingRecord ? originalTime : now.toISOString(),
    arrivalTime: isEditingExistingRecord ? originalTime : now.toISOString(),
    lateMinutes,
    deductedPoints,
    pointDelta,
    excused: Boolean(status === "late" && excused),
    deductionReason: reason,
    synced: 0,
    markedBy: existingRecord?.markedBy || "teacher-local",
    method: existingRecord?.method || "name",
    createdAt: existingRecord?.createdAt || now.toISOString(),
    updatedAt: isEditingExistingRecord ? now.toISOString() : ""
  };

  await saveAttendanceRecord(record);
  saveAttendancePointAdjustment(record);

  const pointsText = pointDelta ? ` • ${pointDelta} pts` : (record.excused ? " • excused" : " • no deduction");
  const actionText = isEditingExistingRecord ? "Updated" : "Saved";
  showLastScan(student.full_name, `${actionText}: Class ${activeClass} • ${status.toUpperCase()} • ${formatTime(record.scannedAt)}${pointsText}`, status === "absent" ? "warn" : "good");

  const excusedToggle = document.getElementById("attendanceExcusedToggle");
  const reasonInput = document.getElementById("attendanceExcuseReason");
  if (!isEditingExistingRecord) {
    if (excusedToggle) excusedToggle.checked = false;
    if (reasonInput) reasonInput.value = "";
  }

  selectedAttendanceEditRecord = isEditingExistingRecord ? {
    status: record.status,
    arrivalTime: record.scannedAt,
    lateMinutes: record.lateMinutes
  } : null;

  await renderEverything();
  updateLateDeductionPreview();
}

async function renderAttendanceList() {
  if (!attendanceList) return;

  const students = (await getAllStudents())
    .filter((student) => student.classLetter === activeClass)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
  const records = await getRecordsForSession(activeSessionId);
  const byStudent = new Map(records.map((record) => [record.studentId, record]));

  let visible = students;
  if (studentSearchTerm) {
    visible = visible.filter((student) => {
      const haystack = `${student.full_name} ${student.code}`.toLowerCase();
      return haystack.includes(studentSearchTerm);
    });
  }

  const present = students.filter((student) => byStudent.get(student.id)?.status === "present").length;
  const late = students.filter((student) => byStudent.get(student.id)?.status === "late").length;
  const absent = Math.max(students.length - present - late, 0);

  if (presentCount) presentCount.textContent = present;
  if (lateCount) lateCount.textContent = late;
  if (absentCount) absentCount.textContent = absent;
  if (totalCount) totalCount.textContent = students.length;

  if (!students.length) {
    attendanceList.innerHTML = `
      <div class="queue-card">
        <h2>No Dramagicians prepared yet</h2>
        <p>Tap “Prepare Student List” first.</p>
      </div>
    `;
    return;
  }

  attendanceList.innerHTML = visible.map((student) => {
    const record = byStudent.get(student.id);
    const status = record?.status || "absent";
    const time = record ? formatTime(record.scannedAt) : "Not marked yet";
    const pointsLabel = record?.pointDelta ? `${record.pointDelta} pts` : (record?.excused ? "Excused" : (record ? "No deduction" : "Absent"));
    const pointsClass = record?.pointDelta ? "penalty" : (record?.excused ? "excused" : "");
    const extraLine = record
      ? `${record.status === "late" ? `${record.lateMinutes || 0} min late • ` : ""}${record.deductionReason ? clean(record.deductionReason) : pointsLabel}`
      : "Not marked yet — will remain Absent unless saved.";

    return `
      <article class="student-row">
        <div class="student-avatar">${clean(student.full_name.charAt(0))}</div>
        <div class="student-main">
          <strong>${clean(student.full_name)}</strong>
          <span>Class ${clean(student.classLetter)} • ${clean(time)}</span>
          <div class="attendance-extra-line">${extraLine}</div>
        </div>
        <div class="student-actions" data-student-id="${clean(student.id)}" data-current-status="${clean(status)}" data-excused="${record?.excused ? "1" : "0"}" data-reason="${clean(record?.deductionReason || "")}">
          <span class="status-badge status-${clean(status)}">${statusLabel(status)}</span>
          <span class="points-badge ${pointsClass}">${clean(pointsLabel)}</span>
          <button type="button" class="action-btn select-action">${record ? "Edit" : "Select"}</button>
        </div>
      </article>
    `;
  }).join("");

  attendanceList.querySelectorAll("[data-student-id] button").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-student-id]");
      const studentId = row.dataset.studentId;
      const excusedToggle = document.getElementById("attendanceExcusedToggle");
      const reasonInput = document.getElementById("attendanceExcuseReason");

      if (studentPicker) studentPicker.value = studentId;
      if (excusedToggle) excusedToggle.checked = row.dataset.excused === "1";
      if (reasonInput) reasonInput.value = row.dataset.reason || "";
      selectedAttendanceEditRecord = row.dataset.arrivalTime ? {
        status: row.dataset.currentStatus || "present",
        arrivalTime: row.dataset.arrivalTime,
        lateMinutes: Number(row.dataset.lateMinutes || 0)
      } : null;
      setPendingAttendanceStatus("auto");
      if (studentPicker) studentPicker.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

if (studentPicker) {
  studentPicker.addEventListener("change", function () {
    selectedAttendanceEditRecord = null;
    setPendingAttendanceStatus("auto");
  });
}

/* =====================================================
   DRAMAGIC FIX — Editing attendance keeps original time
   Edit is now for excuse/reason/status data only. It will
   not refresh the saved arrival time to the current clock.
===================================================== */
function sameAttendanceCalendarDay(record, fallbackDate) {
  return getRecordDate(record) === fallbackDate;
}

async function getExistingRecordForStudentInActiveSession(studentId) {
  updateSessionId();
  if (!db || !studentId) return null;

  try {
    const records = await getRecordsForSession(activeSessionId);
    const exactRecord = records.find((record) => record.studentId === studentId);
    if (exactRecord) return exactRecord;
  } catch {
    // Fall back to the full record search below.
  }

  try {
    const allRecords = await getAllAttendanceRecords();
    const sessionDate = activeSessionDate || getTodayDateValue();
    return allRecords.find((record) => {
      return record.studentId === studentId
        && String(record.classLetter || "").toUpperCase() === String(activeClass || "").toUpperCase()
        && Number(record.sessionNumber || 1) === Number(activeSessionNumber || 1)
        && sameAttendanceCalendarDay(record, sessionDate);
    }) || null;
  } catch {
    return null;
  }
}

function getPreservedAttendanceTime(record, fallbackDate) {
  const savedTime = record?.scannedAt || record?.arrivalTime || record?.createdAt || "";
  if (savedTime && !Number.isNaN(new Date(savedTime).getTime())) return savedTime;
  return fallbackDate.toISOString();
}

async function markStudentById(studentId, mode = "auto") {
  updateSessionId();

  const students = await getAllStudents();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    showLastScan("Unknown Dramagician", "This name is not in the offline student list.", "bad");
    return;
  }

  if (student.classLetter !== activeClass) {
    showLastScan(student.full_name, `Wrong class. This Dramagician belongs to Class ${student.classLetter}.`, "bad");
    return;
  }

  const now = new Date();
  const existingRecord = await getExistingRecordForStudentInActiveSession(studentId);
  const isEditingExistingRecord = Boolean(existingRecord);
  const originalTime = getPreservedAttendanceTime(existingRecord, now);
  const originalDate = new Date(originalTime);
  const savedLateMinutes = Number(existingRecord?.lateMinutes);
  const originalStatus = existingRecord?.status || getAutoAttendanceStatusForNow(originalDate);
  const originalLateMinutes = existingRecord && Number.isFinite(savedLateMinutes)
    ? savedLateMinutes
    : (originalStatus === "late" ? getLateMinutes(originalDate) : 0);
  const newLateMinutes = getLateMinutes(now);

  let status = isEditingExistingRecord ? originalStatus : getAutoAttendanceStatusForNow(now);
  let lateMinutes = status === "late"
    ? (isEditingExistingRecord ? originalLateMinutes : newLateMinutes)
    : 0;

  if (!isEditingExistingRecord && mode === "absent") {
    status = "absent";
    lateMinutes = 0;
  }

  const { excused, reason } = readExcuseState();
  const rawDeduction = status === "late" ? calculateLateDeduction(lateMinutes) : 0;
  const deductedPoints = status === "late" && excused ? 0 : rawDeduction;
  const pointDelta = deductedPoints ? -deductedPoints : 0;
  const recordId = existingRecord?.id || `${activeSessionId}_${student.id}`;

  const record = {
    ...(existingRecord || {}),
    id: recordId,
    sessionId: existingRecord?.sessionId || activeSessionId,
    classLetter: activeClass,
    sessionNumber: activeSessionNumber,
    studentId: student.id,
    studentCode: student.code,
    studentName: student.full_name,
    status,
    scannedAt: isEditingExistingRecord ? originalTime : now.toISOString(),
    arrivalTime: isEditingExistingRecord ? originalTime : now.toISOString(),
    lateMinutes,
    deductedPoints,
    pointDelta,
    excused: Boolean(status === "late" && excused),
    deductionReason: reason,
    synced: 0,
    markedBy: existingRecord?.markedBy || "teacher-local",
    method: existingRecord?.method || "name",
    createdAt: existingRecord?.createdAt || now.toISOString(),
    updatedAt: isEditingExistingRecord ? now.toISOString() : ""
  };

  await saveAttendanceRecord(record);
  saveAttendancePointAdjustment(record);

  const pointsText = pointDelta ? ` • ${pointDelta} pts` : (record.excused ? " • excused" : " • no deduction");
  const actionText = isEditingExistingRecord ? "Updated without changing arrival time" : "Saved";
  showLastScan(student.full_name, `${actionText}: Class ${activeClass} • ${status.toUpperCase()} • ${formatTime(record.scannedAt)}${pointsText}`, status === "absent" ? "warn" : "good");

  const excusedToggle = document.getElementById("attendanceExcusedToggle");
  const reasonInput = document.getElementById("attendanceExcuseReason");
  if (!isEditingExistingRecord) {
    if (excusedToggle) excusedToggle.checked = false;
    if (reasonInput) reasonInput.value = "";
  }

  selectedAttendanceEditRecord = isEditingExistingRecord ? {
    status: record.status,
    arrivalTime: record.scannedAt,
    lateMinutes: record.lateMinutes
  } : null;

  await renderEverything();
  updateLateDeductionPreview();
}

async function renderAttendanceList() {
  if (!attendanceList) return;

  const students = (await getAllStudents())
    .filter((student) => student.classLetter === activeClass)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
  const records = await getRecordsForSession(activeSessionId);
  const byStudent = new Map(records.map((record) => [record.studentId, record]));

  let visible = students;
  if (studentSearchTerm) {
    visible = visible.filter((student) => {
      const haystack = `${student.full_name} ${student.code}`.toLowerCase();
      return haystack.includes(studentSearchTerm);
    });
  }

  const present = students.filter((student) => byStudent.get(student.id)?.status === "present").length;
  const late = students.filter((student) => byStudent.get(student.id)?.status === "late").length;
  const absent = Math.max(students.length - present - late, 0);

  if (presentCount) presentCount.textContent = present;
  if (lateCount) lateCount.textContent = late;
  if (absentCount) absentCount.textContent = absent;
  if (totalCount) totalCount.textContent = students.length;

  if (!students.length) {
    attendanceList.innerHTML = `
      <div class="queue-card">
        <h2>No Dramagicians prepared yet</h2>
        <p>Tap “Prepare Student List” first.</p>
      </div>
    `;
    return;
  }

  attendanceList.innerHTML = visible.map((student) => {
    const record = byStudent.get(student.id);
    const status = record?.status || "absent";
    const savedTime = record ? getPreservedAttendanceTime(record, new Date()) : "";
    const time = record ? formatTime(savedTime) : "Not marked yet";
    const pointsLabel = record?.pointDelta ? `${record.pointDelta} pts` : (record?.excused ? "Excused" : (record ? "No deduction" : "Absent"));
    const pointsClass = record?.pointDelta ? "penalty" : (record?.excused ? "excused" : "");
    const extraLine = record
      ? `${record.status === "late" ? `${record.lateMinutes || 0} min late • ` : ""}${record.deductionReason ? clean(record.deductionReason) : pointsLabel}`
      : "Not marked yet — will remain Absent unless saved.";

    return `
      <article class="student-row">
        <div class="student-avatar">${clean(student.full_name.charAt(0))}</div>
        <div class="student-main">
          <strong>${clean(student.full_name)}</strong>
          <span>Class ${clean(student.classLetter)} • ${clean(time)}</span>
          <div class="attendance-extra-line">${extraLine}</div>
        </div>
        <div class="student-actions" data-student-id="${clean(student.id)}" data-current-status="${clean(status)}" data-excused="${record?.excused ? "1" : "0"}" data-reason="${clean(record?.deductionReason || "")}" data-arrival-time="${clean(savedTime)}" data-late-minutes="${clean(record?.lateMinutes || 0)}">
          <span class="status-badge status-${clean(status)}">${statusLabel(status)}</span>
          <span class="points-badge ${pointsClass}">${clean(pointsLabel)}</span>
          <button type="button" class="action-btn select-action">${record ? "Edit" : "Select"}</button>
        </div>
      </article>
    `;
  }).join("");

  attendanceList.querySelectorAll("[data-student-id] button").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("[data-student-id]");
      const studentId = row.dataset.studentId;
      const excusedToggle = document.getElementById("attendanceExcusedToggle");
      const reasonInput = document.getElementById("attendanceExcuseReason");

      if (studentPicker) studentPicker.value = studentId;
      if (excusedToggle) excusedToggle.checked = row.dataset.excused === "1";
      if (reasonInput) reasonInput.value = row.dataset.reason || "";
      selectedAttendanceEditRecord = row.dataset.arrivalTime ? {
        status: row.dataset.currentStatus || "present",
        arrivalTime: row.dataset.arrivalTime,
        lateMinutes: Number(row.dataset.lateMinutes || 0)
      } : null;
      setPendingAttendanceStatus("auto");
      if (studentPicker) studentPicker.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}
