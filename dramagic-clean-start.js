(function () {
  const CLEAN_VERSION_KEY = "dramagic_backend_ready_cleanup_v2";

  function removeLocalStorageKey(key) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }

  function clearMatchingLocalStorage() {
    const exactKeys = new Set([
      "dramagic_demo_session",
      "dramagic_demo_registered_users",
      "dramagic_selected_parent_child",
      "presentacy_students",
      "presentacy_student",
      "presentacy_class",
      "presentacy_role",
      "dramagic_memories_role",
      "dramagic_memories_class",
      "dramagic_attendance_settings"
    ]);

    const prefixes = [
      "dramagic_wordle_v",
      "presentacy_recent_topics_",
      "dramagic_demo_",
      "dramagic_attendance_demo_"
    ];

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      if (exactKeys.has(key) || prefixes.some((prefix) => key.startsWith(prefix))) {
        removeLocalStorageKey(key);
      }
    }
  }

  function clearOldIndexedDB() {
    if (!("indexedDB" in window)) return;
    [
      "dramagic_attendance_demo_db_v7_safe_sync",
      "dramagic_attendance_by_name_db_v1",
      "dramagic_attendance_backend_ready_v1"
    ].forEach((name) => {
      try { indexedDB.deleteDatabase(name); } catch { /* ignore */ }
    });
  }

  try {
    if (localStorage.getItem(CLEAN_VERSION_KEY) === "done") return;
    clearMatchingLocalStorage();
    clearOldIndexedDB();
    localStorage.setItem(CLEAN_VERSION_KEY, "done");
  } catch {
    // The website must still load if localStorage is blocked.
  }
})();
