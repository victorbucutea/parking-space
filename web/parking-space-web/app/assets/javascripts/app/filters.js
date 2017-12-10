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
    })
    .filter('addressFilter', function () {
        return function (items, arg) {
            if (!items || !items.length || !arg || !arg.length) {
                return items;
            }
            let firstLvl = arg[0].short_name;

            items = items.filter(item => {
                let contains1 = item.address_line_1.indexOf(firstLvl) !== -1;
                let contains2 = item.address_line_2.indexOf(firstLvl) !== -1;
                return contains1 || contains2;
            });
            return items;
        }
    })
    .filter('periodFilter', function () {
        return function (items, arg) {
            console.log(items, arg);
            if (!items || !items.length || !arg ) {
                return items;
            }
            let filterStart = arg.start;
            let filterStop = arg.stop;

            if (!filterStart || !filterStop ) {
                return items;
            }
            items = items.filter(item => {
                let beforeStart = item.space_availability_start > filterStop;
                let afterStop = item.space_availability_stop < filterStart;
                return !( beforeStart || afterStop )
            });
            return items;
        }
    });