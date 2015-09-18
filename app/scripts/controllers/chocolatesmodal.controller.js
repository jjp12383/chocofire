'use strict';

angular.module('chocofireApp')
  .controller('ChocolatesmodalCtrl', function ($scope, $modalInstance, bar, role, action) {

    $scope.noRating = false;
    $scope.bar = bar;
    $scope.action = action;
    $scope.bar = {
      id: bar.$id,
      maker: bar.maker,
      name: bar.name,
      rating: bar.rating,
      review: bar.review,
      active: bar.active,
      amazonLink: bar.amazonLink,
      amazonImage: bar.amazonImage
    };

    if($scope.bar.amazonImage !== null || $scope.bar.amazonImage !== undefined && $scope.bar.amazonLink !== null || $scope.bar.amazonLink !== undefined) {
      $scope.bar.hasALink = "true";
    } else {
      $scope.bar.hasAlink = "false";
    }

    if(role !== 'admin') {
      $scope.bar.amazonImage = "false";
      $scope.bar.amazonLink = "false";
      $scope.bar.hasALink = "false";
    }

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
