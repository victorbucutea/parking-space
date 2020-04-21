'use strict';

angular.module('ParkingSpaceMobile.controllers').controller('MainCtrl',
    ['$rootScope', '$scope', '$document', '$stateParams', 'parameterService', '$state', 'userService',
        function ($rootScope, $scope, $document, $stateParams, parameterService, $state, userService) {

            $rootScope.desktopScreen = $(document).width() > 991;


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

            let doc = $(document);


            $rootScope.$on('spaces', function (event, val) {
                if (!val) return;
                if (doc.width() < 760) return;
                $scope.mapSpaces = val;
            });

            $scope.zoomTo = function (space) {
                let lat = space.location_lat;
                let lng = space.location_long;
                if (!lat) {
                    console.log(space);
                }
                $rootScope.map.panTo(new google.maps.LatLng(lat, lng));
            };


            $scope.nextOffer = function (space) {
                if (space.from_sensor) {
                    return 'Parcare publică liberă';
                }
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
                $state.go('search').then(() => {
                    $rootScope.$broadcast('selectSpace', space);
                });
            };

            $('#navMenu').hide();

        }]);
