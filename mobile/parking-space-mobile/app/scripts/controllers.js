'use strict';

angular.module('ParkingSpaceMobile.controllers', [])
    .controller('MapCtrl', function ($scope, $timeout, $rootScope, $ionicLoading, $state) {

        $scope.mapCreated = function (map, overlay) {
            $rootScope.map = map;
            $rootScope.overlay = overlay;

            google.maps.event.addListener(map, 'zoom_changed', function () {
                var zoomLevel = map.getZoom();
                $scope.mapZoomLevel = zoomLevel;
                $scope.showPointer = false;

                switch (zoomLevel) {
                    case 18 :
                        $scope.markerStyle = {'transform': 'scale(.3)'};
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 19 :
                        $scope.markerStyle = {'transform': 'scale(.5)'};
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 20 :
                        $scope.markerStyle = {'transform': 'scale(.8)'};
                        break;
                    case 21 :
                        $scope.markerStyle = {'transform': 'scale(1)'};
                        break;
                    default:
                        $scope.markerStyle = {'transform': 'scale(.2)'};
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                }

                if (!$scope.$$phase)
                    $scope.$apply();

            });

            google.maps.event.addListener(map, 'dragend', function () {
                $scope.calculateLatLngOfMarker();
            });

            $timeout(function () {
                google.maps.event.trigger($rootScope.map, 'resize');
            }, 500);

            map.setZoom(19);
        };


        $scope.calculateLatLngOfMarker = function () {
            var point = new google.maps.Point(
                    $scope.markerX + ($scope.markerWidth / 2),
                    $scope.markerY + ($scope.markerHeight)
            );
            $rootScope.position = $rootScope.overlay.getProjection().fromContainerPixelToLatLng(point);
            $scope.$apply();
        };


    })

    .controller('PostParkingSpaceCtrl', function ($scope, $rootScope, $ionicModal) {

        $ionicModal.fromTemplateUrl('edit-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.space = {
            address: 'Calea Vacaresti nr 232',
            title: 'Open spot',
            price: 99,
            description: ' Lorem ipsum text describing the open spot',
            currency: 'USD'
           // img: 'images/meeting.jpg'
        };

        $scope.showEdit = function () {
            $scope.spaceEdit = {};
            angular.copy($scope.space, $scope.spaceEdit);
            $scope.modal.show();
        };

        $scope.closeEdit = function () {
            $scope.modal.hide();
        };

        $scope.save = function() {
            $scope.space = $scope.spaceEdit;
            $scope.closeEdit();
        };

    })


    .controller('EditParkingSpaceCtrl', function ($scope, $rootScope) {


        $scope.takePhoto = function () {

            var cameraSuccess = function (img) {
                $scope.spaceEdit.img = img;
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
                console.log('just took image :', img);
                $scope.spaceEdit.img = img;
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
        }

    });

