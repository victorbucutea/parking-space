angular.module('ParkingSpaceAdmin.controllers')
    .controller('SectionCtrl',
        ['$scope', '$state', '$rootScope', 'sectionService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, sectionService, locationService, replaceById) {

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
                        alert("Un perimetru de parcare nu are tip sau identificator. " +
                            "Te rugam completeaza sau sterge perimetrul. ");
                        return;
                    }

                    $scope.loading = true;
                    sectionService.saveSectionAndPerimeters($scope.section, $scope.parkingPerimeters, (data) => {
                        $state.go('^', {}, {reload: true});
                    });

                };

                $scope.reloadPerimeters = function () {
                    sectionService.getSectionPerimeters($state.params.sectionId, (data) => {
                        $scope.section = data;
                        $scope.parkingPerimeters = data.perimeters;
                    })
                };

                if ($state.params.sectionId) {
                    $scope.reloadPerimeters();
                }

                $scope.newPerimeter = function () {
                    if (!$scope.parkingPerimeters) $scope.parkingPerimeters = [];
                    $scope.parkingPerimeters.push({
                        id: --tmpId,
                        top_left_x: 10,
                        description: "No desc. ",
                        top_left_y: 10,
                        bottom_right_x: 20,
                        bottom_right_y: 20
                    })
                };

                $scope.onClickPerim = function (per) {
                    $scope.selectedPer = per;
                    $state.go(".perimeter");
                };

                $scope.assignedSpaces = function () {
                    return $scope.parkingPerimeters.filter((p) => {
                        return p.is_assigned
                    }).length;
                };
                $scope.newSpaces = function () {
                    return $scope.parkingPerimeters.filter((p) => {
                        return p.id <= 0
                    }).length;
                };
                $scope.publicSpaces = function () {
                    return $scope.parkingPerimeters.filter((p) => {
                        return p.is_public
                    }).length;
                };
                $scope.employeeSpaces = function () {
                    return $scope.parkingPerimeters.filter((p) => {
                        return p.is_employee
                    }).length;
                };


            }]);