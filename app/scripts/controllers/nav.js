angular.module('chocofireApp')
  .controller('NavCtrl', function ($scope, Auth, Ref, $firebaseObject, $firebaseArray, $timeout, $rootScope, $localStorage) {
    $scope.user = $localStorage.$default();
  });
