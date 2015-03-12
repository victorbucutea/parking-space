'use strict';

angular.module('ParkingSpaceMobile.controllers', [])

    .controller('MainCtrl', function ($rootScope, $scope, $document, $timeout, authenticationService) {

        $timeout(function () {
            $rootScope.$broadcast('notification', 3);
        }, 2500);

        $document.mousedown(function () {
            $scope.errMsg = null;
            $scope.notifMsg = null;
            $scope.$apply();
        });


        $rootScope.$on('http.error', function (event, data, status) {
            $scope.errMsg = data + status;

        });

        $rootScope.$on('http.notif', function (event, data, status) {
            $scope.notifMsg = data;
        });

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
                newAddr.lat = mapCenter.lat();
                newAddr.lng = mapCenter.lng();
                newAddr.markerRotation = $scope.marker.rotation;
                $rootScope.$broadcast('changeAddress', newAddr);
                if (!$scope.$$phase)
                    $scope.$apply();
            });

        };

    })

    .controller('PostParkingSpaceCtrl', function ($rootScope, $scope, currencies, $state, parameterService, geolocationService) {
        $scope.currencies = currencies;


        if ($rootScope.map)
            $rootScope.map.setZoom(19);


        $scope.review = function () {
            $scope.spaceEdit = {};
            angular.copy($scope.space, $scope.spaceEdit);
            geolocationService.getCurrentLocation(function (position) {
                $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
                $scope.spaceEdit.recorded_from_long = position.coords.longitude;
            });
            $state.go('home.map.post.review');
        };

        $scope.save = function () {
            $scope.space = $scope.spaceEdit;
            $state.go('^');
        };

        $scope.$on('changeAddress', function (e, data) {
            if (!$scope.space)
                $scope.space = {price: parameterService.getStartingAskingPrice(), currency: parameterService.getStartingCurrency()};

            var street = data.street || '';
            var street_number = data.street_number || '';
            var sublocality = data.sublocality ||
                data.administrative_area_level_2 ||
                data.administrative_area_level_1 || '';
            var city = data.city || '';

            $scope.space.address_line_1 = street + ', ' + street_number;
            $scope.space.address_line_2 = sublocality + ', ' + city;
            $scope.space.location_lat = data.lat;
            $scope.space.location_long = data.lng;
            $scope.space.rotation_angle = data.markerRotation || 0;


            if (!$scope.space.title) {
                $scope.space.title = sublocality;
            }
        });

    })

    .controller('EditParkingSpaceCtrl', function ($scope, $state, imageResizeFactory, parkingSpaceService) {

        $scope.takePhoto = function () {
            var cameraSuccess = function (img) {
                $scope.spaceEdit.image_data = img;
                $scope.spaceEdit.thumbnail_data = imageResizeFactory(img);
                $scope.spaceEdit.image_file_name = img.substr(img.lastIndexOf("/") + 1);
                $scope.spaceEdit.image_content_type = 'image/jpeg';

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
                $scope.spaceEdit.image_data = img;
                $scope.spaceEdit.thumbnail_data = imageResizeFactory(img);
                $scope.spaceEdit.image_file_name = img.substr(img.lastIndexOf("/") + 1);
                $scope.spaceEdit.image_content_type = 'image/jpeg';

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
            parkingSpaceService.saveSpace($scope.spaceEdit);
            $state.go('^');
        };

        $scope.close = function () {
            $state.go('^');
        };

    })

    .controller('BidsAndMessagesCtrl', function ($scope, $timeout, messageService, offerService) {

        $scope.scrollDown = function () {
            var d = $('.scroll');
            d.scrollTop(d.prop("scrollHeight"));
        };

        $scope.sendMessage = function (content) {
            if (!content) {
                return;
            }
            var newMessage = {
                content: content
            };
            var offer = $scope.selOffer;
            messageService.sendMessage($scope.spaceEdit.id, offer.id, newMessage, function (savedMsg) {
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
        }

    })

    .controller('SearchParkingSpaceCtrl', function ($rootScope, $scope, parkingSpaceService, parameterService, $state, currencyFactory, offerService, deviceAndUserInfoService, $filter) {

        $rootScope.map.setZoom(15);

        $scope.noOfLongTerm = 0;
        $scope.noOfShortTerm = 0;

        $scope.circleOptions = {
            strokeColor: '#111',
            strokeWeight: 0.5,
            fillColor: '#333',
            fillOpacity: 0.1,
            map: $rootScope.map,
            radius: parameterService.getDefaultSearchRadius()
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
            parkingSpaceService.getAvailableSpaces(latLng.lat(), latLng.lng(), $scope.circleOptions.radius, function (spaces) {
                $scope.spaces = spaces;
            });
        };
        var dragListenHandle = null;

        // setTimeout(function(){
        dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
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
                var xCoord = price.length == 1 ? 8 : 15;
                var markerWithLabel = new MarkerWithLabel({
                    position: new google.maps.LatLng(space.location_lat, space.location_long),
                    map: $rootScope.map,
                    icon: image,
                    labelContent: space.price + ' ' + currencyHtml,
                    labelAnchor: new google.maps.Point(xCoord, 44),
                    labelClass: "search-marker-label"
                });

                google.maps.event.addListener(markerWithLabel, "click", function (e) {
                    $scope.showBid(space);
                });

                $scope.markers.push(markerWithLabel);
            })
        });

        var center = $rootScope.map.getCenter();
        parkingSpaceService.getAvailableSpaces(center.lat(), center.lng(), $scope.circleOptions.radius, function (spaces) {
            $scope.spaces = spaces;
        });


        $scope.showBid = function (space) {
            $('.bar.bar-header').hide();
            $scope.selectedSpace = space;
            $scope.bid = {};
            $scope.bid.bid_amount = $scope.selectedSpace.price;
            $scope.bid.bid_currency = $scope.selectedSpace.currency;

            $state.go('home.map.search.place');

            google.maps.event.removeListener(dragListenHandle);
            var latLng = new google.maps.LatLng($scope.selectedSpace.location_lat, $scope.selectedSpace.location_long);
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
            pictureLabel.attr('height', 48);
            pictureLabel.attr('width', 48);

            var mapCenter = new google.maps.LatLng(latLng.lat() - 0.0008, latLng.lng());

            $rootScope.map.setCenter(mapCenter);
            $rootScope.map.setZoom(17);

            $scope.spotThumbnail = new MarkerWithLabel({
                position: latLng,
                icon: {path: ''},
                map: $rootScope.map,
                labelContent: pictureLabel[0],
                labelAnchor: new google.maps.Point(28, 28),
                labelStyle: {transform: 'rotate(' + $scope.selectedSpace.rotation_angle + 'deg)'}
            });

        };

        $scope.closeBid = function () {
            $('.bar.bar-header').show();
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

            setTimeout(function () {
                dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);
            }, 500);

            $state.go('^');
        };

        $scope.saveBid = function () {
            $('.bar.bar-header').show();
            offerService.placeOffer($scope.bid, $scope.selectedSpace.id);
            $scope.closeBid();
        };

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

        $scope.expireDuration = function() {
            var duration = moment.duration(parameterService.getShortTermExpiration(),'minutes');
            if (!$scope.selectedSpace.short_term) {
                duration = moment.duration(parameterService.getLongTermExpiration(),'weeks');
            }
            var expirationTimestamp = new Date($scope.selectedSpace.created_at).getTime() + duration.asMilliseconds();
            return moment(expirationTimestamp).fromNow();
        }
    })

    .controller('MyPostsCtrl', function ($scope, parkingSpaceService, $state) {

        $('.open-spaces-list').height($(window).height() - 105);
        parkingSpaceService.getMySpaces(function (spaces) {
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
