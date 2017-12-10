/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyOffersCtrl', function ($scope, $state, parkingSpaceService, notificationService) {


    parkingSpaceService.getMyOffers(function (spaces) {
        if (!spaces) {
            return;
        }
        $scope.spaces = spaces;
    });


    $scope.selectOffer = function (offer,space) {
        $scope.selOffer = offer;
        $scope.selectedSpace = space;
        $('#showPhoneNumber').show();
    };

});