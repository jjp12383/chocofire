angular.module('chocofireApp')
  .directive('mainContainer', function ($window) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var w = angular.element($window);

        function calcHeight() {
          var windowH = window.innerHeight,
              windowW = window.innerWidth,
              containerHeight;
          if(windowW < 768) {
            containerHeight = windowH - 100;
          } else {
            containerHeight = windowH - 120;
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
