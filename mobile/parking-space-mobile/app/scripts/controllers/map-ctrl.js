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

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', function() {
            $scope.selectNewPlace(searchBox.getPlaces());
        });

    };

    $scope.selectNewPlace = function (places) {
        if (!places || !places[0])
            return;

        $rootScope.map.setCenter(places[0].geometry.location);

    };

});
