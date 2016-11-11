'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl', function ($rootScope, $scope, $document, parameterService, $state ) {


    $document.mousedown(function () {
        $scope.errMsg = null;
        $scope.notifMsg = null;
        $scope.$apply();
    });


    $rootScope.$on('http.error', function (event, data, status) {
        if (!$scope.errMsg) {
            $scope.errMsg = []
        }
        if (data instanceof Array) {
            $scope.errMsg = $scope.errMsg.concat(data);
        } else {
            if ($scope.errMsg.indexOf(data) == -1)
                $scope.errMsg.push(data);
        }
    });

    $rootScope.$on('http.notif', function (event, data, status) {
        if (!$scope.notifMsg) {
            $scope.notifMsg = []
        }
        if (data instanceof Array) {
            $scope.notifMsg = $scope.notifMsg.concat(data);
        } else {
            if ($scope.notifMsg.indexOf(data) == -1)
                $scope.notifMsg.push(data);
        }
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

    $document.on('click','.ps-modal', function(event){
        if ($(event.target).hasClass('ps-modal'))
            $state.go('^');
    })

});
