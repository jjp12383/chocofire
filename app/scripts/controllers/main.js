'use strict';

/**
 * @ngdoc function
 * @name chocofireApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chocofireApp
 */
angular.module('chocofireApp')
  .controller('MainCtrl', function ($scope, $cookies, $rootScope, $route, $localStorage, $firebaseArray, Ref, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.route = $route;

    $rootScope.$watch('user', function () {
      $scope.user = $localStorage.$default();
    });
    $scope.user = $localStorage.$default();

    $scope.bars = $firebaseArray(Ref.child('chocolates'));

    $scope.selectedChocolate = function (selection) {
      $location.path('/listing/' + selection.originalObject.$id);
    };
  });
