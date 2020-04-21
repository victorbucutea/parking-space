angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl',
    ['$rootScope', 'paymentService', '$state', '$scope', 'offerService', 'parkingSpaceService', 'replaceById', '$q',
        function ($rootScope, paymentService, $state, $scope, offerService, parkingSpaceService, replaceById, $q) {


            function initBid() {
                $scope.bid = {};
                let selectedSpace = $scope.selectedSpace;
                if (selectedSpace) {
                    $scope.bid.bid_price = selectedSpace.price;
                    $scope.bid.bid_currency = selectedSpace.currency;
                    $scope.bid.start_date = new Date();
                    $scope.bid.end_date = moment().add(1, 'd').toDate();
                    selectedSpace.userOffers = [];
                    if (selectedSpace.offers)
                        selectedSpace.userOffers = selectedSpace.offers.filter(offer => offer.owner_is_current_user);
                    $scope.hideRentForm = !selectedSpace.userOffers.length;
                }
            }

            initBid();

            if ($state.params.spaceId) {
                let spacePr;
                if (!$scope.selectedSpace) {
                    spacePr = parkingSpaceService.getSpace($state.params.spaceId)
                }

                let offerPr = offerService.getOffers($state.params.spaceId);
                $q.all([spacePr, offerPr]).then((resp) => {
                    let space = resp[0];
                    let offers = resp[1];
                    if (space)
                        $scope.selectedSpace = space;
                    $scope.selectedSpace.offers = offers;
                    initBid();
                })
            }

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

            $scope.placeOffer = function () {
                let bid = $scope.bid;
                bid.bid_amount = bid.bid_price;
                let st = moment(bid.start_date);
                let end = moment(bid.end_date);
                let interval = end.diff(st);
                if (moment.duration(interval).asMinutes() < 15) {
                    $('#dateStop').addClass('is-invalid');
                    return;
                }
                offerService.placeOffer(bid, $scope.selectedSpace.id, function (bid) {
                    $scope.selectedSpace.offers.push(bid);
                    $rootScope.$emit('spaceSave', $scope.selectedSpace);
                    $state.go('.pay', {offer: bid});
                    initBid();
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

