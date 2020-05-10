/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchCtrl',
    ['$rootScope', '$scope', '$state', 'parkingSpaceService', 'userService', 'offerService',
        function ($rootScope, $scope, $state, parkingSpaceService, userService, offerService) {

            $('.map-controls').show();
            $scope.cloudName = window.cloudinaryName;

            let dragHandle = null;
            let zoomHandle = null;

            let ongoingDrawSpacesReq;

            $scope.scheduleDrawSpaces = () => {
                if (ongoingDrawSpacesReq) {
                    clearTimeout(ongoingDrawSpacesReq);
                }
                ongoingDrawSpacesReq = setTimeout(() => {
                    let args = $rootScope.map.getBounds().toJSON();
                    parkingSpaceService.getAvailableSpaces(args, (spaces) => {
                        $scope.drawSpaces(spaces);
                    })
                }, 1000);
            };

            $scope.createMap().then((map) => {
                let event = google.maps.event;

                dragHandle = event.addListener(map, 'dragend', $scope.scheduleDrawSpaces);
                zoomHandle = event.addListener(map, 'zoom_changed', $scope.scheduleDrawSpaces);
                $scope.scheduleDrawSpaces();
                $scope.$on('$stateChangeStart', function (stateEventm, next, current) {
                    if (!next.name.startsWith('map.search')) {
                        event.removeListener(dragHandle);
                        event.removeListener(zoomHandle);
                    }
                });
            })


            $rootScope.$on('markerClick', function (event, payload) {
                let isMultiple = payload[1];
                let data = payload[0];
                $('#showMultipleSpaces').hide();
                if (isMultiple) {
                    $('#showMultipleSpaces').show();
                    $scope.selectedSpaces = data;
                    $scope.$apply();
                    return;
                }

                $scope.selectedSpace = data;

                let owned = data.owner_is_current_user;

                if (owned) {
                    $state.go('.review-bids', {spaceId: data.id});
                } else {
                    $state.go('.post-bids', {spaceId: data.id});
                }
            });

            $rootScope.$on('postSpace', function (rvt) {
                $scope.spaceEdit = {};
                $state.go('.post');
            })


            $scope.showDesc = function (space) {
                let esc = $('#spaceDesc-' + space.id);
                let height = esc[0].scrollHeight;
                let open = esc.data('open')
                if (open) {
                    esc.css('max-height', '70px');
                    esc.data('open', '');
                } else {
                    esc.css('max-height', height + 'px');
                    esc.data('open', 'true');
                }
            };

            $scope.showFullImageThumb = function (evt, space) {
                $rootScope.$emit('showCarouselImages', space.images);
                evt.stopPropagation();
            };


            function navigateToCompanyLot() {
                userService.getRoles(function (roles) {
                    if (!roles) return;
                    if (roles.company && roles.company.locations && roles.company.locations[0]) {
                        let lat = roles.company.locations[0].location_lat;
                        let lng = roles.company.locations[0].location_long;
                        let pos = new google.maps.LatLng(lat, lng);
                        $rootScope.map.setCenter(pos);
                    }
                    $rootScope.company = roles.company;
                    $rootScope.roles = roles.roles;
                })
            }


            $scope.showFullImage = function (evt) {
                $rootScope.$emit('showCarouselImages', $scope.space.images);
            };

            if (!userService.instructionsShown()) {
                $state.go('.instructions').then(() => {
                        userService.instructionsShown(true)
                    }
                )
            }


        }]);

