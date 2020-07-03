'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PaymentsReceivedCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('#loadingSpinner').show();
            $('#loadingFinished').hide();

            parkingSpaceService.getMySpaces((spaces) => {
                $('#loadingSpinner').hide();
                $('#loadingFinished').show();

                spaces.forEach((s) => {
                    s.offers = s.offers.filter(o => o.paid);
                })
                $scope.spaces = spaces;
            });


        }]);

