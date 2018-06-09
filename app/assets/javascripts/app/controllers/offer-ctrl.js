/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl',
    ['$rootScope', 'paymentService','$state', '$scope', 'offerService', 'parkingSpaceService', 'replaceById' ,
        function ($rootScope, paymentService, $state, $scope, offerService, parkingSpaceService, replaceById) {

    $scope.bid = {};

    if ($scope.selectedSpace) {
        $scope.bid.bid_price = $scope.selectedSpace.price;
        $scope.bid.bid_currency = $scope.selectedSpace.currency;
        $scope.bid.start_date = new Date();
        $scope.bid.end_date = moment().add(1, 'd').toDate();
        let offerAccepted = false;
        $scope.selectedSpace.userOffers = $scope.selectedSpace.offers.filter(offer => {
            return offer.owner_is_current_user;
        });

        $scope.selectedSpace.userOffers.forEach((offer) => {
            $scope.hideRentForm = true;
        });

        if (offerAccepted) {
            $rootScope.$emit('http.notif', 'Aveți deja o rezervare acceptată pentru acest loc');
        }

    }


    $scope.timeFromCreation = function (offer) {
        if (!offer && !offer.created_at) return;
        return moment(offer.created_at).fromNow();
    };


    $scope.expireDuration = function () {
        if (!$scope.selectedSpace) {
            return;
        }

        if (moment($scope.selectedSpace.space_availability_stop).isBefore(moment())) {
            return " a expirat";
        }

        return moment($scope.selectedSpace.space_availability_stop).fromNow();
    };



    $scope.show = function (item) {
        $('#' + item).slideToggle(200);
    };

    $scope.$watch('selectedSpace', function (newVal) {
        if (!newVal) return;
        parkingSpaceService.getPhoneNumber($scope.selectedSpace.id, (data) => {
            $scope.phoneNumber = data.number;
            $('#callOwner').attr('href', 'tel:' + data.number);
        });
    });


    $scope.placeOffer = function () {
        if (!$scope.selectedSpace.owner_is_current_user) {
            let bid = $scope.bid;
            bid.bid_amount = bid.bid_price;
            let start = bid.start_date.getTime();
            let stop = bid.end_date.getTime();
            let interval = stop - start;

            if (moment.duration(interval).asMinutes() < 15) {
                $('#dateStop').addClass('is-invalid');
                return;
            }

            offerService.placeOffer(bid, $scope.selectedSpace.id, function (bid) {
                $scope.selectedSpace.offers.push(bid);
                $rootScope.$emit('spaceSave',$scope.selectedSpace);
            });


            $state.go('^');
        }
    };

    $scope.cancelOffer = function (offer) {
        offerService.cancelOffer($scope.selectedSpace.id, offer, function (bid) {
            replaceById(bid, $scope.selectedSpace.offers);
            $rootScope.$emit('spaceSave',$scope.selectedSpace);
            $state.go("^");
        });
    };

    $scope.confirmApproval = function (offer) {

        let message = "Accepți oferta de " + offer.bid_price + " " + offer.bid_currency + "/h pentru acest loc?";
        if (offer.approved) {
            message = "Refuzi oferta de " + offer.bid_price + " " + offer.bid_currency + "/h pentru acest loc?";
        }


        if (confirm(message)) {
            $scope.accept($scope.selectedSpace, offer);
            $('#approveDialog').hide();
        }
    };

    $scope.accept = function (space, offer) {
        if (!offer.approved) {
            offerService.acceptOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
                $rootScope.$emit('spaceSave',$scope.selectedSpace);
                $scope.selOffer = result;
            });
        } else {
            offerService.rejectOffer(space.id, offer, function (result) {
                replaceById(result, space.offers);
                $rootScope.$emit('spaceSave',$scope.selectedSpace);
                $scope.selOffer = result;
            });
        }

    };

    $scope.selectOffer = function (offer) {
        $scope.selOffer = offer;
    };

    $scope.showEdit = function (selectedSpace) {
        $state.go('.edit', {parking_space_id: selectedSpace.id});
    };

    $scope.showDelete = function (selectedSpace) {
        $state.go('.delete', {parking_space_id: selectedSpace.id});

    };

}]);

