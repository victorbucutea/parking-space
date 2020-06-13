angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserDocumentsCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {


                parkingSpaceService.getDocuments($scope.space).then((docs) => {
                    $scope.space.docs = docs;
                });



                $scope.$watch('', function (newValue, oldValue) {

                });
            }]);