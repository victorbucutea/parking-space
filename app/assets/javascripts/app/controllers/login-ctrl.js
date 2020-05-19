angular.module('ParkingSpaceMobile.controllers')
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
                        $state.go('map.search', $stateParams);
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


                $scope.goToFb = function () {
                    let curLoc = location.origin + location.pathname
                    $scope.loadingFb = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    window.location = 'https://www.facebook.com/v6.0/dialog/oauth?' +
                        'client_id=1725456304415807' +
                        '&redirect_uri=' + curLoc +
                        '&state=no_state_needed' +
                        '&response_type=token';
                };


                // it's a redirect from fb page
                let isFbLoginOk = location.hash.indexOf("fbLogin=ok") !== -1;
                if (isFbLoginOk) {
                    $scope.loadingFb = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    let accessToken = sessionStorage.getItem("fb_token");


                    userService.loginFb(accessToken).then(() => {
                        $state.go('map.search')
                    }, (err) => {
                        $scope.loadingFb = false;
                        if (err.status === 422) {
                            // user does not exist
                            // go to additional info page
                            $state.go("register", {
                                fromFb: true,
                                email: err.data.email,
                                firstName: err.data.name
                            });
                        } else {
                            // display error message
                            $rootScope.$emit('http.error',
                                'Eroare la autentificarea facebook. Vă rugăm încercați din nou.');
                            $state.go("login", {
                                fromFb: true
                            });
                        }
                        console.log('error', err);
                    });
                } else {
                    userService.getUser().then((user) => {
                        if (user)
                            $state.go('map.search', $stateParams);
                    });
                }


            }]);