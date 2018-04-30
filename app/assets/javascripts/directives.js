angular.module('ParkingSpace.directives')

    .directive('dateRange',['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                startDate: '=',
                endDate: '=',
                err: '='
            },
            template: '' +
            '<!-- From date -->' +
            '<date-input class="col px-0" ' +
            '           label="\'De la data\'" ' +
            '           popup-label="\'Start\'" ' +
            '           date="startDate"></date-input>' +

            '<!-- To Date  -->' +
            '<date-input class="col px-0 ml-2 ml-md-4 "' +
            '            label="\'Până la data\'" ' +
            '            popup-label="\'Stop\'" ' +
            '            date="endDate" open="\'left\'"' +
            '            ng-class="{err: err}"></date-input>' ,

            controller: function ($scope) {

                $scope.$watch('startDate', function (newVal) {
                    if (!newVal) return;
                    if ($scope.endDate.isBefore(newVal)) {
                        let endDate = newVal.clone().add(2, 'h');
                        $scope.endDate = endDate;
                    }
                });

                $scope.$watch('endDate', function (newVal) {
                    if (!newVal) return;
                    if (newVal.isBefore($scope.startDate)) {
                        $scope.err = true;
                    } else {
                        $scope.err = false;
                    }
                });
            },

            link: function ($scope, element, attrs) {

            }
        }
    }])

    .directive('dateInput', function () {
        return {
            restrict: 'E',
            scope: {
                date: '=',
                label: '=',
                open: '=',
                popupLabel: '='
            },
            template: '' +
            '<div class=" input">' +
            '            <span class="label"><i>{{label}}</i></span>' +
            '            <div class=" py-1 pt-2 day-of-week">{{dayOfWeek()}}</div>' +
            '            <div class="d-flex py-2  date-container justify-content-center">' +
            '               <div class="date " ng-bind="dateStr()"></div>' +
            '               <div class="time ml-2">' +
            '                    <i class="fa fa-clock-o"></i>' +
            '               </div>' +
            '            <div class="date" ng-bind="timeStr()"></div>' +
            ' </div>',

            link: function ($scope, element, attrs) {
                $scope.date = moment();
                $scope.dateStr = function () {
                    return $scope.date.format('DD MMM');
                };

                $scope.dayOfWeek = function () {
                    return $scope.date.format('dddd');
                };

                $scope.timeStr = function () {
                    return $scope.date.format('HH:mm');
                };

                let opens = $scope.open || 'right';

                let elm = $(element);
                let rangePicker = elm.daterangepicker({
                    "singleDatePicker": true,
                    "minDate": moment(),
                    "autoApply": true,
                    "timePicker": true,
                    "timePicker24Hour": true,
                    "timePickerIncrement": 15,
                    "applyClass": "apply",
                    "cancelClass": "cancel",
                    "opens": opens,
                    "locale": {
                        "format": "DD/MMM/YYYY HH:mm",
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
                    $scope.date = end;
                    $scope.$apply();
                });


                elm.on('show.daterangepicker', function (ev, picker) {
                    elm.addClass('shadow');
                    let lbl = $scope.popupLabel;
                    if (!$scope.shown) {
                        picker.container.find('.calendar-time')
                            .before('<div class="header">' + lbl + '</div>');
                        $scope.shown = true;
                    }

                    let winHeight = $(window).height();
                    let pickerHeight = picker.container.height();
                    let pickerOffset = picker.container.offset().top;
                    let alreadyScrolled = $(window).scrollTop();
                    let scrollAmount = pickerOffset + pickerHeight - winHeight;

                    if (scrollAmount - alreadyScrolled > 0) {
                        $('html, body').animate({
                            scrollTop: scrollAmount + 10
                        }, 200);
                    }
                });

                elm.on('hide.daterangepicker', function (ev, picker) {
                    elm.removeClass('shadow');
                });


            }
        }
    })

;
