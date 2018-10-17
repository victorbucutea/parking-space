angular.module('ParkingSpaceSensors.services')

    .service('sensorService',
        ['$rootScope', '$http', 'errorHandlingService',
            function ($rootScope, $http, errorHandlingService) {

                let _this = this;

                _this.saveLocation = function (location, clbk) {
                    // massage space a to fit the back end model

                    let locationObj = {sensor_location: location};

                    let url = location.id ? '/sensor_locations/' + location.id + '.json' : '/sensor_locations.json';
                    let restCall = location.id ? $http.put(url, locationObj) : $http.post(url, locationObj);

                    return restCall.then(function (response) {
                        $rootScope.$emit('http.notif', 'Locatia a fost salvata!');

                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (error) {
                        errorHandlingService.handle(error.data, error.status);
                    })
                };

                _this.deleteLocation = function (locationId, clbk) {
                    return $http.delete('/sensor_locations/' + locationId + '.json').then((response) => {
                        $rootScope.$emit('http.warning', 'Locatia a fost stearsa!');

                        if (clbk) {
                            clbk(response.data);
                        }
                    })
                };

                _this.getLocations = function (clbk) {
                    return $http.get('/sensor_locations.json').then((response) => {
                        if (clbk) {
                            clbk(response.data);
                        }
                    })
                };

                _this.getAssignedSensors = function (location_id, clbk) {
                    $http.get('/sensors/assigned.json', {
                        params: {location_id: location_id}
                    }).then((response) => {
                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (error) {
                        errorHandlingService.handle(error.data, error.status);
                    })
                };

                _this.getSensors = function (clbk) {
                    $http.get('/sensors.json').then((response) => {
                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    })
                };

                _this.getSensorsWithLocation = function (clbk) {
                    $http.get('/sensors/with_location.json').then((response) => {
                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    })
                };

                _this.saveSensor = function (sensor, clbk, errClbk, hideMessage) {

                    // massage sensor object a to fit the back end model

                    let sensorObj = {sensor: sensor};

                    let url = '/sensors/' + sensor.id + '.json';
                    let restCall = $http.put(url, sensorObj);

                    return restCall.then(function (response) {

                        if (!hideMessage)
                            $rootScope.$emit('http.notif', 'Senzorul a fost salvat!');

                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (error) {
                        errorHandlingService.handle(error.data, error.status);
                    })
                };

                _this.activateHook = function (sensor, clbk, errClbk) {
                    sensor.hook_active = true;
                    _this.saveSensor(sensor, clbk, errClbk, true);
                };
                _this.deActivateHook = function (sensor, clbk, errClbk) {
                    sensor.hook_active = false;
                    _this.saveSensor(sensor, clbk, errClbk, true);
                };


                _this.disconnectSensor = function () {
                    if (_this.channel != null) {
                        _this.channel.unbind();
                        _this.channel.disconnect();
                    }
                    if (_this.pusher != null) _this.pusher.disconnect();
                };

                _this.connectToSensor = function (sensor, onHello, onErr) {
                    _this.pusher = new Pusher('18d2d3638538f3cc4064', {
                        cluster: 'eu',
                        forceTLS: true,
                        authEndpoint: '/sensor_auth/authenticate.json'
                    });
                    _this.channel = _this.pusher.subscribe('private-sensor-channel');

                    _this.channel.bind('client-helo-' + sensor.id, function (data) {
                        if (onHello) onHello(data);
                    });
                    _this.channel.bind('client-disconnect', function (data) {
                        if (onErr) onErr(data);
                    });

                    _this.channel.bind('pusher:error', function (err) {
                        $rootScope.$emit('http.error', 'Eroare la conectarea cu agentul:' + err.message);
                        if (onErr) onErr(err);
                    });

                    _this.channel.bind('pusher:subscription_succeeded', function (err) {
                        _this.channel.trigger("client-helo-" + sensor.id, JSON.stringify({helo: 'helo'}));
                    });

                };

                _this.takeSnapshot = function (sensor, clbk, errClbk) {
                    _this.channel.trigger("client-snapshot-" + sensor.id, JSON.stringify({params: "all"}));
                    _this.channel.unbind('client-snapshot-ready-' + sensor.id);
                    _this.channel.bind('client-snapshot-ready-' + sensor.id, function (data) {
                        if (clbk) clbk(data);
                    });

                    _this.channel.unbind('client-snapshot-err-' + sensor.id);
                    _this.channel.bind('client-snapshot-err-' + sensor.id, function (data) {
                        $rootScope.$emit('http.error', 'Eroare la snapshot:' + data.err);
                        if (errClbk) errClbk(data);
                    });
                };

                _this.getSensorLogs = function(sensor,no_of_lines, clbk, errClbk) {
                    _this.channel.trigger("client-get-log-" + sensor.id,  JSON.stringify({no_of_lines:no_of_lines}));
                    _this.channel.unbind('client-get-log-ready-' + sensor.id);
                    _this.channel.bind('client-get-log-ready-' + sensor.id, function (data) {
                        if (clbk) clbk(data);
                    });
                };

                _this.updateModule = function (sensor, cloudinaryResponse, clbk, errClbk) {
                    let args = JSON.stringify({
                        module_url: cloudinaryResponse.secure_url,
                        file_name: cloudinaryResponse.fileName
                    });
                    _this.channel.trigger("client-update-" + sensor.id, args);
                    _this.channel.unbind('client-update-ready-' + sensor.id);
                    _this.channel.bind('client-update-ready-' + sensor.id, function (data) {
                        if (clbk) clbk(data);
                    });

                    _this.channel.unbind('client-update-err-' + sensor.id);
                    _this.channel.bind('client-update-err-' + sensor.id, function (data) {
                        $rootScope.$emit('http.error', 'Eroare la update' + data.err);
                        if (errClbk) errClbk(data);
                    });
                };

                _this.getPerimeters = function (sensorId, clbk) {
                    $http.get('/sensors/' + sensorId + '/perimeters.json').then((response) => {
                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    })
                };


                _this.savePerimeters = function (sensorId, perimeters, clbk) {

                    // massage space a to fit the back end model

                    let sensorObj = {perimeters: perimeters};

                    let url = '/sensors/' + sensorId + '/save_perimeters.json';

                    $http.post(url, sensorObj).then(function (response) {

                        $rootScope.$emit('http.notif', 'Perimeters saved!');

                        let data = response.data;
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (error) {
                        errorHandlingService.handle(error.data, error.status);
                    })
                };

            }])
;

