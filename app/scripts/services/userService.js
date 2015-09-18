angular.module('chocofireApp')
  .factory('User', function (Ref, $firebaseArray, $firebaseObject, $localStorage) {

    var userFunctions = {};

    userFunctions.getUsers = function() {
      var users = $firebaseArray(Ref.child('users'));
      return users;
    };

    userFunctions.getFireUser = function(userId) {
      var fireUser = $firebaseObject(Ref.child('users').child(userId));
      fireUser.$loaded().then(function () {
        return fireUser;
      })
    };

    userFunctions.getLocalUser = function() {
      var localUser = $localStorage.$default();
      return localUser;
    }

    return userFunctions;

  });
