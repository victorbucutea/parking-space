angular.module('ParkingSpaceAdmin.controllers')
    .controller('MainCtrl', ['$scope', '$state', '$rootScope', '$document', 'companyUserService',
        function ($scope, $state, $rootScope, $document, companyUserService) {

            $document.on('click', '.ps-modal', function (event) {
                if ($(event.target).hasClass('ps-modal'))
                    $state.go('^');
            });

        }])
;