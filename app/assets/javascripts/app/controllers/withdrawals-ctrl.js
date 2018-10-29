'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('WithdrawalsCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            $('.loading-finished-withd').hide();
            $('.loading-withd').show();
            paymentService.getWithdrawals((withd) => {
                $('.loading-withd').hide();
                if (withd.length <= 0)
                    $('.loading-finished-withd').show();
                $scope.withdrawals = withd;
            }, (resp) => {
                $('.loading-withd').hide();
            });


            $scope.selectWithd = function (withd) {
                $scope.withd = withd;
            };

            $scope.cancelWithdrawal = function (withd) {
                paymentService.cancelWithdrawal((withd) => {
                    if (withd.length <= 0)
                        $('.loading-finished-withd').show();
                    $scope.withdrawals = withd;
                });
            }


        }]);

