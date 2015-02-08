'use strict';

angular.module('ParkingSpaceMobile.controllers', [])

    .controller('MainCtrl', function ($rootScope, $scope, $document, $timeout) {

        $timeout(function () {
            $rootScope.$broadcast('notification', 3);
        }, 2500);

    })

    .controller('MapCtrl', function ($scope, $timeout, $rootScope, geolocationService, geocoderService) {

        $scope.mapCreated = function (map, overlay, geocoder) {

            $rootScope.map = map;
            $rootScope.overlay = overlay;
            $rootScope.geocoder = geocoder;
            $scope.marker = {};

            google.maps.event.addListener(map, 'zoom_changed', function () {
                var zoomLevel = map.getZoom();
                $scope.showPointer = false;
                var scale = 0.3;

                switch (zoomLevel) {
                    case 18 :
                        scale = 0.3;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 19 :
                        scale = 0.5;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                    case 20 :
                        scale = 0.8;
                        break;
                    case 21 :
                        scale = 1;
                        break;
                    default:
                        scale = 0.3;
                        $timeout(function () {
                            $scope.showPointer = true;
                        }, 1500);
                        break;
                }

                $scope.marker.markerStyle = {'transform': 'scale(' + scale + ')'};

                if (!$scope.$$phase)
                    $scope.$apply();

            });


            google.maps.event.addListener(map, 'dragend', function () {
                $scope.calculateAddress();
            });


            geolocationService.getCurrentLocation(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(pos);
                $scope.calculateAddress();
            });

            map.setZoom(19);
        };

        $scope.calculateAddress = function () {
            var mapCenter = $rootScope.map.getCenter();
            geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
                $rootScope.$broadcast('changeAddress', newAddr);
                if (!$scope.$$phase)
                    $scope.$apply();
            });

        };

    })

    .controller('PostParkingSpaceCtrl', function ($rootScope, $scope, currencies, $state) {
        $scope.currencies = currencies;


        if ($rootScope.map)
            $rootScope.map.setZoom(19);


        $scope.review = function () {
            $scope.spaceEdit = {};
            angular.copy($scope.space, $scope.spaceEdit);
            $state.go('home.map.post.review');
        };

        $scope.save = function () {
            $scope.space = $scope.spaceEdit;
            $state.go('^');
        };

        $scope.$on('changeAddress', function (e, data) {
            if (!$scope.space)
                $scope.space = {price: 5, currency: 'Eur'};

            var street = data.street || '';
            var street_number = data.street_number || '';
            var sublocality = data.sublocality ||
                data.administrative_area_level_2 ||
                data.administrative_area_level_1 || '';
            var city = data.city || '';

            $scope.space.address_line_1 = street + ', ' + street_number;
            $scope.space.address_line_2 = sublocality + ', ' + city;

            if (!$scope.space.title) {
                $scope.space.title = sublocality;
            }
        });

    })

    .controller('EditParkingSpaceCtrl', function ($scope, $state) {

        $scope.takePhoto = function () {
            var cameraSuccess = function (img) {
                $scope.spaceEdit.img = img;
                $scope.$apply();
            };

            var cameraError = function (img) {
                console.log('error while taking :', img);
            };

            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 80,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 480,
                targetHeight: 640
            });
        };

        $scope.attachPhoto = function () {
            var cameraSuccess = function (img) {
                $scope.spaceEdit.img = img;
                $scope.$apply();
            };

            var cameraError = function (img) {
                console.log('error while taking :', img);
            };

            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        };


        $scope.save = function () {
            console.log('updating post', $scope.spaceEdit);
            $state.go('^');
        };

        $scope.close = function () {
            $state.go('^');
        };

        $scope.delete = function () {
            console.log('deleting post', $scope.spaceEdit);
        };
    })

    .controller('BidsAndMessagesCtrl', function ($scope, $timeout, messageService, offerService) {

        $scope.scrollDown = function () {
            var d = $('.scroll');
            d.scrollTop(d.prop("scrollHeight"));
        };

        $scope.sendMessage = function (newMessage) {

            if (!newMessage) {
                return;
            }

            var newMessage = {
                msg: newMessage,
                timestamp: new Date().getTime(),
                read: true,
                own: true
            };

            messageService.sendMessage('postId', newMessage, function (messages) {
                $scope.selOffer.messages.push(newMessage);
            });
        };


        $scope.acceptStep1 = function (offer) {
            var acceptedOffers = $scope.spaceEdit.offers.filter(function (d) {
                if (d.accepted == true && offer !== d) {
                    return true;
                }
            });

            if (acceptedOffers.length) {
                $scope.warn = true;
                return;
            }

            offer.confirm = true;
        };

        $scope.accept = function (offer) {
            console.log('accepting ', offer);
            offerService.acceptOffer(offer, function () {
                $scope.warn = false;
                offer.accepted = true;
                offer.confirm = false;
            });
        };

        $scope.cancel = function (offer) {
            offer.confirm = false;
            offerService.cancelOffer(offer, function () {
                $scope.warn = false;
                offer.accepted = false;
                offer.confirm = false;
            })
        };

        $scope.unreadMessages = function (messages) {
            var count = 0;
            if (!messages) {
                return count;
            }

            messages.forEach(function (d) {
                if (!d.read) count++
            });
            return count;
        };

        $scope.selectOffer = function (offer) {
            $scope.selOffer = offer;
            $scope.showChatArea = true;

            /*  $timeout(function () {
             messageService.markRead('postId', $scope.selOffer.messages, function (messages) {

             });
             }, 1000);*/
        };

        $timeout(function () {
            /*if ($scope.selOffer) {
             messageService.markRead('postId', $scope.selOffer.messages, function (messages) {
             });
             }*/

            offerService.markRead('postId', $scope.spaceEdit.offers, function (offers) {

            })
        }, 3000)
    })

    .controller('SearchParkingSpaceCtrl', function ($rootScope, $scope, parkingSpaceService, $state, currencyFactory, $timeout,  $filter) {

        $rootScope.map.setZoom(15);

        $scope.noOfLongTerm = 0;
        $scope.noOfShortTerm = 0;

        $scope.circleOptions = {
            strokeColor: '#111',
            strokeWeight: 0.5,
            fillColor: '#333',
            fillOpacity: 0.1,
            map: $rootScope.map,
            radius: 500
        };

        $scope.$watch('circleOptions.radius', function (newVal) {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                searchRadiusCircle.setRadius(newVal);
            }
        });

        var dragListenClbk = function () {
            if ($scope.searchRadiusCircle)
                $scope.searchRadiusCircle.setMap(null);

            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

            var latLng = $rootScope.map.getCenter();
            parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), function (spaces) {
                $scope.spaces = spaces;
            });
        };
        var dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);

        if (!$scope.searchRadiusCircle) {
            // user navigates on screen for first time
            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);
        }

        $rootScope.$broadcast('searchCenterIcon', true);

        $rootScope.$on('$stateChangeSuccess', function (ev, toState) {
            if (toState.name.indexOf('home.map.search') == -1) {
                if ($scope.searchRadiusCircle) {
                    $scope.searchRadiusCircle.setMap();
                }

                if ($scope.markers) {
                    $scope.markers.forEach(function (d) {
                        d.setMap();//clear marker
                    });
                }

                google.maps.event.removeListener(dragListenHandle);
                $rootScope.$broadcast('searchCenterIcon', false);
            }
        });

        $scope.$watchCollection('spaces', function (newVal) {

            if (!newVal)
                return;

            $scope.noOfLongTerm = $filter('filter')(newVal, {short_term: false});
            $scope.noOfShortTerm = $filter('filter')(newVal, {short_term: true});

            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap();//clear marker
                });
            }

            $scope.markers = [];
            newVal.forEach(function (space) {
                var image = {
                    url: space.short_term ? 'images/marker_orange.png' : 'images/marker_blue.png',
                    scaledSize: new google.maps.Size(53, 53)
                };

                var currencyElm = $('<i class="fa" ></i>');
                var currency = currencyFactory.getCurrency(space.currency);
                currencyElm.addClass(currency);
                var currencyHtml = currencyElm.wrap('<p/>').parent().html();
                var price = space.price + "";
                var x = price.length == 1 ? 8 : 15;
                var markerWithLabel = new MarkerWithLabel({
                    position: new google.maps.LatLng(space.position.lat, space.position.lng),
                    map: $rootScope.map,
                    icon: image,
                    labelContent: space.price + ' ' + currencyHtml,
                    labelAnchor: new google.maps.Point(x, 44),
                    labelClass: "search-marker-label"
                });

                google.maps.event.addListener(markerWithLabel, "click", function (e) {
                    $scope.showBid(space);
                });

                $scope.markers.push(markerWithLabel);
            })
        });

        $scope.increaseRadius = function () {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                var prevRad = searchRadiusCircle.getRadius();
                if (prevRad <= 900) {
                    $scope.circleOptions.radius = prevRad + 50;
                }

            }
        };

        $scope.decreaseRadius = function () {
            var searchRadiusCircle = $scope.searchRadiusCircle;
            if (searchRadiusCircle) {
                var prevRad = searchRadiusCircle.getRadius();
                if (prevRad >= 100)
                    $scope.circleOptions.radius = prevRad - 50;
            }
        };

        parkingSpaceService.getAvailableSpaces(44.41514, 26.09321, function (spaces) {
            $scope.spaces = spaces;
        });

        $scope.showBid = function (space) {

            $scope.selectedSpace = space;

            $scope.bid = {};
            $scope.bid.bidAmount = $scope.selectedSpace.price;
            $scope.bid.bidCurrency = $scope.selectedSpace.currency;

            $state.go('home.map.search.place');


            google.maps.event.removeListener(dragListenHandle);
            var latLng = new google.maps.LatLng($scope.selectedSpace.position.lat, $scope.selectedSpace.position.lng);
            $scope.previousZoom = $rootScope.map.getZoom();
            $scope.previousCenter = $rootScope.map.getCenter();

            if ($scope.searchRadiusCircle) {
                $scope.searchRadiusCircle.setMap();
            }

            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap();//clear marker
                });
            }


            var pictureLabel = $("<img>");
            pictureLabel.attr('src', 'images/parking_spot_circle.png');
            pictureLabel.attr('height', 56);
            pictureLabel.attr('width', 56);

            var mapCenter = new google.maps.LatLng(latLng.lat() - 0.0008, latLng.lng());

            $rootScope.map.setCenter(mapCenter);
            $rootScope.map.setZoom(17);


            $scope.spotThumbnail = new MarkerWithLabel({
                position: latLng,
                icon: {path: ''},
                map: $rootScope.map,
                labelContent: pictureLabel[0],
                labelAnchor: new google.maps.Point(28, 28),
                labelStyle: {transform: 'rotate(' + $scope.selectedSpace.rotation + 'deg)'}
            });

        };

        $scope.closeBid = function () {
            $scope.spotThumbnail.setMap();
            $rootScope.map.setZoom($scope.previousZoom);
            $rootScope.map.setCenter($scope.previousCenter);
            //redraw markers
            if ($scope.markers) {
                $scope.markers.forEach(function (d) {
                    d.setMap($rootScope.map);
                });
            }

            // redraw search radius
            $scope.circleOptions.center = $rootScope.map.getCenter();
            $scope.searchRadiusCircle = new google.maps.Circle($scope.circleOptions);

            $timeout(function(){
                dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
            },500);

            $state.go('^');
        };

        $scope.saveBid = function (bid) {
            console.log('saving bid ', bid);
            $scope.closeBid();
        };
    })

    .controller('MyPostsCtrl', function ($scope, modalFactory, parkingSpaceService, $state) {

        $('.open-spaces-list').height($(window).height() - 105);
        parkingSpaceService.getMySpaces('1234', function (spaces) {
            $scope.spaces = spaces;
        });

        $scope.unreadNotifications = function (space) {
            var show = false;

            if (space.offers) {
                space.offers.forEach(function (d) {

                    if (!d.read) show = true;

                    if (d.messages) {
                        d.messages.forEach(function (d) {
                            if (!d.read) show = true
                        });
                    }
                })
            }

            return show;
        };

        $scope.unreadMessagesForSpace = function (space) {
            var count = 0;
            if (space.offers) {
                space.offers.forEach(function (d) {
                    if (d.messages) {
                        d.messages.forEach(function (d) {
                            if (!d.read)  count++
                        });
                    }
                })
            }
            return count;
        };


        $scope.show = function (space) {
            $scope.spaceEdit = space;
            $state.go('home.myposts.messages');
        };

        $scope.showMessages = function (space) {
            $scope.spaceEdit = space;
            $state.go('home.myposts.messages.talk');
        };

    });
