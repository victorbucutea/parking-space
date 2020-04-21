// init main modules

angular.module('ParkingSpace', [
    'ui.router',
    'ParkingSpace.directives',
    'ParkingSpace.services'])

    .config(() => {
        window.isIos = function () {
            return (
                navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i));
        };
    })

    .run([function () {

        moment.locale('ro');

        // initialization code
        if (!String.prototype.splice) {
            String.prototype.splice = function (start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        };

    }])
    .constant("GEOCODE_API_URL", "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY");

angular.module('ParkingSpace.directives', []);
angular.module('ParkingSpace.services', []);