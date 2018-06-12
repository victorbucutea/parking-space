angular.module('ParkingSpaceMobile.directives', [])

    .directive('map', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&',
                onError: '&',
            },
            link: function ($scope, $element, $attr) {
                // bad internet, a message should be shown
                // to warn the user. No sense to initialize the map.
                if (!window.google || !window.google.maps) {
                    $scope.onError();
                    return;
                }



                function initialize() {
                    let mapOptions = {
                        center: new google.maps.LatLng(44.412, 26.113),
                        zoom: 18,
                        minZoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        scaleControl: false,
                        rotateControl: false,
                        disableDefaultUI: true,
                        gestureHandling: 'greedy',
                        clickableIcons: false
                    };
                    let map = new google.maps.Map($element[0], mapOptions);
                    let overlay = new google.maps.OverlayView();
                    overlay.setMap(map);
                    overlay.draw = function () {
                    };

                    let geocoder = new google.maps.Geocoder();

                    $scope.onCreate({map: map, overlay: overlay, geocoder: geocoder});
                }

                initialize();
            }
        };
    }])

    .directive('productTable', function () {
        return {
            restrict: 'E',
            scope: {
                offer: '=',
                space: '=',
            },
            template:

            '<table class="table table-hover table-sm">' +
            '<thead>' +
            '    <tr>' +
            '        <th>Produs</th>' +
            '        <th class="text-center">Pret</th>' +
            '        <th class="text-center">Pret cu TVA</th>' +
            '    </tr>' +
            '</thead>' +
            '<tbody>' +
            '    <tr>' +
            '        <td><em>Închirere spatiu </em></td>' +
            '        <td class="text-center">{{offer.amount }} {{space.currency}}</td>' +
            '        <td class="text-center">{{offer.amount_with_vat}} {{space.currency}}</td>' +
            '    </tr>' +
            '    <tr>' +
            '        <td><em>Comision(8% + 2.5)</em></h4></td>' +
            '        <td class="text-center">{{offer.comision}} {{space.currency}}</td>' +
            '        <td class="text-center">{{offer.comision_with_vat}} {{space.currency}}</td>' +
            '    </tr>' +
            '    <tr>' +
            '        <td>   </td>' +
            '        <td class="text-right"><h5><strong>Total: </strong></h5></td>' +
            '        <td class="text-center text-danger">' +
            '           <h5><strong>' +
            '               {{ offer.amount_with_vat - 0 + offer.comision_with_vat }} {{space.currency}} ' +
            '           </strong></h5>' +
            '</td>' +
            '    </tr>' +
            '</tbody></table>'
        }
    })

    .directive('placesAutocomplete', function () {
        return {
            restrict: 'E',
            scope: {
                selectedPlace: '&',
                placeHolder: '='
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
                // bad internet, a message should be shown
                // to warn the user. No sense to initialize the map.
                if (!window.google || !window.google.maps) return;


                let input = $(elm).find('#pac-input')[0];
                let searchBox = new google.maps.places.Autocomplete(input);

                // Bias the autocomplete object to bucharest for now
                let bnds = new google.maps.Circle({
                    center: {
                        lat: 44.4115726,
                        lng: 26.11414
                    },
                    radius: 35000 //35 km
                });
                searchBox.setBounds(bnds.getBounds());

                searchBox.addListener('place_changed', function () {
                    let place = searchBox.getPlace();
                    $scope.selectedPlace({
                        place: place.address_components,
                        location: place.geometry.location
                    });
                    $scope.$apply();
                });

                $scope.$watch('address', function (newVal, oldVal) {
                    // address will change on blur
                    if (!newVal) {
                        $scope.selectedPlace({place: null});
                    }
                })
            }
        }
    })

    .directive('searchCenterIcon', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                shown: '='
            },
            restrict: 'E',
            template: '<div ' +
            '               ng-show="shown"' +
            '               id="searchCenterIcon" ' +
            '               class="search-center-icon animated bounce"' +
            '               </div>',
            link: function ($scope, $element, $attr) {

                // bad internet, a message should be shown
                // to warn the user. No sense to initialize the map.
                if (!window.google || !window.google.maps) {
                    return;
                }

                let start = google.maps.event.addListener($rootScope.map, 'dragstart', () => {
                    $('#searchCenterIcon').addClass('shadow');
                });
                let end = google.maps.event.addListener($rootScope.map, 'dragend', () => {
                    $('#searchCenterIcon').removeClass('shadow');

                });

                $scope.$watch('shown', (newVal) => {
                    if (newVal === false) {
                        google.maps.event.removeListener(start);
                        google.maps.event.removeListener(end);
                    }
                })

            }
        }
    }])

    .directive('parkingSpotInfoBox', function () {
        return {
            restrict: 'E',
            template:
            '<div class="parking-spot-details p-0 p-md-2 d-flex ">' +
            '          <div ng-click="showFullImage=true" class="d-flex" style="overflow: hidden">' +
            '            <cl-image public-id="{{space.file1}}" ng-show="space.file1" class="img-thumbnail p-0 thumbnail"></cl-image>' +
            '            <cl-image public-id="{{space.file2}}" ng-show="space.file2" class="img-thumbnail p-0 thumbnail"></cl-image>' +
            '          </div>' +
            '          <div class="ml-3" >' +
            '              <h2 class="text-truncate"><i class="fa fa-car"></i> {{space.title}}</h2>' +
            '              <p>{{space.address_line_1}} ' +
            '                     <br  />' +
            '                 {{space.address_line_2}} ' +
            '              </p>' +
            '              <h1>' +
            '                  {{space.price | units  }}.<small>{{space.price | subunits}}</small> ' +
            '                  <currency val="space.currency"></currency> / h' +
            '              </h1>' +
            '          </div>' +
            '</div>' +
            ' <div class="ps-modal image pt-2 text-center" ng-show="showFullImage" ng-init="showFullImage=false">' +
            '    <cl-image public-id="{{space.file1}}" class="img-fluid mb-1 animated zoomIn"></cl-image>' +
            '    <cl-image public-id="{{space.file2}}" class="img-fluid mb-1 animated zoomIn"></cl-image>' +
            '    <cl-image public-id="{{space.file3}}" class="img-fluid mb-1"></cl-image>' +
            '    <span>{{space.description}}</span>' +
            ' </div>',
            scope: {
                space: '=',
                thumbnailModal: '='
            },
            link: function ($scope, elm) {

                $(elm).find('.parking-spot-details').click(evt => {
                    let isRoot = $(evt.currentTarget).hasClass('parking-spot-details');
                    if (isRoot && !$scope.thumbnailModal) {
                        $scope.showFullImage = true;
                        $scope.$evalAsync();
                    }
                });

                $(elm).find('.ps-modal').click((evt) => {
                    evt.stopPropagation();
                    $scope.showFullImage = false;
                    $scope.$evalAsync();
                });

            }
        }
    })

    .directive('smallParkingSpotInfoBox', function () {
        return {
            restrict: 'E',
            template: ' ' +
            '<div class="space-summary-content py-2 d-flex d-sm-none align-items-center" ng-click="showFullImage = true">' +
            '          <div class="d-flex">' +
            '           <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/{{space.file1}}" ng-show="space.file1" class="img-thumbnail p-0 thumbnail">' +
            '           <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/{{space.file2}}" ng-show="space.file1" class="img-thumbnail p-0 thumbnail">' +
            '          </div>' +
            '          <div class="ml-3">' +
            '            <h4 class="text-truncate">{{space.price | units }}.' +
            '              <small>{{space.price | subunits}}</small>' +
            '              {{space.currency}}/h' +
            '            </h4>' +
            '            <p class="text-truncate">{{space.address_line_1}}</p>' +
            '            <u class="text-secondary">Mai multe ...</u>' +
            '          </div>' +
            '</div>' +
            ' <div class="ps-modal p-1 " ng-show="showFullImage">' +
            '    <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/{{space.file1}}" ' +
            '         class="img-fluid mb-1 animated zoomIn">' +
            '    <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/{{space.file2}}" ' +
            '         class="img-fluid mb-1 animated zoomIn">' +
            '    <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/{{space.file3}}" ' +
            '         class="img-fluid mb-1 animated zoomIn">' +
            '    <span>{{space.description}}</span>' +
            ' </div>',
            scope: {
                space: '='
            },
            link: function ($scope, elm) {
                $scope.cloudName = window.cloudinaryName ;
                $(elm).find('.ps-modal').click((evt) => {
                    evt.stopPropagation();
                    $scope.showFullImage = false;
                    $scope.$evalAsync();
                })
            }
        }
    })

    .directive('bidAmount', ['currencies', function (currencies) {
        return {
            restrict: 'E',
            scope: {
                bidAmount: '=',
                bidCurrency: '='
            },
            template:
            ' <div class="row no-gutters align-items-center">' +
            '<div class="col-8 col-sm-7 col-md-6 d-flex align-items-center">' +
            '<a class="fa fa-caret-left fa-5x" ng-click="decrease()"></a>' +
            '<input type="number" maxlength="3" ng-model="bidAmount" class="form-control" required>' +
            '<a class="fa fa-caret-right fa-5x" ng-click="increase()" style=""></a>' +
            '</div>' +
            '<div class="col-4 col-sm-5 col-md-5">' +
            '<select ng-model="bidCurrency" ' +
            '   ng-options="bidCurrency.name as bidCurrency.label for bidCurrency in currencies" ' +
            '   class="form-control form-control-lg"' +
            '   required> </select>' +
            '</div>' +
            '</div>',

            link: function ($scope, element, attrs) {
                $scope.currencies = currencies;

                $scope.increase = function () {
                    if (!$scope.bidAmount) {
                        $scope.bidAmount = 0;
                    }
                    $scope.bidAmount++;
                };

                $scope.$watch('bidAmount', function (newVal, oldVal) {
                    if (!$scope.bidAmount) {
                        return;
                    }

                    if (!newVal) {
                        $scope.bidAmount = 0;
                    }

                    if (newVal >= 100) {
                        $scope.bidAmount = 100;
                    }

                    if (newVal < 0) {
                        $scope.bidAmount = 0;
                    }
                });

                $scope.decrease = function () {
                    if (!$scope.bidAmount) {
                        $scope.bidAmount = 0;
                    }
                    $scope.bidAmount--;
                };

            }
        }
    }])

    .directive('currency', ['currencies', function (currencies) {
        return {
            restrict: 'E',
            template: '<span> <i class="fa" ng-class="currSym"></i> {{currName}} </span>',
            scope: {
                val: '='
            },
            link: function ($scope) {

                let display = function (newVal) {
                    if (!newVal)
                        return;

                    let currency = $.grep(currencies, function (cur) {
                        return newVal === cur.name;
                    });


                    if (currency[0] && currency[0].icon) {
                        $scope.currSym = currency[0].icon;
                        $scope.currName = null;
                    } else {
                        $scope.currName = currency[0].name;
                        $scope.currSym = null;
                    }
                };

                display($scope.val);
                $scope.$watch('val', function (newVal) {
                    display(newVal);
                });
            }
        }
    }])

    .directive('dateTime', function () {
        let template = '<input ' +
            '       type="text" ' +
            '       class="form-control"' +
            '       required>';

        if (isMobileOrTablet()) {
            template = '<input ' +
                '       type="datetime-local" ' +
                '       class="form-control"' +
                '       min="' + moment().startOf('h').format('YYYY-MM-DD[T]HH:mm:ss.ms') + '"' +
                '       ng-model="dateModel"' +
                '       required>';
        }
        return {
            restrict: 'E',
            scope: {
                dateModel: '=',
                day: '='
            },
            compile: function (element, attrs) {
                return {
                    post: function ($scope, elm) {
                        if (isMobileOrTablet()) {
                            return;
                        }
                        elm = $(elm);

                        $scope.$watch('dateModel', function (newVal) {
                            elm.data('daterangepicker').setStartDate(moment(newVal));
                            elm.data('daterangepicker').setEndDate(moment(newVal));

                        });

                        elm.daterangepicker({
                            "singleDatePicker": true,
                            "minDate": moment().startOf('h'),
                            "autoApply": true,
                            "timePicker": true,
                            "timePicker24Hour": true,
                            "timePickerIncrement": 15,
                            "applyClass": "apply",
                            "cancelClass": "cancel",
                            "locale": {
                                "format": "DD MMM [(h)] HH:mm",
                                "separator": " până la ",
                                "applyLabel": "Ok",
                                "cancelLabel": "Anulează",
                                "fromLabel": "De la",
                                "toLabel": "Până la",
                                "customRangeLabel": "Custom",
                                "weekLabel": "S",
                                "daysOfWeek": [
                                    "Du",
                                    "Lu",
                                    "Ma",
                                    "Mi",
                                    "Jo",
                                    "Vi",
                                    "Sâ"
                                ],
                                "monthNames": [
                                    "Ianuarie",
                                    "Februarie",
                                    "Martie",
                                    "Aprilie",
                                    "Mai",
                                    "Iunie",
                                    "Iulie",
                                    "August",
                                    "Septembrie",
                                    "Octombrie",
                                    "Noiembrie",
                                    "Decembrie"
                                ]
                            },

                        }, function (start, end, label) {
                            $scope.dateModel = start.toDate();
                            $scope.$evalAsync();
                        });

                    }
                }
            },
            replace: true,
            template: template

        };
    });
