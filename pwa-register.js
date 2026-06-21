/* Dramagic PWA Registration */
(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function (registration) {
        // Ask the browser to check for new website files after opening.
        registration.update().catch(function () {});
        console.log("Dramagic PWA is ready.");
      })
      .catch(function (error) {
        console.warn("Dramagic PWA registration failed:", error);
      });
  });
})();
