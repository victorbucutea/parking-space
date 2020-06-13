angular.module('ParkingSpaceAdmin.controllers')
    .controller('LoginCtrl',
        ['$rootScope', '$stateParams', '$scope', '$http', 'parameterService', 'userService', '$state',
            function ($rootScope, $stateParams, $scope, $http, parameterService, userService, $state) {


                $scope.login = function () {
                    if (!$scope.loginForm.$valid) {
                        $('#loginForm').addClass('was-validated');
                        return;
                    }

                    let user = $scope.userName;
                    let password = $scope.password;

                    userService.login(user, password).then(() => {
                        $scope.loading = true;
                        $state.go('main');
                    })
                };


                $scope.recoverPassword = function () {
                    if (!$scope.recoverPwForm.$valid) {
                        $('#recoverPwForm').addClass('was-validated');
                        return;
                    }

                    $('#recoverPassword').hide();
                    userService.recoverPassword($scope.recoveryEmail, function () {
                    });
                };
            }]);