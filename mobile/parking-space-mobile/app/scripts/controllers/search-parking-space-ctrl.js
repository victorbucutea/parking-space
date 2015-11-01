/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $filter) {

    $('.bar.bar-header').show();
    $rootScope.map.setZoom(15);

    $scope.noOfLongTerm = 0;
    $scope.noOfShortTerm = 0;

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


    if (!$scope.searchRadiusCircle) {
        // user navigates on screen for first time
        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
    }


    var drawSpaces = function (newVal) {
        if (!newVal)
            return;

        $scope.noOfLongTerm = $filter('filter')(newVal, {short_term: false});
        $scope.noOfShortTerm = $filter('filter')(newVal, {short_term: true});

        if (!$scope.markers)
            $scope.markers = [];


        $scope.markers.filter(function(){

        });

        $scope.markers.forEach(function (d) {
            d.setMap();//clear marker
        });


        var replaceMarker = function (space) {
            $scope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });

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
                $scope.showBid(space);
            });

            $scope.markers.push(markerWithLabel);
        };


        newVal.forEach(replaceMarker)
    };

    var center = $rootScope.map.getCenter();
    parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
        $scope.spaces = spaces;
        drawSpaces(spaces);
    });

    $scope.showBid = function (space) {
        $('.bar.bar-header').hide();
        $scope.selectedSpace = space;
        $scope.bid = {};
        $scope.bid.bid_amount = $scope.selectedSpace.price;
        $scope.bid.bid_currency = $scope.selectedSpace.currency;

        $state.go('.place', {}).then(function () {
            var latLng = new google.maps.LatLng($scope.selectedSpace.location_lat, $scope.selectedSpace.location_long);
            $scope.previousZoom = $rootScope.map.getZoom();
            $scope.previousCenter = $rootScope.map.getCenter();


            var pictureLabel = $("<img>");
            pictureLabel.attr('src', 'images/parking_spot_circle.png');
            pictureLabel.attr('height', 48);
            pictureLabel.attr('width', 48);

            var mapCenter = new google.maps.LatLng(latLng.lat() - 0.0008, latLng.lng());

            $rootScope.map.setCenter(mapCenter);
            $rootScope.map.setZoom(17);

            $scope.spotThumbnail = new MarkerWithLabel({
                position: latLng,
                icon: {path: ''},
                map: $rootScope.map,
                labelContent: pictureLabel[0],
                labelAnchor: new google.maps.Point(28, 28),
                labelStyle: {transform: 'rotate(' + $scope.selectedSpace.rotation_angle + 'deg)'}
            });
        });


    };

    $scope.closeBid = function () {
        $('.bar.bar-header').show();
        $scope.spotThumbnail.setMap();
        $state.go('^').then(function () {
            $rootScope.map.setZoom($scope.previousZoom);
            $rootScope.map.setCenter($scope.previousCenter);
            //redraw markers
            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap($rootScope.map);
                });
            }

            // redraw search radius
            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
            dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
        });

    };

    $scope.saveBid = function () {
        $('.bar.bar-header').show();
        if (!$scope.selectedSpace.owner_is_current_user) {
            offerService.placeOffer($scope.bid, $scope.selectedSpace.id, function (bid) {
                $scope.selectedSpace.offers.push(bid);
            });
        }
        $scope.closeBid();
    };

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

    $scope.showOffers = function (parkingSpaceId) {
        $('.bar.bar-header').show();
        $state.go('home.myposts.bids', {parking_space_id: parkingSpaceId});
    };

    $scope.showEdit = function (parkingSpaceId) {
        $('.bar.bar-header').show();
        $state.go('home.myposts.edit', {parking_space_id: parkingSpaceId});
    };

    $scope.showDelete = function (parkingSpaceId) {
        $('.bar.bar-header').show();
        $state.go('home.myposts.delete', {parking_space_id: parkingSpaceId});

    };

    $rootScope.$on('$stateChangeStart', function (ev, toState) {
        if ($scope.searchRadiusCircle) {
            $scope.searchRadiusCircle.setMap();//clear search radius circle
        }
        if ($scope.markers) {
            $scope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });
        }

        google.maps.event.removeListener(dragListenHandle);
    });

});

