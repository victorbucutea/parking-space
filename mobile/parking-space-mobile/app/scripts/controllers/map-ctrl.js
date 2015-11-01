/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MapCtrl', function ($scope, $timeout, $rootScope, geolocationService, geocoderService) {

        $scope.mapCreated = function (map, overlay, geocoder) {

                $rootScope.map = map;
                $rootScope.overlay = overlay;
                $rootScope.geocoder = geocoder;
                $scope.marker = {};

                google.maps.event.addListener(map, 'zoom_changed', function () {
                        var zoomLevel = map.getZoom();
                        $scope.showPointer = false;
                        var scale = 0.3;

                        switch (zoomLevel) {
                                case 18 :
                                        scale = 0.3;
                                        $timeout(function () {
                                                $scope.showPointer = true;
                                        }, 1500);
                                        break;
                                case 19 :
                                        scale = 0.5;
                                        $timeout(function () {
                                                $scope.showPointer = true;
                                        }, 1500);
                                        break;
                                case 20 :
                                        scale = 0.8;
                                        break;
                                case 21 :
                                        scale = 1;
                                        break;
                                default:
                                        scale = 0.3;
                                        $timeout(function () {
                                                $scope.showPointer = true;
                                        }, 1500);
                                        break;
                        }

                        $scope.marker.markerStyle = {'transform': 'scale(' + scale + ')'};

                        if (!$scope.$$phase)
                                $scope.$apply();

                });


                google.maps.event.addListener(map, 'dragend', function () {
                        $scope.calculateAddress();
                });


                geolocationService.getCurrentLocation(function (position) {
                        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.setCenter(pos);
                        $scope.calculateAddress();
                });

                map.setZoom(19);
        };

        $scope.calculateAddress = function () {
                var mapCenter = $rootScope.map.getCenter();
                geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
                        newAddr.lat = mapCenter.lat();
                        newAddr.lng = mapCenter.lng();
                        newAddr.markerRotation = $scope.marker.rotation;
                        $rootScope.$broadcast('changeAddress', newAddr);
                        if (!$scope.$$phase)
                                $scope.$apply();
                });

        };

});
