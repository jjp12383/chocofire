angular.module('chocofireApp')
  .controller('UserProfileCtrl', function ($scope, $cookies, $rootScope, $stateParams, $route, $localStorage, $firebaseObject, Ref, $location) {

    var userId = $stateParams.id,
        user = $firebaseObject(Ref.child('users').child(userId));

    //Load data from DB
    user.$loaded().then(function () {
      $scope.user = user;
      //Retrieve current user
      $scope.currentUser = $localStorage.$default();
      var reviews = [];
      for(var i in $scope.chocolates) {
        for(var r in $scope.chocolates[i].userReviews) {
          if($scope.chocolates[i].userReviews[r].userId === user.$id) {
            reviews.push($scope.chocolates[i].userReviews[r]);
          }
        }
      }
      $scope.reviews = reviews;
    });
  })
