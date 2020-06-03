/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpace.services')

    .service('userService',
        ['$http', 'errorHandlingService', '$rootScope', 'parameterService', '$state', 'notificationService', '$q',
            function ($http, errorHandlingService, $rootScope, parameterService, $state, notificationService, $q) {
                let _this = this;

                /* get current user details */
                _this.getUser = function () {
                    let user = sessionStorage.getItem("current_user");
                    if (user) {
                        return $q((res, rej) => {
                            res(JSON.parse(user));
                        })
                    }

                    return $http.get('/users/edit.json')
                        .then(function (res) {
                            let data = res.data;
                            let userjson = JSON.stringify(data);
                            sessionStorage.setItem("current_user", userjson);
                            return data;
                        }, _this.errFunc);
                };

                /* save details */
                _this.saveUser = function (user, clbk) {
                    $http.put('/users.json', {user: user})
                        .then(function (res) {
                            let data = res.data;
                            $rootScope.$emit('http.notif', 'Profil salvat cu succes!');
                            sessionStorage.setItem('current_user', JSON.stringify(data));
                            if (clbk)
                                clbk(data);
                        }, _this.errFunc);
                };

                _this.registerUser = function (user, clbk) {
                    user.notif_registration_id = notificationService.notifRegistrationId;
                    $http.post('/users.json', {user: user})
                        .then(function (res) {
                            let data = res.data;
                            $rootScope.$emit('http.notif', 'Bine ai venit ' + user.email + '!');
                            sessionStorage.setItem('current_user', JSON.stringify(data));
                            if (clbk)
                                clbk(data);
                        }, _this.errFunc)
                };

                _this.recoverPassword = function (email, clbk) {
                    $http.post('/users/password.json', {user: {email: email}})
                        .then(function (res) {
                            let data = res.data;
                            $rootScope.$emit('http.notif', 'Link pt. recuperare parolă trimis la ' + email + '.');
                            if (clbk)
                                clbk(data);
                        }, function (err) {
                            errorHandlingService.handle(err.data, err.status);
                        })
                };

                _this.login = function (user, password) {
                    return $http.post('/users/sign_in.json', {user: {email: user, password: password, remember_me: 1}})
                        .then(_this.loginInternal, _this.errFunc)
                };

                _this.loginFb = function (token) {
                    return $http.post('/users/sign_in_fb.json', {user: {token: token, remember_me: 1}})
                        .then(_this.loginInternal, function (err) {
                            sessionStorage.removeItem("current_user");
                            errorHandlingService.handle(err.data, err.status);
                        })
                };

                _this.logout = function (clbk) {
                    $http['delete']('/users/sign_out.json', {})
                        .then(function (res) {
                            sessionStorage.removeItem('current_user');
                            if (clbk) {
                                clbk(res);
                            }
                        }, function (err) {
                            errorHandlingService.handle(err.data, err.status);
                        })
                };

                _this.validateCode = function (code) {
                    return $http.post('/users/validate_code.json', {phone_validation_code: code})
                        .then(function (res) {
                            let user = res.data;
                            sessionStorage.setItem('current_user', JSON.stringify(user));
                        }, _this.errFunc);
                };

                _this.resendCode = function (prefix, number, clbk) {
                    return $http.post('/users/send_new_code.json', {prefix: prefix, phone_number: number})
                        .then(function (res) {
                            let user = res.data;
                            sessionStorage.setItem('current_user', JSON.stringify(user));
                        }, _this.errFunc);
                }

                /* get current user details */
                _this.getRoles = function (clbk) {

                    $http.get('/roles/user_company_roles.json')
                        .then(function (res) {
                            let data = res.data;
                            if (clbk)
                                clbk(data);
                        }, function (err) {
                            console.log(err);
                        });
                };

                _this.instructionsShown = function () {
                    let val = localStorage.getItem('instructionsShown') === 'true';
                    localStorage.setItem('instructionsShown', 'true');
                    return val;
                }


                _this.loginInternal = function (rs) {
                    let user = rs.data;
                    $rootScope.$emit('http.notif', 'Bine ai venit ' + user.full_name + '!');
                    sessionStorage.setItem('current_user', JSON.stringify(user));
                    return user;
                }

                _this.errFunc = function (err) {
                    sessionStorage.removeItem("current_user");
                    errorHandlingService.handle(err.data, err.status);
                };
            }])

    .service('errorHandlingService', ['$rootScope', '$state', function ($rootScope, $state) {

        let _this = this;
        _this = this;

        _this.buildErrorMessages = function (data) {
            let errMsgs = [];
            let i = 0;
            if (!data) {
                errMsgs.push('Unknown server error');
                return errMsgs;
            }
            if (data.skipFlash) {
                return [];
            }
            let errors = data.Error || data.errors || data.error;

            if (typeof errors === "string") {
                errMsgs[i] = errors;
                return errMsgs;
            }


            for (let item in errors) {
                let text = typeof errors[item] === 'string' ? errors[item] : errors[item][0];
                errMsgs[i] = text;
                i++;
            }

            if (errMsgs.length === 0) {
                errMsgs.push('Unknown server error');
            }
            return errMsgs;
        };

        this.handle = function (data, status) {
            if (status !== 401 && status !== 403) { // 420  || 422 is an error status with business message
                // transform error response into a manageable obj
                let errorMessages = _this.buildErrorMessages(data);
                $rootScope.$emit('http.error', errorMessages);
            } else if (status === 401 || status === 403) {
                //if unauthorized, go to login
                sessionStorage.removeItem("current_user");
                sessionStorage.removeItem("current_roles");
                errorMessages = _this.buildErrorMessages(data);
                $rootScope.$emit('http.error', errorMessages);
                $rootScope.$emit('logout', 'logout');
                $state.go('login', $state.params);
            } else if (status === -1) {
                $rootScope.$emit('http.error', 'Eroare de conexiune. Ești conectat la internet?');
            } else {
                $rootScope.$emit('http.error', 'Connectivity error.');
            }
            throw {data: data, status: status};
        }

    }])

    .service('notificationService',
        ['$rootScope', '$http', '$q', '$state',
            function ($rootScope, $http, $q, $state) {

                let _this = this;
                let registered = false;
                let notifAsked = false;

                _this.registerForNotifications = function (forOffers) {

                    if (!notifAsked && Notification.permission !== 'granted') {
                        if (!forOffers)
                            $rootScope.$emit('http.warning', "Pentru a primi oferte pentru locul tău " +
                                "în timp real, te rugăm acceptă notificările.");
                        else
                            $rootScope.$emit('http.warning', "Te rugăm acceptă " +
                                "pentru a primi notificări în timp real despre oferta ta.");

                        notifAsked = true;
                    }

                    // request notification permission from the user
                    navigator.serviceWorker.ready.then(function (reg) {
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: window.vapidPublicKey
                        }).then(function (sub) {
                            // user accepted
                            let subStr = JSON.stringify(sub);
                            subJson = JSON.parse(subStr);
                            subJson.notif_approved = true;
                            $http.post('/users/register_for_notifications.json',
                                subJson
                            ).then(function () {
                                registered = true;
                            }).catch((e) => {
                                console.warn('Unable to send endpoint url to server.' +
                                    'Will retry on next open.');
                            });

                        }).catch(function (e) {

                            if (Notification.permission === 'denied') {
                                // user doesn't want notification
                                $http.post('/users/register_for_notifications.json', {
                                    notif_approved: false
                                }).catch((e) => {
                                    console.warn('Unable to send endpoint url to server.' +
                                        'Will retry on next open.');
                                });
                            } else {
                                // exception while subscribing
                                console.error('Unable to subscribe to push', e);
                            }

                        });
                    });
                };

                _this.hideOfferNotifications = function () {

                };

                _this.hideParkingSpaceNotifications = function () {

                };


                _this.showNotifications = function (msg) {

                };

            }]);
