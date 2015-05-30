/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function ($rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $filter) {

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

    $scope.$watch('circleOptions.radius', function (newVal) {
        var searchRadiusCircle = $scope.searchRadiusCircle;
        if (searchRadiusCircle) {
            searchRadiusCircle.setRadius(newVal);
        }
    });

    var dragListenClbk = function () {
        if ($scope.searchRadiusCircle)
            $scope.searchRadiusCircle.setMap(null);

        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

        var latLng = $rootScope.map.getCenter();
        parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), $scope.circleOptions.radius, function (spaces) {
            $scope.spaces = spaces;
        });
    };
    var dragListenHandle = null;

    // setTimeout(function(){
    dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
    if (!$scope.searchRadiusCircle) {
        // user navigates on screen for first time
        $scope.circleOptions.center = $rootScope.map.getCenter();
        $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
    }


    $rootScope.$broadcast('searchCenterIcon', true);

    $rootScope.$on('$stateChangeSuccess', function (ev, toState) {
        if (toState.name.indexOf('home.map.search') == -1) {
            if ($scope.searchRadiusCircle) {
                $scope.searchRadiusCircle.setMap();
            }

            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap();//clear marker
                });
            }

            google.maps.event.removeListener(dragListenHandle);
            $rootScope.$broadcast('searchCenterIcon', false);
        }
    });

    $scope.$watchCollection('spaces', function (newVal) {

        if (!newVal)
            return;

        $scope.noOfLongTerm = $filter('filter')(newVal, {short_term: false});
        $scope.noOfShortTerm = $filter('filter')(newVal, {short_term: true});

        if ($scope.markers) {
            $scope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });
        }

        $scope.markers = [];
        newVal.forEach(function (space) {
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
                labelStyle: {color:'#fff'}
            });

            google.maps.event.addListener(markerWithLabel, "click", function (e) {
                $scope.showBid(space);
            });

            $scope.markers.push(markerWithLabel);
        })
    });

    var center = $rootScope.map.getCenter();
    parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
        $scope.spaces = spaces;
    });


    $scope.centerMapOnCurrentLocation = function() {
        geolocationService.getCurrentLocation(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $rootScope.map.setCenter(pos);
        })
    };

    $scope.showBid = function (space) {
        $('.bar.bar-header').hide();
        $scope.selectedSpace = space;
        $scope.bid = {};
        $scope.bid.bid_amount = $scope.selectedSpace.price;
        $scope.bid.bid_currency = $scope.selectedSpace.currency;

        $state.go('home.map.search.place');

        google.maps.event.removeListener(dragListenHandle);
        var latLng = new google.maps.LatLng($scope.selectedSpace.location_lat, $scope.selectedSpace.location_long);
        $scope.previousZoom = $rootScope.map.getZoom();
        $scope.previousCenter = $rootScope.map.getCenter();

        if ($scope.searchRadiusCircle) {
            $scope.searchRadiusCircle.setMap();
        }

        if ($scope.markers) {
            $scope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });
        }

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

    };

    $scope.closeBid = function () {
        $('.bar.bar-header').show();
        $scope.spotThumbnail.setMap();
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

        setTimeout(function () {
            dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
        }, 500);

        $state.go('^');
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
                $scope.circleOptions.radius = prevRad + 50;
            }

        }
    };

    $scope.decreaseRadius = function () {
        var searchRadiusCircle = $scope.searchRadiusCircle;
        if (searchRadiusCircle) {
            var prevRad = searchRadiusCircle.getRadius();
            if (prevRad >= 100)
                $scope.circleOptions.radius = prevRad - 50;
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

});

