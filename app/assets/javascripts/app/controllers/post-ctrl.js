/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl',
    ['$scope', '$rootScope', '$state', '$q', 'geocoderService', 'parameterService', '$stateParams', 'replaceById', 'parkingSpaceService',
    function ($scope, $rootScope, $state, $q, geocoderService, parameterService, $stateParams, replaceById, parkingSpaceService) {


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
                space.title = "Loc parcare " + sublocality;
                space.sublocality = sublocality;
                space.price = parameterService.getStartingAskingPrice();
                space.currency = parameterService.getStartingCurrency();
                space.daily_start = new Date(1970, 0, 1, 0, 0);
                space.daily_stop = new Date(1970, 0, 1, 23, 59);
                space.space_availability_start = new Date();
                space.space_availability_stop = moment().add(1,'d').toDate();

                $scope.$apply();
            });
        };

        if ($scope.spaceEdit && !$scope.spaceEdit.weekly_schedule)
            $scope.spaceEdit.weekly_schedule = {
                mon: true,
                tue: true,
                wed: true,
                thu: true,
                fri: true,
                sat: true,
                sun: true,
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
            let saveSpace = function () {
                parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
                    replaceById(savedSpace, $scope.spaces);
                    $scope.loading = false;
                    $state.go('home.search');
                });
            };

            let promises = [$scope.ctrl1.uploadPic($scope.file1),
                $scope.ctrl2.uploadPic($scope.file2),
                $scope.ctrl3.uploadPic($scope.file3)];

            $q.all(promises).then((resp) => {
                if (resp[0]) $scope.spaceEdit.file1 = resp[0].data.public_id;
                if (resp[1]) $scope.spaceEdit.file2 = resp[1].data.public_id;
                if (resp[2]) $scope.spaceEdit.file3 = resp[2].data.public_id;
                saveSpace();
            }, () => {
                // when error just close the window
                $scope.close()
            })

        };

        $scope.confirmSave = function () {

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

            let text = "Postezi locul pentru " + spaceEdit.price + " " + spaceEdit.currency + " /h ?\n\n";
            if (confirm(text)) {
                $scope.save();
            }
        };

        $scope.close = function () {
            $state.go('^');
        };

    }]);