angular.module('ParkingSpaceMobile.services', [])

    .service('geolocationService', function () {

        function onError(error) {
            console.error('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        this.getCurrentLocation = function (clbkOk) {
            var onSuccess = function (position) {
                console.log('Latitude: ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n');
                if (clbkOk) {
                    clbkOk(position);
                }
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
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


    .service('parkingSpaceService', function ($rootScope, $http, $timeout) {

        this.getAvailableSpaces = function (lat, lng, clbk) {
            $timeout(function () {

                spaces.forEach(function (item) {
                    var saltValue = Math.random() * 0.003;
                    saltValue *= Math.round(Math.random()) ? 1 : -1;
                    item.position = {lat: lat + saltValue, lng: lng + saltValue};
                    item.rotation = Math.round(Math.random() * 180);
                });
                var tempSpaces = spaces.filter(function (item) {
                    return Math.round(Math.random());
                });
                clbk(tempSpaces);
            }, 500);
        };

        var spaces = [
            {   'img': 'images/cellar.jpg',
                'title': 'Loc la strada',
                'short_term': true,
                'address_line_1': 'Calea Vacaresti nr 232',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 5,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            },
            {   'img': 'images/cellar.jpg',
                'title': '1 saptamana',
                'short_term': true,
                'address_line_1': 'Calea Vacaresti nr 234',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 12,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            },
            {   'img': 'images/cellar.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            },
            {   'img': 'images/meeting.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            },
            {   'img': 'images/meeting.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            },
            {   'img': 'images/meeting.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'currency': 'Eur',
                'post_date': 1417345792168,
                'owner_name': 'someone@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
            }
        ];
    })


    .factory('modalFactory', function ($ionicModal) {


        this.createModal = function (templateName, $scope,scopeModalName, saveClbk, showClbk, closeClbk ) {

            if (!scopeModalName) {
                scopeModalName = 'modal';
            }

            $ionicModal.fromTemplateUrl(templateName, {
                scope: $scope,
                animation: 'fade-in'
            }).then(function (modal) {
                $scope[scopeModalName] = modal;
            });

            $scope.show = function () {
                $scope[scopeModalName].show();
                if (showClbk)
                    showClbk(arguments);
            };

            $scope.close = function () {
                $scope[scopeModalName].hide();
                if (closeClbk)
                    closeClbk(arguments)
            };

            $scope.save = function () {
                $scope[scopeModalName].hide();
                if (saveClbk)
                    saveClbk(arguments);
            };

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope[scopeModalName].remove();
            });
        };

        return this;
    });