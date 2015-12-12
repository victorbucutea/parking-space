/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('DeleteParkingSpaceCtrl', function ($scope, parkingSpaceService,$state) {
        $scope.deleteSpace = function (parkingSpace) {
                parkingSpaceService.deleteSpace(parkingSpace.id);
                var idx = $scope.spaces.indexOf(parkingSpace);
                if (idx > -1) {
                        $scope.spaces.splice(idx, 1);
                }
                $state.go('^');
        };

});