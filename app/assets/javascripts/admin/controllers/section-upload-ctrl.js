angular.module('ParkingSpaceAdmin.controllers')
    .controller('SectionUploadCtrl',
        ['$scope', '$state', '$rootScope', 'companyUserService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, userService, locationService, replaceById) {

                $('#fileupload').fileupload({
                    url: 'https://api.cloudinary.com/v1_1/' + window.cloudinaryName + '/image/upload/',
                    dataType: 'json',
                    imageOrientation: true,
                    add: function (e, data) {
                        if (!(/(\.|\/)(jpe?g|png)$/i).test(data.files[0].name)) {
                            alert('Not an accepted file type');
                            return;
                        }

                        if (data.files[0].size > 8000000) {
                            alert('File is too big');
                            return;
                        }
                        data.formData = {
                            upload_preset: window.cloudinaryPreset,
                            folder: 'sections/' + $scope.section.id + '/' + moment().format('DDMMYYYY-HHm'),
                        };


                        $scope.thumbDisplay = true;
                        $scope.plan = data;
                        $scope.$apply();

                        $scope.plan.submit().then((resp) => {
                            $scope.section.interior_map = resp.public_id;
                            $rootScope.$emit('http.notif', 'Plan parcare salvat cu succes!');
                            $state.go('^');
                            $scope.$apply();
                            $('#uploadProgressBar').hide().css('width', '0')
                        }, (err) => {
                            $rootScope.$emit('http.error', 'Eroare la salvarea fisierului');
                            $('#uploadProgressBar').hide().css('width', '0');
                            $scope.$apply();
                        });
                    },
                    progress: function (e, data) {
                        let progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#uploadProgressBar').show().css(
                            'width',
                            progress + '%'
                        );
                    }


                })
            }]);