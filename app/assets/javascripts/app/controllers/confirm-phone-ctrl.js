angular.module('ParkingSpaceMobile.controllers').controller('ConfirmPhoneCtrl',
    ['$rootScope', '$scope', '$state', 'userService',
        function ($rootScope, $scope, $state, userService) {

            userService.getUser().then((user) => {
                $scope.user = user;
            });

            $scope.validateCode = function () {
                userService.validateCode($scope.confirmationCode).then( (data) => {
                    $state.go('search');
                    $rootScope.$emit('http.notif', 'Ai validat numărul de telefon. ' +
                        'Acum poți publica sau rezerva locuri de parcare!')
                }, (data) => {
                    $rootScope.$emit('http.warning', 'Cod de confirmare incorect,' +
                        'vă rugăm incercați din nou.')
                })

            };


            $scope.resendCode = function () {
                if (!$scope.phoneConfirmation.$valid) {
                    $('#phoneConfirmation').addClass('was-validated');
                    return;
                }
                let user = $scope.user;
                userService.resendCode(user.prefix, user.phone_number).then((data) => {
                    $rootScope.$emit('http.notif', 'Codul a fost trimis!')
                });

            };

            $('[data-toggle=tooltip]').tooltip()


        }]);