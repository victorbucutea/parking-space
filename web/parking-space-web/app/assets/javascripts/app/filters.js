angular.module("ParkingSpaceMobile.filters", [])

    .filter('units', function () {
        return function (input, params) {
            if (input === 0){
                return '0';
            }
            if (!input) {
                return;
            }
            var number = input.toFixed(2);
            return number.split(/[,\.]/)[0];
        }


    })
    .filter('subunits', function () {
        return function (input, params) {
            if (input === 0){
                return '0';
            }

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
    .filter('periodFilter', ['$filter',function ($filter) {
        return function (items, arg1, arg2) {
            if (!items || !items.length || !arg1) {
                return items;
            }
            let filterStart = arg1.start;
            let filterStop = arg1.stop;

            if (!filterStart || !filterStop) {
                return items;
            }
            items = items.filter(item => {

                let st = moment(item.space_availability_start);
                let end = moment(item.space_availability_stop);
                let beforeStart = st.isAfter(filterStop);
                let afterStop = end.isBefore(filterStart);

                // check all offers are within limits
                // this is done in the my offers screen to avoid showing a space with no offers present
                if (item.offers && arg2) {
                    let offers = $filter('periodFilterOffers')(item.offers, arg1);
                    if (!offers.length) {
                        return false;
                    }
                }

                return !(beforeStart || afterStop)
            });
            return items;
        }
    }])
    .filter('periodFilterOffers', function () {
        return function (items, arg) {
            if (!items || !items.length || !arg) {
                return items;
            }
            if (!arg.start || !arg.stop) {
                return items;
            }

            let filterStart = moment(arg.start);
            let filterStop = moment(arg.stop);

            items = items.filter(item => {
                let st = moment(item.start_date);
                let end = moment(item.end_date);
                let beforeStart = st.isAfter(filterStop);
                let afterStop = end.isBefore(filterStart);
                return !(beforeStart || afterStop)
            });
            return items;
        }
    });