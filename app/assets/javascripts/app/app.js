'use strict';
angular.module('ParkingSpaceMobile.controllers', []);

angular.module('ParkingSpaceMobile', [
    'config',
    'ezfb',
    'cleave.js',
    'ui.bootstrap.buttons',
    'ui.router',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

// todo map should keep initial position after navigation
// todo fix location information
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
            console.log('prompting to install !');
            e.prompt();
            // Stash the event so it can be triggered later.
            window.installPrompt = e;
        });
    })

    .run(['$http', '$rootScope', function ($http, $rootScope) {

        if (!window.google || !window.google.maps) return;

        function HtmlMarker(space, scope, nearestOffer) {
            this.price = space.price;
            this.space = space;
            this.nearestOffer = nearestOffer;
            this.currency = space.currency;
            this.noOfPlaces = 1;
            this.scope = scope;
            this.pos = new google.maps.LatLng(space.location_lat, space.location_long);
            this.setMap($rootScope.map);
        }

        HtmlMarker.prototype = new google.maps.OverlayView();

        HtmlMarker.prototype.onRemove = function () {
            if (!this._div) return;
            this._div.parentElement.removeChild(this._div);
            this._div = null;
        };

        //init your html element here
        HtmlMarker.prototype.onAdd = function () {
            let _this = this;
            let div = document.createElement('DIV');
            div.className = "html-marker";
            if (!this.space.public) {
                div.className = "html-marker private";
                if (this.space.owner_is_current_user) {
                    div.className += " owner";
                }
            }
            $(div).on('click touchstart', function (evt) {
                _this.scope.markerClick({elm: _this});
                evt.preventDefault();
                evt.stopPropagation();
            });
            if (!this.nearestOffer) {
                div.innerHTML = '<div>' + this.price + ' ' + this.currency + ' <small> / h </small> </div>';
            } else {
                this.markReservationActive(div);
            }
            let panes = this.getPanes();
            panes.overlayImage.appendChild(div);
            this._div = div;
        };

        HtmlMarker.prototype.markReservationActive = function (div) {
            let st = moment(this.nearestOffer.start_date);
            let end = moment(this.nearestOffer.end_date);
            let now = moment();
            let text = '';
            if (end.isBefore(now)) {
                return;
            }

            text = st.fromNow();

            if (end.isAfter(now) && st.isBefore(now)) {
                text = ' în curs';
            }


            let rezHtml =
                '<div>' + this.price + ' ' + this.currency + ' <small> / h </small>  <br/>' +
                '<small class="text-secondary"> <i class="fa fa-flash"></i> Rez. ' + text + ' </small>' +
                '</div>';
            div.innerHTML = rezHtml;
        };

        HtmlMarker.prototype.draw = function () {
            let overlayProjection = this.getProjection();
            let position = overlayProjection.fromLatLngToDivPixel(this.pos);
            this._div.style.left = position.x - 20 + 'px';
            this._div.style.top = position.y - 45 + 'px';
        };
        window.HtmlMarker = HtmlMarker;

    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/home.html'
            })
            .state('home.login', {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: "templates/login.html"
                    }
                },
                params: {
                    lng: null,
                    lat: null
                }
            })
            .state('home.register', {
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
                    fbId: null,
                    token: null,
                    lat: null,
                    lng: null
                }
            })
            .state('home.search', {
                url: '/search?lat&lng&zoom',
                views: {
                    'content': {
                        templateUrl: "templates/search.html"
                    },
                    "my-menu": {
                        templateUrl: "templates/nav-bar.html"
                    },
                    "left-side-menu": {
                        templateUrl: "templates/left-side-menu.html"
                    }
                },
                params: {
                    lat: null,
                    lng: null,
                    zoom: null
                }
            })
            .state('home.search.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/search-help.html"
                    }
                }
            })
            .state('home.search.instructions', {
                url: '/instructions',
                views: {
                    'help': {
                        templateUrl: "templates/search-instructions.html"
                    }
                }
            })
            .state('home.search.confirm-phone', {
                url: '/confirm-phone',
                views: {
                    'place-bid': {
                        templateUrl: "templates/confirm-phone.html"
                    }
                }
            })
            .state('home.search.terms', {
                url: '/terms',
                views: {
                    'place-bid': {
                        templateUrl: "templates/terms.html"
                    }
                }
            })
            .state('home.search.post-bids', {
                url: '/post-offer',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-offer.html"
                    }
                }
            })
            .state('home.search.post-bids.pay', {
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
            .state('home.search.review-bids', {
                url: '/review-bid',
                views: {
                    'place-bid': {
                        templateUrl: "templates/review-offers.html"
                    }
                }
            })
            .state('home.search.post', {
                url: '/post',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-space.html"
                    }
                }
            })
            .state('home.search.review-bids.delete', {
                url: '/delete/{parking_space_id}',
                views: {
                    'action': {
                        templateUrl: "templates/delete-post.html"
                    }
                }
            })
            .state('home.search.review-bids.edit', {
                url: '/edit/{parking_space_id}',
                views: {
                    'action': {
                        templateUrl: "templates/post-space.html"
                    }
                }
            })
            .state('home.search.myaccount', {
                url: '/myaccount',
                views: {
                    'place-bid': {
                        templateUrl: "templates/register.html"
                    }
                },
                params: {
                    inside: true
                }
            })
            .state('home.myposts', {
                url: '/myposts',
                views: {
                    'content': {
                        templateUrl: "templates/my-posts.html"
                    },
                    "my-menu": {
                        templateUrl: "templates/nav-bar.html"
                    },
                    'left-side-menu': {
                        templateUrl: "templates/my-posts-side.html"
                    }
                }
            })
            .state('home.myposts.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/my-posts-help.html"
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
            .state('home.myposts.edit', {
                url: '/edit/{parking_space_id}',
                views: {
                    'edit-space': {
                        templateUrl: "templates/post-space.html"
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
                        templateUrl: "templates/my-offers.html"
                    },
                    'my-menu': {
                        templateUrl: "templates/nav-bar.html"
                    },
                    'left-side-menu': {
                        templateUrl: "templates/my-offers-side.html"
                    }
                }
            })
            .state('home.myoffers.pay', {
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
            .state('home.account', {
                url: "/account",
                views: {
                    'content': {
                        templateUrl: "templates/account.html"
                    },
                    'left-side-menu': {
                        templateUrl: "templates/account-side.html"
                    }
                }
            })
            .state('home.account.payments', {
                url: "/payments",
                views: {
                    'financial': {
                        templateUrl: "templates/payments.html"
                    }
                }
            })
            .state('home.account.withdrawals', {
                url: "/withdrawals",
                views: {
                    'financial': {
                        templateUrl: "templates/withdrawals.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/home/search");

    }])

    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel):/);
    }])

    .config(['ezfbProvider', function (ezfbProvider) {
        var myInitFunction = function ($window, $rootScope) {
            $window.FB.init({
                appId: '1725456304415807',
                version: 'v2.6'
            });
        };

        ezfbProvider.setInitFunction(myInitFunction);
    }])


    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    let loading = $('#loading-progress');
                    loading.removeClass('loading-done');
                    loading.css('width', '100%');
                    return config;
                },
                'response': function (response) {
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

    .config(function () {
        window.isMobileOrTablet = function () {
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            }
            else {
                return false;
            }
        };
    })
    .constant('currencies', [
        {
            name: 'Usd',
            label: "Usd / h",
            icon: 'fa-usd'
        },
        {
            name: 'Eur',
            label: "Eur / h",
            icon: 'fa-eur'
        },
        {
            name: 'Ron',
            label: "Ron / h",
            icon: null
        },
        {
            name: 'Rur',
            label: "Rur / h",
            icon: 'fa-rub'
        },
        {
            name: 'Gbp',
            label: "Gbp / h",
            icon: 'fa-gbp'
        },
        {
            name: 'Yen',
            label: "Yen / h",
            icon: 'fa-jpy'
        },
        {
            name: 'Inr',
            label: "Inr / h",
            icon: 'fa-inr'
        },
        {
            name: 'Ils',
            label: "Ils / h",
            icon: 'fa-ils'
        },
        {
            name: 'Try',
            label: "Try / h",
            icon: 'fa-try'
        },
        {
            name: 'Krw',
            label: "Krw / h",
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
    })
;

