/* =====================================================
   DRAMAGIC PUBLIC GUEST PAGE
   Story timeline + news + memories + CEO local manager.
   Demo storage: localStorage. Supabase can replace this later.
===================================================== */

const GUEST_CONTENT_KEY = "dramagic_guest_public_content_v1";
const SESSION_KEY = "dramagic_demo_session";

const defaultGuestContent = {
  timeline: [
    {
      id: "timeline-2017",
      year: "2017",
      tag: "The Beginning",
      title: "Dramagic was born on stage",
      story:
        "Dramagic began when we saw learners who loved theatre but were afraid of going on stage. After their first performance, they felt the lights, heard the applause, and discovered a new confidence. That feeling became the heart of Dramagic.",
      media: "",
      mediaType: "image",
      icon: "🎭"
    },
    {
      id: "timeline-2019",
      year: "2019",
      tag: "Growth",
      title: "Another successful round",
      story:
        "We continued the journey and created another Dramagic round. The experience proved that learning English can feel alive when learners perform, speak, act, and support each other.",
      media: "",
      mediaType: "image",
      icon: "⭐"
    },
    {
      id: "timeline-2020",
      year: "2020",
      tag: "Pause, not an ending",
      title: "Corona paused the stage, but not the dream",
      story:
        "When corona came, Dramagic stopped physically for a while. But behind the scenes, the idea kept growing. We kept thinking about how to make English more enjoyable, more confident, and more connected to character-building.",
      media: "",
      mediaType: "image",
      icon: "💭"
    },
    {
      id: "timeline-2022",
      year: "2022",
      tag: "Comeback",
      title: "The new Dramagic returned",
      story:
        "Dramagic came back with new energy. We kept developing ideas, activities, and performance-based learning so every learner could enjoy English while building courage and personality.",
      media: "",
      mediaType: "image",
      icon: "🎤"
    },
    {
      id: "timeline-2026",
      year: "2026",
      tag: "New Chapter",
      title: "A smarter Dramagic for today",
      story:
        "Now we are building a more modern Dramagic with new tools, a stronger platform, Presentacy, attendance, memories, and better systems — staying up to date while keeping the same soul.",
      media: "",
      mediaType: "image",
      icon: "✨"
    }
  ],
  news: [
    {
      id: "news-2026-platform",
      tag: "New Chapter",
      title: "The new Dramagic platform is growing",
      text:
        "We are building a more connected Dramagic experience with Presentacy, media memories, attendance, and future tools for learners, parents, and teachers.",
      media: "",
      mediaType: "image",
      icon: "💻"
    },
    {
      id: "news-course-soon",
      tag: "Course",
      title: "New Dramagic course details coming soon",
      text:
        "Dramagic is preparing new course details for English, drama, presentation, confidence, acting, and communication.",
      media: "",
      mediaType: "image",
      icon: "🎭"
    },
    {
      id: "news-memories",
      tag: "Memories",
      title: "A place for real Dramagic moments",
      text:
        "The guest page will become a public home for stories, announcements, photos, videos, and emotional memories from the Dramagic journey.",
      media: "",
      mediaType: "image",
      icon: "📸"
    }
  ],
  gallery: [
    {
      id: "gallery-stage",
      type: "photo",
      title: "Stage Confidence",
      caption: "The moment learners discover that the stage is not only scary — it can be powerful.",
      media: "",
      icon: "🎤"
    },
    {
      id: "gallery-theatre",
      type: "photo",
      title: "Theatre Energy",
      caption: "Drama gives English a body, a voice, and a feeling.",
      media: "",
      icon: "🎭"
    },
    {
      id: "gallery-class",
      type: "photo",
      title: "Class Moments",
      caption: "Every session can become a memory when learners are part of the story.",
      media: "",
      icon: "⭐"
    },
    {
      id: "gallery-video",
      type: "video",
      title: "Performance Highlights",
      caption: "Add trailers, stage videos, behind-the-scenes clips, or class moments here.",
      media: "",
      icon: "▶"
    }
  ]
};

document.addEventListener("DOMContentLoaded", initGuestPage);

function initGuestPage() {
  const year = document.getElementById("guestYear");
  if (year) year.textContent = new Date().getFullYear();

  ensureContent();
  renderGuestPage();
  setupGuestManager();
  setupRevealMotion();
}

function ensureContent() {
  const saved = loadContent();
  if (!saved) {
    saveContent(defaultGuestContent);
  }
}

function loadContent() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_CONTENT_KEY));
    if (!parsed || typeof parsed !== "object") return null;

    return {
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
      news: Array.isArray(parsed.news) ? parsed.news : [],
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : []
    };
  } catch {
    return null;
  }
}

function saveContent(content) {
  localStorage.setItem(GUEST_CONTENT_KEY, JSON.stringify(content));
}

function getContent() {
  return loadContent() || defaultGuestContent;
}

function renderGuestPage() {
  const content = getContent();
  renderTimeline(content.timeline);
  renderNews(content.news);
  renderGallery(content.gallery);
}

function renderTimeline(items) {
  const wrap = document.getElementById("guestTimeline");
  if (!wrap) return;

  if (!items.length) {
    wrap.innerHTML = `<div class="empty-message">No timeline memories yet.</div>`;
    return;
  }

  wrap.innerHTML = items.map((item, index) => `
    <article class="guest-timeline-item reveal-motion" data-id="${escapeAttr(item.id)}">
      <div class="guest-timeline-year">
        <strong>${escapeHtml(item.year || "")}</strong>
        <span>${escapeHtml(item.tag || "Memory")}</span>
      </div>

      <div class="guest-timeline-card">
        <div class="guest-timeline-media">
          ${renderMedia(item.media, item.icon || "🎭", item.mediaType)}
        </div>

        <div class="guest-timeline-copy">
          <h3>${escapeHtml(item.title || "Untitled memory")}</h3>
          <p>${escapeHtml(item.story || "")}</p>
          ${managerButtons("timeline", item.id)}
        </div>
      </div>
    </article>
  `).join("");

  setupRevealMotion();
}

function renderNews(items) {
  const wrap = document.getElementById("guestNewsGrid");
  if (!wrap) return;

  if (!items.length) {
    wrap.innerHTML = `<div class="empty-message">No public updates yet.</div>`;
    return;
  }

  wrap.innerHTML = items.map((item) => `
    <article class="guest-news-card reveal-motion" data-id="${escapeAttr(item.id)}">
      <div class="news-image guest-live-media">
        ${renderMedia(item.media, item.icon || "📣", item.mediaType)}
      </div>

      <div class="news-content">
        <span class="news-tag">${escapeHtml(item.tag || "Update")}</span>
        <h3>${escapeHtml(item.title || "Untitled update")}</h3>
        <p>${escapeHtml(item.text || "")}</p>
        ${managerButtons("news", item.id)}
      </div>
    </article>
  `).join("");

  setupRevealMotion();
}

function renderGallery(items) {
  const wrap = document.getElementById("guestGalleryGrid");
  if (!wrap) return;

  if (!items.length) {
    wrap.innerHTML = `<div class="empty-message">No memories uploaded yet.</div>`;
    return;
  }

  wrap.innerHTML = items.map((item) => `
    <article class="gallery-item guest-gallery-card reveal-motion" data-id="${escapeAttr(item.id)}">
      <div class="guest-gallery-media">
        ${renderMedia(item.media, item.icon || (item.type === "video" ? "▶" : "📸"), item.type)}
      </div>
      <div>
        <span>${escapeHtml(item.type || "photo")}</span>
        <strong>${escapeHtml(item.title || "Untitled memory")}</strong>
        <p>${escapeHtml(item.caption || "")}</p>
        ${managerButtons("gallery", item.id)}
      </div>
    </article>
  `).join("");

  setupRevealMotion();
}

function renderMedia(media, fallbackIcon, mediaType) {
  if (!media) {
    return `<span class="guest-media-placeholder">${escapeHtml(fallbackIcon || "✨")}</span>`;
  }

  const clean = String(media);
  const isYouTube = clean.includes("youtube.com") || clean.includes("youtu.be");
  const isImage = clean.startsWith("data:image/") || /\.(png|jpg|jpeg|webp|gif|avif)(\?.*)?$/i.test(clean);

  if (isYouTube || mediaType === "video") {
    return `
      <a class="guest-video-preview" href="${escapeAttr(clean)}" target="_blank" rel="noopener">
        <span>▶</span>
        <small>Open video</small>
      </a>
    `;
  }

  if (isImage || clean.startsWith("data:")) {
    return `<img src="${escapeAttr(clean)}" alt="" loading="lazy" />`;
  }

  return `
    <a class="guest-video-preview" href="${escapeAttr(clean)}" target="_blank" rel="noopener">
      <span>↗</span>
      <small>Open link</small>
    </a>
  `;
}

function managerButtons(type, id) {
  if (!canManageGuestPage()) return "";

  return `
    <div class="guest-item-actions">
      <button type="button" class="guest-delete-btn" data-delete-type="${escapeAttr(type)}" data-delete-id="${escapeAttr(id)}">
        Delete
      </button>
    </div>
  `;
}

function setupGuestManager() {
  const openBtn = document.getElementById("openGuestManagerBtn");
  const manager = document.getElementById("guestManager");

  if (canManageGuestPage()) {
    if (openBtn) openBtn.classList.remove("hidden");
  }

  if (openBtn && manager) {
    openBtn.addEventListener("click", () => {
      manager.classList.toggle("hidden");
      manager.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const timelineForm = document.getElementById("guestTimelineForm");
  const newsForm = document.getElementById("guestNewsForm");
  const galleryForm = document.getElementById("guestGalleryForm");
  const resetBtn = document.getElementById("resetGuestContentBtn");

  if (timelineForm) timelineForm.addEventListener("submit", handleTimelineSubmit);
  if (newsForm) newsForm.addEventListener("submit", handleNewsSubmit);
  if (galleryForm) galleryForm.addEventListener("submit", handleGallerySubmit);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const ok = window.confirm("Reset the guest page demo content?");
      if (!ok) return;

      saveContent(defaultGuestContent);
      renderGuestPage();
    });
  }

  document.addEventListener("click", handleGuestDelete);
}

function canManageGuestPage() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    const role = String(session?.role || "").toLowerCase();
    return role === "ceo" || role === "teacher";
  } catch {
    return false;
  }
}

async function handleTimelineSubmit(event) {
  event.preventDefault();

  const content = getContent();
  const media = await getMediaValue("timelineMediaInput", "timelineFileInput");

  content.timeline.push({
    id: makeId("timeline"),
    year: valueOf("timelineYearInput"),
    title: valueOf("timelineTitleInput"),
    tag: valueOf("timelineTagInput") || "Memory",
    story: valueOf("timelineStoryInput"),
    media,
    mediaType: media && isVideoLink(media) ? "video" : "image",
    icon: "✨"
  });

  saveContent(content);
  event.target.reset();
  renderGuestPage();
}

async function handleNewsSubmit(event) {
  event.preventDefault();

  const content = getContent();
  const media = await getMediaValue("newsMediaInput", "newsFileInput");

  content.news.unshift({
    id: makeId("news"),
    tag: valueOf("newsTagInput"),
    title: valueOf("newsTitleInput"),
    text: valueOf("newsTextInput"),
    media,
    mediaType: media && isVideoLink(media) ? "video" : "image",
    icon: "📣"
  });

  saveContent(content);
  event.target.reset();
  renderGuestPage();
}

async function handleGallerySubmit(event) {
  event.preventDefault();

  const content = getContent();
  const type = valueOf("galleryTypeInput") || "photo";
  const media = await getMediaValue("galleryMediaInput", "galleryFileInput");

  content.gallery.unshift({
    id: makeId("gallery"),
    type,
    title: valueOf("galleryTitleInput"),
    caption: valueOf("galleryCaptionInput"),
    media,
    icon: type === "video" ? "▶" : "📸"
  });

  saveContent(content);
  event.target.reset();
  renderGuestPage();
}

function handleGuestDelete(event) {
  const button = event.target.closest("[data-delete-type][data-delete-id]");
  if (!button || !canManageGuestPage()) return;

  const type = button.dataset.deleteType;
  const id = button.dataset.deleteId;
  const content = getContent();

  if (!Array.isArray(content[type])) return;

  const ok = window.confirm("Delete this guest page item?");
  if (!ok) return;

  content[type] = content[type].filter((item) => item.id !== id);
  saveContent(content);
  renderGuestPage();
}

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? String(el.value || "").trim() : "";
}

async function getMediaValue(urlInputId, fileInputId) {
  const url = valueOf(urlInputId);
  if (url) return url;

  const fileInput = document.getElementById(fileInputId);
  const file = fileInput?.files?.[0];

  if (!file) return "";

  return fileToDataUrl(file);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

function isVideoLink(value) {
  const clean = String(value || "").toLowerCase();
  return clean.includes("youtube.com") || clean.includes("youtu.be") || clean.includes("vimeo.com") || /\.(mp4|webm|mov)(\?.*)?$/i.test(clean);
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

function setupRevealMotion() {
  const items = document.querySelectorAll(".reveal-motion:not(.show-motion)");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("show-motion"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show-motion");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
