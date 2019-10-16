'use strict';

angular.module('ParkingSpaceMobile', [
    'cleave.js',
    'ui.bootstrap.buttons',
    'ui.router',
    'angular.filter',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

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

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(function () {
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

    .run(['$http', '$rootScope', function ($http, $rootScope) {

        if (!window.google || !window.google.maps) return;

        function HtmlMarker(cluster, scope) {
            this.spaces = cluster.elements.map((elm) => {
                return elm[2];
            });
            this.scope = scope;
            this.pos = new google.maps.LatLng(cluster.centroid[0], cluster.centroid[1]);
            this.setMap($rootScope.map);
        }

        HtmlMarker.prototype = new google.maps.OverlayView();

        HtmlMarker.prototype.onRemove = function () {
            if (!this._div) return;
            this._div.parentElement.removeChild(this._div);
            this._div = null;
        };

        HtmlMarker.prototype.onAdd = function () {
            let _this = this;
            let div = document.createElement('DIV');

            div.className = "html-marker";
            let noOfSpaces = this.spaces.length;
            let owned = noOfSpaces === this.spaces.filter((e) => {
                return e.owner_is_current_user
            }).length;
            let from_user = noOfSpaces === this.spaces.filter((e) => {
                return e.from_user
            }).length;

            if (owned) {
                div.className += " owner";
            }

            let noOfSp = noOfSpaces + (noOfSpaces === 1 ? ' loc' : ' locuri');
            div.innerHTML = '<div>' + noOfSp +
                '    <br/>' +
                '   <small class="text-secondary">' +
                '        ' + this.getPrice() + ' / h ' +
                '   </small>' +
                '</div>';

            if (from_user) {
                div.className += " private";
                if (noOfSpaces === 1) {
                    this.markReservationActive(div);
                }
            } else {
                div.className += " public";
            }


            $(div).on('click touchstart', function (evt) {
                if (noOfSpaces > 1) {
                    let zoom = _this.getMap().getZoom();
                    if (zoom >= 20) {
                        _this.scope.markerClick(_this.spaces, true);
                        return;
                    }
                    _this.getMap().setCenter(_this.pos);
                    let lats = [];
                    _this.spaces.forEach((sp) => {
                        lats.push([sp.location_lat, sp.location_long, sp]);
                    });
                    let zoomLvl = $rootScope.map.zoom;
                    let zoomFactor = (22 - zoomLvl) / 5;
                    let zoomIn = 2;

                    let cluster = geocluster(lats, (zoomFactor + 1));
                    if (cluster.length >= 2 ){
                        zoomIn += 2;
                    }
                    console.log(cluster);


                    _this.getMap().setZoom(zoomLvl + zoomIn);

                    return;
                }
                _this.scope.markerClick(_this.spaces[0]);
                evt.preventDefault();
                evt.stopPropagation();
            });

            let panes = this.getPanes();
            panes.overlayImage.appendChild(div);
            this._div = div;
        };

        HtmlMarker.prototype.markReservationActive = function (div) {
            if (this.spaces > 1) return;

            let space = this.spaces[0];

            let nearestOffer = space.offers.find((of) => {
                if (!of.owner_is_current_user) return false;
                return moment(of.end_date).isAfter(moment());
            });

            if (!nearestOffer) return;

            let st = moment(nearestOffer.start_date);
            let end = moment(nearestOffer.end_date);
            let now = moment();
            let text;
            if (end.isBefore(now)) {
                return;
            }

            text = st.fromNow();

            if (end.isAfter(now) && st.isBefore(now)) {
                text = ' în curs';
            }


            let rezHtml =
                '<div>' + this.getPrice() +
                '   <small> / h </small> ' +
                '   <br/>' +
                '   <small class="text-secondary">' +
                '       <i class="fa fa-flash"></i> ' +
                '       Rez. ' + text + ' ' +
                '   </small>' +
                '</div>';

            div.innerHTML = rezHtml;
        };

        HtmlMarker.prototype.getPrice = function () {
            let prices = [];
            let curr;
            this.spaces.forEach((space) => {
                prices.push(space.price);
                curr = space.currency;
            });
            prices.sort();
            if (prices[0] === prices[prices.length - 1]) {
                return prices[0] + " " + curr;
            } else {
                return prices[0] + "-" + prices[prices.length - 1] + " " + curr;
            }
        };

        HtmlMarker.prototype.draw = function () {
            let overlayProjection = this.getProjection();
            let position = overlayProjection.fromLatLngToDivPixel(this.pos);
            this._div.style.left = position.x - 20 + 'px';
            this._div.style.top = position.y - 45 + 'px';
        };
        window.HtmlMarker = HtmlMarker;

    }])

    .config(function () {

        if (typeof (Number.prototype.toRad) === "undefined") Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        };


        function geocluster(elements, bias) {
            if (!(this instanceof geocluster)) return new geocluster(elements, bias);
            return this._cluster(elements, bias);
        };

        // geodetic distance approximation
        geocluster.prototype._dist = function (lat1, lon1, lat2, lon2) {
            var dlat = (lat2 - lat1).toRad();
            var dlon = (lon2 - lon1).toRad();
            var a = (Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()));
            return (Math.round(((2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 6371) * 100) / 100);
        };

        geocluster.prototype._centroid = function (set) {
            return set.reduce(function (s, e) {
                return [(s[0] + e[0]), (s[1] + e[1])];
            }, [0, 0]).map(function (e) {
                return (e / set.length);
            });
        }

        geocluster.prototype._clean = function (data) {
            return data.map(function (cluster) {
                return [cluster.centroid, cluster.elements];
            });
        };

        geocluster.prototype._cluster = function (elements, bias) {

            var self = this;

            // set bias to 1 on default
            if ((typeof bias !== "number") || isNaN(bias)) bias = 1;

            var tot_diff = 0;
            var diffs = [];
            var diff;

            // calculate sum of differences
            for (let i = 1; i < elements.length; i++) {
                diff = self._dist(elements[i][0], elements[i][1], elements[i - 1][0], elements[i - 1][1]);
                tot_diff += diff;
                diffs.push(diff);
            }

            // calculate mean diff
            var mean_diff = (tot_diff / diffs.length);
            var diff_variance = 0;

            // calculate variance total
            diffs.forEach(function (diff) {
                diff_variance += Math.pow(diff - mean_diff, 2);
            });

            // derive threshold from stdev and bias
            var diff_stdev = Math.sqrt(diff_variance / diffs.length);
            var threshold = (diff_stdev * bias);

            var cluster_map = [];

            // generate random initial cluster map
            cluster_map.push({
                centroid: elements[Math.floor(Math.random() * elements.length)],
                elements: []
            });

            // loop elements and distribute them to clusters
            var changing = true;
            while (changing === true) {

                var new_cluster = false;
                var cluster_changed = false;

                // iterate over elements
                elements.forEach(function (e, ei) {

                    var closest_dist = Infinity;
                    var closest_cluster = null;

                    // find closest cluster
                    cluster_map.forEach(function (cluster, ci) {

                        // distance to cluster
                        let dist = self._dist(e[0], e[1], cluster_map[ci].centroid[0], cluster_map[ci].centroid[1]);

                        if (dist < closest_dist) {
                            closest_dist = dist;
                            closest_cluster = ci;
                        }

                    });

                    // is the closest distance smaller than the stddev of elements?
                    if (closest_dist < threshold || closest_dist === 0) {

                        // put element into existing cluster
                        cluster_map[closest_cluster].elements.push(e);

                    } else {

                        // create a new cluster with this element
                        cluster_map.push({
                            centroid: e,
                            elements: [e]
                        });

                        new_cluster = true;

                    }

                });

                // delete empty clusters from cluster_map
                cluster_map = cluster_map.filter(function (cluster) {
                    return (cluster.elements.length > 0);
                });

                // calculate the clusters centroids and check for change
                cluster_map.forEach(function (cluster, ci) {
                    var centroid = self._centroid(cluster.elements);
                    if (centroid[0] !== cluster.centroid[0] || centroid[1] !== cluster.centroid[1]) {
                        cluster_map[ci].centroid = centroid;
                        cluster_changed = true;
                    }
                });

                // loop cycle if clusters have changed
                if (!cluster_changed && !new_cluster) {
                    changing = false;
                } else {
                    // remove all elements from clusters and run again
                    if (changing) cluster_map = cluster_map.map(function (cluster) {
                        cluster.elements = [];
                        return cluster;
                    });
                }

            }

            // compress result
            return cluster_map;

        };

        window.geocluster = geocluster;
    })

    .config(function() {
        window.getJsonFromUrl = function(url) {
            var result = {};
            url.split("&").forEach(function(part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            return result;
        }
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/home.html'
            })
            .state('home.login', {
                url: '/login?fbLogin&lat&lng',
                views: {
                    'content': {
                        templateUrl: "templates/login.html"
                    }
                },
                params: {
                    lng: null,
                    lat: null,
                    fbLogin: null
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
                url: '/post-offer?spaceId',
                views: {
                    'place-bid': {
                        templateUrl: "templates/post-offer.html"
                    }
                },
                params: {
                    spaceId: null
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

        $urlRouterProvider.otherwise(function ($injector, $location) {

            if ($location.$$hash.indexOf("token") !== -1 && $location.$$hash.indexOf("state") !== -1) {
                let token = getJsonFromUrl($location.$$hash).access_token;
                sessionStorage.setItem("fb_token", token);
                // sucessful response from fb
                return "/home/login?fbLogin=ok";
            } else if ($location.absUrl().indexOf("error") !== -1 &&
                $location.absUrl().indexOf("error_code") !== -1) {
                return "/home/login?fbLogin=err";
            }
            return "/home/search";
        });

    }])

    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel):/);
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
            } else {
                return false;
            }
        };

        window.isIos = function () {
            return (
                navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i));
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

angular.module('ParkingSpaceMobile.controllers', []);
angular.module('ParkingSpaceMobile.services', []);
angular.module('ParkingSpaceMobile.directives', []);
angular.module('ParkingSpaceMobile.filters', []);

