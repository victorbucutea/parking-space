angular.module('ParkingSpaceMobile.services', [])

    .service('parkingSpaceService',
        ['$rootScope', '$http', 'userService', 'errorHandlingService', 'notificationService',
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
                    })
                        .then(function (response) {
                            let data = response.data;
                            if (data) {
                                data.forEach(function (p_space) {
                                    p_space.space_availability_start = new Date(p_space.space_availability_start);
                                    p_space.space_availability_stop = new Date(p_space.space_availability_stop);
                                    p_space.daily_start = new Date(p_space.daily_start);
                                    p_space.daily_stop = new Date(p_space.daily_stop);
                                });
                            }
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

                this.getMySpaces = function (clbk) {
                    $http.get('/parking_spaces/myspaces.json')
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

                this.getSpace = function (parkingSpaceId, clbk) {

                    $http.get('/parking_spaces/' + parkingSpaceId + ".json")
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
                        }, function (errorResponse) {
                            errorHandlingService.handle(errorResponse.data, errorResponse.status);
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

            }])

    .service('offerService',
        ['$http', '$timeout', 'userService', '$rootScope', 'errorHandlingService', 'notificationService',
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

    .service('parameterService',
        ['$http',
            function ($http) {

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

                this.getParameters = function () {
                    return _this.parameters;
                };

                this.getDefaultSearchRadius = function () {
                    return parseInt(_this.parameters.default_range) || 500; // default
                };

                this.getStartingCurrency = function () {
                    return _this.parameters.starting_currency || 'Eur';// default
                };

                this.getStartingAskingPrice = function () {
                    return parseInt(_this.parameters.starting_asking_price) || 5;// default
                };

                this.getCountryList = function () {
                    return _this.parameters.country_values;
                };

                this.getCountryListAsync = function (clbk) {
                    _this.retrieveParameters(function (data) {
                        let countries = _this.getCountryList();

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

    .service('paymentService',
        ['$rootScope', '$http', 'errorHandlingService',
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


    .service('notificationService',
        ['$rootScope', '$http', '$q', '$state',
            function ($rootScope, $http, $q, $state) {

                let _this = this;
                let registered = false;
                let notifAsked = false;

                _this.registerForNotifications = function (forOffers) {

                    if (!notifAsked && Notification.permission !== 'granted') {
                        if (!forOffers)
                            $rootScope.$emit('http.notif', "Pentru a primi oferte pentru locul tău " +
                                "în timp real, te rugăm acceptă notificările.");
                        else
                            $rootScope.$emit('http.notif', "Te rugăm acceptă " +
                                "pentru a primi notificări în timp real despre oferta ta.");

                        notifAsked = true;
                    }

                    // request notification permission from the user
                    navigator.serviceWorker.ready.then(function (reg) {
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: window.vapidPublicKey
                        }).then(function (sub) {
                            // user accepted
                            let subStr = JSON.stringify(sub);
                            subJson = JSON.parse(subStr);
                            subJson.notif_approved = true;
                            $http.post('/users/register_for_notifications.json',
                                subJson
                            ).then(function () {
                                registered = true;
                            }).catch((e) => {
                                console.warn('Unable to send endpoint url to server.' +
                                    'Will retry on next open.');
                            });

                        }).catch(function (e) {

                            if (Notification.permission === 'denied') {
                                // user doesn't want notification
                                $http.post('/users/register_for_notifications.json', {
                                    notif_approved: false
                                }).catch((e) => {
                                    console.warn('Unable to send endpoint url to server.' +
                                        'Will retry on next open.');
                                });
                            } else {
                                // exception while subscribing
                                console.error('Unable to subscribe to push', e);
                            }

                        });
                    });
                };

                _this.hideOfferNotifications = function () {

                };

                _this.hideParkingSpaceNotifications = function () {

                };


                _this.showNotifications = function (msg) {

                };

            }]);