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

            $scope.showMap = true;
            $scope.showContent = true;

            $scope.$on('mapAndContent', function (event, val) {
                $scope.showMap = val.showMap !== false;
                $scope.showContent = val.showContent !== false;


                if (val.colMap)
                    $('#mapColumn').removeClass().addClass(val.colMap);
                if (val.colContent)
                    $('#contentColumn').removeClass().addClass(val.colContent);
            });


            $scope.drawSpaces = function (spaces, skipCluster) {
                $scope.spaces = spaces;
                $scope.createMap().then(() => {
                    $scope.spacesClustered = parkingSpaceService.clusterize(spaces, skipCluster)

                    $scope.clearMarkers();

                    $scope.markers = [];

                    $scope.spacesClustered.forEach(function (space) {
                        let htmlMarker = new HtmlMarker(space, $scope, $rootScope.map);
                        $scope.markers.push(htmlMarker);
                    })
                })
            }


            $scope.clearMarkers = function () {
                if ($scope.markers)
                    $scope.markers.forEach(function (d) {
                        d.setMap();//clear marker
                    });
            }

            let createMap = $q.defer();

            $scope.createMap = function () {
                return createMap.promise;
            }

            $scope.mapCreated = function (map) {
                $('#mapBlanket').fadeOut();
                console.log('map created ', map);
                $rootScope.map = map;

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
                $scope.$broadcast('markerClick', [data, isMultiple])
            };

            $scope.selectPlace = function (newAddr, newLocation) {
                if (!newLocation) return;
                $rootScope.map.setCenter(newLocation);
            };


        }]);

