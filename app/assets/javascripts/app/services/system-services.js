/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .service('userService', function ($http, ENV, errorHandlingService, $rootScope, parameterService, $state, notificationService) {
        var _this = this;


        /* get current user details */
        _this.getUser = function (clbk) {
            $('.loading-spinner').show();
            $('.loading-finished').hide();

            $http.get(ENV + 'users/edit.json')
                .success(function (data) {
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status, headers, config) {
                    errorHandlingService.handle(data, status);
                    $('.loading-finished').show();
                });
        };

        /* save details */
        _this.saveUser = function (user, clbk) {
            $http.put(ENV + 'users.json', {user: user})
                .success(function (data) {
                    $('.loading-spinner').hide();
                    $('.loading-finished').show();
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Profile update successful!'});
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status, headers, config) {
                    errorHandlingService.handle(data, status);
                    $('.loading-finished').show();
                });
        };

        _this.registerUser = function (user, clbk, errClbk) {
            user.notif_registration_id = notificationService.notifRegistrationId;
            $http.post(ENV + 'users.json', {user: user})
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Logged in as ' + user.email + '!'});
                    localStorage.setItem('user', JSON.stringify(data));
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    if (!errClbk) {
                        errorHandlingService.handle(data, status);
                    } else {
                        errClbk(data,status);
                    }
                })
        };

        _this.recoverPassword = function (email, clbk) {
            $http.post(ENV + 'users/password.json', {user: {email: email}})
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', {
                        fieldName: '',
                        text: 'Password recovery link sent to ' + email + '.'
                    });
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                })
        };

        _this.login = function (user, password, clbk, errClbk) {
            $http.post(ENV + '/users/sign_in.json', {user: {email: user, password: password, remember_me: 1}})
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', {fieldName: '', text: 'Hello ' + user + '!'});
                    localStorage.setItem('user', JSON.stringify(data));
                    if (clbk) {
                        clbk(data);
                    }
                })
                .error(function (data, status) {
                    if (!errClbk)
                        errorHandlingService.handle(data, status);
                    else {
                        errClbk(data, status);
                    }
                })
        };

        _this.logout = function () {
            $http['delete'](ENV + '/users/sign_out.json', {})
                .success(function (data) {
                    localStorage.removeItem('user');
                })
                .error(function (data, status) {
                    if (!errClbk)
                        errorHandlingService.handle(data, status);
                    else {
                        errClbk(data, status);
                    }
                })
        };

    })

    .service('errorHandlingService', function ($rootScope, $state) {

        var _this = this;
        _this = this;

        _this.buildErrorMessages = function (data) {
            var errMsgs = [];
            var i = 0;
            var errors = data.Error || data.errors || data.error;

            if (typeof errors === "string") {
                errMsgs[i] = {fieldName: '', text: errors};
                return errMsgs;
            }


            for (var item in errors) {
                var fieldName = item == 'general' ? '' : item;
                var text = typeof errors[item] == 'string' ? errors[item] : errors[item][0];
                errMsgs[i] = {fieldName: fieldName, text: text};
                i++;
            }
            return errMsgs;
        };

        this.handle = function (data, status) {
            if (status == 420 || status == 422) { // 420  || 422 is an error status with business message
                // transform error response into a manageable obj
                var errorMessages = _this.buildErrorMessages(data);
                $rootScope.$broadcast('http.error', errorMessages);
            } else if (status == 401) {
                //if unauthorized, go to login
                errorMessages = _this.buildErrorMessages(data);
                $rootScope.$broadcast('http.error', errorMessages);
                $state.go('home.register', {'hide_blanket': true});//hide blanket
            } else {
                $rootScope.$broadcast('http.error', [{fieldName: '', text: 'Connectivity error.'}]);
            }
            $('.loading-spinner').hide();
        }

    });