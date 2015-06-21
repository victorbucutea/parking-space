'use strict';
angular.module('ParkingSpaceMobile.controllers', []);

angular.module('ParkingSpaceMobile', [
    'ionic', 'config',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

    .run(function () {



        function onDeviceReady() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            var pushNotification = window.plugins.pushNotification;
            var deviceId = window.cordova.platformId;
            if (deviceId == 'android' || deviceId == 'Android') {
                try {
                    pushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            "senderID": "889259686632",
                            "ecb": "window.onNotification"
                        });
                } catch (err) {
                    var txt = "There was an error on this page.\n\n";
                    txt += "Error description: " + err.message + "\n\n";
                    console.error(txt, err);
                }
            }

            function successHandler(result) {
                console.log("Success", result);
            }

            function errorHandler(error) {
                console.error("Error", error);

            }

        }

        document.addEventListener('deviceready', onDeviceReady, true);
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/home.html'
            })
            .state('home.register', {
                url: '/register',
                views: {
                    'content': {
                        templateUrl: "templates/register.html"
                    }
                },
                params: {
                    hide_blanket: false
                }
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
            .state('home.map.post.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/post-help.html"
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
            .state('home.map.post.review.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/review-post-help.html"
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
            .state('home.map.search.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/search-help.html"
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
            .state('home.map.search.place.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/place-offer-help.html"
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
            .state('home.myposts.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/myposts-help.html"
                    }
                }
            })
            .state('home.myposts.bids', {
                url: '/bids/{parking_space_id}',
                views: {
                    'edit-space': {
                        templateUrl: "templates/review-bids.html"
                    }
                }
            })
            .state('home.myposts.bids.talk', {
                url: '/talk?offer',
                views: {
                    'messages': {
                        templateUrl: "templates/messages.html"
                    }
                }
            })
            .state('home.myposts.edit', {
                url: '/edit/{parking_space_id}',
                views: {
                    'edit-space': {
                        templateUrl: "templates/review-post.html"
                    }
                }
            })
            .state('home.myposts.delete', {
                url: '/delete/{parking_space_id}',
                views: {
                    'edit-space': {
                        templateUrl: "templates/delete-post.html"
                    }
                }
            })
            .state('home.myoffers', {
                url: '/myoffers',
                views: {
                    'content': {
                        templateUrl: "templates/myoffers.html"
                    }
                }
            })
            .state('home.myoffers.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/myoffers-help.html"
                    }
                }
            })
            .state('home.myoffers.talk', {
                url: '/talk?offer',
                views: {
                    'messages': {
                        templateUrl: "templates/messages.html"
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

