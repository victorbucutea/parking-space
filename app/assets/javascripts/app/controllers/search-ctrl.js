/**
 * Created by 286868 on 04.04.2015.
 */


angular.module('ParkingSpaceMobile.controllers').controller('SearchParkingSpaceCtrl', function (geocoderService, notificationService, userService, $rootScope, $scope, parkingSpaceService, parameterService, geolocationService, $state, currencyFactory, offerService, ENV, $stateParams) {
    if(!$rootScope.map){
        $rootScope.$emit('http.error','Nu se poate inițializa harta. Ești conectat la internet? ')
        return;
    }

    let dragListenClbk = function () {
        let bnds = $rootScope.map.getBounds().toJSON();
        parkingSpaceService.getAvailableSpaces(bnds,  function (spaces) {
            drawSpaces(spaces);
        });
    };

    let dragListenHandle = google.maps.event.addListener($rootScope.map, 'idle', dragListenClbk);

    let drawSpaces = function (newVal) {

        if (!newVal || newVal.length === 0) {
            $scope.selectedSpace = null;
        }

        if ($rootScope.markers)
            $rootScope.markers.forEach(function (d) {
                d.setMap();//clear marker
            });

        $rootScope.markers = [];

        newVal.forEach(function (space) {
            let htmlMarker = new HtmlMarker(space, $scope);
            $rootScope.markers.push(htmlMarker);
        })
    };

    $scope.$watch('selectedLocation',newVal => {
        if (!newVal) return;

        $rootScope.map.setCenter(newVal);
    });


    $scope.markerClick = function (data) {
        $scope.selectedSpace = data.elm.space;
        let owned = $scope.selectedSpace.owner_is_current_user;
        if (owned) {
            $state.go('.review-bids');
        } else {
            $state.go('.post-bids');
        }
    };


    $scope.showPostSpace = function () {
        $scope.spaceEdit = {};
        angular.copy($scope.space, $scope.spaceEdit);
        $scope.spaceEdit.title = "";
        geolocationService.getCurrentLocation(function (position) {
            $scope.spaceEdit.recorded_from_lat = position.coords.latitude;
            $scope.spaceEdit.recorded_from_long = position.coords.longitude;
        });
        $state.go('.post');
    };

    $scope.centerMap = function(){
        geolocationService.getCurrentLocation(function (position) {
            let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $rootScope.map.setCenter(pos);
        });
    };


    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('home.map.search') === -1) {

            google.maps.event.removeListener(dragListenHandle);

        } else if (toState.name === 'home.map.search') {
            dragListenClbk();
            // this is dom cleanup, daterange picker does not reuse divs
            $('div.daterangepicker').remove();
        }
    });
});

