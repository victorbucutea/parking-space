/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl',
    ['$rootScope', '$stateParams', '$scope', 'parameterService', 'userService', '$state',
        function ($rootScope, $stateParams, $scope, parameterService, userService, $state) {


            $scope.fromFb = $stateParams.fromFb;
            $scope.user = {};
            $scope.user.email = $stateParams.email;
            $scope.user.full_name = $stateParams.firstName;
            $scope.newImage = [];
            $scope.existingImage = [];

            if ($stateParams.inside) {
                $scope.inside = true;
                userService.getUser().then((user) => {
                    $scope.user = user;
                })
            }


            $scope.register = function () {

                if (!$scope.registerForm.$valid) {
                    $('#registerForm').addClass('was-validated');
                    return;
                }
                let user = $scope.user;
                if ($scope.registerForm && $scope.registerForm.pw) {
                    user.password = $scope.registerForm.pw.$viewValue;
                    user.password_confirmation = user.password;
                }

                $scope.user.images.submit().then((publicIds) => {
                    let userCopy = angular.copy(user);
                    userCopy.images = null;
                    if ($stateParams.inside) {
                        userService.saveUser(userCopy, function () {
                            userService.attach_images(publicIds).then( () => {
                                $state.go('map.search');
                            })
                        });
                    } else {
                        userService.registerUser(userCopy, function () {
                            userService.attach_images(publicIds).then( () => {
                                $state.go('map.search');
                            })
                        });
                    }
                })

            };


            $scope.recoverPassword = function () {
                if (!$scope.recoverPwForm.$valid) {
                    $('#recoverPwForm').addClass('was-validated');
                    return;
                }

                $('#recoverPassword').hide();
                userService.recoverPassword($scope.recoveryEmail, function () {
                    $state.go('login');
                });
            };

            $scope.showTerms = function () {
                $rootScope.$emit('terms');
            };


            $scope.back = function () {
                if ($scope.inside) {
                    $state.go('map.search');
                } else {
                    $state.go('login');
                }
            };
        }]);