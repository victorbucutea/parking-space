angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserSpacesStatusCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {


                $scope.statuses = [
                    "validated",
                    "missing_title_deed",
                    "validation_pending"];

                $scope.save = function (space) {

                    if (!$scope.statusForm.$valid) {
                        $('#statusForm').addClass('was-validated');
                        return;
                    }
                    parkingSpaceService.saveSpace(space).then( (space) => {
                        replaceById(space, $scope.spaces);
                        $rootScope.$emit('http.notif', `Noul status - ${space.status} - salvat cu succes`);
                        $state.go('^');
                    });

                };
            }]);