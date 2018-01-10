/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl', function ($rootScope, notificationService, $scope, $state, offerService, parkingSpaceService, replaceById) {

        $scope.bid = {};

        if ($scope.selectedSpace) {
            $scope.bid.bid_price = $scope.selectedSpace.price;
            $scope.bid.bid_currency = $scope.selectedSpace.currency;
            let offerPresent = false;
            let offerAccepted = false;
            $scope.selectedSpace.offers.forEach((offer) => {
                if (offer.owner_is_current_user) {
                    offerPresent = true;
                    $scope.bid = offer;
                    if (offer.approved) {
                        offerAccepted = true;
                    }
                }
            });

            if (offerPresent && offerAccepted) {
                $rootScope.$emit('http.notif', 'Aveți deja o ofertă acceptată pentru acest loc');
            }

            if (offerPresent && !offerAccepted) {
                $rootScope.$emit('http.notif', 'Aveți deja o ofertă propusă pentru acest loc');
            }

            if (offerPresent) {
                $scope.offerPresent = true;
            }

        }

        $scope.offerDuration = function (offer) {
            if (!offer && !offer.start_date && !offer.end_date) return;
            return moment(offer.start_date).to(offer.end_date, true);
        };


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

        $scope.showPhoneNo = function (item) {
            parkingSpaceService.getPhoneNumber($scope.selectedSpace.id, (data) => {
               $scope.phoneNumber = data.number;
            })
        };


        $scope.placeOffer = function () {
            if (!$scope.selectedSpace.owner_is_current_user) {
                let bid = $scope.bid;
                bid.bid_amount = bid.bid_price;
                bid.start_date = bid.s_start_date;
                bid.end_date = bid.s_end_date;
                let start = new Date(bid.start_date).getTime();
                let stop = new Date(bid.end_date).getTime();
                let interval = stop - start;

                if (moment.duration(interval).asMinutes() < 15 ){
                    $('#dateStop').addClass('is-invalid');
                    return;
                }


                if (!bid.id) {
                    offerService.placeOffer(bid, $scope.selectedSpace.id, function (bid) {
                        $scope.selectedSpace.offers.push(bid);
                    });
                }
                else {
                    offerService.updateOffer(bid, $scope.selectedSpace.id, function (bid) {
                        $scope.selectedSpace.offers.push(bid);
                    });
                }


                $state.go('^');
            }
        };

        notificationService.hideParkingSpaceNotifications();

        $scope.confirmApproval = function (offer) {
            let acceptedOffers = $scope.selectedSpace.offers.filter(function (d) {
                if (d.approved === true && offer !== d) {
                    return true;
                }
            });
            if (acceptedOffers.length) {
                alert("Poți accepta o singura ofertă");
                return;
            }


            let message = "Accepți oferta de " + offer.bid_price + " " + offer.bid_currency + " pentru acest loc?";
            if (offer.approved) {
                message = "Refuzi oferta de " + offer.bid_price + " " + offer.bid_currency + " pentru acest loc?";
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

        $scope.selectOffer = function (offer) {
            $scope.selOffer = offer;
        };


        $scope.showEdit = function (selectedSpace) {
            $state.go('.edit', {parking_space_id: selectedSpace.id});
        };

        $scope.showDelete = function (selectedSpace) {
            $state.go('.delete', {parking_space_id: selectedSpace.id});

        };

    }
)
;

