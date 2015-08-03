/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl', function ($scope, $state, offerService, replaceById) {

    $scope.confirmApproval = function (offer) {
        $scope.warn = false;
        var acceptedOffers = $scope.spaceEdit.offers.filter(function (d) {
            if (d.approved == true && offer !== d) {
                return true;
            }
        });
        if (acceptedOffers.length) {
            $scope.warn = true;
            return;
        }

        $('#confirmOffer').show();
    };

    $scope.accept = function (space, offer) {

        if (!offer.approved) {
            offerService.acceptOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
            });
        } else {
            offerService.rejectOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
            });
        }

        $('#confirmOffer').hide()
    };

    $scope.reject = function (space, offer) {
        offerService.rejectOffer(space.id, offer, function () {
            offer.approved = false;
        })
    };

    $scope.messagesForSpace = function (space) {
        var count = 0;
        if (!space.offers) {
            return count;
        }
        space.offers.forEach(function (d) {
            if (d.messages) {
                d.messages.forEach(function (d) {
                    count++
                });
            }
        });
        return count;
    };

    $scope.selectOffer = function (offer) {
        $scope.selOffer = offer;
    };


    $scope.showMessages = function (offer) {
        $state.go('home.myposts.bids.talk', {offer: JSON.stringify(offer)});
    };

});

