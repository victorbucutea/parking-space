/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl',
    function ($scope, $rootScope, $state, geocoderService, parameterService, $stateParams, replaceById, parkingSpaceService, $timeout) {


        $scope.calculateAddress = function () {
            let mapCenter = $rootScope.map.getCenter();

            let space = $scope.spaceEdit;

            geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
                let street = newAddr.street || '';
                let street_number = newAddr.street_number || '';
                let sublocality = newAddr.sublocality ||
                    newAddr.administrative_area_level_2 ||
                    newAddr.administrative_area_level_1 || '';
                let city = newAddr.city || '';

                space.address_line_1 = street + ', ' + street_number;
                space.address_line_2 = sublocality + ', ' + city;
                space.location_lat = mapCenter.lat();
                space.location_long = mapCenter.lng();
                space.title = "Spațiu nou în " + sublocality;
                space.sublocality = sublocality;
                space.price = parameterService.getStartingAskingPrice();
                space.currency = parameterService.getStartingCurrency();

                $scope.$apply();
            });
        };

        $scope.ctrl = {};

        if ($scope.spaceEdit && !$scope.spaceEdit.weeklySched)
            $scope.spaceEdit.weeklySched = {
                mon: true,
                tue: true,
                wed: true,
                thu: true,
                fri: true,
                sat: false,
                sun: false,
            };

        if ($stateParams.parking_space_id) {
            parkingSpaceService.getSpace($stateParams.parking_space_id, function (data) {
                $scope.spaceEdit = data;
            });
        } else {
            $scope.calculateAddress();
        }

        $scope.showSched = function () {
            $('#schedule').slideToggle(200);
            $scope.scheduleOpen = !$scope.scheduleOpen;
        };


        $scope.save = function () {
            $scope.loading = true;
            let saveInfo = function () {
                parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
                    replaceById(savedSpace, $scope.spaces);
                    $scope.loading = false;
                    $state.go('home.map.search');
                });
            };

            if ($scope.file1) {
                $scope.ctrl.uploadPic($scope.file1,
                    (response) => {
                        $scope.spaceEdit.file1 = response.data.public_id;
                        if ($scope.file2) {
                            $scope.ctrl.uploadPic($scope.file2,
                                (response2) => {
                                    $scope.spaceEdit.file2 = response2.data.public_id;
                                    if ($scope.file3) {
                                        $scope.ctrl.uploadPic($scope.file2,
                                            (response3) => {
                                                $scope.spaceEdit.file3 = response3.data.public_id
                                                saveInfo();
                                            })
                                    } else {
                                        saveInfo();
                                    }

                                })
                        } else {
                            saveInfo();
                        }
                    });
            } else {
                saveInfo();
            }

        };

        function removeSchedule() {
            if (!$scope.scheduleOpen) {
                $scope.spaceEdit.weeklySched = undefined;
                $scope.spaceEdit.dailyStart = undefined;
                $scope.spaceEdit.dailyStop = undefined;
            }
        }

        $scope.confirmSave = function () {

            removeSchedule();

            if (!$scope.postSpaceForm.$valid) {
                $('#postSpaceForm').addClass('was-validated');
                return;
            }

            let spaceEdit = $scope.spaceEdit;
            if (!spaceEdit.title) {
                alert("Introdu un titlu pentru acest loc.");
                return;
            }

            if (spaceEdit.space_availability_start > spaceEdit.space_availability_stop) {
                alert("Data de stop nu poate fi inaintea celei de start!");
                return;
            }

            let text = "Postezi locul pentru " + spaceEdit.price + " " + spaceEdit.currency + "?\n\n";
            if (confirm(text)) {
                $scope.save();
            }
        };

        $scope.close = function () {
            $state.go('^');
        };

    })
;