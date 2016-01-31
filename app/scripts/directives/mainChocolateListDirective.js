angular.module('chocofireApp')
  .directive('mainChocolateList', function ($window, Auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var isLoggedIn = Auth.$getAuth();
        var w = angular.element($window);
        var messageHeight;

        if(isLoggedIn == null) {
          $timeout(function() {
            messageHeight = document.getElementById('loginMessage').getBoundingClientRect().height;
          });
        } else {
          messageHeight = 0;
        }

        function calcHeight() {
          var windowH = window.innerHeight,
              windowW = window.innerWidth,
              containerHeight;
          if(windowW < 993) {
            containerHeight = windowH - (310 + messageHeight);
          } else {
            containerHeight = windowH - (290 + messageHeight);
          }
          element.css('height', containerHeight);
        }

        $timeout(function() {
          calcHeight();
        })

        w.bind('resize', function() {
          calcHeight();
        });
      }
    }
  });
