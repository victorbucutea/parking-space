/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl',
    ['$scope', '$rootScope', '$state', '$q', 'geoService', 'parameterService', '$stateParams', 'replaceById', 'parkingSpaceService',
        function ($scope, $rootScope, $state, $q, geoService, parameterService, $stateParams, replaceById, parkingSpaceService) {


            $scope.calculateAddress = function () {
                if (!$rootScope.map) return;

                let mapCenter = $rootScope.map.getCenter();

                let space = $scope.spaceEdit;

                geoService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
                    let street = newAddr.street || '';
                    let street_number = newAddr.street_number || '';
                    let sublocality = newAddr.sublocality ||
                        newAddr.administrative_area_level_2 ||
                        newAddr.administrative_area_level_1 || '';
                    let city = newAddr.city || '';

                    space.address_line_1 = street + ', ' + street_number;
                    space.address_line_2 = sublocality + ', ' + city;
                    space.location_lat = mapCenter.lat();
                    space.location_long = mapCenter.lng();
                    space.sublocality = sublocality;
                    if (!space.title) {
                        space.title = "Loc parcare " + sublocality;
                        parameterService.getStartingAskingPrice().then((pr) => {
                            space.price = pr.price;
                            space.currency = pr.currency;
                        });
                        space.daily_start = new Date(1970, 0, 1, 0, 0);
                        space.daily_stop = new Date(1970, 0, 1, 23, 59);
                        space.space_availability_start = new Date();
                        space.space_availability_stop = moment().add(1, 'd').toDate();
                    }

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            };

            if ($scope.spaceEdit && !$scope.spaceEdit.weekly_schedule)
                $scope.spaceEdit.weekly_schedule = {
                    mon: true,
                    tue: true,
                    wed: true,
                    thu: true,
                    fri: true,
                    sat: true,
                    sun: true,
                };

            if ($stateParams.spaceId) {
                parkingSpaceService.getSpace($stateParams.spaceId, function (data) {
                    $scope.spaceEdit = data;
                });
            } else {
                $scope.calculateAddress();
            }


            $scope.showSched = function () {
                $('#schedule').slideToggle(200);
                $scope.scheduleOpen = !$scope.scheduleOpen;
            };


            $scope.step = 0;
            $scope.termsAndConditions = true;


            $scope.prevStep = function () {
                $('#postSpaceForm').removeClass('was-validated');
                $scope.termsAndConditions = true;
                $scope.step--;
            };


            $scope.nextStep = function () {
                $('#postSpaceForm').removeClass('was-validated');

                if (!$scope.postSpaceForm.$valid) {
                    $('#postSpaceForm').addClass('was-validated');
                    return;
                }

                let spaceEdit = $scope.spaceEdit;

                if (spaceEdit.space_availability_start > spaceEdit.space_availability_stop) {
                    alert("Data de stop nu poate fi inaintea celei de start!");
                    return;
                }

                if ($scope.step === 1) {

                    $scope.loading = true;

                    let savePromise = parkingSpaceService.saveSpace($scope.spaceEdit);
                    let uploadFilesPromise = $scope.uploadedFiles.submit();
                    let images = $scope.spaceEdit.images;
                    let existingImgs = [];
                    if (images) {
                        existingImgs = images.filter(i => !i._destroy);
                    }

                    $q.all([savePromise, uploadFilesPromise]).then((savedSpaceAndFiles) => {
                        if (!savedSpaceAndFiles[0]) return;
                        let savedSpace = savedSpaceAndFiles[0];
                        $scope.spaceEdit = savedSpace;
                        replaceById($scope.spaceEdit, $scope.spaces);
                        let uploadedFiles = [...savedSpaceAndFiles[1], ...existingImgs];
                        parkingSpaceService.uploadImages(savedSpace.id, uploadedFiles).then((resp) => {
                            $rootScope.$emit('http.notif', 'Locul de parcare a fost salvat!');
                            $scope.spaceEdit = resp;
                            replaceById($scope.spaceEdit, $scope.spaces);
                        });
                        if (savedSpace.missing_title_deed) {
                            $scope.step++;
                        } else {
                            $state.go('^');
                        }
                    }).finally(() => {
                        $scope.loading = false;
                    })

                } else if ($scope.step === 2) {
                    $scope.uploadedDocs.submit().then((docs) => {
                        if (!docs.length) {
                            alert('Va rugam selectati un document');
                            return;
                        }
                        parkingSpaceService.uploadDocuments($scope.spaceEdit.id, docs, function (savedDocs) {
                            $state.go('map.search');
                        });
                    }).finally(() => {
                        $scope.loading = false;
                    });
                } else {
                    $scope.step++;
                    $scope.termsAndConditions = false;
                }
            };


            $scope.close = function () {
                $state.go('^');
            };

            $scope.pickNewAddress = function () {
                // emit Edit space
                $('#postSpaceModal').addClass('slide-left');
                $('.map-controls.search').hide();
                $scope.editingSpot = true;
            }

            $scope.$on('$stateChangeStart', function (s){
                $('.map-controls.search').show();
            } )

            $scope.selectNewAddress = function () {
                $('#postSpaceModal').removeClass('slide-left');
                $scope.editingSpot = false;
                $scope.calculateAddress()
            }

        }]);