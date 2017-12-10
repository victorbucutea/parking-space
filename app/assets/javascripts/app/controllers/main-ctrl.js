'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl', function ($rootScope, $scope, $document, parameterService, $state, userService) {


    $document.mousedown(function () {
        $scope.errMsg = null;
        $scope.notifMsg = null;
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

    $scope.selectPlace = function(evt){
        $scope.selectedAddr = evt.address_components;
    };

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

    $rootScope.$on('http.notif', function (event, data) {
        if (!$scope.notifMsg) {
            $scope.notifMsg = []
        }
        addMsg($scope.notifMsg, data);

    });

    if (localStorage.helpShown !== "1") {
        let currentState = $state.current.name;
        if (!currentState) {
            return;
        }

        if (currentState.indexOf('help') > -1) {
            return;//already in help
        }

        $state.go(currentState + '.help');
        localStorage.setItem("helpShown", 1);
    }


    $scope.logout = function () {
        userService.logout();
        $state.go('home.login');
    };


    $document.on('click', '.ps-modal', function (event) {
        if ($(event.target).hasClass('ps-modal'))
            $state.go('^');
    });

    // hide geographical location search menu when clicking outside its container
    $('ui-view.map-container').on('click', function (event) {
        var pacInput = $('#pac-input');

        if (event.target !== pacInput.get()[0]) {
            pacInput.blur();
        }
    })

});
