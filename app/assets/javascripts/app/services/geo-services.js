/**
 * Created by 286868 on 04.04.2015.
 */

angular.module('ParkingSpaceMobile.services')

    .service('geolocationService', ['$rootScope', function ($rootScope) {
        let _this = this;
        _this.errorShowCounter = 0;

        function onError(error) {
            console.log('code: ' + error.code + ', message: ' + error.message, error);
            _this.error = error;
            if (error.code !== 1) {
                // TIMEOUT or position unavailable
                // fail silently because is unlikely to keep app open until he reaches gps signal
                // or it might be he enables location, in which case we won't have an error anymore
            } else {
                // PERMISSION DENIED
                // show a warning once every 5 times to remind user to enable location
                if (_this.errorShowCounter % 2 === 0) {
                    $rootScope.$emit("http.warning", "Pentru a găsi locurile din apropriere, permiteți " +
                        "folosirea locației din meniul browser-ului.");
                }
                _this.errorShowCounter++;
            }
        }

        let onSuccess = function (position) {
            if (position) {
                _this.position = position;
            }
        };

        this.initCurrentLocation = function (highAccuracy) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {
                timeout: 5000,
                enableHighAccuracy: highAccuracy
            });

        };

        this.getCurrentLocation = function (clbkOk, clbkErr) {
            if (clbkOk && _this.position) {
                clbkOk(_this.position);
                return;
            }
            // if position is not cached, interrogate navigator
            navigator.geolocation.getCurrentPosition(clbkOk, onError, {timeout: 5000, enableHighAccuracy: false});
        };

    }])


    .service('geocoderService', ['$rootScope', function ($rootScope) {
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
    }]);
