// init main modules

angular.module('ParkingSpace', [
    'ui.router',
    'ParkingSpace.controllers',
    'ParkingSpace.directives',
    'ParkingSpace.filters',
    'ParkingSpace.services'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/'
            })
            .state('app', {
                url: '/app',
                templateUrl: 'app/map/index'
            })
            .state('buy', {
                url: '/buy',
                templateUrl: 'landing/buy'
            })
            .state('buy-sensor', {
                url: '/buy-sensor',
                templateUrl: 'landing/buy-sensor'
            })
            .state('business', {
                url: '/business',
                templateUrl: 'landing/business'
            });

        $urlRouterProvider.otherwise('/')
    }])

    .config(() => {
        window.isIos = function () {
            return (
                navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i));
        };
    })

    .run(['$rootScope', function ($rootScope) {

        moment.locale('ro');

        // initialization code
        if (!String.prototype.splice) {
            /**
             * {JSDoc}
             *
             * The splice() method changes the content of a string by removing a range of
             * characters and/or adding new characters.
             *
             * @this {String}
             * @param {number} start Index at which to start changing the string.
             * @param {number} delCount An integer indicating the number of old chars to remove.
             * @param {string} newSubStr The String that is spliced in.
             * @return {string} A new string with the spliced substring.
             */
            String.prototype.splice = function (start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        }

        $rootScope.$on('$viewContentLoaded',
            function (event, viewConfig) {
                // to it here because not all dom is
                // finished
                $('[data-toggle="popover"]').popover({trigger: 'focus'});

                if ($(window).width() < 460) {
                    $('.owl-carousel').owlCarousel({
                        margin: 0,
                        items: 1,
                        dots: true
                    });
                } else {
                    $('.owl-carousel').removeClass('owl-carousel');
                }

                $('.scroll-to-top').hide();
                $(window).scroll(function (arg) {
                    if ($(window).scrollTop() > 300) {
                        $('.scroll-to-top').show();
                    } else {
                        $('.scroll-to-top').hide();
                    }
                });
            });


    }])
    .constant("GEOCODE_API_URL", "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY")
   ;

angular.module('ParkingSpace.controllers', []);
angular.module('ParkingSpace.directives', []);
angular.module('ParkingSpace.services', []);
angular.module('ParkingSpace.filters', []);