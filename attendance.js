/* =====================================================
   DRAMAGIC OFFLINE QR ATTENDANCE DEMO
   - Works as a PWA when hosted on HTTPS/localhost.
   - Saves attendance locally first.
   - Sync button is demo-only and marks records as synced.
   - Later: replace demoSyncToSupabase() with real Supabase insert/upsert.
===================================================== */

const DEMO_STUDENTS = [
  { id: "stu-a-001", code: "DRG-A-001-X9K2", full_name: "Adam Youssef", classLetter: "A" },
  { id: "stu-a-002", code: "DRG-A-002-L4P7", full_name: "Lina Mostafa", classLetter: "A" },
  { id: "stu-a-003", code: "DRG-A-003-Q8M1", full_name: "Youssef Karim", classLetter: "A" },
  { id: "stu-a-004", code: "DRG-A-004-T6R3", full_name: "Malak Samir", classLetter: "A" },
  { id: "stu-a-005", code: "DRG-A-005-Z2B9", full_name: "Seif Tamer", classLetter: "A" },
  { id: "stu-a-006", code: "DRG-A-006-N5C8", full_name: "Nour Ahmed", classLetter: "A" },
  { id: "stu-b-001", code: "DRG-B-001-A7K5", full_name: "Mariam Ali", classLetter: "B" },
  { id: "stu-b-002", code: "DRG-B-002-P3D6", full_name: "Omar Hassan", classLetter: "B" },
  { id: "stu-b-003", code: "DRG-B-003-W9S4", full_name: "Hana Adel", classLetter: "B" },
  { id: "stu-b-004", code: "DRG-B-004-C2V8", full_name: "Yassin Hany", classLetter: "B" },
  { id: "stu-b-005", code: "DRG-B-005-M6Q1", full_name: "Jana Emad", classLetter: "B" },
  { id: "stu-b-006", code: "DRG-B-006-F5N2", full_name: "Ali Tarek", classLetter: "B" },
  { id: "stu-c-001", code: "DRG-C-001-R8Y6", full_name: "Nour Ahmed", classLetter: "C" },
  { id: "stu-c-002", code: "DRG-C-002-H4L9", full_name: "Malak Samir", classLetter: "C" },
  { id: "stu-c-003", code: "DRG-C-003-S7A1", full_name: "Kareem Omar", classLetter: "C" },
  { id: "stu-c-004", code: "DRG-C-004-D3T5", full_name: "Farida Wael", classLetter: "C" },
  { id: "stu-c-005", code: "DRG-C-005-J9P2", full_name: "Youssef Sameh", classLetter: "C" },
  { id: "stu-c-006", code: "DRG-C-006-G1X7", full_name: "Leila Amr", classLetter: "C" },
  { id: "stu-d-001", code: "DRG-D-001-K6U3", full_name: "Seif Tamer", classLetter: "D" },
  { id: "stu-d-002", code: "DRG-D-002-V2E8", full_name: "Salma Khaled", classLetter: "D" },
  { id: "stu-d-003", code: "DRG-D-003-B9R4", full_name: "Ziad Mostafa", classLetter: "D" },
  { id: "stu-d-004", code: "DRG-D-004-L1M7", full_name: "Kenzy Ahmed", classLetter: "D" },
  { id: "stu-d-005", code: "DRG-D-005-P8C2", full_name: "Amir Hossam", classLetter: "D" },
  { id: "stu-d-006", code: "DRG-D-006-X4Q9", full_name: "Laila Fares", classLetter: "D" }
];

const DB_NAME = "dramagic_attendance_demo_db_v7_safe_sync";
const DB_VERSION = 1;
const SETTINGS_KEY = "dramagic_attendance_settings";

let db = null;
let activeClass = "A";
let activeSessionNumber = 1;
let activeStartTime = "17:00";
let activeLateAfter = 15;
let activeSessionId = "";
let studentSearchTerm = "";
let scanStream = null;
let detector = null;
let scanLoopActive = false;
let lastScannedCode = "";
let lastScannedAt = 0;

const classSelect = document.getElementById("classSelect");
const sessionInput = document.getElementById("sessionInput");
const startTimeInput = document.getElementById("startTimeInput");
const lateAfterSelect = document.getElementById("lateAfterSelect");
const prepareBtn = document.getElementById("prepareBtn");
const startSessionBtn = document.getElementById("startSessionBtn");
const syncBtn = document.getElementById("syncBtn");
const resetSessionBtn = document.getElementById("resetSessionBtn");
const connectionPill = document.getElementById("connectionPill");
const offlineReadyPill = document.getElementById("offlineReadyPill");
const syncPill = document.getElementById("syncPill");
const scannerVideo = document.getElementById("scannerVideo");
const scanOverlay = document.getElementById("scanOverlay");
const scanBtn = document.getElementById("scanBtn");
const stopScanBtn = document.getElementById("stopScanBtn");
const scannerMessage = document.getElementById("scannerMessage");
const manualCodeInput = document.getElementById("manualCodeInput");
const manualScanBtn = document.getElementById("manualScanBtn");
const sampleButtons = document.getElementById("sampleButtons");
const lastScanCard = document.getElementById("lastScanCard");
const studentSearchInput = document.getElementById("studentSearchInput");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const attendanceList = document.getElementById("attendanceList");
const presentCount = document.getElementById("presentCount");
const lateCount = document.getElementById("lateCount");
const absentCount = document.getElementById("absentCount");
const totalCount = document.getElementById("totalCount");
const queueList = document.getElementById("queueList");

init();

async function init() {
  registerServiceWorker();
  restoreSettings();
  bindEvents();
  updateConnectionPill();

  try {
    db = await openAttendanceDB();
    await renderEverything();
  } catch (error) {
    console.error(error);
    showScannerMessage("Could not open offline database. Try another browser or clear site data.", "bad");
  }
}

function bindEvents() {
  window.addEventListener("online", updateConnectionPill);
  window.addEventListener("offline", updateConnectionPill);

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  classSelect.addEventListener("change", async () => {
    activeClass = classSelect.value;
    saveSettings();
    updateSessionId();
    renderEverything();
  });

  sessionInput.addEventListener("change", async () => {
    activeSessionNumber = Number(sessionInput.value || 1);
    saveSettings();
    updateSessionId();
    renderEverything();
  });

  startTimeInput.addEventListener("change", () => {
    activeStartTime = startTimeInput.value || "17:00";
    saveSettings();
  });

  lateAfterSelect.addEventListener("change", () => {
    activeLateAfter = Number(lateAfterSelect.value || 15);
    saveSettings();
  });

  prepareBtn.addEventListener("click", prepareOfflineAttendance);
  startSessionBtn.addEventListener("click", async () => {
    updateSessionId();
    await renderEverything();
    showLastScan(`Class ${activeClass} Session ${activeSessionNumber}`, "Session is open. Scan QR codes or use manual entry.", "good");
  });

  syncBtn.addEventListener("click", demoSyncToSupabase);
  resetSessionBtn.addEventListener("click", resetCurrentSession);
  scanBtn.addEventListener("click", startCameraScanner);
  stopScanBtn.addEventListener("click", stopCameraScanner);
  manualScanBtn.addEventListener("click", () => scanStudentCode(manualCodeInput.value));
  manualCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") scanStudentCode(manualCodeInput.value);
  });

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
  document.getElementById(`${tabName}Panel`).classList.add("active-panel");

  if (tabName === "students") renderAttendanceList();
  if (tabName === "queue") renderQueueList();
}

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    activeClass = saved.activeClass || "A";
    activeSessionNumber = saved.activeSessionNumber || 1;
    activeStartTime = saved.activeStartTime || "17:00";
    activeLateAfter = saved.activeLateAfter || 15;
  } catch {
    // keep defaults
  }

  classSelect.value = activeClass;
  sessionInput.value = activeSessionNumber;
  startTimeInput.value = activeStartTime;
  lateAfterSelect.value = String(activeLateAfter);
  updateSessionId();
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    activeClass,
    activeSessionNumber,
    activeStartTime,
    activeLateAfter
  }));
}

function updateSessionId() {
  const today = new Date().toISOString().slice(0, 10);
  activeSessionId = `${today}_CLASS_${activeClass}_SESSION_${activeSessionNumber}`;
}

async function prepareOfflineAttendance() {
  const tx = db.transaction(["students"], "readwrite");
  const store = tx.objectStore("students");

  DEMO_STUDENTS.forEach((student) => store.put(student));

  await txDone(tx);
  await renderEverything();
  showLastScan("Offline list ready ✅", "Students are saved on this device. You can scan even without internet.", "good");
}

async function renderEverything() {
  await renderOfflineReady();
  renderSampleButtons();
  await renderAttendanceList();
  await renderQueueList();
}

async function renderOfflineReady() {
  const students = await getAllStudents();
  const count = students.length;

  if (count > 0) {
    offlineReadyPill.textContent = `${count} students prepared offline`;
    offlineReadyPill.className = "status-pill good";
  } else {
    offlineReadyPill.textContent = "Offline list not prepared";
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

function renderSampleButtons() {
  const classStudents = DEMO_STUDENTS.filter((student) => student.classLetter === activeClass).slice(0, 4);

  sampleButtons.innerHTML = classStudents.map((student) => `
    <button type="button" data-sample-code="${clean(student.code)}">
      ${clean(student.full_name.split(" ")[0])}
    </button>
  `).join("");

  sampleButtons.querySelectorAll("[data-sample-code]").forEach((button) => {
    button.addEventListener("click", () => scanStudentCode(button.dataset.sampleCode));
  });
}

async function scanStudentCode(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) {
    showScannerMessage("Type or scan a QR code first.", "bad");
    return;
  }

  updateSessionId();

  let students = await getAllStudents();
  if (!students.length) {
    await prepareOfflineAttendance();
    students = await getAllStudents();
  }

  const student = students.find((item) => item.code === code);
  if (!student) {
    showScannerMessage(`Unknown QR code: ${code}`, "bad");
    showLastScan("Unknown QR", "This code is not in the offline student list.", "bad");
    return;
  }

  if (student.classLetter !== activeClass) {
    showScannerMessage(`${student.full_name} belongs to Class ${student.classLetter}, not Class ${activeClass}.`, "bad");
    showLastScan(student.full_name, `Wrong class. Student belongs to Class ${student.classLetter}.`, "bad");
    return;
  }

  const existing = await getAttendanceRecord(activeSessionId, student.id);
  if (existing) {
    showScannerMessage(`${student.full_name} is already marked ${existing.status}.`, "warn");
    showLastScan(student.full_name, `Already marked ${existing.status} at ${formatTime(existing.scannedAt)}.`, "warn");
    return;
  }

  const now = new Date();
  const status = isLate(now) ? "late" : "present";
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
    markedBy: "teacher-demo"
  };

  await saveAttendanceRecord(record);
  manualCodeInput.value = "";

  showScannerMessage(`${student.full_name} marked ${status.toUpperCase()} ✅`, "good");
  showLastScan(student.full_name, `Class ${activeClass} • ${status.toUpperCase()} • ${formatTime(record.scannedAt)}`, "good");
  await renderEverything();
}

function isLate(now) {
  const [hour, minute] = activeStartTime.split(":").map(Number);

  const classStart = new Date(now);
  classStart.setHours(hour || 0, minute || 0, 0, 0);

  const lateTime = new Date(classStart.getTime() + activeLateAfter * 60 * 1000);

  // Normal real-life case: scan time is after the late cutoff on the same day.
  if (now >= lateTime) return true;

  // Demo/testing protection:
  // Some devices show the selected start as 05:00 PM while the current test scan is 05:27 AM.
  // In that case, users still expect 5:27 to count as later than 5:15.
  // So if the scan looks like it is from the opposite AM/PM side of the clock,
  // compare the 12-hour clock time as a fallback.
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
  const students = (await getAllStudents()).filter((student) => student.classLetter === activeClass);
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
        <h2>No students prepared yet</h2>
        <p>Tap “Prepare Offline Attendance” first.</p>
      </div>
    `;
    return;
  }

  attendanceList.innerHTML = visible.map((student) => {
    const record = byStudent.get(student.id);
    const status = record?.status || "absent";
    const time = record ? formatTime(record.scannedAt) : "Not scanned yet";

    return `
      <article class="student-row">
        <div class="student-avatar">${clean(student.full_name.charAt(0))}</div>
        <div class="student-main">
          <strong>${clean(student.full_name)}</strong>
          <span>${clean(student.code)} • ${clean(time)}</span>
        </div>
        <span class="status-badge status-${clean(status)}">${statusLabel(status)}</span>
      </article>
    `;
  }).join("");
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

  const ok = window.confirm(`Reset attendance for Class ${activeClass} Session ${activeSessionNumber}? This only clears this demo session.`);
  if (!ok) return;

  const tx = db.transaction(["attendance"], "readwrite");
  const store = tx.objectStore("attendance");
  records.forEach((record) => store.delete(record.id));
  await txDone(tx);

  await renderEverything();
  showLastScan("Session reset ✅", "Now scan again and late status will be calculated with the fixed logic.", "good");
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
    ["session_id", "class", "session", "student_id", "student_code", "student_name", "status", "scan_time", "synced"]
  ];

  students.forEach((student) => {
    const record = byStudent.get(student.id);
    rows.push([
      activeSessionId,
      activeClass,
      activeSessionNumber,
      student.id,
      student.code,
      student.full_name,
      record?.status || "absent",
      record?.scannedAt || "",
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

async function startCameraScanner() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showScannerMessage("Camera is not available in this browser. Use manual scan for now.", "bad");
    return;
  }

  if (!("BarcodeDetector" in window)) {
    showScannerMessage("This browser does not support the built-in QR scanner. Use Chrome Android or manual scan for this demo.", "warn");
    return;
  }

  try {
    detector = new BarcodeDetector({ formats: ["qr_code"] });
    scanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });

    scannerVideo.srcObject = scanStream;
    await scannerVideo.play();
    scanOverlay.classList.add("hidden");
    scanBtn.classList.add("hidden");
    stopScanBtn.classList.remove("hidden");
    scanLoopActive = true;
    showScannerMessage("Scanning... point the camera at a student QR code.", "good");
    scanLoop();
  } catch (error) {
    console.error(error);
    showScannerMessage("Camera could not open. Host on HTTPS/localhost and allow camera permission.", "bad");
  }
}

function stopCameraScanner() {
  scanLoopActive = false;

  if (scanStream) {
    scanStream.getTracks().forEach((track) => track.stop());
    scanStream = null;
  }

  scannerVideo.srcObject = null;
  scanOverlay.classList.remove("hidden");
  scanBtn.classList.remove("hidden");
  stopScanBtn.classList.add("hidden");
  showScannerMessage("Scanner stopped.", "warn");
}

async function scanLoop() {
  if (!scanLoopActive || !detector) return;

  try {
    if (scannerVideo.readyState >= 2) {
      const codes = await detector.detect(scannerVideo);
      if (codes.length) {
        const code = String(codes[0].rawValue || "").trim().toUpperCase();
        const now = Date.now();
        if (code && (code !== lastScannedCode || now - lastScannedAt > 2500)) {
          lastScannedCode = code;
          lastScannedAt = now;
          await scanStudentCode(code);
        }
      }
    }
  } catch (error) {
    console.warn(error);
  }

  window.setTimeout(scanLoop, 550);
}

function showScannerMessage(message, type) {
  scannerMessage.textContent = message;
  scannerMessage.style.color = type === "bad" ? "#d62828" : type === "good" ? "#198754" : "#617787";
}

function showLastScan(title, message, type) {
  lastScanCard.classList.remove("hidden");
  lastScanCard.innerHTML = `
    <strong>${clean(title)}</strong>
    <p>${clean(message)}</p>
  `;

  lastScanCard.style.borderColor = type === "bad"
    ? "rgba(214,40,40,.25)"
    : type === "good"
      ? "rgba(25,135,84,.25)"
      : "rgba(245,159,0,.25)";
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

function getAttendanceRecord(sessionId, studentId) {
  return new Promise((resolve, reject) => {
    const id = `${sessionId}_${studentId}`;
    const tx = db.transaction(["attendance"], "readonly");
    const request = tx.objectStore("attendance").get(id);
    request.onsuccess = () => resolve(request.result || null);
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

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    });
  }
}
