angular.module('ParkingSpaceMobile.controllers').controller('NavMenuCtrl',
    ['$rootScope', '$scope', '$document', '$stateParams', 'parameterService', '$state', 'userService',
        function ($rootScope, $scope, $document, $stateParams, parameterService, $state, userService) {
            $('#navMenu').hide();



            $scope.logout = function () {
                userService.logout(() => {
                    $state.go('login');
                });
            };
        }]);