/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl', function ($rootScope, $stateParams, $scope, parameterService, ENV, userService, ezfb, $state) {

    $('.bar.bar-header').hide();
    $('.fa-spin.fa-spinner').hide();


    $scope.loginWithFb = function () {
        ezfb.login(function (res) {
            if (res.authResponse) {
                ezfb.api('/me?fields=email,location{location},name', function (res) {
                    $('#register-fb').show();
                    $('#login').hide();
                    $scope.email = res.email;
                    $scope.firstName = res.name;
                    if (res.location) {
                        $scope.countries.forEach(function (ctry) {
                            var location = res.location.location;
                            if (ctry.value4.toLocaleLowerCase() === location.country.toLocaleLowerCase()) {
                                $scope.selectedCountry = ctry;
                            }
                        });
                    }

                })
            } else {
                $rootScope.$broadcast('http.error', [{
                    fieldName: '',
                    text: 'Error while logging into facebook. Please try again.'
                }]);
            }
        }, {scope: 'public_profile,email,user_location'})
    };


    $scope.user = {};

    userService.getUser(function (user) {
        if (!user) return;
        $scope.user = user;
        $scope.user.phone_number = $scope.user.phone_number.replace("+", "");
    });

    // get the list of countries
    function selectUserCountry(countries) {
        if ($scope.user && countries) {
            countries.forEach(function (item) {
                if (item.key === $scope.user.country) {
                    $scope.selectedCountry = item;
                }
            });
        }
    }

    parameterService.getCountryListAsync(function (countries) {
        $scope.countries = countries;
        selectUserCountry(countries);
    });


    $scope.selectCountry = function (ctry) {
        $scope.selectedCountry = ctry;
        $scope.user.country = ctry.key;
    };


    $scope.recoverPassword = function () {
        $('#recoverPassword').hide();
        userService.recoverPassword($scope.recoveryEmail, function () {
        });
    };


    $scope.login = function () {
        var user = $scope.userName;
        var password = $scope.password;

        userService.login(user, password, function () {
            $state.go('home.map.search');
        })
    };

    $scope.save = function () {
        if (!$scope.registerForm.$valid || !$scope.selectedCountry) {
            $('#requiredFieldsDialog').show();
            return;
        }

        userService.saveUser($scope.user, function (user) {
            $state.go('^');
        });
    };

    $scope.registerWithFb = function () {
        if (!$scope.registerForm.phoneNumber.$valid) {
            $('#requiredFieldsFbDialog').show();
            return;
        }


        backEndRegister(hashCode($scope.email));
    };


    $scope.register = function () {
        if (!$scope.registerForm.$valid || !$scope.selectedCountry) {
            $('#requiredFieldsDialog').show();
            return;
        }

        backEndRegister($scope.password);
    };

    var backEndRegister = function (password) {
        var backEndUser = {};
        backEndUser.full_name = $scope.firstName;
        backEndUser.phone_number = $scope.selectedCountry.prefix + $scope.phoneNumber;
        backEndUser.country = $scope.selectedCountry.key;
        backEndUser.email = $scope.email;
        backEndUser.password = password;
        backEndUser.password_confirmation = password;


        $('.fa-spin.fa-spinner').show();

        userService.registerUser(backEndUser, function () {
            $state.go('home.map.search');
        }, function (errData, status) {
            if (status === 422) {
                userService.login(backEndUser.email, hashCode(backEndUser.email), function (data) {
                    console.log(data);
                })
            }
        });
    };

    var hashCode = function (string) {
        var hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
});