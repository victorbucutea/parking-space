'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl',
    ['$rootScope', '$scope', '$document', '$stateParams', 'parameterService', '$state', 'userService',
        function ($rootScope, $scope, $document, $stateParams, parameterService, $state, userService) {

            $rootScope.desktopScreen = $(document).width() > 991;

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
                $('#drawer').css('left', '-105%');
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

            let doc = $(document);

            $rootScope.$on('spaces', function (event, val) {
                if (!val) return;
                if (doc.width() < 760) return;
                $scope.mapSpaces = val;
            });


            $scope.nextOffer = function (space) {
                let free = 'Se eliberează ';
                let freeUntil = 'Liber pentru următoarele ';

                if (!space.offers) space.offers = [];
                // search for first offer for current user
                // ( they should be sorted by creation date in parking_space_controller
                let nearestOffer = space.offers.find((of) => {
                    return moment(of.end_date).isAfter(moment());
                });
                if (!nearestOffer) {
                    let end = moment(space.space_availability_stop);
                    let diff = end.diff(moment());
                    let text = (moment.duration(diff).format('d[d] h[h] m[m]'));
                    return freeUntil + text;
                }

                let st = moment(nearestOffer.start_date);
                let end = moment(nearestOffer.end_date);
                let now = moment();


                if (end.isAfter(now) && st.isBefore(now)) {
                    return free + end.fromNow();
                } else if (st.isAfter(now)) {
                    let diff = st.diff(now);
                    let text = (moment.duration(diff).format('d[d] h[h] m[m]'));
                    return freeUntil + text;
                }
                return text;
            };


            $scope.selectSpace = function (space) {
                $state.go('home.search').then(() => {
                    $rootScope.$broadcast('selectSpace', space);
                });
            };



            $scope.requestFullScreen = function() {
                let doc = window.document;
                let docEl = doc.documentElement;

                let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
                let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

                if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                    requestFullScreen.call(docEl);
                } else {
                    cancelFullScreen.call(doc);
                }
            }

            $scope.logout = function () {
                userService.logout();
            }
        }]);
