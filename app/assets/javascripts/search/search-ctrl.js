//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/


angular.module('ParkingSpace.controllers').controller('SearchAddressCtrl',
    ['$scope', '$rootScope', 'userService', 'geoService','$document' , function ($scope, $rootScope, userService, geoService, $document) {


        $scope.selectPlace = function(place , location) {
            $scope.searchLocation = location;
            $scope.search()
        };

        $scope.centerOnPosition = function () {
            geoService.getCurrentPosition((result, position) => {
                $scope.currentAddress = result;
                $scope.currentPosition = position;
            });
        };

        if (!sessionStorage.getItem("current_user")) {
            userService.getUser(function (user) {
                if (!user) return;
                let userjson = JSON.stringify(user);
                sessionStorage.setItem("current_user", userjson);
            });
        }

        $scope.shouldSuggest = (addr) => {
            return (addr && addr.length > 3);
        };


        $scope.search = function () {
            let location = '/app/index.html#!/home/login?';
            if (!$scope.searchLocation) {
                window.location = location;
            } else {
                let coords = $scope.searchLocation;
                location += 'lat=' + coords.lat() + '&lng=' + coords.lng();
                window.location = location;
            }
        };


    }]);