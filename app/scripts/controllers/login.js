'use strict';
/**
 * @ngdoc function
 * @name chocofireApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('chocofireApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $rootScope, $firebaseObject, $localStorage) {

    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      var emailAsk = null;
      if(provider === 'github') {
        emailAsk = 'user:email';
      } else {
        emailAsk = 'email';
      }
      Auth.$authWithOAuthPopup(provider, {
        remember: "sessiononly",
        scope: emailAsk
      }).then(handleOAuth, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$authAnonymously({rememberMe: false}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({email: email, password: pass}, {rememberMe: false}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then(redirect, showError);
      }
    };

    function createProfile(user) {
      var ref = Ref.child('users').child(user.uid),
        def = $q.defer();
      if(user.name === undefined) {
        user.name = firstPartOfEmail(user.profile.email);
      }
      ref.set({email: user.profile.email, role: 1, profile: user.profile}, function(err) {
        $timeout(function() {
          if( err ) {
            def.reject(err);
          }
          else {
            def.resolve(ref);
          }
        });
      });
      return def.promise;
    }

    function handleOAuth(data) {
      var provider = data.auth.provider;
      var returnedUser = data;
      var user = Auth.$getAuth().uid;
      var userFire = $firebaseObject(Ref.child('users').child(user));
      if(userFire.email === undefined) {
        user = {
          role: 1,
          uid: returnedUser.uid,
          profile: returnedUser[provider].cachedUserProfile
        }
        createProfile(user);
        redirect();
      } else {
        redirect();
      }
    }

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }



    function redirect(data) {
      var user = Auth.$getAuth().uid;
      var userFire = $firebaseObject(Ref.child('users').child(user));
      userFire.$loaded().then(function (data) {
        var user = data;
        if(user.profile.first_name === undefined) {
          user.profile.first_name = user.profile.name.substr(0,str.indexOf(' '));
        }
        $scope.$user = $localStorage.$default({
          name: data.name,
          firstName: data.profile.first_name,
          email: data.email,
          role: data.role,
          id: data.$id
        });
        $rootScope.user = $scope.$user;
        if($scope.$user.role === 99) {
          $location.path('/administration');
        } else {
          $location.path('/home');
        }
      });
    }

    function showError(err) {
      $scope.err = err;
    }


  });
