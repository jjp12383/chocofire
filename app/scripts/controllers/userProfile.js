angular.module('chocofireApp')
  .controller('UserProfileCtrl', function ($scope, $cookies, $rootScope, $stateParams, $route, $modal, $localStorage, $firebaseObject, Ref, Auth, $location, $timeout) {

    var userId = $stateParams.id,
        user = $firebaseObject(Ref.child('users').child(userId));

    //Load data from DB
    user.$loaded().then(function () {
      $scope.user = user;
      //Retrieve current user

      $scope.currentUser = $localStorage.$default();
      if($scope.user.$id === $scope.currentUser.id) {
        $scope.isUser = true;
      } else {
        $scope.isUser = false;
      }
      var reviews = [];
      for(var i in $scope.chocolates) {
        if($scope.chocolates[i].active === 'true') {
          for(var r in $scope.chocolates[i].userReviews) {
            if($scope.chocolates[i].userReviews[r].userId === user.$id) {
              reviews.push($scope.chocolates[i].userReviews[r]);
            }
          }
        }
      }

      $scope.reviews = reviews;

      $scope.editPicName = false;

      $scope.editProfile = function (action) {
        if(action === 'edit') {
          $scope.originalFName = document.getElementById('firstName').value,
          $scope.originalLName = document.getElementById('lastName').value;
          $scope.editPicName = true;
        }
        if(action === 'save') {
          user.$save();
          $scope.editPicName = false;
          for(var i in $scope.chocolates) {
            if($scope.chocolates[i].userReviews) {
              for(var u in $scope.chocolates[i].userReviews) {
                if($scope.chocolates[i].userReviews[u].userId === user.$id) {
                  var chocolate = $firebaseObject(Ref.child('chocolates/' + $scope.chocolates[i].$id + '/userReviews/' + user.$id));
                  chocolate.flagged = $scope.chocolates[i].userReviews[u].flagged;
                  chocolate.barId = $scope.chocolates[i].userReviews[u].barId;
                  chocolate.user = $scope.user.profile.firstName;
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
        } else if (action === 'cancel') {
          $scope.user.profile.firstName = $scope.originalFName;
          $scope.user.profile.lastName = $scope.originalLName;
          $scope.editPicName = false;
        }
      };

      $scope.imageAdded = function (event, $flow, flowFile) {
        $timeout(function () {
          var imageHolder = document.getElementById('imageHolder').getAttribute('src'),
              profilePicture = document.getElementById('profilePicture'),
              originalImage = profilePicture.style.backgroundImage,
              originalImageLength = originalImage.length - 1,
              confirmPicture = angular.element(document.getElementById('saveEditPicName')),
              cancelPicture = angular.element(document.getElementById('cancelEditPicName'));
          profilePicture.style.backgroundImage = 'url(' + imageHolder + ')';

          originalImage = originalImage.slice(4, originalImageLength);

          cancelPicture.on('click', function () {
            profilePicture.style.backgroundImage = 'url(' + originalImage + ')';
            user.profile.picture = originalImage;
            $scope.editPicName = false;
          });

          confirmPicture.on('click', function () {
            user.profile.picture = imageHolder;
            $scope.currentUser.picture = imageHolder;
            user.$save();
            $scope.editPicName = false;
          });
        }, 100);

      };

      $scope.logout = function() {
        $location.path('/login');
        $localStorage.$reset();
        $rootScope.user = {};
        Auth.$unauth();
      };

      $scope.changePassword = function(oldPass, newPass, confirm) {
        $scope.err = null;
        if( !oldPass || !newPass ) {
          error('Please enter all fields');
        }
        else if( newPass !== confirm ) {
          error('Passwords do not match');
        }
        else {
          Auth.$changePassword({email: user.email, oldPassword: oldPass, newPassword: newPass})
            .then(function() {
              var oldpass = document.getElementById('oldPassword'),
                  newpass = document.getElementById('newPassword'),
                  confirm = document.getElementById('confirmPassword');
              oldpass.value = '';
              newpass.value = '';
              confirm.value = '';
              success('Password Changed!');
            }, error);
        }
      };

      $scope.emailBlurred = false;

      $scope.blurEmail = function () {
        $scope.emailBlurred = true;
      };

      $scope.focusEmail = function () {
        $scope.emailBlurred = false;
      };

      $scope.changeEmail = function(pass, newEmail) {
        $scope.err = null;
        Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: user.email})
          .then(function() {
            var pass = document.getElementById('password'),
                email = document.getElementById('newEmail');
            pass.value = '';
            email.value = '';
            user.email = newEmail;
            user.$save();
            success('Email changed!');
          })
          .catch(error);
      };

      function error(err) {
        alert(err, 'Error');
      }

      function success(msg) {
        alert(msg, 'Success');
      }

      function alert(msg, type) {
        $modal.open({
          animation: true,
          templateUrl: 'myProfileModal.html',
          controller: 'MyProfileModalCtrl',
          size: 'md',
          resolve: {
            message: function () {
              return {text: msg, type: type}
            }
          }
        });
      }
    });
  })
  .controller('MyProfileModalCtrl', function ($scope, message, $modalInstance) {
    var obj = {text: message.text+'', type: message.type};
    $scope.message = obj.text;
    $scope.type = message.type;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
