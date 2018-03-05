'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('WithdrawalsCtrl', function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

    $('.loading-finished-withd').hide();
    paymentService.getWithdrawals((withd) => {
        if( withd.length <= 0)
            $('.loading-finished-withd').show();
        $scope.withdrawals = withd;
    });


    $scope.selectWithd = function(withd){
        $scope.withd = withd;
    };

    $scope.cancelWithdrawal = function(withd){
        paymentService.cancelWithdrawal((withd) => {
            if( withd.length <= 0)
                $('.loading-finished-withd').show();
            $scope.withdrawals = withd;
        });
    }


});

