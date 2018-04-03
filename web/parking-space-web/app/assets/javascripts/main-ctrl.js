angular.module('ParkingSpace.controllers')
    .controller('MainCtrl', ['$scope', '$state',function ($scope,$state) {

        $scope.scrollTo = function (menu) {
            $state.go('main').then(function(){
                $scope.menu = menu;
                $.scrollTo('#' + menu,200);
            });
        };

        let shouldRedirect= location.search.indexOf('redirect') === -1;
        if (shouldRedirect && current_user) {
            // redirect to search
            location.assign('/app/index.html#!/home/map/search')
        }


        $scope.show = function(item) {
            $('#'+item).slideToggle(200);
        }

    }]);