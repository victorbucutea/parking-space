
self.skipWaiting();


self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-core.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-routing.prod.js');
self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-strategies.prod.js');

self.importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
self.importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');


workbox.routing.registerRoute(
    /.*\.js[^o]?/,
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

/*
self.addEventListener('message', function (ev) {
    if (ev.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});*/




firebase.initializeApp({
    'messagingSenderId': '1036383532323'
});

var messaging = firebase.messaging();

// If you would like to customize notifications that are received in the background
// (Web app is closed or not in browser focus) then you should implement this optional method

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
        body: 'Background Message body.'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('https://go-park-staging.herokuapp.com');
        notification.close();
    }
});
