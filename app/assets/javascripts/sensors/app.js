angular.module('ParkingSpaceSensors', [
    'ui.router',
    'ParkingSpaceSensors.controllers',
    'ParkingSpaceSensors.directives',
    'ParkingSpaceSensors.filters',
    'ParkingSpaceSensors.services',
    'ParkingSpaceMobile.services'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {url:'/'})
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
            .state('locations', {
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
            .state('locations.sensor', {
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
            .state('locations.section', {
                url: '/section?sectionId',
                views: {
                    'detail': {
                        templateUrl: 'section-edit.html'
                    }
                },
                params: {
                    section: null
                }
            })
            .state('locations.section.perimeter', {
                url: '/section/perimeter',
                views: {
                    'perimeter': {
                        templateUrl: 'perimeter-edit.html'
                    }
                }
            })
            .state('users', {
                url:"/users",
                views: {
                    'content': {
                        templateUrl: 'users.html'
                    }
                },
            })
            .state('users.rights', {
                url:"/rights",
                views: {
                    'details': {
                        templateUrl: 'users-rights.html'
                    }
                }
            })
            .state('users.spaces', {
                url:"/spaces",
                views: {
                    'content': {
                        templateUrl: 'users-spaces.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/')
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
            var idx = collection.length;
            collection.forEach(function (colItem) {
                if (colItem.id === item.id) {
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