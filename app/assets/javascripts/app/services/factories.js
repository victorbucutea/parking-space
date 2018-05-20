/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .factory('currencyFactory', ['currencies',function (currencies) {

        this.getCurrency = function (curName) {
            let currency = $.grep(currencies, function (cur) {
                return curName === cur.name;
            });


            if (currency[0] && currency[0].icon) {
                return currency[0].icon;
            } else {
                return null;
            }
        };

        return this;
    }])

    .factory('replaceById', function () {
        return function (item, collection) {
            if (!collection || !item) {
                return;
            }
            var i = 0;
            var idx = 0;
            collection.forEach(function (colItem) {
                if (colItem.id == item.id) {
                    idx = i;
                }
                i++;
            });
            collection[idx] = item;
        };
    })
;