angular.module('ParkingSpaceAdmin.controllers')
    .controller('SensorFleetCtrl', ['$scope', '$state', 'sensorService', function ($scope, $state, sensorService) {

        $scope.cloudinaryName = window.cloudinaryName;

        sensorService.getSensorsWithLocation((data) => {
            $scope.sensors = data;
        });

        $scope.available = function (sensor) {
            if (!sensor.perimeters || !sensor.perimeters.length) {
                return 0;
            }

            let pspacecnt = 0;
            sensor.perimeters.forEach((p) => {
                if (p.parking_space) {
                    pspacecnt++;
                }
            });

            return pspacecnt;
        };


        $scope.online = function (sensor) {
            if (!sensor.last_touch_date) return false;
            return moment(sensor.last_touch_date).isAfter(moment().subtract(3, 'minutes'));
        };


    }]);
