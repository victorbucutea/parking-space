'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PaymentsReceivedCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('.loading-finished').show();
            parkingSpaceService.getMySpaces((spaces) => {
                $('.loading-finished').hide();

                $scope.spaces = spaces;
            });




        }]);

