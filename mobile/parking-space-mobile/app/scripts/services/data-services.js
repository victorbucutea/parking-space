angular.module('ParkingSpaceMobile.services', [])

    .service('parkingSpaceService', function ($rootScope, $http, ENV, userService, imageResizeFactory, errorHandlingService) {

        this.getAvailableSpaces = function (lat, lng, range, clbk, errClbk) {
            $('.loading-spinner').show();
            $('.loading-finished').hide();

            $http.get(ENV + 'parking_spaces.json?lat=' + lat + '&lon=' + lng + '&range=' + range)
                .success(function (data) {
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    if (!errClbk) {
                        errorHandlingService.handle(data, status);
                        $('.loading-finished').show();
                    } else {
                        errClbk(data, status);
                    }
                });
        };

        this.getMySpaces = function (clbk) {
            $('.loading-spinner').show();
            $('.loading-finished').hide();

            $http.get(ENV + 'parking_spaces/myspaces.json')
                .success(function (data) {
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status, headers, config) {
                    errorHandlingService.handle(data, status);
                    $('.loading-finished').show();
                });
        };

        this.getMyOffers = function (clbk) {
            $('.loading-spinner').show();
            $('.loading-finished').hide();
            $http.get(ENV + 'parking_spaces/myoffers.json')
                .success(function (data) {
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status, headers, config) {
                    errorHandlingService.handle(data, status);
                    $('.loading-finished').show();
                });
        };

        this.saveSpace = function (space, clbk) {

            // massage space a to fit the back end model
            var imageUrl = space.local_image_url;
            space.target_price = space.price;
            space.target_price_currency = space.currency;
            space.image_data = imageResizeFactory(imageUrl, 480, 640);
            space.thumbnail_data = imageResizeFactory(imageUrl, 89, 118);
            if (imageUrl) {
                space.image_file_name = imageUrl.substr(imageUrl.lastIndexOf("/") + 1);
            }
            space.image_content_type = 'image/jpeg';
            if (space.short_term)
                space.interval = 1;
            else
                space.interval = 0;


            var parking_space = {parking_space: space};

            var url = space.id ? ENV + 'parking_spaces/' + space.id + '.json' : ENV + 'parking_spaces.json';
            var restCall = space.id ? $http.put(url, parking_space) : $http.post(url, parking_space);

            restCall.success(function (data) {
                //TODO show mesage with direct dom manipulation
                $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Parking space saved!'});

                if (clbk) {
                    clbk(data);
                }
            }).error(function (data, status) {
                errorHandlingService.handle(data, status);
            })
        };

        this.deleteSpace = function (spaceId, clbk) {
            $('.loading-spinner').show();
            $http.delete(ENV + 'parking_spaces/' + spaceId + '.json')
                .success(function (data) {
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Parking space deleted!'});
                    $('.loading-spinner').hide();
                    if (clbk) {
                        clbk(data);
                    }
                })
                .error(function (data) {
                    errorHandlingService.handle(data, status);
                })

        };

        this.markOffersAsRead = function (spaceId, clbk) {
            var url = ENV + 'parking_spaces/' + spaceId + '/mark_offers_as_read.json';
            $http.get(url).success(function (data) {
                if (clbk) {
                    clbk(data);
                }
            }).error(function (data, status) {
                errorHandlingService.handle(data, status);
            });

        };
    })

    .service('messageService', function ($rootScope, $http, $timeout, ENV, userService) {
        this.messages = [];
        var _this = this;

        this.markRead = function (postId, messages, clbk) {
            // execute call on server
            messages.forEach(function (x) {
                x.read = true;
            });
            this.getMessages(postId, clbk);
        };

        this.getMessages = function (postId, clbk) {
            $timeout(function () {
                if (clbk)
                    clbk(_this.messages);
            }, 1000)
        };

        this.sendMessage = function (pSpaceId, proposalId, msg, clbk) {
            msg.deviceid = deviceAndUserInfoService.deviceId;
            msg.proposal_id = proposalId;
            $http.post(ENV + 'parking_spaces/' + pSpaceId + '/proposals/' + proposalId + '/messages.json', msg)
                .success(function (data) {
                    if (clbk)
                        clbk(data)
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                });
        }
    })

    .service('offerService', function ($http, $timeout, ENV, userService, $rootScope, errorHandlingService) {

        this.placeOffer = function (bid, spaceId, clbk) {
            bid.parking_space_id = spaceId;

            $http.post(ENV + 'parking_spaces/' + spaceId + '/proposals.json', bid)
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Bid placed!'});
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                })
        };

        this.acceptOffer = function (spaceId, offer, clbk) {
            var loading = $('.loading-spinner');
            loading.show();
            $http.post(ENV + 'parking_spaces/' + spaceId + '/proposals/' + offer.id + '/approve.json')
                .success(function (data) {
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Accepted offer for ' + offer.price + ' ' + offer.currency});
                    $('.loading-spinner').hide();
                    if (clbk) {
                        clbk(data);
                    }
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                })
        };

        this.rejectOffer = function (spaceId, offer, clbk) {
            var loading = $('.loading-spinner');
            loading.show();
            $http.post(ENV + 'parking_spaces/' + spaceId + '/proposals/' + offer.id + '/reject.json')
                .success(function (data) {
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Rejected offer for ' + offer.price + ' ' + offer.currency});
                    $('.loading-spinner').hide();
                    if (clbk) {
                        clbk(data);
                    }
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
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

        var _this = this;

        _this.parameters = {};

        this.retrieveParameters = function (okClbk, errClbk) {
            $http.get(ENV + 'parameters.json')
                .success(function (data) {
                    _this.setParameters(data);
                    if (okClbk) {
                        okClbk(data);
                    }
                })
                .error(function (data, status) {
                    if (errClbk) {
                        errClbk(data, status);
                    }
                })

        };

        this.setParameters = function (params) {
            params.forEach(function (item) {
                _this.parameters[item.name] = item.default_value;
                if (item.values && item.values.length) {
                    _this.parameters[item.name + '_values'] = item.values
                }
            });
        };

        this.getParameters = function () {
            return _this.parameters;
        };

        this.getDefaultSearchRadius = function () {
            return parseInt(_this.parameters.default_range) || 500; // bkp for  no connectivity
        };

        this.getShortTermExpiration = function () {
            return parseInt(_this.parameters.short_term_expiration) || 5;// bkp for  no connectivity
        };

        this.getLongTermExpiration = function () {
            return parseInt(_this.parameters.long_term_expiration) || 2;// bkp for  no connectivity
        };

        this.getStartingCurrency = function () {
            return _this.parameters.starting_currency || 'Eur';// bkp for  no connectivity
        };

        this.getStartingAskingPrice = function () {
            return parseInt(_this.parameters.starting_asking_price) || 5;// bkp for  no connectivity
        };

        this.getCountryList = function () {
            return _this.parameters.country_values;
        };

        this.getCountryListAsync = function (clbk) {
            _this.retrieveParameters(
                function (data) {
                    var countries = _this.getCountryList();

                    countries.map(function (item) {
                        var countryName = item.value4.replace(/ /g, "_") + ".png";
                        item.url = ENV + '/assets/flags/' + countryName;
                        item.prefix = item.value3;
                        item.name = item.value4;
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

    .service('notificationService', function ($rootScope, $http, $q, ENV, $state) {

        var _this = this;

        _this.deferred = $q.defer();

        _this.registerForNotifications = function () {
            var pushNotification = window.plugins.pushNotification;
            var deviceId = window.cordova.platformId;
            if (deviceId == 'android' || deviceId == 'Android') {
                try {
                    pushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            "senderID": "889259686632",
                            "ecb": "onNotification"
                        });
                } catch (err) {
                    var txt = "There was an error on this page.\n\n";
                    txt += "Error description: " + err.message + "\n\n";
                    console.error(txt, err);
                }
            }

            function successHandler(result) {
                console.log("Success", result);
            }

            function errorHandler(error) {
                console.error("Error", error);

            }

            // fail with error if we didn't receive a registration id in 3 seconds
            setTimeout(function () {
                if (!_this.notifRegistrationId) {
                    _this.deferred.resolve();
                }
            }, 3000);
            return _this.deferred.promise;
        };

        _this.saveNotificationId = function (notifId) {
            console.log("regID = " + notifId);
            _this.notifRegistrationId = notifId;
            $http.post(ENV + '/notif.json', {notif_registration_id: notifId}).then(
                function (data) {
                    _this.deferred.resolve(notifId);
                },
                function () {
                    _this.deferred.resolve();
                })
        };

        _this.registerForMessages = function () {

        };


        document.addEventListener('deviceready', function () {
            _this.registerForNotifications().then(
                function (regid) {
                    $http.post(ENV + '/notif.json', {notif_registration_id: regid}).then(
                        function (data) {
                        },
                        function () {
                            //TODO show message with direct dom manipulation
                            $rootScope.$broadcast('http.error', [{
                                fieldName: '',
                                text: 'Cannot register for notifications! You won\'t receive any notifications'
                            }])
                        })
                }
            );
        });

        _this.activeNotifications = {};
        _this.offerNotifications = {};
        _this.parkingSpaceNotifications = {};


        _this.hideOfferNotifications = function () {
            _this.hideNotifications('offer');
        };

        _this.hideParkingSpaceNotifications = function () {
            _this.hideNotifications('parking_space');
        };

        _this.hideNotifications = function (area) {
            var keys = [];
            for (prop in _this.activeNotifications) {
                if (prop.indexOf(area) != -1) {
                    keys.push(prop);
                }
            }
            keys.forEach(function (item) {
                delete _this.activeNotifications[item];
            });
            var notifmyposts = $('#notifmyposts');
            var noOfNotifs = Object.keys(_this.activeNotifications).length;
            if (noOfNotifs) {
                notifmyposts.text(noOfNotifs);
            } else {
                notifmyposts.hide();
            }
        };

        _this.showNotifications = function (msg) {
            var current = _this.activeNotifications;
            var key = msg.area + "_" + (msg[msg.area]);
            current[key] = {};

            var state = $state.current.name;
            var stateIsMyPosts = state.indexOf('home.myposts') != -1;
            var stateIsMyOffers = state.indexOf('home.myoffers') != -1;
            if (stateIsMyOffers || stateIsMyPosts) {
                $state.reload();
            }
            navigator.vibrate(800);
            var notifmyposts = $('#notifmyposts');
            notifmyposts.show();
            var currentCount = Object.keys(current).length;
            notifmyposts.text(currentCount);
        };

        // register callback has to receive a string as an argument
        // in the register callback call context it's not possible to get a service reference
        // therefore we refer to the notification clbk as "onNotification"
        window.onNotification = function (e) {
            switch (e.event) {
                case 'registered':
                    _this.saveNotificationId(e.regid);
                    break;
                case 'message':
                    if (e.foreground) {
                        console.log('--INLINE NOTIFICATION--');
                        console.log('MESSAGE -> MSG: ' + e.payload.message);
                        _this.showNotifications(e.payload);
                    } else {
                        // otherwise we were launched because the user touched a notification in the notification tray.
                        if (e.coldstart)
                            console.log('--COLDSTART NOTIFICATION--');
                        else
                            console.log('--BACKGROUND NOTIFICATION--');
                    }
                    break;
                case 'error':
                    _this.deferred.resolve();
                    break;
                default:
                    _this.deferred.resolve();
                    break;
            }
        }
    });