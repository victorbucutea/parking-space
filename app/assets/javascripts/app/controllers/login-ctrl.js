angular.module('ParkingSpaceMobile.controllers')
    .controller('LoginCtrl',
        ['$rootScope', '$stateParams', '$scope', '$http', 'parameterService', 'userService', '$state',
            function ($rootScope, $stateParams, $scope, $http, parameterService, userService, $state) {


                if (!$state.params.fbLogin) {
                    // if not redirect from fb
                    userService.getUser(function (user) {
                        if (!user) return;
                        $state.go('search', $stateParams);
                    });

                }

                $scope.login = function () {
                    if (!$scope.loginForm.$valid) {
                        $('#loginForm').addClass('was-validated');
                        return;
                    }

                    let user = $scope.userName;
                    let password = $scope.password;

                    userService.login(user, password, function () {
                        $scope.loading = true;
                        $state.go('search', $stateParams);
                    })
                };

                $scope.lat = $stateParams.lat;
                $scope.lng = $stateParams.lng;

                if ($scope.lat && $scope.lng) {
                    // hold a reference so we can access it later when redirecting from fb
                    sessionStorage.setItem('latLng', JSON.stringify({lat: $scope.lat, lng: $scope.lng}));
                }


                $scope.recoverPassword = function () {
                    if (!$scope.recoverPwForm.$valid) {
                        $('#recoverPwForm').addClass('was-validated');
                        return;
                    }

                    $('#recoverPassword').hide();
                    userService.recoverPassword($scope.recoveryEmail, function () {
                    });
                };

                $scope.logout = function () {
                    userService.logout(() => {
                        $state.go('login');
                    });
                };

                $scope.goToFb = function () {
                    let curLoc = location.origin + location.pathname;
                    $scope.loadingFb = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    window.location = 'https://www.facebook.com/v4.0/dialog/oauth?' +
                        'client_id=1725456304415807' +
                        '&redirect_uri=' + curLoc +
                        '&state=no_state_needed' +
                        '&response_type=token';
                };

                $scope.loginWithFb = function () {
                    $scope.loadingFb = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    let accessToken = sessionStorage.getItem("fb_token");
                    let latLng = JSON.parse(sessionStorage.getItem('latLng')) || {};

                    userService.loginFb(accessToken,
                        function (resp) {
                            // user successfully logged in
                            $state.go('search', latLng);
                        }, function (err, status) {
                            $scope.loadingFb = false;
                            if (status === 422) {
                                // user does not exist
                                // go to additional info page
                                $state.go("register", {
                                    fromFb: true,
                                    email: err.email,
                                    firstName: err.name,
                                    fbId: err.id,
                                    token: accessToken,
                                    lat: latLng.lat,
                                    lng: latLng.lng
                                });

                            } else {
                                // display error message
                                $rootScope.$emit('http.error',
                                    'Eroare la autentificarea facebook. Vă rugăm încercați din nou.');
                                $state.go("login", {
                                    fromFb: true,
                                    lat: latLng.lat,
                                    lng: latLng.lng
                                });
                            }
                        });
                };


                // it's a redirect from fb page
                if ($state.params.fbLogin) {
                    $scope.loginWithFb();
                }
            }]);