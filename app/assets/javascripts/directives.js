angular.module('ParkingSpace.directives')

    .directive('placesAutocomplete', ['$window', '$q', function ($window, $q) {
        function load_script() {
            let s = document.createElement('script'); // use global document since Angular's $document is weak
            s.onload = function () {
                window.loadMaps()
            };
            s.src = 'https://maps.googleapis.com/maps/api/js?key=AI' +
                'zaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY&libraries=ge' +
                'ometry,places&language=ro';
            document.body.appendChild(s);
            window.gmapLoaded = true;
        }

        window.gmapLoaded = false;

        function lazyLoadApi(key) {
            let deferred = $q.defer();
            window.loadMaps = function () {
                deferred.resolve();
            };
            return deferred.promise;
        }


        return {
            restrict: 'E',
            scope: {
                selectedPlace: '&',
                placeHolder: '=',
                cssClass: '='
            },
            template: '' +
                '<input type="text" ' +
                '        id="pac-input" ' +
                '        class="form-control form-control-lg"' +
                '        ng-model="address"' +
                '        ng-keyup="cancel($event)"' +
                '        placeholder="{{placeHolder}}">' +
                '  <i class="fa fa-close clear-btn" ' +
                '       ng-click="address=\'\'" ' +
                '       ng-show="address.length > 3"></i>\n',
            link: function ($scope, elm, attr) {
                function initAutocomplete() {
                    let input = $(elm).find('#pac-input');
                    let options = {componentRestrictions: {country: 'ro'}}

                    // Bias the autocomplete object to bucharest for now
                    let bnds = new google.maps.Circle({
                        center: {
                            lat: 44.4115726,
                            lng: 26.11414
                        },
                        radius: 35000 //35 km
                    });
                    let searchBox = new google.maps.places.Autocomplete(input[0], options);
                    searchBox.setBounds(bnds.getBounds());

                    searchBox.addListener('place_changed', function () {
                        let place = searchBox.getPlace();
                        if (place)
                            $scope.selectedPlace({
                                place: place.address_components,
                                location: place.geometry.location
                            });
                        $scope.$apply();
                    });

                    if ($(window).width() <= 768)
                        input.focus(() => {
                            $('body').scrollTo($('.search-block'));
                        });

                }


                if ($window.google && $window.google.maps) {
                    initAutocomplete();
                } else {
                    if (!gmapLoaded)
                        load_script();
                    lazyLoadApi().then(function () {
                        if ($window.google && $window.google.maps) {
                            initAutocomplete();
                        } else {
                            console.log('gmaps not loaded');
                        }
                    }, function () {
                        console.log('promise rejected');

                    });
                }


            }
        }
    }])

    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

;
