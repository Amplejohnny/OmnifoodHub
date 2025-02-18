const CACHE_NAME = "omnifood-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/site.webmanifest",
  "/img/favicon/android-chrome-192x192.png",
  "/img/favicon/android-chrome-512x512.png",
  "/css/style.css",
  "/css/general.css",
  "/css/queries.css",
  "/js/script.js",
];

// Install event - Cache essential resources
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event - Serve from cache when offline
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
