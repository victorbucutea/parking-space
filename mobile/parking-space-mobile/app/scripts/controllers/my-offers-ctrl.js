/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyOffersCtrl', function ($scope, $state, parkingSpaceService, notificationService) {

    notificationService.hideOfferNotifications();

    parkingSpaceService.getMyOffers(function (spaces) {
        if (!spaces) {
            return;
        }
        $scope.spaces = spaces;
    });

    $scope.messagesForOffer = function (offer) {
        var count = 0;
        if (!offer.messages) {
            return count;
        }
        var messages = offer.messages;

        if (messages) {
            messages.forEach(function (d) {
                count++
            });
        }
        return count;
    };


    $scope.selectOffer = function (offer) {
        $scope.selOffer = offer;
    };


    $scope.showMessages = function (offer) {
        $state.go('home.myoffers.talk', {offer: JSON.stringify(offer)});
    };

});