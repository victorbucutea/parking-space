/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl',
    ['geocoderService', 'notificationService', 'userService', '$rootScope', '$scope', 'parkingSpaceService',
        'parameterService', 'geolocationService', '$state', 'currencyFactory', 'offerService', '$stateParams',
        function (geocoderService, notificationService, userService, $rootScope, $scope, parkingSpaceService,
                  parameterService, geolocationService, $state, currencyFactory, offerService, $stateParams) {


            let dragListenHandle = null;

            $scope.mapCreated = function (map, overlay, geocoder) {
                $('#mapBlanket').fadeOut();
                $rootScope.map = map;
                $rootScope.overlay = overlay;
                $rootScope.geocoder = geocoder;


                dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', drawSpaces);

                // center on request params if need be
                if ($stateParams.lat && $stateParams.lng) {
                    let pos = new google.maps.LatLng($stateParams.lat, $stateParams.lng);
                    if ($stateParams.zoom) {
                        map.setZoom(parseInt($stateParams.zoom));
                    } else {
                        map.setZoom(17);
                    }
                    map.setCenter(pos);
                    return;
                }

                geolocationService.getCurrentLocation(function (position) {
                    let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(pos);
                });

            };

            $scope.mapError = function () {
                $('#mapBlanket').fadeOut();
                $rootScope.$emit('http.error', 'Nu se poate inițializa harta. Ești conectat la internet? ');
            };

            // bad internet, a message should be shown
            // to warn the user. No sense to initialize the map.
            if (!window.google || !window.google.maps) {
                return;
            }


            if (!sessionStorage.getItem("current_user")) {
                userService.getUser(function (user) {
                    if (!user) return;
                    let userjson = JSON.stringify(user);
                    sessionStorage.setItem("current_user", userjson);

                    if (!user.phone_no_confirm) {
                        $state.go('.confirm-phone');
                    }
                });
            } else {
                let user = JSON.parse(sessionStorage.getItem("current_user"));
                if (!user.phone_no_confirm) {
                    $state.go('.confirm-phone');
                }
            }


            if ($state.current.name === 'home.search' && localStorage.getItem('instructionsShown') !== 'true') {
                $state.go('.instructions');
                localStorage.setItem('instructionsShown', 'true');
            }

            function addMarker(space) {
                let nearestOffer = space.offers.find((of) => {
                    if (!of.owner_is_current_user) return false;
                    return moment(of.end_date).isAfter(moment());
                });
                let htmlMarker = new HtmlMarker(space, $scope, nearestOffer);
                $rootScope.markers.push(htmlMarker);
            }

            function removeMarker(id) {
                $rootScope.markers.forEach(function (d) {
                    if (d.space.id == id)
                        d.setMap();//clear marker
                });
            }

            $rootScope.$on('spaceSave', (evt, space) => {
                removeMarker(space.id);
                addMarker(space);
            });

            $rootScope.$on('spaceDelete', (evt, id) => {
                removeMarker(id);
            });

            let drawSpaces = function () {

                let bnds = $rootScope.map.getBounds().toJSON();
                parkingSpaceService.getAvailableSpaces(bnds, function (spaces) {
                    if (!spaces || spaces.length === 0) {
                        $scope.selectedSpace = null;
                    }

                    if ($rootScope.markers)
                        $rootScope.markers.forEach(function (d) {
                            d.setMap();//clear marker
                        });

                    $rootScope.markers = [];

                    $rootScope.$emit('spaces', spaces);

                    spaces.forEach(function (space) {
                        addMarker(space);
                    })
                });
            };


            $scope.$watch('selectedLocation', newVal => {
                if (!newVal) return;

                $rootScope.map.setCenter(newVal);
            });

            $scope.$on('selectSpace', function (event, space) {
                $scope.markerClick({elm: {space: space}});
            });


            $scope.markerClick = function (data) {
                $scope.selectedSpace = data.elm.space;
                let owned = $scope.selectedSpace.owner_is_current_user;
                if (owned) {
                    $state.go('.review-bids');
                } else {
                    $state.go('.post-bids');
                }
            };


            $scope.showPostSpace = function () {
                if (!$scope.placingSpot) {
                    $scope.placingSpot = true;
                    return;
                }
                $scope.spaceEdit = {};
                angular.copy($scope.space, $scope.spaceEdit);
                $scope.spaceEdit.title = "";
                geolocationService.getCurrentLocation(function (position) {
                    $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
                    $scope.spaceEdit.recorded_from_long = position.coords.longitude;
                });
                $state.go('.post');
            };

            $scope.centerMap = function () {
                geolocationService.getCurrentLocation(function (position) {
                    let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $rootScope.map.setCenter(pos);
                });
            };


            $scope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name.indexOf('home.search') === -1) {
                    google.maps.event.removeListener(dragListenHandle);
                } else if (toState.name === 'home.search') {
                    $scope.placingSpot = null;
                }
            });
        }]);

