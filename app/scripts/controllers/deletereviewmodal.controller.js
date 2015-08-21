'use strict';

angular.module('chocofireApp')
  .controller('DeleteReviewCtrl', function ($scope, $modalInstance, review) {
    $scope.review = review;

    $scope.ok = function () {
      $modalInstance.close($scope.review);
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
