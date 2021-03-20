angular.module('ParkingSpaceAdmin.controllers')
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

                        $scope.editablePer.rules_expression += " " + (expr.id || expr.name);

                    });


                    var idx = $scope.parkingPerimeters.indexOf($scope.selectedPer);
                    $scope.parkingPerimeters.splice(idx, 1);
                    $scope.parkingPerimeters.push($scope.editablePer);
                    $state.go("^");
                };


                $scope.loadRules = function (query) {
                    locationService.getRules(query, null, (data) => {
                        // remove ids which already exist
                        if ($scope.expression)
                            data = data.filter((rule) => {
                                return !$scope.expression.find((d) => {
                                    return d.id === rule.id
                                })
                            });

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

                $scope.searchUser = function (newVal, clbk) {
                    userService.listUsers(newVal).then((data) => {
                        $scope.users = data;
                        $scope.users.forEach(u => {
                            u.name = u.email;
                            u.description = u.full_name
                        });
                        if (clbk) {
                            clbk(data);
                        }
                    })
                }

                $scope.selectUser = function (user) {
                    $scope.editablePer.user = user;
                    $scope.editablePer.user_id = user.id;
                    console.log('select user ', user);
                };

                if ($scope.editablePer.user_id) {
                    userService.findUser($scope.editablePer.user_id, (data) => {
                        $scope.editablePer.user = data;
                    })
                }


                $scope.expression = [];

                if ($scope.editablePer) {
                    console.log($scope.editablePer);
                    let rulesExpression = $scope.editablePer.rules_expression;
                    if (rulesExpression) {
                        var ids = rulesExpression.match(/\d/g);
                        ids = ids.join(",");
                        locationService.getRules(null, ids, (data) => {
                            if (!data.length) return;
                            rulesExpression.trim().split(" ").forEach((elm, idx) => {
                                if (isNaN(elm)) {
                                    if (idx !== 0) {
                                        $scope.expression.push({name: elm, type: "O"});
                                    }
                                } else
                                    $scope.expression.push(data.find((d) => {
                                        return d.id == elm
                                    }));
                            })
                        })
                    }
                }

                $scope.operator = {name: "AND", type: "O"};
                $scope.changeOperator = function () {
                    if ("AND" === $scope.operator) {
                        $scope.operator = {name: "OR", type: "O"};
                    } else {
                        $scope.operator = {name: "AND", type: "O"};
                    }
                };

                $scope.addOperator = function (op) {
                    if ($scope.expression.length > 0) {
                        $scope.expression.push($scope.operator);
                    }
                    $scope.expression.push(op);
                    $scope.addingOperator = false;
                    $scope.ruleSearchTxt = '';
                };

                $scope.removeOperator = function (idx) {
                    $scope.expression.splice(idx, 1);
                    if (idx > 1) {
                        $scope.expression.splice(idx - 1, 1);
                    }
                    if ($scope.expression.length > 0 &&
                        ($scope.expression[0].name === "OR" || $scope.expression[0].name === 'AND')) {
                        $scope.expression.splice(0, 1);
                    }
                }


                $scope.initPopup = function (op) {
                    $(".badge-dark").each((e, elm) => {
                        new Tooltip(elm, {
                            placement: 'top',
                            title: op.description
                        });
                    })
                };
            }

        ]);

