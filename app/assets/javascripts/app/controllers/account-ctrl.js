'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('AccountCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            paymentService.getAccountStatus((acc) => {
                if (!acc) {
                    acc = {amount: 0};
                }
                $scope.sum = acc.amount - acc.amount_pending;
                $scope.account = acc
                $scope.iban = acc.iban;
            });


            $scope.withdraw = function (sum, iban) {

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


                paymentService.withdraw(sum, iban, function (resp) {
                    $scope.account = resp;
                    $scope.sum = resp.amount;
                    $rootScope.$emit('http.notif', 'Suma ' + sum + ' ' + resp.currency + ' a fost programată pentru retragere');
                })

            }

            new Tooltip($('#waitingBalance'), {placement: 'bottom', title: 'Sume p' +
                    'latite pentru rezervarile in curs sau rezervari ' +
                    'viitoare. Acesti bani nu pot fi retrasi'});

        }]);

