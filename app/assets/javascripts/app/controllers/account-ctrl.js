'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('AccountCtrl',
    ['$rootScope', '$state', '$scope', 'offerService', 'parkingSpaceService', 'paymentService',
        function ($rootScope, $state, $scope, offerService, parkingSpaceService, paymentService) {

            function loadAccount() {
                paymentService.getAccountStatus((acc) => {
                    if (!acc) {
                        acc = {amount: 0};
                    }
                    $scope.sum = acc.amount - acc.amount_pending;
                    $scope.account = acc
                    $scope.iban = acc.iban;
                });
            }

            loadAccount();

            $scope.$on('refreshAccount', (evt)=> {
                loadAccount();
            })

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

                paymentService.withdraw(sum, iban, function (acc) {
                    $scope.sum = acc.amount - acc.amount_pending;
                    $scope.account = acc
                    $scope.iban = acc.iban;
                    $rootScope.$emit('http.notif', 'Suma ' + sum + ' ' + acc.currency + ' a fost programată pentru retragere');
                })

            }

            $('#waitingBalance').tooltip();

        }]);

