'use strict';
angular.module('ParkingSpaceMobile.controllers', []);

angular.module('ParkingSpaceMobile', [
    'config',
    'ezfb',
    'cleave.js',
    'ui.router',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

    .run(function (ENV, $http, $rootScope) {

        function HtmlMarker(space, scope) {
            this.price = space.price;
            this.space = space;
            this.currency = space.currency;
            this.noOfPlaces = 1;
            this.scope = scope;
            this.pos = new google.maps.LatLng(space.location_lat, space.location_long);
            this.setMap($rootScope.map);
        }

        HtmlMarker.prototype = new google.maps.OverlayView();

        HtmlMarker.prototype.onRemove = function () {
            this._div.parentNode.removeChild(this._div);
            this._div = null;
        };

        //init your html element here
        HtmlMarker.prototype.onAdd = function () {
            let _this = this;
            let div = document.createElement('DIV');
            div.className = "html-marker";
            if ( !this.space.public ) {
                div.className = "html-marker private";
            }
            $(div).on('click', function (evt) {
                _this.scope.markerClick({elm: _this});
                evt.preventDefault();
                evt.stopPropagation();
            });
            div.innerHTML = '<div>' + this.price + ' ' + this.currency + ' </div>';
            let panes = this.getPanes();
            panes.overlayImage.appendChild(div);
            this._div = div;
        };

        HtmlMarker.prototype.draw = function () {
            let overlayProjection = this.getProjection();
            let position = overlayProjection.fromLatLngToDivPixel(this.pos);
            this._div.style.left = position.x - 20 + 'px';
            this._div.style.top = position.y - 45 + 'px';
        };
        window.HtmlMarker = HtmlMarker;


    })

    .config(function ($stateProvider, $urlRouterProvider) {
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
                    hide_blanket: false
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
                    hide_blanket: false,
                    fromFb: false,
                    email: null,
                    firstName: null,
                    fbId: null,
                    token: null
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
            .state('home.map.search.post-bids', {
                url: '/post-bid',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-offer.html"
                    }
                }
            })
            .state('home.map.search.review-bids', {
                url: '/review-bid',
                views: {
                    'place-bid': {
                        templateUrl: "templates/review-offers.html"
                    }
                }
            })
            .state('home.map.search.post', {
                url: '/post',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-space.html"
                    }
                }
            })
            .state('home.myposts', {
                url: '/myposts',
                views: {
                    'content': {
                        templateUrl: "templates/my-posts.html"
                    },
                    'my-menu': {
                        templateUrl: "templates/my-menu.html"
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
            .state('home.myposts.user', {
                url: '/user/{user_id}',
                views: {
                    'edit-user': {
                        templateUrl: "templates/user.html"
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
                        templateUrl: "templates/my-menu.html"
                    }
                }
            })
            .state('home.help', {
                url: '/help',
                views: {
                    'help': {
                        templateUrl: "templates/my-offers-help.html"
                    }
                }
            })
            .state('home.talk', {
                url: '/talk?offer',
                views: {
                    'messages': {
                        templateUrl: "templates/messages.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/home/map/search/");

    })

    .config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel):/);
    })

    .config(function (ezfbProvider) {
        var myInitFunction = function ($window, $rootScope) {
            $window.FB.init({
                appId: '1725456304415807',
                version: 'v2.6'
            });
        };

        ezfbProvider.setInitFunction(myInitFunction);
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

    .constant('uom`', {
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

