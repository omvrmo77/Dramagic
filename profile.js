document.addEventListener("DOMContentLoaded", function () {
  const profilePicInput = document.getElementById("profilePicInput");
  const profilePreview = document.getElementById("profilePreview");
  const displayNameInput = document.getElementById("displayNameInput");
  const bioInput = document.getElementById("bioInput");
  const goalInput = document.getElementById("goalInput");
  const favoriteSkillInput = document.getElementById("favoriteSkillInput");
  const profileNamePreview = document.getElementById("profileNamePreview");
  const profileBioPreview = document.getElementById("profileBioPreview");
  const skillPreview = document.getElementById("skillPreview");
  const goalPreview = document.getElementById("goalPreview");
  const profileStatus = document.getElementById("profileStatus");
  const personalMessage = document.getElementById("personalMessage");
  const profileForm = document.getElementById("profileForm");
  const clearPhotoBtn = document.getElementById("clearPhotoBtn");
  const randomAvatarBtn = document.getElementById("randomAvatarBtn");
  const backBtn = document.getElementById("backBtn");
  const avatarButtons = Array.from(document.querySelectorAll("[data-avatar]"));

  const session = getSession();
  const profileKey = `dramagic_profile_${session?.id || session?.email || "guest"}`;
  const currentProfileKey = "dramagic_current_profile";
  const avatarIcons = avatarButtons.map((button) => button.dataset.avatar).filter(Boolean);

  initProfile();

  function initProfile() {
    applySavedAppSettings();

    const saved = getSavedProfile();
    const defaultName = session?.full_name || session?.name || saved.displayName || "Dramagic Star";
    const defaultAvatarIcon = saved.avatarIcon || "🌟";
    const defaultAvatar = saved.avatar || makeAvatar(defaultAvatarIcon);

    if (displayNameInput) displayNameInput.value = saved.displayName || defaultName;
    if (bioInput) bioInput.value = saved.bio || "";
    if (goalInput) goalInput.value = saved.goal || "";
    if (favoriteSkillInput) favoriteSkillInput.value = saved.favoriteSkill || "Confidence";

    setAvatarActive(defaultAvatarIcon);
    updatePreview(saved.profilePic || defaultAvatar, defaultAvatarIcon);
    updateLiveText();

    displayNameInput?.addEventListener("input", updateLiveText);
    bioInput?.addEventListener("input", updateLiveText);
    goalInput?.addEventListener("input", updateLiveText);
    favoriteSkillInput?.addEventListener("change", updateLiveText);
    profilePicInput?.addEventListener("change", handleProfilePicUpload);
    profileForm?.addEventListener("submit", saveProfile);
    clearPhotoBtn?.addEventListener("click", useSelectedAvatarInstead);
    randomAvatarBtn?.addEventListener("click", chooseRandomAvatar);
    backBtn?.addEventListener("click", goBackSafely);

    avatarButtons.forEach((button) => {
      button.addEventListener("click", function () {
        chooseAvatar(button.dataset.avatar);
      });
    });
  }

  function updateLiveText() {
    const name = displayNameInput?.value.trim() || "Dramagic Star";
    const bio = bioInput?.value.trim() || "Make your profile feel like you. Add an avatar, your goal, and what you love practicing.";
    const goal = goalInput?.value.trim() || "Ready to grow";
    const skill = favoriteSkillInput?.value || "Confidence";

    if (profileNamePreview) profileNamePreview.textContent = name;
    if (profileBioPreview) profileBioPreview.textContent = bio;
    if (skillPreview) skillPreview.textContent = `🎤 ${skill}`;
    if (goalPreview) goalPreview.textContent = `✨ ${goal}`;
    if (personalMessage) personalMessage.textContent = getCoachMessage(name, skill);
  }

  function chooseAvatar(icon) {
    if (!icon) return;

    const saved = getSavedProfile();
    saved.avatarIcon = icon;
    saved.avatar = makeAvatar(icon);
    saved.profilePic = "";
    saved.updatedAt = new Date().toISOString();

    saveProfileData(saved);
    setAvatarActive(icon);
    updatePreview(saved.avatar, icon);
    showStatus("Avatar updated ✨", "success");
  }

  function chooseRandomAvatar() {
    if (!avatarIcons.length) return;
    const randomIcon = avatarIcons[Math.floor(Math.random() * avatarIcons.length)];
    chooseAvatar(randomIcon);
  }

  function useSelectedAvatarInstead() {
    const saved = getSavedProfile();
    const icon = saved.avatarIcon || "🌟";
    saved.profilePic = "";
    saved.avatar = makeAvatar(icon);
    saved.updatedAt = new Date().toISOString();

    saveProfileData(saved);
    updatePreview(saved.avatar, icon);
    showStatus("Photo removed. Avatar is now active ✨", "success");
  }

  function handleProfilePicUpload() {
    const file = profilePicInput?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showStatus("Please choose an image file.", "error");
      return;
    }

    showStatus("Saving your picture...", "success");

    compressProfileImage(file, function (imageData) {
      if (!imageData) {
        showStatus("I could not save this picture. Try another image.", "error");
        return;
      }

      const saved = getSavedProfile();
      saved.profilePic = imageData;
      saved.avatar = saved.avatar || makeAvatar(saved.avatarIcon || "🌟");
      saved.avatarIcon = saved.avatarIcon || "🌟";
      saved.updatedAt = new Date().toISOString();

      const didSave = saveProfileData(saved);
      if (!didSave) return;

      updatePreview(imageData, saved.avatarIcon);
      showStatus("Picture saved as your recent profile ✨", "success");
    });
  }

  function compressProfileImage(file, done) {
    const reader = new FileReader();

    reader.onload = function () {
      const originalData = reader.result;
      const img = new Image();

      img.onload = function () {
        const maxSide = 520;
        const biggestSide = Math.max(img.width, img.height);
        const scale = biggestSide > maxSide ? maxSide / biggestSide : 1;
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let compressed = canvas.toDataURL("image/jpeg", 0.82);

        // If the image is still heavy, compress one more time.
        if (compressed.length > 1500000) {
          compressed = canvas.toDataURL("image/jpeg", 0.62);
        }

        done(compressed);
      };

      img.onerror = function () {
        // Fallback for rare images the browser cannot draw into canvas.
        done(originalData);
      };

      img.src = originalData;
    };

    reader.onerror = function () {
      done(null);
    };

    reader.readAsDataURL(file);
  }

  function saveProfile(event) {
    if (event) event.preventDefault();

    const saved = getSavedProfile();
    const currentIcon = saved.avatarIcon || "🌟";

    saved.displayName = displayNameInput?.value.trim() || "Dramagic Star";
    saved.bio = bioInput?.value.trim() || "";
    saved.goal = goalInput?.value.trim() || "";
    saved.favoriteSkill = favoriteSkillInput?.value || "Confidence";
    saved.avatarIcon = currentIcon;
    saved.avatar = saved.avatar || makeAvatar(currentIcon);
    saved.updatedAt = new Date().toISOString();

    const didSave = saveProfileData(saved);
    if (!didSave) return;

    updateLiveText();
    updatePreview(saved.profilePic || saved.avatar, saved.avatarIcon);
    showStatus("Profile saved successfully ✨", "success");
  }

  saved.profilePic = reader.result;
saved.avatar = "";
localStorage.setItem(profileKey, JSON.stringify(saved));

localStorage.setItem("dramagic_profile_picture", reader.result);
localStorage.setItem("dramagic_latest_profile_picture", reader.result);
localStorage.setItem("dramagic_current_profile_picture", reader.result);

  function saveProfileData(profile) {
    const cleanProfile = {
      ...profile,
      displayName: profile.displayName || displayNameInput?.value.trim() || "Dramagic Star",
      bio: profile.bio ?? bioInput?.value.trim() ?? "",
      goal: profile.goal ?? goalInput?.value.trim() ?? "",
      favoriteSkill: profile.favoriteSkill || favoriteSkillInput?.value || "Confidence",
      avatarIcon: profile.avatarIcon || "🌟",
      avatar: profile.avatar || makeAvatar(profile.avatarIcon || "🌟"),
      updatedAt: profile.updatedAt || new Date().toISOString()
    };

    try {
      localStorage.setItem(profileKey, JSON.stringify(cleanProfile));
      localStorage.setItem(currentProfileKey, JSON.stringify(cleanProfile));
      localStorage.setItem("dramagic_profile_picture", cleanProfile.profilePic || cleanProfile.avatar || "");
      localStorage.setItem("dramagic_profile_name", cleanProfile.displayName || "Dramagic Star");
      return true;
    } catch (error) {
      showStatus("This picture is too large to save. Try a smaller photo.", "error");
      return false;
    }
  }

  function updatePreview(src, icon) {
    if (profilePreview) profilePreview.src = src || makeAvatar(icon || "🌟");
  }

  function setAvatarActive(icon) {
    avatarButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.avatar === icon);
    });
  }

  function makeAvatar(icon) {
    const safeIcon = escapeHtml(icon || "🌟");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#8be8ff"/>
            <stop offset="52%" stop-color="#08a9d9"/>
            <stop offset="100%" stop-color="#007aa7"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="12" flood-color="#007aa7" flood-opacity="0.28"/>
          </filter>
        </defs>
        <rect width="220" height="220" rx="72" fill="url(#bg)"/>
        <circle cx="52" cy="42" r="46" fill="rgba(255,255,255,.22)"/>
        <circle cx="170" cy="180" r="64" fill="rgba(255,255,255,.14)"/>
        <circle cx="110" cy="110" r="78" fill="rgba(255,255,255,.18)" filter="url(#shadow)"/>
        <text x="110" y="135" text-anchor="middle" font-family="Arial, sans-serif" font-size="88">${safeIcon}</text>
      </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function getCoachMessage(name, skill) {
    const settings = getAppSettings();

    if (settings.coachTips === false) {
      return `${name}, your profile is ready.`;
    }

    if (settings.coachTone === "energetic") {
      return `${name}, your ${skill} era starts now. Go own the stage! 🚀`;
    }

    if (settings.coachTone === "calm") {
      return `${name}, one small step in ${skill} today is still progress.`;
    }

    return `${name}, Dramagic is cheering for your ${skill} journey.`;
  }

  function applySavedAppSettings() {
    const settings = getAppSettings();
    applyTheme(settings.theme);
    applyAccent(settings.accent);
    document.body.classList.toggle("reduce-motion", settings.reduceMotion === true);
    document.body.classList.toggle("compact-mode", settings.compactMode === true);

    if (settings.theme === "system" && window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        applyTheme("system");
      });
    }
  }

  function applyTheme(theme) {
    const selectedTheme = theme || "light";
    const systemWantsDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = selectedTheme === "dark" || (selectedTheme === "system" && systemWantsDark);

    document.body.classList.toggle("dark-mode", shouldUseDark);
    document.documentElement.classList.toggle("dark-mode", shouldUseDark);
  }

  function applyAccent(accent) {
    const accents = ["blue", "purple", "pink", "green", "gold"];
    accents.forEach((name) => document.body.classList.remove(`accent-${name}`));
    document.body.classList.add(`accent-${accent || "blue"}`);
  }

  function getAppSettings() {
    const defaults = {
      theme: localStorage.getItem("dramagic_theme") || "light",
      accent: "blue",
      reduceMotion: false,
      compactMode: false,
      coachTone: "friendly",
      coachTips: true,
      soundEffects: false,
      language: "english"
    };

    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem("dramagic_settings")) || {}) };
    } catch {
      return defaults;
    }
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("dramagic_demo_session"));
    } catch {
      return null;
    }
  }

  function getSavedProfile() {
    const currentProfile = safeParse(localStorage.getItem(currentProfileKey));
    const sessionProfile = safeParse(localStorage.getItem(profileKey));

    // Session profile wins, but the last chosen profile is used as a fallback.
    return { ...(currentProfile || {}), ...(sessionProfile || {}) };
  }

  function safeParse(value) {
    try {
      return JSON.parse(value) || null;
    } catch {
      return null;
    }
  }

  function showStatus(message, type) {
    if (!profileStatus) return;
    profileStatus.textContent = message;
    profileStatus.className = `status-message ${type || ""}`;

    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(function () {
      profileStatus.textContent = "";
      profileStatus.className = "status-message";
    }, 2600);
  }

  function goBackSafely() {
    if (document.referrer && !document.referrer.includes(window.location.href)) {
      history.back();
      return;
    }

    window.location.href = "index.html";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
