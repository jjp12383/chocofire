angular.module('chocofireApp')
  .directive('mainChocolateList', function ($window) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var w = angular.element($window);

        function calcHeight() {
          var windowH = window.innerHeight,
            windowW = window.innerWidth,
            containerHeight;
          if(windowW < 993) {
            containerHeight = windowH - 310;
          } else {
            containerHeight = windowH - 290;
          }
          element.css('height', containerHeight);
        }

        calcHeight();

        w.bind('resize', function() {
          calcHeight();
        });
      }
    }
  });
