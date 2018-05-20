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
                $scope.selPayment = paym;
            };

            $scope.navigateTo = function () {
                offerService.getOffer($scope.selPayment.order_id, function (data) {
                    parkingSpaceService.getSpace(data.parking_space_id, function (data) {
                        $state.go('home.search', {lat: data.location_lat, lng: data.location_long, zoom: 18});
                    })
                });
            };

            $scope.getDetails = function (payment) {

                paymentService.getPaymentDetails(payment.id, function (data) {
                    $scope.paymentDetails = data;
                    $('#showDetails').show();
                })
            };


            $scope.showReservationDetails = function () {
                if (!$scope.selPayment) {
                    alert("Vă rugăm selectați o plată");
                    return;
                }

                offerService.getOffer($scope.selPayment.order_id, function (data) {
                    $scope.selOffer = data;
                    parkingSpaceService.getSpace(data.parking_space_id, function (data) {
                        $('#showReservation').show();
                        $scope.selectedSpace = data;
                    })
                });
            };

        }]);

