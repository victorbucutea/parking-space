/**
 *  Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl',
    ['$scope', '$filter', 'offerService', 'parkingSpaceService', '$state', '$stateParams', 'notificationService', 'replaceById',
    function ($scope, $filter, offerService, parkingSpaceService, $state, $stateParams, notificationService, replaceById) {

    parkingSpaceService.getMySpaces(function (spaces) {
        $scope.spaces = spaces;
        let selectedSpace = spaces.find(function (item) {
            return (item.id === $stateParams.parking_space_id);
        });

        if (selectedSpace && selectedSpace[0]) {
            $scope.spaceEdit = selectedSpace[0];
        }
    });

    $scope.acceptOffer = function (space, offer) {
        if (confirm("Accepti oferta lui " + offer.owner_name + " de " + offer.bid_price + " " + offer.bid_currency + " ?")) {
            offerService.acceptOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
            });
        }
    };


    $scope.unreadNotifications = function (space) {
        let spaceNotifications = notificationService.parkingSpaceNotifications;

        if (!spaceNotifications) {
            return false;
        }

        if (!space)
            return false;

        return spaceNotifications.find(function (notif) {
            return notif.parking_space === space.id
        });
    };


    $scope.show = function (space, item) {
        $scope.selectedSpace = space;
        notificationService.hideParkingSpaceNotifications();
        $('#' + item).slideToggle(200);

    };


    $scope.showMessages = function (space) {
        $scope.selectedSpace = space;
        $state.go('home.myposts.bids.talk');
    };

}]);