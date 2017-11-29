angular.module('ParkingSpace.controllers')
    .controller('BuyCtrl', function ($scope, $rootScope, $document, geoService) {

        $scope.selectThumbnail = function (item) {
            let initSrc = $("#" + item).attr('src');
            let main = $('#mainImg');
            main.attr('src', initSrc);
        };

        $scope.selectMain = function () {
            let main = $('#mainImg');
            $("#modalImg").attr('src', main.attr('src'));
        };

        $scope.menu = 'desc';

        $scope.getClass = function (menu) {
            if ($scope.menu === menu) {
                return 'selected'
            }
        };

        $scope.show = function($event){
            let elm = $($event.currentTarget);
            elm.next('.panel-body').slideToggle(200);
        };

        $scope.scrollTo = function (menu) {
            $scope.menu = menu;
            $.scrollTo('#' + menu,200);
        };

        $scope.tryBuy = function(){
            $.scrollTo('#priceTable',200);

        };


        $scope.qty = 1;
        $scope.unitPrice = 259;
        $scope.subscrPrice = 39;

        $scope.$watch('qty', function(newVal){
            $scope.price = $scope.qty * $scope.unitPrice;
            $scope.priceWVat = $scope.price * 1.21;
            $scope.subscrTotalPrice = $scope.subscrPrice * $scope.qty;
            $scope.subscrTotalPriceWVat = $scope.subscrTotalPrice * 1.21;
            $scope.overallTotal = $scope.priceWVat + $scope.subscrTotalPriceWVat
        })

    });