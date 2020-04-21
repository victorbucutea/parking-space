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
                    if (user.image)
                        $scope.existingImage.push(user.image);
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

                $scope.newImage.submit().then((publicIds) => {
                    if (publicIds.length)
                        user.image = publicIds[0].name;
                    if ($stateParams.inside) {
                        userService.saveUser(user, function () {
                            $state.go('search');
                        });
                    } else {
                        userService.registerUser(user, function () {
                            $state.go('search');
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


            $scope.back = function () {
                if ($scope.inside) {
                    $state.go('search');
                } else {
                    $state.go('login');
                }
            };
        }]);