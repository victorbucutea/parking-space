angular.module('ParkingSpace.controllers')
    .controller('MainCtrl', ['$scope', '$state', function ($scope, $state) {

        $scope.scrollTo = function (menu) {
            $state.go('main').then(function () {
                $scope.menu = menu;
                $.scrollTo('#' + menu, 200);
            });
        };

        let goto = location.search.indexOf('rent') !== -1;
        if (goto) {
            setTimeout(function () {
                    $.scrollTo('#rent', 200);
                }
            ,200);
        }

        setTimeout(() => {
            $('#announcement').addClass('slide-in');
        },5000);


        $scope.show = function (item) {
            $('#' + item).slideToggle(200);
        }

    }]);