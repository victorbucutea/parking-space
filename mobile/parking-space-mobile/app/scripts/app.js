'use strict';

angular.module('ParkingSpaceMobile', ['ionic', 'config',
    'ParkingSpaceMobile.controllers',
    'ParkingSpaceMobile.directives',
    'ParkingSpaceMobile.filters',
    'ParkingSpaceMobile.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            console.log(navigator.camera);
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'templates/home.html'
            })
            .state('home.map', {
                url: '/map',
                views: {
                    'content': {
                        templateUrl: "templates/map.html"
                    }
                }
            })
            .state('home.map.post', {
                url: '/post',
                views: {
                    'map-controls': {
                        templateUrl: "templates/post.html"
                    }
                }
            })
            .state('home.map.search', {
                url: '/search',
                views: {
                    'map-controls': {
                        templateUrl: "templates/search.html"
                    }
                }
            })
            .state('home.myposts', {
                url: '/myposts',
                views: {
                    'content': {
                        templateUrl: "templates/myposts.html"
                    }
                }
            });

        $urlRouterProvider.otherwise("/home/map/search");

        /*       $stateProvider
         .state('home',{
         url: '/',
         templateUrl: 'map.html'
         })
         .state('home.post', {
         url: '/post-space',
         views: {
         'post-space': {
         templateUrl: "post-space.html"
         }
         }
         })
         .state('home.edit', {
         url: '/edit',
         views: {
         'edit-space': {
         templateUrl: "post-space-edit.html"
         }
         }
         })*/

    })

    .constant('currencies', [{
        name: 'Usd',
        icon: 'fa-usd'
    },{
        name: 'Eur',
        icon: 'fa-eur'
    },{
        name: 'Ron',
        icon: null
    },{
        name: 'Rur',
        icon: 'fa-rub'
    },{
        name: 'Gbp',
        icon: 'fa-gbp'
    },{
        name: 'Yen',
        icon: 'fa-jpy'
    },{
        name: 'Inr',
        icon: 'fa-inr'
    }]);

