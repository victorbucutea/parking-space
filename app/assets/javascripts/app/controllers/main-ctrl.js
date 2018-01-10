'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl', function ($rootScope, $scope, $document, parameterService, $state, userService) {


    $document.mousedown(function () {
        $scope.errMsg = null;
        $scope.notifMsg = null;
        $scope.warningMsg = null;
        $scope.$apply();
    });


    $scope.openMenu = function() {
        $('.drawer').fadeIn(200);
        $('#drawer').css('left','0');
    };

    $scope.closeMenu = function(){
        $('#drawer').css('left','-100%');
        $('.drawer').fadeOut(200);
    };

    $scope.selectPlace = function(newAddr, newLocation){
        $scope.selectedAddress = newAddr;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        $scope.selectedLocation = newLocation;
    };

    $scope.dateFilter = {};


    let addMsg = function (type, msg) {
        if (msg instanceof Array) {
            msg.forEach((text) => {
                if (type.indexOf(text) === -1)
                    type.push(text);
            });
        } else {
            if (type.indexOf(msg) === -1)
                type.push(msg);
        }

    };


    $rootScope.$on('http.error', function (event, data) {
        if (!$scope.errMsg) {
            $scope.errMsg = []
        }
        addMsg($scope.errMsg, data);
    });


    $rootScope.$on('http.warning', function (event, data) {
        if (!$scope.warningMsg) {
            $scope.warningMsg = []
        }
        addMsg($scope.warningMsg, data);
    });

    $rootScope.$on('http.notif', function (event, data) {
        if (!$scope.notifMsg) {
            $scope.notifMsg = []
        }
        addMsg($scope.notifMsg, data);
    });


    $scope.logout = function () {
        userService.logout();
        $state.go('home.login');
    };

    $document.on('click', '.ps-modal', function (event) {
        if ($(event.target).hasClass('ps-modal'))
            $state.go('^');
    });

});
