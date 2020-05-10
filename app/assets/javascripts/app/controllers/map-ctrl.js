/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MapCtrl',
    ['geoService', 'notificationService', 'userService', '$rootScope', '$scope', 'parkingSpaceService',
        'parameterService', '$state', 'offerService', '$stateParams', '$q',
        function (geoService, notificationService, userService, $rootScope, $scope, parkingSpaceService,
                  parameterService, $state, offerService, $stateParams, $q) {

            $scope.fetchFunc = function () {
                console.error('no parking space fetch functiono');
            }

            $scope.cloudinaryName = window.cloudinaryName;


            $scope.drawSpaces = function (spaces) {
                $scope.spaces = spaces;
                $scope.spacesClustered = parkingSpaceService.clusterize(spaces)

                $scope.clearMarkers();

                $rootScope.markers = [];

                $scope.spacesClustered.forEach(function (space) {
                    addMarker(space);
                })
            }

            function addMarker(space) {
                let htmlMarker = new HtmlMarker(space, $scope, $rootScope.map);
                $rootScope.markers.push(htmlMarker);
            }

            $scope.clearMarkers = function () {
                if ($rootScope.markers)
                    $rootScope.markers.forEach(function (d) {
                        d.setMap();//clear marker
                    });
            }

            let createMap = $q.defer();

            $scope.createMap = function () {
                return createMap.promise;
            }

            $scope.mapCreated = function (map, overlay, geocoder) {
                $('#mapBlanket').fadeOut();
                $rootScope.map = map;
                $rootScope.overlay = overlay;
                $rootScope.geocoder = geocoder;
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

                return createMap.resolve(map);
            };



            $scope.mapError = function () {
                $('#mapBlanket').fadeOut();
                $rootScope.$emit('http.error', 'Nu se poate inițializa harta. Ești conectat la internet? ');
                createMap.reject();
            };

            $scope.markerClick = function (data, isMultiple) {
               $rootScope.$emit('markerClick', [data,isMultiple])
            };


            $scope.$on('$stateChangeStart', function (event, teoState) {
                $scope.placingSpot = false;
            });


            $scope.centerMap = function () {
                geoService.getCurrentPosition((position) => {
                    let pos = new google.maps.LatLng(position.lat, position.lng);
                    $rootScope.map.setCenter(pos);
                });
            };


            $scope.showPostSpace = function () {
                if (!$scope.placingSpot) {
                    $scope.placingSpot = true;
                    return;
                }
                $rootScope.$emit('postSpace', '');
            };


            $scope.selectPlace = function (newAddr, newLocation) {
                if (!newLocation) return;

                $rootScope.map.setCenter(newLocation);
            };


        }]);

