/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('PostParkingSpaceCtrl', function ($rootScope, $scope, currencies, $state, parameterService, geolocationService) {
        $scope.currencies = currencies;


        if ($rootScope.map)
                $rootScope.map.setZoom(19);


        $scope.review = function () {
                $scope.spaceEdit = {};
                angular.copy($scope.space, $scope.spaceEdit);
                geolocationService.getCurrentLocation(function (position) {
                        $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
                        $scope.spaceEdit.recorded_from_long = position.coords.longitude;
                });
                $state.go('home.map.post.review');
        };

        $scope.save = function () {
                $scope.space = $scope.spaceEdit;
                $state.go('^');
        };

        $scope.centerMapOnCurrentLocation = function() {
                geolocationService.getCurrentLocation(function(position) {
                        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        $rootScope.map.setCenter(pos);
                })
        };

        $scope.$on('changeAddress', function (e, data) {
                if (!$scope.space)
                        $scope.space = {price: parameterService.getStartingAskingPrice(), currency: parameterService.getStartingCurrency()};

                var street = data.street || '';
                var street_number = data.street_number || '';
                var sublocality = data.sublocality ||
                    data.administrative_area_level_2 ||
                    data.administrative_area_level_1 || '';
                var city = data.city || '';

                $scope.space.address_line_1 = street + ', ' + street_number;
                $scope.space.address_line_2 = sublocality + ', ' + city;
                $scope.space.location_lat = data.lat;
                $scope.space.location_long = data.lng;
                $scope.space.rotation_angle = data.markerRotation || 0;


                if (!$scope.space.title) {
                        $scope.space.title = sublocality;
                }
        });

});

