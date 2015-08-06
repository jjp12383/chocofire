'use strict';

angular.module('chocofireApp')
  .controller('ReviewmodalCtrl', function ($scope, $modalInstance, review) {
    $scope.review = review;
    $scope.review = {
      reviewText: review.reviewText,
      rating: review.rating
    }
    $scope.ok = function () {
      $modalInstance.close($scope.review);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
