angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserReviewsCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {


                parkingSpaceService.getReviews($scope.space).then((revs) => {
                    $scope.space.reviews = revs;
                });



                $scope.$watch('', function (newValue, oldValue) {

                });
            }]);