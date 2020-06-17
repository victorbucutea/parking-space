angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserReviewsCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {

                parkingSpaceService.getReviews($scope.space).then((revs) => {
                    $scope.space.reviews = revs;
                });



                $scope.$watch('', function (newValue, oldValue) {

                });

                $scope.edit = function (space, review) {

                };

                $scope.delete = function ( review) {
                    parkingSpaceService.deleteReview(review).then(() => {
                       let idx= $scope.space.reviews.indexOf(review);
                        $scope.space.reviews.splice(idx, 1);
                    })
                };
            }]);