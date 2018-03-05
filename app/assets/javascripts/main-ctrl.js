angular.module('ParkingSpace.controllers')
    .controller('MainCtrl', function ($scope, $rootScope, $document, geoService) {

        $scope.scrollTo = function (menu) {
            $scope.menu = menu;
            $.scrollTo('#' + menu,200);
        };


        $scope.show = function(item) {
            $('#'+item).slideToggle(200);
        }


    });