/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyMenuCtrl',
    ['$scope', 'notificationService',
        function ($scope, notificationService) {

            notificationService.hideOfferNotifications();

            $scope.unreadNotificationsForSpaces = function () {
                return notificationService.parkingSpaceNotifications.length ? true : false;
            };


            $scope.unreadNotificationsForOffers = function () {
                return notificationService.offerNotifications.length ? true : false;
            };

        }]);