angular.module('ParkingSpaceMobile.services', [])

    .service('parkingSpaceService', function ($rootScope, $http, ENV, userService, imageResizeFactory, errorHandlingService) {


        this.getPhoneNumber = function (spaceId, clbk, errClbk) {
            $http.get(ENV + '/parking_spaces/' + spaceId + '/phone_number.json')
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


            $http.get(ENV + '/parking_spaces.json', {
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
            $http.get(ENV + '/parking_spaces/myspaces.json')
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

            $http.get(ENV + '/parking_spaces/' + parkingSpaceId + ".json")
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
            $http.get(ENV + '/parking_spaces/myoffers.json')
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

            let url = space.id ? ENV + '/parking_spaces/' + space.id + '.json' : ENV + '/parking_spaces.json';
            let restCall = space.id ? $http.put(url, parking_space) : $http.post(url, parking_space);

            restCall.then(function (response) {
                //TODO show mesage with direct dom manipulation
                $rootScope.$emit('http.notif', 'Locul de parcare a fost postat!');

                let data = response.data;
                if (clbk) {
                    clbk(data);
                }
            }, function (error) {
                errorHandlingService.handle(error.data, error.status);
            })
        };

        this.deleteSpace = function (spaceId, clbk) {
            $http.delete(ENV + '/parking_spaces/' + spaceId + '.json')
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

        this.markOffersAsRead = function (spaceId, clbk) {
            let url = ENV + '/parking_spaces/' + spaceId + '/mark_offers_as_read.json';
            $http.get(url).then(function (res) {
                let data = res.data;
                if (clbk) {
                    clbk(data);
                }
            }, function (err) {
                errorHandlingService.handle(err.data, err.status);
            });

        };
    })

    .service('offerService', function ($http, $timeout, ENV, userService, $rootScope, errorHandlingService) {

        this.placeOffer = function (bid, spaceId, clbk) {
            bid.parking_space_id = spaceId;
            $http.post(ENV + '/parking_spaces/' + spaceId + '/proposals.json', bid)
                .then(function (resp) {
                    let data = resp.data;
                    data.start_date = new Date(data.start_date);
                    data.end_date = new Date(data.end_date);
                    if (data.approved)
                        $rootScope.$emit('http.notif', 'Felicitări! Locul a fost rezervat pt. tine.' +
                            ' Acum poți achita online sau poți contacta proprietarul.');
                    else
                        $rootScope.$emit('http.notif', 'Ofertă trimisă, însă nu a putut fi aprobată!');

                    if (clbk)
                        clbk(data);
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                })
        };

        this.acceptOffer = function (spaceId, offer, clbk) {
            $http.post(ENV + '/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/approve.json')
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
            $http.post(ENV + '/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/reject.json')
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

        this.cancelOffer = function (spaceId, offer, clbk) {
            $http.post(ENV + '/parking_spaces/' + spaceId + '/proposals/' + offer.id + '/cancel.json')
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

        this.markRead = function (postId, offers, clbk) {
            // execute call on server
            offers.forEach(function (x) {
                x.read = true;
            });

            if (clbk) {
                clbk(offers)
            }

        };
    })

    .service('parameterService', function ($http, ENV) {

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

            $http.get(ENV + '/parameters.json')
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
    })

    .service('paymentService', function ($rootScope, $http, errorHandlingService) {
        let _this = this;

        _this.generateToken = function (clbk) {
            $http.get('/users/client_token.json').then(function (resp) {
                if (clbk) {
                    let data = resp.data;
                    clbk(data.token);
                }
            }, function (err) {
                errorHandlingService.handle(err.data, err.status);
            })
        };

        _this.registerPayment = function (payload, spaceId, offerId, clbk, errClbk) {
            $http.post('/parking_spaces/' + spaceId + '/proposals/' + offerId + '/pay.json', {nonce: 'fake-processor-declined-visa-nonce'}).then(function (resp) {
                if (clbk) {
                    let data = resp.data;
                    clbk(data);
                }
            }, function (err) {
                errorHandlingService.handle(err.data, err.status);
                if (errClbk){
                    errClbk(err);
                }
            })
        }
    })


    .service('notificationService', function ($rootScope, $http, $q, ENV, $state) {

        let _this = this;
        _this.offerNotifications = [];
        _this.parkingSpaceNotifications = [];

        _this.registerForNotifications = function () {

            let push = PushNotification.init({
                android: {
                    senderID: "1036383532323"
                },
                browser: {},
                ios: {},
                windows: {}
            });

            push.on('registration', function (data) {
                let notifId = data.registrationId;
                console.log("Obtained notification id: " + notifId);
                $http.post(ENV + '/notif.json', {notif_registration_id: notifId}).then(
                    function (data) {
                        console.log('Successfully saved notification id!')
                    },
                    function (err) {
                        console.log('Problem while saving notification id!', err)
                    });
            });

            push.on('notification', function (data) {
                _this.showNotifications(data.additionalData);
            });

            push.on('error', function (e) {
                // e.message
                console.error("Error while registering/receiving notifications", e, e.message);
                $rootScope.$emit('http.error',
                    'Cannot register for notifications! You won\'t receive any notifications'
                )
            });
        };


        document.addEventListener('deviceready', function () {
            _this.registerForNotifications();
        });


        _this.hideOfferNotifications = function () {
            // hide notifications in 2 seconds
            setTimeout(function () {
                _this.offerNotifications = [];
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }, 10000);
        };

        _this.hideParkingSpaceNotifications = function () {
            // hide notifications in 2 seconds
            setTimeout(function () {
                _this.parkingSpaceNotifications = [];
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }, 10000);
        };


        _this.showNotifications = function (msg) {
            if (!msg) {
                return;
            }

            msg.active = true;

            if (msg.area === 'offer') {
                _this.offerNotifications.push(msg);
            } else if (msg.area === 'parking_space') {
                _this.parkingSpaceNotifications.push(msg);
            }


            navigator.vibrate(800);


            let state = $state.current.name;
            let stateIsMyPosts = state.indexOf('home.myposts') !== -1;
            let stateIsMyOffers = state.indexOf('home.myoffers') !== -1;
            if (stateIsMyOffers || stateIsMyPosts) {
                $state.reload();
            }

            // current state is 'search', we just show the notif baloon
            if (!$rootScope.$$phase)
                $rootScope.$apply();


        };

    });