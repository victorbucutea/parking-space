/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (geocoderService, notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $stateParams) {
    $rootScope.map.setZoom(15);

    var center = $rootScope.map.getCenter();

    $scope.circleOptions = {
        strokeColor: '#111',
        strokeWeight: 0.5,
        fillColor: '#333',
        fillOpacity: 0.1,
        map: $rootScope.map,
        radius: parameterService.getDefaultSearchRadius()
    };

    var blueIcon = {
        url: 'images/marker_blue.png',
        scaledSize: new google.maps.Size(53, 53)
    };

    var orangeIcon = {
        url: 'images/marker_orange.png',
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

        return (new Date(lastUpdateNewItems).getTime() >= new Date(lastUpdateOldItems).getTime());
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

        var refreshSpacesInScope = function (newSpaces){
            $scope.spaces = newSpaces;
            if (newSpaces && newSpaces.length) {
                newSpaces.forEach(function (item) {
                    if (!$scope.selectedSpace) {
                        return;
                    }
                    if (item.id == $scope.selectedSpace.id) {
                        $scope.selectedSpace = item;
                    }
                });
            }
        };

        if (!parkingSpaceListUpdated(newVal)) {
            // we still want to keep updates to offers and other non-critical info
            refreshSpacesInScope(newVal);
            return;
        }
        refreshSpacesInScope(newVal);

        if (!newVal || newVal.length == 0) {
            $scope.selectedSpace = null;
        }

        if (!$rootScope.markers) {
            $rootScope.markers = [];
        }

        $rootScope.markers.forEach(function (d) {
            d.setMap();//clear marker
        });

        var replaceMarker = function (space) {
            var currencyElm = $('<i class="fa" ></i>');
            var currency = currencyFactory.getCurrency(space.currency);
            currencyElm.addClass(currency);
            var currencyHtml = currencyElm.wrap('<p/>').parent().html();
            var price = space.price + "";
            var xCoord = price.length == 1 ? 8 : 15;

            var markerOptions = {
                position: new google.maps.LatLng(space.location_lat, space.location_long),
                map: $rootScope.map,
                icon: blueIcon,
                labelContent: space.price + ' ' + currencyHtml,
                labelAnchor: new google.maps.Point(xCoord, 44),
                labelStyle: {color: '#fff'}
            };

            var markerWithLabel = new MarkerWithLabel(markerOptions);

            if (space.id == $stateParams.parking_space_id) {
                $scope.selectedSpace = space;
                $scope.selectedMarker = markerWithLabel;
                markerWithLabel.setIcon(orangeIcon);
                if (!$scope.$$phase)
                    $scope.$digest();
            }


            markerWithLabel.listener = google.maps.event.addListener(markerWithLabel, "click", function (e) {
                if ($scope.selectedMarker) {
                    $scope.selectedMarker.setIcon(blueIcon);
                }

                $scope.selectedMarker = markerWithLabel;
                markerWithLabel.setIcon(orangeIcon);
                $scope.selectedSpace = space;
                if (!$scope.$$phase)
                    $scope.$digest();

                $state.go('.bids');
            });

            $rootScope.markers.push(markerWithLabel);
        };

        newVal.forEach(replaceMarker)
    };

    $scope.closeParkingSpaceInfo = function() {
        $scope.selectedSpace = null;
        if ($scope.selectedMarker) {
            $scope.selectedMarker.setIcon(blueIcon);
        }
    };

    parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
       drawSpaces(spaces);
    });


    $scope.showPostSpace = function() {
        $scope.spaceEdit = {};
        angular.copy($scope.space, $scope.spaceEdit);
        $scope.spaceEdit.title = "";
        $scope.spaceEdit.space_availability_start = new Date();
        $scope.spaceEdit.space_availability_stop = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
        geolocationService.getCurrentLocation(function (position) {
            $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
            $scope.spaceEdit.recorded_from_long = position.coords.longitude;
        });
        $state.go('.post');
    };


    $scope.calculateAddress = function () {
        var mapCenter = $rootScope.map.getCenter();

        geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {

            var space = $scope.space;
            if (!space)
               space = $scope.space = {price: parameterService.getStartingAskingPrice(), currency: parameterService.getStartingCurrency()};

            var street = newAddr.street || '';
            var street_number = newAddr.street_number || '';
            var sublocality = newAddr.sublocality ||
                newAddr.administrative_area_level_2 ||
                newAddr.administrative_area_level_1 || '';
            var city = newAddr.city || '';

            space.address_line_1 = street + ', ' + street_number;
            space.address_line_2 = sublocality + ', ' + city;
            space.location_lat = mapCenter.lat();
            space.location_long = mapCenter.lng();
            space.title = sublocality;
            space.sublocality = sublocality;

            // not used for now$('.address-text').text(space.address_line_1 + ", " + space.address_line_2);
        });
    };

    $scope.calculateAddress();

    var calcAddressHandler = google.maps.event.addListener($rootScope.map, 'idle', $scope.calculateAddress);


    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('home.map.search') == -1) {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap();

            google.maps.event.removeListener(dragListenHandle);
            google.maps.event.removeListener(calcAddressHandler);

            if ($rootScope.markers) {
                $rootScope.markers.forEach(function (d) {
                    d.setIcon(blueIcon);
                    // remove click handler for markers
                    google.maps.event.removeListener(d.listener);
                });
            }
        }
    });
});

