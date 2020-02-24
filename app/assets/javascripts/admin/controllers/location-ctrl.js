angular.module('ParkingSpaceAdmin.controllers')
    .controller('LocationCtrl',
        ['$scope', '$state', '$rootScope', '$document', 'sectionService', 'locationService', 'replaceById',
        function ($scope, $state, $rootScope, $document, sectionService, locationService,  replaceById) {
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


            locationService.getLocations((data) => {
                $scope.locations = data;
            });

            $scope.selectLocation = (loc) => {
                $scope.location = loc;
            };

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

                sectionService.saveSection($scope.newSection, (resp) => {
                    $scope.newSection =null;
                    if (!location.sections) {
                        location.sections = [];
                    }
                    location.sections.push(resp);
                });
            };



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


        }]);