// sw.js - Service Worker
const CACHE_NAME = "badminton-calc-v1.2";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/Badmintonlogo.png",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      // Cache hanya file yang penting
      return cache
        .addAll([
          "/",
          "/index.html",
          "/style.css",
          "/script.js",
          "/manifest.json",
          "/Badmintonlogo.png",
        ])
        .catch((err) => {
          console.log("Cache addAll failed:", err);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
