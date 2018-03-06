'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('AccountCtrl', 
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

    $('.loading-finished').hide();
    paymentService.getAccountStatus((acc) => {
        $('.loading-finished').show();
        $scope.sum = acc.amount;
        $scope.account = acc
    });


    $scope.withdraw = function(sum,iban){

        /*if (sum > $scope.account.amount ) {
            $('#sum').addClass('is-invalid');
            $scope.isSumInvalid = true;
        } else {
            $('#sum').removeClass('is-invalid');
            $scope.isSumInvalid = false;
        }*/

        if (!IBAN.isValid(iban)) {
            $('#iban').addClass('is-invalid');
            $scope.isIbanInvalid = true;
        } else {
            $('#iban').removeClass('is-invalid');
            $scope.isIbanInvalid = false;
        }

        if ($scope.isIbanInvalid || $scope.isSumInvalid) {
            return;
        }


        paymentService.withdraw(sum, iban, function(resp){
            $scope.account = resp;
            $scope.sum = resp.amount;
        })

    }

}]);

