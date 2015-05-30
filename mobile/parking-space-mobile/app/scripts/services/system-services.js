/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .service('userService', function ($http, ENV, errorHandlingService, $rootScope, parameterService, $state) {
        var _this = this;

        _this.registerUser = function (user, clbk) {
            $http.post(ENV + 'users.json', {user: user})
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Logged in as ' + user.email + '!');
                    localStorage.setItem('user', JSON.stringify(data));
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    errorHandlingService.handle(data, status);
                })
        };

        _this.recoverPassword = function (email, clbk) {
            $http.post(ENV + 'users/password.json', {user: {email: email}})
                .success(function (data) {
                    //TODO show message with direct dom manipulation
                    $rootScope.$broadcast('http.notif', 'Password recovery link sent to ' + email + '.');
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
                    $rootScope.$broadcast('http.notif', 'Hello ' + user + '!');
                    localStorage.setItem('user', JSON.stringify(data));
                    if (clbk)
                        clbk(data);
                })
                .error(function (data, status) {
                    if (!errClbk)
                        errorHandlingService.handle(data, status);
                    else {
                        errClbk(data, status);
                    }
                })

        };


        _this.getUser = function () {
            var item = localStorage.getItem('user');
            if (item) {
                return JSON.parse(item);
            } else {
                console.error('cannot initialize user. Not logged in?');
            }
        };

        // attempt to access a protected resource to check whether user is logged in
        $http.get(ENV + 'parking_spaces.json?lat=0&lon=0&range=0')
            .success(function (data) {
                // we're logged in, hide login blanket
                $('#login-blanket').hide();
                $state.go('home.map.search');
            })
            .error(function (data, status) {
                if (status == 401) { // Unauthorized
                    // attempt a re-login with stored credentials
                    var item = localStorage.getItem('user');
                    if (item) {
                        var user = JSON.parse(item);
                        _this.login(user.email, user.password,
                            function () {},
                            function () {
                                // if error show login screen
                                $('#login-blanket').hide();
                            });
                    } else {
                        $('#login-blanket').hide();
                        $rootScope.$broadcast('http.notif', 'Cannot log in automatically. Please fill in your credentials');
                    }
                } else {
                    $('#login-blanket').hide();
                    // show connectivity error
                    $rootScope.$broadcast('http.error', [{fieldName: '', text: 'Connectivity error.'}]);
                }
            });
    })

    .service('errorHandlingService', function ($rootScope,$state) {

        var _this = this;
        _this = this;

        _this.buildErrorMessages = function(data){
            var errMsgs = [];
            var i = 0;
            var errors = data.Error || data.errors || data.error;

            if( typeof errors === "string") {
                errMsgs[i] = {fieldName:'', text: errors};
                return errMsgs;
            }

            for (item in errors) {
                var fieldName = item == 'general' ? '' : item;
                var text = typeof errors[item] == 'string'? errors[item]: errors[item][0];
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
                $state.go('home.register',{'hide_blanket':true});//hide blanket
            } else {
                $rootScope.$broadcast('http.error', [{fieldName: '', text: 'Connectivity error.'}]);
            }
            $('.loading-spinner').hide();
        }

    });