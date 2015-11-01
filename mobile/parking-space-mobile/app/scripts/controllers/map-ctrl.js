/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MapCtrl', function ($scope, $rootScope, geolocationService) {


    $scope.mapCreated = function (map, overlay, geocoder) {

        $rootScope.map = map;
        $rootScope.overlay = overlay;
        $rootScope.geocoder = geocoder;

        geolocationService.getCurrentLocation(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
        });

        map.setZoom(19);
    };

});
