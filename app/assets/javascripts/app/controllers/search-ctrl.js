/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl',
    ['geocoderService', 'notificationService', 'userService', '$rootScope', '$scope', 'parkingSpaceService',
        'parameterService', 'geolocationService', '$state', 'currencyFactory', 'offerService', '$stateParams',
        function (geocoderService, notificationService, userService, $rootScope, $scope, parkingSpaceService,
                  parameterService, geolocationService, $state, currencyFactory, offerService, $stateParams) {

            if (!$rootScope.map) {
                $rootScope.$emit('http.error', 'Nu se poate inițializa harta. Ești conectat la internet? ');
                return;
            }



            if ($stateParams.lat && $stateParams.lng) {
                $rootScope.map.setCenter(new google.maps.LatLng($stateParams.lat, $stateParams.lng));
            }

            if ($stateParams.zoom) {
                $rootScope.map.setZoom($stateParams.zoom)
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


            if ($state.current.name === 'home.map.search' && localStorage.getItem('instructionsShown') !== 'true') {
                $state.go('.instructions');
                localStorage.setItem('instructionsShown', 'true');
            }

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
                        // search for first offer for current user
                        // ( they should be sorted by creation date in parking_space_controller
                        let nearestOffer = space.offers.find((of) => {
                            if (!of.owner_is_current_user) return false;
                            return moment(of.end_date).isAfter(moment());
                        });
                        let htmlMarker = new HtmlMarker(space, $scope, nearestOffer);
                        $rootScope.markers.push(htmlMarker);
                    })
                });
            };

            let dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', drawSpaces);


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
                if (toState.name.indexOf('home.map.search') === -1) {
                    google.maps.event.removeListener(dragListenHandle);
                } else if (toState.name === 'home.map.search') {
                    drawSpaces();
                    $scope.placingSpot = null;
                }
            });
        }]);

