angular.module('ParkingSpaceMobile.services', [])

    .service('geolocationService', function () {

        function onError(error) {
            console.error('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n', error);
        }

        this.getCurrentLocation = function (clbkOk, clbkErr) {
            var onSuccess = function (position) {
                console.log('Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n');
                if (clbkOk) {
                    clbkOk(position);
                }

            };
            navigator.geolocation.getCurrentPosition(onSuccess, clbkErr || onError);
        }
    })


    .service('geocoderService', function ($rootScope) {
        this.getAddress = function (lat, lng, clbk) {
            var latLng = {
                'latLng': new google.maps.LatLng(lat, lng)
            };


            $rootScope.geocoder.geocode(latLng, function (result) {
                if (!result)
                    return;

                var topAddr = result[0].address_components;
                var resultAddr = {};

                $.each(topAddr, function (idx, comp) {

                    switch (comp.types[0]) {
                        case 'street_number':
                            resultAddr.street_number = comp.short_name;
                            break;
                        case 'route':
                            resultAddr.street = comp.short_name;
                            break;
                        case 'sublocality_level_1':
                            resultAddr.sublocality = comp.long_name;
                            break;
                        case 'administrative_area_level_2':
                            resultAddr.administrative_area_level_2 = comp.long_name;
                            break;
                        case 'administrative_area_level_1':
                            resultAddr.administrative_area_level_1 = comp.long_name;
                            break;
                        case 'locality':
                            resultAddr.city = comp.long_name;
                            break;
                    }

                    switch (comp.types[1]) {
                        case 'sublocality':
                            resultAddr.sublocality = comp.short_name;
                            break;
                    }
                });

                clbk(resultAddr);
            });
        }
    })

    .service('authenticationService', function ($http) {
    })

    .service('errorHandlingService', function ($rootScope) {

        this.handle = function (data, status) {
            if (status == 420 || status == 422) { // 420  || 422 is an error status with business message
                // transform error response into a manageable obj
                var errMsgs = [];
                var i = 0;
                for (item in data.Error) {
                    var fieldName = item == 'general' ? '' : item;
                    errMsgs[i] = {fieldName: fieldName, text: data.Error[item][0]};
                    i++;
                }
                $rootScope.$broadcast('http.error', errMsgs);
            } else {
                $rootScope.$broadcast('http.error', {fieldName: '', text: 'Connectivity error.'});
            }
            $('.loading-spinner').hide();
        }
    })

/**
 * service provides a unique terminal and user identifier
 * should cache user credentials
 * device information - should be ignored in favor of auth info + phone no
 */
    .service('deviceAndUserInfoService', function () {
        // TODO fill in these fields on auth ( or make user insert them ? )
        this.phoneNo = '40727456250';
        this.userName = 'victor.bucutea@gmail.com';
        this.deviceId = this.phoneNo + "_" + this.userName;
    })


    .service('parkingSpaceService', function ($rootScope, $http, ENV, deviceAndUserInfoService, errorHandlingService) {

        this.getAvailableSpaces = function (lat, lng, range, clbk) {

            $('.loading-spinner').show();
            $('.loading-finished').hide();

            $http.get(ENV + 'parking_spaces.json?lat=' + lat + '&lon=' + lng + '&range=' + range)
                .success(function (data) {
                    console.log(data);
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                    $('.loading-finished').show();
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

        this.getMyOffers = function() {
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
        }

        this.saveSpace = function (space, clbk) {

            // massage space a to fit the back end model
            space.target_price = space.price;
            space.target_price_currency = space.currency;
            space.phone_number = deviceAndUserInfoService.phoneNo;
            space.deviceid = deviceAndUserInfoService.deviceId;
            space.owner_name = deviceAndUserInfoService.userName;
            if (space.short_term)
                space.interval = 1;
            else
                space.interval = 0;


            var loading = $('.loading-spinner');
            loading.show();
            $http.post(ENV + 'parking_spaces.json', space)
                .success(function (data) {
                    //TODO show mesage with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Parking space saved!');
                    loading.hide();
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

    .service('messageService', function ($rootScope, $http, $timeout, ENV, deviceAndUserInfoService) {
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

    .service('offerService', function ($http, $timeout, ENV, deviceAndUserInfoService, $rootScope, errorHandlingService) {

        this.placeOffer = function (bid, spaceId, clbk) {
            bid.phone_number = deviceAndUserInfoService.phoneNo;
            bid.deviceid = deviceAndUserInfoService.deviceId;
            bid.bidder_name = deviceAndUserInfoService.userName;
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

/**
 * provides back-end parameters
 * 2. short_term_expiration: 10 # minutes
 * 3. max_search_radius: 1200
 * 4. long_term_expiration: 2 # weeks
 * 5. default_range: 500
 * 6. starting currency
 * 7. starting asking price
 */
    .service('parameterService', function ($http, ENV, deviceAndUserInfoService) {

        var _this = this;

        _this.parameters = {};


        // TODO. Order of init is: 1. init from client side defaults, 2. init from local storage, 3. init from async call ( if internet av.)
        var httpResp = JSON.parse($.ajax({
            type: "GET",
            url: ENV + 'parameters.json?deviceid=' + deviceAndUserInfoService.deviceId,
            async: false
        }).responseText);

        httpResp.forEach(function (item) {
            _this.parameters[item.name] = item.default_value;
            if (item.values && item.values.length) {
                _this.parameters[item.name + '_values'] = item.values
            }
        });

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
        }
    })

    .factory('imageResizeFactory', function () {
        return function (base64img, newWidth, newHeight) {

            // create an off-screen canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(base64img, 0, 0, newWidth, newHeight);

            // encode image to data-uri with base64 version of compressed image
            data = canvas.toDataURL();
            canvas.parentNode.removeChild(canvas);
            return data;
        }
    })

    .factory('currencyFactory', function (currencies) {

        this.getCurrency = function (curName) {
            var currency = $.grep(currencies, function (cur) {
                return curName == cur.name;
            });


            if (currency[0] && currency[0].icon) {
                return currency[0].icon;
            } else {
                return null;
            }
        };

        return this;
    })

    .factory('replaceById', function () {
        return function (item, collection) {
            if (!collection || !item) {
                return;
            }
            var i = 0;
            var idx = 0;
            collection.forEach(function (colItem) {
                if (colItem.id == item.id) {
                    idx = i;
                }
                i++;
            });
            collection[idx] = item;
        };
    });

