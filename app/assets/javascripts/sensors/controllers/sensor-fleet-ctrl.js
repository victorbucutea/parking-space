angular.module('ParkingSpaceSensors.controllers')
    .controller('SensorFleetCtrl', ['$scope', '$state', 'sensorService', function ($scope, $state, sensorService) {

        $scope.cloudinaryName = window.cloudinaryName;

        sensorService.getSensorsWithLocation((data) => {
            $scope.sensors = data;
        });

        $scope.available = function (sensor) {
            if (!sensor.perimeters || !sensor.perimeters.length) {
                return 0 ;
            }

            let pspacecnt = 0;
            sensor.perimeters.forEach((p) => {
                if (p.parking_space) {
                    pspacecnt++;
                }
            });

            return pspacecnt;
        }


    }]);
