/* =====================================================
   DRAMAGIC WEEKLY CALENDAR AGENDA
   Local frontend storage now. Supabase table later.
===================================================== */

const AGENDA_KEY = "dramagic_weekly_agenda";
const SESSION_KEY = "dramagic_demo_session";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOUR_START = 8;
const HOUR_END = 22;
const HOUR_HEIGHT = 72;

const EVENT_TYPES = {
  session: { label: "Class session", icon: "🎭" },
  presentation: { label: "Presentation", icon: "🎤" },
  homework: { label: "Homework", icon: "📘" },
  rehearsal: { label: "Drama rehearsal", icon: "🎬" },
  assessment: { label: "Assessment", icon: "⭐" },
  reminder: { label: "Reminder", icon: "🔔" },
  announcement: { label: "Announcement", icon: "📣" },
  other: { label: "Other", icon: "🗓️" }
};

const agendaWeekInput = document.getElementById("agendaWeekInput");
const agendaClassSelect = document.getElementById("agendaClassSelect");
const todayAgendaBtn = document.getElementById("todayAgendaBtn");
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const agendaEditor = document.getElementById("agendaEditor");
const agendaEditorTitle = document.getElementById("agendaEditorTitle");
const agendaForm = document.getElementById("agendaForm");
const agendaEditingId = document.getElementById("agendaEditingId");
const agendaDateInput = document.getElementById("agendaDateInput");
const agendaDayInput = document.getElementById("agendaDayInput");
const agendaTypeInput = document.getElementById("agendaTypeInput");
const agendaTitleInput = document.getElementById("agendaTitleInput");
const agendaStartInput = document.getElementById("agendaStartInput");
const agendaEndInput = document.getElementById("agendaEndInput");
const agendaPlanInput = document.getElementById("agendaPlanInput");
const agendaHomeworkInput = document.getElementById("agendaHomeworkInput");
const agendaNotesInput = document.getElementById("agendaNotesInput");
const clearAgendaFormBtn = document.getElementById("clearAgendaFormBtn");
const agendaList = document.getElementById("agendaList");
const agendaListTitle = document.getElementById("agendaListTitle");
const agendaListSubtitle = document.getElementById("agendaListSubtitle");
const agendaRoleText = document.getElementById("agendaRoleText");
const agendaAccessText = document.getElementById("agendaAccessText");
const agendaHeroText = document.getElementById("agendaHeroText");
const agendaViewerCard = document.getElementById("agendaViewerCard");

const urlParams = new URLSearchParams(window.location.search);
const session = readSession();
const role = String(session.role || "guest").toLowerCase();
const canEdit = ["teacher", "ceo", "admin"].includes(role);

initAgenda();

function initAgenda() {
  if (!agendaWeekInput || !agendaClassSelect || !agendaList) return;

  agendaWeekInput.value = getCurrentWeekValue();
  if (agendaDateInput) {
    agendaDateInput.value = dateValueFromDate(new Date());
    syncWeekAndDayFromExactDate(false);
  }

  const classFromUrl = (urlParams.get("class") || "").toUpperCase();
  const startingClass = canEdit ? (classFromUrl || getSessionClass() || "A") : getViewerAgendaClass();
  agendaClassSelect.value = startingClass;

  if (!canEdit) {
    agendaClassSelect.disabled = true;
    agendaWeekInput.disabled = true;
    if (todayAgendaBtn) todayAgendaBtn.classList.add("hidden");
    if (prevWeekBtn) prevWeekBtn.classList.add("hidden");
    if (nextWeekBtn) nextWeekBtn.classList.add("hidden");
    if (agendaEditor) agendaEditor.classList.add("hidden");
    const controlsCard = document.querySelector(".agenda-controls-card");
    if (controlsCard) controlsCard.classList.add("viewer-hidden-controls");
    document.body.classList.add("agenda-view-only");
    ensureAgendaViewerCard();
  } else {
    if (agendaEditor) agendaEditor.classList.remove("hidden");
    document.body.classList.remove("agenda-view-only");
  }

  bindEvents();
  updatePageCopy();
  renderAgenda();
}

function bindEvents() {
  agendaWeekInput.addEventListener("change", function () {
    syncExactDateFromWeekAndDay();
    renderAgenda();
  });
  agendaClassSelect.addEventListener("change", renderAgenda);

  if (agendaDateInput) {
    agendaDateInput.addEventListener("change", function () {
      syncWeekAndDayFromExactDate(true);
      renderAgenda();
    });
  }

  if (agendaDayInput) {
    agendaDayInput.addEventListener("change", function () {
      syncExactDateFromWeekAndDay();
      renderAgenda();
    });
  }

  if (todayAgendaBtn) {
    todayAgendaBtn.addEventListener("click", function () {
      agendaWeekInput.value = getCurrentWeekValue();
      if (agendaDateInput) {
        agendaDateInput.value = dateValueFromDate(new Date());
        syncWeekAndDayFromExactDate(false);
      }
      renderAgenda();
    });
  }

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener("click", function () {
      agendaWeekInput.value = shiftWeekValue(agendaWeekInput.value || getCurrentWeekValue(), -1);
      syncExactDateFromWeekAndDay();
      renderAgenda();
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener("click", function () {
      agendaWeekInput.value = shiftWeekValue(agendaWeekInput.value || getCurrentWeekValue(), 1);
      syncExactDateFromWeekAndDay();
      renderAgenda();
    });
  }

  if (agendaForm) agendaForm.addEventListener("submit", saveAgendaItem);
  if (clearAgendaFormBtn) clearAgendaFormBtn.addEventListener("click", clearForm);

}

function updatePageCopy() {
  const classLetter = getViewerAgendaClass();
  const selectedChild = getSelectedAgendaChild();
  const classLabel = `Class ${classLetter}`;

  if (agendaRoleText) {
    if (canEdit) agendaRoleText.textContent = "Manage calendar";
    else if (role === "parent") agendaRoleText.textContent = selectedChild?.name || classLabel;
    else agendaRoleText.textContent = classLabel;
  }

  if (agendaAccessText) {
    if (canEdit) agendaAccessText.textContent = "Teacher / CEO editing";
    else agendaAccessText.textContent = classLabel;
  }

  if (agendaHeroText) {
    agendaHeroText.textContent = canEdit
      ? "Add calendar items for presentations, homework, rehearsals, reminders, and class plans. Parents and Dramagicians see the latest version."
      : "Scroll through the weekly calendar and check presentations, homework, rehearsal plans, reminders, and updates.";
  }
}

function saveAgendaItem(event) {
  event.preventDefault();

  const selectedDateValue = agendaDateInput?.value || dateValueFromWeekAndDay(agendaWeekInput.value || getCurrentWeekValue(), agendaDayInput.value || "Sunday");
  const selectedDate = parseDateInput(selectedDateValue) || new Date();
  const week = weekValueFromDate(selectedDate);
  const classLetter = agendaClassSelect.value || "A";
  const day = DAY_NAMES[selectedDate.getUTCDay()] || agendaDayInput.value || "Sunday";
  const type = agendaTypeInput.value || "session";
  const title = agendaTitleInput.value.trim();
  const plan = agendaPlanInput.value.trim();
  const homework = agendaHomeworkInput.value.trim();
  const notes = agendaNotesInput.value.trim();
  const allDay = false;
  const startTime = agendaStartInput.value || "17:00";
  const endTime = agendaEndInput.value || addMinutesToTime(startTime, 60);
  const editingId = agendaEditingId.value.trim();

  if (!title) return;

  if (agendaWeekInput) agendaWeekInput.value = week;
  if (agendaDayInput) agendaDayInput.value = day;

  const all = readAgenda();
  const previous = editingId ? all.find((item) => item.id === editingId) : null;
  const id = previous?.id || `${week}_${classLetter}_${day}_${type}_${Date.now()}`;

  const record = {
    id,
    week,
    classLetter,
    day,
    date: selectedDateValue,
    type,
    title,
    plan,
    homework,
    notes,
    allDay,
    startTime,
    endTime,
    createdAt: previous?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: session.full_name || session.email || "Dramagic"
  };

  const updated = all.filter((item) => item.id !== id);
  updated.push(record);
  localStorage.setItem(AGENDA_KEY, JSON.stringify(updated));

  clearForm();
  renderAgenda();
}

function renderAgenda() {
  updatePageCopy();
  if (!canEdit) ensureAgendaViewerCard();

  const selectedWeek = agendaWeekInput.value || getCurrentWeekValue();
  const classLetter = getViewerAgendaClass();
  const weekDates = getWeekDates(selectedWeek);
  const all = readAgenda().map(normalizeAgendaItem);

  const records = all
    .filter((item) => item.classLetter === classLetter && (canEdit ? item.week === selectedWeek : true))
    .sort(compareAgendaItems);

  if (agendaListTitle) {
    agendaListTitle.textContent = canEdit ? `Class ${classLetter} Weekly Calendar` : `Class ${classLetter} Calendar`;
  }

  if (agendaListSubtitle) {
    agendaListSubtitle.textContent = canEdit
      ? `${formatWeekRange(weekDates)}. Scroll down for hours and sideways on mobile to see all days.`
      : `All saved calendar items for Class ${classLetter}. Scroll to see the full week and upcoming items.`;
  }

  agendaList.innerHTML = buildCalendarHtml(records, weekDates, selectedWeek, classLetter);
  bindCalendarEvents(records);
  scrollCalendarToFirstEvent(records);
}

function buildCalendarHtml(records, weekDates, selectedWeek, classLetter) {
  const selectedWeekRecords = records.filter((item) => item.week === selectedWeek);
  const grouped = groupByDay(selectedWeekRecords);
  const bodyRows = [];

  bodyRows.push(`<div class="calendar-corner">GMT+03</div>`);
  DAY_NAMES.forEach((day, index) => {
    const date = weekDates[index];
    bodyRows.push(`
      <div class="calendar-day-header ${isToday(date) ? "is-today" : ""}">
        <strong>${day.slice(0, 3)}</strong>
        <span>${date.getDate()}</span>
      </div>
    `);
  });


  bodyRows.push(`
    <div class="calendar-time-column">
      ${hours().map((hour) => `<div class="time-slot-label">${formatHour(hour)}</div>`).join("")}
    </div>
  `);

  DAY_NAMES.forEach((day, index) => {
    const timedEvents = grouped[day] || [];
    const date = weekDates[index];
    bodyRows.push(`
      <div class="calendar-day-column ${isToday(date) ? "is-today" : ""}" data-calendar-day="${clean(day)}">
        ${timedEvents.length ? "" : `<div class="empty-calendar-day">No timed items</div>`}
        ${timedEvents.map((item) => eventCardHtml(item, false)).join("")}
      </div>
    `);
  });

  const otherWeeks = canEdit ? [] : records.filter((item) => item.week !== selectedWeek).slice(0, 24);

  return `
    <div class="calendar-toolbar-note">
      ${selectedWeekRecords.length
        ? `${selectedWeekRecords.length} item${selectedWeekRecords.length === 1 ? "" : "s"} saved for Class ${clean(classLetter)} in this week.`
        : `No items saved for Class ${clean(classLetter)} this week yet. ${canEdit ? "Use the form below to add presentation, homework, rehearsal, or reminders." : "Please check again later."}`}
    </div>
    <div class="calendar-scroll" id="calendarScroll">
      <div class="calendar-grid">
        ${bodyRows.join("")}
      </div>
    </div>
    <section id="eventDetailsPanel" class="event-details-panel hidden"></section>
    ${otherWeeks.length ? buildUpcomingItemsHtml(otherWeeks) : ""}
  `;
}

function buildUpcomingItemsHtml(items) {
  return `
    <section class="event-details-panel">
      <header>
        <div>
          <span class="agenda-tag">Upcoming / other weeks</span>
          <h3>More saved agenda items</h3>
        </div>
      </header>
      ${items.map((item) => `
        <p><strong>${clean(item.week)} • ${clean(item.day)} • ${eventTypeMeta(item.type).icon} ${clean(item.title)}</strong><br>${clean(item.plan || item.homework || item.notes || "No extra details")}</p>
      `).join("")}
    </section>
  `;
}

function eventCardHtml(item, allDay) {
  const meta = eventTypeMeta(item.type);
  const style = allDay ? "" : `style="--event-top:${getEventTop(item)}px; --event-height:${getEventHeight(item)}px"`;
  const timeLabel = `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`;

  return `
    <button class="agenda-event ${allDay ? "all-day-event" : ""} type-${clean(item.type)}-event" ${style} type="button" data-event-id="${clean(item.id)}" title="${clean(item.title)}">
      <strong>${meta.icon} ${clean(item.title)}</strong>
      <small>${clean(timeLabel)} • ${clean(meta.label)}</small>
      ${!allDay && item.plan ? `<span>${clean(item.plan)}</span>` : ""}
    </button>
  `;
}

function bindCalendarEvents(records) {
  agendaList.querySelectorAll("[data-event-id]").forEach((button) => {
    button.addEventListener("click", function () {
      const item = records.find((record) => record.id === button.dataset.eventId);
      if (item) showEventDetails(item);
    });
  });
}

function showEventDetails(item) {
  const panel = document.getElementById("eventDetailsPanel");
  if (!panel) return;

  const meta = eventTypeMeta(item.type);
  const timeLabel = `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`;

  panel.classList.remove("hidden");
  panel.innerHTML = `
    <header>
      <div>
        <span class="agenda-tag">${clean(item.date || dateValueFromWeekAndDay(item.week, item.day))} • ${clean(item.day)} • ${clean(timeLabel)}</span>
        <h3>${meta.icon} ${clean(item.title)}</h3>
      </div>
      <button class="soft-btn close-detail-btn" type="button" data-close-event-details>×</button>
    </header>
    <p><strong>Type:</strong> ${clean(meta.label)}</p>
    ${item.plan ? `<p><strong>Details:</strong> ${clean(item.plan || item.homework || item.notes || "No extra details")}</p>` : ""}
    ${item.homework ? `<p><strong>Preparation / homework:</strong> ${clean(item.homework)}</p>` : ""}
    ${item.notes ? `<p><strong>Notes:</strong> ${clean(item.notes)}</p>` : ""}
    <p><strong>Updated:</strong> ${formatDate(item.updatedAt)} ${item.updatedBy ? `by ${clean(item.updatedBy)}` : ""}</p>
    ${canEdit ? `
      <div class="detail-actions">
        <button class="primary-btn" type="button" data-edit-agenda="${clean(item.id)}">Edit item</button>
        <button class="danger-btn" type="button" data-delete-agenda="${clean(item.id)}">Delete item</button>
      </div>
    ` : ""}
  `;

  panel.querySelector("[data-close-event-details]")?.addEventListener("click", () => panel.classList.add("hidden"));
  panel.querySelector("[data-edit-agenda]")?.addEventListener("click", () => editAgendaItem(item.id));
  panel.querySelector("[data-delete-agenda]")?.addEventListener("click", () => deleteAgendaItem(item.id));
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function editAgendaItem(id) {
  const item = readAgenda().map(normalizeAgendaItem).find((record) => record.id === id);
  if (!item || !canEdit) return;

  agendaEditingId.value = item.id;
  agendaWeekInput.value = item.week || getCurrentWeekValue();
  agendaClassSelect.value = item.classLetter || "A";
  if (agendaDateInput) agendaDateInput.value = item.date || dateValueFromWeekAndDay(item.week || getCurrentWeekValue(), item.day || "Sunday");
  agendaDayInput.value = item.day || dayNameFromDateValue(agendaDateInput?.value) || "Sunday";
  agendaTypeInput.value = item.type || "session";
  agendaTitleInput.value = item.title || "";
  agendaStartInput.value = item.startTime || "17:00";
  agendaEndInput.value = item.endTime || "18:00";
  agendaPlanInput.value = item.plan || "";
  agendaHomeworkInput.value = item.homework || "";
  agendaNotesInput.value = item.notes || "";
  if (agendaEditorTitle) agendaEditorTitle.textContent = "Edit calendar item";
  agendaEditor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteAgendaItem(id) {
  if (!canEdit) return;
  const all = readAgenda().filter((record) => record.id !== id);
  localStorage.setItem(AGENDA_KEY, JSON.stringify(all));
  clearForm();
  renderAgenda();
}

function clearForm() {
  if (!agendaForm) return;
  agendaForm.reset();
  agendaEditingId.value = "";
  if (agendaDateInput) agendaDateInput.value = dateValueFromWeekAndDay(agendaWeekInput.value || getCurrentWeekValue(), "Sunday");
  agendaDayInput.value = "Sunday";
  agendaTypeInput.value = "session";
  agendaStartInput.value = "17:00";
  agendaEndInput.value = "18:00";
  if (agendaEditorTitle) agendaEditorTitle.textContent = "Add calendar item";
}

function ensureAgendaViewerCard() {
  if (!agendaViewerCard || canEdit) return;

  const children = getAgendaChildren();
  const selectedChild = getSelectedAgendaChild();
  const classLetter = getViewerAgendaClass();
  const canChooseChild = role === "parent" && children.length > 1;

  agendaViewerCard.classList.remove("hidden");
  agendaViewerCard.innerHTML = `
    <div>
      <p class="eyebrow">Automatic class calendar</p>
      <h2>${role === "parent" ? clean(selectedChild?.name || "Your child") : "Your Weekly Calendar"}</h2>
      <p>${role === "parent" ? `Calendar for ${clean(selectedChild?.name || "your child")} • Class ${clean(classLetter)}.` : `Calendar for Class ${clean(classLetter)}.`} Items will appear automatically when the teacher saves them.</p>
    </div>
    ${canChooseChild ? `
      <label>
        <span>Choose child</span>
        <select id="agendaChildSelect">
          ${children.map((child) => `<option value="${clean(child.studentId)}">${clean(child.name)} • Class ${clean(child.classLetter)}</option>`).join("")}
        </select>
      </label>
    ` : ""}
  `;

  const select = document.getElementById("agendaChildSelect");
  if (select && selectedChild) {
    select.value = selectedChild.studentId || "";
    select.addEventListener("change", function () {
      localStorage.setItem("dramagic_selected_parent_child", select.value);
      const child = getSelectedAgendaChild();
      agendaClassSelect.value = child?.classLetter || getViewerAgendaClass();
      renderAgenda();
    });
  }
}

function normalizeAgendaItem(item) {
  const safeItem = item || {};
  const type = normalizeEventType(safeItem.type || inferType(safeItem));
  const fallbackWeek = safeItem.week || getCurrentWeekValue();
  const fallbackDay = DAY_NAMES.includes(safeItem.day) ? safeItem.day : "Sunday";
  const date = safeItem.date || dateValueFromWeekAndDay(fallbackWeek, fallbackDay);
  const parsedDate = parseDateInput(date);
  const week = parsedDate ? weekValueFromDate(parsedDate) : fallbackWeek;
  const day = parsedDate ? DAY_NAMES[parsedDate.getUTCDay()] : fallbackDay;
  const startTime = safeItem.startTime || "17:00";
  const endTime = safeItem.endTime || addMinutesToTime(startTime, 60);

  return {
    id: String(safeItem.id || `${week}_${safeItem.classLetter || "A"}_${day}_${Date.now()}`),
    week,
    classLetter: String(safeItem.classLetter || safeItem.class || "A").toUpperCase(),
    day,
    date,
    type,
    title: safeItem.title || "Class agenda",
    plan: safeItem.plan || safeItem.details || "",
    homework: safeItem.homework || safeItem.preparation || "",
    notes: safeItem.notes || "",
    allDay: false,
    startTime,
    endTime,
    createdAt: safeItem.createdAt || safeItem.updatedAt || new Date().toISOString(),
    updatedAt: safeItem.updatedAt || safeItem.createdAt || new Date().toISOString(),
    updatedBy: safeItem.updatedBy || "Dramagic"
  };
}

function inferType(item) {
  const text = `${item?.title || ""} ${item?.homework || ""} ${item?.plan || ""}`.toLowerCase();
  if (text.includes("homework") || text.includes("hw") || text.includes("prepare")) return "homework";
  if (text.includes("presentation") || text.includes("presentacy")) return "presentation";
  if (text.includes("rehearsal") || text.includes("drama") || text.includes("acting")) return "rehearsal";
  if (text.includes("exam") || text.includes("assessment") || text.includes("score")) return "assessment";
  if (text.includes("reminder") || text.includes("note")) return "reminder";
  return "session";
}

function normalizeEventType(value) {
  return EVENT_TYPES[value] ? value : "session";
}

function eventTypeMeta(type) {
  return EVENT_TYPES[normalizeEventType(type)] || EVENT_TYPES.session;
}

function groupByDay(records) {
  return DAY_NAMES.reduce((groups, day) => {
    groups[day] = records
      .filter((item) => item.day === day)
      .sort(compareAgendaItems);
    return groups;
  }, {});
}

function compareAgendaItems(a, b) {
  const dayDiff = DAY_NAMES.indexOf(a.day) - DAY_NAMES.indexOf(b.day);
  if (dayDiff) return dayDiff;
  return timeToMinutes(a.startTime || "00:00") - timeToMinutes(b.startTime || "00:00");
}

function getEventTop(item) {
  const start = Math.max(HOUR_START * 60, Math.min(HOUR_END * 60, timeToMinutes(item.startTime || "17:00")));
  return Math.max(0, ((start - HOUR_START * 60) / 60) * HOUR_HEIGHT) + 4;
}

function getEventHeight(item) {
  const start = timeToMinutes(item.startTime || "17:00");
  const end = Math.max(start + 30, timeToMinutes(item.endTime || addMinutesToTime(item.startTime || "17:00", 60)));
  const visibleStart = Math.max(HOUR_START * 60, start);
  const visibleEnd = Math.min(HOUR_END * 60, end);
  const duration = Math.max(30, visibleEnd - visibleStart);
  return Math.max(44, (duration / 60) * HOUR_HEIGHT - 8);
}

function hours() {
  const list = [];
  for (let hour = HOUR_START; hour < HOUR_END; hour += 1) list.push(hour);
  return list;
}

function scrollCalendarToFirstEvent(records) {
  const scrollBox = document.getElementById("calendarScroll");
  if (!scrollBox) return;

  const timed = records.filter((item) => item.week === (agendaWeekInput.value || getCurrentWeekValue()));
  if (!timed.length) return;

  const earliest = timed.reduce((min, item) => Math.min(min, timeToMinutes(item.startTime || "17:00")), 24 * 60);
  const top = Math.max(0, ((earliest - HOUR_START * 60) / 60) * HOUR_HEIGHT - 90);
  setTimeout(() => { scrollBox.scrollTop = top; }, 40);
}

function readAgenda() {
  try {
    const saved = JSON.parse(localStorage.getItem(AGENDA_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
  } catch {
    return {};
  }
}

function getSessionClass() {
  if (role === "parent") {
    const child = getSelectedAgendaChild();
    if (child?.classLetter) return String(child.classLetter).toUpperCase();
  }
  if (session.classLetter) return String(session.classLetter).toUpperCase();
  if (session.class) return String(session.class).toUpperCase();
  return "";
}

function getAgendaChildren() {
  if (!session || role !== "parent") return [];

  let children = [];
  if (Array.isArray(session.children)) {
    children = session.children.map((child) => ({
      studentId: child.studentId || child.code || child.id || "",
      name: child.name || child.full_name || child.fullName || "Dramagician",
      classLetter: String(child.classLetter || child.class || session.classLetter || "A").toUpperCase(),
      className: child.className || `Class ${String(child.classLetter || child.class || session.classLetter || "A").toUpperCase()}`
    }));
  } else if (session.linkedStudentId || session.linkedStudentName) {
    children = [{
      studentId: session.linkedStudentId || session.studentId || "",
      name: session.linkedStudentName || session.studentName || "Dramagician",
      classLetter: String(session.classLetter || "A").toUpperCase(),
      className: session.className || `Class ${String(session.classLetter || "A").toUpperCase()}`
    }];
  }

  return addPreviewParentAgendaChildren(children);
}

function addPreviewParentAgendaChildren(children) {
  const list = Array.isArray(children) ? children.slice() : [];
  const email = String(session?.email || "").toLowerCase();
  const username = String(session?.username || "").toLowerCase();
  const hasLaila = list.some((child) => String(child.studentId || child.code || "").toUpperCase() === "DRG-A-001");

  if (role !== "parent" || !(email === "parent@dramagic.demo" || username === "parent" || hasLaila)) {
    return list;
  }

  [
    { studentId: "DRG-A-001", name: "Laila Hassan", classLetter: "A", className: "Class A" },
    { studentId: "DRG-A-002", name: "Youssef Ali", classLetter: "A", className: "Class A" }
  ].forEach((child) => {
    const exists = list.some((saved) => String(saved.studentId || saved.code || "").toUpperCase() === child.studentId);
    if (!exists) list.push(child);
  });

  return list;
}

function getSelectedAgendaChild() {
  const children = getAgendaChildren();
  const stored = localStorage.getItem("dramagic_selected_parent_child") || "";
  return children.find((child) => child.studentId === stored) || children[0] || null;
}

function getViewerAgendaClass() {
  if (canEdit) return agendaClassSelect?.value || "A";
  if (role === "parent") {
    const child = getSelectedAgendaChild();
    return child?.classLetter || String(session.classLetter || "A").toUpperCase();
  }
  if (["student", "learner", "dramagician"].includes(role)) {
    return String(session.classLetter || session.class || "A").toUpperCase();
  }
  return String(urlParams.get("class") || session.classLetter || "A").toUpperCase();
}

function syncWeekAndDayFromExactDate(keepDate) {
  if (!agendaDateInput?.value) return;
  const date = parseDateInput(agendaDateInput.value);
  if (!date) return;
  if (agendaWeekInput) agendaWeekInput.value = weekValueFromDate(date);
  if (agendaDayInput) agendaDayInput.value = DAY_NAMES[date.getUTCDay()] || "Sunday";
  if (!keepDate) agendaDateInput.value = dateValueFromDate(date);
}

function syncExactDateFromWeekAndDay() {
  if (!agendaDateInput || !agendaWeekInput || !agendaDayInput) return;
  agendaDateInput.value = dateValueFromWeekAndDay(agendaWeekInput.value || getCurrentWeekValue(), agendaDayInput.value || "Sunday");
}

function dayNameFromDateValue(value) {
  const date = parseDateInput(value);
  return date ? DAY_NAMES[date.getUTCDay()] : "";
}

function getCurrentWeekValue() {
  // The agenda calendar is Sunday → Saturday.
  // Browser week values are ISO Monday → Sunday, so a Sunday must open the
  // week that STARTS today, not the ISO week that ENDS today.
  return weekValueFromDate(new Date());
}

function shiftWeekValue(value, amount) {
  const start = getMondayFromWeekValue(value);
  start.setUTCDate(start.getUTCDate() + amount * 7);
  return weekValueFromDate(start);
}

function weekValueFromDate(date) {
  const sourceDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();

  // The visible agenda week starts on Sunday. ISO week inputs start on Monday.
  // If the selected/current date is Sunday, move one day forward before making
  // the ISO week value so the calendar opens Sunday → Saturday for the real week.
  const temp = new Date(Date.UTC(sourceDate.getFullYear(), sourceDate.getMonth(), sourceDate.getDate()));
  if (temp.getUTCDay() === 0) temp.setUTCDate(temp.getUTCDate() + 1);

  const dayNumber = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function getWeekDates(weekValue) {
  const monday = getMondayFromWeekValue(weekValue);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() - 1);
  return DAY_NAMES.map((_, index) => {
    const date = new Date(sunday);
    date.setUTCDate(sunday.getUTCDate() + index);
    return date;
  });
}

function parseDateInput(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function dateValueFromDate(date) {
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  return `${safeDate.getUTCFullYear()}-${String(safeDate.getUTCMonth() + 1).padStart(2, "0")}-${String(safeDate.getUTCDate()).padStart(2, "0")}`;
}

function dateValueFromWeekAndDay(weekValue, dayName) {
  const dates = getWeekDates(weekValue || getCurrentWeekValue());
  const dayIndex = Math.max(0, DAY_NAMES.indexOf(dayName));
  return dateValueFromDate(dates[dayIndex] || dates[0] || new Date());
}

function getMondayFromWeekValue(value) {
  const match = String(value || getCurrentWeekValue()).match(/^(\d{4})-W(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const week = match ? Number(match[2]) : Number(getCurrentWeekValue().slice(-2));
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const day = simple.getUTCDay();
  const monday = new Date(simple);
  if (day <= 4) monday.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  else monday.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  return monday;
}

function formatWeekRange(dates) {
  if (!dates?.length) return "Selected week";
  const start = dates[0];
  const end = dates[6];
  const formatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  return `${formatter.format(start)} – ${formatter.format(end)}, ${end.getUTCFullYear()}`;
}

function formatDate(value) {
  if (!value) return "now";
  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "now";
  }
}

function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;
  return `${normalized} ${suffix}`;
}

function formatTime(value) {
  if (!value) return "";
  const [hoursValue, minutesValue] = String(value).split(":").map(Number);
  if (Number.isNaN(hoursValue) || Number.isNaN(minutesValue)) return value;
  const suffix = hoursValue >= 12 ? "PM" : "AM";
  const normalized = hoursValue % 12 || 12;
  return `${normalized}:${String(minutesValue).padStart(2, "0")} ${suffix}`;
}

function timeToMinutes(value) {
  const [hoursValue, minutesValue] = String(value || "00:00").split(":").map(Number);
  return (Number.isFinite(hoursValue) ? hoursValue : 0) * 60 + (Number.isFinite(minutesValue) ? minutesValue : 0);
}

function addMinutesToTime(value, minutesToAdd) {
  const total = timeToMinutes(value) + minutesToAdd;
  const hoursValue = Math.floor(total / 60) % 24;
  const minutesValue = total % 60;
  return `${String(hoursValue).padStart(2, "0")}:${String(minutesValue).padStart(2, "0")}`;
}

function isToday(date) {
  const now = new Date();
  return date.getUTCFullYear() === now.getFullYear() &&
    date.getUTCMonth() === now.getMonth() &&
    date.getUTCDate() === now.getDate();
}

function clean(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
