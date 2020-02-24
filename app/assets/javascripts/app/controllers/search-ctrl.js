/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl',
    ['geoService', 'notificationService', 'userService', '$rootScope', '$scope', 'parkingSpaceService',
        'parameterService', '$state', 'offerService', '$stateParams',
        function (geoService, notificationService, userService, $rootScope, $scope, parkingSpaceService,
                  parameterService, $state, offerService, $stateParams) {


            let dragListenHandle = null;
            let zoomListenHandle = null;

            $scope.cloudinaryName = window.cloudinaryName;

            $scope.mapCreated = function (map, overlay, geocoder) {
                window.onGoogleMapLoad();
                $('#mapBlanket').fadeOut();
                $rootScope.map = map;
                $rootScope.overlay = overlay;
                $rootScope.geocoder = geocoder;


                dragListenHandle = google.maps.event.addListener($rootScope.map, 'dragend', scheduleDrawSpaces);
                zoomListenHandle = google.maps.event.addListener($rootScope.map, 'zoom_changed', scheduleDrawSpaces);
                scheduleDrawSpaces();

                $rootScope.map.addListener('click', function (evt) {
                    // to avoid mobile ggl autocomplete keeping focus when clicking on map
                    $('#pac-input').blur();
                });

                // center on request params if need be
                if ($stateParams.lat && $stateParams.lng) {
                    let pos = new google.maps.LatLng($stateParams.lat, $stateParams.lng);
                    if ($stateParams.zoom) {
                        map.setZoom(parseInt($stateParams.zoom));
                    } else {
                        map.setZoom(17);
                    }
                    map.setCenter(pos);
                }

                $scope.navigateToCompanyLot();

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

            if (!userService.instructionsShown()) {
                $state.go('.instructions').then(() => {
                        userService.instructionsShown(true)
                    }
                )
            }

            $scope.navigateToCompanyLot = function () {
                userService.getRoles(function (roles) {
                    if (!roles) return;
                    let rolesJson = JSON.stringify(roles);
                    sessionStorage.setItem("current_roles", rolesJson);
                    if (roles.company && roles.company.locations && roles.company.locations[0]) {
                        let lat = roles.company.locations[0].location_lat;
                        let lng = roles.company.locations[0].location_long;
                        let pos = new google.maps.LatLng(lat, lng);
                        $rootScope.map.setCenter(pos);
                    }
                    $rootScope.company = roles.company;
                    $rootScope.roles = roles.roles;
                })
            };


            function addMarker(space) {
                let htmlMarker = new HtmlMarker(space, $scope, $rootScope.map);
                $rootScope.markers.push(htmlMarker);
            }

            function removeMarker(id) {
                $rootScope.markers.forEach(function (d) {
                    d.spaces.forEach((space) => {
                        if (space.id == id)
                            d.setMap();//clear marker
                    })

                });
            }

            $rootScope.$on('spaceSave', (evt, space) => {
                removeMarker(space.id);
                let cluster = geocluster([
                    [Number.parseFloat(space.location_lat), Number.parseFloat(space.location_long), space]
                ]);
                addMarker(cluster[0]);
            });

            $rootScope.$on('spaceDelete', (evt, id) => {
                removeMarker(id);
            });

            let ongoingDrawSpacesReq;
            let scheduleDrawSpaces = () => {
                if (ongoingDrawSpacesReq) {
                    clearTimeout(ongoingDrawSpacesReq);
                }
                ongoingDrawSpacesReq = setTimeout(() => {
                    drawSpaces();
                }, 1000);
            };

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

            $scope.$on('selectSpace', function (event, space) {
                $scope.markerClick(space);
            });


            $scope.markerClick = function (data, isMultiple) {
                $('#showMultipleSpaces').hide();
                if (isMultiple) {
                    $('#showMultipleSpaces').show();
                    $scope.selectedSpaces = data;
                    $scope.$apply();
                    return;
                }
                $scope.selectedSpace = data;
                let owned = $scope.selectedSpace.owner_is_current_user;

                if (owned) {
                    $state.go('.review-bids', {spaceId: $scope.selectedSpace.id});
                } else {
                    $state.go('.post-bids', {spaceId: $scope.selectedSpace.id});
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
                $state.go('.post');
            };

            $scope.centerMap = function () {
                geoService.getCurrentPosition((position) => {
                    let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $rootScope.map.setCenter(pos);
                });
            };

            $scope.selectPlace = function (newAddr, newLocation) {
                if (!newLocation) return;

                $rootScope.map.setCenter(newLocation);
            };


            $scope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name.indexOf('search') === -1) {
                    google.maps.event.removeListener(dragListenHandle);
                    google.maps.event.removeListener(zoomListenHandle);
                } else if (toState.name === 'search') {
                    $scope.placingSpot = null;
                }
            });
        }]);

