angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserOffersCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {

                $scope.cloudName = window.cloudinaryName;

                parkingSpaceService.listOffers($scope.user, (spaces) => {
                    $scope.user.spaces = spaces;
                });


                $scope.edit = function (space) {
                    $scope.spaceEdit = space;
                    $state.go('.edit')

                }

                $scope.status = function (space) {
                    $scope.spaceEdit = space;
                    $state.go('.status')

                }

                $scope.delete = function (space) {

                }

            }]);