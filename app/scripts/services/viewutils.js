'use strict';

/**
 * @ngdoc service
 * @name chocofireApp.viewUtils
 * @description
 * # viewUtils
 * Factory in the chocofireApp.
 */
angular.module('chocofireApp')
  .factory('viewUtils', function () {
    // Service logic
    // ...
    var checkForExistingReview = function (arrayToCheck, valueInArray, valueToCheck) {
      if(arrayToCheck) {
        var c;
        for(var i=0; i < arrayToCheck.length; i++) {
          if(arrayToCheck[i].user.id === valueToCheck) {
            c = {
              index: i,
              value: arrayToCheck[i]
            };
          } else {
            c = {
              index: null,
              value: null
            };
          }
        }
        return c;
      } else {
        return {
          index: null,
          value: null
        };
      }
    }
    return {
      checkForExistingReview: checkForExistingReview
    }
  });
