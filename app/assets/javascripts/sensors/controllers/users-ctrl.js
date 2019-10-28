angular.module('ParkingSpaceSensors.controllers')
    .controller('UsersCtrl',
        ['$scope', '$state', '$rootScope', 'companyUserService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, userService, locationService, replaceById) {



                $scope.searchUser = function (searcg) {

                    userService.loadCompanyUsers(searcg, (data) => {
                        $scope.users = data;
                    })
                };

                $scope.getAllRoles = function () {
                    userService.getAllRoles((data) => {
                        $scope.allRoles = data;
                    })
                };


                $scope.goEditRoles = function(user) {
                    $scope.selectedUser = user;
                    $scope.getAllRoles();
                    $state.go('.rights');
                }

                $scope.selectUser = function(user) {
                }


            }]);