/**
 * Created by 286868 on 04.04.2015.
 */
angular.module('ParkingSpaceMobile.services')

    .service('authenticationService', function ($http) {
    })

    .service('errorHandlingService', function ($rootScope) {

        this.handle = function (data, status) {
            if (status == 420 || status == 422) { // 420  || 422 is an error status with business message
                // transform error response into a manageable obj
                var errMsgs = [];
                var i = 0;
                for (item in data.Error) {
                    var fieldName = item == 'general' ? '' : item;
                    errMsgs[i] = {fieldName: fieldName, text: data.Error[item][0]};
                    i++;
                }
                $rootScope.$broadcast('http.error', errMsgs);
            } else {
                $rootScope.$broadcast('http.error', {fieldName: '', text: 'Connectivity error.'});
            }
            $('.loading-spinner').hide();
        }
    })

/**
 * service provides a unique terminal and user identifier
 * should cache user credentials
 * device information - should be ignored in favor of auth info + phone no
 */
    .service('deviceAndUserInfoService', function () {
        // TODO fill in these fields on auth ( or make user insert them ? )
        this.phoneNo = '40727456250';
        this.userName = 'victor.bucutea@gmail.com';
        this.deviceId = this.phoneNo + "_" + this.userName;
    })