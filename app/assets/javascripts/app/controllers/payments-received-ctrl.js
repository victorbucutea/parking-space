'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PaymentsReceivedCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('.loading-finished').show();
            parkingSpaceService.getMySpaces((spaces) => {
                $('.loading-finished').hide();

                $scope.spaces = spaces;
            });


            $scope.noOffers = function (spaces) {
                if (!spaces || !spaces.length) {
                    return true;
                }
                let spacesWithOffers = spaces.find(s => s.offers.length > 0);
                return spacesWithOffers.length > 0;
            }


        }]);

