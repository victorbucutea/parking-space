angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserAccountCtrl',
        ['$scope', '$state', '$rootScope', 'paymentService', 'replaceById',
            function ($scope, $state, $rootScope, paymentService, replaceById) {

                $scope.cloudName = window.cloudinaryName;

                paymentService.listAccount($scope.user, (acc) => {
                    $scope.account = acc;
                });


                $scope.changeWithdrawalStatus = function (withd) {
                    $scope.selectedWithd = withd;
                    $('#commentDialog').show();
                }

                function checkValid() {
                    if (!$scope.commentForm.$valid) {
                        $('#commentForm').addClass('was-validated');
                        return false;
                    }
                    return true;
                }

                $scope.rejectWithdrawal = function (withd) {
                    if (!checkValid()) return;
                    paymentService.rejectWithdrawal(withd, $scope.comment, (wi) => {
                        replaceById(wi, $scope.account.withdrawals)
                    });
                    $("#commentDialog").hide();
                }
                $scope.executeWithdrawal = function (withd) {
                    if (!checkValid()) return;
                    paymentService.executeWithdrawal(withd, $scope.comment, (wi) => {
                        replaceById(wi, $scope.account.withdrawals)
                    });
                    $("#commentDialog").hide();
                }

                $scope.status = function (space) {
                    $scope.spaceEdit = space;
                    $state.go('.status')

                }

                $scope.delete = function (space) {

                }

            }]);