angular.module('chocofireApp')
  .controller('AdminUsersCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, User, $modal, uiGridConstants) {

    $scope.user = User.getLocalUser();
    $scope.users = User.getUsers();
    $scope.userOptions = {
      data: 'users',
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      },
      rowHeight: 35,
      enableFiltering: true,
      columnDefs: [
        {
          field: 'profile.firstName',
          displayName: 'Name',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><a href="#/userProfile/{{row.entity.$id}}">{{grid.getCellValue(row, col)}}</a></div></div>'
        },
        {
          field: 'email',
          displayName: 'Email'
        },
        {
          field: 'role',
          displayName: 'Role',
          width: 100,
          cellClass: 'center-cell',
          filter:
          {
            type: uiGridConstants.filter.SELECT,
            selectOptions: [ {value: 1, label: 'User'}, {value: 75, label: 'Moderator'}, {value: 99, label: 'Admin'} ],
            disableCancelFilterButton: true
          },
          cellTemplate: '<div><div class="ui-grid-cell-contents"><span data-ng-if="grid.getCellValue(row, col) === 1">User</span><span data-ng-if="grid.getCellValue(row, col) === 75">Moderator</span><span data-ng-if="grid.getCellValue(row, col) === 99">Admin</span></div></div>'
        },
        {
          field: 'active',
          displayName: 'Is Active?',
          width: 100,
          filter:
          {
            type: uiGridConstants.filter.SELECT,
            selectOptions: [ {value: true, label: 'Yes'}, {value: false, label: 'No'} ],
            disableCancelFilterButton: true
          },
          cellClass: 'center-cell',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><span data-ng-if="grid.getCellValue(row, col) === &apos;true&apos;">Yes</span><span data-ng-if="grid.getCellValue(row, col) === &apos;false&apos;">No</span></div></div>'
        },
        {
          field: 'edit',
          displayName: '',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" data-ng-click="grid.appScope.editUser(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          width: 35,
          enableSorting: false,
          enableFiltering: false,
          enableColumnMenu: false,
        },
        {
          field: 'delete',
          displayName: '',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><button class="btn btn-xs btn-warning" data-ng-click="grid.appScope.disableUser(row.entity)"><i class="fa fa-trash"></i></button></div></div>',
          enableCellEdit: false,
          enableSorting: false,
          enableFiltering: false,
          enableColumnMenu: false,
          width: 35
        }
      ]
    };

    $scope.editUser = function (user) {
      var modalInstance = $modal.open({
        templateUrl: 'usersModal.html',
        controller: 'UsermodalCtrl',
        resolve: {
          user: function () {
            return user;
          }
        }
      });
      modalInstance.result.then(function (userId) {
        var user = $firebaseObject(Ref.child('users').child(userId.id));
        user.active = userId.active;
        user.email = userId.email;
        user.flagged = userId.flagged;
        user.profile = userId.profile;
        user.role = Number(userId.role);
        user.$save();
      });
    };

    $scope.disableUser = function (user) {
      var modalInstance = $modal.open({
        templateUrl: 'disableUserModal.html',
        controller: 'UserDisablemodalCtrl',
        resolve: {
          user: function () {
            return user
          }
        }
      });
      modalInstance.result.then(function (userId) {
        var user = $firebaseObject(Ref.child('users').child(userId.$id));
        user.active = "false";
        user.email = userId.email;
        user.flagged = userId.flagged;
        user.profile = userId.profile;
        user.role = userId.role;
        user.$save();
      });
    };

    function showError(err) {
      $scope.err = err;
    }
  });
