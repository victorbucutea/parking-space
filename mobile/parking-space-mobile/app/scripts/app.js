'use strict';

angular.module('ParkingSpaceMobile', ['ionic', 'config', 'ParkingSpaceMobile.controllers', 'ParkingSpaceMobile.directives'])

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
                templateUrl: 'home.html'
            })
            .state('home.map', {
                url: '/map',
                views: {
                    'content': {
                        templateUrl: "map.html"
                    }
                }
            })
            .state('home.edit', {
                url: '/edit',
                views: {
                    'content': {
                        templateUrl: "edit-space.html"
                    }
                }
            })
            /*.state('home.test', {
                url: '/test',
                views: {
                    'test': {
                        templateUrl: "test-animation.html"
                    },
                    'content': {
                        templateUrl: ""
                    }
                }
            });*/

        $urlRouterProvider.otherwise("/home/map");

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

    });

