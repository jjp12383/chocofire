angular.module('chocofireApp')
  .controller('AdminUsersCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, $modal, $location, $localStorage) {

    $scope.user = $localStorage.$default();

    $scope.userOptions = {
      data: 'users',
      showGroupPanel: true,
      enableCellSelection: false,
      enableRowSelection: false,
      enableCellEdit: false,
      rowHeight: 35,
      sortInfo: {
        fields: ['name'],
        directions: ['asc']
      },
      columnDefs: [
        {
          field: 'name',
          displayName: 'Name',
          enableCellEdit: false,
          cellTemplate: '<div><div class="ngCellText"><a href="#/userProfile/{{row.entity.$id}}">{{row.getProperty(col.field)}}</a></div></div>'
        },
        {
          field: 'email',
          displayName: 'Email',
          enableCellEdit: false
        },
        {
          field: 'role',
          displayName: 'Role',
          enableCellEdit: false,
          width: 100
        },
        {
          field: 'edit',
          displayName: '',
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs btn-primary" data-ng-click="editUser(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          enableCellEdit: false,
          groupable: false,
          sortable: false,
          width: 35
        }
      ]
    };

    $scope.createAccount = function() {
      var enteredUser = {
          role: null,
          emailOld: null,
          emailNew: null,
          name: null,
          pass: null
        },
        modalInstance = $modal.open({
          templateUrl: 'usersModal.html',
          controller: 'UsermodalCtrl',
          resolve: {
            user: function () {
              return {
                emailOld: null,
                emailNew: null,
                pass: null,
                confirm: null,
                role: null,
                name: null
              };
            },
            action: function () {
              return 'Add';
            }
          }
        });

      modalInstance.result.then(function (user) {
        enteredUser = {
          role: user.role,
          name: user.name,
          email: user.emailOld,
          pass: user.pass
        };
        Auth.$createUser({email: enteredUser.email, password: enteredUser.pass})
          .then(createProfile);
      });

      function createProfile(user) {
        var ref = Ref.child('users').child(user.uid),
          def = $q.defer();

        ref.set({email: enteredUser.email, name: enteredUser.name, role: enteredUser.role}, function(err) {
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
    };

    $scope.editUser = function (user) {
      var modalInstance = $modal.open({
        templateUrl: 'usersModal.html',
        controller: 'UsermodalCtrl',
        resolve: {
          user: function () {
            return {
              id: user.$id,
              role: user.role,
              name: user.name
            };
          },
          action: function () {
            return 'Edit';
          }
        }
      });
      modalInstance.result.then(function (user) {
        createProfile(user);
      });

      function createProfile(user) {
        var ref = Ref.child('users').child(user.id),
          def = $q.defer();

        ref.update({name: user.name, role: user.role}, function(err) {
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
    }

    function showError(err) {
      $scope.err = err;
    }
  });
