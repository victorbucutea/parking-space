/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (geocoderService, notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $stateParams) {
    $rootScope.map.setZoom(15);

    let center = $rootScope.map.getCenter();

    $scope.circleOptions = {
        strokeColor: '#111',
        strokeWeight: 0.5,
        fillColor: '#333',
        fillOpacity: 0.1,
        map: $rootScope.map,
        radius: parameterService.getDefaultSearchRadius()
    };

    let blueIcon = {
        url: '/assets/app/marker_blue.png',
        scaledSize: new google.maps.Size(53, 53)
    };

    let orangeIcon = {
        url: '/assets/app/marker_orange.png',
        scaledSize: new google.maps.Size(58, 58)
    };


    $scope.stdImageUrl = function (url) {
        if (!url) {
            return '#';
        }
        return ENV + url;
    };

    $scope.circleOptions.center = $rootScope.map.getCenter();
    $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);


    let dragListenClbk = function () {
        if ($scope.searchRadiusCircle)
            $scope.searchRadiusCircle.setMap();

        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

        let latLng = $rootScope.map.getCenter();
        parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), $scope.circleOptions.radius, function (spaces) {
            drawSpaces(spaces);
        });
    };

    let dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);

    let drawSpaces = function (newVal) {

        if (!newVal || newVal.length === 0) {
            $scope.selectedSpace = null;
        }

        if ($rootScope.markers)
            $rootScope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });

        $rootScope.markers = [];

        newVal.forEach(function (space) {
            let htmlMarker = new HtmlMarker(space, $scope);
            $rootScope.markers.push(htmlMarker);
        })
    };


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
        $scope.spaceEdit = {};
        angular.copy($scope.space, $scope.spaceEdit);
        $scope.spaceEdit.title = "";
        geolocationService.getCurrentLocation(function (position) {
            $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
            $scope.spaceEdit.recorded_from_long = position.coords.longitude;
        });
        $state.go('.post');
    };


    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('home.map.search') === -1) {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap();

            google.maps.event.removeListener(dragListenHandle);

        } else if (toState.name === 'home.map.search') {
            parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
                drawSpaces(spaces);
            });
            $('div.daterangepicker').remove();
        }
    });
});

