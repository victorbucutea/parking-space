angular.module('ParkingSpace.services')

    .service('parkingSpaceService', ['$rootScope', '$http', 'userService', 'errorHandlingService', 'notificationService', 'geocluster',
        function ($rootScope, $http, userService, errorHandlingService, notificationService, geocluster) {

            let _this = this;

            this.getAvailableSpaces = function (latMinMax, clbk) {

                return $http.get('/parking_spaces.json', {
                    params: {
                        lat_min: latMinMax.south,
                        lat_max: latMinMax.north,
                        lon_min: latMinMax.west,
                        lon_max: latMinMax.east,
                    }
                }).then(function (response) {
                    let data = response.data;
                    _this.convert(data);
                    if (clbk)
                        clbk(data);
                }, function (errorResponse) {
                    errorHandlingService.handle(errorResponse.data, errorResponse.status);
                });
            };

            this.getMySpaces = function (clbk) {
                $http.get('/parking_spaces/myspaces.json')
                    .then(function (response) {
                        let data = response.data;
                        _this.convert(data);

                        if (clbk)
                            clbk(data);
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    });
            };

            this.listSpaces = function (user, clbk) {
                $http.get('/parking_spaces/list_spaces.json', {params: {user_id: user.id}})
                    .then(function (response) {
                        let data = response.data;
                        _this.convert(data);

                        if (clbk)
                            clbk(data);
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    });
            };

            this.getMyOffers = function (clbk) {
                $http.get('/parking_spaces/myoffers.json')
                    .then(function (response) {
                        let data = response.data;
                        _this.convert(data);
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
                        _this.convert(data);
                        if (clbk)
                            clbk(data);
                        return data;
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                        if (errClbk) errClbk(errorResponse);
                        return errorResponse;

                    });
            };

            this.saveSpace = function (space) {

                // massage space a to fit the back end model
                space.target_price = space.price;
                space.target_price_currency = space.currency;
                space.weekly_schedule = JSON.stringify(space.weekly_schedule);
                let parking_space = {parking_space: space};

                let url = space.id ? '/parking_spaces/' + space.id + '.json' : '/parking_spaces.json';
                let restCall = space.id ? $http.put(url, parking_space) : $http.post(url, parking_space);

                return restCall.then(function (response) {
                    notificationService.registerForNotifications();
                    let data = response.data;
                    _this.convert(data);
                    return data;
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })
            };

            this.uploadDocuments = function (spaceId, docs, clbk) {
                $http.post(`/parking_spaces/${spaceId}/attach_documents.json`, {docs: docs})
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif', 'Documentele au fost încărcate !');
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.uploadImages = function (spaceId, imgs) {
                return $http.post(`/parking_spaces/${spaceId}/attach_images.json`, {imgs: imgs})
                    .then(function (res) {
                        let data = res.data;
                        _this.convert(data);
                        return data;
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.extendValidity = function (space, clbk) {
                let parking_space = {parking_space: space};
                $http.put('/parking_spaces/' + space.id + '.json', parking_space).then(function (res) {
                    $rootScope.$emit('http.notif', 'Valabilitatea locului de parcare a fost extinsă');
                    let data = res.data;
                    _this.convert(data);
                    if (clbk) {
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                });
            }

            this.getReviews = function (space) {
                return $http.get('/reviews.json', {
                    params: {
                        space_id: space.id
                    }
                }).then(function (response) {
                    return response.data;
                }, function (errorResponse) {
                    errorHandlingService.handle(errorResponse.data, errorResponse.status);
                });
            }

            this.deleteReview = function (review) {
                return $http['delete'](`/reviews/${review.id}.json`).then(function (response) {
                    $rootScope.$emit('http.notif', 'Review-ul a fost sters');
                    return response.data;
                }, function (errorResponse) {
                    errorHandlingService.handle(errorResponse.data, errorResponse.status);
                });
            }

            this.getDocuments = function (space) {
                return $http.get(`/parking_spaces/${space.id}/documents.json`)
                    .then(function (response) {
                        return response.data;
                    }, function (errorResponse) {
                        errorHandlingService.handle(errorResponse.data, errorResponse.status);
                    });
            }

            this.saveReview = function (review) {
                return $http.post('/reviews.json', {
                    review: review
                }).then(function (response) {
                    $rootScope.$emit('http.notif', 'Mulțumim, Review-ul tău a fost adăugat!');
                    return response.data;
                }, function (errorResponse) {
                    errorHandlingService.handle(errorResponse.data, errorResponse.status);
                });
            }

            this.convert = function (space) {
                function enrich(space) {
                    space.space_availability_start = new Date(space.space_availability_start);
                    space.space_availability_stop = new Date(space.space_availability_stop);
                    space.daily_start = new Date(space.daily_start);
                    space.daily_stop = new Date(space.daily_stop);
                    space.location_lat = Number.parseFloat(space.location_lat);
                    space.location_long = Number.parseFloat(space.location_long);
                    space.weekly_schedule = JSON.parse(space.weekly_schedule);
                }

                if (space instanceof Array) {
                    space.forEach((s) => enrich(s));
                    return;
                }
                if (space) {
                    enrich(space);
                }
            };

            this.clusterize = function (spaces, skip) {
                let clusteredSpaces = [];
                if (spaces) {
                    let zoomLvl = $rootScope.map.zoom;
                    let zoomFactor = (22 - zoomLvl) / 5;
                    // map will draw onlt cluster elements
                    // easiest is to make a cluster for each elmnt
                    if (skip) zoomFactor = 0;
                    let latLngs = [];

                    spaces.forEach(function (p_space) {
                        latLngs.push([p_space.location_lat, p_space.location_long, p_space]);
                    });
                    clusteredSpaces = geocluster(latLngs, zoomFactor);
                }
                clusteredSpaces.sort((a, b) => {
                    let compa = a.elements[0][2].id;
                    let compb = b.elements[0][2].id;
                    if (compa < compb) {
                        return -1;
                    }
                    if (compa > compb) {
                        return 1;
                    }
                    return 0;
                });
                return clusteredSpaces;
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
                        if (data.pending) {
                            $rootScope.$emit('http.notif', 'Felicitări! Locul poate fi rezervat.' +
                                ' Te rugăm achită online pentru a finaliza rezervarea.');
                            notificationService.registerForNotifications(true);
                        } // whatever else for now we only return pending
                        if (clbk)
                            clbk(data);
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

            this.getNextOffer = function () {
                return $http.get(`/parking_spaces/1/proposals/1/next.json`)
                    .then(function (res) {
                        sessionStorage.setItem("showNextOffer", "false");
                        return res.data;
                    }, function (err) {
                        // explicitly nothing
                    })
            };

            this.showNextOffer = function () {
                return !sessionStorage.getItem("showNextOffer");
            }

            this.getOffers = function (spaceId) {
                return $http.get(`/parking_spaces/${spaceId}/proposals.json`)
                    .then(function (res) {
                        return res.data;
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            }

            this.rejectOffer = function (spaceId, offer, clbk) {
                $http.post('/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/reject.json')
                    .then(function (res) {
                        let data = res.data;
                        $rootScope.$emit('http.notif',
                            'Ai respins oferta. Proprietarul a fost notificat'
                        );
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
                            'Ai respins oferta . Proprietarul a fost notificat'
                        );
                        if (clbk) {
                            clbk(data);
                        }
                    }, function (err) {
                        errorHandlingService.handle(err.data, err.status);
                    })
            };

        }])

    .service('parameterService', ['$http', '$q', 'errorHandlingService', function ($http, $q, errorHandlingService) {

        /**
         * provides back-end parameters
         * 6. countries list ( starting asking price, country_name, etc.)
         */

        let _this = this;


        _this.retrieveParameters = function () {
            if (sessionStorage.getItem('parameters')) {
                let parse = JSON.parse(sessionStorage.getItem('parameters'));
                return $q.resolve(parse);
            }

            return $http.get('/parameters.json')
                .then(function (res) {
                    let data = res.data;
                    let countries = data.countries;
                    for (attr in countries) {
                        let item = countries[attr];
                        let countryName = item.name.replace(/ /g, "_");
                        item.css = 'bg-' + countryName;
                    }
                    data.default_country = data.countries[data.default_country]
                    sessionStorage.setItem('parameters', JSON.stringify(data));
                    return data;
                }, function (error) {
                    errorHandlingService.handle(error.data, error.status);
                })

        };


        this.getStartingAskingPrice = function () {
            return _this.retrieveParameters().then((data) => {
                let ctry = data.default_country;
                return {currency: ctry.currency, price: Number.parseFloat(ctry.starting_value)};
            })
        };


        this.getCountryList = function () {
            return _this.retrieveParameters();
        };

        this.navigateOnRedirect = function () {
            return sessionStorage.getItem("navigateOnRedirect") !== "false";
        }

        this.getNavigateCoords = function () {
            let item = sessionStorage.getItem("navigateOnRedirect");
            if (!item) return;
            let coords = JSON.parse(item);
            let pos = new google.maps.LatLng(coords.lat, coords.lng);
            return pos;
        }

        this.setNavigateOnRedirect = function (latLng) {
            if (latLng)
                sessionStorage.setItem("navigateOnRedirect", JSON.stringify(latLng));
            else
                sessionStorage.setItem("navigateOnRedirect", "false");

        }
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
                $http.get('/accounts/payments.json').then(function (resp) {
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
                $http.get('/accounts/payment_details.json?payment_id=' + paymentId).then(function (resp) {
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
                $http.post('/accounts/withdraw.json', {amount: amnt, iban: iban}).then(function (resp) {
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
                $http.get('/accounts/withdrawals.json').then(function (resp) {
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

            _this.cancelWithdrawal = function (withd, clbk) {
                $http.post(`/accounts/cancel_withdrawal.json`,
                    {withdrawal_id: withd.id}
                ).then(function (resp) {
                    $rootScope.$emit('http.warning', 'Retragerea a fost anulata!');

                    if (clbk) {
                        let data = resp.data;
                        clbk(data);
                    }
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                })

            }
        }])

    .service('companyUserService', ['$rootScope', '$http', 'errorHandlingService',
        function ($rootScope, $http, errorHandlingService) {
            let _this = this;

            _this.listUsers = function (query, clbk) {
                query = query || '';
                $http.get('/users/list.json', {
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