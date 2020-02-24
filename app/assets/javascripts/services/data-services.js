angular.module('ParkingSpace.services')

    .service('parkingSpaceService', ['$rootScope', '$http', 'userService', 'errorHandlingService', 'notificationService',
        function ($rootScope, $http, userService, errorHandlingService, notificationService) {


            this.getPhoneNumber = function (spaceId, clbk, errClbk) {
                $http.get('/parking_spaces/' + spaceId + '/phone_number.json')
                    .then(function (response) {
                        let data = response.data;
                        if (clbk)
                            clbk(data);
                    }, function (errorResponse) {
                        if (!errClbk) {
                            errorHandlingService.handle(errorResponse.data, errorResponse.status);
                        } else {
                            errClbk(errorResponse.data, errorResponse.status);
                        }
                    });
            };

            this.getAvailableSpaces = function (latMinMax, clbk, errClbk) {

                $http.get('/parking_spaces.json', {
                    params: {
                        lat_min: latMinMax.south,
                        lat_max: latMinMax.north,
                        lon_min: latMinMax.west,
                        lon_max: latMinMax.east,
                    }
                }).then(function (response) {
                    let data = response.data;
                    let clusteredSpaces = [];
                    if (data) {
                        let zoomLvl = $rootScope.map.zoom;
                        let zoomFactor = (22 - zoomLvl) / 5;
                        let latLngs = [];

                        data.forEach(function (p_space) {
                            p_space.space_availability_start = new Date(p_space.space_availability_start);
                            p_space.space_availability_stop = new Date(p_space.space_availability_stop);
                            p_space.daily_start = new Date(p_space.daily_start);
                            p_space.daily_stop = new Date(p_space.daily_stop);
                            p_space.location_lat = Number.parseFloat(p_space.location_lat);
                            p_space.location_long = Number.parseFloat(p_space.location_long);
                            latLngs.push([p_space.location_lat, p_space.location_long, p_space]);
                        });
                        clusteredSpaces = geocluster(latLngs, zoomFactor);

                    }
                    if (clbk)
                        clbk(clusteredSpaces);
                }, function (errorResponse) {
                    if (!errClbk) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    } else {
                        errClbk(errorResponse.data, errorResponse.status);
                    }
                });
            };

            this.getMySpaces = function (clbk, active) {
                $http.get('/parking_spaces/myspaces.json', {params: {active: active}})
                    .then(function (response) {
                        let data = response.data;
                        if (data) {
                            data.forEach(function (p_space) {
                                p_space.space_availability_start = new Date(p_space.space_availability_start);
                                p_space.space_availability_stop = new Date(p_space.space_availability_stop);
                            });
                        }
                        if (clbk)
                            clbk(data);
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    });
            };

            this.getSpace = function (parkingSpaceId, clbk, errClbk) {

                return $http.get('/parking_spaces/' + parkingSpaceId + ".json")
                    .then(function (response) {
                        let data = response.data;
                        if (data) {
                            data.space_availability_start = new Date(data.space_availability_start);
                            data.space_availability_stop = new Date(data.space_availability_stop);
                            data.daily_start = new Date(data.daily_start);
                            data.daily_stop = new Date(data.daily_stop);
                            data.weekly_schedule = JSON.parse(data.weekly_schedule);
                        }
                        if (clbk)
                            clbk(data);
                        return data;
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                        if (errClbk) errClbk(errorResponse);
                        return errorResponse;

                    });
            };

            this.getMyOffers = function (clbk) {
                $http.get('/parking_spaces/myoffers.json')
                    .then(function (response) {
                        let data = response.data;
                        if (clbk)
                            clbk(data);
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    });
            };

            this.saveSpace = function (space, clbk) {

                // massage space a to fit the back end model
                space.target_price = space.price;
                space.target_price_currency = space.currency;
                space.weekly_schedule = JSON.stringify(space.weekly_schedule);
                let parking_space = {parking_space: space};

                let url = space.id ? '/parking_spaces/' + space.id + '.json' : '/parking_spaces.json';
                let restCall = space.id ? $http.put(url, parking_space) : $http.post(url, parking_space);

                restCall.then(function (response) {
                    //TODO show mesage with direct dom manipulation
                    $rootScope.$emit('http.notif', 'Locul de parcare a fost postat!');

                    notificationService.registerForNotifications();
                    let data = response.data;
                    if (clbk) {
                        clbk(data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            this.deleteSpace = function (spaceId, clbk) {
                $http.delete('/parking_spaces/' + spaceId + '.json')
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif', 'Locul de parcare a fost șters!');
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })

            };

            this.uploadDocuments = function (spaceId, docs, clbk) {
                $http.post(`/parking_spaces/${spaceId}/attach_documents.json`, {docs: docs})
                    .then(function (res) {
                        $rootScope.$emit('http.notif', 'Documentele sunt in curs de verificare. Veți fi ' +
                            'notificat când locul va deveni disponibil.');
                        if (clbk) {
                            clbk(res.data);
                        }

                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })

            };

            this.extendValidity = function (space, clbk) {
                let parking_space = {parking_space: space};
                $http.put('/parking_spaces/' + space.id + '.json', parking_space).then(function (res) {
                    $rootScope.$emit('http.notif', 'Valabilitatea locului de parcare a fost extinsă');

                    if (clbk) clbk(res.data);
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                });
            }

        }])

    .service('offerService', ['$http', '$timeout', 'userService', '$rootScope', 'errorHandlingService', 'notificationService',
        function ($http, $timeout, userService, $rootScope, errorHandlingService, notificationService) {

            this.placeOffer = function (bid, spaceId, clbk) {
                bid.parking_space_id = spaceId;
                $http.post('/parking_spaces/' + spaceId + '/proposals.json', bid)
                    .then(function (resp) {
                        let data = resp.data;
                        data.start_date = new Date(data.start_date);
                        data.end_date = new Date(data.end_date);
                        if (data.approved) {
                            $rootScope.$emit('http.notif', 'Felicitări! Locul a fost rezervat pt. tine.' +
                                ' Acum poți achita online sau poți contacta proprietarul.');
                            notificationService.registerForNotifications(true);
                        } else {
                            $rootScope.$emit('http.notif', 'Ofertă trimisă, însă nu a putut fi aprobată!');
                        }
                        if (clbk)
                            clbk(data);
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.acceptOffer = function (spaceId, offer, clbk) {
                $http.post('/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/approve.json')
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif',
                            'Ai acceptat oferta de ' + offer.bid_price + ' ' + offer.bid_currency + '. Proprietarul a fost notificat!');
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.rejectOffer = function (spaceId, offer, clbk) {
                $http.post('/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/reject.json')
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif',
                            'Ai respins oferta de ' + offer.bid_price + ' ' + offer.bid_currency + '. Proprietarul a fost notificat'
                        );
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.getOffer = function (offerId, clbk) {
                $http.get('/parking_spaces/1/proposals/' + offerId + '.json')
                    .then(function (res) {
                        let data = res.data;
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.cancelOffer = function (spaceId, offer, clbk) {
                $http.post('/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/cancel.json')
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif',
                            'Ai anulat oferta de ' + offer.bid_price + ' ' + offer.bid_currency + '. Proprietarul a fost notificat'
                        );
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };
        }])

    .service('parameterService', ['$http', function ($http) {

        /**
         * provides back-end parameters
         * 2. short_term_expiration: 10 # minutes
         * 3. max_search_radius: 1200
         * 4. long_term_expiration: 2 # weeks
         * 5. default_range: 500
         * 6. countries list ( starting asking price, country_name, etc.)
         */

        let _this = this;

        _this.parameters = {};

        this.retrieveParameters = function (okClbk, errClbk) {
            if (Object.keys(_this.parameters) > 0) {
                if (okClbk) {
                    okClbk(_this.parameters);
                }
                return;
            }

            $http.get('/parameters.json')
                .then(function (res) {
                    let data = res.data;
                    _this.setParameters(data);
                    if (okClbk) {
                        okClbk(data);
                    }
                }, function (err) {
                    if (errClbk) {
                        errClbk(err.data, err.status);
                    }
                })

        };

        this.retrieveParameters();

        this.setParameters = function (params) {
            params.forEach(function (item) {
                _this.parameters[item.name] = item.default_value;
                if (item.values && item.values.length) {
                    _this.parameters[item.name + '_values'] = item.values
                }
            });
            // look for the country which has the default value
            let srvParams = _this.parameters;
            srvParams.starting_ctry = srvParams.country_values.find((item) => {
                return item.key === srvParams.country;
            });

            srvParams.starting_asking_price = srvParams.starting_ctry.value;
            srvParams.starting_currency = srvParams.starting_ctry.value2;
        };

        this.getStartingCurrency = function () {
            return _this.parameters.starting_currency || 'Eur';// default
        };

        this.getStartingAskingPrice = function () {
            return parseInt(_this.parameters.starting_asking_price) || 5;// default
        };


        this.getCountryList = function (clbk) {
            _this.retrieveParameters(function (data) {
                let countries = _this.parameters.country_values;

                countries.map(function (item) {
                    let countryName = item.value4.replace(/ /g, "_") + ".png";
                    item.url = '/assets/app/flags/' + countryName;
                    item.prefix = item.value3;
                    item.name = item.value4;
                    item.code = item.key;
                });

                countries.sort(function (item1, item2) {
                    if (item1.name < item2.name)
                        return -1;
                    if (item1.name > item2.name)
                        return 1;
                    return 0;
                });

                if (clbk) {
                    clbk(countries);
                }

            });
        };
    }])

    .service('paymentService', ['$rootScope', '$http', 'errorHandlingService',
        function ($rootScope, $http, errorHandlingService) {
            let _this = this;

            _this.generateToken = function () {
                return $http.get('/users/client_token.json').then(function (resp) {
                    return resp.data.token;
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                });
            };

            _this.registerPayment = function (payload, spaceId, offerId, clbk, errClbk) {
                $http.post('/parking_spaces/' + spaceId + '/proposals/' + offerId + '/pay.json', {nonce: payload.nonce}).then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            };

            _this.getPayments = function (clbk, errClbk) {
                $http.get('/parking_spaces/1/proposals/1/get_user_payments.json').then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            };

            _this.getPaymentDetails = function (paymentId, clbk, errClbk) {
                $http.get('/parking_spaces/1/proposals/1/get_payment_details.json?payment_id=' + paymentId).then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            };

            _this.getAccountStatus = function (clbk, errClbk) {
                $http.get('/accounts.json').then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            };

            _this.withdraw = function (amnt, iban, clbk, errClbk) {
                $http.post('/accounts/1/withdraw.json', {amount: amnt, iban: iban}).then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            };

            _this.getWithdrawals = function (clbk, errClbk) {
                $http.get('/accounts/1/withdrawals.json').then(function (resp) {
                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                    if (errClbk) {
                        errClbk(err);
                    }
                })
            }
        }])

    .service('companyUserService', ['$rootScope', '$http', 'errorHandlingService',
        function ($rootScope, $http, errorHandlingService) {
            var _this = this;

            _this.loadCompanyUsers = function (query, clbk) {
                $http.get('/employees/list.json', {
                    params: {
                        query: query
                    }
                }).then((response) => {
                    let data = response.data;
                    if (clbk) {
                        clbk(data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            _this.getAllRoles = function (clbk) {
                $http.get('/roles.json').then((response) => {
                    let data = response.data;
                    if (clbk) {
                        clbk(data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            _this.findCompanyUser = function (id, clbk) {
                $http.get('/employees/' + id + '.json').then((response) => {
                    let data = response.data;
                    if (clbk) {
                        clbk(data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            _this.getCompany = function (clbk) {
                $http.get('/companies/1.json').then((resp) => {
                    let data = resp.data;
                    if (clbk) {
                        clbk(data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            }
        }])

    .service('locationService', ['$rootScope', '$http', 'errorHandlingService',
        function ($rootScope, $http, errorHandlingService) {
            let _this = this;
            _this.saveLocation = function (location, clbk) {
                // massage space a to fit the back end model

                let locationObj = {location: location};

                let url = location.id ? '/locations/' + location.id + '.json' : '/locations.json';
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
                return $http.delete('/locations/' + locationId + '.json').then((response) => {
                    $rootScope.$emit('http.warning', 'Locatia a fost stearsa!');

                    if (clbk) {
                        clbk(response.data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            _this.getLocations = function (clbk) {
                return $http.get('/locations.json').then((response) => {
                    if (clbk) {
                        clbk(response.data);
                    }
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            _this.getRules = function (query, ids, clbk) {
                return $http.get('/rules.json', {
                    params: {
                        query: query,
                        ids: ids
                    }
                }).then((response) => {
                    if (clbk) {
                        clbk(response.data);
                    }
                })
            }
        }])

    .service('sensorService', ['$rootScope', '$http', 'errorHandlingService',
        function ($rootScope, $http, errorHandlingService) {

            let _this = this;
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
                    data.created_at = new Date(data.created_at);
                    data.updated_at = new Date(data.updated_at);
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
                _this.connectToSensor(sensor, () => {
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
                })

            };

            _this.getSensorLogs = function (sensor, no_of_lines, clbk, errClbk) {
                _this.channel.trigger("client-get-log-" + sensor.id, JSON.stringify({no_of_lines: no_of_lines}));
                _this.channel.unbind('client-get-log-ready-' + sensor.id);
                _this.channel.bind('client-get-log-ready-' + sensor.id, function (data) {
                    if (clbk) clbk(data);
                });
            };

            _this.restartModule = function (sensor, module, clbk, errClbk) {
                _this.channel.trigger("client-restart-" + sensor.id, JSON.stringify({module_name: module}));
                _this.channel.unbind('client-restart-ready-' + sensor.id);
                _this.channel.bind('client-restart-ready-' + sensor.id, function (data) {
                    if (clbk) clbk(data);
                });

                _this.channel.unbind('client-restart-err-' + sensor.id);
                _this.channel.bind('client-restart-err-' + sensor.id, function (data) {
                    $rootScope.$emit('http.error', 'Eroare la restart:' + data.err);
                    if (errClbk) errClbk(data);
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
        }])

    .service('sectionService', ['$rootScope', '$http', 'errorHandlingService', function ($rootScope, $http, errorHandlingService) {
        let _this = this;

        _this.saveSection = function (section, clbk) {

            let sectionObj = {section: section};

            let url = section.id ? '/sections/' + section.id + '.json' : '/sections.json';
            let restCall = section.id ? $http.put(url, sectionObj) : $http.post(url, sectionObj);

            return restCall.then(function (response) {
                $rootScope.$emit('http.notif', 'Sectiunea a fost salvată!');

                let data = response.data;
                if (clbk) {
                    clbk(data);
                }
            }, function (error) {
                errorHandlingService.handle(error.data, error.status);
            })
        }

        _this.getPerimeters = function (sensorId, clbk) {
            $http.get('/sensors/' + sensorId + '/perimeters.json').then((response) => {
                let data = response.data;
                data.created_at = new Date(data.created_at);
                data.updated_at = new Date(data.updated_at);
                data.last_touch_date = new Date(data.last_touch_date);
                data.modules = [];
                if (data.module_info) {
                    let modules = data.module_info.split("\n");
                    modules.forEach((m) => {
                        if (!m) return;
                        let arr = m.trim().split(" ");
                        data.modules.push({idx: arr[0], name: arr[1], version: arr[2]})
                    });
                }
                if (clbk) {
                    clbk(data);
                }
            })
        };

        _this.getSectionPerimeters = function (sectionId, clbk) {
            $http.get('/sections/' + sectionId + '/perimeters.json').then((response) => {
                if (clbk) {
                    clbk(response.data);
                }
            });
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
        }

        _this.saveSectionAndPerimeters = function (section, perimeters, clbk) {

            _this.saveSection(section, clbk);

            let sectionObj = {perimeters: perimeters};
            perimeters.forEach((p) => {
                p.section_id = section.id;
                if (p.user)
                    p.user_email = p.user.email;
            });
            let url = '/sections/' + section.id + '/save_perimeters.json';

            $http.post(url, sectionObj).then(function (response) {

                $rootScope.$emit('http.notif', 'Perimetre parcare salvate!');

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