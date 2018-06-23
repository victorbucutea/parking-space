/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.controllers').controller('EditParkingSpaceCtrl',
    ['$scope', '$rootScope', '$state', '$q', 'geocoderService', 'parameterService', '$stateParams', 'replaceById', 'parkingSpaceService',
        function ($scope, $rootScope, $state, $q, geocoderService, parameterService, $stateParams, replaceById, parkingSpaceService, ) {


            $scope.calculateAddress = function () {

                let mapCenter = $rootScope.map.getCenter();

                let space = $scope.spaceEdit;

                geocoderService.getAddress(mapCenter.lat(), mapCenter.lng(), function (newAddr) {
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
                    space.title = "Loc parcare " + sublocality;
                    space.sublocality = sublocality;
                    space.price = parameterService.getStartingAskingPrice();
                    space.currency = parameterService.getStartingCurrency();
                    space.daily_start = new Date(1970, 0, 1, 0, 0);
                    space.daily_stop = new Date(1970, 0, 1, 23, 59);
                    space.space_availability_start = new Date();
                    space.space_availability_stop = moment().add(1, 'd').toDate();

                    $scope.$apply();
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

            if ($stateParams.parking_space_id) {
                parkingSpaceService.getSpace($stateParams.parking_space_id, function (data) {
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

            let owl = $('#thumb1');

            owl.owlCarousel({
                margin: 7,
                items: 2,
                dots: true,
                center: true
            });

            let uploadedFiles = {};


            window.removeFile = function (name, evt) {
                let target = evt.currentTarget;
                let idxToRemove = $('#thumb1').find('.btn').index(target);
                delete uploadedFiles[name];
                let fileAttr = target.dataset.fileId;
                $scope.spaceEdit[fileAttr] = null;
                owl.trigger('remove.owl.carousel', idxToRemove).trigger('refresh.owl.carousel');
            };

            let moving = false;

            window.showThumbnail = function (evt) {
                if (moving) {
                    return;
                }
                let img = evt.currentTarget.src;
                $scope.showFullImage = true;
                document.getElementById('imgModal').src = img;
                $scope.$apply();
            };

            window.stopThumbnail = function (evt) {
                moving = true;
            };

            window.startThumbnail = function (evt) {
                moving = false;
            };

            $('#imgModalDiv').click((evt) => {
                evt.stopPropagation();
                $scope.showFullImage = false;
                $scope.$evalAsync();
            });

            $('#fileupload').fileupload({
                url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/image/upload',
                dataType: 'json',
                dropZone: $('#dropZone'),
                imageOrientation: true,
                formData: {upload_preset: window.cloudinaryPreset},
                add: function (e, data) {

                    if (!(/(\.|\/)(jpe?g|png)$/i).test(data.files[0].name)) {
                        alert('Not an accepted file type');
                        return;
                    }

                    if (data.files[0].size > 8000000) {
                        alert('File is too big');
                        return;
                    }

                    if (Object.keys(uploadedFiles).length === 3) {
                        return;
                    }

                    let dataUrl = URL.createObjectURL(data.files[0]);
                    let file = data.files[0];
                    uploadedFiles[file.name] = data;


                    let div = '<div>' +
                        '<img src="' + dataUrl + '" ' +
                        'onmouseup="showThumbnail(event)" ' +
                        'onmousedown="startThumbnail(event)" ' +
                        'onmousemove="stopThumbnail()" class="img-thumbnail"/>' +
                        '<div id="uploadProgressCont" class="progress-container">\n' +
                        '    <div id="uploadProgressBar-' + file.name + '"' +
                        '         style="width: 0" class="progress-bar">' +
                        '    </div>' +
                        '</div>' +
                        '<button class="btn btn-link btn-block" onclick="removeFile(\'' + file.name + '\',event)">' +
                        ' <i class="fa fa-trash"></i> Șterge' +
                        '</button>' +
                        '</div>';

                    owl.trigger('add.owl.carousel', [div, 0]).trigger('refresh.owl.carousel');

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
            });

            $scope.$watch('spaceEdit', (newVal) => {
                if (!newVal) return;
                [1, 2, 3].forEach((idx) => {
                    let file = newVal['file' + idx];
                    if (!file) return;

                    let div = '<div>' +
                        '<img src="https://res.cloudinary.com/'+ window.cloudinaryName + '/image/upload/' + file + '" ' +
                        'onmouseup="showThumbnail(event)" ' +
                        'onmousedown="startThumbnail(event)" ' +
                        'onmousemove="stopThumbnail()" ' +
                        'class="img-thumbnail"/>' +
                        '<div id="uploadProgressCont" class="progress-container">\n' +
                        '    <div id="uploadProgressBar-' + file + '"' +
                        '         style="width: 0" class="progress-bar">' +
                        '    </div>' +
                        '</div>' +
                        '<button data-file-id="'+('file' + idx) +'" class="btn btn-link btn-block" onclick="removeFile(\'' + file + '\',event)">' +
                        ' <i class="fa fa-trash"></i> Șterge' +
                        '</button>' +
                        '</div>';
                    owl.trigger('add.owl.carousel', [div, idx]).trigger('refresh.owl.carousel');
                });
            });


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
                if (!spaceEdit.title) {
                    alert("Introdu un titlu pentru acest loc.");
                    return;
                }

                if (spaceEdit.space_availability_start > spaceEdit.space_availability_stop) {
                    alert("Data de stop nu poate fi inaintea celei de start!");
                    return;
                }

                if ($scope.step === 1) {
                    $scope.loading = true;
                    let clbks = [];
                    for (let f in uploadedFiles) {
                        if (uploadedFiles.hasOwnProperty(f)) {
                            let data = uploadedFiles[f];
                            if (data.submit)
                                clbks.push(data.submit());
                        }
                    }

                    $q.all(clbks).then((response) => {

                        response.forEach((resp, idx) => {
                            for (let i = 1; i <= 3; i++) {
                                let attr = 'file' + i;
                                if (!$scope.spaceEdit[attr]) {
                                    $scope.spaceEdit[attr] = resp.public_id;
                                    break;
                                }
                            }
                        });


                        parkingSpaceService.saveSpace($scope.spaceEdit, function (savedSpace) {
                            $rootScope.$emit('spaceSave', savedSpace);
                            $scope.loading = false;
                            $state.go('home.search');
                        });
                    }).catch((e) => {
                        $rootScope.$emit('http.error', e);
                    });

                    return;
                }

                $scope.step++;
                $scope.termsAndConditions = false;
            };


            $scope.close = function () {
                $state.go('^');
            };

        }]);