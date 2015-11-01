/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl', function ($scope, $state, imageResizeFactory, replaceById, parkingSpaceService) {

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


    $scope.takePhoto = function () {
        var cameraSuccess = function (img) {
            $scope.spaceEdit.image_data = img;
            $scope.spaceEdit.thumbnail_data = imageResizeFactory(img);
            $scope.spaceEdit.image_file_name = img.substr(img.lastIndexOf("/") + 1);
            $scope.spaceEdit.image_content_type = 'image/jpeg';
            $scope.$apply();
        };

        var cameraError = function (img) {
            console.log('error while taking :', img);
        };

        navigator.camera.getPicture(cameraSuccess, cameraError, {
            quality: 80,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 480,
            targetHeight: 640
        });
    };

    $scope.attachPhoto = function () {
        var cameraSuccess = function (img) {
            $scope.spaceEdit.image_data = img;
            $scope.spaceEdit.thumbnail_data = imageResizeFactory(img);
            $scope.spaceEdit.image_file_name = img.substr(img.lastIndexOf("/") + 1);
            $scope.spaceEdit.image_content_type = 'image/jpeg';
            $scope.$apply();
        };

        var cameraError = function (img) {
            console.log('error while taking :', img);
        };

        navigator.camera.getPicture(cameraSuccess, cameraError, {
            quality: 50,
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