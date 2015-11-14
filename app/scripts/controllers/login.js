'use strict';
/**
 * @ngdoc function
 * @name chocofireApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('chocofireApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $rootScope, $firebaseObject, $localStorage, $modal) {

    $scope.alerts = [];

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

    $scope.resetPassword = function () {
      var modalInstance = $modal.open({
        templateUrl: 'resetPasswordModal.html',
        controller: 'ResetPassmodalCtrl'
      });
      modalInstance.result.then(function (email) {
        Auth.$resetPassword({
          email: email
        }).then(function() {
          $scope.alerts.push({type: 'success', msg: 'Success! An email has been sent to your address with a temporary password. Make sure to log in and reset your password as soon as possible.'});
          $timeout(function () {
            $scope.alerts = [];
          }, 7000);
        });
      });
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
          def = $q.defer(),
          fireProfile = {};
      if(user.profile) {
        fireProfile = {
          provider: user.provider,
          email: user.profile.email,
          firstName: user.profile.first_name ? user.profile.first_name : user.profile.given_name,
          lastName: user.profile.last_name ? user.profile.last_name : user.profile.family_name,
          name: user.profile.name,
          id: user.profile.id,
          locale: user.profile.locale,
          picture: user.profile.picture.data ? user.profile.picture.data.url : user.profile.picture
        }
      } else {
        fireProfile = {
          provider: "email",
          email: user.password.email,
          firstName: user.name ? user.name : firstPartOfEmail(user.password.email),
          picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExOERDMUYwMzM2NEQ2QzU5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDODExNTc5NkZENUExMUUyQTk1N0VCRDNEMjQ3QTUzNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDODExNTc5NUZENUExMUUyQTk1N0VCRDNEMjQ3QTUzNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY3N0YxMTc0MDcyMDY4MTE4REMxRjAzMzY0RDZDNTk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY3N0YxMTc0MDcyMDY4MTE4REMxRjAzMzY0RDZDNTk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+u6/r+AAAADNQTFRF5uXl7u7u/fz84eHh9/b24+Pj6unp8vLy9PT0+/r6+fj46Ofn8PDw7Ovr39/f//7+3d3d6L54UwAABOJJREFUeNrs3dty4yAMAFDu4Bvk/792m05ntkljDEhEsoMe+ta0pzZYYIkKHS8RWsTbJSIOyIAMyIAMyIAMyBsgVvzEeSF28yb9DuM3ezZIdF6lV6GCi+eBCJ9yEdw5IG5KRzHJyB5SwPi+xbApyBBRxvimOL6QGFJNGM0UsqhUF2pjCfGpPkJkB4lzaonZMoPYKbWFsqwgVqXWQJq9cCAAx1c4NhCYIyXLBBKBDpRxggBpnK8ecq/IAeITPAwDyJIwQpJDtEKBgAc8GGJwHGkmhiwJKyQtZEKDqEgJkQkvPCEkKkRI0nQQzAsCvCQwyIQKSZEKsuA60kYFCciQiQgSE3ZYGohDh6w0kIAOmWggCT80BUR0gDgKiOwA8RSQ0AEyU0DmDpBEAenhaB/t7RDdBSLeDxFdIO4qEPl+iLsKRA7IgPSBbFeBiAHpsmxvh9irPNlvl4FMPSAU2a/p4JgoID0eJIECsnCatCCQ2AFiKSAd1rqKZl8Lf5B4Ggj+I3Eh2o2f+dxZMAh2ArxSQXBfIcJeIsJevXlUB6ggBQbRPBJGOAT1ksAqhIAQrZhcEHAJh+TwMMSARKxVCbAUBV7mhLV0h1aXwyvoVuKFCBoEJVFRkQEEY+aC18ti1P3Cs2CEWmyUSmzoGwZ5YwIBSvyNDQQkQXGg9Y840vsKEXITimyc40JutuV5otCadxGbxWJ9Tm/wWu7aIFpIab7CPy5OK/v3nrr34nr/SCkX+x5IdOHX7/vYqRprEq/w+FeQ/z9VhU33hrjnmqDpcT2kS/fojciPsNn1hLzsKF4fP0GEesbL9VldX3INZK+j+Omi3PSaHyvK27IJr6azrxyS6yj2zx+y+D3L3yMGYma5XN6XXAzJt36++NvZLTx/izJSFF/nn29ZkCGHKYh5OWmKRX7Fev+yvPxJOiClMIWQklTK1+94RomWVJZBCjd9Ko8/iFLhpcdFkOLUVq0anVEoKYFUpei+bMNQ+5p0ZkOB1LYUz4f5RXS1mbJAgLS04uZyJe0aKp+Pt4uOIY0bcJN3fydkvayNu2AGDAFtiZpwf37c4+t5EkA1HxsU0qV0psNe5BFEJi7hQRDs1539XpUeQPhckKPxnofExClEO0SygvhmCKcRcjRKshDHy5Et8chCZmYQ1QixiVu4NsjKDhLaIIodJNPxnoEs/ByZeysDWRlCQgtkYgjZv7f2IZajY798cx+ysYSs9ZDAEjLVQxRLyG6+tQvhOUT2B8kuZGMKWWshninE1EJmppBUC+Hq2Cvt2oMItpClDuLYQmQdRLKFhDqIYQuZ6yBsJ629aWsPwtexk6TsQCJjiKiBCMYQdxWIrIHIAaFKG3cg/ioQMyBUT8SrQ9KADAhwjXhGiBiQASGHiAEZkD4QPQb7gHwi5CPT+MDYYa6y+eA/coPuMnu/jAfJdJU3VmsdJKpz3Vkf8J6da94oqotq/KkuSAbCc5TYhlLA7TxT1kG5LL9nydxW9xvZlZTrxtp4y2uYZI/syPePsJLkjx45aE3S80kch11vkcuIN8D2vYZ/Vt7lchy25xc0HUf6IvmCnv+ifvajYzXoGcVHJURHNVb+HNoBPLzivo6X5r0NDJORS/FvV3vkjhbvisqjkBCPpaKNARmQARmQARmQARmQARmQT4LoeInQ/wQYAGRUWWzU7PuzAAAAAElFTkSuQmCC'
        }
      }

      ref.set({
        email: user.profile ? user.profile.email : user.password.email,
        role: 1,
        flagged: 0,
        profile: fireProfile
      }, function(err) {
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
      var provider = data.auth.provider,
          returnedUser = data,
          user = Auth.$getAuth().uid,
          userFire = $firebaseObject(Ref.child('users').child(user));
      userFire.$loaded().then(function () {
        if(userFire.email === undefined) {
          user = {
            role: 1,
            uid: returnedUser.uid,
            provider: provider,
            profile: returnedUser[provider].cachedUserProfile
          }
          createProfile(user);
          redirect();
        } else {
          redirect();
        }
      });
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
        if(user.profile.firstName === undefined) {
          user.profile.firstName = user.profile.name.substr(0,str.indexOf(' '));
        }
        $scope.$user = $localStorage.$default({
          name: data.name,
          firstName: data.profile.firstName,
          email: data.email,
          role: data.role,
          id: data.$id,
          picture: data.profile.picture
        });
        $rootScope.user = $scope.$user;
        if($scope.$user.role === 99) {
          $location.path('/administration/chocolates');
        } else {
          $location.path('/home');
        }
      });
    }

    function showError(err) {
      $scope.err = err;
    }

    if($rootScope.pleaseLogIn !== undefined) {
      var modalInstance = $modal.open({
        templateUrl: 'pleaseLogInModal.html',
        controller: 'LoginmodalCtrl'
      });
      modalInstance.result.then(function () {
        $rootScope.pleaseLogIn = null;
      });
    }
  })
  .controller('LoginmodalCtrl', function ($scope, $modalInstance) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('ResetPassmodalCtrl', function ($scope, $modalInstance) {
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
      $modalInstance.close($scope.email);
    }
  });
