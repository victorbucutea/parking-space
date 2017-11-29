/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('DeleteParkingSpaceCtrl', function ($scope, parkingSpaceService, $state, $stateParams) {

    $scope.deleteSpace = function () {
        var parkingSpaceId = $stateParams.parking_space_id;
        parkingSpaceService.deleteSpace(parkingSpaceId);
        var idx = -1;
        for ( var i = 0 ; i < $scope.spaces.length; i++) {
            if ($scope.spaces[i].id == parkingSpaceId) {
                idx = i;
                break;
            }
        }
        if (idx > -1) {
            $scope.spaces.splice(idx, 1);
        }
        $state.go('^');
    };

});