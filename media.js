const roleSelect = document.getElementById("roleSelect");
const classSelect = document.getElementById("classSelect");
const adminPanel = document.getElementById("adminPanel");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const galleryGrid = document.getElementById("galleryGrid");
const emptyState = document.getElementById("emptyState");
const visibleCount = document.getElementById("visibleCount");
const clearDemoUploads = document.getElementById("clearDemoUploads");

const previewModal = document.getElementById("previewModal");
const modalMedia = document.getElementById("modalMedia");
const modalAlbum = document.getElementById("modalAlbum");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalClass = document.getElementById("modalClass");
const modalType = document.getElementById("modalType");
const modalDate = document.getElementById("modalDate");

let activeFilter = "all";
let activeAlbum = null;

const demoMedia = [
  {
    id: "sample-1",
    title: "Class confidence circle",
    description: "A warm moment from our speaking and confidence activity.",
    album: "Class Moments",
    classId: "kids-a",
    className: "Kids A",
    visibility: "parents",
    type: "image",
    src: makeSvgThumb("Class Moments", "Confidence Circle", "#6d35b8", "#f36aaa"),
    createdAt: "2026-06-07T10:00:00"
  },
  {
    id: "sample-2",
    title: "Final party preparation",
    description: "Behind the scenes while students were getting ready for the final party.",
    album: "Final Party",
    classId: "all",
    className: "All Classes",
    visibility: "guests",
    type: "image",
    src: makeSvgThumb("Final Party", "Magic Night", "#f36aaa", "#f4b63f"),
    createdAt: "2026-06-07T11:30:00"
  },
  {
    id: "sample-3",
    title: "Student performance video",
    description: "A video memory placeholder. Real uploaded videos will play here after choosing a video file.",
    album: "Student Performances",
    classId: "teens",
    className: "Teens",
    visibility: "class",
    type: "video",
    src: "",
    createdAt: "2026-06-07T12:15:00"
  },
  {
    id: "sample-4",
    title: "Parent event notes",
    description: "A file placeholder for important sheets, schedules, or event notes.",
    album: "Important Files",
    classId: "all",
    className: "All Classes",
    visibility: "parents",
    type: "file",
    src: "",
    fileName: "event-notes.pdf",
    createdAt: "2026-06-07T13:00:00"
  }
];

let uploadedMedia = [];

function init() {
  const savedRole = localStorage.getItem("dramagic_memories_role");
  const savedClass = localStorage.getItem("dramagic_memories_class");

  if (savedRole) roleSelect.value = savedRole;
  if (savedClass) classSelect.value = savedClass;

  updateAdminVisibility();
  renderGallery();

  roleSelect.addEventListener("change", () => {
    localStorage.setItem("dramagic_memories_role", roleSelect.value);
    updateAdminVisibility();
    renderGallery();
  });

  classSelect.addEventListener("change", () => {
    localStorage.setItem("dramagic_memories_class", classSelect.value);
    renderGallery();
  });

  fileInput.addEventListener("change", handleFileName);
  uploadForm.addEventListener("submit", handleUpload);
  clearDemoUploads.addEventListener("click", clearUploads);

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      activeFilter = button.dataset.filter || "all";
      activeAlbum = button.dataset.album || null;

      renderGallery();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((item) => {
    item.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function updateAdminVisibility() {
  const role = roleSelect.value;
  const canUpload = role === "teacher" || role === "ceo";

  adminPanel.classList.toggle("hidden", !canUpload);
}

function handleFileName() {
  const file = fileInput.files[0];
  fileName.textContent = file ? file.name : "No file selected yet";
}

function handleUpload(event) {
  event.preventDefault();

  const file = fileInput.files[0];

  if (!file) {
    alert("Please choose a picture, video, or file first.");
    return;
  }

  const title = document.getElementById("mediaTitle").value.trim();
  const album = document.getElementById("albumInput").value;
  const classId = document.getElementById("uploadClassInput").value;
  const visibility = document.getElementById("visibilityInput").value;
  const description = document.getElementById("descriptionInput").value.trim();

  const type = getFileType(file);
  const src = URL.createObjectURL(file);

  const newItem = {
    id: "upload-" + Date.now(),
    title,
    description: description || "A new Dramagic memory.",
    album,
    classId,
    className: getClassName(classId),
    visibility,
    type,
    src,
    fileName: file.name,
    createdAt: new Date().toISOString(),
    isDemoUpload: true
  };

  uploadedMedia.unshift(newItem);

  uploadForm.reset();
  fileName.textContent = "No file selected yet";

  renderGallery();
}

function clearUploads() {
  uploadedMedia.forEach((item) => {
    if (item.src && item.src.startsWith("blob:")) {
      URL.revokeObjectURL(item.src);
    }
  });

  uploadedMedia = [];
  renderGallery();
}

function renderGallery() {
  const allMedia = [...uploadedMedia, ...demoMedia];

  const allowedMedia = allMedia.filter((item) => {
    return canCurrentUserSee(item) && matchesCurrentFilter(item);
  });

  galleryGrid.innerHTML = "";

  allowedMedia.forEach((item) => {
    const card = createMemoryCard(item);
    galleryGrid.appendChild(card);
  });

  visibleCount.textContent = `${allowedMedia.length} ${allowedMedia.length === 1 ? "item" : "items"}`;
  emptyState.classList.toggle("hidden", allowedMedia.length > 0);
}

function canCurrentUserSee(item) {
  const role = roleSelect.value;
  const selectedClass = classSelect.value;

  if (role === "ceo" || role === "teacher") {
    return true;
  }

  if (role === "guest") {
    const isGuestSafeMedia = item.type === "image" || item.type === "video";
    return item.visibility === "guests" && isGuestSafeMedia;
  }

  const classMatches =
    selectedClass === "all" ||
    item.classId === "all" ||
    item.classId === selectedClass;

  if (!classMatches) return false;

  if (role === "parent") {
    return item.visibility === "parents" ||
      item.visibility === "class" ||
      item.visibility === "public";
  }

  if (role === "student") {
    return item.visibility === "class" ||
      item.visibility === "public";
  }

  return false;
}

function matchesCurrentFilter(item) {
  if (activeAlbum) {
    return item.album === activeAlbum;
  }

  if (activeFilter === "all") {
    return true;
  }

  return item.type === activeFilter;
}

function createMemoryCard(item) {
  const card = document.createElement("article");
  card.className = "memory-card";

  card.innerHTML = `
    <div class="memory-thumb">
      ${getPreviewHtml(item)}
      <span class="type-badge">${item.type}</span>
    </div>

    <div class="memory-body">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>

      <div class="memory-meta">
        <span>${escapeHtml(item.album)}</span>
        <span>${escapeHtml(item.className)}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => openModal(item));

  return card;
}

function getPreviewHtml(item) {
  if (item.type === "image") {
    return `<img src="${item.src}" alt="${escapeHtml(item.title)}">`;
  }

  if (item.type === "video") {
    if (item.src) {
      return `<video src="${item.src}" muted></video>`;
    }

    return `
      <div class="video-placeholder">
        <span class="big-icon">▶</span>
        <strong>Video Memory</strong>
      </div>
    `;
  }

  return `
    <div class="file-preview">
      <span class="big-icon">📄</span>
      <strong>${escapeHtml(item.fileName || "File")}</strong>
    </div>
  `;
}

function openModal(item) {
  modalAlbum.textContent = item.album;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalClass.textContent = item.className;
  modalType.textContent = item.type.toUpperCase();
  modalDate.textContent = formatDate(item.createdAt);

  if (item.type === "image") {
    modalMedia.innerHTML = `<img src="${item.src}" alt="${escapeHtml(item.title)}">`;
  } else if (item.type === "video") {
    if (item.src) {
      modalMedia.innerHTML = `<video src="${item.src}" controls autoplay></video>`;
    } else {
      modalMedia.innerHTML = `
        <div class="video-placeholder">
          <span class="big-icon">▶</span>
          <strong>Video preview will appear here</strong>
        </div>
      `;
    }
  } else {
    if (item.src) {
      modalMedia.innerHTML = `
        <div class="file-preview">
          <span class="big-icon">📄</span>
          <strong>${escapeHtml(item.fileName || item.title)}</strong>
          <a class="primary-btn" href="${item.src}" target="_blank" rel="noopener">Open File</a>
        </div>
      `;
    } else {
      modalMedia.innerHTML = `
        <div class="file-preview">
          <span class="big-icon">📄</span>
          <strong>${escapeHtml(item.fileName || item.title)}</strong>
          <small>File preview will open here after real upload is connected.</small>
        </div>
      `;
    }
  }

  previewModal.classList.remove("hidden");
}

function closeModal() {
  previewModal.classList.add("hidden");
  modalMedia.innerHTML = "";
}

function getFileType(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

function getClassName(classId) {
  const names = {
    "kids-a": "Kids A",
    "kids-b": "Kids B",
    "teens": "Teens",
    "adults": "Adults",
    "all": "All Classes"
  };

  return names[classId] || "Class";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function makeSvgThumb(topText, mainText, colorOne, colorTwo) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorOne}"/>
          <stop offset="100%" stop-color="${colorTwo}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="600" rx="42" fill="url(#g)"/>
      <circle cx="150" cy="130" r="74" fill="rgba(255,255,255,.18)"/>
      <circle cx="760" cy="460" r="118" fill="rgba(255,255,255,.16)"/>
      <path d="M80 430 C250 250 420 520 610 270 S790 150 850 90" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="8" stroke-linecap="round"/>
      <text x="70" y="92" fill="rgba(255,255,255,.82)" font-size="34" font-family="Arial" font-weight="700">${topText}</text>
      <text x="70" y="315" fill="white" font-size="74" font-family="Georgia" font-weight="800">${mainText}</text>
      <text x="72" y="380" fill="rgba(255,255,255,.82)" font-size="30" font-family="Arial" font-weight="600">Dramagic Memories</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();