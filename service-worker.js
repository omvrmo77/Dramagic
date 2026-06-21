/* Dramagic PWA Service Worker
   Installable app support + safe offline fallback.
   Strategy: network first, then cache, so new uploads do not get stuck behind old cached files.
*/
const CACHE_NAME = "dramagic-pwa-v20260621-1";
const OFFLINE_URL = "./offline.html";
const APP_SHELL = [
  "./",
  "./agenda.css",
  "./agenda.html",
  "./agenda.js",
  "./assets/icons/icon-128.png",
  "./assets/icons/icon-144.png",
  "./assets/icons/icon-150.png",
  "./assets/icons/icon-16.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-256.png",
  "./assets/icons/icon-32.png",
  "./assets/icons/icon-384.png",
  "./assets/icons/icon-48.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-72.png",
  "./assets/icons/icon-96.png",
  "./assets/icons/maskable-icon-192.png",
  "./assets/icons/maskable-icon-512.png",
  "./attendance.css",
  "./attendance.html",
  "./attendance.js",
  "./auth.html",
  "./chat-missions.html",
  "./chat.css",
  "./chat.html",
  "./chat.js",
  "./clear-dramagic-cache.html",
  "./dramagic-clean-start.js",
  "./dramagic-global-settings.css",
  "./dramagic-logo.png",
  "./dramagic-nav.css",
  "./dramagic-nav.js",
  "./dramagic-settings-loader.js",
  "./favicon.ico",
  "./finance-entry.css",
  "./finance-entry.html",
  "./finance-entry.js",
  "./finance.css",
  "./finance.html",
  "./finance.js",
  "./game.css",
  "./game.html",
  "./game.js",
  "./guest.html",
  "./guest.js",
  "./index.css",
  "./index.html",
  "./indexdark.html",
  "./indexlight.html",
  "./manifest.json",
  "./media.css",
  "./media.html",
  "./media.js",
  "./offline.html",
  "./presentacy.css",
  "./presentacy.html",
  "./presentacy.js",
  "./profile.css",
  "./profile.html",
  "./profile.js",
  "./qr-cards.css",
  "./qr-cards.html",
  "./qr-cards.js",
  "./script.js",
  "./settings.css",
  "./settings.html",
  "./settings.js",
  "./students.csv",
  "./styles.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const fresh = await fetch(request);
    if (fresh && fresh.status === 200 && request.url.startsWith(self.location.origin)) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      return cache.match(OFFLINE_URL) || cache.match("./index.html");
    }

    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) return;

  event.respondWith(networkFirst(event.request));
});
