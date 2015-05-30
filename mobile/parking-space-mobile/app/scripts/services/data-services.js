angular.module('ParkingSpaceMobile.services', [])

    .service('parkingSpaceService', function ($rootScope, $http, ENV, userService, errorHandlingService) {

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
                        errClbk(data,status);
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
            space.target_price = space.price;
            space.target_price_currency = space.currency;
            space.phone_number = userService.getUser().phone_number;
            space.deviceid = userService.getUser().device_id;
            space.owner_name = userService.getUser().full_name;
            if (space.short_term)
                space.interval = 1;
            else
                space.interval = 0;


            var loading = $('.loading-spinner');
            loading.show();

            var url = space.id ? ENV + 'parking_spaces/'+space.id+'.json' : ENV + 'parking_spaces.json' ;
            var restCall = space.id ? $http.put(url, space) : $http.post(url, space);

            restCall.success(function (data) {
                    //TODO show mesage with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Parking space saved!');
                    loading.hide();
                    if(clbk) {
                        clbk(data);
                    }
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                })
        };

        this.deleteSpace = function (spaceId, clbk) {
            $('.loading-spinner').show();
            $http.delete(ENV + 'parking_spaces/' + spaceId + '.json')
                .success(function (data) {
                    $rootScope.$broadcast('http.notif', 'Parking space deleted!');
                    $('.loading-spinner').hide();
                    if (clbk) {
                        clbk(data);
                    }
                })
                .error(function (data) {
                    errorHandlingService.handle(data, status);
                })

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
            bid.phone_number = userService.getUser().phone_number;
            bid.deviceid = userService.getUser().device_id;
            bid.bidder_name = userService.getUser().full_name;
            bid.parking_space_id = spaceId;

            $http.post(ENV + 'parking_spaces/' + spaceId + '/proposals.json', bid)
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Bid placed!');
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
                    $rootScope.$broadcast('http.notif', 'Accepted offer for ' + offer.price + ' ' + offer.currency);
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
                    $rootScope.$broadcast('http.notif', 'Rejected offer for ' + offer.price + ' ' + offer.currency);
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

        this.retrieveParameters = function(okClbk, errClbk){
            $http.get(ENV+'parameters.json')
                .success(function (data) {
                   _this.setParameters(data);
                    if (okClbk) {
                        okClbk(data);
                    }
                })
                .error(function (data, status) {
                    if (errClbk) {
                        errClbk(data,status);
                    }
                })

        };

        this.setParameters = function(params){
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

        this.getCountryListAsync = function(clbk) {
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
    });