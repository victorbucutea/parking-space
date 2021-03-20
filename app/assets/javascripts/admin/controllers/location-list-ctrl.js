angular.module('ParkingSpaceAdmin.controllers')
    .controller('LocationListCtrl',
        ['$scope', '$state', '$rootScope', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, locationService, replaceById) {

                $scope.locations = [];
                locationService.getLocations((data) => {
                    $scope.locations = data;

                });


            }]);