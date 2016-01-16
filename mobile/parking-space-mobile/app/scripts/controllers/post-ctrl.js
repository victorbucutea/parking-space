/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('PostParkingSpaceCtrl', function ($rootScope, $scope, $state, parameterService, geocoderService, geolocationService) {

    $scope.marker = {};

    $scope.review = function () {
        $scope.spaceEdit = {};
        angular.copy($scope.space, $scope.spaceEdit);
        $scope.spaceEdit.title = "";
        $scope.spaceEdit.space_availability_start = new Date();
        $scope.spaceEdit.space_availability_stop = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
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

    $scope.zoomChangedClbk = function () {
        var zoomLevel = $rootScope.map.getZoom();
        $("#handPointer").hide();
        var scale = 0.3;

        switch (zoomLevel) {
            case 18 :
                scale = 0.3;
                setTimeout(function () {
                    $("#handPointer").show();
                }, 1500);
                break;
            case 19 :
                scale = 0.5;
                setTimeout(function () {
                    $("#handPointer").show();
                }, 1500);
                break;
            case 20 :
                scale = 0.8;
                break;
            case 21 :
                scale = 1;
                break;
            default:
                scale = 0.3;
                setTimeout(function () {
                    $("#handPointer").show();
                }, 1500);
                break;
        }

        $('#parkingAreaRectangle').css('transform', 'scale(' + scale + ')');

    };

    $scope.zoomChangedClbk();

    $scope.calculateAddress = function () {
        var mapCenter = $rootScope.map.getCenter();

        geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {

            if (!$scope.space)
                $scope.space = {price: parameterService.getStartingAskingPrice(), currency: parameterService.getStartingCurrency()};

            var street = newAddr.street || '';
            var street_number = newAddr.street_number || '';
            var sublocality = newAddr.sublocality ||
                newAddr.administrative_area_level_2 ||
                newAddr.administrative_area_level_1 || '';
            var city = newAddr.city || '';

            $scope.space.address_line_1 = street + ', ' + street_number;
            $scope.space.address_line_2 = sublocality + ', ' + city;
            $scope.space.location_lat = mapCenter.lat();
            $scope.space.location_long = mapCenter.lng();
            $scope.space.rotation_angle = $scope.marker.rotation || 0;
            $scope.space.title = sublocality;
            $scope.space.sublocality = sublocality;

            $scope.$digest();
        });
    };

    $scope.calculateAddress();

    var zoomChangedHandler = google.maps.event.addListener($rootScope.map, 'zoom_changed', $scope.zoomChangedClbk);
    var calcAddressHandler = google.maps.event.addListener($rootScope.map, 'idle', $scope.calculateAddress);


    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('home.map.post') == -1) {
            google.maps.event.removeListener(zoomChangedHandler);
            google.maps.event.removeListener(calcAddressHandler);
        }
    });

});

