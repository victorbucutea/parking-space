angular.module('ParkingSpaceSensors.controllers')
    .controller('SectionCtrl',
        ['$scope', '$state', '$rootScope', 'sensorService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, sensorService, locationService, replaceById) {

                let tmpId = 0;

                $scope.savePerimeters = function () {
                    if (!$scope.sectionForm.$valid) {
                        $('#sectionForm').addClass('was-validated');
                        return;
                    }
                    $scope.loading = true;
                    let perimToSave = angular.copy($scope.parkingPerimeters);

                    sensorService.saveSectionAndPerimeters($scope.section, perimToSave, (data) => {
                        $state.go('^', {}, {reload: true});
                    });

                };

                $scope.reloadPerimeters = function () {
                    sensorService.getSectionPerimeters($state.params.sectionId, (data) => {
                        $scope.section = data;
                        $scope.parkingPerimeters = data.perimeters;
                    })
                };

                if ($state.params.sectionId) {
                    $scope.reloadPerimeters();
                }

                $scope.preSavePerimeter = function (per) {
                    let square = $('.per-drag-' + per.id);
                    let w = square.width();
                    let h = square.height();
                    let top = parseInt(square.css('top'));
                    let left = parseInt(square.css('left'));
                    per.top_left_x = left * factorWidth;
                    per.top_left_y = top * factorHeight;
                    per.bottom_right_x = (left + w) * factorWidth;
                    per.bottom_right_y = (top + h) * factorHeight;
                };


                $scope.newPerimeter = function () {
                    if (!$scope.parkingPerimeters) $scope.parkingPerimeters = [];
                    $scope.parkingPerimeters.push({
                        id: --tmpId,
                        top_left_x: 80,
                        description: "No desc. ",
                        top_left_y: 130,
                        bottom_right_x: 240,
                        bottom_right_y: 230
                    })
                };


                let factorWidth = 1;
                let factorHeight = 1;
                let dragging = false;


                $scope.clickPer = function (per) {
                    if (dragging) return;
                    $scope.selectedPer = per;
                    $state.go(".perimeter");
                };


                $scope.makeDraggable = function () {
                    let options = {
                        containment: ".perimeter-canvas",
                        start: function (e) {
                            dragging = true;
                        },
                        stop: function (e, ui) {
                            dragging = false;
                            let id = $(e.target).data('id');
                            let per = $scope.parkingPerimeters.find((elm) => {
                                return elm.id === id
                            });
                            if (per) {
                                $scope.preSavePerimeter(per);
                            }

                            $scope.$apply();
                        }
                    };

                    $('.drag').draggable(options);
                    $('.perimeter').resizable(options);
                };

                $scope.initFactors = function () {
                    let canvas = $('.perimeter-canvas');
                    let img = canvas.find('img');
                    factorWidth = img.get(0).naturalWidth / canvas.width();
                    factorHeight = img.get(0).naturalHeight / canvas.height();
                };

                $('#scream').on('load', function () {
                    $scope.initFactors();
                    $scope.$apply();
                });


                $scope.top = function (per) {
                    return per.top_left_y / factorHeight + 'px';
                };

                $scope.left = function (per) {
                    return per.top_left_x / factorWidth + 'px';
                };


                $scope.width = function (per) {
                    return (per.bottom_right_x - per.top_left_x) / factorWidth + 'px';
                };

                $scope.height = function (per) {
                    return (per.bottom_right_y - per.top_left_y) / factorHeight + 'px';
                }
            }]);