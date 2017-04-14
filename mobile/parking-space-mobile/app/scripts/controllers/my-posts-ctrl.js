/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl', function ($scope, parkingSpaceService, $state, $stateParams, notificationService, replaceById) {

    $('.open-spaces-list').height($(window).height() - 105);


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
        var spaceNotifications = notificationService.parkingSpaceNotifications;

        if (!spaceNotifications) {
            return false;
        }

        if (!space)
            return false;

        return spaceNotifications.find(function(notif) {
            return notif.parking_space == space.id
        });
    };


    $scope.show = function (space) {
        $scope.selectedSpace = space;
        $state.go('home.myposts.bids', {parking_space_id: space.id});
        notificationService.hideParkingSpaceNotifications();
    };


    $scope.showMessages = function (space) {
        $scope.selectedSpace = space;
        $state.go('home.myposts.bids.talk');
    };

});

