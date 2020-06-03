/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchCtrl',
    ['$rootScope', '$scope', '$state', 'parkingSpaceService', 'userService', 'geoService', 'offerService',
        function ($rootScope, $scope, $state, parkingSpaceService, userService, geoService, offerService) {
            $scope.cloudName = window.cloudinaryName;

            let dragHandle = null;
            let zoomHandle = null;


            let ongoingDrawSpacesReq;

            if (!$rootScope.desktopScreen) {
                $rootScope.$emit('mapAndContent', {colMap: 'col-12'});
                $scope.showList = false;
            } else {
                $rootScope.$emit('mapAndContent', {colMap: 'col-6 col-lg-8', colContent: 'col-6 col-lg-4'});
                $scope.showList = true;
            }

            if (offerService.showNextOffer())
                offerService.getNextOffer().then((d) => {
                    let st = moment(d.start_date);
                    let now = moment();
                    let msg = "Aveți o rezervare activa care "
                    let timeUntil = now.to(st);
                    if (now.isBefore(st)) {
                        msg += 'va începe '
                    } else {
                        msg += 'a început cu '
                    }
                    $rootScope.$emit('http.info.html', {
                        text: msg + timeUntil + '. ',
                        btn1: 'Vezi detalii',
                        icon1: 'fa-map',
                        href1: '#!/map/search/post-offer?spaceId=' + d.parking_space_id,
                        btn2: 'Navighează la locul resp.',
                        icon2: 'fa-location-arrow',
                        href2: `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`
                    });
                })


            window.showMsg = function(){
                /**
                 * 12
                 16
                 17
                 18
                 19
                 76
                 77
                 78
                 79
                 */
                offerService.rejectOffer(5, {id:79});
            }

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
                        observer.disconnect();
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


            $scope.centerMap = function () {
                geoService.getCurrentPosition((position) => {
                    let pos = new google.maps.LatLng(position.lat, position.lng);
                    $rootScope.map.setCenter(pos);
                });
            };

            $scope.showPostSpace = function () {
                if (!$scope.placingSpot) {
                    $scope.placingSpot = !$scope.placingSpot;
                    return;
                }
                $scope.spaceEdit = {};
                $state.go('.post');
                $scope.placingSpot = false;
            };

            $scope.showReviewDialog = function (space) {
                $rootScope.$emit('showReviewForm', space, $scope.reviews);
            };


            $scope.getReviews = function (space) {
                parkingSpaceService.getReviews(space).then((reviews) => {
                    $scope.reviews = reviews;
                });
            }


            if (!userService.instructionsShown()) {
                $state.go('.instructions');
            }



            let observer = new IntersectionObserver(function (entries) {
                let ctrls = $('.map-controls');
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ctrls.addClass('scrolled')
                    } else {
                        ctrls.removeClass('scrolled')
                    }
                });
            });
            observer.observe(document.getElementById('footer'));
        }]);

