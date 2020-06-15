angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserSpacesCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {

                $scope.cloudName = window.cloudinaryName;

                parkingSpaceService.getMySpaces((spaces) => {
                    $scope.user.spaces = spaces;
                });


                $scope.edit = function (space) {
                    $scope.spaceEdit = space;
                    $state.go('.edit')

                }


                $scope.delete = function (space) {

                }


                $scope.showFullImageThumb = function (evt, space) {
                    $rootScope.$emit('showCarouselImages', space.images);
                    evt.stopPropagation();
                };

                $scope.$watch('', function (newValue, oldValue) {

                });
            }]);