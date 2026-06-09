/* Dramagic global settings loader
   Add this file to EVERY page before </body>:
   <script src="dramagic-settings-loader.js" defer></script>
*/
(function () {
  const DEFAULT_SETTINGS = {
    theme: localStorage.getItem("dramagic_theme") || "light",
    accent: "blue",
    reduceMotion: false,
    compactMode: false,
    coachTone: "friendly",
    coachTips: true,
    soundEffects: false,
    language: "english"
  };

  function getSettings() {
    try {
      return {
        ...DEFAULT_SETTINGS,
        ...(JSON.parse(localStorage.getItem("dramagic_settings")) || {})
      };
    } catch (error) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function shouldUseDark(theme) {
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return theme === "dark" || (theme === "system" && systemDark);
  }

  function applySettings() {
    const settings = getSettings();
    const dark = shouldUseDark(settings.theme);
    const accents = ["blue", "purple", "pink", "green", "gold"];

    document.documentElement.classList.toggle("dark-mode", dark);
    document.body?.classList.toggle("dark-mode", dark);

    accents.forEach((accent) => {
      document.documentElement.classList.remove(`accent-${accent}`);
      document.body?.classList.remove(`accent-${accent}`);
    });

    document.documentElement.classList.add(`accent-${settings.accent || "blue"}`);
    document.body?.classList.add(`accent-${settings.accent || "blue"}`);

    document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion === true);
    document.body?.classList.toggle("reduce-motion", settings.reduceMotion === true);

    document.documentElement.classList.toggle("compact-mode", settings.compactMode === true);
    document.body?.classList.toggle("compact-mode", settings.compactMode === true);

    document.documentElement.dataset.coachTone = settings.coachTone || "friendly";
    document.documentElement.dataset.language = settings.language || "english";
  }

  applySettings();

  document.addEventListener("DOMContentLoaded", applySettings);
  window.addEventListener("storage", applySettings);

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applySettings);
  }

  window.DramagicSettings = {
    get: getSettings,
    apply: applySettings
  };
})();
