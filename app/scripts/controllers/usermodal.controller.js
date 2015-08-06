'use strict';

angular.module('chocofireApp')
  .controller('UsermodalCtrl', function ($scope, $modalInstance, user, action, Auth) {
    $scope.user = user;
    $scope.err = null;
    if( !user.pass ) {
      $scope.err = 'Please enter a password';
    }
    else if( user.pass !== user.confirm ) {
      $scope.err = 'Passwords do not match';
    }
    $scope.action = action;
    $scope.user = {
      id: user.id,
      emailOld: user.emailOld,
      emailNew: user.emailNew,
      pass: user.pass,
      role: user.role,
      name: user.name
    };

    $scope.resetPassword = function () {
      Auth.$resetPassword({
        email: $scope.user.emailOld
      })
        .then(alert('Password Reset!'));
    };

    $scope.ok = function () {
      $modalInstance.close($scope.user);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

