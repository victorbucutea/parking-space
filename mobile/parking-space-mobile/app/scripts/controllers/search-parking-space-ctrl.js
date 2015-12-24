/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $filter) {

    $rootScope.map.setZoom(15);

    $scope.circleOptions = {
        strokeColor: '#111',
        strokeWeight: 0.5,
        fillColor: '#333',
        fillOpacity: 0.1,
        map: $rootScope.map,
        radius: parameterService.getDefaultSearchRadius()
    };

    var dragListenClbk = function () {
        if ($scope.searchRadiusCircle)
            $scope.searchRadiusCircle.setMap();

        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

        var latLng = $rootScope.map.getCenter();
        parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), $scope.circleOptions.radius, function (spaces) {
            $scope.spaces = spaces;
            drawSpaces(spaces);
        });
    };


    var dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);


    if (!$scope.searchRadiusCircle || $scope.searchRadiusCircle.getMap() ) {
        // user navigates on screen for first time
        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
        $rootScope.searchRadiusCircle = $scope.searchRadiusCircle;
    }


    var drawSpaces = function (newVal) {
        if (!newVal)
            return;

        if (!$scope.markers)
            $scope.markers = [];

        var replaceMarker = function (space) {
            var image = {
                url: space.short_term ? 'images/marker_orange.png' : 'images/marker_blue.png',
                scaledSize: new google.maps.Size(53, 53)
            };

            var currencyElm = $('<i class="fa" ></i>');
            var currency = currencyFactory.getCurrency(space.currency);
            currencyElm.addClass(currency);
            var currencyHtml = currencyElm.wrap('<p/>').parent().html();
            var price = space.price + "";
            var xCoord = price.length == 1 ? 8 : 15;
            var markerWithLabel = new MarkerWithLabel({
                position: new google.maps.LatLng(space.location_lat, space.location_long),
                map: $rootScope.map,
                icon: image,
                labelContent: space.price + ' ' + currencyHtml,
                labelAnchor: new google.maps.Point(xCoord, 44),
                labelStyle: {color: '#fff'}
            });

            google.maps.event.addListener(markerWithLabel, "click", function (e) {
                $scope.selectedSpace = space;
                $scope.$apply();
            });

            $scope.markers.push(markerWithLabel);
        };

        $scope.markers.forEach(function (d) {
            d.setMap();//clear marker
        });

        newVal.forEach(replaceMarker)
    };

    var center = $rootScope.map.getCenter();

    parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
        $scope.spaces = spaces;
        drawSpaces(spaces);
    });

    $scope.increaseRadius = function () {
        var searchRadiusCircle = $scope.searchRadiusCircle;
        if (searchRadiusCircle) {
            var prevRad = searchRadiusCircle.getRadius();
            if (prevRad <= 900) {
                var newVal = prevRad + 50;
                $scope.circleOptions.radius = newVal;
                searchRadiusCircle.setRadius(newVal);
                var center = $rootScope.map.getCenter();
                parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), newVal, function (spaces) {
                    $scope.spaces = spaces;
                    drawSpaces(spaces);
                });
            }

        }
    };

    $scope.decreaseRadius = function () {
        var searchRadiusCircle = $scope.searchRadiusCircle;
        if (searchRadiusCircle) {
            var prevRad = searchRadiusCircle.getRadius();
            if (prevRad >= 100) {
                var newVal = prevRad - 50;
                searchRadiusCircle.setRadius(newVal);
                $scope.circleOptions.radius = newVal;
                var center = $rootScope.map.getCenter();
                parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), newVal, function (spaces) {
                    $scope.spaces = spaces;
                    drawSpaces(spaces);
                });
            }
        }
    };

    $scope.expireDuration = function () {
        if (!$scope.selectedSpace) {
            return;
        }
        var duration = moment.duration(parameterService.getShortTermExpiration(), 'minutes');
        if (!$scope.selectedSpace.short_term) {
            duration = moment.duration(parameterService.getLongTermExpiration(), 'weeks');
        }
        var expirationTimestamp = new Date($scope.selectedSpace.created_at).getTime() + duration.asMilliseconds();
        return moment(expirationTimestamp).fromNow();
    };

    $scope.stdImageUrl = function (url) {
        if (!url) {
            return '#';
        }
        return ENV + url;
    };

    $scope.showPlaceOffer = function () {
        $state.go('.bids');
    };


    $scope.$on('$stateChangeStart' , function (event, toState) {
        if( toState.name.indexOf('home.map.search') == -1 ) {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap();
            google.maps.event.removeListener(dragListenHandle);
        }
    });
});

