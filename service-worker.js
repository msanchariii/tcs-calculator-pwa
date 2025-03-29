const CACHE_NAME = "pwa-calculator-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icon-512.png",
    "/icon-192.png",
    "/css/calclayout.css",
    "/js/jquery-1.8.0.min.js",
    "/js/jquery-ui.min.js",
    "/js/oscZenoedited.js",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).catch((error) => {
                console.log("Failed to cache:", error);
            });
        })
    );
});

self.addEventListener("fetch", (event) => {
    // Network first, fallback to cache strategy
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache the response if it's successful
                if (event.request.method === "GET") {
                    const responseToCache = response.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) =>
                            cache.put(event.request, responseToCache)
                        );
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
