'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl', function ($rootScope, $scope, $document, $timeout, authenticationService) {

        $timeout(function () {
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

    })
