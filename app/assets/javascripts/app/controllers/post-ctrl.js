/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl', function ($scope, $state, $stateParams, replaceById, parkingSpaceService, ENV) {


    if ( $stateParams.parking_space_id ) {
        parkingSpaceService.getSpace($stateParams.parking_space_id, function(data){
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
        setTimeout(function() {
           $("#saveSpinner").show();
        },1000);
        parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
            replaceById(savedSpace, $scope.spaces);
            $("#saveSpinner").hide();
            $state.go('home.map.search');
        });
    };

    $scope.confirmSave = function() {
        var spaceEdit = $scope.spaceEdit;
        if ( !spaceEdit.title ) {
            alert("Please fill in the title!");
            return;
        }

        if ( spaceEdit.space_availability_start.getTime() > spaceEdit.space_availability_stop.getTime() ) {
            alert("Start date should be lower than stop date");
            return;
        }

        var text = "Are you sure you want to place this space for "+ spaceEdit.price + " " +spaceEdit.currency + "?\n\n";
        if (confirm(text)){
            $scope.save();
        }
    };

    $scope.close = function () {
        $state.go('^');
    };

});