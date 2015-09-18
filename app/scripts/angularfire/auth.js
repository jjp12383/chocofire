(function() {
  'use strict';
  angular.module('firebase.auth', ['firebase', 'firebase.ref'])

    .factory('Auth', function($firebaseAuth, Ref, $location) {
      return $firebaseAuth(Ref);
    });
})();
