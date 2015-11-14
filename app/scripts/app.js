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
    'flow',
    'restangular'
  ])
  .controller('RunCtrl', function($scope, Ref, $firebaseArray, $firebaseObject, $timeout, $rootScope) {
    $timeout(function () {
      var navLink = angular.element(document.querySelectorAll('.nav a'));
      var navToggle = angular.element(document.querySelectorAll('.navbar-toggle'));
      var navCollapse = angular.element(document.querySelectorAll('.navbar-collapse'));
      navLink.on('click', function () {
        if(navCollapse.hasClass('in')) {
          navToggle.click();
        }
      });
    }, 50);

    $rootScope.previousState;
    $rootScope.currentState;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      //Quagga.stop();
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

    function iOS() {

      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];

      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){ return true; }
      }

      return false;
    }

    $rootScope.isIos = iOS();
  });
