/**
 *  Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('MyPostsCtrl',
    ['$scope', '$filter', 'offerService', 'parkingSpaceService', '$state', '$stateParams', 'notificationService', 'replaceById',
        function ($scope, $filter, offerService, parkingSpaceService, $state, $stateParams, notificationService, replaceById) {

            parkingSpaceService.getMySpaces(function (spaces) {
                $scope.spaces = spaces;
                let selectedSpace = spaces.find(function (item) {
                    return (item.id === $stateParams.parking_space_id);
                });

                if (selectedSpace && selectedSpace[0]) {
                    $scope.spaceEdit = selectedSpace[0];
                }
            });

            $scope.acceptOffer = function (space, offer) {
                if (confirm("Accepti oferta lui " + offer.owner_name + " de " + offer.bid_price + " " + offer.bid_currency + " ?")) {
                    offerService.acceptOffer(space.id, offer, function (result) {
                        replaceById(result, space.offers);
                    });
                }
            };
            $scope.uploadedFiles = {};
            $scope.count = 0;
            $scope.availability_start = moment().toDate();
            $scope.availability_stop = moment().add(1, 'd').toDate();

            function calcCnt() {
                let count = 0;
                for (let i in $scope.uploadedFiles) {
                    count++;
                }
                $scope.count = count - 1;

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

            $scope.fileSelected = function (f) {
                calcCnt();
            };

            $scope.fileDeSelected = function (f) {
                calcCnt();
            };

            $scope.upload = function (space) {
                $scope.uploadedFiles.submit().then(function (resp) {
                    parkingSpaceService.uploadDocuments(space.id, resp, (r) => {
                        replaceById(r, $scope.spaces)
                    });
                })

            };

            $scope.show = function (space, item) {
                $scope.selectedSpace = space;
                notificationService.hideParkingSpaceNotifications();
                $('#' + item).slideToggle(200);

            };

            $scope.initExpiredBox = function () {

                $('[data-toggle=tooltip]').tooltip();

            };

            $scope.timeUntilExpiry = function (space) {
                return moment().to(moment(space.space_availability_stop), true);
            };

            $scope.findActiveOffer = function (space) {
                return space.offers.find((of) => {
                    return of.active
                });
            };

            $scope.extendValidity = function (space,start,stop) {

                if (start.isSameOrAfter(stop)) {
                    alert('Data stop trebuie sa fie mai mare ca data start!');
                    return;
                }

                space.space_availability_start = start.toDate();
                space.space_availability_stop = stop.toDate();
                parkingSpaceService.extendValidity(space, (s) => {
                    replaceById(s,$scope.spaces);
                })
            }

        }]);