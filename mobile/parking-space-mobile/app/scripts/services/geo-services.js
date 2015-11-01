/**
 * Created by 286868 on 04.04.2015.
 */

angular.module('ParkingSpaceMobile.services')

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
    });
