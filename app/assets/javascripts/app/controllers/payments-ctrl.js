'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PaymentsCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('.loading-finished').hide();
            paymentService.getPayments((payments) => {
                $('.loading-finished').show();
                $scope.payments = payments
            });


            $scope.selectPayment = function (paym) {
                paymentService.getPaymentDetails(paym.id, function (data) {
                    data.payment = paym;
                    $scope.paymentDetails = data;
                    $('#showDetails').show();
                })
            };

        }]);

