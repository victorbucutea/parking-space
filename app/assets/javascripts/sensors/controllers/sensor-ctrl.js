angular.module('ParkingSpaceSensors.controllers')
    .controller('SensorCtrl', ['$scope', '$state', 'sensorService', '$rootScope', '$q',
        function ($scope, $state, sensorService, $rootScope, $q) {

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
                let options = {
                    containment: ".perimeter-canvas",
                    stop: function (e, ui) {
                        let id = $(e.target).data('id');
                        let per = $scope.perimeters.find((elm) => {
                            return elm.id === id
                        });
                        if (!per && $scope.samplePerimeter.id === id) {
                            per = $scope.samplePerimeter;
                        }
                        if (per)
                            $scope.preSavePerimeter(per);
                        $scope.$apply();
                    }
                };

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
                    $scope.perimeters = data.perimeters;
                    $scope.perimeters.forEach(initPositions);
                    $scope.samplePerimeter = data.sample_perimeter; //there should be only one
                    initPositions($scope.samplePerimeter);
                })
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

            $scope.newSamplePerimeter = function () {
                $scope.samplePerimeter = {
                    id: tempId--,
                    topLeftX: 60,
                    description: "No desc. ",
                    topLeftY: 120,
                    bottomRightX: 210,
                    bottomRightY: 190,
                    perimeter_type: 'sample_space'
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

            $scope.isOccupied = function (perimeter) {

                if (perimeter.corrVal == null)
                    return '';

                let isOcc = perimeter.correlation_threshold >= perimeter.corrVal;

                return isOcc ? 'occupied' : 'free';

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

            let imgToBlob = function (img) {

                // Create an empty canvas element
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                // Copy the image contents to the canvas
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                // Get the data-URL formatted image
                // Firefox supports PNG and JPEG. You could check img.src to
                // guess the original format, but be aware the using "image/jpg"
                // will re-encode the image.
                var dataURI = canvas.toDataURL("image/png");

                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type: mimeString});
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
                    $scope.blobs.push(data);
                }

            });

            $scope.saveSnapshots = function () {
                $scope.blobs = [];
                let files = [];

                function addtoUploadQueue(per) {
                    let blob = imgToBlob($('#snap-' + per.id)[0]);
                    blob.thershold = per.correlation_threshold;
                    blob.correlation_value = per.corrVal;
                    blob.status = per.correlation_threshold > per.corrVal ? 'true' : 'false';
                    files.push(blob);
                }

                // add perimeters
                $scope.perimeters.forEach((per) => {
                    addtoUploadQueue(per)
                });
                // add sample
                addtoUploadQueue($scope.samplePerimeter);

                // add master image
                let blob = imgToBlob($('#scream')[0]);
                files.push(blob);

                $('#fileElem').fileupload('add', {files: files});
                $scope.status = 'Uploading ...';
                $scope.connecting = true;
                let promises = [];
                $scope.blobs.forEach((b) => {
                    promises.push(b.submit());
                });

                $q.all(promises).then(() => {
                    $scope.status = 'Snapshot and perimiters uploaded';
                    $scope.connecting = false;
                })
            };


            $scope.status = 'Not connected.';


            let _this = this;

            function bindToCommands() {
                let sensor = $scope.sensor;
                _this.pusher = new Pusher('18d2d3638538f3cc4064', {
                    cluster: 'eu',
                    forceTLS: true,
                    authEndpoint: '/sensor_auth/authenticate.json'
                });
                _this.channel = _this.pusher.subscribe('private-sensor-channel');

                _this.pusher.bind_global(function (data, payload) {
                    console.log('event', data, payload);
                    if (payload.err) {
                        let msg = payload.err.message ? payload.err.message : payload.err;
                        $rootScope.$emit('http.error', 'Eroare la conectarea cu agentul:' + msg);
                        $scope.$apply();
                    }
                });

                _this.channel.bind('pusher:error', function () {
                    $rootScope.$emit('http.error', 'Eroare la conectarea cu agentul:' + err.message);
                });

                _this.channel.bind('client-snapshot-' + sensor.id, function (data) {
                    $scope.status = 'Snapshot taken';
                    $scope.snapshotUrl = data.url;
                    $scope.connecting = false;
                    $scope.sensor.snapshot = data.public_id;
                    $scope.$apply();
                });

                _this.channel.bind('client-get-logs-' + sensor.id, function (data) {
                    $scope.status = 'Logs fetched';
                    $scope.connecting = false;
                    $scope.sensor_log = data.sensor_log;
                    $scope.deploy_log = data.deploy_log;
                    $scope.$apply();
                });

                _this.channel.bind('client-restart-' + sensor.id, function (data) {
                    $scope.status = 'Module successfully restarted. ';
                    $scope.connecting = false;

                    $scope.$apply();

                });

                _this.channel.bind('client-update-module-' + sensor.id, function (data) {
                    $scope.status = 'Module successfully updated. ';
                    $scope.connecting = false;
                    $scope.$apply();
                });

                _this.channel.bind('client-evaluate-' + sensor.id, function (data) {
                    $scope.status = 'Evaluate finished.';
                    $scope.connecting = false;
                    $scope.perimeters.forEach((per) => {
                        if (typeof (data[per.id]) != "undefined") {
                            per.corrVal = data[per.id];
                        }
                    });
                    $scope.$apply();
                });

                _this.channel.bind('client-perimeter-img-' + sensor.id, function (data) {
                    $scope.status = 'Evaluate finished.';
                    $scope.connecting = false;
                    $scope.perimeters.forEach((per) => {
                        if (typeof (data[per.id]) != "undefined") {
                            per.corrVal = data[per.id];
                        }
                    });
                    $scope.$apply();
                });

                _this.channel.bind('client-download-snapshots-' + sensor.id, function (data) {
                    $scope.status = 'Beggining download of snapshots';
                    $scope.connecting = false;
                    window.location = data.url;
                    $scope.$apply();
                });

                _this.channel.bind('client-helo-' + sensor.id, function (data) {
                    if (_this.onHello) _this.onHello(data);
                });
            }

            $scope.$watch('sensor', (newVal) => {
                if (newVal) {
                    bindToCommands();
                }
            });

            $scope.downloadSnaphots = function () {
                $scope.sendCommand('download-snapshots', $scope.sensor, {});
            };


            $scope.takeSnapshot = function () {
                $scope.sendCommand('snapshot', $scope.sensor, {});
            };


            $scope.evaluate = function () {
                $scope.takingSnapshot = true;
                if ($scope.perimeters) {
                    $scope.perimeters.forEach((per) => {
                        $scope.preSavePerimeter(per)
                    });
                }

                if ($scope.samplePerimeter) {
                    $scope.preSavePerimeter($scope.samplePerimeter)

                }
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

                    $scope.sendCommand('update-module', $scope.sensor, payload);
                }, (err) => {
                    let errTxt = err.responseJSON.error.message;
                    $rootScope.$emit('http.error', errTxt);
                    $scope.$apply();
                });
            }
            ;

            $scope.restartModule = function (mod) {
                $scope.sendCommand('restart-module', $scope.sensor, {module_name: mod});
            };

            $scope.getLogs = function () {
                $scope.sendCommand('get-logs', $scope.sensor, {no_of_lines: $scope.no_of_lines});

            };

            $scope.sendCommand = function (command, sensor, payload) {
                $scope.status = 'Sending command (wait until next heartbeat for sensor to connect)';
                $scope.connecting = true;
                sensorService.activateHook($scope.sensor, () => {
                    _this.onHello = function () {
                        _this.channel.trigger('client-' + command + '-' + sensor.id, JSON.stringify(payload));
                        $scope.status = 'Command sent, waiting for reply';
                        _this.onHello = null;
                    };
                    _this.channel.trigger("client-helo-" + sensor.id, JSON.stringify({helo: 'helo'}));
                });
                setTimeout(() => {
                    if ($scope.connecting) {
                        $scope.connecting = false;
                        $scope.status = 'Agent did not answer.';
                        $scope.$apply();
                    }
                }, 40000);
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


            $scope.snapshotUrl = function () {
                let data = $scope.sensor;
                if (!$scope.sensor) return '';
                else
                    return 'https://res.cloudinary.com/' + window.cloudinaryName + '/image/upload/' + data.snapshot;

            };

            $scope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name.indexOf('sensor.sensor-fleet') === -1) {
                    if (_this.channel != null) {
                        _this.channel.unbind();
                        _this.channel.disconnect();
                    }
                    if (_this.pusher != null) _this.pusher.disconnect();
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
        }
    ])
;