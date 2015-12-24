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
                    controlText.innerHTML = '<i class="ion-android-locate fa-2x" ></i>';
                    controlUI.appendChild(controlText);

                    // Setup the click event listeners: simply set the map to Chicago.
                    controlUI.addEventListener('click', function() {
                        geolocationService.getCurrentLocation(function(position) {
                            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            map.setCenter(pos);
                        });
                    });

                }

                function initialize() {
                    var mapOptions = {
                        center: new google.maps.LatLng(43.07493, -89.381388),
                        zoom: 19,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                        },
                        mapTypeControl: false
                    };
                    var map = new google.maps.Map($element[0], mapOptions);

                    var centerControlDiv = document.createElement('div');
                    var centerControl = new CenterControl(centerControlDiv, map);
                    centerControlDiv.index = 1;
                    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
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

    .directive('parkingAreaSymbol', function ($ionicGesture, $rootScope, $state) {
        return {
            restrict: 'E',
            scope: {
                'marker': '='
            },
            template: '<div id="parkingAreaSymbol" >' +
                        '<i class="parking-area-pointer fa fa-hand-o-right" id="handPointer"></i>' +
                        '<div class="parking-area-wrapper" id="parkingAreaWrapper">' +
                            '<div class="parking-area" id="parkingAreaRectangle">' +
                                '<i class="fa fa-angle-left fa-rotate-45 top-left"></i>' +
                                '&nbsp; ' +
                                '<i class="fa fa-angle-left fa-rotate-135 top-right"></i>' +
                                '<span>P</span>' +
                                '<i class="fa fa-angle-right fa-rotate-135 bottom-left"></i>' +
                                '&nbsp; ' +
                                '<i class="fa fa-angle-right fa-rotate-45 bottom-right"></i>' +
                            '</div>' +
                        '</div>'+
                      '</div>',
            link: function ($scope, $element, $attr) {

                var marker = $scope.marker;
                var height = $element.height();
                marker.rotation |= 0;

                google.maps.event.addListener($rootScope.map, 'idle', function () {
                    var mapCenter = $rootScope.overlay.getProjection().fromLatLngToContainerPixel($rootScope.map.getCenter());
                    var markerTop = mapCenter.y - (height / 2);
                    $element.css('top', markerTop + 'px');
                });


                var rotate = function (newVal) {
                    var parkingArea = $element.find('#parkingAreaWrapper');
                    parkingArea.css('transform', 'rotate(' + Math.round(newVal) + 'deg)');
                };

                $ionicGesture.on('tap', function (e) {
                    if (marker.rotation >= -157.5) {
                        marker.rotation -= 22.5;
                    } else {
                        marker.rotation = 0;
                    }
                    rotate(marker.rotation);
                }, $element);

            }
        }
    })


    .directive('parkingSpotInfoBox', function (ENV) {
        return {
            restrict: 'E',
            template: '<div class="item row parking-spot-details " >' +
                        '    <div ng-show="space.title">' +
                        '        <h2><i class="fa fa-car"></i> {{space.title}}</h2>' +
                        '        <p>{{space.address_line_1}} ' +
                        '               <br  />' +
                        '           {{space.address_line_2}} ' +
                        '        </p>' +
                        '        <h1>' +
                        '            {{space.price | units  }}.<small>{{space.price | subunits}}</small> ' +
                        '            <currency val="space.currency"></currency>' +
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
                bidAmount: '=amount',
                bidCurrency: '=currency'
            },
            template: ' <div class="bid-amount row">' +
                '<div class="col">' +
                '<a class="fa fa-caret-left fa-3x disable-user-behavior" ng-click="decrease()"></a>' +
                '<input type="number" min="0" max="100" ng-model="bidAmount">' +
                '<a class="fa fa-caret-right fa-3x disable-user-behavior" ng-click="increase()" style=""></a>' +
                '</div>' +
                '<div class="col">' +
                '<select ng-model="bidCurrency" ng-options="currency.name as currency.name for currency in currencies" class="currency"> </select>' +
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

                    if (newVal > 100) {
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

    .directive('notificationIcon', function ($rootScope) {
        return {
            template: '<div class="notif-icon" ng-show="hasNotif">{{noOfNotif}}</div>',
            restrict: 'E',
            link: function ($scope, element, attrs) {

                $rootScope.$on('notification', function (event, value) {
                    if (value > 0) {
                        $scope.hasNotif = true;
                        $scope.noOfNotif = value;
                    } else {
                        $scope.hasNotif = false;
                    }
                });
            }
        }
    })

    .directive('currency', function (currencies) {
        return {
            restrict: 'E',
            template: '<i class="fa" ng-class="currSym"></i> {{currName}} ',
            scope: {
                val: '='
            },
            link: function ($scope) {

                var display = function (newVal) {
                    if (!newVal)
                        return;

                    var currency = $.grep(currencies, function (cur) {
                        return newVal == cur.name;
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
;
