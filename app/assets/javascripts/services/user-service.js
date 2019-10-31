angular.module('ParkingSpace.services')

    .service('geoService', ['$rootScope', '$http', 'GEOCODE_API_URL', function ($rootScope, $http, GEOCODE_API_URL) {


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

        _this.reverseGeocode = (lat, lng, clbk, errClbk) => {

            let url = GEOCODE_API_URL + "&latlng=" + lat + "," + lng;
            $http.get(url).then((result) => {
                let res = result.data.results[0].formatted_address;
                if (clbk) clbk(res);
            }, errClbk);
        };

        _this.getCurrentPosition = (clbk) => {
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

        _this.getPositionForPlace = (place, clbk) => {
            let placesService = new google.maps.places.PlacesService(new google.maps.Map(document.createElement('div')));
            placesService.getDetails({placeId: place}, function (resp) {
                if (clbk)
                    clbk({
                        lat: resp.geometry.location.lat(), lng: resp.geometry.location.lng()
                    });
            });
        }
    }])

    .service('userService',
        ['$http', function ($http) {
            let _this = this;


            /* get current user details */
            _this.getUser = function (clbk) {

                $http.get('/users/edit.json')
                    .then(function (res) {
                        let data = res.data;
                        if (clbk)
                            clbk(data);
                    }, function (err) {
                        if (err.status == 401) {
                            sessionStorage.removeItem("current_user");
                        }
                        console.log(err);
                    });
            };


        }]);