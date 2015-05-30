'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl', function ($rootScope, $scope, $document, parameterService, $state) {

    setTimeout(function () {
        $rootScope.$broadcast('notification', 3);
    }, 2500);

    $document.mousedown(function () {
        $scope.errMsg = null;
        $scope.notifMsg = null;
        $scope.$apply();
    });


    $rootScope.$on('http.error', function (event, data, status) {
        $scope.errMsg = data;
    });

    $rootScope.$on('http.notif', function (event, data, status) {
        $scope.notifMsg = data;
    });

    $scope.showHelp = function () {
        var currentState = $state.current.name;
        if (!currentState) {
            return;
        }

        if (currentState.indexOf('help') > -1) {
            return;//already in help
        }

        $state.go(currentState + '.help');
    };

    $scope.shortTermExp = function () {
        return parameterService.getShortTermExpiration();
    };

    $scope.longTermExp = function () {
        return parameterService.getLongTermExpiration();
    };

});
