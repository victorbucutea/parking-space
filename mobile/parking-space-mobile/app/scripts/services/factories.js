/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .factory('imageResizeFactory', function () {
        return function (base64img, newWidth, newHeight) {

            // create an off-screen canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(base64img, 0, 0, newWidth, newHeight);

            // encode image to data-uri with base64 version of compressed image
            data = canvas.toDataURL();
            canvas.parentNode.removeChild(canvas);
            return data;
        }
    })

    .factory('currencyFactory', function (currencies) {

        this.getCurrency = function (curName) {
            var currency = $.grep(currencies, function (cur) {
                return curName == cur.name;
            });


            if (currency[0] && currency[0].icon) {
                return currency[0].icon;
            } else {
                return null;
            }
        };

        return this;
    })

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
    });