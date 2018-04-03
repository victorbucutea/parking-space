//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/


angular.module('ParkingSpace.controllers').controller('SearchAddressCtrl',
    ['$scope', '$rootScope', '$document', 'geoService', function ($scope, $rootScope, $document, geoService) {


        geoService.getCurrentPosition((result, position) => {
            $scope.currentAddress = result;
            $scope.currentPosition = position;
        });

        $scope.shouldSuggest = (addr) => {
            return (addr && addr.length > 3);
        };

        $rootScope.$on('err', function (evt, args) {
            $scope.err = args;
        });

        $scope.$watch('searchString', (newVal, oldVal) => {
            if (!(newVal && newVal.length > 3)) return;

            if ($scope.bypass) {
                $scope.bypass = false;
                return;
            }


            let addresses = [];

            function composeAddress(terms, matches) {
                let cleanStr = terms[0].value + ', ' + terms[1].value;
                let str = terms[0].value + ', <small class="text-muted">' + terms[1].value;
                if (terms[2].value.indexOf("unicipiul") === -1) {
                    str += ", " + terms[2].value;
                    cleanStr += ", " + terms[2].value;
                }
                str += '</span>';

                let offset = 0;


                matches.forEach((m) => {
                    str = str.splice(m.offset + offset, 0, "<b>");
                    offset += 3;
                    str = str.splice((m.offset + offset) + m.length, 0, "</b>");
                    offset += 4;
                });
                return {str: str, cleanStr: cleanStr};
            }

            geoService.autocompleteAddress(newVal, (resp, status) => {
                if (!resp) {
                    $scope.addresses = [];
                    return;
                }


                resp.forEach((item) => {
                    let matches = item.matched_substrings;
                    let terms = item.terms;
                    // skip items which are not accurate enough - don't have a place id
                    if (terms.length < 3 || !item.place_id) return;
                    let result = composeAddress(terms, matches);
                    let str = result.str;
                    let cleanStr = result.cleanStr;
                    addresses.push({
                        addrClean: cleanStr,
                        addrDesc: item.description,
                        addrMatch: str,
                        placeId: item.place_id
                    })
                });

                $scope.addresses = addresses;
                if (!$scope.$$phase) $scope.$apply();
            })
        });

        $scope.selectCurrentAddr = function () {
            $scope.searchLocation = {
                name: $scope.currentAddress,
                position: $scope.currentPosition
            };
            $("#mainSearch").val($scope.currentAddress);
            $('.address-suggestion').hide();
        };


        $scope.search = function () {
            console.log($scope.searchLocation);
            let location = '/app/index.html#!/home/map/search?';
            let coords = $scope.searchLocation.position.coords;
            if (coords) {
                location += 'lat=' + coords.latitude + '&lng=' + coords.longitude;
                window.location = location;

            } else {
                geoService.getPositionForPlace($scope.searchLocation.position, (resp) => {
                    location += 'lat=' + resp.lat + '&lng=' + resp.lng;
                    window.location = location;
                })
            }
        };

        $scope.selectAddr = function (address) {
            $scope.searchLocation = {
                name: address.addr,
                position: address.placeId
            };
            $scope.bypass = true;
            $scope.searchString = address.addrClean;
            $('.address-suggestion').hide();
        };


        $('#mainSearch').focus((evt) => {
            $('.address-suggestion').show()
        });

        $document.on('click', (evt) => {
            let t = $(evt.target);

            if (t.parents('.search-form').length === 0) {
                //clicked outside search form
                $('.address-suggestion').hide();
            }
        });


    }]);