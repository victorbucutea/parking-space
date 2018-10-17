angular.module('ParkingSpaceSensors.controllers')
    .controller('LocationCtrl', ['$scope', '$state', '$rootScope', '$document', 'sensorService', 'replaceById',
        function ($scope, $state, $rootScope, $document, sensorService, replaceById) {
            let mapOptions = {
                center: new google.maps.LatLng(44.412, 26.113),
                zoom: 13,
                minZoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                rotateControl: false,
                disableDefaultUI: true,
            };
            let map = new google.maps.Map($('.location_map')[0], mapOptions);
            $scope.marker = new google.maps.Marker({
                draggable: true
            });

            google.maps.event.addListener($scope.marker, 'dragend', function (event) {
                let pos = this.position;
                let loc = $scope.location;
                if (loc) {
                    loc.location_lat = pos.lat();
                    loc.location_long = pos.lng();
                    $scope.$apply();
                }
            });


            sensorService.getLocations((data) => {
                $scope.locations = data;
            });

            $scope.selectLocation = (loc) => {
                $scope.location = loc;
            };

            $scope.saveSensorLocation = () => {
                if (!$scope.locationForm.$valid) {
                    $('#locationForm').addClass('was-validated');
                    return;
                }

                $scope.loading = true;

                sensorService.saveLocation($scope.location, (data) => {
                    replaceById(data, $scope.locations);
                    $scope.location = data;
                }).finally(() => {
                    $scope.loading = false;
                })

            };

            $scope.deleteSensorLocation = () => {
                let loc = $scope.location;
                if (!loc.id) return;
                sensorService.deleteLocation(loc.id, (data) => {
                    let idx = $scope.locations.indexOf(loc);
                    $scope.locations.splice(idx, 1);
                    $scope.location = {};
                })
            };

            let initAssignedSensors = function () {
                if (!$scope.location && !$scope.location.id) {
                    $scope.assignedSensors = [];
                    return;
                }
                sensorService.getAssignedSensors($scope.location.id, (data) => {
                    $scope.assignedSensors = data;
                });
            };

            $scope.$watch('location', function (newVal) {
                if (!newVal) return;

                initAssignedSensors();
                $scope.marker.setTitle(newVal.parking_space_name);
                $scope.marker.setMap(map);
                if (!newVal.location_lat || !newVal.location_long) {
                    let unirii = new google.maps.LatLng(44.425613, 26.103693);
                    $scope.marker.setPosition(unirii);
                    map.setCenter(unirii);
                    return;
                }
                let latLng = new google.maps.LatLng(newVal.location_lat, newVal.location_long);
                $scope.marker.setPosition(latLng);
                map.setCenter(latLng);
            });

            $scope.assignNewSensor = () => {
                sensorService.getSensors((data) => {
                    $scope.sensors = data;
                    $scope.addNewSensor = true;
                })
            };

            $scope.unassignSensor = (sensor) => {
                sensor.sensor_location_id = null;
                $scope.loading = true;
                sensorService.saveSensor(sensor, (data) => {
                    initAssignedSensors();
                }).finally(() => {
                    $scope.loading = false;
                    $scope.addNewSensor = false;
                })
            };

            $scope.saveSensor = () => {
                if (!$scope.newSensorForm.$valid) {
                    $('#newSensorForm').addClass('was-validated');
                    return;
                }

                $scope.newSensor.sensor_location_id = $scope.location.id;
                $scope.loading = true;
                sensorService.saveSensor($scope.newSensor, (data) => {
                    initAssignedSensors();
                }).finally(() => {
                    $scope.loading = false;
                    $scope.addNewSensor = false;
                })
            }
        }]);