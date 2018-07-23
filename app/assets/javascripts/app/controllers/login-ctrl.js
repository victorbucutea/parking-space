angular.module('ParkingSpaceMobile.controllers')
    .controller('LoginCtrl',
        ['$rootScope', '$stateParams', '$scope', '$http', 'parameterService', 'userService', 'ezfb', '$state',
            function ($rootScope, $stateParams, $scope, $http, parameterService, userService, ezfb, $state) {


                if (!$state.params.fbLogin) {
                    // if not redirect from fb
                    if (sessionStorage.getItem('current_user')) {
                        $state.go('home.search', $stateParams);
                    } else {
                        userService.getUser(function (user) {
                            if (!user) return;
                            let userjson = JSON.stringify(user);
                            sessionStorage.setItem("current_user", userjson);
                            $state.go('home.search');
                        });
                    }
                }

                $scope.login = function () {
                    if (!$scope.loginForm.$valid) {
                        $('#loginForm').addClass('was-validated');
                        return;
                    }

                    let user = $scope.userName;
                    let password = $scope.password;

                    userService.login(user, password, function () {
                        $state.go('home.search', $stateParams);
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


                $scope.goToFb = function () {
                    let curLoc = location.origin + location.pathname;

                    window.location = 'https://www.facebook.com/v3.0/dialog/oauth?' +
                        'client_id=1725456304415807' +
                        '&redirect_uri=' + curLoc +
                        '&state=no_state_needed' +
                        '&response_type=token';
                };

                $scope.loginWithFb = function () {
                    $('#loadingBlanket').show();
                    ezfb.getLoginStatus().then(function (loginRes) {
                        let authResponse = loginRes.authResponse;
                        let latLng = JSON.parse(sessionStorage.getItem('latLng')) || {};
                        if (authResponse) {
                            ezfb.api('/me?fields=email,location{location},name', function (res) {
                                // attempt to login via fb
                                userService.loginFb(authResponse.userID, authResponse.accessToken, res.email,
                                    function (resp) {
                                        // user successfully logged in
                                        $('#loadingBlanket').hide();

                                        $state.go('home.search', latLng);
                                    }, function (err, status) {
                                        $('#loadingBlanket').hide();
                                        if (status === 422) {
                                            // user does not exist
                                            // go to additional info page
                                            $state.go("home.register", {
                                                fromFb: true,
                                                email: res.email,
                                                firstName: res.name,
                                                fbId: authResponse.userID,
                                                token: loginRes.authResponse.accessToken,
                                                lat: latLng.lat,
                                                lng: latLng.lng
                                            });

                                        } else {
                                            // display error message
                                            $rootScope.$emit('http.error',
                                                'Eroare la autentificarea facebook. Vă rugăm încercați din nou.');
                                            $state.go("home.login", {
                                                fromFb: true,
                                                lat: latLng.lat,
                                                lng: latLng.lng
                                            });
                                        }
                                    });
                            });

                        } else {
                            $('#loadingBlanket').hide();

                            $rootScope.$emit('http.error',
                                'Eroare la autentificarea facebook. Vă rugăm încercați din nou.');
                        }
                    }, {scope: 'public_profile,email,user_location'})
                };


                // it's a redirect from fb page
                if ($state.params.fbLogin) {
                    $scope.loginWithFb();
                }

            }]);