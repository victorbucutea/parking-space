/**
 *  Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl',
    ['$scope', '$filter', 'offerService', 'parkingSpaceService', '$state', '$stateParams',
        'notificationService', 'replaceById', '$rootScope',
        function ($scope, $filter, offerService, parkingSpaceService, $state, $stateParams,
                  notificationService, replaceById, $rootScope) {

            $('.map-controls').hide();


            $scope.createMap().then((map) => {
                parkingSpaceService.getMySpaces((spaces)=>{
                    $scope.drawSpaces(spaces);
                })

            })

            $scope.$on('markerClick', function (event, space) {
                // show edit space
            });

            $scope.acceptOffer = function (space, offer) {
                if (confirm("Accepti oferta lui " + offer.owner_name + " de " + offer.bid_price + " " + offer.bid_currency + " ?")) {
                    offerService.acceptOffer(space.id, offer, function (result) {
                        replaceById(result, space.offers);
                    });
                }
            };

            $scope.findActiveOffer = function (space) {
                return space.offers.find((of) => {
                    return of.active
                });
            };

        }]);