/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl', function ($rootScope, $stateParams, $scope, parameterService, ENV, userService, ezfb, $state) {

    $('[data-toggle="tooltip"]').tooltip();


    if ($stateParams.inside) {
        userService.getUser(function (user) {
            if (!user) return;
            $scope.user = user;
            $scope.user.phone_number = $scope.user.phone_number.replace("+", "");
        });
    } else {
        $scope.user = {country: 'ro'};
        $scope.prefix = '+40';
    }


    $scope.fromFb = $stateParams.fromFb;
    $scope.email = $stateParams.email;
    $scope.fbId = $stateParams.fbId;
    $scope.firstName = $stateParams.firstName;
    $scope.token = $stateParams.token;

    $scope.$watch('registerForm.licensePlate.$valid', function (newVal) {
        if (!newVal) return;
        let init = $scope.licensePlate;
        if (!init) return;

        let no = /(\d)+/g.exec(init)[0];
        let county = /([a-zA-Z])+/g.exec(init)[0];
        let code = /([a-zA-Z])+$/g.exec(init)[0];
        $scope.licensePlate = county.toLocaleUpperCase() + '-' + no + '-' + code.toLocaleUpperCase();
    });

    $scope.options = {
        phoneNumber: {
            delimiters: ['.', '.'],
            blocks: [3, 3, 3],
            numericOnly: true
        }
    };


    $scope.save = function () {
        if (!$scope.registerForm.$valid) {
            $('#registerForm').addClass('was-validated');
            return;
        }

        userService.saveUser($scope.user, function (user) {
            $state.go('^');
        });
    };


    $scope.register = function () {

        if (!$scope.registerForm.$valid) {
            $('#registerForm').addClass('was-validated');
            return;
        }

        let backEndUser = {};
        backEndUser.full_name = $scope.firstName;
        backEndUser.phone_number = $scope.prefix + $scope.phoneNumber;
        backEndUser.country = $scope.user.country;
        backEndUser.email = $scope.email;
        backEndUser.password = $scope.password;
        backEndUser.license = $scope.licensePlate;
        backEndUser.password_confirmation = $scope.password;


        userService.registerUser(backEndUser, function () {
            $state.go('home.map.search');
        });

    };
});