/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl', function ($scope, parkingSpaceService, $state, $stateParams, notificationService) {

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
                var show = false;
                if (space.offers) {
                        space.offers.forEach(function (d) {

                                if (!d.read) show = true;

                                if (d.messages) {
                                        d.messages.forEach(function (d) {
                                                if (!d.read) show = true
                                        });
                                }
                        })
                }
                return show;
        };

        $scope.unreadMessagesForSpace = function (space) {
                var count = 0;
                if (!space.offers) {
                        return count;
                }
                space.offers.forEach(function (d) {
                        if (d.messages) {
                                d.messages.forEach(function (d) {
                                        if (!d.read)  count++
                                });
                        }
                });
                return count;
        };


        $scope.show = function (space) {
                $scope.spaceEdit = space;
                $state.go('home.myposts.bids');
        };

        $scope.showMessages = function (space) {
                $scope.spaceEdit = space;
                $state.go('home.myposts.bids.talk');
        };

});

