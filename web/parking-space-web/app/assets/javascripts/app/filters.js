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
    .filter('moment', function () {
        return function (input, params) {
            if (!input) {
                return;
            }
            let date = moment(input);
            return date.format(params);
        }
    })
    .filter('totalPrice', function () {
        return function (bid, params) {
            if (!bid) return "";
            let start = new Date(bid.start_date).getTime();
            let stop = new Date(bid.end_date).getTime();
            let interval = stop - start;
            let pricePer15m = Math.floor(bid.bid_price / 4);
            let noOfUnits = Math.ceil(interval / (1000 * 60 * 15 /*15m*/));
            return noOfUnits * pricePer15m + " " + bid.bid_currency;
        }
    })
    .filter('totalPeriod', function () {
        return function (bid, params) {
            if (!bid) return "";
            let start = new Date(bid.start_date).getTime();
            let stop = new Date(bid.end_date).getTime();
            let interval = stop - start;
            return moment.duration(interval).format('d[d] h[h] m[m]');
        }
    });