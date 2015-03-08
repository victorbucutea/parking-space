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

/**
 * service provides a unique terminal and user identifier
 * should cache user credentials
 * device information - should be ignored in favor of auth info + phone no
 */
    .factory('deviceAndUserInfoService', function () {
        return 'deviceid_userid_phoneno';
    })

    .service('parkingSpaceService', function ($rootScope, $http, ENV, deviceAndUserInfoService, geolocationService) {

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
                .error(function (data, status, headers, config) {
                    var error = 'Connectivity error.';
                    // TODO replace broadcast with direct manipulation
                    // implement same mechanism on save with different message

                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    $rootScope.$broadcast('http.error', "", error);
                });
        };

        this.getMySpaces = function (clbk) {
            $('.loading-spinner').show();
            $('.loading-finished').hide();

            $http.get(ENV + 'parking_spaces/myevents.json?deviceid='+deviceAndUserInfoService)
                .success(function (data) {
                    console.log(data);
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status, headers, config) {
                    var error = 'Connectivity error.';
                    // TODO replace broadcast with direct manipulation
                    // implement same mechanism on save with different message

                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    $rootScope.$broadcast('http.error', "", error);
                });
        };

        this.saveSpace = function (space, clbk) {

            // massage space a to fit the back end model
            space.target_price = space.price;
            space.target_price_currency = space.currency;
            // TODO fill in these fields on auth ( or make user insert them ? )
            space.phone_number = '+40727456250';
            space.deviceid = deviceAndUserInfoService;
            space.owner_name = 'TODO';
            if (space.short_term)
                space.interval = 1;
            else
                space.interval = 0;


            $('.loading-spinner').show();
            $http.post(ENV + 'parking_spaces.json', space)
                .success(function (data) {
                    //TODO show mesage with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Parking space saved!');
                    $('.loading-spinner').hide();
                })
                .error(function (data, status) {
                    var error = 'Connectivity error.';
                    // TODO replace broadcast with direct manipulation
                    // implement same mechanism on save with different message
                    $rootScope.$broadcast('http.error', "", error);
                    $('.loading-spinner').hide();
                })
        }

    })

    .service('messageService', function ($http, $timeout, deviceAndUserInfoService) {

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
                    clbk(messages);
            }, 1000)
        };

        this.sendMessage = function (postId, msg, clbk) {
            msg.deviceAndUserInfoService = deviceAndUserInfoService;
            messages.push(msg);
            this.getMessages(postId, clbk);
        }
    })

    .service('offerService', function ($http, $timeout, ENV, deviceAndUserInfoService, $rootScope) {

        this.placeOffer = function (bid, spaceId, clbk) {
            // TODO fill in these fields on auth ( or make user insert them ? )
            bid.phone_number = '+40727456250';
            bid.deviceid = deviceAndUserInfoService;
            bid.bidder_name = 'TODO';
            bid.parking_space_id = 2;


            $http.post(ENV + 'parking_spaces/' + spaceId + '/proposals.json', bid)
                .success(function (data) {
                    //TODO show mesage with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Bid placed!');
                    if (clbk)
                        clbk(data);
                })
                .error(function () {

                })
        };

        this.acceptOffer = function (offer, clbk) {

            $timeout(function () {
                offer.accepted = true;
                if (clbk)
                    clbk(offer);
            }, 1000)
        };

        this.cancelOffer = function (offer, clbk) {
            $timeout(function () {
                offer.accepted = false;
                if (clbk)
                    clbk(offer);
            }, 1000)
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
    .service('parameterService', function ($http, ENV) {

        var _this = this;

        _this.parameters = {};

        var httpResp = JSON.parse($.ajax({
            type: "GET",
            url: ENV + 'parameters.json',
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
    });

