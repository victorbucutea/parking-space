/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MapCtrl', function ($state, notificationService, $scope, $rootScope, geolocationService) {


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

        searchBox.addListener('places_changed', function () {
            $scope.selectNewPlace(searchBox.getPlaces());
        });


    };

    $scope.selectNewPlace = function (places) {
        if (!places || !places[0])
            return;

        $rootScope.map.setCenter(places[0].geometry.location);

    };

    window.notify = function (area) {
        notificationService.showNotifications({message: "new msg", area: area, msgcnt: 1, parking_space: 18});
        $rootScope.$apply();
    };


    $scope.showNotif = function () {
        var offerNotifs = notificationService.offerNotifications;
        var parkingSpaceNotifs = notificationService.parkingSpaceNotifications;

        if (!offerNotifs && !parkingSpaceNotifs) {
            return false;
        }


        var activeOfferNotif = offerNotifs.find(function (offer) {
            return offer.active;
        });

        var activeParkingSpaceNotif = parkingSpaceNotifs.find(function (pspaceMsg) {
            return pspaceMsg.active;
        });


        if (activeOfferNotif || activeParkingSpaceNotif) {
            return true;
        }
    };

    $scope.gotoOffersOrSpaces = function () {
        var offerNotifs = notificationService.offerNotifications;
        var parkingSpaceNotifs = notificationService.parkingSpaceNotifications;

        if (!offerNotifs && !parkingSpaceNotifs) {
            $state.go("home.myposts");
            return;
        }


        var activeOfferNotif = offerNotifs.find(function (offer) {
            return offer.active;
        });

        var activeParkingSpaceNotif = parkingSpaceNotifs.find(function (pspaceMsg) {
            return pspaceMsg.active;
        });

        var bothActive = activeOfferNotif && activeParkingSpaceNotif;
        var bothNotActive = !activeOfferNotif && !activeParkingSpaceNotif;


        if (bothActive || bothNotActive) {
            $state.go("home.myposts");
            return;
        }

        if (activeOfferNotif) {
            $state.go("home.myoffers");
            return;
        }


        if (activeParkingSpaceNotif) {
            $state.go("home.myposts");
        }

    }

});
