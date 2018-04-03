/**
 * Created by 286868 on 06.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('RegisterCtrl',
    ['$rootScope', '$stateParams', '$scope', 'parameterService', 'userService', 'ezfb', '$state',
    function ($rootScope, $stateParams, $scope, parameterService, userService, ezfb, $state) {

    $('[data-toggle="tooltip"]').tooltip();

    if ($stateParams.inside) {
        $scope.inside = true;
        userService.getUser(function (user) {
            if (!user) return;

            if (!user.phone_no_confirm) {
                $state.go('home.map.search.confirm-phone');
            }
            $scope.firstName = user.full_name;
            $scope.phoneNumber = user.phone_number.replace("+40", "");
            $scope.country = user.country;
            $scope.email = user.email;
            $scope.pw = user.pw;
            $scope.licensePlate = user.license;
            $scope.pw_confirmation = user.pw;
        });
    }

    $scope.prefix = '+40';
    $scope.user = {country: 'ro'};

    $scope.fromFb = $stateParams.fromFb;
    $scope.email = $stateParams.email;
    $scope.fbId = $stateParams.fbId;
    $scope.firstName = $stateParams.firstName;
    $scope.token = $stateParams.token;
    $scope.lat = $stateParams.lat;
    $scope.lng = $stateParams.lng;

    console.log($stateParams);

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
        backEndUser.password = $scope.registerForm.pw.$viewValue;
        backEndUser.password_confirmation = backEndUser.pw;
        backEndUser.license = $scope.licensePlate;


        if ($stateParams.inside) {
            userService.saveUser(backEndUser, function () {
                $state.go('home.map.search',{lat:$scope.lat,lng:$scope.lng});
            });
        } else {
            userService.registerUser(backEndUser, function () {
                $state.go('home.map.search',{lat:$scope.lat,lng:$scope.lng});
            });
        }

    };


    $scope.back = function () {
        if ($scope.inside) {
            $state.go('^');
        } else {
            $state.go('home.login',{lat:$scope.lat,lng:$scope.lng});
        }
    };
}]);