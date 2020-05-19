'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl',
    ['$rootScope', '$scope', '$document', '$stateParams', 'parameterService', '$state', 'userService',
        function ($rootScope, $scope, $document, $stateParams, parameterService, $state, userService) {

            $rootScope.desktopScreen = $(document).width() > 767;


            $scope.openMenu = function () {
                $('#navMenu').show();
                let drawer = $('.drawer');
                $('#drawer').css('left', '0');
                drawer.css('display', 'block');
                drawer.css('opacity', '.4');
            };

            $scope.closeMenu = function () {
                let drawer = $('.drawer');
                $('#drawer').css('left', '-105%');
                drawer.css('opacity', '0');
                setTimeout(function () {
                    drawer.hide()
                }, 300);
            };

            $scope.logout = function () {
                userService.logout(() => {
                    $state.go('login');
                });
            };

            $scope.$on('$stateChangeStart', function (event, next, current) {
                if (['login', 'register', 'confirm-phone'].indexOf(next.name) >= 0)
                    return;
                userService.getUser().then((user) => {
                    $scope.currentUser = user;
                    if (!user.phone_no_confirm) {
                        $state.go('confirm-phone');
                        event.preventDefault();
                    }
                });
            });

            $rootScope.$on('logout', function (event, payload) {
                $scope.currentUser = null;
            });

            $document.on('click', '.ps-modal', function (event) {
                let isModal = $(event.target).hasClass('ps-modal');
                let isSkipNav = $(event.target).hasClass('ps-no-nav')
                if (isModal && !isSkipNav)
                    $state.go('^');
            });

            $scope.zoomTo = function (space) {
                if (!$rootScope.map) return;

                let lat = space.location_lat;
                let lng = space.location_long;
                $rootScope.map.panTo(new google.maps.LatLng(lat, lng));
                $('.html-marker').removeClass('selected');
                $('#htmlMarker-' + space.id).addClass('selected');
            };

            $scope.zoomToCluster = function (cl) {
                let lat = cl.centroid[0];
                let lng = cl.centroid[1];
                $rootScope.map.panTo(new google.maps.LatLng(lat, lng));
                $('.html-marker').removeClass('selected');
                $('#htmlMarker-' + cl.elements[0][2].id).addClass('selected');
            };

            $('#navMenu').hide();

        }]);
