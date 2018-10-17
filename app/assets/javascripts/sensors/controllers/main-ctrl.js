
angular.module('ParkingSpaceSensors.controllers')
    .controller('MainCtrl', ['$scope', '$state', '$rootScope', '$document',
        function ($scope, $state, $rootScope, $document ) {



            console.log($state.params);

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

            $document.on('click', '.ps-modal', function (event) {
                if ($(event.target).hasClass('ps-modal'))
                    $state.go('^');
            });

        }])
;