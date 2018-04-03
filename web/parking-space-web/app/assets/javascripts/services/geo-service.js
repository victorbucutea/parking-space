angular.module('ParkingSpace.services')

    .service('geoService', ['$rootScope', '$http', 'GEOCODE_API_URL', 'countryBounds', function ($rootScope, $http, GEOCODE_API_URL, countryBounds) {

        let service = new google.maps.places.AutocompleteService();
        let placesService = new google.maps.places.PlacesService(new google.maps.Map(document.createElement('div')))
        let _this = this;

        this.autocompleteAddress = (searchStr, clbk) => {

            service.getQueryPredictions({
                    input: searchStr,
                    bounds: countryBounds
                }, (predictions, status) => {
                    if (clbk)
                        clbk(predictions, status)

                }
            );
        };

        this.reverseGeocode = (lat, lng, clbk, errClbk) => {

            let url = GEOCODE_API_URL + "&latlng=" + lat + "," + lng;
            $http.get(url).then((result) => {
                let res = result.data.results[0].formatted_address;
                if (clbk) clbk(res);
            }, errClbk);
        };

        this.getCurrentPosition = (clbk) => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition((position) => {
                if (!position.coords.latitude || !position.coords.longitude) {
                    return;
                }
                let pos = {lat: position.coords.latitude, lng: position.coords.longitude};
                _this.reverseGeocode(pos.lat, pos.lng, (result) => {
                    if (clbk) {
                        clbk(result, position);
                    }
                })
            });
        };

        this.getPositionForPlace = (place, clbk) => {
            placesService.getDetails({placeId: place}, function (resp) {
                if (clbk)
                    clbk({
                        lat: resp.geometry.location.lat(), lng: resp.geometry.location.lng()
                    });
            });
        }
    }]);