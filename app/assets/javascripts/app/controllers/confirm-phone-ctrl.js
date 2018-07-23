angular.module('ParkingSpaceMobile.controllers').controller('ConfirmPhoneCtrl', 
    ['$rootScope', '$scope', '$state', 'userService',function ($rootScope, $scope, $state, userService) {

    $scope.options = {
        phoneNumber: {
            delimiters: ['.', '.'],
            blocks: [3, 3, 3],
            numericOnly: true
        }
    };

    if ( sessionStorage.getItem("current_user")){
        $scope.user = JSON.parse(sessionStorage.getItem("current_user"));
        $scope.user.phoneNumber = $scope.user.phone_number.replace('+40','');
    }

    $scope.validateCode = function(){
        userService.validateCode($scope.confirmationCode,(data) => {
            $state.go('^');
            $rootScope.$emit('http.notif','Ai validat numărul de telefon. ' +
                'Acum poți publica sau rezerva locuri de parcare!')
        } , (data) => {
            $rootScope.$emit('http.warning','Cod de confirmare incorect,' +
                'vă rugăm incercați din nou.')
        })

    };


    $scope.resendCode = function(){
        if (!$scope.phoneConfirmation.$valid) {
            $('#phoneConfirmation').addClass('was-validated');
            return;
        }
        userService.resendCode('+40'+$scope.user.phoneNumber,(data) => {
            $rootScope.$emit('http.notif','Codul a fost trimis!')
        });

    };

    $('[data-toggle=tooltip]').tooltip()


}]);