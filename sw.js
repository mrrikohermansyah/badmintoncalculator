// sw.js - Service Worker untuk Badminton Calculator
const CACHE_NAME = "badminton-calc-v1.1";
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
      // Gunakan cache.add() instead of cache.addAll() untuk handle error individual
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            console.log(`Failed to cache ${url}:`, err);
          });
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
