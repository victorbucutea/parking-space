// init main modules

angular.module('ParkingSpace', [
    'ui.router',
    'ParkingSpace.directives',
    'ParkingSpace.services'])
    .run([function () {
        moment.locale('ro');
        // initialization code
        if (!String.prototype.splice) {
            String.prototype.splice = function (start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        }
    }])

    .controller('IndexCtrl', ['$scope', 'parameterService', function ($scope, parameterService) {

        $scope.placeSelected = function (place, location) {
            parameterService.setNavigateOnRedirect(location);
            window.location = '/app/index.html#!/home/login';
        }
    }])
    .constant("GEOCODE_API_URL", "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY");

angular.module('ParkingSpace.directives', []);
angular.module('ParkingSpace.services', []);

