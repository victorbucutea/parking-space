/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .service('userService', function ($http, ENV, errorHandlingService, $rootScope, parameterService, $state, notificationService) {
        let _this = this;


        /* get current user details */
        _this.getUser = function (clbk) {

            $http.get(ENV + '/users/edit.json')
                .then(function (res) {
                    let data = res.data;
                    if (clbk)
                        clbk(data);
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                });
        };

        /* save details */
        _this.saveUser = function (user, clbk) {
            $http.put(ENV + '/users.json', {user: user})
                .then(function (res) {
                    let data = res.data;
                    $rootScope.$emit('http.notif', 'Profil salvat cu succes!');
                    sessionStorage.setItem('current_user', JSON.stringify(user));
                    if (clbk)
                        clbk(data);
                }, function (err) {
                    if (!errClbk) {
                        errorHandlingService.handle(err.data, err.status);
                    } else {
                        errClbk(err.data, err.status);
                    }
                });
        };

        _this.registerUser = function (user, clbk, errClbk) {
            user.notif_registration_id = notificationService.notifRegistrationId;
            $http.post(ENV + '/users.json', {user: user})
                .then(function (res) {
                    let data = res.data;
                    $rootScope.$emit('http.notif', 'Bine ai venit ' + user.email + '!');
                    sessionStorage.setItem('current_user', JSON.stringify(data));
                    if (clbk)
                        clbk(data);
                }, function (err) {
                    if (!errClbk) {
                        errorHandlingService.handle(err.data, err.status);
                    } else {
                        errClbk(err.data, err.status);
                    }
                })
        };

        _this.recoverPassword = function (email, clbk) {
            $http.post(ENV + '/users/password.json', {user: {email: email}})
                .then(function (res) {
                    let data = res.data;
                    //TODO show message with direct dom manipulation
                    $rootScope.$emit('http.notif', 'Link pt. recuperare parolă trimis la ' + email + '.');
                    if (clbk)
                        clbk(data);
                }, function (err) {
                    errorHandlingService.handle(err.data, err.status);
                })
        };

        _this.login = function (user, password, clbk, errClbk) {
            $http.post(ENV + '/users/sign_in.json', {user: {email: user, password: password, remember_me: 1}})
                .then(function (rs) {
                    let data = rs.data;
                    //TODO show message with direct dom manipulation
                    $rootScope.$emit('http.notif', 'Bine ai venit ' + user + '!');
                    sessionStorage.setItem('current_user', JSON.stringify(data));
                    if (clbk) {
                        clbk(data);
                    }
                }, function (err) {
                    if (!errClbk)
                        errorHandlingService.handle(err.data, err.status);
                    else {
                        errClbk(err.data, err.status);
                    }
                })
        };

        _this.loginFb = function (id, token, email, clbk, errClbk) {
            $http.post(ENV + '/users/sign_in_fb.json', {user: {id: id, email: email, token: token, remember_me: 1}})
                .then(function (rs) {
                    let user = rs.data.user;
                    $rootScope.$emit('http.notif', 'Bine ai venit ' + user.full_name + '!');
                    sessionStorage.setItem('current_user', JSON.stringify(user));
                    if (clbk) {
                        clbk(user);
                    }
                }, function (err) {
                    if (!errClbk)
                        errorHandlingService.handle(err.data, err.status);
                    else {
                        errClbk(err.data, err.status);
                    }
                })
        };

        _this.logout = function (errClbk) {
            $http['delete'](ENV + '/users/sign_out.json', {})
                .then(function (res) {
                    sessionStorage.removeItem('current_user');
                }, function (err) {
                    if (!errClbk)
                        errorHandlingService.handle(err.data, err.status);
                    else {
                        errClbk(err.data, err.status);
                    }
                })
        };

        _this.validateCode = function(code, clbk, errClbk){
            $http.post(ENV+'/users/validate_code.json',{phone_validation_code : code})
                .then(function(res){
                    let user = res.data;
                    sessionStorage.setItem('current_user', JSON.stringify(user));
                    if (clbk)
                        clbk(user);
                }, function (err) {
                    if (!errClbk) {
                        errorHandlingService.handle(err.data, err.status);
                    } else {
                        errClbk(err.data, err.status);
                    }
                });
        };

        _this.resendCode = function(number, clbk, errClbk){
            $http.post(ENV+'/users/send_new_code.json',{phone_number: number})
                .then(function(res){
                    let user = res.data;
                    sessionStorage.setItem('current_user', JSON.stringify(user));
                    if (clbk)
                        clbk(user);
                }, function (err) {
                    if (!errClbk) {
                        errorHandlingService.handle(err.data, err.status);
                    } else {
                        errClbk(err.data, err.status);
                    }
                });
        }

    })

    .service('errorHandlingService', function ($rootScope, $state) {

        let _this = this;
        _this = this;

        _this.buildErrorMessages = function (data) {
            let errMsgs = [];
            let i = 0;
            let errors = data.Error || data.errors || data.error;

            if (typeof errors === "string") {
                errMsgs[i] =  errors;
                return errMsgs;
            }


            for (let item in errors) {
                let fieldName = item === 'general' ? '' : item;
                let text = typeof errors[item] === 'string' ? errors[item] : errors[item][0];
                errMsgs[i] =  text;
                i++;
            }
            return errMsgs;
        };

        this.handle = function (data, status) {
            if (status === 420 || status === 422) { // 420  || 422 is an error status with business message
                // transform error response into a manageable obj
                let errorMessages = _this.buildErrorMessages(data);
                $rootScope.$emit('http.error', errorMessages);
            } else if (status === 401) {
                //if unauthorized, go to login
                errorMessages = _this.buildErrorMessages(data);
                $rootScope.$emit('http.error', errorMessages);
                $state.go('home.login', {'hide_blanket': true});//hide blanket
            } else {
                $rootScope.$emit('http.error', 'Connectivity error.');
            }
        }

    });