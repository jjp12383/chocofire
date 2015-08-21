angular.module('chocofireApp')
  .controller('AdminFlagsCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, $modal, $location, $localStorage) {

    var reviews = [];

    $scope.chocolates.$loaded().then(function () {

      for(var i in $scope.chocolates) {
        for(var r in $scope.chocolates[i].userReviews) {
          if($scope.chocolates[i].userReviews[r].flagged) {
            reviews.push($scope.chocolates[i].userReviews[r]);
          }
        }
      }

      $scope.greaterThan = function(prop, val) {
        return function(item){
          return item[prop] > val;
        }
      }

      $scope.noFlaggedUsers = function () {
        var count = true;
        for(var i in $scope.users) {
          if($scope.users.hasOwnProperty(i)) {
            if($scope.users[i].flagged > 0) {
              count = false;
            }
          }
        }
        return count;
      }

      $scope.reviews = reviews;
    });

  });
