angular.module('ParkingSpaceMobile.controllers').controller('ReviewBidsCtrl',
    ['$rootScope', 'paymentService', '$state', '$scope', 'offerService', 'parkingSpaceService', 'replaceById', '$q',
        function ($rootScope, paymentService, $state, $scope, offerService, parkingSpaceService, replaceById, $q) {


            $scope.validity = function (space) {
                if (!space) return 'N/A';
                return moment(space.space_availability_start).twix(space.space_availability_stop).format();
            };

            $scope.timeUntilExpiry = function (space) {
                if (!space) return 'N/A';
                return moment().twix(space.space_availability_stop).humanizeLength();
            };

            function initBid() {
                $scope.bid = {};
                let selectedSpace = $scope.selectedSpace;
                if (selectedSpace) {
                    $scope.bid.bid_price = selectedSpace.price;
                    $scope.bid.bid_currency = selectedSpace.currency;
                    if ($state.params.start) {
                        $scope.bid.start_date = $state.params.start;
                        $('#newTab').tab('show');
                    } else {
                        $scope.bid.start_date = new Date();
                        $('#activeTab').tab('show');
                    }

                    if ($state.params.stop) {
                        $scope.bid.end_date = $state.params.stop;
                    } else {
                        $scope.bid.end_date = moment().add(1, 'd').toDate();
                    }
                    selectedSpace.showAvail = false;
                }
            }

            initBid();

            if ($state.params.spaceId) {
                let spacePr;
                if ($scope.spaces)
                    $scope.selectedSpace = $scope.spaces.find(s => s.id == $state.params.spaceId)

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

            if($state.params)


            $scope.$watchCollection('selectedSpace.offers', function (newValue, oldValue) {
                if (newValue) {
                    $scope.activeOffers = newValue.filter(o => isActive(o));
                    $scope.futureOffers = newValue.filter(o => isFuture(o));
                    $scope.pastOffers = newValue.filter(o => isPast(o));
                }
            });

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
                    $state.go('.pay', {offer: bid});
                    initBid();
                });
            };

            $scope.selectOffer = function (offer) {
                $scope.selOffer = offer;
            };

            $scope.select = function (space) {
                $('#spaceDescContainer-' + space.id).toggleClass('show');
            }


            let isActive = function (o) {
                let st = moment(o.start_date);
                let now = moment();
                if (st.isBefore(now) && !o.end_date) return true;
                let end = moment(o.end_date);
                return st.isBefore(now) && now.isBefore(end);
            }

            let isFuture = function (o) {
                let st = moment(o.start_date);
                let now = moment();
                return st.isAfter(now);
            }

            let isPast = function (o) {
                if (!o.end_date) return false;
                let ent = moment(o.end_date);
                let now = moment();
                return ent.isBefore(now);
            }

        }]);

