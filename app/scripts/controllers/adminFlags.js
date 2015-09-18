angular.module('chocofireApp')
  .controller('AdminFlagsCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, Chocolate, User, $timeout, $modal, $location, $localStorage) {

    var reviews = [];

    var chocolates = Chocolate.getChocolates();
    var users = User.getUsers();

    chocolates.$loaded().then(function () {

      $scope.chocolates = chocolates;
      $scope.users = users;

      function findFlags() {
        for(var i in $scope.chocolates) {
          for(var r in $scope.chocolates[i].userReviews) {
            if(!isEmpty($scope.chocolates[i].userReviews[r].flagged)) {
              var count = 0;
              for(var f in $scope.chocolates[i].userReviews[r].flagged) {
                count += 1;
              }
              $scope.chocolates[i].userReviews[r].count = count;
              reviews.push($scope.chocolates[i].userReviews[r]);
            }
          }
        }
      }

      function isEmpty(obj) {
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
            return false;
        }
        return true;
      }

      findFlags();

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

      $scope.clearFlagsReview = function (review) {

        for(var c in $scope.chocolates) {
          for (var r in $scope.chocolates[c].userReviews) {
            if($scope.chocolates[c].userReviews[r].flagged && $scope.chocolates[c].userReviews[r].userId === review.userId) {
              var flagged = $firebaseObject(Ref.child('chocolates').child(review.barId).child('userReviews').child(review.userId).child('flagged'));
              flagged.$remove();
              delete $scope.chocolates[c].userReviews[r].flagged;
              $scope.chocolates.$save();
              reviews = [];
              findFlags();
              $scope.reviews = reviews;
            }
          }
        }
      };

      $scope.clearFlagsUser = function (user) {

        for(var c in $scope.chocolates) {
          for(var r in $scope.chocolates[c].userReviews) {
            if($scope.chocolates[c].userReviews[r].flagged && $scope.chocolates[c].userReviews[r].userId === user) {
              var flagged = $firebaseObject(Ref.child('chocolates').child($scope.chocolates[c].$id).child('userReviews').child($scope.chocolates[c].userReviews[r].userId).child('flagged'));
              flagged.$remove();
              delete $scope.chocolates[c].userReviews[r].flagged;
              $scope.chocolates.$save();
              reviews = [];
              findFlags();
              $scope.reviews = reviews;
            }
          }
        }

        for(var u in $scope.users) {
          if($scope.users[u].$id === user) {
            var user = $firebaseObject(Ref.child('users').child(user));
            user.email = $scope.users[u].email;
            user.active = $scope.users[u].active;
            user.flagged = 0;
            user.profile = $scope.users[u].profile;
            user.role = $scope.users[u].role;
            user.$save();
            $scope.users[u].flagged = 0;
          }
        }
        $scope.users.$save();
        $scope.users[u].flagged = 0;
        $scope.users.$save();
      }
    });
  });
