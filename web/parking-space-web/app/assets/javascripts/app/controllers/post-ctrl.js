/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl',
    function ($scope, $rootScope, $state, geocoderService, parameterService, $stateParams, replaceById, parkingSpaceService, ENV) {


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
                space.title = sublocality;
                space.sublocality = sublocality;
                space.price = parameterService.getStartingAskingPrice();
                space.currency = parameterService.getStartingCurrency();

                $scope.$apply();
            });
        };

        $scope.calculateAddress();

        if ($stateParams.parking_space_id) {
            parkingSpaceService.getSpace($stateParams.parking_space_id, function (data) {
                $scope.spaceEdit = data;
            });
        }

        $scope.imageUrl = function (spaceEdit) {
            if (!spaceEdit) {
                return '#';
            }

            if (spaceEdit.local_image_url) {
                return spaceEdit.local_image_url;
            }

            if (spaceEdit.thumbnail_url) {
                return ENV + spaceEdit.thumbnail_url;
            }

            if (spaceEdit.image_url) {
                return ENV + spaceEdit.image_url;
            }

        };

        let cameraSuccess = function (img) {
            $scope.spaceEdit.local_image_url = img;
            $scope.$apply();
        };

        let cameraError = function (img) {
            console.log('error while taking :', img);
        };


        $scope.takePhoto = function () {

            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 80,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG
            });
        };

        $scope.attachPhoto = function () {
            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 80,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        };


        $scope.save = function () {
            setTimeout(function () {
                $("#saveSpinner").show();
            }, 1000);
            parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
                replaceById(savedSpace, $scope.spaces);
                $("#saveSpinner").hide();
                $state.go('home.map.search');
            });
        };

        $scope.confirmSave = function () {
            let spaceEdit = $scope.spaceEdit;
            if (!spaceEdit.title) {
                alert("Introdu un titlu pentru loc");
                return;
            }

            if (spaceEdit.space_availability_start > spaceEdit.space_availability_stop) {
                alert("Data de stop nu poate fi inaintea celei de start!");
                return;
            }

            let text = "Postezi locul " + spaceEdit.price + " " + spaceEdit.currency + "?\n\n";
            if (confirm(text)) {
                $scope.save();
            }
        };

        $scope.close = function () {
            $state.go('^');
        };

    })
;