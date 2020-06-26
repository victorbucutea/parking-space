/**
 *  Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl',
    ['$scope', '$filter', 'offerService', 'parkingSpaceService', '$state', '$stateParams',
        'notificationService', 'replaceById', '$rootScope', 'paymentService', 'parameterService',
        function ($scope, $filter, offerService, parkingSpaceService, $state, $stateParams,
                  notificationService, replaceById, $rootScope, paymentService, parameterService) {

            if (!$rootScope.desktopScreen)
                $scope.$emit('mapAndContent', {showMap: false, colContent: 'col-12'});
            else {
                $scope.$emit('mapAndContent', {colContent: 'col-8', colMap: 'col-4'});
                paymentService.getAccountStatus((d) => {
                    $scope.account = d;
                })
            }


            parkingSpaceService.getMySpaces((spaces) => {
                $scope.drawSpaces(spaces, true);
            })


            $scope.$on('markerClick', function (event, space) {
                // show edit space
            });

            $scope.findActiveOffer = function (space) {
                return space.offers.find((of) => {
                    return of.active
                });
            };

            $scope.totalSum = function () {
                if (!$scope.spaces) return 0;
                let sum = 0;
                $scope.spaces.forEach((s) => {
                    if (s.offers)
                        s.offers.forEach((o) => {
                            if (o.paid) sum += o.amount;
                        })
                });
                return sum;
            }

            $scope.accountSum = function () {
                let sum = 0;
                if (!$scope.account) return sum;
                sum += $scope.account.amount;
                return sum;
            }

            if (!$scope.spaces || !$scope.spaces.length) {
                parameterService.getStartingAskingPrice().then((price) => {
                    $scope.startCurrency = price.currency;
                });
            } else {
                $scope.startCurrency = $scope.spaces[0].currency
            }


        }]);