angular.module('ParkingSpaceAdmin.controllers')
    .controller('SensorCtrl', ['$scope', '$state', 'sectionService', '$rootScope', '$q',
        function ($scope, $state, sectionService, $rootScope, $q) {

            $scope.initMap = function (perim) {
                let modal = $('#perimeterModal-' + perim.id);
                modal.slideToggle(function () {
                    if (modal.data('map')) {
                        return;
                    }
                    modal.data('map', true);
                    let lat = 44.412;
                    let lng = 26.113;
                    if (perim.lat) lat = perim.lat;
                    if (perim.lng) lng = perim.lng;
                    console.log(lat, lng);

                    let mapOptions = {
                        center: new google.maps.LatLng(lat, lng),
                        zoom: 14,
                        minZoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        rotateControl: false,
                        disableDefaultUI: true,
                    };


                    let map = new google.maps.Map($('#perimeterMap-' + perim.id)[0], mapOptions);
                    let marker = new google.maps.Marker({
                        draggable: true,
                        map: map,
                        position: new google.maps.LatLng(lat, lng)

                    });


                    google.maps.event.addListener(marker, 'dragend', function (event) {
                        let pos = this.position;
                        let loc = perim;
                        if (loc) {
                            loc.lat = pos.lat();
                            loc.lng = pos.lng();
                            $scope.$apply();
                        }
                    });
                });
            };


            if ($state.params.sensorId && $state.params.sensorId > 0) {
                sectionService.getPerimeters($state.params.sensorId).then((data) => {
                    $scope.sensor = data;
                    $scope.perimeters = data.perimeters;
                })
            } else {

            }

            let tempId = -1;

            $scope.newPerimeter = function () {
                $scope.perimeters.push({
                    id: tempId--,
                    topLeftX: 30,
                    description: "No desc. ",
                    topLeftY: 80,
                    bottomRightX: 190,
                    bottomRightY: 180,
                    perimeter_type: 'parking_space'
                })
            };


            function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
                /* the parameters: - the image element
                 - the new width
                 - the new height
                 - the x point we start taking pixels
                 - the y point we start taking pixels
                 - the ratio */
                //set up canvas for thumbnail
                let tnCanvas = document.createElement('canvas');
                let tnCanvasContext = tnCanvas.getContext('2d');
                tnCanvas.width = newWidth;
                tnCanvas.height = newHeight;

                /* use the sourceCanvas to duplicate the entire image. */
                let bufferCanvas = document.createElement('canvas');
                let bufferContext = bufferCanvas.getContext('2d');
                bufferCanvas.width = imgObj.naturalWidth;
                bufferCanvas.height = imgObj.naturalHeight;
                bufferContext.drawImage(imgObj, 0, 0);

                /* now we use the drawImage method to take the pixels from our
                bufferCanvas and draw them into our thumbnail canvas */
                tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth, newHeight, 0, 0, newWidth, newHeight);
                return tnCanvas.toDataURL();
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
                let imgObj = $('#scream').get(0);
                $('#snap-' + per.id).get(0).src = getImagePortion(imgObj,
                    w * factorWidth,
                    h * factorHeight,
                    left * factorWidth,
                    top * factorWidth);

            };

            $scope.delete = function (item) {
                let idx = $scope.perimeters.indexOf(item);
                $scope.perimeters.splice(idx, 1);
            };

            $scope.savePerimeters = function () {
                if (!$scope.perForm.$valid) {
                    $('#perForm').addClass('was-validated');
                    return;
                }

                if (!$state.params.sensorId) {
                    alert("No sensor found in url param.");
                    return;
                }

                $scope.loading = true;
                let perimToSave = angular.copy($scope.perimeters);
                perimToSave.push($scope.samplePerimeter);

                sectionService.savePerimeters($state.params.sensorId, perimToSave, (data) => {
                    $state.go('^', {}, {reload: true});
                });

            };

            $scope.saveSensor = function () {
                if (!$scope.sensor) {
                    return;
                }

                sectionService.saveSensor($scope.sensor, () => {
                    $state.go('^', {}, {reload: true});
                })
            };

            $('#fileElem').fileupload({
                url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/image/upload/',
                dataType: 'json',
                imageOrientation: true,
                add: function (e, data) {

                    data.formData = {
                        upload_preset: window.cloudinaryPreset,
                        folder: 'perimeters/' + $scope.sensor.id + '/' + moment().format('DDMMYYYY-HHm'),
                    };


                    let bl = data.files[0];
                    if (bl.thershold && bl.correlation_value) {
                        data.formData.context = 'threshold=' + bl.thershold +
                            "|correlation=" + bl.correlation_value +
                            "|status=" + bl.status;
                    }

                    console.log('added ', data);
                }

            });

            let _this = this;

            $scope.downloadSnaphots = function () {
                $scope.sendCommand('download-snapshots', $scope.sensor, {});
            };


            $scope.takeSnapshot = function () {
                $scope.sendCommand('snapshot', $scope.sensor, {});
            };


            $scope.evaluate = function () {
                $scope.takingSnapshot = true;
                $scope.sendCommand('evaluate', $scope.sensor, {
                    perimeters: $scope.perimeters,
                    sample_perimeter: $scope.samplePerimeter
                });
            };


            $scope.uploadModule = function (isFile) {

                let fileName = $scope.file.files[0].name;
                $scope.file.submit().then((response) => {
                    let payload = {
                        module_url: response.secure_url,
                        file_name: fileName
                    };
                    payload.as_file = !!isFile;

                }, (err) => {
                    let errTxt = err.responseJSON.error.message;
                    $rootScope.$emit('http.error', errTxt);
                    $scope.$apply();
                });
            };

            $scope.sendCommand = function (command, sensor, payload) {
                $scope.connecting = true;
                _this.channel.trigger("client-helo-" + sensor.id, JSON.stringify({helo: 'helo'}));

            };


            $('#uploadModule').fileupload({
                url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/raw/upload',
                dropZone: $('#uploadContainer'),
                formData: {upload_preset: window.cloudinaryPreset, resource_type: 'raw', folder: 'modules'},
                add: function (e, data) {
                    $('#uploadModule').next().text(data.files[0].name);
                    $scope.file = data;
                },
                progress: function (e, data) {
                    let progress = parseInt(data.loaded / data.total * 100, 10);
                    $("#progressBar").css('width', progress + '%');
                },
                fail: function (e, data) {
                    console.log('upload failed ', e, data);
                }
            });
        }
    ])
;