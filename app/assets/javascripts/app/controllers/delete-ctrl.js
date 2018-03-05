/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('DeleteParkingSpaceCtrl', function ($scope, parkingSpaceService, $state, $stateParams) {

    $scope.deleteSpace = function () {
        let parkingSpaceId = $stateParams.parking_space_id;
        parkingSpaceService.deleteSpace(parkingSpaceId);
        $state.go('home.map.search');
    };

});