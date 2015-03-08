'use strict';

angular.module('ParkingSpaceMobile', ['ionic', 'config', 'angularMoment',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/home.html'
            })
            .state('home.map', {
                url: '/map',
                views: {
                    'content': {
                        templateUrl: "templates/map.html"
                    }
                }
            })
            .state('home.map.post', {
                url: '/post',
                views: {
                    'map-controls': {
                        templateUrl: "templates/post.html"
                    }
                }
            })
            .state('home.map.post.review', {
                url: '/review',
                views: {
                    'review': {
                        templateUrl: "templates/review-post.html"
                    }
                }
            })
            .state('home.map.search', {
                url: '/search',
                views: {
                    'map-controls': {
                        templateUrl: "templates/search.html"
                    }
                }
            })
            .state('home.map.search.place', {
                url: '/place-offer',
                views: {
                    'place-offer': {
                        templateUrl: "templates/place-offer.html"
                    }
                }
            })
            .state('home.myposts', {
                url: '/myposts',
                views: {
                    'content': {
                        templateUrl: "templates/myposts.html"
                    }
                }
            })
            .state('home.myposts.messages', {
                url: '/messages',
                views: {
                    'edit-space': {
                        templateUrl: "templates/review-bids.html"
                    }
                }
            })
            .state('home.myposts.messages.talk', {
                url: '/talk',
                views: {
                    'messages': {
                        templateUrl: "templates/messages.html"
                    }
                }
            })
            .state('home.myposts.edit', {
                url: '/edit',
                views: {
                    'edit-space': {
                        templateUrl: "templates/review-post.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/home/map/search");

    })

    .constant('currencies', [
        {
            name: 'Usd',
            icon: 'fa-usd'
        },
        {
            name: 'Eur',
            icon: 'fa-eur'
        },
        {
            name: 'Ron',
            icon: null
        },
        {
            name: 'Rur',
            icon: 'fa-rub'
        },
        {
            name: 'Gbp',
            icon: 'fa-gbp'
        },
        {
            name: 'Yen',
            icon: 'fa-jpy'
        },
        {
            name: 'Inr',
            icon: 'fa-inr'
        },
        {
            name: 'Ils',
            icon: 'fa-ils'
        },
        {
            name: 'Try',
            icon: 'fa-try'
        },
        {
            name: 'Krw',
            icon: 'fa-krw'
        }
    ])

    .constant('uom', {
        metric: {
            name: 'meters',
            abr: 'm'
        },
        imperial: {
            name: 'feets',
            abr: 'ft'
        }
    }
);

