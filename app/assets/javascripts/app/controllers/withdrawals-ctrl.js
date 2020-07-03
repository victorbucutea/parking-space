'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('WithdrawalsCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService', 'replaceById',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService, replaceById) {

            $('.loading-finished-withd').hide();
            $('.loading-withd').show();
            paymentService.getWithdrawals( (withd) => {
                $('.loading-withd').hide();
                if (withd.length <= 0)
                    $('.loading-finished-withd').show();
                $scope.withdrawals = withd;
            }, (resp) => {
                $('.loading-withd').hide();
            });


            $scope.selectWithd = function (withd) {
                $scope.selWithd = withd;
            };

            $scope.cancelWithdrawal = function (withd) {
                paymentService.cancelWithdrawal( withd, (withd) => {
                    replaceById(withd, $scope.withdrawals);
                    $scope.$emit('refreshAccount');
                });
            }

            $scope.getDetails = function (payment) {
                paymentService.getPaymentDetails(payment.id, function (data) {
                    $scope.paymentDetails = data;
                    $('#showDetails').show();
                })
            };


        }]);

