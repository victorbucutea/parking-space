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


    .service('parkingSpaceService', function ($rootScope, $http, $timeout, deviceId) {

        this.getAvailableSpaces = function (lat, lng, clbk) {
            $timeout(function () {

                spaces.forEach(function (item) {
                    var saltValue = Math.random() * 0.003;
                    saltValue *= Math.round(Math.random()) ? 1 : -1;
                    item.position = {lat: lat + saltValue, lng: lng + saltValue};
                    item.rotation = Math.round(Math.random() * 180);

                    item.offers.forEach(function (d) {
                        d.messages.forEach(function (d) {
                            Math.round(Math.random()) ? d.own = true : d.own = false
                        });
                    });
                });
                var tempSpaces = spaces.filter(function (item) {
                    return Math.round(Math.random());
                });
                clbk(tempSpaces);
            }, 500);
        };

        this.getMySpaces = function (devideId, clbk) {
            this.getAvailableSpaces(45.0, 27.0, clbk);
        };

        var spaces = [
            {
                'img': 'images/cellar.jpg',
                'title': 'Loc la strada',
                'short_term': true,
                'address_line_1': 'Calea Vacaresti nr 232',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 5,
                'id': 1,
                'currency': 'Eur',
                'post_date': new Date().getTime(),
                'owner_name': 'aaaa@somedomain.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 4,
                        'id': 1,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Țӑran ! Ceri prea mult pentru atât de puțin ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 4.2,
                        'id': 2,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'owner_name': 'owner_1@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Qui sème le vent, récolte la tempête ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Offer 0.32 € pentru loc!!',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 5,
                        'id': 3,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Revenons à nos moutons',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 5.6,
                        'id': 4,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'जिस की लाठी उस की भैंस',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    }
                ]
            },
            {
                'img': 'images/cellar.jpg',
                'title': '1 saptamana',
                'short_term': true,
                'address_line_1': 'Calea Vacaresti nr 234',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 12,
                'id': 2,
                'currency': 'Eur',
                'post_date': new Date().getTime() - 5000,
                'owner_name': 'someone@gmail.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 12,
                        'id': 5,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: 'Важно не то, как долго ты прожил, а как хорошо жил.',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Век живи -- век учись',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 13,
                        'id': 6,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer1@example.com',
                        'messages': [
                            {
                                msg: 'Важно не то, как долго ты прожил, а как хорошо жил.',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Век живи -- век учись',
                                timestamp: new Date().getTime() - 1000,
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 2000,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 3000,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 14,
                        'id': 7,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: 'Важно не то, как долго ты прожил, а как хорошо жил.',
                                timestamp: new Date().getTime() - 8000,
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Век живи -- век учись',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 8000,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 8000,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]

                    },
                    {
                        'read': false,
                        'price': 15,
                        'id': 8,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 9000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: 'Важно не то, как долго ты прожил, а как хорошо жил.',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Век живи -- век учись',
                                timestamp: new Date().getTime() - 2000,
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 8000,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Временами и дурак умно говорит',
                                timestamp: new Date().getTime() - 3000,
                                read: false,
                                deviceId: '1234'
                            }
                        ]

                    }
                ]
            },
            {
                'img': 'images/cellar.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'id': 3,
                'currency': 'Eur',
                'post_date': new Date().getTime() + 10000,
                'owner_name': 'someone@example2.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 13,
                        'id': 9,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: 'जान है तो जहान है',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'जंगल में मोर नाचा किस ने देखा ?',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'जिस की लाठी उस की भैंस',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'अब पछताए होत क्या जब चिड़िया चुग गई खेत ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'नौ सौ चूहे खाके बिल्ली हज को चली',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 13.2,
                        'id': 10,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer1@example.com',
                        'messages': [
                            {
                                msg: 'जान है तो जहान है',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'जंगल में मोर नाचा किस ने देखा ?',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'जिस की लाठी उस की भैंस',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'अब पछताए होत क्या जब चिड़िया चुग गई खेत ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'नौ सौ चूहे खाके बिल्ली हज को चली',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]

                    },
                    {
                        'read': false,
                        'price': 13,
                        'id': 11,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: 'जंगल में मोर नाचा किस ने देखा ?',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'जिस की लाठी उस की भैंस',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'अब पछताए होत क्या जब चिड़िया चुग गई खेत ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'नौ सौ चूहे खाके बिल्ली हज को चली',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]

                    },
                    {
                        'read': false,
                        'price': 13.6,
                        'id': 12,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: 'जान है तो जहान है',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'जंगल में मोर नाचा किस ने देखा ?',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'अब पछताए होत क्या जब चिड़िया चुग गई खेत ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: 'नौ सौ चूहे खाके बिल्ली हज को चली',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]

                    }
                ]
            },
            {
                'img': 'images/meeting.jpg',
                'title': 'Long term, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 13,
                'id': 4,
                'currency': 'Eur',
                'post_date': new Date().getTime() - 12000,
                'owner_name': 'someone_special@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 13,
                        'id': 13,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 8000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: '角を矯めて牛を殺す',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '鳥なき里の蝙蝠',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '本末転倒',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '井戸の中の独言も三年たてば知れる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '出る釘は打たれる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 13.2,
                        'id': 14,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 2000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer1@example.com',
                        'messages': [
                            {
                                msg: '角を矯めて牛を殺す',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '鳥なき里の蝙蝠',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '本末転倒',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '井戸の中の独言も三年たてば知れる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '出る釘は打たれる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 15,
                        'id': 15,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: '角を矯めて牛を殺す',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '鳥なき里の蝙蝠',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '本末転倒',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '井戸の中の独言も三年たてば知れる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '出る釘は打たれる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 15.6,
                        'id': 16,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: '角を矯めて牛を殺す',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '鳥なき里の蝙蝠',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '本末転倒',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '井戸の中の独言も三年たてば知れる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: '出る釘は打たれる',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    }
                ]
            },
            {
                'img': 'images/meeting.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 14,
                'id': 5,
                'currency': 'Eur',
                'post_date': new Date().getTime() - 40000,
                'owner_name': '22132@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 14,
                        'id': 17,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 6000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '  Reaaaaallly long message 2. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 14.2,
                        'id': 21,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 2000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer1@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '  Reaaaaallly long message 2. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 15,
                        'id': 22,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 5000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '  Reaaaaallly long message 2. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 14.6,
                        'id': 23,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: '  Reaaaaallly long message 2. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    }
                ]
            },
            {
                'img': 'images/meeting.jpg',
                'title': '2 sapt, in spatele OP 45',
                'short_term': false,
                'address_line_1': 'Calea Vacaresti nr 236',
                'address_line_2': 'Sector 4, Bucuresti',
                'price': 9,
                'id': 6,
                'currency': 'Eur',
                'post_date': new Date().getTime() - 70000,
                'owner_name': 'some_x@example.com',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
                'offers': [
                    {
                        'read': false,
                        'price': 9,
                        'id': 24,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime(),
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 8.2,
                        'id': 25,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 10000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer1@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 9,
                        'id': 26,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 11000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer3@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Reaaaaallly long message 2. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '2234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 0',
                                timestamp: new Date().getTime() - 300,
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 9.6,
                        'id': 27,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 13000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    },
                    {
                        'read': false,
                        'price': 9.8,
                        'id': 28,
                        'currency': 'Eur',
                        'timestamp': new Date().getTime() - 13000,
                        'telephone_no': '+40727456250',
                        'owner_name': 'offer4@example.com',
                        'messages': [
                            {
                                msg: ' Msg 1',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '1234'
                            },
                            {
                                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: true,
                                deviceId: '3234'
                            },
                            {
                                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            },
                            {
                                msg: ' Msg 6',
                                timestamp: new Date().getTime(),
                                read: false,
                                deviceId: '1234'
                            }
                        ]
                    }
                ]
            }
        ];
    })


    .service('messageService', function ($http, $timeout, deviceId) {

        var messages = [
            {
                msg: ' Msg 1',
                timestamp: new Date().getTime(),
                read: true,
                deviceId: '1234'
            },
            {
                msg: '  Reaaaaallly long message 2. Should wrap to next line ',
                timestamp: new Date().getTime(),
                read: true,
                deviceId: '2234'
            },
            {
                msg: 'Reaaaaallly long message 3. Should wrap to next line ',
                timestamp: new Date().getTime(),
                read: true,
                deviceId: '1234'
            },
            {
                msg: 'Reaaaaallly long message 4. Should wrap to next line ',
                timestamp: new Date().getTime(),
                read: true,
                deviceId: '3234'
            },
            {
                msg: 'Reaaaaallly long message 5. Should wrap to next line ',
                timestamp: new Date().getTime(),
                read: false,
                deviceId: '1234'
            },
            {
                msg: ' Msg 6',
                timestamp: new Date().getTime(),
                read: false,
                deviceId: '1234'
            },
            {
                msg: ' Msg 0',
                timestamp: new Date().getTime() - 300,
                read: false,
                deviceId: '1234'
            }
        ];

        this.markRead = function (postId, messages, clbk) {

            // execute call on server
            messages.forEach(function (x) {
                x.read = true;
            });

            this.getMessages(postId, clbk);

        };

        this.getMessages = function (postId, clbk) {

            $timeout(function () {
                if (clbk)
                    clbk(messages);
            }, 1000)
        };

        this.sendMessage = function (postId, msg, clbk) {
            msg.deviceId = deviceId;
            messages.push(msg);
            this.getMessages(postId, clbk);
        }
    })

    .service('offerService', function ($http, $timeout, deviceId) {

        this.acceptOffer = function (offer, clbk) {

            $timeout(function () {
                offer.accepted = true;
                if (clbk)
                    clbk(offer);
            }, 1000)
        };

        this.cancelOffer = function (offer, clbk) {
            $timeout(function () {
                offer.accepted = false;
                if (clbk)
                    clbk(offer);
            }, 1000)
        };

        this.markRead = function (postId, offers, clbk) {

            // execute call on server
            offers.forEach(function (x) {
                x.read = true;
            });

            if (clbk) {
                clbk(offers)
            }

        };
    })


    .factory('modalFactory', function ($state) {


        this.createModal = function (templateName, parentState, saveClbk, showClbk, closeClbk) {

            if (!saveClbk) {
                saveClbk = {};
            }

            if (!showClbk) {
                showClbk = {};
            }

            if (!closeClbk) {
                closeClbk = {};
            }


            var showClbkName = showClbk.name || 'show';
            var showClbkFunc = showClbk.func || showClbk;

            $scope[showClbkName] = function () {
                $scope[scopeModalName].show();
                if (showClbkFunc instanceof Function)
                    showClbkFunc(arguments);
            };


            var closeClbkName = closeClbk.name || 'close';
            var closeClbkFunc = closeClbk.func || closeClbk;

            $scope[closeClbkName] = function () {
                $scope[scopeModalName].hide();
                if (closeClbkFunc instanceof Function)
                    closeClbkFunc(arguments)
            };


            var saveClbkName = saveClbk.name || 'save';
            var saveClbkFunc = saveClbk.func || saveClbk;

            $scope[saveClbkName] = function () {
                $scope[scopeModalName].hide();
                if (saveClbkFunc instanceof Function)
                    saveClbkFunc(arguments);
            };

        };

        return this;
    })


    .factory('currencyFactory', function (currencies) {


        this.getCurrency = function (curName) {
            var currency = $.grep(currencies, function (cur) {
                return curName == cur.name;
            });


            if (currency[0] && currency[0].icon) {
                return currency[0].icon;
            } else {
                return null;
            }
        };

        return this;
    })

    .factory('deviceId', function () {
        return '1234';
    });
