const CACHE_NAME = "ecommerce-v2";
const STATIC_FILES = [
    "/",
    "/index.html",
    "/catalog.html",
    "/login.html",
    "/register.html",
    "/profile.html",
    "/checkout.html",
    "/admin.html",
    "/css/style.css",
    "/js/api.js",
    "/js/auth.js",
    "/js/ui.js",
    "/js/catalog.js",
    "/js/cart.js",
    "/js/admin.js",
    "/js/reviews.js",
    "/js/offline.js"
];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_FILES)));
});

self.addEventListener("fetch", e => {
    const url = e.request.url;

    // Cache para API real
    if (url.includes("fakestoreapi.com")) {
        e.respondWith(
        fetch(e.request)
            .then(res => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            return res;
            })
            .catch(() => caches.match(e.request))
        );
        return;
    }

    // Cache para archivos locales
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
