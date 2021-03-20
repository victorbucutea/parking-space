angular.module('ParkingSpaceAdmin.controllers')
    .controller('LocationCtrl',
        ['$scope', '$state', '$rootScope', '$document', 'sectionService', 'locationService', 'replaceById', 'loadGmaps',
            function ($scope, $state, $rootScope, $document, sectionService, locationService, replaceById, loadGmaps) {
                loadGmaps.then(() => {
                    let mapOptions = {
                        center: new google.maps.LatLng(44.412, 26.113),
                        zoom: 13,
                        minZoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        rotateControl: false,
                        disableDefaultUI: true,
                    };

                    $scope.cloudinaryName = window.cloudinaryName;
                    let map = new google.maps.Map($('.location_map')[0], mapOptions);
                    $scope.marker = new google.maps.Marker({
                        draggable: true
                    });

                    google.maps.event.addListener($scope.marker, 'dragend', function (event) {
                        let pos = this.position;
                        let loc = $scope.location;
                        if (loc) {
                            loc.location_lat = pos.lat();
                            loc.location_long = pos.lng();
                            $scope.$apply();
                        }
                    });


                    $scope.$watch('location', function (newVal) {
                        if (!newVal) return;

                        $scope.marker.setTitle(newVal.parking_space_name);
                        $scope.marker.setMap(map);
                        if (!newVal.location_lat || !newVal.location_long) {
                            let unirii = new google.maps.LatLng(44.425613, 26.103693);
                            $scope.marker.setPosition(unirii);
                            map.setCenter(unirii);
                            return;
                        }
                        let latLng = new google.maps.LatLng(newVal.location_lat, newVal.location_long);
                        $scope.marker.setPosition(latLng);
                        map.setCenter(latLng);
                    });
                });

                $scope.saveLocation = () => {
                    if (!$scope.locationForm.$valid) {
                        $('#locationForm').addClass('was-validated');
                        return;
                    }

                    $scope.loading = true;

                    locationService.saveLocation($scope.location, (data) => {
                        replaceById(data, $scope.locations);
                        $scope.location = data;
                    }).finally(() => {
                        $scope.loading = false;
                    })

                };

                $scope.deleteLocation = () => {
                    let loc = $scope.location;
                    if (!loc.id) return;
                    locationService.deleteLocation(loc.id, (data) => {
                        let idx = $scope.locations.indexOf(loc);
                        $scope.locations.splice(idx, 1);
                        $scope.location = {};
                    })
                };

                $scope.saveSection = (newSection, location) => {
                    if (!$scope.newSectionForm.$valid) {
                        $('#newSectionForm').addClass('was-validated');
                        return;
                    }

                    $scope.newSection.location_id = location.id;

                    sectionService.saveSection($scope.newSection).then((resp) => {
                        $scope.newSection = null;
                        if (!location.sections) {
                            location.sections = [];
                        }
                        location.sections.push(resp);
                    });
                };

                if ($state.params.locationId) {
                    locationService.getLocation($state.params.locationId).then(loc => $scope.location = loc)
                } else {
                    $scope.location = {};
                }



            }]);