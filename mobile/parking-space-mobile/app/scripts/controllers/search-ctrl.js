/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $stateParams) {
    $rootScope.map.setZoom(15);

    $scope.circleOptions = {
        strokeColor: '#111',
        strokeWeight: 0.5,
        fillColor: '#333',
        fillOpacity: 0.1,
        map: $rootScope.map,
        radius: parameterService.getDefaultSearchRadius()
    };

    $scope.circleOptions.center = $rootScope.map.getCenter();
    $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

    var parkingSpaceListUpdated = function (spaces) {
        if (!spaces && !$scope.spaces) {
            return false;
        }

        if (!$scope.spaces && spaces) {
            return true;
        }

        if ($scope.spaces && !spaces) {
            return true;
        }

        if ($scope.spaces.length != spaces.length) {
            return true;
        }

        // check whether last update of newer items is > than last update of old items
        var lastUpdateNewItems;
        var lastUpdateOldItems;
        spaces.forEach(function (item) {
            if (!lastUpdateNewItems || new Date(lastUpdateNewItems).getTime() <= new Date(item.updated_at).getTime())
                lastUpdateNewItems = item.updated_at;
        });

        $scope.spaces.forEach(function (item) {
            if (!lastUpdateOldItems || new Date(lastUpdateOldItems).getTime() <= new Date(item.updated_at).getTime())
                lastUpdateOldItems = item.updated_at;
        });

        return (new Date(lastUpdateNewItems).getTime() > new Date(lastUpdateOldItems).getTime());
    };

    var dragListenClbk = function () {
        if ($scope.searchRadiusCircle)
            $scope.searchRadiusCircle.setMap();

        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

        var latLng = $rootScope.map.getCenter();
        parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), $scope.circleOptions.radius, function (spaces) {
            drawSpaces(spaces);
        });
    };

    var dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);

    var drawSpaces = function (newVal) {
        if (!parkingSpaceListUpdated(newVal)) {
            return;
        }
        $scope.spaces = newVal;
        if (!newVal || newVal.length == 0) {
            $scope.selectedSpace = null;
        }

        if (!$scope.markers)
            $scope.markers = [];


        $scope.markers.forEach(function (d) {
            d.setMap();//clear marker
        });

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

            if(space.id == $stateParams.parking_space_id ) {
                $scope.selectedSpace = space;
                $scope.$digest();
            }


            google.maps.event.addListener(markerWithLabel, "click", function (e) {
                $scope.selectedSpace = space;
                $scope.$digest();
            });

            $scope.markers.push(markerWithLabel);
        };


        newVal.forEach(replaceMarker)
    };

    var center = $rootScope.map.getCenter();

    parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
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
                    drawSpaces(spaces);
                });
            }
        }
    };

    $scope.expireDuration = function () {
        if (!$scope.selectedSpace) {
            return;
        }
        return moment($scope.selectedSpace.space_availability_stop).fromNow();
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


    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('home.map.search') == -1) {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap();
            google.maps.event.removeListener(dragListenHandle);
        }
    });
});

