'use strict';

angular.module('ParkingSpaceMobile.controllers', [])

    .controller('MainCtrl', function ($scope, $document) {
        $scope.duration = 'Long Term';
        $scope.title = ' Parking Space';
        $scope.$on('changeSpaceDuration', function (e, data) {
            if (data) {
                $scope.duration = 'Short Term';
            } else {
                $scope.duration = 'Long Term';
            }
            if (!$scope.$$phase)
                $scope.$apply();
        });

        $scope.mapHeight = $($document).height() * 0.6;
        $scope.mapCtrlsHeight = $($document).height() * 0.4;

    })

    .controller('MapCtrl', function ($scope, $timeout, $rootScope, geolocationService, geocoderService) {

        $scope.mapCreated = function (map, overlay, geocoder) {

            $rootScope.map = map;
            $rootScope.overlay = overlay;
            $rootScope.geocoder = geocoder;
            $scope.marker = {};

            google.maps.event.addListener(map, 'zoom_changed', function () {
                var zoomLevel = map.getZoom();
                $scope.showPointer = false;
                var scale = 0.3;

                switch (zoomLevel) {
                    case 18 :
                        scale = 0.3;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 19 :
                        scale = 0.5;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 20 :
                        scale = 0.8;
                        break;
                    case 21 :
                        scale = 1;
                        break;
                    default:
                        scale = 0.3;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                }

                $scope.marker.markerStyle = {'transform': 'scale(' + scale + ')'};

                if (!$scope.$$phase)
                    $scope.$apply();

            });


            google.maps.event.addListener(map, 'dragend', function () {
                $scope.calculateAddress();
            });


            geolocationService.getCurrentLocation(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(pos);
                $scope.calculateAddress();
            });

            map.setZoom(19);
        };

        $scope.calculateAddress = function () {
            var mapCenter = $rootScope.map.getCenter();
            geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
                $rootScope.$broadcast('changeAddress', newAddr);
                if (!$scope.$$phase)
                    $scope.$apply();
            });

        };

    })

    .controller('PostParkingSpaceCtrl', function ($rootScope, $scope, $ionicModal, currencies) {
        $scope.currencies = currencies;

        if (!$scope.currentZoomLvl) {
            $scope.currentZoomLvl = 19;
        }

        if ($rootScope.map)
            $rootScope.map.setZoom($scope.currentZoomLvl);

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

        $scope.$on('changeAddress', function (e, data) {
            if (!$scope.space)
                $scope.space = { price: 5, currency: 'Eur'};

            var street = data.street || '';
            var street_number = data.street_number || '';
            var sublocality = data.sublocality ||
                data.administrative_area_level_2 ||
                data.administrative_area_level_1 || '';
            var city = data.city || '';

            $scope.space.address_line_1 = street + ', ' + street_number;
            $scope.space.address_line_2 = sublocality + ', ' + city;

            if (!$scope.space.title) {
                $scope.space.title = sublocality;
            }
        });

        $scope.$watch('space.short_term', function (newVal) {
            $rootScope.$broadcast('changeSpaceDuration', newVal);
        });

        $scope.showEdit = function () {
            $scope.spaceEdit = {};
            angular.copy($scope.space, $scope.spaceEdit);
            $scope.modal.show();
        };

        $scope.closeEdit = function () {
            $scope.modal.hide();
        };

        $scope.save = function () {
            $scope.space = $scope.spaceEdit;
            $scope.closeEdit();
        };

    })


    .controller('EditParkingSpaceCtrl', function ($scope) {

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
        };

        $scope.increase = function () {
            $scope.spaceEdit.price++;
        };

        $scope.$watch('spaceEdit.price', function (newVal, oldVal) {
            if (!$scope.spaceEdit) {
                return;
            }

            if (!newVal) {
                $scope.spaceEdit.price = 0;
            }

            if (newVal > 100) {
                $scope.spaceEdit.price = 100;
            }

            if (newVal < 0) {
                $scope.spaceEdit.price = 0;
            }
        });

        $scope.decrease = function () {
            $scope.spaceEdit.price--;
        };

    })


    .controller('SearchParkingSpaceCtrl', function ($rootScope, $scope, $ionicModal, parkingSpaceService, modalFactory) {

        if (!$scope.currentZoomLvl) {
            $scope.currentZoomLvl = 15;
        }

        $rootScope.map.setZoom($scope.currentZoomLvl);

        $scope.circleOptions = {
            strokeColor: '#111',
            strokeWeight: 0.5,
            fillColor: '#333',
            fillOpacity: 0.1,
            map: $rootScope.map,
            radius: 500
        };

        $scope.$watch('circleOptions.radius', function (newVal) {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                searchRadiusCircle.setRadius(newVal);
            }
        });

        var dragListen = google.maps.event.addListener($rootScope.map, 'idle', function () {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap(null);

            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
        });

        if (!$scope.searchRadiusCircle) {
            // user navigates on screen for first time
            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
        }

        $rootScope.$on('$stateChangeSuccess', function (ev, toState) {
            if (toState.name != 'home.map.search') {
                if ($scope.searchRadiusCircle) {
                    $scope.searchRadiusCircle.setMap();
                }

                if ($scope.markers) {
                    $scope.markers.forEach(function (d) {
                        d.setMap();//clear marker
                    });
                }

                google.maps.event.removeListener(dragListen);
            }
        });

        google.maps.event.addListener($rootScope.map, 'idle', function () {
            var latLng = $rootScope.map.getCenter();
            parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), function (spaces) {
                $scope.spaces = spaces;
            });
        });

        $scope.$watchCollection('spaces', function (newVal) {
            if (!newVal)
                return;

            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap();//clear marker
                });
            }

            $scope.markers = [];
            newVal.forEach(function (space) {
                var image = {
                    url: space.short_term ? 'images/marker_orange.png' : 'images/marker_blue.png',
                    scaledSize: new google.maps.Size(53, 53)
                };

                var price = space.price + "";
                var x = price.length == 1 ? 8 : 15;
                $scope.markers.push(new MarkerWithLabel({
                    position: new google.maps.LatLng(space.position.lat, space.position.lng),
                    map: $rootScope.map,
                    icon: image,
                    labelContent: space.price + ' Ron',
                    labelAnchor: new google.maps.Point(x, 44),
                    labelClass: "search-marker-label"
                }));
            })
        });

        $scope.increaseRadius = function () {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                var prevRad = searchRadiusCircle.getRadius();
                if (prevRad <= 950) {
                    $scope.circleOptions.radius = prevRad + 50;
                }

            }
        };

        $scope.decreaseRadius = function () {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                var prevRad = searchRadiusCircle.getRadius();
                if (prevRad >= 100)
                    $scope.circleOptions.radius = prevRad - 50;
            }
        };

        parkingSpaceService.getAvailableSpaces(45.0, 27.0, function (spaces) {
            $scope.spaces = spaces;
        });

        var showBid = function (args) {
            $scope.selectedSpace = args[0];
            // draw marker at specified position and rotate accordingly
            var selectedSpace = $scope.selectedSpace;
            var latLng = new google.maps.LatLng(selectedSpace.position.lat, selectedSpace.position.lng);
            $scope.thumbnailMap.setCenter(latLng);

            var pictureLabel = $("<img>");
            pictureLabel.attr('src','images/parking_spot_circle.png');
            pictureLabel.attr('height',75);
            pictureLabel.attr('width',75);

            if ($scope.spotThumbnail) {
                $scope.spotThumbnail.setMap();
            }


            $scope.spotThumbnail = new MarkerWithLabel({
                position: latLng,
                icon: {path: ''},
                map: $scope.thumbnailMap,
                labelContent: pictureLabel[0],
                labelAnchor: new google.maps.Point(32, 32),
                labelStyle:{transform : 'rotate('+ selectedSpace.rotation+'deg)'}
            });

        };

        modalFactory.createModal('bid-for-space.html', $scope,null, null, showBid);

        var showThumbnail = function (args) {
            $scope.selectedSpace = args[0];
        }

        modalFactory.createModal('space-image.html', $scope,'spaceImgModal', null, showThumbnail);

        $scope.thumbnailMapCreated = function (map, overlay) {
            map.setOptions({
                zoom: 18,
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false
            });
            $scope.thumbnailMap = map;
        };

        $scope.increase = function () {
            $scope.bidAmount++;
        };

        $scope.$watch('bidAmount', function (newVal, oldVal) {
            if (!$scope.bidAmount) {
                return;
            }

            if (!newVal) {
                $scope.bidAmount = 0;
            }

            if (newVal > 100) {
                $scope.bidAmount = 100;
            }

            if (newVal < 0) {
                $scope.bidAmount = 0;
            }
        });

        $scope.decrease = function () {
            $scope.bidAmount--;
        };

    });