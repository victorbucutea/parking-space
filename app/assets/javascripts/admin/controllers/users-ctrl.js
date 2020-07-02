angular.module('ParkingSpaceAdmin.controllers')
    .controller('UsersCtrl',
        ['$scope', '$state', '$rootScope', 'companyUserService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, userService, locationService, replaceById) {


                $scope.searchUser = function (searcg) {

                    userService.listUsers(searcg, (data) => {
                        $scope.users = data;
                    })
                };

                $scope.getAllRoles = function () {
                    userService.getAllRoles((data) => {
                        $scope.allRoles = data;
                    })
                };

                $scope.showControls = function (user, $event) {
                    $('#expandedRow-' + user.id).slideToggle();
                    user.showMenu = true;
                    $state.go('.spaces');
                }


                $scope.showFullImageThumb = function (evt, space) {
                    $rootScope.$emit('showCarouselImages', space.images);
                    evt.stopPropagation();
                };


            }]);