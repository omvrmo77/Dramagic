document.addEventListener("DOMContentLoaded", function () {
  const themeSelect = document.getElementById("themeSelect");
  const accentSelect = document.getElementById("accentSelect");
  const reduceMotionToggle = document.getElementById("reduceMotionToggle");
  const compactModeToggle = document.getElementById("compactModeToggle");
  const coachToneSelect = document.getElementById("coachToneSelect");
  const coachTipsToggle = document.getElementById("coachTipsToggle");
  const soundEffectsToggle = document.getElementById("soundEffectsToggle");
  const languageSelect = document.getElementById("languageSelect");
  const resetSettingsBtn = document.getElementById("resetSettingsBtn");
  const logoutSettingsBtn = document.getElementById("logoutSettingsBtn");
  const settingsStatus = document.getElementById("settingsStatus");
  const backBtn = document.getElementById("backBtn");

  const defaultSettings = {
    theme: localStorage.getItem("dramagic_theme") || "light",
    accent: "blue",
    reduceMotion: false,
    compactMode: false,
    coachTone: "friendly",
    coachTips: true,
    soundEffects: false,
    language: "english"
  };

  initSettings();

  function initSettings() {
    const settings = getSettings();

    fillControls(settings);
    applySettings(settings);

    themeSelect?.addEventListener("change", saveFromControls);
    accentSelect?.addEventListener("change", saveFromControls);
    reduceMotionToggle?.addEventListener("change", saveFromControls);
    compactModeToggle?.addEventListener("change", saveFromControls);
    coachToneSelect?.addEventListener("change", saveFromControls);
    coachTipsToggle?.addEventListener("change", saveFromControls);
    soundEffectsToggle?.addEventListener("change", saveFromControls);
    languageSelect?.addEventListener("change", saveFromControls);
    resetSettingsBtn?.addEventListener("click", resetSettings);
    logoutSettingsBtn?.addEventListener("click", logout);
    backBtn?.addEventListener("click", goBackSafely);

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (getSettings().theme === "system") applySettings(getSettings());
      });
    }
  }

  function fillControls(settings) {
    if (themeSelect) themeSelect.value = settings.theme;
    if (accentSelect) accentSelect.value = settings.accent;
    if (reduceMotionToggle) reduceMotionToggle.checked = settings.reduceMotion;
    if (compactModeToggle) compactModeToggle.checked = settings.compactMode;
    if (coachToneSelect) coachToneSelect.value = settings.coachTone;
    if (coachTipsToggle) coachTipsToggle.checked = settings.coachTips;
    if (soundEffectsToggle) soundEffectsToggle.checked = settings.soundEffects;
    if (languageSelect) languageSelect.value = settings.language;
  }

  function saveFromControls() {
    const settings = {
      theme: themeSelect?.value || "light",
      accent: accentSelect?.value || "blue",
      reduceMotion: reduceMotionToggle?.checked || false,
      compactMode: compactModeToggle?.checked || false,
      coachTone: coachToneSelect?.value || "friendly",
      coachTips: coachTipsToggle?.checked !== false,
      soundEffects: soundEffectsToggle?.checked || false,
      language: languageSelect?.value || "english"
    };

    saveSettings(settings);
    applySettings(settings);
    showStatus("Settings saved ✨", "success");
  }

  function applySettings(settings) {
    applyTheme(settings.theme);
    applyAccent(settings.accent);

    document.body.classList.toggle("reduce-motion", settings.reduceMotion === true);
    document.body.classList.toggle("compact-mode", settings.compactMode === true);
    document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion === true);
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

  function getSettings() {
    try {
      return { ...defaultSettings, ...(JSON.parse(localStorage.getItem("dramagic_settings")) || {}) };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem("dramagic_settings", JSON.stringify(settings));

    // Keep this old key too, because profile.js and any older pages may already read it.
    localStorage.setItem("dramagic_theme", settings.theme);
  }

  function resetSettings() {
    const confirmed = confirm("Reset your Dramagic settings to default?");
    if (!confirmed) return;

    const settings = {
      theme: "light",
      accent: "blue",
      reduceMotion: false,
      compactMode: false,
      coachTone: "friendly",
      coachTips: true,
      soundEffects: false,
      language: "english"
    };

    saveSettings(settings);
    fillControls(settings);
    applySettings(settings);
    showStatus("Settings reset successfully.", "success");
  }

  function logout() {
    const confirmed = confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("dramagic_demo_session");
    window.location.href = "index.html";
  }

  function showStatus(message, type) {
    if (!settingsStatus) return;
    settingsStatus.textContent = message;
    settingsStatus.className = `status-message ${type || ""}`;

    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(function () {
      settingsStatus.textContent = "";
      settingsStatus.className = "status-message";
    }, 2600);
  }

  function goBackSafely() {
    if (document.referrer && !document.referrer.includes(window.location.href)) {
      history.back();
      return;
    }

    window.location.href = "index.html";
  }
});
