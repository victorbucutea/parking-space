/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyOffersCtrl',
    ['$scope', '$state', 'parkingSpaceService', 'replaceById', '$rootScope',
        function ($scope, $state, parkingSpaceService, replaceById, $rootScope) {
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


            if (!$rootScope.desktopScreen)
                $scope.$emit('mapAndContent', {showMap: false, colContent: 'col-12'});
            else
                $scope.$emit('mapAndContent', {colContent: 'col-8', colMap: 'col-4'});


            $scope.cloudName = window.cloudinaryName;

            parkingSpaceService.getMyOffers(function (spaces) {
                if (!spaces) {
                    return;
                }
                $scope.drawSpaces(spaces, true);
                $scope.activeSpaces = [];
                $scope.futureSpaces = [];
                $scope.pastSpaces = [];
                $scope.spaces.forEach((s) => {
                    let activeOffers = s.offers.filter(o => isActive(o));
                    if (activeOffers.length) {
                        $scope.activeSpaces.push(s);
                        s.activeOffers = activeOffers;
                    }
                    let pastOffers = s.offers.filter(o => isPast(o));
                    if (pastOffers.length) {
                        $scope.pastSpaces.push(s);
                        s.pastOffers = pastOffers;
                    }
                    let futureOffers = s.offers.filter(o => isFuture(o));
                    if (futureOffers.length) {
                        $scope.futureSpaces.push(s);
                        s.futureOffers = futureOffers;
                    }
                })
            });


            $scope.timeUntilStart = function (offer) {
                if (!offer) return 'N/A';
                return moment().twix(offer.start_date).humanizeLength();
            };


            $scope.showFullImageThumb = function (evt, space) {
                $rootScope.$emit('showCarouselImages', space.images);
                evt.stopPropagation();
            };

            $scope.$on('markerClick', function (event, payload) {
                let data = payload[0];
                if ($scope.activeSpaces.indexOf(data) !== -1) {
                    $('#activeTab').tab('show');
                }
                if ($scope.pastSpaces.indexOf(data) !== -1) {
                    $('#pastTab').tab('show');

                }
                if ($scope.futureSpaces.indexOf(data) !== -1) {
                    $('#futureTab').tab('show');

                }
            });

            $scope.showReviewForm = function (params) {
                $rootScope.$emit('showReviewForm', params, $scope.reviews);
            }

        }]);