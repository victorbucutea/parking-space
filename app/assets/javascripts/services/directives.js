angular.module('ParkingSpace.directives')

    .directive('map', [function () {
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
                        maxZoom: 20,
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
                '       ng-show="address.length > 3"></i>',
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

    .directive('searchBar', function () {
        return {
            restrict: 'E',
            scope: {
                onSelectPlace: '&',
                placeHolder: '=',
                onMenuClick: '&'
            },
            template: '<div id="pac-container" class="">' +
                '    <places-autocomplete selected-place="selectedPlaced(place,location)" place-holder="placeHolder"></places-autocomplete>' +
                '    <span class="controls d-md-none" ng-click="openMenu()">' +
                '       <i class="pac-nav fa fa-bars "></i>' +
                '       <i id="notifmyposts" class="notif-icon d-none"></i>' +
                '    </span>' +
                '    <div class="loading-container">' +
                '      <div id="loading-progress" class="loading-progress"></div>' +
                '    </div>' +
                '</div>',
            link: function ($scope, $elm) {

                $scope.selectedPlaced = function (a, b) {
                    $scope.onSelectPlace({place: a, location: b});
                }

                $scope.openMenu = function () {
                    $scope.onMenuClick();
                }
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
                '<div class="parking-spot-details p-2 row" >' +
                '          <div class="d-flex col-3 pr-0 justify-content-center" style="overflow: hidden" ng-click="showFullImage()">' +
                '           <i class="fa fa-3x fa-photo align-self-center text-muted" ng-if="!space.file1"></i>'+
                '           <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/q_auto,f_auto,w_150/{{space.file1}}"' +
                '                ng-if="space.file1" class=" p-0 thumbnail">' +
                '           <img ng-src="https://res.cloudinary.com/{{cloudName}}/image/upload/q_auto,f_auto,w_150/{{space.file2}}" ' +
                '                ng-if="space.file2" class=" p-0 thumbnail">' +
                '          </div>' +
                '          <div class="p-2 col-9" >' +
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
                '          <div class="ml-auto text-right">' +
                '     <button class="btn btn-link" ui-sref=".edit({parking_space_id: space.id})">' +
                '       <i class="fa fa-trash"></i> Sterge ' +
                '     </button>' +
                '     <button class="btn btn-link">' +
                '       <i class="fa fa-edit"></i> Modifica' +
                '             </button>' +
                '          </div>' +
                '</div>',
            scope: {
                space: '=',
                thumbnailModal: '='
            },
            link: function ($scope, elm) {

                $scope.cloudName = window.cloudinaryName;
                $(elm).find('.parking-spot-details').click(evt => {
                    let isRoot = $(evt.currentTarget).hasClass('parking-spot-details');
                    if (isRoot && !$scope.thumbnailModal) {
                        $scope.showFullImage = true;
                        $scope.$evalAsync();
                    }
                });

                $scope.showFullImage = function () {

                    let space = $scope.space;
                    let imgSrc1 = `https://res.cloudinary.com/${cloudinaryName}/image/upload/q_auto,f_auto/${space.file1}`;
                    let imgSrc2 = `https://res.cloudinary.com/${cloudinaryName}/image/upload/q_auto,f_auto/${space.file2}`;
                    let imgSrc3 = `https://res.cloudinary.com/${cloudinaryName}/image/upload/q_auto,f_auto/${space.file3}`;


                    let img1 = $('<img>').attr('src', imgSrc1);
                    let img2 = $('<img>').attr('src', imgSrc2);
                    let img3 = $('<img>').attr('src', imgSrc3);
                    let car = $('#imgCarousel');
                    if (space.file1)
                        car.append(img1)

                    if (space.file2)
                        car.append(img2)
                    if (space.file3)
                        car.append(img3);

                    car.slick({
                        infinite: false,
                        dots: true,
                        slidesToShow: 1,
                        centerMode: true,
                        variableWidth: true,
                        arrows: true
                    });
                    $('#imgCarouselModal').show();

                };


            }
        }
    })

    .directive('bidTable', function () {
        return {
            restrict: 'E',
            scope: {
                space: '=',
                noContact: '=',
                offers: '=?'
            },
            template: '<div class="bids-area ">' +
                '      <div class="bid-table">' +
                '      <div class="offer row no-gutters p-2" ng-click="selectOffer(offer, space)"' +
                '           ng-repeat="offer in offers | periodFilterOffers:dateFilter | orderBy: \'timestamp\'">' +
                '        <div class="col-3">' +
                '          <div class="font-weight-bold text-monospace text-uppercase">{{offer.owner_license}}</div>' +
                '          <div>{{offer.owner_name}}</div>' +
                '        </div>' +
                '        <span class="col-5 " ng-class="{canceled : !offer.approved}">' +
                '          <div> {{ expiration(offer) }} </div>' +
                '          <div class="text-secondary"> ' +
                '            {{offer.start_date |moment: \'D MMM HH:mm\'}}  - ' +
                '            {{offer.end_date |moment: \'D MMM HH:mm\'}} ' +
                '          </div>' +
                '        </span>' +
                '        <span class="offer-price col-4 col-md-2" ng-class="{canceled : !offer.approved}">' +
                '          {{offer.amount}} {{ space.currency }}' +
                '        </span>' +
                '        <div class="col-md-2 text-center text-lg-right">' +
                '<button class="btn btn-link" ng-click="selectOffer(offer,space)"> Detalii</button>' +
                '       </div>' +
                '      </div>' +
                '      </div>' +
                '       <div class="ps-dialog mt-5" id="showPhoneNumber">' +
                '        <div class="ps-dialog-content animated zoomIn">' +
                '            <div class="ps-question">' +
                '                <parking-spot-info-box space="selectedSpace" class="mb-3"></parking-spot-info-box>' +
                '                <hr/>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Durata</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer | totalPeriod}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Start</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer.start_date | moment: \'ddd, D MMM, HH:mm\'}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">Stop</div>' +
                '                    <div class="col-8">' +
                '                        {{selOffer.end_date | moment: \'ddd, D MMM, HH:mm\'}}' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">' +
                '                        Status' +
                '                    </div>' +
                '                    <div class="col-8">' +
                '                        <span ng-show="selOffer.approved" class="text-success">Acceptat</span>' +
                '                        <span ng-show="selOffer.canceled" class="text-danger">Anulat</span>' +
                '                        <span ng-show="selOffer.rejected" class="text-danger">Respins</span>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="row ps-row">' +
                '                    <div class="col-4">' +
                '                        Taxare' +
                '                    </div>' +
                '                    <div class="col-8">' +
                '                        La 15 min' +
                '                    </div>' +
                '                </div>' +
                '                <div class="mt-3 pt-3 text-center" ng-hide="selOffer.approved">' +
                '                    <h5>Oferta nu a fost încă acceptată</h5>' +
                '                    <div class="ps-text-xxbig">' +
                '                        :(' +
                '                    </div>' +
                '                </div>' +
                '                <div class="mt-3 pt-3 text-center" ng-hide="noContact" >' +
                '                    <h5>Apelează <br/> {{selOffer.owner_name}} </h5>' +
                '                    <div class="ps-text-xbig">' +
                '                        <a ng-href="tel:{{selOffer.owner_prefix + selOffer.owner_phone_number}}">' +
                '                            <i class="fa fa-phone"></i>' +
                '                            {{selOffer.owner_prefix + selOffer.owner_phone_number}}' +
                '                        </a>' +
                '                    </div>' +
                '                </div>' +
                '            </div>' +
                '            <div class="ps-control-buttons">' +
                '                <button class="btn  btn-secondary" onclick="$(\'#showPhoneNumber\').hide()">Înapoi</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '      </div>',
            link: function ($scope, element) {
                $scope.offers = angular.isDefined($scope.offers) ? $scope.offers : $scope.space.offers;


                $scope.expiration = function (offer) {
                    if (!offer)
                        return;
                    let st = moment(offer.start_date);
                    let end = moment(offer.end_date);
                    let now = moment();

                    let isNow = end.isAfter(now) && st.isBefore(now);
                    let isInThePast = st.isBefore(now);
                    let isInTheFuture = end.isAfter(now);

                    if (isNow) {
                        return "Acum (expira " + end.fromNow() + ")"
                    }

                    if (isInThePast) {
                        return "Încheiat " + end.fromNow()
                    }

                    if (isInTheFuture) {
                        return "Progr. " + st.fromNow();
                    }


                    return "";
                };


                $scope.selectOffer = function (offer, space) {
                    $scope.selOffer = offer;
                    $scope.selectedSpace = space;
                    $('#showPhoneNumber').show();
                };
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
        let template = '<div class="input-group">' +
            '<input ' +
            '       type="text" ' +
            '       class="form-control"' +
            '       ng-class="{\'form-control-lg\': large }"'+
            '       required >';

        if (isMobileOrTablet()) {
            template = '<div class="input-group">' +
                '<input ' +
                '       type="datetime-local" ' +
                '       class="form-control"' +
                '       ng-class="{\'form-control-lg\': large }"'+
                '       ng-model="dateModel"' +
                '       required>';
        }

        template += '<div class="input-group-append">' +
            '                                <span class="input-group-text">' +
            '                                    <i class="fa fa-calendar"></i>' +
            '                                </span>' +
            '                  </div>' +
            '</div>'

        return {
            restrict: 'E',
            scope: {
                dateModel: '=',
                day: '=',
                large: '='
            },
            compile: function (element, attrs) {
                return {
                    post: function ($scope, elm) {
                        if (isMobileOrTablet()) {
                            return;
                        }
                        elm = $(elm.find('.form-control'));

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
                            $scope.dateModel = start;
                            if (!$scope.$$phase)
                                $scope.$apply();
                        });

                    }
                }
            },
            replace: true,
            template: template

        };
    })

    .directive('perimeterBox', [function () {
        return {
            restrict: 'E',
            template: '<div >' +
                '<div class="perimeter d-flex justify-content-center align-items-center"' +
                '     style="width: {{ width() }} ; height:{{ height() }} ; top: {{ top() }} ; left:{{left()}}"' +
                '     ng-mouseup="clickPerim()" >' +
                '   <i class="fa fa-car" ng-hide="perimeter.identifier"></i>' +
                '  <span class="per-id">{{perimeter.identifier}}</span>' +
                '</div>' +
                '</div>',
            scope: {
                onStop: '&',
                onClick: '&',
                perimeter: '='
            },
            link: function ($scope, elmnt) {
                let isResizing = false;
                let isDragging = false;
                let imgLoaded = false;
                let elm = elmnt.find('.perimeter')[0];// dom object
                let per = $scope.perimeter;
                let canvas = $('.perimeter-canvas');
                let canvHeight = canvas.height();
                let canvWidth = canvas.width();
                $scope.factorWidth = 1;
                $scope.factorHeight = 1;

                let reference = $("#referencePos");
                $scope.factorWidth = reference.width() / canvWidth;
                $scope.factorHeight = reference.height() / canvWidth;
                initDragElement();
                initResizeElement();

                new ResizeSensor(canvas, function (e) {
                    if (e.height === canvHeight && e.width === canvWidth) {
                        return;
                    }

                    canvWidth = e.width;
                    canvHeight = e.height;
                    $scope.factorWidth = reference.width() / canvWidth;
                    $scope.factorHeight = reference.height() / canvWidth;
                    $scope.$apply();
                });

                // on screen resize


                function initDragElement() {
                    var pos1 = 0,
                        pos2 = 0,
                        pos3 = 0,
                        pos4 = 0;
                    let currentZIndex = 0;

                    elm.onmousedown = function (e) {
                        if (isResizing) return;

                        elm.style.zIndex = "" + ++currentZIndex;
                        e = e || window.event;
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        elm.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    };

                    function elementDrag(e) {
                        isDragging = true;
                        if (!elm) {
                            return;
                        }

                        e = e || window.event;
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // set the element's new position:
                        elm.style.top = elm.offsetTop - pos2 + "px";
                        elm.style.left = elm.offsetLeft - pos1 + "px";
                    }

                    function closeDragElement() {
                        isDragging = false;
                        /* stop moving when mouse button is released:*/
                        elm.onmouseup = null;
                        document.onmousemove = null;
                        $scope.stopDrag();
                    }

                }

                function initResizeElement() {
                    var startX, startY, startWidth, startHeight;
                    var right = document.createElement("div");
                    right.className = "resizer-right";
                    elm.appendChild(right);
                    right.addEventListener("mousedown", initDrag, false);
                    right.parentPopup = elm;

                    var bottom = document.createElement("div");
                    bottom.className = "resizer-bottom";
                    elm.appendChild(bottom);
                    bottom.addEventListener("mousedown", initDrag, false);
                    bottom.parentPopup = elm;

                    var both = document.createElement("div");
                    both.className = "resizer-both";
                    elm.appendChild(both);
                    both.addEventListener("mousedown", initDrag, false);
                    both.parentPopup = elm;


                    function initDrag(e) {
                        isResizing = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        startWidth = parseInt(document.defaultView.getComputedStyle(elm).width, 10);
                        startHeight = parseInt(document.defaultView.getComputedStyle(elm).height, 10);
                        document.documentElement.addEventListener("mousemove", doDrag, false);
                        document.documentElement.addEventListener("mouseup", stopDrag, false);
                    }

                    function doDrag(e) {
                        isDragging = true;
                        elm.style.width = startWidth + e.clientX - startX + "px";
                        elm.style.height = startHeight + e.clientY - startY + "px";
                    }

                    function stopDrag() {
                        isResizing = false;
                        isDragging = false;
                        document.documentElement.removeEventListener("mousemove", doDrag, false);
                        document.documentElement.removeEventListener("mouseup", stopDrag, false);
                        $scope.stopDrag();
                    }
                }

                $scope.clickPerim = function () {
                    if (isDragging) return;
                    $scope.onClick({per: per});
                };

                $scope.stopDrag = function () {
                    let w = $(elm).outerWidth();
                    let h = $(elm).outerHeight();
                    let top = parseInt($(elm).css('top'));
                    let left = parseInt($(elm).css('left'));
                    per.top_left_x = left * $scope.factorWidth;
                    per.top_left_y = top * $scope.factorHeight;
                    per.bottom_right_x = (left + w) * $scope.factorWidth;
                    per.bottom_right_y = (top + h) * $scope.factorHeight;
                    $scope.onStop({elm: elm});
                    $scope.$apply();
                };

                $scope.top = function () {
                    return per.top_left_y / $scope.factorHeight + 'px';
                };

                $scope.left = function () {
                    return per.top_left_x / $scope.factorWidth + 'px';
                };

                $scope.width = function () {
                    return (per.bottom_right_x - per.top_left_x) / $scope.factorWidth + 'px';
                };

                $scope.height = function () {
                    return (per.bottom_right_y - per.top_left_y) / $scope.factorHeight + 'px';
                }

            }
        }
    }])

    .directive('autocomplete', [function () {
        return {
            restrict: 'E',
            template: '<div class="d-inline-block pos-relative" ng-show="addingOperator">' +
                '            <input id="ruleSearch" class="form-control form-control-sm" ng-model="ruleSearchTxt">' +
                '            <div class="suggestion-container " ng-show="ruleSearchTxt.length > 2">' +
                '              <ul class="list-group">' +
                '                <li class="list-group-item" ng-hide="rules.length > 0">' +
                '                  <small> No Rules found with that name. </small>' +
                '                </li>' +
                '                <li class="list-group-item list-group-item-action" ng-repeat="rule in rules" ' +
                '                       ng-click="addOperator(rule)">' +
                '                  <h5><span class="badge badge-dark">{{rule.name}} </span></h5>' +
                '                  <small class="text-muted"> {{rule.description}} </small>' +
                '                </li>' +
                '              </ul>' +
                '            </div>' +
                '          </div>',
            scope: {
                onSelect: '&',
                search: '&'
            }
        }
    }])

    .directive('countrySelect', ['parameterService', function (parameterService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="input-group-prepend" >' +
                '       <button class="btn btn-outline-secondary dropdown-toggle" type="button"' +
                '                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '                    {{selectedCountry.name}} {{selectedCountry.prefix}}' +
                '                  </button>' +
                '                  <div class="dropdown-menu">' +
                '                    <a class="dropdown-item" href ng-repeat="country in countryList"  ng-click="selectCountry(country)">' +
                '                      {{country.name}} {{country.prefix}}' +
                '                    </a>' +
                '                  </div>' +
                '</div>',
            scope: {
                selectedCountry: '='
            },
            link: function ($scope, elm) {


                $scope.selectCountry = function (c) {
                    $scope.selectedCountry = c;
                }

                parameterService.getCountryList((list) => {
                    $scope.selectedCountry = list.find((c) => {
                        return c.code === 'ro'
                    });
                    $scope.countryList = list;
                });
            }
        }
    }])

    .directive('fileUpload', ['$q', '$rootScope', 'uuid', function ($q, $rootScope, uuid) {
        return {
            restrict: 'E',
            scope: {
                onSelect: '&',
                onDeSelect: '&',
                icon: '=?',
                label: '=',
                count: '=',
                accept: '=?',
                uploadedFiles: '='
            },
            template: '<div class="py-3 drop-zone" >' +
                '           <input class="fileupload" style="display: none" type="file" name="file" multiple max="3" accept="{{accept}}">' +
                '           <div class="my-3 owl-carousel owl-theme " >' +
                '              <div class=" add-photo justify-content-center d-flex flex-column"' +
                '                   ng-click="openUpload()">' +
                '                  <i class="fa {{icon}} fa-3x"></i>' +
                '                  <i class="text">{{label}}</i>' +
                '                  <i class="text small">(max {{count}})</i>' +
                '             </div>' +
                '          </div>' +
                '        </div>',
            link: function ($scope, $elm) {
                let cnt = uuid.next();
                $scope.accept = angular.isDefined($scope.accept) ? $scope.accept : 'image/*';
                $scope.icon = angular.isDefined($scope.icon) ? $scope.icon : 'fa-image';
                $scope.uploadedFiles = angular.isDefined($scope.uploadedFiles) ? $scope.uploadedFiles : {};
                let files = $scope.uploadedFiles;

                files.submit = function () {
                    return $q(function (resolve) {
                        let clbks = [];
                        for (let f in files) {
                            if (files.hasOwnProperty(f)) {
                                let data = files[f];
                                if (data.submit)
                                    clbks.push(data.submit());
                            }
                        }

                        let publicIds = [];
                        $q.all(clbks).then((response) => {
                            response.forEach((resp, idx) => {
                                publicIds.push(resp.public_id);
                            });
                            resolve(publicIds);
                        }).catch((e) => {
                            $rootScope.$emit('http.error', e);
                        });
                    })

                }
                let owl = $($elm.find('.owl-carousel'));

                owl.owlCarousel({
                    margin: 7,
                    dots: true,
                    autoWidth: true,
                });


                window['showFileUploadThumbnail' + cnt] = function (evt) {
                    if (moving) {
                        return;
                    }
                    let img = evt.currentTarget.src;
                    let imgModal = $('#imgModal');
                    imgModal.find('img').attr('src', img);
                    imgModal.show();
                };

                window['stopFileUploadThumbnail' + cnt] = function (evt) {
                    moving = true;
                };

                window['startFileUploadThumbnail' + cnt] = function (evt) {
                    moving = false;
                };


                window['removeFileUploadFile' + cnt] = function (name, evt) {
                    let target = evt.currentTarget;
                    let idxToRemove = $(owl.find('.btn')).index(target);
                    delete $scope.uploadedFiles[name];
                    $scope.onDeSelect({file: name});
                    let fileAttr = target.dataset.fileId;

                    owl.trigger('remove.owl.carousel', idxToRemove).trigger('refresh.owl.carousel');
                };

                $($elm.find('.fileupload')).fileupload({
                    url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/image/upload/',
                    dataType: 'json',
                    dropZone: $($elm.find('.drop-zone')),
                    imageOrientation: true,
                    formData: {upload_preset: window.cloudinaryPreset, folder: 'spaces'},
                    add: function (e, data) {

                        if (data.files[0].size > 8000000) {
                            alert('File is too big');
                            return;
                        }

                        let file = data.files[0];
                        $scope.uploadedFiles[file.name] = data;
                        $scope.onSelect({file: file});

                        let thumbnail = "<div class=\"d-flex flex-column align-items-center py-3\" >" +
                            "   <i class=\"fa fa-file fa-3x\"></i>" +
                            "   <div>" + file.name + "</div>" +
                            "</div> ";

                        if ((/(\.|\/)(jpe?g|png|bmp)$/i).test(file.name)) {
                            let dataUrl = URL.createObjectURL(file);
                            thumbnail = '<img  src="' + dataUrl + '" ';
                            thumbnail += ` onmouseup="showFileUploadThumbnail${cnt}(event)" ` +
                                `     onmousedown="startFileUploadThumbnail${cnt}(event)" ` +
                                `     onmousemove="stopFileUploadThumbnail${cnt}()" />`
                        }


                        let div = '<div class="d-flex flex-column justify-content-between">' +
                            thumbnail +
                            '<div class="progress-container">' +
                            '    <div id="uploadProgressBar-' + file.name + '"' +
                            '         style="width: 0" class="progress-bar">' +
                            '    </div>' +
                            '</div>' +
                            '<button class="btn btn-link btn-block" onclick="removeFileUploadFile' + cnt + '(\'' + file.name + '\',event)">' +
                            '    <i class="fa fa-trash"></i> Șterge' +
                            '</button>' +
                            '</div>';

                        owl.trigger('add.owl.carousel', [div, 1]).trigger('refresh.owl.carousel');
                        $scope.onSelect({file: file});

                    },
                    progress: function (e, data) {
                        let progress = parseInt(data.loaded / data.total * 100, 10);
                        $(document.getElementById('uploadProgressBar-' + data.files[0].name)).css(
                            'width',
                            progress + '%'
                        );
                    },
                    fail: function (e, data) {
                        console.log('upload failed ', e, data);
                    }
                })
                $scope.openUpload = function () {
                    $($elm.find('.fileupload')).click();
                }


            }

        }
    }])
    .directive('inputPhoneNumber', ['parameterService', function (parameterService) {
        return {
            restrict: 'E',
            template: '<div class="input-group mt-3 input-group-lg">' +
                '                <country-select selected-country="selectedCountry" ></country-select>' +
                '                <input class="phone-number form-control" type="text" id="phoneNo"' +
                '                       autocorrect="off" autocapitalize="none"' +
                '                       placeholder="Nr. mobil (e.g. 727 333 444)"' +
                '                       ng-model="phoneNumber" name="phoneNumber"' +
                '                       required minlength="5"' +
                '                       cleave="options.phoneNumber"' +
                '                       pattern="[0-9\\. ]{5,15}"/>' +
                '                <div class="invalid-tooltip" style="left:20%">' +
                '                  e.g. 722.333.444' +
                '                </div>' +
                '              </div>',
            scope: {
                selectedCountry: '=',
                phoneNumber: '='
            },
            link: function ($scope, elm) {

                $scope.options = {
                    phoneNumber: {
                        delimiters: ['.', '.', ' '],
                        blocks: [3, 3, 3, 3],
                        numericOnly: true
                    }
                };
            }
        }
    }])

    .directive('notificationMessages', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            template: '<div class="notification-area animated zoomIn">' +
                '    <div class="notification-message error" ng-show="errMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in errMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message notification" ng-show="notifMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in notifMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message warning" ng-show="warningMsg.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in warningMsg">{{msg}}</li>' +
                '      </ul>' +
                '    </div>' +
                '    <div class="notification-message warning" ng-show="warningMsgHtml.length">' +
                '      <ul>' +
                '        <li ng-repeat="msg in warningMsgHtml">' +
                '          <span ng-bind-html="msg"></span>' +
                '        </li>' +
                '      </ul>' +
                '    </div>' +
                '  </div>',
            scope: {},
            link: function ($scope, $elm) {
                $scope.errMsg = [];
                $scope.notifMsg = [];
                $scope.warningMsg = [];
                $scope.warningMsgHtml = [];

                let notifArea = $('.notification-area');

                let removeMsgs = function (evt) {
                    $scope.errMsg = [];
                    $scope.notifMsg = [];
                    $scope.warningMsg = [];
                    $scope.warningMsgHtml = [];
                    notifArea.removeClass('zoomIn').addClass('zoomOut');
                    setTimeout(function () {
                        notifArea.removeClass('zoomOut').addClass('zoomIn');
                        $scope.$evalAsync()
                    }, 300);
                    if (evt)
                        evt.preventDefault();
                };

                notifArea.on('mousedown', function (evt) {
                    removeMsgs(evt)
                });

                let addMsg = function (type, msg) {
                    if (msg instanceof Array) {
                        msg.forEach((text) => {
                            if (type.indexOf(text) === -1)
                                type.push(text);
                        });
                    } else {
                        if (type.indexOf(msg) === -1)
                            type.push(msg);
                    }

                    setTimeout(() => {
                        removeMsgs();
                    }, 7000);
                };


                $rootScope.$on('http.error', function (event, data) {
                    addMsg($scope.errMsg, data);
                });
                $rootScope.$on('http.warning', function (event, data) {
                    addMsg($scope.warningMsg, data);
                });
                $rootScope.$on('http.warning.html', function (event, data) {
                    addMsg($scope.warningMsgHtml, data);
                });
                $rootScope.$on('http.notif', function (event, data) {
                    addMsg($scope.notifMsg, data);
                });

            }
        }
    }])

    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
