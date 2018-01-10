'use strict';

angular.module('ParkingSpaceMobile.directives', [])

    .directive('map', function (geolocationService) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function ($scope, $element, $attr) {


                function initialize() {
                    let mapOptions = {
                        center: new google.maps.LatLng(44.412, 26.113),
                        zoom: 15,
                        minZoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        scaleControl: false,
                        rotateControl: false,
                        disableDefaultUI: true,
                        gestureHandling: 'greedy'
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
    })

    .directive('placesAutocomplete', function (geolocationService) {
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
                    $scope.selectedPlace(
                        {
                            place: place.address_components,
                            location: place.geometry.location
                        }
                    );
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
            controller: function ($scope) {
                $scope.currencies = currencies;
            },

            link: function ($scope, element, attrs) {


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

    .directive('uploadImage', function () {
        return {
            restrict: 'E',
            scope: {
                imageFile: '=',
                label: '=',
                optional: '=',
                control: '='

            },
            template:
            ' <div class="parking-sign pt-2 d-flex flex-column" ' +
            '       ngf-drop ' +
            '       ngf-select ' +
            '       ng-class="{secondary: optional}" ' +
            '       ng-hide="imageFile"' +
            '       ng-model="imageFile" ' +
            '       accept="image/*"' +
            '       ngf-max-size="2MB">' +
            '   <i class="fa fa-camera fa-3x"></i>' +
            '   <i class="text" ng-bind="label"></i>' +
            '</div>' +

            '<div ngf-thumbnail="imageFile" ' +
            '       ngf-as-background="true" ' +
            '       ng-click="showThumbnail=true"' +
            '       class="parking-sign"></div>' +

            '<div id="uploadProgressCont" class="progress-container">' +
            '   <div id="uploadProgressBar" ' +
            '        style="width: {{progress}}%" ' +
            '        class="progress-bar"' +
            '        ng-init="progress=0">' +
            '</div>' +
            '</div>' +

            '<button class="btn btn-sm btn-link btn-change-photo" ' +
            '        ng-show="imageFile"' +
            '        ngf-select ' +
            '        ng-model="imageFile">Schimbă</button>' +

            '<div class="ps-modal p-3" ng-show="showThumbnail">' +
            '   <img ngf-thumbnail="imageFile" class="img-fluid">' +
            '</div>',

            controller: function ($scope, $rootScope, Upload, $timeout, cloudinary) {
                if (!$scope.control)
                    $scope.control = {};

                $scope.$watch('imageFile',function(newVal){
                    console.log(newVal);
                });

                $scope.control.uploadPic = function (file, successClbk, errClbk) {
                    if (!file) return;

                    let cloudName = cloudinary.config().cloud_name;
                    let upload = Upload.upload({
                        url: 'http://api.cloudinary.com/v1_1/' + cloudName + '/upload',
                        data: {
                            upload_preset: cloudinary.config().upload_preset,
                            file: file
                        }
                    });

                    upload.then(function (response) {

                        if (successClbk)
                            successClbk(response);
                    }, function (response) {

                        if (response.status > 0) {
                            let msg = response.status + ': ' + response.data;
                            $rootScope.emit('http.error', ' Error while uploading :' + msg);
                        }
                        if (errClbk)
                            errClbk(response)
                    }, function (evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        let progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        $scope.progress = progress;
                    });
                };


            },
            link: function ($scope, elm) {

                $(elm).find('.ps-modal').click((evt) => {
                    evt.stopPropagation();
                    $scope.showThumbnail = false;
                    $scope.$apply();
                })
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
                if (!$scope.$$phase)
                    $scope.$apply();

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
                if ($scope[model[0]])
                    $scope[model[0]][model[1]] = moment2.toDate();
            }

            $scope.$watch(model[0], newVal => {
                if (!newVal) {
                    return;
                }
                if (model[1]) {
                    moment2 = newVal[model[1]];
                } else {
                    moment2 = newVal;
                }

                elm.data('daterangepicker').setStartDate(moment2);
                elm.data('daterangepicker').setEndDate(moment2);

            });

            if (!$scope.$$phase)
                $scope.$apply();


        }

    });
