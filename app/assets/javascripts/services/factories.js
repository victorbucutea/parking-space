/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpace.services')


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
            let i = 0;
            let idx = collection.length;
            collection.forEach(function (colItem) {
                if (colItem.id === item.id) {
                    idx = i;
                }
                i++;
            });
            collection[idx] = item;
        };
    })
;