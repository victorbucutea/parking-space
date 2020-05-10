/**
 * Created by 286868 on 04.04.2015.
 */

angular.module('ParkingSpace.services')


    .service('geoService', ['$rootScope', 'GEOCODE_API_URL', '$http', function ($rootScope, GEOCODE_API_URL, $http) {
        let _this = this;

        _this.autocompleteAddress = (searchStr, clbk) => {
            let service = new google.maps.places.AutocompleteService();
            let sw = new google.maps.LatLng({lat: 44.308127, lng: 20.146866});
            let ne = new google.maps.LatLng({lat: 47.872144, lng: 29.617081});
            let countryBounds = new google.maps.LatLngBounds(sw, ne);

            service.getQueryPredictions({
                    input: searchStr,
                    bounds: countryBounds,
                }, (predictions, status) => {
                    if (clbk)
                        clbk(predictions, status)

                }
            );
        };

        _this.getCurrentPosition = (clbk) => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition((position) => {
                if (!position.coords.latitude || !position.coords.longitude) {
                    return;
                }
                let pos = {lat: position.coords.latitude, lng: position.coords.longitude};
                if (clbk) {
                    clbk(pos);
                }
            });
        };

        _this.reverseGeocode = (lat, lng, clbk, errClbk) => {

            let url = GEOCODE_API_URL + "&latlng=" + lat + "," + lng;
            $http.get(url).then((result) => {
                let res = result.data.results[0].formatted_address;
                if (clbk) clbk(res);
            }, errClbk);
        };

        _this.getPositionForPlace = (place, clbk) => {
            let placesService = new google.maps.places.PlacesService(new google.maps.Map(document.createElement('div')));
            placesService.getDetails({placeId: place}, function (resp) {
                if (clbk)
                    clbk({
                        lat: resp.geometry.location.lat(), lng: resp.geometry.location.lng()
                    });
            });
        };

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
