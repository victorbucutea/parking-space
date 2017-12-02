/**
 * Created by 286868 on 04.04.2015.
 */

angular.module('ParkingSpaceMobile.controllers').controller('MessagesCtrl', function ($scope, $timeout, messageService, $stateParams) {



    $scope.scrollDown = function () {
        var d = $('.scroll');
        d.scrollTop(d.prop("scrollHeight"));
    };

    $scope.sendMessage = function (content) {
        if (!content) {
            return;
        }
        var newMessage = {
            content: content
        };
        var offer = $scope.selOffer;
        messageService.sendMessage(offer.parking_space_id, offer.id, newMessage, function (savedMsg) {
            $scope.selOffer.messages.push(savedMsg);
        });

        $scope.newMessage = '';
    };

});