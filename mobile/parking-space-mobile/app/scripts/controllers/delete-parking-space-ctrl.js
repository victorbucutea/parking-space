/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('DeleteParkingSpaceCtrl', function ($scope, parkingSpaceService,$state) {
        $scope.deleteSpace = function (parkingSpaceId) {
                parkingSpaceService.deleteSpace(parkingSpaceId);
                $state.go('^');
        };

})