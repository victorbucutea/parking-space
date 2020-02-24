/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('DeleteParkingSpaceCtrl',
    ['$scope', 'parkingSpaceService', '$state', '$stateParams', '$rootScope',
        function ($scope, parkingSpaceService, $state, $stateParams, $rootScope) {

    $scope.deleteSpace = function () {
        let parkingSpaceId = $stateParams.parking_space_id;
        parkingSpaceService.deleteSpace(parkingSpaceId, () => {
            $rootScope.$emit('spaceDelete',parkingSpaceId)
        });
        $state.go('search');
    };

}]);