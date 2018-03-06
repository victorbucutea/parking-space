'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl',
    ['$rootScope', '$scope', '$document', '$stateParams', 'parameterService', '$state', 'userService',
    function ($rootScope, $scope, $document, $stateParams, parameterService, $state, userService) {

    $scope.errMsg = [];
    $scope.notifMsg = [];
    $scope.warningMsg = [];
    $scope.warningMsgHtml = [];
    let notifArea = $('.notification-area');
    let drawer = $('.drawer');

    notifArea.on('mousedown', function (evt) {
        $scope.errMsg = [];
        $scope.notifMsg = [];
        $scope.warningMsg = [];
        $scope.warningMsgHtml = [];
        notifArea.removeClass('zoomIn').addClass('zoomOut');
        setTimeout(function () {
            notifArea.removeClass('zoomOut').addClass('zoomIn');
            $scope.$evalAsync()
        }, 300);
        evt.preventDefault();
    });


    $scope.openMenu = function () {
        $('#drawer').css('left', '0');
        drawer.css('display', 'block');
        drawer.css('opacity', '.4');
    };

    $scope.closeMenu = function () {
        $('#drawer').css('left', '-100%');
        drawer.css('opacity', '0');
        setTimeout(function () {
            drawer.hide()
        }, 300);
    };

    $scope.selectPlace = function (newAddr, newLocation) {
        $scope.selectedAddress = newAddr;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        $scope.selectedLocation = newLocation;
    };

    $scope.dateFilter = {start: new Date(), stop: moment().add(1, 'M').toDate()};


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
        addMsg($scope.errMsg, data);
    });

    $rootScope.$on('http.warning', function (event, data) {
        addMsg($scope.warningMsg, data);
    });
    $rootScope.$on('http.warning.html', function (event, data) {
        addMsg($scope.warningMsgHtml, data);
    });

    $rootScope.$on('http.notif', function (event, data) {
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



}]);
