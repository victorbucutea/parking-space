angular.module("ParkingSpaceMobile.filters", [])

    .filter('units', function () {
        return function (input, params) {
            if (!input) {
                return;
            }
            var number = input.toFixed(2);
            return number.split(/[,\.]/)[0];
        }


    })
    .filter('subunits', function () {
        return function (input, params) {
            if (!input) {
                return;
            }
            var number = input.toFixed(2);
            return number.split(/[,\.]/)[1];
        }
    })
    .filter('moment', function(){
        return function( input, params ) {
            if (!input) {
                return;
            }
            let date = moment(input);
            return date.format(params);
        }
    });