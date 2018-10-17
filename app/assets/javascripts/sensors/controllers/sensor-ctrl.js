angular.module('ParkingSpaceSensors.controllers')
    .controller('SensorCtrl', ['$scope', '$state', 'sensorService', '$rootScope',
        function ($scope, $state, sensorService, $rootScope) {

            let factorWidth = 1;
            let factorHeight = 1;


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


            $scope.makeDraggable = function () {
                let options = {containment: ".perimeter-canvas", scroll: false};
                $('.drag').draggable(options);
                $('.perimeter').resizable(options);
            };

            let initPositions = function (per) {
                if (!per) return;
                per.topLeftX = per.top_left_x;
                per.topLeftY = per.top_left_y;
                per.bottomRightX = per.bottom_right_x;
                per.bottomRightY = per.bottom_right_y;
            };

            if ($state.params.sensorId) {
                sensorService.getPerimeters($state.params.sensorId, (data) => {
                    $scope.sensor = data;
                    $scope.snapshotUrl = 'https://res.cloudinary.com/' + window.cloudinaryName + '/image/upload/' + data.snapshot;
                    $scope.perimeters = data.perimeters;
                    $scope.perimeters.forEach(initPositions);
                    $scope.samplePerimeter = data.sample_perimeter; //there should be only one
                    initPositions($scope.samplePerimeter);
                })
            }

            let tempId = 0;

            $scope.newPerimeter = function () {
                $scope.perimeters.push({
                    id: tempId++,
                    topLeftX: 30,
                    description: "No desc. ",
                    topLeftY: 80,
                    bottomRightX: 190,
                    bottomRightY: 180,
                })
            };

            $scope.newSamplePerimeter = function () {
                $scope.samplePerimeter = {
                    id: tempId++,
                    topLeftX: 60,
                    description: "No desc. ",
                    topLeftY: 120,
                    bottomRightX: 210,
                    bottomRightY: 190,
                };
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

            $scope.preSavePerimeter = function (per, type) {
                let square = $('.per-drag-' + per.id);
                let w = square.width();
                let h = square.height();
                let top = parseInt(square.css('top'));
                let left = parseInt(square.css('left'));
                per.top_left_x = left * factorWidth;
                per.top_left_y = top * factorHeight;
                per.bottom_right_x = (left + w) * factorWidth;
                per.bottom_right_y = (top + h) * factorHeight;
                per.perimeter_type = type;
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

                if (!$scope.samplePerimeter || !$scope.samplePerimeter.top_left_x) {
                    alert("Please choose a sample perimeter");
                    return;
                }

                if (!$state.params.sensorId) {
                    alert("No sensor found in url param.");
                    return;
                }

                $scope.loading = true;
                let perimToSave = angular.copy($scope.perimeters);
                perimToSave.push($scope.samplePerimeter);

                sensorService.savePerimeters($state.params.sensorId, perimToSave, (data) => {
                    console.log(data);
                    $state.go('^', {}, {reload: true});
                });

            };

            $scope.saveSensor = function () {
                if (!$scope.sensor) {
                    return;
                }

                sensorService.saveSensor($scope.sensor, () => {
                    $state.go('^', {}, {reload: true});
                })
            };

            $scope.status = 'Not connected.';

            $scope.takeSnapshot = function () {
                $scope.takingSnapshot = true;
                sensorService.takeSnapshot($scope.sensor, (data) => {
                    $scope.snapshotUrl = data.url;
                    $scope.takingSnapshot = false;
                    $scope.$apply();
                }, () => {
                    $scope.takingSnapshot = false;
                    $scope.$apply();
                })
            };


            $scope.connectToSensor = function () {
                $scope.connecting = true;
                $scope.status = 'Connecting to server ( wait until next heartbeat for sensor to connect )';
                sensorService.activateHook($scope.sensor, () => {
                    sensorService.connectToSensor($scope.sensor,
                        (msg) => {
                            // The server will send a helo and agent will send an ehlo message
                            // 1. on Connection of agent
                            // 2. on request from js client ( subscription to channel successful )
                            if (msg.ehlo) {
                                $scope.status = 'Connected';
                                $scope.connecting = false;
                                $scope.connected = true;
                                $scope.$apply();
                            }
                            $scope.$apply();
                        });
                }, (err) => {
                    $scope.status = 'Error connecting to server';
                    $scope.connecting = false;
                    $scope.connected = false;
                    $scope.$apply();
                })
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

            $scope.uploadModule = function () {
                let fileName = $scope.file.files[0].name;
                $scope.file.submit().then((response) => {
                    response.fileName = fileName;
                    sensorService.updateModule($scope.sensor, response, (okResp) => {
                        $rootScope.$emit('http.notif', 'Module successfully installed. ');
                        $scope.$apply();
                    }, (errResp) => {
                        $scope.$apply();
                    });
                }, (err) => {
                    let errTxt = err.responseJSON.error.message;
                    $rootScope.$emit('http.error', errTxt);
                    $scope.$apply();
                });
            };

            $scope.getLogs = function(){
                sensorService.getSensorLogs($scope.sensor ,$scope.no_of_lines, (data) => {
                    $scope.sensor_log = data.sensor_log;
                    $scope.deploy_log = data.deploy_log;
                    $scope.$apply();
                })
            };

            $scope.disconnect = function () {
                sensorService.deActivateHook($scope.sensor, () => {
                    sensorService.disconnectSensor($scope.sensor);
                    $scope.status = 'Disconnected';
                    $scope.connecting = false;
                    $scope.connected = false;
                });
            };

            $scope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name.indexOf('sensor.sensor-fleet') === -1) {
                    $scope.disconnect();
                    $scope.connecting = false;
                    $scope.connected = false;
                }
            });


            $scope.top = function (per) {
                return per.topLeftY / factorHeight + 'px';
            };

            $scope.left = function (per) {
                return per.topLeftX / factorWidth + 'px';
            };


            $scope.width = function (per) {
                return (per.bottomRightX - per.topLeftX) / factorWidth + 'px';
            };

            $scope.height = function (per) {
                return (per.bottomRightY - per.topLeftY) / factorHeight + 'px';
            }
        }]);