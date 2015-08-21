angular.module('chocofireApp')
  .directive('expandButton', ['Auth', '$timeout', function (Auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('mouseover', function () {
          element.addClass('hovered');
        })
      }
    }
  }]);
