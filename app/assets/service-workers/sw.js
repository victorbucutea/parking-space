self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-core.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-routing.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-strategies.prod.js');

self.addEventListener("fetch", function(event) {});

workbox.routing.registerRoute(
    new RegExp('.*\.js[^o]'),
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'js-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('.*/image/.*/logo.*png$'),
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'img-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('.*/.woff2'),
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'img-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('.*\.css'),
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'css-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'html-cache',
    })
);
/*
self.addEventListener('message', function (ev) {
    if (ev.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});*/

