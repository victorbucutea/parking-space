'use strict';

angular.module('ParkingSpaceMobile', [
    'ui.bootstrap.buttons',
    'ui.router',
    'angular.filter',
    'ParkingSpace',
    'ParkingSpace.filters',
    'ParkingSpaceMobile.controllers'])

    .run(function () {
        // install service worker
        if ('serviceWorker' in navigator) {
            // Use the window load event to keep the page load performant
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', {scope: '/app'});
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            // Stash the event so it can be triggered later.
            window.installPrompt = e;
        });
    })


    .config(function () {
        window.getJsonFromUrl = function (url) {
            var result = {};
            url.split("&").forEach(function (part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            return result;
        }
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login?fbLogin&lat&lng',
                views: {
                    'content': {
                        templateUrl: "templates/login.html"
                    }
                },
                params: {
                    fbLogin: null
                }
            })
            .state('register', {
                url: '/register',
                views: {
                    'content': {
                        templateUrl: "templates/register.html"
                    }
                },
                params: {
                    fromFb: false,
                    email: null,
                    firstName: null,
                    inside: null
                }
            })
            .state('confirm-phone', {
                url: '/confirm-phone',
                views: {
                    'content': {
                        templateUrl: "templates/confirm-phone.html"
                    }
                }
            })
            .state('map', {
                url: '/map?lat&lng&zoom',
                views: {
                    'content': {
                        templateUrl: "templates/map.html"
                    }
                },
                params: {
                    lat: null,
                    lng: null,
                    zoom: null
                }
            })
            .state('map.search', {
                url: '/search',
                views: {
                    'subcontent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })
            .state('map.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/search-help.html"
                    }
                }
            })
            .state('map.search.instructions', {
                url: '/instructions',
                views: {
                    'help': {
                        templateUrl: "templates/search-instructions.html"
                    }
                }
            })
            .state('map.search.terms', {
                url: '/terms',
                views: {
                    'subcontent': {
                        templateUrl: "templates/terms.html"
                    }
                }
            })
            .state('map.search.post-bids', {
                url: '/post-offer?spaceId&start&stop',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-offer.html"
                    }
                },
                params: {
                    spaceId: null,
                    start: null,
                    stop: null
                }
            })
            .state('map.search.post-bids.pay', {
                url: '/pay',
                views: {
                    'pay': {
                        templateUrl: 'templates/pay.html'
                    }
                },
                params: {
                    offer: null,
                    space: null
                }
            })
            .state('map.search.review-bids', {
                url: '/review-bid?spaceId',
                views: {
                    'place-bid': {
                        templateUrl: "templates/review-offers.html"
                    }
                },
                params: {
                    spaceId: null
                }
            })
            .state('map.search.post', {
                url: '/post?spaceId',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-space.html"
                    }
                },
                params: {
                    spaceId: null
                }
            })
            .state('map.myposts', {
                url: '/myposts',
                views: {
                    'subcontent': {templateUrl: "templates/my-posts.html"}
                }
            })
            .state('map.myposts.post', {
                url: '/post?spaceId',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-space.html"
                    }
                },
                params: {
                    spaceId: null
                }
            })
            .state('map.myoffers', {
                url: '/myoffers',
                views: {
                    'subcontent': {
                        templateUrl: "templates/my-offers.html"
                    }
                }
            })
            .state('map.myoffers.pay', {
                url: '/pay',
                views: {
                    'pay': {
                        templateUrl: "templates/pay.html"
                    }
                },
                params: {
                    offer: null,
                    space: null
                }
            })
            .state('account', {
                url: "/account",
                views: {
                    'content': {
                        templateUrl: "templates/account.html"
                    },
                }
            })
            .state('account.payments', {
                url: "/payments",
                views: {
                    'financial': {
                        templateUrl: "templates/payments.html"
                    }
                }
            })
            .state('account.withdrawals', {
                url: "/withdrawals",
                views: {
                    'financial': {
                        templateUrl: "templates/withdrawals.html"
                    }
                }
            });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            if ($location.$$hash.indexOf("token") !== -1 && $location.$$hash.indexOf("state") !== -1) {
                let token = getJsonFromUrl($location.$$hash).access_token;
                sessionStorage.setItem("fb_token", token);
                // sucessful response from fb
                return "/login?fbLogin=ok";
            } else if ($location.absUrl().indexOf("user_denied")) {
                return "/login?fbLogin=user_denied";
            } else if ($location.absUrl().indexOf("error")) {
                return "/login?fbLogin=err";
            }

            return "/search";
        });

    }])

    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel):/);
    }])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(function () {
            return {
                'request': function (config) {
                    if (config.url.indexOf('html') !== -1) {
                        return config; // do not interfere with router
                    }
                    let loading = $('#loading-progress');
                    loading.removeClass('loading-done');
                    loading.css('width', '100%');
                    return config;
                },
                'response': function (response) {
                    if (response.config.url.indexOf('html') !== -1) {
                        return response; // do not interfere with router
                    }
                    let loading = $('#loading-progress');
                    loading.addClass('loading-done');
                    setTimeout(() => {
                        loading.css('width', 0);
                    }, 500);
                    return response;
                }
            };
        });

        $httpProvider.useApplyAsync(true);
    }])

;

angular.module('ParkingSpaceMobile.controllers', []);
angular.module('ParkingSpaceMobile.filters', []);

