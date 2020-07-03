'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PaymentsCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('#loadingSpinner').show();
            $('#loadingFinished').hide();

            paymentService.getPayments((payments) => {
                $('#loadingSpinner').hide();
                $('#loadingFinished').show();

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

