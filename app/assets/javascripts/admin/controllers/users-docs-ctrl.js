angular.module('ParkingSpaceAdmin.controllers')
    .controller('UserDocumentsCtrl',
        ['$scope', '$state', '$rootScope', 'parkingSpaceService', 'replaceById',
            function ($scope, $state, $rootScope, parkingSpaceService, replaceById) {


                parkingSpaceService.getDocuments($scope.space).then((docs) => {
                    $scope.space.docs = docs;
                });


                $scope.upload = function (space) {
                    $scope.space.docs.submit().then(function (resp) {
                        parkingSpaceService.uploadDocuments(space.id, resp, (docs) => {
                            $scope.space.docs = docs;
                        });
                    })
                };
            }]);