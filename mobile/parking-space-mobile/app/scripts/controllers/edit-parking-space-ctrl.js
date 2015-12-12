/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl', function ($scope, $state, replaceById, parkingSpaceService, ENV) {

    var copiedSpaceEdit = false;

    $scope.$watch('spaceEdit', function (newVal) {
        if (!newVal) {
            return;
        }
        // make a copy of this variable when the reference changes
        // e.g. ajax loading or manually assigned in the parent
        if (!copiedSpaceEdit) {
            $scope.spaceEdit = angular.copy(newVal);
            copiedSpaceEdit = true
        }
    });

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

    var cameraSuccess = function (img) {
        $scope.spaceEdit.local_image_url = img;
        $scope.$apply();
    };

    var cameraError = function (img) {
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
        parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
            replaceById(savedSpace, $scope.spaces);
        });
        $state.go('^');
    };

    $scope.close = function () {
        $state.go('^');
    };

});