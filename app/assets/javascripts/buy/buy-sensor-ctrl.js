angular.module('ParkingSpace.controllers')
    .controller('BuySensorCtrl', ['$scope', '$controller', function ($scope, $controller) {
    // Initialize the super class and extend it.
    angular.extend(this, $controller('BuyCtrl', {$scope: $scope}));

    $scope.qty = 1;
    $scope.unitPrice = 139;
    $scope.subscrPrice = 39;

}]);