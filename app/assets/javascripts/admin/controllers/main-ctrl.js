angular.module('ParkingSpaceAdmin.controllers')
    .controller('MainCtrl', ['$scope', '$state', '$rootScope', '$document', 'companyUserService',
        function ($scope, $state, $rootScope, $document, userService) {

            userService.getCompany((c) => {
                $scope.company = c;
            });


            $document.on('click', '.ps-modal', function (event) {
                if ($(event.target).hasClass('ps-modal'))
                    $state.go('^');
            });

        }])
;