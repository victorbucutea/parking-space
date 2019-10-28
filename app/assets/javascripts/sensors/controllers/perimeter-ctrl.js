angular.module('ParkingSpaceSensors.controllers')
    .controller('PerimeterCtrl',
        ['$scope', '$state', '$rootScope', 'companyUserService', 'locationService', 'replaceById',
            function ($scope, $state, $rootScope, userService, locationService, replaceById) {

                $scope.editablePer = angular.copy($scope.selectedPer);
                // $scope.selectedPer = $state.params.perimeter;

                $scope.deletePerimeter = function () {
                    var idx = $scope.parkingPerimeters.indexOf($scope.selectedPer);
                    $scope.parkingPerimeters.splice(idx, 1);
                    $state.go("^");
                };

                $scope.savePerimeter = function () {
                    if (!$scope.perForm.$valid) {
                        $('#perForm').addClass('was-validated');
                        return;
                    }

                    // build expression string like rule.id AND rule.id OR rule.id
                    $scope.editablePer.rules_expression = "";
                    $scope.expression.forEach((expr) => {
                        if (!expr) return;

                        if (angular.isString(expr)) {
                            $scope.editablePer.rules_expression += " " + expr;
                        } else {
                            $scope.editablePer.rules_expression += " " + expr.id;
                        }
                    });


                    var idx = $scope.parkingPerimeters.indexOf($scope.selectedPer);
                    $scope.parkingPerimeters.splice(idx, 1);
                    $scope.parkingPerimeters.push($scope.editablePer);
                    $state.go("^");
                };


                $scope.loadRules = function (query) {
                    locationService.getRules(query, null, (data) => {
                        $scope.rules = data;
                    })
                };


                let timeoutHandle = 0;
                $scope.$watch('ruleSearchTxt', function (newVal) {
                    if (!newVal || newVal.length < 2) return;
                    if (timeoutHandle !== 0) {
                        clearTimeout(timeoutHandle);
                    }
                    timeoutHandle = setTimeout(() => {
                        $scope.loadRules(newVal);
                    }, 1000)
                });

                let usertimeoutHandle = 0;
                $scope.$watch('userSearchTxt', function (newVal) {
                    if (!newVal || newVal.length < 2) return;
                    if (usertimeoutHandle !== 0) {
                        clearTimeout(usertimeoutHandle);
                    }
                    usertimeoutHandle = setTimeout(() => {
                        userService.loadCompanyUsers(newVal, (data) => {
                            $scope.users = data;
                        })
                    }, 1000)
                });

                $scope.selectUser = function (user) {
                    $scope.editablePer.user = user;
                }

                if( $scope.editablePer.user_id) {
                    userService.loadCompanyUser($scope.editablePer.user_id, (data) => {
                        $scope.users = data;
                    })
                }


                $scope.expression = [];

                if ($scope.editablePer) {
                    let rulesExpression = $scope.editablePer.rules_expression;
                    if (rulesExpression) {
                        var ids = rulesExpression.match(/\d/g);
                        ids = ids.join(",");
                        locationService.getRules(null, ids, (data) => {
                            if (!data.length) return;

                            rulesExpression.trim().split(" ").forEach((elm, idx) => {
                                if (isNaN(elm)) {
                                    if (idx !== 0) {
                                        $scope.expression.push(elm);
                                    }
                                } else
                                    $scope.expression.push(data.find((d) => {
                                        return d.id == elm
                                    }));
                            })
                        })
                    }
                }

                $scope.operator = "AND";
                $scope.changeOperator = function () {
                    if ("AND" === $scope.operator) {
                        $scope.operator = "OR";
                    } else {
                        $scope.operator = "AND";
                    }
                };

                $scope.addOperator = function (op) {
                    $scope.expression.push($scope.operator);
                    $scope.expression.push(op);
                    $scope.addingOperator = false;
                    $scope.ruleSearchTxt = '';
                };


                $scope.initPopup = function() {
                    $(".b-main").each((e,elm) => {
                        new Tooltip(elm,  {
                            placement: 'top'
                        });
                    })
                };

                $scope.removeOperator = function (idx) {
                    $scope.expression.splice(idx, 1);
                    if (idx > 1) {
                        $scope.expression.splice(idx - 1, 1);
                    }
                    if ($scope.expression.length > 0 &&
                        ($scope.expression[0] === "OR" || $scope.expression[0] === 'AND')) {
                        $scope.expression.splice(0, 1);
                    }
                }
            }

        ]);

