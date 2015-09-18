'use strict';

angular.module('chocofireApp')
  .controller('ChocolatesmodalCtrl', function ($scope, $modalInstance, bar, action) {

    $scope.noRating = false;
    $scope.bar = bar;
    $scope.action = action;
    $scope.bar = {
      id: bar.$id,
      maker: bar.maker,
      name: bar.name,
      rating: bar.rating,
      review: bar.review,
      active: bar.active
    };

    $scope.$watch('bar.rating', function() {
      if($scope.bar.rating > 0) {
        $scope.noRating = false;
      }
    });

    $scope.ok = function () {
      if($scope.bar.rating === undefined) {
        $scope.noRating = true;
        return;
      } else {
        $modalInstance.close($scope.bar);
      }
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('ChocolateDeletemodalCtrl', function ($scope, $modalInstance, bar) {
    $scope.bar = bar;

    $scope.ok = function () {
      $modalInstance.close($scope.bar);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
