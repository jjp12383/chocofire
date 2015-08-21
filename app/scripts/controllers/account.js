'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('chocofireApp')
  .controller('AccountCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, $timeout, $rootScope, $localStorage) {
    $scope.user = user;
    $scope.logout = function() {
      $localStorage.$reset();
      $rootScope.user = {};
      Auth.$unauth();
    };
    $scope.chocolates = $firebaseArray(Ref.child('chocolates'));
    $scope.messages = [];
    var profile = $firebaseObject(Ref.child('users/'+user.uid));
    profile.$loaded().then(function () {
      $scope.profile = profile;

      $scope.changeName = function () {
        profile.$save();
        for(var i in $scope.chocolates) {
          if($scope.chocolates[i].userReviews) {
            for(var u in $scope.chocolates[i].userReviews) {
              if($scope.chocolates[i].userReviews[u].userId === user.uid) {
                var chocolate = $firebaseObject(Ref.child('chocolates/' + $scope.chocolates[i].$id + '/userReviews/' + user.uid));
                chocolate.flagged = $scope.chocolates[i].userReviews[u].flagged;
                chocolate.barId = $scope.chocolates[i].userReviews[u].barId;
                chocolate.user = $scope.profile.profile.firstName;
                chocolate.content = $scope.chocolates[i].userReviews[u].content;
                chocolate.dateTime = $scope.chocolates[i].userReviews[u].dateTime;
                chocolate.maker = $scope.chocolates[i].userReviews[u].maker;
                chocolate.name = $scope.chocolates[i].userReviews[u].name;
                chocolate.rating = $scope.chocolates[i].userReviews[u].rating;
                chocolate.userId = $scope.chocolates[i].userReviews[u].userId;
                chocolate.$save();
              }
            }
          }
        }
      }

      $scope.changePassword = function(oldPass, newPass, confirm) {
        $scope.err = null;
        if( !oldPass || !newPass ) {
          error('Please enter all fields');
        }
        else if( newPass !== confirm ) {
          error('Passwords do not match');
        }
        else {
          Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
            .then(function() {
              success('Password changed');
            }, error);
        }
      };

      $scope.changeEmail = function(pass, newEmail) {
        $scope.err = null;
        Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
          .then(function() {
            profile.email = newEmail;
            profile.$save();
            success('Email changed');
          })
          .catch(error);
      };

      function error(err) {
        alert(err, 'danger');
      }

      function success(msg) {
        alert(msg, 'success');
      }

      function alert(msg, type) {
        var obj = {text: msg+'', type: type};
        $scope.messages.unshift(obj);
        $timeout(function() {
          $scope.messages.splice($scope.messages.indexOf(obj), 1);
        }, 10000);
      }
    });
  });
