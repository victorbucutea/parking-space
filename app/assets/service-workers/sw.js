
self.skipWaiting();

self.addEventListener('fetch', function (evt) {
    console.log('fetch',evt)
});
/*
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-core.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-routing.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-strategies.prod.js');


workbox.routing.registerRoute(
    /.*\.js[^o]/,
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'js-cache',
    })
);


workbox.routing.registerRoute(
    /.*!\/image\/.*!\/logo.*png$/g,
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'img-cache',
    })
);


workbox.routing.registerRoute(
    /.*\.css/g,
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'css-cache',
    })
);

workbox.routing.registerRoute(
    /.*\.html/,
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'html-cache',
    })
);*/

/*
self.addEventListener('message', function (ev) {
    if (ev.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});*/

