// init main modules

angular.module('ParkingSpace', [
    'ui.router',
    'ParkingSpace.directives',
    'ParkingSpace.filters',
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
            if (!place || !location) {
                return;
            }
            parameterService.setNavigateOnRedirect(location);
            window.location = '/app/index.html#!/home/login';
        }

        let observer = new IntersectionObserver(function (entries) {
            let ctrls = $('.scroll-to-top');
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ctrls.show();
                } else {
                    ctrls.hide();
                }
            });
        });
        observer.observe(document.getElementById('body'));
    }])

    .config(function () {
        window.isMobileOrTablet = function () {
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            } else {
                return false;
            }
        };

        window.isIos = function () {
            return (
                navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i));
        };
    })

    .constant('currencies', [
        {
            name: 'Ron',
            label: "Ron / h",
            icon: null
        }
       /* ,
        {
            name: 'Usd',
            label: "Usd / h",
            icon: 'fa-usd'
        },
        {
            name: 'Eur',
            label: "Eur / h",
            icon: 'fa-eur'
        },
        {
            name: 'Rur',
            label: "Rur / h",
            icon: 'fa-rub'
        },
        {
            name: 'Gbp',
            label: "Gbp / h",
            icon: 'fa-gbp'
        },
        {
            name: 'Yen',
            label: "Yen / h",
            icon: 'fa-jpy'
        },
        {
            name: 'Inr',
            label: "Inr / h",
            icon: 'fa-inr'
        },
        {
            name: 'Ils',
            label: "Ils / h",
            icon: 'fa-ils'
        },
        {
            name: 'Try',
            label: "Try / h",
            icon: 'fa-try'
        },
        {
            name: 'Krw',
            label: "Krw / h",
            icon: 'fa-krw'
        }*/
    ])
    .constant("GEOCODE_API_URL", "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY");

angular.module('ParkingSpace.directives', []);
angular.module('ParkingSpace.services', []);
angular.module('ParkingSpace.filters', []);

