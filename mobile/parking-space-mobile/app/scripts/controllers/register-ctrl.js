/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl', function ($rootScope, $scope, parameterService, ENV, userService, $state, $stateParams) {

    $('.bar.bar-header').hide();
    $('#register').hide();
    $('.fa-spin.fa-spinner').hide();

    if ($stateParams.hide_blanket) {
        $('#login-blanket').hide();
    }

    // get the list of countries

    parameterService.getCountryListAsync(function(countries){
        $scope.countries = countries;
    });


    $scope.selectCountry = function (ctry) {
        $scope.selectedCountry = ctry;
    };


    $scope.recoverPassword = function() {
        $('#recoverPassword').hide();
        userService.recoverPassword($scope.recoveryEmail, function(){

        });
    };


    $scope.login = function () {
        var user = $scope.userName;
        var password = $scope.password;

        userService.login(user, password, function() {
            $state.go('home.map.search');
        })

    };

    $scope.register = function () {
        if (!$scope.registerForm.$valid || !$scope.selectedCountry) {
            $('#requiredFieldsDialog').show();
            return;
        }

        var backEndUser = {};
        backEndUser.full_name = $scope.firstName;
        backEndUser.phone_number = $scope.selectedCountry.prefix + $scope.phoneNumber;
        backEndUser.country = $scope.selectedCountry.key;
        backEndUser.email = $scope.email;
        backEndUser.password = $scope.password;
        backEndUser.password_confirmation = $scope.password;

        $('.fa-spin.fa-spinner').show();
        userService.registerUser(backEndUser, function () {
            $state.go('home.map.search');
        });

    }
});