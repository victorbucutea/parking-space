angular.module('ParkingSpace.directives')

    .factory('geocluster', function () {

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

        return geocluster;
    })

    .factory('loadGmaps', ['geocluster', '$rootScope', function (geocluster, $rootScope) {
        let s = document.createElement('script');
        s.onload = function () {
            window.onLoadMaps()
        };
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AI' +
            'zaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY&libraries=ge' +
            'ometry,places&language=ro';
        document.body.appendChild(s);


        let lazyLoadGmapsApi = function () {
            let deffered = $.Deferred();
            window.onLoadMaps = function () {
                deffered.resolve();
            };
            return deffered.promise();
        };

        return lazyLoadGmapsApi().then(function () {
            if (!window.google || !window.google.maps) {
                console.error('gmaps not loaded');
            }

            function HtmlMarker(cluster, scope, map) {
                this.spaces = cluster.elements.map((elm) => {
                    return elm[2];
                });
                this.scope = scope;
                this.pos = new google.maps.LatLng(cluster.centroid[0], cluster.centroid[1]);
                this.setMap(map);
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
                        if (cluster.length >= 2) {
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
                let nearestOffer = null;
                if (space && space.offers)
                    nearestOffer = space.offers.find((of) => {
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

        }, function () {
            console.error('promise rejected');
        });
    }])

    .directive('map', ['loadGmaps', function (loadGmaps) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&',
                onError: '&',
            },
            link: function ($scope, $element, $attr) {

                loadGmaps.then(() => {
                    function initialize() {
                        let mapOptions = {
                            center: new google.maps.LatLng(44.412, 26.113),
                            zoom: 18,
                            minZoom: 16,
                            maxZoom: 20,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            streetViewControl: false,
                            scaleControl: false,
                            rotateControl: false,
                            disableDefaultUI: true,
                            gestureHandling: 'greedy',
                            clickableIcons: false
                        };
                        let map = new google.maps.Map($element[0], mapOptions);
                        let overlay = new google.maps.OverlayView();
                        overlay.setMap(map);
                        overlay.draw = function () {
                        };

                        let geocoder = new google.maps.Geocoder();

                        $scope.onCreate({map: map, overlay: overlay, geocoder: geocoder});
                    }

                    initialize();
                }, (err) => {
                    // bad internet, a message should be shown
                    // to warn the user. No sense to initialize the map.
                    $scope.onError();
                    return;
                })
            }
        };
    }])

    .directive('productTable', function () {
        return {
            restrict: 'E',
            scope: {
                offer: '=',
                space: '=',
            },
            template:

                '<table class="table table-hover table-sm">' +
                '<thead>' +
                '    <tr>' +
                '        <th>Produs</th>' +
                '        <th class="text-center">Pret</th>' +
                '        <th class="text-center">Pret cu TVA</th>' +
                '    </tr>' +
                '</thead>' +
                '<tbody>' +
                '    <tr>' +
                '        <td><em>Închirere spatiu </em></td>' +
                '        <td class="text-center">{{offer.amount }} {{space.currency}}</td>' +
                '        <td class="text-center">{{offer.amount_with_vat}} {{space.currency}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td><em>Comision(8% + 2.5)</em></h4></td>' +
                '        <td class="text-center">{{offer.comision}} {{space.currency}}</td>' +
                '        <td class="text-center">{{offer.comision_with_vat}} {{space.currency}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '        <td>   </td>' +
                '        <td class="text-right"><h5><strong>Total: </strong></h5></td>' +
                '        <td class="text-center text-danger">' +
                '           <h5><strong>' +
                '               {{ offer.amount_with_vat - 0 + offer.comision_with_vat }} {{space.currency}} ' +
                '           </strong></h5>' +
                '</td>' +
                '    </tr>' +
                '</tbody></table>'
        }
    })

    .directive('placesAutocomplete', ['loadGmaps', function (loadGmaps) {
        return {
            restrict: 'E',
            scope: {
                selectedPlace: '&',
                placeHolder: '='
            },
            template: '' +
                '<input type="text" ' +
                '        id="pac-input" ' +
                '        class="form-control form-control-lg"' +
                '        ng-model="address"' +
                '        ng-keyup="cancel($event)"' +
                '        placeholder="{{placeHolder}}">' +
                '  <i class="fa fa-close clear-btn" ' +
                '       ng-click="address=\'\'" ' +
                '       ng-show="address.length > 3"></i>',
            link: function ($scope, elm, attr) {
                loadGmaps.then(() => {
                    let input = $(elm).find('#pac-input')[0];
                    let searchBox = new google.maps.places.Autocomplete(input);

                    // Bias the autocomplete object to bucharest for now
                    let bnds = new google.maps.Circle({
                        center: {
                            lat: 44.4115726,
                            lng: 26.11414
                        },
                        radius: 35000 //35 km
                    });
                    searchBox.setBounds(bnds.getBounds());

                    searchBox.addListener('place_changed', function () {
                        let place = searchBox.getPlace();
                        $scope.selectedPlace({
                            place: place.address_components,
                            location: place.geometry.location
                        });
                        $scope.$apply();
                    });

                    $scope.$watch('address', function (newVal, oldVal) {
                        // address will change on blur
                        if (!newVal) {
                            $scope.selectedPlace({place: null});
                        }
                    })
                })


            }
        };
    }])

    .directive('searchBar', function () {
        return {
            restrict: 'E',
            scope: {
                onSelectPlace: '&',
                placeHolder: '=',
                onMenuClick: '&'
            },
            template: '<div id="pac-container" class="">' +
                '    <places-autocomplete selected-place="selectedPlaced(place,location)" place-holder="placeHolder"></places-autocomplete>' +
                '    <span class="controls d-md-none" ng-click="openMenu()">' +
                '       <i class="pac-nav fa fa-bars "></i>' +
                '       <i id="notifmyposts" class="notif-icon d-none"></i>' +
                '    </span>' +
                '    <div class="loading-container">' +
                '      <div id="loading-progress" class="loading-progress"></div>' +
                '    </div>' +
                '</div>',
            link: function ($scope, $elm) {

                $scope.selectedPlaced = function (a, b) {
                    $scope.onSelectPlace({place: a, location: b});
                }

                $scope.openMenu = function () {
                    $scope.onMenuClick();
                }
            }
        }
    })

    .directive('searchCenterIcon', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                shown: '='
            },
            restrict: 'E',
            template: '<div ' +
                '               ng-show="shown"' +
                '               id="searchCenterIcon" ' +
                '               class="search-center-icon animated bounce"' +
                '               </div>',
            link: function ($scope, $element, $attr) {

                // bad internet, a message should be shown
                // to warn the user. No sense to initialize the map.
                if (!window.google || !window.google.maps) {
                    return;
                }

                let start = google.maps.event.addListener($rootScope.map, 'dragstart', () => {
                    $('#searchCenterIcon').addClass('shadow');
                });
                let end = google.maps.event.addListener($rootScope.map, 'dragend', () => {
                    $('#searchCenterIcon').removeClass('shadow');

                });

                $scope.$watch('shown', (newVal) => {
                    if (newVal === false) {
                        google.maps.event.removeListener(start);
                        google.maps.event.removeListener(end);
                    }
                })

            }
        }
    }])

    .directive('parkingSpotInfoBox', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            template:
                '<div class="parking-spot-details row no-gutters" >' +
                '          <div class="col-4 col-md-3 px-2 pt-1 justify-content-center d-flex" style="overflow: hidden" >' +
                '               <i class="fa fa-3x fa-photo align-self-center text-muted" ng-if="!space.images.length"></i>' +
                '               <img ng-click="showFullImage()" ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/q_auto,f_auto,w_150/{{space.images[0].name}}"' +
                '                   class="img-thumbnail" ng-if="space.images.length">' +
                '          </div>' +
                '          <div class="p-2 col-8 col-md-9" >' +
                '              <h2 class="text-truncate"><i class="fa fa-car"></i> {{space.title}}</h2>' +
                '              <p>{{space.address_line_1}} ' +
                '                     <br  />' +
                '                 {{space.address_line_2}} ' +
                '              </p>' +
                '              <h1>' +
                '                  {{space.price | units  }}.<small>{{space.price | subunits}}</small> ' +
                '                  <currency val="space.currency"></currency> / h' +
                '              </h1>' +
                '          </div>' +
                '     </div>' +
                '</div>',
            scope: {
                space: '=',
                thumbnailModal: '=',
                showControls: '='
            },
            link: function ($scope, elm) {

                $scope.cloudName = window.cloudinaryName;
                $rootScope.cloudName = window.cloudinaryName;
                $(elm).find('.parking-spot-details').click(evt => {
                    let isRoot = $(evt.currentTarget).hasClass('parking-spot-details');
                    if (isRoot && !$scope.thumbnailModal) {
                        $scope.showFullImage = true;
                        $scope.$evalAsync();
                    }
                });

                $scope.showFullImage = function (evt) {
                    $rootScope.$emit('showCarouselImages', $scope.space.images);
                };


            }
        }
    }])

    .directive('carouselImages', ['$rootScope', function ($rootScope) {
        return {
            template: '<div id="imgCarouselModal" style="display: none" >' +
                '        <div class="ps-modal d-flex p-3 align-items-center justify-content-center ps-no-nav " ng-click="close($event)">' +
                '          <span ng-click="prevImg()" class="car-handle left"> <i class="fa fa-angle-left fa-4x px-3"></i> </span>' +
                '          <div class="car-stage" ng-init="imgIndex = 0">' +
                '            <DIV ng-repeat="img in carouselImgs" class="car-invisible">' +
                '              <img  ng-class="{\'d-none\' : $index != imgIndex }"' +
                '                    ng-src="{{\'https://res.cloudinary.com/\'+cloudName+\'/image/upload/q_auto,f_auto/\'+img.name}}" ' +
                '                    class="carousel-img img-fluid mb-1 animated zoomIn">' +
                '            </DIV>' +
                '          </div>' +
                '          <span class="car-index"> {{imgIndex + 1}}/{{carouselImgs.length}} </span>' +
                '          <span ng-click="nextImg()" class="car-handle right"> <i class="fa fa-angle-right fa-4x px-3"></i> </span>' +
                '        </div>' +
                '      </div>',
            scope: {
                imgs: '='
            },
            link: function ($scope, $elm) {
                $scope.cloudName = window.cloudinaryName;

                $rootScope.$on('showCarouselImages', function (event, val) {
                    $scope.imgIndex = 0;
                    $scope.carouselImgs = val;
                    $elm.find('#imgCarouselModal').show();
                })


                $scope.nextImg = function () {
                    let $carousel = $elm.find('.carousel-img');
                    $carousel.removeClass('slideInLeft').removeClass('zoomIn').addClass('slideInRight');
                    $scope.imgIndex++;
                    if ($scope.imgIndex > $carousel.length - 1) {
                        $scope.imgIndex = $carousel.length - 1;
                    }
                };

                $scope.prevImg = function () {
                    let $carousel = $elm.find('.carousel-img');
                    $carousel.removeClass('slideInRight').addClass('slideInLeft');
                    $scope.imgIndex--;
                    if ($scope.imgIndex < 0) {
                        $scope.imgIndex = 0;
                    }
                }

                $scope.close = function (evt) {
                    let elm = $(evt.target);
                    if (elm.hasClass('ps-modal')) {
                        $('#imgCarouselModal').hide();
                    }
                }
            }
        }
    }])

    .directive('bidTable', function () {
        return {
            restrict: 'E',
            scope: {
                noContact: '=',
                offers: '=?',
                space: '='
            },
            template: '<div class="bids-area ">' +
                '      <div class="bid-table">' +
                '        <div class="offer row no-gutters py-1" ng-click="selectOffer(offer)"' +
                '             ng-repeat="offer in offers | orderBy: \'start_date\'">' +
                '          <div class="col-3 offer-owner">' +
                '            <div>{{offer.owner_name}}</div>' +
                '            <div class="license text-monospace">{{offer.owner_license}}</div>' +
                '          </div>' +
                '          <div class="col-6 offer-period" ng-class="{canceled : !offer.approved}">' +
                '             <span class="">' +
                '                  <span style="font-size: 1.1em;">' +
                '                    {{offer.start_date | moment: \'D/MM\' }}' +
                '                  </span>' +
                '                    {{offer.start_date | moment: \'HH:mm\' }}' +
                '                  -' +
                '                  <span style="font-size: 1.1em;">' +
                '                    {{offer.end_date | moment: \'D/MM\' }}' +
                '                  </span>' +
                '                    {{offer.end_date | moment: \'HH:mm\' }}' +
                '                  </span>' +
                '             </div>' +
                '          </span>' +
                '          <span class="offer-price col-3" ng-class="{canceled : !offer.approved}">' +
                '            <div>{{offer.amount}} {{ offer.currency }}</div>' +
                '            <div class="offer-duration"> {{offer | totalPeriod}}</div>' +
                '          </span>' +
                '       </div>' +
                '      </div>' +
                '       <div class="ps-dialog mt-5 showPhoneNumber" >' +
                '        <div class="ps-dialog-content animated zoomIn">' +
                '            <div class="ps-question">' +
                '                <parking-spot-info-box space="space"></parking-spot-info-box>' +
                '                <hr class="m-0"/>' +
                '                <div class="row ps-row py-2">' +
                '                    <div class="col-4">Utilizator</div>' +
                '                    <div class="col-8 ">' +
                '                        {{selOffer.owner_name}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row py-2">' +
                '                    <div class="col-4">Nr. Înm.</div>' +
                '                    <div class="col-8 text-monospace text-uppercase">' +
                '                        {{selOffer.owner_license}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Durata</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer | totalPeriod}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Start</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer.start_date | moment: \'ddd, D MMM, HH:mm\'}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Stop</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer.end_date | moment: \'ddd, D MMM, HH:mm\'}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">' +
                '                        Status' +
                '                    </div>' +
                '                    <div class="col-8">' +
                '                        <span ng-show="selOffer.approved" class="text-success">Acceptat</span>' +
                '                        <span ng-show="selOffer.canceled" class="text-danger">Anulat</span>' +
                '                        <span ng-show="selOffer.rejected" class="text-danger">Respins</span>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">' +
                '                        Taxare' +
                '                    </div>' +
                '                    <div class="col-8">' +
                '                        La 15 min' +
                '                    </div>' +
                '                </div>' +
                '                <div class="mt-3 pt-3 text-center" ng-hide="noContact" >' +
                '                    <h5>Apelează <br/> {{selOffer.owner_name}} </h5>' +
                '                    <div class="ps-text-xbig">' +
                '                        <a ng-href="tel:{{selOffer.owner_prefix + selOffer.owner_phone_number}}">' +
                '                            <i class="fa fa-phone"></i>' +
                '                            {{selOffer.owner_prefix + selOffer.owner_phone_number}}' +
                '                        </a>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="ps-control-buttons">' +
                '                <button class="btn  btn-secondary" onclick="$(\'.showPhoneNumber\').hide()">Înapoi</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '      </div>',
            link: function ($scope, $elm) {
                $scope.expiration = function (offer) {
                    if (!offer)
                        return;
                    let st = moment(offer.start_date);
                    let end = moment(offer.end_date);
                    let now = moment();

                    let isNow = end.isAfter(now) && st.isBefore(now);
                    let isInThePast = st.isBefore(now);
                    let isInTheFuture = end.isAfter(now);

                    if (isNow) {
                        return "Se încheie " + end.fromNow();
                    }

                    if (isInThePast) {
                        return "Încheiat " + end.fromNow()
                    }

                    if (isInTheFuture) {
                        return "Progr. " + st.fromNow();
                    }

                    return "";
                };

                $scope.selectOffer = function (offer) {
                    $scope.selOffer = offer;
                    $elm.find('.showPhoneNumber').show();
                };
            }
        }
    })

    .directive('spaceValidatedBox', ['parkingSpaceService', function (parkingSpaceService) {
        return {
            restrict: 'E',
            scope: {
                space: '='
            },
            template:
                '      <div class="animated zoomIn delay-2" ng-if="space.validated">' +
                '        <div class="p-2 expired-box alert-warning " ng-show="space.expired" ng-init="initExpiredBox()">' +
                '          <div class="d-flex justify-content-between">' +
                '            <div class="font-weight-bold text-warning" data-toggle="tooltip" title="Perioada de valabilitate s-a încheiat.' +
                '                În consecință locul nu mai este disponibil pentru închiriere">' +
                '              Valabilitate expirată <i class="fa fa-question-circle-o"></i>' +
                '            </div>' +
                '            <button class="btn btn-link btn-sm" onclick="$(\'#validityDetails\').slideToggle()">' +
                '              <i class="fa fa-angle-down"></i> Prelungește valabilitatea' +
                '            </button>' +
                '          </div>' +
                '          <form>' +
                '            <div class="form-row" id="validityDetails">' +
                '              <div class="col-md-2"></div>' +
                '              <div class="form-group col-6 col-md-4">' +
                '                <label for="validStart"> Data start' +
                '                </label>' +
                '                <date-time id="validStart" class="input-group-sm" date-model="availability_start" day></date-time>' +
                '              </div>' +
                '              <div class="form-group col-6  col-md-4">' +
                '                <label for="validStart"> Data stop</label>' +
                '                <date-time id="validStop" class="input-group-sm" date-model="availability_stop" day></date-time>' +
                '                <div class="invalid-tooltip">' +
                '                  Introdu data stop' +
                '                </div>' +
                '              </div>' +
                '              <div class="col-md-2"></div>' +
                '              <div class="col-12 text-center">' +
                '                <button ng-click="extendValidity(space, availability_start, availability_stop)" class="btn btn-success btn-sm my-2">' +
                '                  Prelungește perioada' +
                '                </button>' +
                '              </div>' +
                '            </div>' +
                '          </form>' +
                '        </div>' +
                '        <div class="p-2 posted-box text-center" ng-hide="space.expired">' +
                '          <div class="font-weight-bold text-success ">Disponibil pentru închiriat încă {{ timeUntilExpiry(space) }}' +
                '          </div>' +
                '          <div class="">' +
                '            <div class="text-monospace text-muted small text-center ">' +
                '              {{space.space_availability_start | moment:\'D MMM [(h)] HH:mm\' }} -' +
                '              {{space.space_availability_stop | moment:\'D MMM [(h)] HH:mm\'}}' +
                '            </div>' +
                '          </div>' +
                '        </div>' +
                '      </div>',
            link: function ($scope, $elm) {

                $scope.timeUntilExpiry = function (space) {
                    return moment().to(moment(space.space_availability_stop), true);
                };

                $scope.initExpiredBox = function () {
                    $('[data-toggle=tooltip]').tooltip();
                };


                $scope.extendValidity = function (space, start, stop) {

                    if (start.isSameOrAfter(stop)) {
                        alert('Data stop trebuie sa fie mai mare ca data start!');
                        return;
                    }

                    space.space_availability_start = start.toDate();
                    space.space_availability_stop = stop.toDate();
                    parkingSpaceService.extendValidity(space, (s) => {
                        replaceById(s, $scope.spaces);
                    })
                }
            }
        }
    }])

    .directive('spaceMissingDocBox', ['parkingSpaceService', function (parkingSpaceService) {
        return {
            restrict: 'E',
            scope: {
                space: '='
            },
            template: '<div>' +
                '        <div class="not-posted-box alert-danger p-2 animated delay-2 zoomIn" ng-if="space.missing_title_deed">' +
                '                <div class="font-weight-bold text-danger">Nepublicat</div>' +
                '                <div>Locul nu este disponibil pentru închiriat.' +
                '                  Atașați un document ce atestă posibilitatea sub-închirierii (' +
                '                  <i> contract închiriere, vânzare/cumparare, etc.</i> ).' +
                '                </div>' +
                '                <file-upload accept="\'*\'" icon="\'fa-file\'" ' +
                '                             label="\'Document sau foto\'"' +
                '                             uploaded-files="space.uploadedFiles"></file-upload>' +
                '                <div class="d-flex justify-content-center">' +
                '                  <button class="btn btn-danger btn-sm" ng-click="upload(space)" ng-disabled="uploadedFiles.length < 1">' +
                '                    <i class="fa fa-upload"></i> Încarcă documente' +
                '                  </button>' +
                '                </div>' +
                '        </div>' +
                '        <div class="not-posted-box alert-danger p-2 animated delay-2 zoomIn" ng-show="space.validation_pending">' +
                '          <div class="font-weight-bold text-danger">Nepublicat</div>' +
                '          <div>Locul este în curs de validare. Pentru întrebari sau detalii vă rugam contacți-ne pe' +
                '            <a href="mailto:office@go-park.ro"> office@go-park.ro </a> .' +
                '          </div>' +
                '        </div>' +
                '       </div>',
            link: function ($scope, $elm) {
                $scope.upload = function (space) {
                    space.uploadedFiles.submit().then(function (resp) {
                        parkingSpaceService.uploadDocuments(space.id, resp, (r) => {
                            $scope.space = r;
                            // replaceById(r, $scope.spaces)
                        });
                    })
                };
            }
        }
    }])

    .directive('spaceStatusBox', ['parkingSpaceService', function (parkingSpaceService) {
        return {
            restrict: 'E',
            scope: {
                space: '='
            },
            template: '<div>' +
                '         <space-missing-doc-box space="space"></space-missing-doc-box>' +
                '         <space-validated-box space="space"></space-validated-box>' +
                '         <div>' +
                '           <button class="btn btn-link btn-block" ng-show="activeOffers.length">' +
                '             <i class="fa fa-angle-double-down"></i> Rezervare curentă' +
                '           </button>' +
                '           <button class="btn btn-link btn-block" ng-hide="activeOffers.length">' +
                '             <i class="fa fa-ban"></i> Nicio rezervare curentă' +
                '           </button>' +
                '         </div>' +
                '         <bid-table offers="activeOffers"></bid-table>' +
                '         <div ng-if="nonActiveOffers.length">' +
                '           <button class="btn btn-link btn-block" ng-click="space.showOffers = !space.showOffers">' +
                '             <i class="fa fa-angle-double-down"></i> Afișează toate rezervările' +
                '           </button>' +
                '         </div>' +
                '         <bid-table space="space" offers="nonActiveOffers" ng-if="space.showOffers"></bid-table>' +
                '      </div>',
            link: function ($scope, elm) {
                $scope.availability_start = moment().toDate();
                $scope.availability_stop = moment().add(1, 'd').toDate();

                let isActive = function (o) {
                    let st = moment(o.start_date);
                    let now = moment();
                    if (st.isBefore(now) && !o.end_date) return true;
                    let end = moment(o.end_date);
                    return st.isBefore(now) && now.isBefore(end);
                }

                $scope.$watch('space.offers', (newVal) => {
                    if (!newVal) return;
                    $scope.activeOffers = newVal.filter(o => isActive(o));
                    $scope.nonActiveOffers = newVal.filter(o => !isActive(o));
                })

            }
        }
    }])

    .directive('bidAmount', ['currencies', function (currencies) {
        return {
            restrict: 'E',
            scope: {
                bidAmount: '=',
                bidCurrency: '='
            },
            template:
                ' <div class="row no-gutters align-items-center">' +
                '<div class="col-8 col-sm-7 col-md-6 d-flex align-items-center">' +
                '<a class="fa fa-caret-left fa-5x" ng-click="decrease()"></a>' +
                '<input type="number" maxlength="3" ng-model="bidAmount" class="form-control" required>' +
                '<a class="fa fa-caret-right fa-5x" ng-click="increase()" style=""></a>' +
                '</div>' +
                '<div class="col-4 col-sm-5 col-md-5">' +
                '<select ng-model="bidCurrency" ' +
                '   ng-options="bidCurrency.name as bidCurrency.label for bidCurrency in currencies" ' +
                '   class="form-control form-control-lg"' +
                '   required> </select>' +
                '</div>' +
                '</div>',

            link: function ($scope, element, attrs) {
                $scope.currencies = currencies;

                $scope.increase = function () {
                    if (!$scope.bidAmount) {
                        $scope.bidAmount = 0;
                    }
                    $scope.bidAmount++;
                };

                $scope.$watch('bidAmount', function (newVal, oldVal) {
                    if (!$scope.bidAmount) {
                        return;
                    }

                    if (!newVal) {
                        $scope.bidAmount = 0;
                    }

                    if (newVal >= 100) {
                        $scope.bidAmount = 100;
                    }

                    if (newVal < 0) {
                        $scope.bidAmount = 0;
                    }
                });

                $scope.decrease = function () {
                    if (!$scope.bidAmount) {
                        $scope.bidAmount = 0;
                    }
                    $scope.bidAmount--;
                };

            }
        }
    }])

    .directive('currency', ['currencies', function (currencies) {
        return {
            restrict: 'E',
            template: '<span> <i class="fa" ng-class="currSym"></i> {{currName}} </span>',
            scope: {
                val: '='
            },
            link: function ($scope) {

                let display = function (newVal) {
                    if (!newVal)
                        return;

                    let currency = $.grep(currencies, function (cur) {
                        return newVal === cur.name;
                    });


                    if (currency[0] && currency[0].icon) {
                        $scope.currSym = currency[0].icon;
                        $scope.currName = null;
                    } else {
                        $scope.currName = currency[0].name;
                        $scope.currSym = null;
                    }
                };

                display($scope.val);
                $scope.$watch('val', function (newVal) {
                    display(newVal);
                });
            }
        }
    }])

    .directive('dateTime', function () {
        let template = '<div class="input-group">' +
            '<input ' +
            '       type="text" ' +
            '       class="form-control"' +
            '       ng-class="{\'form-control-lg\': large }"' +
            '       required >';

        if (isMobileOrTablet()) {
            template = '<div class="input-group">' +
                '<input ' +
                '       type="datetime-local" ' +
                '       class="form-control"' +
                '       ng-class="{\'form-control-lg\': large }"' +
                '       ng-model="dateModel"' +
                '       required>';
        }

        template += '<div class="input-group-append">' +
            '                                <span class="input-group-text">' +
            '                                    <i class="fa fa-calendar"></i>' +
            '                                </span>' +
            '                  </div>' +
            '</div>'

        return {
            restrict: 'E',
            scope: {
                dateModel: '=',
                day: '=',
                large: '='
            },
            compile: function (element, attrs) {
                return {
                    post: function ($scope, elm) {
                        if (isMobileOrTablet()) {
                            return;
                        }
                        elm = $(elm.find('.form-control'));

                        $scope.$watch('dateModel', function (newVal) {
                            elm.data('daterangepicker').setStartDate(moment(newVal));
                            elm.data('daterangepicker').setEndDate(moment(newVal));
                        });

                        elm.daterangepicker({
                            "singleDatePicker": true,
                            "minDate": moment().startOf('h'),
                            "autoApply": true,
                            "timePicker": true,
                            "timePicker24Hour": true,
                            "timePickerIncrement": 15,
                            "applyClass": "apply",
                            "cancelClass": "cancel",
                            "locale": {
                                "format": "DD MMM [(h)] HH:mm",
                                "separator": " până la ",
                                "applyLabel": "Ok",
                                "cancelLabel": "Anulează",
                                "fromLabel": "De la",
                                "toLabel": "Până la",
                                "customRangeLabel": "Custom",
                                "weekLabel": "S",
                                "daysOfWeek": [
                                    "Du",
                                    "Lu",
                                    "Ma",
                                    "Mi",
                                    "Jo",
                                    "Vi",
                                    "Sâ"
                                ],
                                "monthNames": [
                                    "Ianuarie",
                                    "Februarie",
                                    "Martie",
                                    "Aprilie",
                                    "Mai",
                                    "Iunie",
                                    "Iulie",
                                    "August",
                                    "Septembrie",
                                    "Octombrie",
                                    "Noiembrie",
                                    "Decembrie"
                                ]
                            },

                        }, function (start, end, label) {
                            $scope.dateModel = start;
                            if (!$scope.$$phase)
                                $scope.$apply();
                        });

                    }
                }
            },
            replace: true,
            template: template

        };
    })

    .directive('perimeterBox', [function () {
        return {
            restrict: 'E',
            template: '<div >' +
                '<div class="perimeter d-flex justify-content-center align-items-center"' +
                '     style="width: {{ width() }} ; height:{{ height() }} ; top: {{ top() }} ; left:{{left()}}"' +
                '     ng-mouseup="clickPerim()" >' +
                '   <i class="fa fa-car" ng-hide="perimeter.identifier"></i>' +
                '  <span class="per-id">{{perimeter.identifier}}</span>' +
                '</div>' +
                '</div>',
            scope: {
                onStop: '&',
                onClick: '&',
                perimeter: '='
            },
            link: function ($scope, elmnt) {
                let isResizing = false;
                let isDragging = false;
                let imgLoaded = false;
                let elm = elmnt.find('.perimeter')[0];// dom object
                let per = $scope.perimeter;
                let canvas = $('.perimeter-canvas');
                let canvHeight = canvas.height();
                let canvWidth = canvas.width();
                $scope.factorWidth = 1;
                $scope.factorHeight = 1;

                let reference = $("#referencePos");
                $scope.factorWidth = reference.width() / canvWidth;
                $scope.factorHeight = reference.height() / canvWidth;
                initDragElement();
                initResizeElement();

                new ResizeSensor(canvas, function (e) {
                    if (e.height === canvHeight && e.width === canvWidth) {
                        return;
                    }

                    canvWidth = e.width;
                    canvHeight = e.height;
                    $scope.factorWidth = reference.width() / canvWidth;
                    $scope.factorHeight = reference.height() / canvWidth;
                    $scope.$apply();
                });

                // on screen resize


                function initDragElement() {
                    var pos1 = 0,
                        pos2 = 0,
                        pos3 = 0,
                        pos4 = 0;
                    let currentZIndex = 0;

                    elm.onmousedown = function (e) {
                        if (isResizing) return;

                        elm.style.zIndex = "" + ++currentZIndex;
                        e = e || window.event;
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        elm.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    };

                    function elementDrag(e) {
                        isDragging = true;
                        if (!elm) {
                            return;
                        }

                        e = e || window.event;
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // set the element's new position:
                        elm.style.top = elm.offsetTop - pos2 + "px";
                        elm.style.left = elm.offsetLeft - pos1 + "px";
                    }

                    function closeDragElement() {
                        isDragging = false;
                        /* stop moving when mouse button is released:*/
                        elm.onmouseup = null;
                        document.onmousemove = null;
                        $scope.stopDrag();
                    }

                }

                function initResizeElement() {
                    var startX, startY, startWidth, startHeight;
                    var right = document.createElement("div");
                    right.className = "resizer-right";
                    elm.appendChild(right);
                    right.addEventListener("mousedown", initDrag, false);
                    right.parentPopup = elm;

                    var bottom = document.createElement("div");
                    bottom.className = "resizer-bottom";
                    elm.appendChild(bottom);
                    bottom.addEventListener("mousedown", initDrag, false);
                    bottom.parentPopup = elm;

                    var both = document.createElement("div");
                    both.className = "resizer-both";
                    elm.appendChild(both);
                    both.addEventListener("mousedown", initDrag, false);
                    both.parentPopup = elm;


                    function initDrag(e) {
                        isResizing = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        startWidth = parseInt(document.defaultView.getComputedStyle(elm).width, 10);
                        startHeight = parseInt(document.defaultView.getComputedStyle(elm).height, 10);
                        document.documentElement.addEventListener("mousemove", doDrag, false);
                        document.documentElement.addEventListener("mouseup", stopDrag, false);
                    }

                    function doDrag(e) {
                        isDragging = true;
                        elm.style.width = startWidth + e.clientX - startX + "px";
                        elm.style.height = startHeight + e.clientY - startY + "px";
                    }

                    function stopDrag() {
                        isResizing = false;
                        isDragging = false;
                        document.documentElement.removeEventListener("mousemove", doDrag, false);
                        document.documentElement.removeEventListener("mouseup", stopDrag, false);
                        $scope.stopDrag();
                    }
                }

                $scope.clickPerim = function () {
                    if (isDragging) return;
                    $scope.onClick({per: per});
                };

                $scope.stopDrag = function () {
                    let w = $(elm).outerWidth();
                    let h = $(elm).outerHeight();
                    let top = parseInt($(elm).css('top'));
                    let left = parseInt($(elm).css('left'));
                    per.top_left_x = left * $scope.factorWidth;
                    per.top_left_y = top * $scope.factorHeight;
                    per.bottom_right_x = (left + w) * $scope.factorWidth;
                    per.bottom_right_y = (top + h) * $scope.factorHeight;
                    $scope.onStop({elm: elm});
                    $scope.$apply();
                };

                $scope.top = function () {
                    return per.top_left_y / $scope.factorHeight + 'px';
                };

                $scope.left = function () {
                    return per.top_left_x / $scope.factorWidth + 'px';
                };

                $scope.width = function () {
                    return (per.bottom_right_x - per.top_left_x) / $scope.factorWidth + 'px';
                };

                $scope.height = function () {
                    return (per.bottom_right_y - per.top_left_y) / $scope.factorHeight + 'px';
                }

            }
        }
    }])

    .directive('autocomplete', [function () {
        return {
            restrict: 'E',
            template: '<div class="d-inline-block pos-relative" ng-show="addingOperator">' +
                '            <input id="ruleSearch" class="form-control form-control-sm" ng-model="ruleSearchTxt">' +
                '            <div class="suggestion-container " ng-show="ruleSearchTxt.length > 2">' +
                '              <ul class="list-group">' +
                '                <li class="list-group-item" ng-hide="rules.length > 0">' +
                '                  <small> No Rules found with that name. </small>' +
                '                </li>' +
                '                <li class="list-group-item list-group-item-action" ng-repeat="rule in rules" ' +
                '                       ng-click="addOperator(rule)">' +
                '                  <h5><span class="badge badge-dark">{{rule.name}} </span></h5>' +
                '                  <small class="text-muted"> {{rule.description}} </small>' +
                '                </li>' +
                '              </ul>' +
                '            </div>' +
                '          </div>',
            scope: {
                onSelect: '&',
                search: '&'
            }
        }
    }])

    .directive('fileUpload', ['$q', '$rootScope', function ($q, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                onSelect: '&',
                onDeSelect: '&',
                icon: '=?',
                label: '=',
                maxCount: '=?',
                accept: '=?',
                folder: '=?',
                uploadedFiles: '=',
                existingFiles: '=?',
            },
            template: '<div class="drop-zone d-flex justify-content-center" >' +
                '           <input class="fileupload" style="display: none" type="file" name="file" multiple max="3" accept="{{accept}}">' +
                '           <div class="my-3 ps-carousel d-flex flex-wrap justify-content-center" >' +
                '             <div ng-repeat="file in existingFiles" ng-hide="file._destroy" class="px-2 thumb-box"> ' +
                '               <carousel-thumbnail file="file" on-remove="removeFileUpload(file)"></carousel-thumbnail>' +
                '             </div>' +
                '             <div ng-repeat="file in uploadedFiles" ng-hide="file._destroy" class="px-2 thumb-box"> ' +
                '               <carousel-thumbnail file="file" on-remove="removeFileUpload(file)"></carousel-thumbnail>' +
                '             </div>' +
                '              <div class=" add-photo p-2 justify-content-center d-flex flex-column"' +
                '                   ng-click="openUpload()" ng-hide="maxCntReached()">' +
                '                  <i class="fa {{icon}} fa-3x"></i>' +
                '                  <i class="text">{{label}}</i>' +
                '                  <i class="text small">(max 8MB)</i>' +
                '               </div>' +
                '          </div>' +
                '      </div>',
            link: function ($scope, $elm) {
                $scope.accept = angular.isDefined($scope.accept) ? $scope.accept : 'image/*';
                $scope.folder = angular.isDefined($scope.folder) ? $scope.folder : 'spaces';
                $scope.icon = angular.isDefined($scope.icon) ? $scope.icon : 'fa-image';
                $scope.maxCount = angular.isDefined($scope.maxCount) ? $scope.maxCount : 3;
                $scope.uploadedFiles = angular.isDefined($scope.uploadedFiles) ? $scope.uploadedFiles : [];
                $scope.existingFiles = angular.isDefined($scope.existingFiles) ? $scope.existingFiles : [];

                $scope.uploadedFiles.submit = function () {
                    return $q(function (resolve) {
                        let clbks = [];
                        $scope.uploadedFiles.forEach((f) => {
                            if (f.submit)
                                clbks.push(f.submit());
                        })

                        let publicIds = [];
                        $q.all(clbks).then((response) => {
                            response.forEach((resp) => {
                                publicIds.push({name: resp.public_id});
                            });
                            resolve(publicIds);
                        }).catch((e) => {
                            $rootScope.$emit('http.error', e);
                        });
                    })

                }

                let car = $($elm.find('.ps-carousel'));


                $scope.removeFileUpload = function (f) {
                    f._destroy = true;
                    $scope.onDeSelect({file: f});
                };

                $($elm.find('.fileupload')).fileupload({
                    url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/image/upload/',
                    dataType: 'json',
                    dropZone: $($elm.find('.drop-zone')),
                    imageOrientation: true,
                    formData: {upload_preset: window.cloudinaryPreset, folder: $scope.folder},
                    add: function (e, data) {

                        if (data.files[0].size > 8000000) {
                            alert('File is too big');
                            return;
                        }

                        $scope.uploadedFiles.push(data);
                        $scope.onSelect({file: data});
                        $scope.$apply();
                    },
                    progress: function (e, data) {
                        let progress = parseInt(data.loaded / data.total * 100, 10);
                        let name = data.files[0].name.replace(".", "\\.");
                        $('#uploadProgressBar-' + name).css('width', progress + '%');
                    },
                    fail: function (e, data) {
                        console.log('upload failed ', e, data);
                    }
                })

                $scope.openUpload = function () {
                    $($elm.find('.fileupload')).click();
                }

                $scope.maxCntReached = function () {

                    let noUploads = $scope.uploadedFiles.length;
                    let noExisting = $scope.existingFiles.length;
                    let deletedUpl = $scope.uploadedFiles.filter((i) => {
                        return i._destroy
                    }).length;
                    let deletedExist = $scope.existingFiles.filter((i) => {
                        return i._destroy
                    }).length;

                    return ((noUploads + noExisting) - (deletedUpl + deletedExist)) >= $scope.maxCount;
                }
            }

        }
    }])

    .directive('carouselThumbnail', [function () {
        return {
            restrict: 'E',
            scope: {
                file: '=',
                onRemove: '&'
            },
            template: '<div class="d-flex flex-column justify-content-between position-relative">' +
                "       <div ng-show='isFile' class=\"d-flex flex-column  py-3 photo-thumbnail\" >" +
                "          <i class=\"fa fa-file fa-3x align-self-center\"></i>" +
                "          <div class='text-truncate'>{{realFile.name}}</div>" +
                "       </div> " +
                '       <img ng-hide="isFile" class="photo-thumbnail" ng-src="{{dataUrl}}" ng-click="showThumbnail($event)">' +
                '       <div class="progress-container">' +
                '           <div id="uploadProgressBar-{{realFile.name}}"' +
                '                style="width: 0" class="progress-bar">' +
                '           </div>' +
                '       </div>' +
                '       <button class="btn btn-danger delete-thumbnail animated zoomIn" ng-click="removeFile()">' +
                '           <i class="fa fa-trash"></i>' +
                '       </button>' +
                '     </div>',
            link: function ($scope, $elm) {
                $scope.isFile = false;
                $scope.removeFile = function () {
                    $scope.onRemove($scope.file);
                }

                $scope.$watch('file', function (newValue, oldValue) {
                    if (!newValue) return;
                    let isExisting = newValue.hasOwnProperty("image");

                    if (isExisting) {
                        $scope.realFile = newValue;
                        $scope.dataUrl = 'https://res.cloudinary.com/' + window.cloudinaryName + '/image/upload/' + newValue.name;
                    } else {
                        let file = newValue.files[0];
                        $scope.realFile = file;
                        if ((/(\.|\/)(jpe?g|png|bmp)$/i).test(file.name)) {
                            $scope.dataUrl = URL.createObjectURL(file);
                            $scope.isFile = false;
                        } else {
                            $scope.isFile = true;
                        }
                    }
                });


                $scope.showThumbnail = function (evt) {
                    let src = evt.currentTarget.src;
                    let img = $(evt.currentTarget);
                    let clicked = img.data('clicked');
                    $('.photo-thumbnail').data('clicked', false);
                    if (!clicked && isMobileOrTablet()) {
                        $elm.find('.delete-thumbnail').show();
                        img.data('clicked', true);
                        return;
                    }
                    img.data('clicked', false);
                    let imgModal = $('#imgModal');
                    imgModal.find('img').attr('src', src);
                    imgModal.show();
                }
            }
        }
    }])

    .directive('inputPhoneNumber', ['parameterService', function (parameterService) {
        return {
            restrict: 'E',
            template: '<div class="input-group mt-3 input-group-lg">' +
                '                <country-select selected-country="selectedCountry" ></country-select>' +
                '                <input class="phone-number form-control" type="text" id="phoneNo"' +
                '                       autocorrect="off" autocapitalize="none" ng-model="phoneNumberFormatted" autocomplete="none"' +
                '                       placeholder="e.g. {{example}}"' +
                '                        name="phoneNumber"' +
                '                       required ' +
                '                       ng-pattern="pattern"' +
                '                       pattern="{{pattern}}"/>' +
                '                <div class="invalid-tooltip" style="left:20%">' +
                '                  e.g. {{example}}' +
                '                </div>' +
                '              </div>',
            scope: {
                selectedCountry: '=?',
                phoneNumber: '=?',
                user: '=?'
            },
            link: function ($scope, elm, attrs) {

                let inserted = [];
                let input = $(elm).find('#phoneNo');
                let phNo = $(elm).find('.phone-number');
                let isInternalChange = false;
                let format = function () {
                    let finaVal = '';
                    for (let i = 0, tplIdx = 0; i < inserted.length; i++, tplIdx++) {
                        let tmpl = $scope.format.charAt(tplIdx);
                        let ch = inserted[i];
                        if (tmpl === ' ') {
                            finaVal += tmpl + ch;
                            tplIdx++;
                        } else if (tmpl = '') {
                        } else {
                            finaVal += ch;
                        }
                    }
                    $scope.phoneNumberFormatted = finaVal;
                }
                let insert = function (e) {

                    let idx = inserted.length;
                    var keyCode = e.keyCode || e.charCode;
                    if (keyCode == 8 || keyCode == 46) {
                        inserted = [];
                        input.val('');
                        return false;
                    }

                    if (idx >= $scope.mob_length) {
                        return false;
                    }

                    let prefix = $scope.prefixes.split(",").find((pr) => {
                        let insrtTmp = inserted.join("") + e.key;
                        let prTmp = pr.slice(0, idx + 1);
                        return insrtTmp.startsWith(prTmp);
                    })


                    if (!prefix) {
                        return false;
                    }

                    if (/\d/.test(e.key)) {
                        inserted.push(e.key);
                    }
                    return true;


                }

                input.keydown((e) => {
                    e.preventDefault();
                    insert(e);
                    format();
                    isInternalChange = true;
                    $scope.user.phone_number = inserted.join('');
                    $scope.$apply();
                    isInternalChange = false;
                });

                $scope.$watch('user', function (newValue, oldValue) {
                    parameterService.getCountryList().then((list) => {
                        if (newValue) {
                            $scope.selectedCountry = list.countries[newValue.country]
                            $scope.phoneNumber = newValue.phone_number
                        } else {
                            $scope.selectedCountry = list.default_country
                        }
                    })

                });


                $scope.$watch('selectedCountry', function (newValue, oldValue) {
                    if (!newValue) return;
                    $scope.example = newValue.mobile_example;
                    $scope.prefixes = newValue.mobile_prefixes;
                    $scope.mob_length = newValue.mobile_no_length;
                    $scope.format = $scope.example.replace(/\d/g, "x");
                    $scope.phoneNumberFormatted = '';
                    inserted = [];
                    $scope.pattern = $scope.example.replace(/\d/g, "\\d");
                    if ($scope.user) {
                        $scope.user.country = newValue.code;
                        $scope.user.prefix = newValue.prefix;
                    }
                    input.attr('pattern', $scope.pattern);
                });

                $scope.$watch('phoneNumber', function (newVal) {
                        if (!newVal) return;
                        if (isInternalChange) return;

                        let split = newVal.split('');
                        for (let i = 0; i < split.length; i++) {
                            if (!insert({key: split[i]})) {
                                break;
                            }
                        }
                        format();
                        if ($scope.user) {
                            $scope.user.phone_number = newVal;
                        }
                    }
                )


            }
        }
    }])

    .directive('countrySelect', ['parameterService', function (parameterService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="input-group-prepend x" >' +
                '       <button class="btn btn-outline-secondary dropdown-toggle input-border" type="button"' +
                '                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '                  <div class="{{selectedCountry.css}} d-inline-block"></div>' +
                '                    {{selectedCountry.prefix}} ' +
                '                  </button>' +
                '                  <div class="dropdown-menu">' +
                '                    <a class="dropdown-item p-2 d-flex align-items-center justify-content-start" href ng-repeat="country in countryList"  ng-click="selectCountry(country)">' +
                '                       <div class="{{country.css}} d-inline-block"></div> ' +
                '                       <span class="ml-2 mr-auto">{{country.name}} {{country.prefix}} </span>' +
                '                    </a>' +
                '                  </div>' +
                '</div>',
            scope: {
                selectedCountry: '='
            },
            link: function ($scope, elm) {


                $scope.selectCountry = function (c) {
                    $scope.selectedCountry = c;
                }

                parameterService.getCountryList().then((data) => {
                    $scope.selectedCountry = data.default_country;
                    $scope.countryList = data.countries;
                });
            }
        }
    }])

    .directive('notificationMessages', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            template: '<div class="notification-area animated zoomIn">' +
                '    <div class="notification-message error" ng-show="errMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in errMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message notification" ng-show="notifMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in notifMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message warning" ng-show="warningMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in warningMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message warning" ng-show="warningMsgHtml.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in warningMsgHtml">' +
                '          <span ng-bind-html="msg"></span>' +
                '        </li>' +
                '      </ul>' +
                '    </div>' +
                '  </div>',
            scope: {},
            link: function ($scope, $elm) {
                $scope.errMsg = [];
                $scope.notifMsg = [];
                $scope.warningMsg = [];
                $scope.warningMsgHtml = [];

                let notifArea = $('.notification-area');

                let removeMsgs = function (evt) {
                    $scope.errMsg = [];
                    $scope.notifMsg = [];
                    $scope.warningMsg = [];
                    $scope.warningMsgHtml = [];
                    notifArea.removeClass('zoomIn').addClass('zoomOut');
                    setTimeout(function () {
                        notifArea.removeClass('zoomOut').addClass('zoomIn');
                        $scope.$evalAsync()
                    }, 300);
                    if (evt)
                        evt.preventDefault();
                };

                notifArea.on('mousedown', function (evt) {
                    removeMsgs(evt)
                });

                let addMsg = function (type, msg) {
                    if (msg instanceof Array) {
                        msg.forEach((text) => {
                            if (type.indexOf(text) === -1)
                                type.push(text);
                        });
                    } else {
                        if (type.indexOf(msg) === -1)
                            type.push(msg);
                    }

                    setTimeout(() => {
                        removeMsgs();
                    }, 7000);
                };


                $rootScope.$on('http.error', function (event, data) {
                    addMsg($scope.errMsg, data);
                });
                $rootScope.$on('http.warning', function (event, data) {
                    addMsg($scope.warningMsg, data);
                });
                $rootScope.$on('http.warning.html', function (event, data) {
                    addMsg($scope.warningMsgHtml, data);
                });
                $rootScope.$on('http.notif', function (event, data) {
                    addMsg($scope.notifMsg, data);
                });

            }
        }
    }])

    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
