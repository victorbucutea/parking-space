/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MapCtrl',
    ['$state', '$stateParams', 'notificationService', '$scope', '$rootScope', 'geolocationService',
        function ($state, $stateParams, notificationService, $scope, $rootScope, geolocationService) {


            $scope.mapCreated = function (map, overlay, geocoder) {

                $rootScope.map = map;
                $rootScope.overlay = overlay;
                $rootScope.geocoder = geocoder;

                // center on request params if need be
                if ($stateParams.lat && $stateParams.lng) {
                    let pos = new google.maps.LatLng($stateParams.lat, $stateParams.lng);
                    map.setZoom(17);
                    map.setCenter(pos);
                    return;
                }

                geolocationService.getCurrentLocation(function (position) {
                    let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(pos);
                });
            };


            $scope.showNotif = function () {
                let offerNotifs = notificationService.offerNotifications;
                let parkingSpaceNotifs = notificationService.parkingSpaceNotifications;

                if (!offerNotifs && !parkingSpaceNotifs) {
                    return false;
                }

                let activeOfferNotif = offerNotifs.find(function (offer) {
                    return offer.active;
                });

                let activeParkingSpaceNotif = parkingSpaceNotifs.find(function (pspaceMsg) {
                    return pspaceMsg.active;
                });


                if (activeOfferNotif || activeParkingSpaceNotif) {
                    return true;
                }
            };

            $scope.gotoOffersOrSpaces = function () {
                let offerNotifs = notificationService.offerNotifications;
                let parkingSpaceNotifs = notificationService.parkingSpaceNotifications;

                if (!offerNotifs && !parkingSpaceNotifs) {
                    $state.go("home.myposts");
                    return;
                }


                let activeOfferNotif = offerNotifs.find(function (offer) {
                    return offer.active;
                });

                let activeParkingSpaceNotif = parkingSpaceNotifs.find(function (pspaceMsg) {
                    return pspaceMsg.active;
                });

                let bothActive = activeOfferNotif && activeParkingSpaceNotif;
                let bothNotActive = !activeOfferNotif && !activeParkingSpaceNotif;


                if (bothActive || bothNotActive) {
                    $state.go("home.myposts");
                    return;
                }

                if (activeOfferNotif) {
                    $state.go("home.myoffers");
                    return;
                }


                if (activeParkingSpaceNotif) {
                    $state.go("home.myposts");
                }

            }

        }]);
