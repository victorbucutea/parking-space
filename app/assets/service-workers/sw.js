self.skipWaiting();

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return true;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-core.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-routing.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-strategies.prod.js');

workbox.routing.registerRoute(
    /.*\.js\??[^oO]/,
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
);

self.addEventListener('notificationclick', function (e) {
    let notification = e.notification;
    let primaryKey = notification.data.primaryKey;
    let action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow(self.location.origin + '/app/index.html#/home/myposts');
        notification.close();
    }
});

self.addEventListener('push', function (e) {
    let options = {
        body: '',
        icon: '/assets/P_letter_sq.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {action: 'Oferta', title: 'Go-Park'},
        ]
    };
    e.waitUntil(
        self.registration.showNotification(e.data.text(), options)
    );
});