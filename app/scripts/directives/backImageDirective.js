angular.module('chocofireApp')
  .directive('backImg', [function (Auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
          element.css({
            'background-image': 'url(' + value +')',
            'background-size' : 'contain'
          });
        });
      }
    }
  }]);
