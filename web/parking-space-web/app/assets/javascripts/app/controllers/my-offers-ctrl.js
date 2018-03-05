/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyOffersCtrl', function ($scope, $state, parkingSpaceService, replaceById, offerService) {

    $('.loading-finished').hide();
    parkingSpaceService.getMyOffers(function (spaces) {
        if (!spaces) {
            return;
        }
        $('.loading-finished').show();

        $scope.spaces = spaces;
    });


    $scope.selectOffer = function (offer, space) {
        $scope.selOffer = offer;
        $scope.selectedSpace = space;
    };


    $scope.expiration = function (offer) {
        let st = moment(offer.start_date);
        let end =  moment(offer.end_date);
        let now = moment();

        let isNow = end.isAfter(now) && st.isBefore(now);
        let isInThePast = st.isBefore(now);
        let isInTheFuture = end.isAfter(now);

        if (isNow) {
            return "Acum (expira "+end.fromNow()+")"
        }

        if (isInThePast) {
            return "Cu "+end.fromNow()
        }

        if (isInTheFuture){
            return "Progr. "+st.fromNow();
        }


        return "";
    };

    $scope.cancelOffer = function (offer) {
        if (confirm('Ești sigur ca vrei să anulezi această ofertă?')) {
            offerService.cancelOffer($scope.selectedSpace.id, offer, function (bid) {
                replaceById(bid, $scope.selectedSpace.offers);
                $('#showPhoneNumber').hide();
            });
        }
    };

    $scope.offerIsForSpace = function (space, selOffer) {
        if (!selOffer) return false;

        return space.offers.find((off) => {
            return off.id === selOffer.id;
        })
    };

    $scope.payButtonAvailable = function (space, selOffer) {
        if (!selOffer || selOffer.paid || !selOffer.approved) return false;

        return space.offers.find((of) => {
            return of.id === selOffer.id
        });
    }

});