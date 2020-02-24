/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyOffersCtrl',
    ['$scope', '$state', 'parkingSpaceService', 'replaceById', 'offerService',
        function ($scope, $state, parkingSpaceService, replaceById, offerService) {

            $('.loading-finished').hide();
            parkingSpaceService.getMyOffers(function (spaces) {
                if (!spaces) {
                    return;
                }
                $('.loading-finished').show();

                $scope.spaces = spaces;
            });


            $scope.cancelOffer = function (offer) {
                if (confirm('Ești sigur ca vrei să anulezi această ofertă?')) {
                    offerService.cancelOffer($scope.selectedSpace.id, offer, function (bid) {
                        replaceById(bid, $scope.selectedSpace.offers);
                        $('#showPhoneNumber').hide();
                    });
                }
            };

            $scope.offerIsForSpace = function (space, selOffer) {
                if (!selOffer) return false;

                return space.offers.find((off) => {
                    return off.id === selOffer.id;
                })
            };

            $scope.payButtonAvailable = function (space, selOffer) {
                if (!selOffer || selOffer.paid || !selOffer.approved) return false;

                return space.offers.find((of) => {
                    return of.id === selOffer.id
                });
            }

        }]);