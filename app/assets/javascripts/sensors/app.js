angular.module('ParkingSpaceSensors', [
    'ui.router',
    'ParkingSpaceSensors.controllers',
    'ParkingSpaceSensors.directives',
    'ParkingSpaceSensors.filters',
    'ParkingSpaceSensors.services',
    'ParkingSpaceMobile.services'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sensor-fleet', {
                url: '/sensor-fleet',
                views: {
                    'content': {
                        templateUrl: 'sensor-fleet.html'
                    }
                },
                params: {
                    locationId: null
                }
            })

            .state('sensor-fleet.sensor', {
                url: '/sensor?sensorId',
                views: {
                    'detail': {
                        templateUrl: 'sensor-edit.html'
                    }
                },
                params: {
                    sensorId: null
                }
            })

            .state('location', {
                url: '/location?locationId',
                views: {
                    'content': {
                        templateUrl: 'location.html'
                    }
                },
                params: {
                    locationId: null
                }
            })

            .state('location.sensor', {
                url: '/sensor?sensorId',
                views: {
                    'detail': {
                        templateUrl: 'sensor-edit.html'
                    }
                },
                params: {
                    sensorId: null
                }
            });

        $urlRouterProvider.otherwise('/location')
    }])

    .run(['$rootScope', function ($rootScope) {
        moment.locale('ro');

    }])
    .constant("GEOCODE_API_URL", "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY")

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
// init main modules

angular.module('ParkingSpaceSensors.directives', []);
angular.module('ParkingSpaceSensors.services', []);
angular.module('ParkingSpaceSensors.filters', []);
angular.module('ParkingSpaceSensors.controllers', []);