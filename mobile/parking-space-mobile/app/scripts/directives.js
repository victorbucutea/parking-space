'use strict';

angular.module('ParkingSpaceMobile.directives', [])

    .directive('map', function () {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function ($scope, $element, $attr) {
                function initialize() {
                    var mapOptions = {
                        center: new google.maps.LatLng(43.07493, -89.381388),
                        zoom: 19,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false
                    };
                    var map = new google.maps.Map($element[0], mapOptions);
                    var overlay = new google.maps.OverlayView();
                    overlay.setMap(map);
                    overlay.draw = function () {
                    };

                    $scope.onCreate({map: map, overlay: overlay});

                }

                google.maps.event.addDomListener(window, 'load', initialize);

                $scope.$on('$viewContentLoaded', function (event) {
                    initialize();
                });
            }
        };
    })


    // this is not mobile compatible :(
    // it was such a nice slide in up menu
    .directive('slideInUpMenu', function ($ionicGesture) {
        return {
            restrict: 'A',
            scope: {
                shrinkTarget: '=',
                minHeight: '=?', //optional
                maxHeight: '=?', //optional
                open: '=?'
            },
            link: function ($scope, $element, $attr) {

                $scope.maxHeight |= $('body').height() * 0.4; //40% of body height
                $scope.minHeight |= 0; // hidden by default
                $element.addClass('slide-in-up-menu');
                $element.height($scope.maxHeight);
                var currentHeight = $scope.maxHeight; // set initial height to max
                $element.hide();


                $ionicGesture.on('dragup', function (e) {
                    var newHeight = currentHeight - Math.round(e.gesture.deltaY);
                    if (newHeight <= $scope.maxHeight) {
                        $element.height(newHeight);
                    }
                    e.gesture.preventDefault();
                }, $element);


                $ionicGesture.on('dragdown', function (e) {
                    var newHeight = currentHeight - Math.round(e.gesture.deltaY);
                    if ($element.height() >= $scope.minHeight) {
                        $element.height(newHeight);
                    }
                    e.gesture.preventDefault();
                }, $element);


                $ionicGesture.on('release', function (e) {
                    currentHeight = $element.height();
                    e.gesture.preventDefault();
                }, $element);

                $scope.$watch('open', function (newVal) {
                    if (newVal) {
                        if ($element.height() <= 0) {
                            $element.height($scope.maxHeight);
                        }
                        $element.show();
                    }
                    else {
                        $element.hide();
                    }
                });


                $ionicGesture.on('swipeup', function (e) {
                    $element.height($scope.maxHeight);
                    e.gesture.preventDefault();
                }, $element);


                $ionicGesture.on('swipedown', function (e) {
                    $element.height($scope.minHeight);
                    e.gesture.preventDefault();
                }, $element);
            }
        }
    })

    .directive('parkingSpotMarker', function () {
        return {
            restrict: 'E',
            scope: {
                'markerWidth': '=',
                'markerHeight': '=',
                'markerStyle': '=',
                'showPointer': '='
            },
            template: ' <i class="parking-area-pointer fa fa-hand-o-right" ng-show="showPointer"></i>' +
                ' <div class="parking-area" ng-style="markerStyle">' +
                '<i class="fa fa-angle-left fa-rotate-45 top-left"></i>' +
                '&nbsp; ' +
                ' <i class="fa fa-angle-left fa-rotate-135 top-right"></i>' +
                ' <span>P</span>' +
                ' <i class="fa fa-angle-right fa-rotate-135 bottom-left"></i>' +
                '&nbsp; ' +
                ' <i class="fa fa-angle-right fa-rotate-45 bottom-right"></i>' +
                ' </div>',
            link: function ($scope, $element, $attr) {
                $scope.markerWidth = $($element).width();
                $scope.markerHeight = $($element).height();

            }
        }
    })

    .directive('parkingSign', function () {
        return {
            restrict: 'E',
            template: '<span class="parking-sign" ng-hide="space.img">' +
                            '<i class="fa {{icon}}"></i>' +
                            '<i class="text"></i>'+
                       '</span>'+
                       '<img ng-src="{{space.img}}" ng-style="" ng-show="space.img" class="parking-spot-thumbnail">',
            scope: {
                icon: '=',
                space: '=',
                width: '='
            },
            link: function ($scope, $element, $attr) {
                var width = $scope.width || 90;
                var height = width * (4/3);
                var text = $element.find('.text');
                var icon = $element.find('.fa');
                var img = $element.find('img');

                text.css('width',width );
                text.css('height',height);
                img.css('width',width);
                if (!$scope.icon) {
                    icon.remove();
                    text.text('P');
                } else {
                    text.remove();
                }
            }
        }
    })

    .directive('parkingSpotInfoBox', function () {
        return {
            restrict: 'E',
            template: '<div class="item row parking-details " >' +
                '<parking-sign></parking-sign>' +
                '    <div class="col-50">' +
                '        <h2>{{space.title}}</h2>' +
                '        <p>{{space.address}}</p>' +
                '        <h1>' +
                '            {{space.price}}' +
                '            <span class="currency"> Ron </span>' +
                '        </h1>' +
                '    </div>' +
                '</div>',
            scope: {
                space: '='
            },
            link: function( $scope, $element, $attr) {

            }
        }
    });

