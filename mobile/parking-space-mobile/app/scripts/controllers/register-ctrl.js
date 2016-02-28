/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl', function ($rootScope, $stateParams, $scope, parameterService, ENV, userService, $state) {

    $('.bar.bar-header').hide();
    $('#register').hide();
    $('.fa-spin.fa-spinner').hide();

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
                if (item.key == $scope.user.country) {
                    $scope.selectedCountry = item;
                }
            });
        }
    }

/*
    Enable this with ng-repeat-finish="scroll" , to scroll the country list down to user country
    ng-repeat-finish seems to be triggered before all child repeat elements have been calculated in the dom
    $scope.scroll = function(){
        var countryList = $('.country-list');
        var countryDivs = countryList.children().toArray();
        var selectedCountryKey = $scope.selectedCountry ? $scope.selectedCountry.key : "selected";
        var selectedItem = countryList.find("."+selectedCountryKey);
        // scroll down to selectedItem
        var selItemHeight = selectedItem.height();
        var scrollSize = 0;
        for (var x = 0; x < countryDivs.length; x++) {
            // we got to the scroll point where selectedItem is located
            if (countryDivs[x] == selectedItem) break;
            scrollSize += selItemHeight;
        }
        countryList.scrollTop(scrollSize);
    };*/

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