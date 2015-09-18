'use strict';

/**
 * @ngdoc overview
 * @name chocofireApp
 * @description
 * # chocofireApp
 *
 * Main module of the application.
 */
angular.module('chocofireApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'firebase.auth',
    'ui.bootstrap',
    'ui.grid',
    'ui.utils',
    'ui.select',
    'ui.router',
    'ngStorage',
    'angucomplete-alt',
    'angularSpinner',
    'ui.scroll',
    'ui.scroll.jqlite',
    'flow'
  ])
  .controller('RunCtrl', function($scope, Ref, $firebaseArray, $firebaseObject) {
    $scope.chocolates = $firebaseArray(Ref.child('chocolates'));
    $scope.users = $firebaseArray(Ref.child('users'));
  });
