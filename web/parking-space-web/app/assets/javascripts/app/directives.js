'use strict';

angular.module('ParkingSpaceMobile.directives', [])

    .directive('map', function (geolocationService) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function ($scope, $element, $attr) {
                function CenterControl(controlDiv, map) {

                    // Set CSS for the control border.
                    var controlUI = document.createElement('div');
                    $(controlUI).addClass('center-btn');
                    controlDiv.appendChild(controlUI);

                    // Set CSS for the control interior.
                    var controlText = document.createElement('div');
                    controlText.innerHTML = '<i class="ion-android-locate" ></i>';
                    controlUI.appendChild(controlText);

                    // Setup the click event listeners: simply set the map to Chicago.
                    controlUI.addEventListener('click', function () {
                        geolocationService.getCurrentLocation(function (position) {
                            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            map.setCenter(pos);
                        });
                    });

                }

                function initialize() {
                    var mapOptions = {
                        center: new google.maps.LatLng(44.412, 26.113),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        zoomControl: false,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                        },
                        mapTypeControl: false,
                        scaleControl: false,
                        rotateControl: false,
                        disableDefaultUI: true
                    };
                    var map = new google.maps.Map($element[0], mapOptions);

                    var centerControlDiv = document.createElement('div');
                    var centerControl = new CenterControl(centerControlDiv, map);
                    centerControlDiv.index = 1;
                    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(centerControlDiv);
                    var overlay = new google.maps.OverlayView();
                    overlay.setMap(map);
                    overlay.draw = function () {
                    };

                    var geocoder = new google.maps.Geocoder();

                    $scope.onCreate({map: map, overlay: overlay, geocoder: geocoder});
                }

                initialize();
            }
        };
    })

    .directive('searchCenterIcon', function () {
        return {
            restrict: 'E',
            template: '<div id="searchCenterIcon" class="search-center-icon"></div>',
            link: function ($scope, $element, $attr) {
                var height = $element.height();
                $element.find('.search-center-icon').css('margin-top', height / 2);
            }
        }
    })

    .directive('parkingSpotInfoBox', function (ENV) {
        return {
            restrict: 'E',
            template: '<div class="parking-spot-details p-0 p-md-2" >' +
            '    <div ng-show="space">' +
            '        <h2><i class="fa fa-car"></i> {{space.title}}</h2>' +
            '        <p>{{space.address_line_1}} ' +
            '               <br  />' +
            '           {{space.address_line_2}} ' +
            '        </p>' +
            '        <h1>' +
            '            {{space.price | units  }}.<small>{{space.price | subunits}}</small> ' +
            '            <currency val="space.currency"></currency>' +
            '               / h' +
            '        </h1>' +
            '    </div>' +
            '</div>',
            scope: {
                space: '=',
                hideThumbnail: '@'
            }
        }
    })

    .directive('bidAmount', function (currencies) {
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
                    '<input type="number" ng-model="bidAmount" class="form-control ">' +
                    '<a class="fa fa-caret-right fa-5x" ng-click="increase()" style=""></a>' +
                '</div>' +
                '<div class="col-4 col-sm-5 col-md-5">' +
                    '<select ng-model="bidCurrency" ' +
                'ng-options="bidCurrency.name as bidCurrency.label for bidCurrency in currencies" ' +
                'class="form-control form-control-lg"> </select>' +
                '</div>' +
            '</div>',
            controller: function ($scope) {
                $scope.currencies = currencies;
            },

            link: function ($scope, element, attrs) {

                $(element).on('focus', (evt) => {
                    console.log('focus', evt);
                });

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
    })

    .directive('currency', function (currencies) {
        return {
            restrict: 'E',
            template: '<span> <i class="fa" ng-class="currSym"></i> {{currName}} </span>',
            scope: {
                val: '='
            },
            link: function ($scope) {

                var display = function (newVal) {
                    if (!newVal)
                        return;

                    var currency = $.grep(currencies, function (cur) {
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
    })

    .directive('ngRepeatFinish', function () {
        return function (scope, element, attrs) {
            var clbk = attrs.ngRepeatFinish;
            if (scope.$last) {
                console.log('calling ', clbk, ' on ', scope);
                if (scope[clbk])
                    scope[clbk]();
            }
        }
    })

    .directive('dateTime', function () {
        return function ($scope, element, attrs) {
            let elm = $(element);
            let model = attrs.ngDateModel.split(".");

            let moment2 = moment();
            let rangePicker = elm.daterangepicker({
                "singleDatePicker": true,
                "minDate": moment2,
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
                if (model.length === 1) {
                    $scope[model[0]] = start;
                } else {
                    $scope[model[0]][model[1]] = start.toDate();
                }
                elm.removeClass('is-invalid');

            });

            elm.on('show.daterangepicker', function (ev, picker) {
                let winHeight = $(window).height();
                let pickerHeight = picker.container.height();
                let pickerOffset = picker.container.offset().top;
                let alreadyScrolled = $(window).scrollTop();
                let scrollAmount = pickerOffset + pickerHeight - winHeight;

                if (scrollAmount - alreadyScrolled > 0) {
                    $('html, body').animate({
                        scrollTop: scrollAmount + 10
                    }, 200);
                }
            });

            if (attrs.day !== undefined) {
                moment2 = moment2.add(1, 'd');
            }

            elm.data('daterangepicker').setStartDate(moment2);
            elm.data('daterangepicker').setEndDate(moment2);

            if (model.length === 1) {
                $scope[model[0]] = moment2.toDate();
            } else {
                $scope[model[0]][model[1]] = moment2.toDate();
            }

        }

    });
