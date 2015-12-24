/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl', function ($scope, parkingSpaceService, $state, $stateParams, notificationService, replaceById) {

    $('.open-spaces-list').height($(window).height() - 105);

    notificationService.hideParkingSpaceNotifications();

    parkingSpaceService.getMySpaces(function (spaces) {
        $scope.spaces = spaces;
        var selectedSpace = spaces.filter(function (item) {
            if (item.id == $stateParams.parking_space_id) {
                return true;
            }
        });

        if (selectedSpace && selectedSpace[0]) {
            $scope.spaceEdit = selectedSpace[0];
        }
    });

    $scope.unreadNotifications = function (space) {
        var count = 0;
        if (!space.offers) {
            return count;
        }
        space.offers.forEach(function (d) {

            if (!d.read) count++;

            if (d.messages) {
                d.messages.forEach(function (d) {
                    if (!d.read) count++;
                });
            }
        });

        return count;
    };


    $scope.unreadMessagesForSpace = function (space) {
        var count = 0;

        if (!space.offers) {
            return count;
        }

        space.offers.forEach(function (d) {

            if (d.messages) {
                return;
            }

            d.messages.forEach(function (d) {
                if (!d.read)  count++;
            });
        });
        return count;
    };


    $scope.show = function (space) {
        $scope.selectedSpace = space;
        $state.go('home.myposts.bids', {parking_space_id: space.id});
    };


    $scope.showMessages = function (space) {
        $scope.selectedSpace = space;
        $state.go('home.myposts.bids.talk');
    };

});

