angular.module('ParkingSpaceAdmin.controllers')
    .controller('SectionCtrl',
        ['$scope', '$state', '$rootScope', 'sectionService', 'sensorService', 'replaceById',
            function ($scope, $state, $rootScope, sectionService, sensorService, replaceById) {

                $scope.cloudinaryName = cloudinaryName;
                let tmpId = -1;
                $scope.savePerimeters = function () {
                    if (!$scope.sectionForm.$valid) {
                        $('#sectionForm').addClass('was-validated');
                        return;
                    }

                    let badPerim = $scope.parkingPerimeters.find((per) => {
                        // filter out the ones which don't have type
                        // e.g. haven't been edited
                        return !per.perimeter_type;
                    });

                    if (badPerim) {
                        alert("Nu ai selectat tipul perimetrului sau identificatorul pentru toate perimetrele. " +
                            "Te rugam completeaza sau sterge perimetrul. ");
                        return;
                    }

                    $scope.loading = true;
                    sectionService.saveSectionAndPerimeters($scope.section, $scope.parkingPerimeters, $scope.sensors)
                        .then(() => {
                            $state.go('^', {}, {reload: true});
                        })
                        .finally(() => {
                            $scope.loading = false;
                        });
                };

                $scope.reloadPerimeters = function () {
                    sectionService.getSectionPerimeters($state.params.sectionId).then((data) => {
                        $scope.section = data;
                        $scope.parkingPerimeters = data.perimeters;

                        sensorService.getAssignedSensors($scope.section.id, (data) => {
                            $scope.sensors = data;
                        })

                        sensorService.getSensorsWithLocation((data) => {
                            $scope.db_sensors = data;
                            $scope.db_sensors.forEach(s => {
                                if (!s.section) return;
                                s.selected = s.section.id === $scope.section.id
                            })

                        });
                    })
                };

                $scope.parkingPerimeters = [];
                $scope.sensors = [];
                if ($state.params.sectionId) {
                    $scope.reloadPerimeters();
                }

                $scope.newPerimeter = function () {
                    $scope.parkingPerimeters.push({
                        id: --tmpId,
                        top_left_x: 10,
                        description: "No desc. ",
                        top_left_y: 10,
                        bottom_right_x: 20,
                        bottom_right_y: 20,
                        section_id: $scope.section.id
                    })
                };


                $scope.newSensor = function () {
                    $('#dbSensorList').show();
                };

                $scope.selectSensors = function () {
                    let to_save = $scope.db_sensors.filter(s => s.selected)
                    $scope.db_sensors.forEach(s => s.section_id = $scope.section.id)
                    $scope.sensors = [];
                    $scope.sensors.push(...to_save);
                    $('#dbSensorList').hide();
                }

                $scope.onClickPerim = function (per) {
                    $scope.selectedPer = per;
                    $state.go(".perimeter");
                };

                $scope.onClickSensor = function (per) {
                    $scope.selectedSensor = per;
                    $state.go(".sensor", {sensorId: per.id});
                };

                $scope.assignedSpaces = function () {
                    return $scope.parkingPerimeters.filter(p => p.is_assigned).length;
                };

                $scope.newSpaces = function () {
                    return $scope.parkingPerimeters.filter(p => p.id <= 0).length;
                };

                $scope.publicSpaces = function () {
                    return $scope.parkingPerimeters.filter(p => p.is_public).length;
                };

                $scope.employeeSpaces = function () {
                    return $scope.parkingPerimeters.filter(p => p.is_employee).length;
                };


            }]);