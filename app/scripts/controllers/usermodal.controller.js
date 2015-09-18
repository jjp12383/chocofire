'use strict';

angular.module('chocofireApp')
  .controller('UsermodalCtrl', function ($scope, $modalInstance, user) {
    var userCopy = angular.copy(user);
    $scope.user = {
      id: userCopy.$id,
      role: userCopy.role.toString(),
      email: userCopy.email,
      active: userCopy.active,
      flagged: userCopy.flagged,
      profile: userCopy.profile
    };

    $scope.user.profile.firstName = user.profile.firstName;

    $scope.ok = function () {
      $modalInstance.close($scope.user);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('UserDisablemodalCtrl', function ($scope, $modalInstance, user) {
    $scope.user = user;
    $scope.ok = function () {
      $modalInstance.close($scope.user);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

