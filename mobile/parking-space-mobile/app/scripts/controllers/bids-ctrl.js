/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl', function ($scope, $state, offerService, replaceById, parkingSpaceService, parameterService) {

    $scope.bid = {};
    if ($scope.selectedSpace) {
        $scope.bid.bidAmount = $scope.selectedSpace.price;
        $scope.bid.bidCurrency = $scope.selectedSpace.currency;
    }

    $scope.expireDuration = function () {
        if (!$scope.selectedSpace) {
            return;
        }
        return moment($scope.selectedSpace.space_availability_stop).fromNow();
    };

    $scope.placeOffer = function () {
        if (!$scope.selectedSpace.owner_is_current_user) {
            offerService.placeOffer($scope.bid, $scope.selectedSpace.id, function (bid) {
                $scope.selectedSpace.offers.push(bid);
            });

            $state.go('^');
        }
    };


    $scope.confirmApproval = function (offer) {
        var acceptedOffers = $scope.selectedSpace.offers.filter(function (d) {
            if (d.approved == true && offer !== d) {
                return true;
            }
        });
        if (acceptedOffers.length) {
            alert("Can only accept one offer!");
            return;
        }


        var message = "Accept the offer of " + offer.price + " " + offer.currency + " for this parking space?";
        if (offer.approved) {
            message = "Refuse to accept the offer of " + offer.price + " " + offer.currency + " for this parking space?";
        }
        if (confirm(message)) {
            $scope.accept($scope.selectedSpace, offer);
        }
    };

    $scope.accept = function (space, offer) {
        if (!offer.approved) {
            offerService.acceptOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
                $scope.selOffer = result;
            });
        } else {
            offerService.rejectOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
                $scope.selOffer = result;
            });
        }

    };

    $scope.reject = function (space, offer) {
        offerService.rejectOffer(space.id, offer, function (result) {
            replaceById(result, space.offers);
            $scope.selOffer = result;
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

    $scope.showEdit = function (selectedSpace) {
        $state.go('home.myposts.edit', {parking_space_id: selectedSpace.id});
    };

    $scope.showDelete = function (selectedSpace) {
        $state.go('home.myposts.delete', {parking_space_id: selectedSpace.id});

    };

});

