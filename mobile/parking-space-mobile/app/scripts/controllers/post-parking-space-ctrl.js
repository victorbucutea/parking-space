/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('PostParkingSpaceCtrl', function ($rootScope, $scope, $state, parameterService, geocoderService, geolocationService) {


    $scope.marker = {};

    if ($rootScope.map) {
        $rootScope.map.setZoom(19);
    }


    $scope.review = function () {
        $scope.spaceEdit = {};
        angular.copy($scope.space, $scope.spaceEdit);
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

    $scope.expirationDate = function () {
        var stExp = parameterService.getShortTermExpiration();
        var ltExp = parameterService.getLongTermExpiration();
        var x = new Date();
        if ($scope.spaceEdit) {
            if ($scope.spaceEdit.short_term) {
                var in5Min = new Date(x.getTime() + stExp * 60000);
                var s = in5Min.toLocaleDateString() + " at " + in5Min.toLocaleTimeString();
                s = s.substring(0, s.length - 3);
                return s;
            } else {
                var in2Weeks = new Date(x.getTime() + ltExp * 60000 * 60 * 24 * 7);
                var s1 = in2Weeks.toLocaleDateString() + " at " + in2Weeks.toLocaleTimeString();
                s1 = s1.substring(0, s1.length - 3);
                return s1;
            }
        }

        return "";
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


            if (!$scope.space.title) {
                $scope.space.title = sublocality;
            }

            $scope.$apply();
        });
    };

    var zoomChangedHandler = google.maps.event.addListener($rootScope.map, 'zoom_changed', $scope.zoomChangedClbk);
    var calcAddressHandler = google.maps.event.addListener($rootScope.map, 'idle', $scope.calculateAddress);


    $scope.$on('$stateChangeStart' , function (event, toState) {
        google.maps.event.removeListener(zoomChangedHandler);
        google.maps.event.removeListener(calcAddressHandler);
    });

});

