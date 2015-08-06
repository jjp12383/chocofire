'use strict';

/**
 * @ngdoc function
 * @name chocofireApp.controller:AdministrationCtrl
 * @description
 * # AdministrationCtrl
 * Controller of the chocofireApp
 */
angular.module('chocofireApp')
  .controller('AdministrationCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, $modal, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.bars = $firebaseArray(Ref.child('chocolates'));
    $scope.users = $firebaseArray(Ref.child('users'));

    $scope.gridOptions = {
      data: 'bars',
      showGroupPanel: true,
      enableCellSelection: false,
      enableRowSelection: false,
      enableCellEdit: false,
      sortInfo: {
        fields: ['maker'],
        directions: ['asc']
      },
      columnDefs: [
        {
          field: 'maker',
          displayName: 'Maker',
          enableCellEdit: false
        },
        {
          field: 'name',
          displayName: 'Name',
          enableCellEdit: false,
          cellTemplate: '<div><div class="ngCellText"><a href="#/listing/{{row.entity.$id}}">{{row.getProperty(col.field)}}</a></div></div>'
        },
        {
          field: 'rating',
          displayName: 'Rating',
          enableCellEdit: false,
          width: 60
        },
        {
          field: 'review',
          displayName: 'Review',
          enableCellEdit: false
        },
        {
          field: 'edit',
          displayName: '',
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs" data-ng-click="editChocolate(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          enableCellEdit: false,
          groupable: false,
          sortable: false,
          width: 35
        },
        {
          field: 'delete',
          displayName: '',
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs" data-ng-click="removeChocolate(row)"><i class="fa fa-trash"></i></button></div></div>',
          enableCellEdit: false,
          groupable: false,
          sortable: false,
          width: 35
        }
      ]
    };

    $scope.userOptions = {
      data: 'users',
      showGroupPanel: true,
      enableCellSelection: false,
      enableRowSelection: false,
      enableCellEdit: false,
      sortInfo: {
        fields: ['name'],
        directions: ['asc']
      },
      columnDefs: [
        {
          field: 'name',
          displayName: 'Name',
          enableCellEdit: false,
          cellTemplate: '<div><div class="ngCellText"><a href="#/user/{{row.entity.$id}}">{{row.getProperty(col.field)}}</a></div></div>'
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
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs" data-ng-click="editUser(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          enableCellEdit: false,
          groupable: false,
          sortable: false,
          width: 35
        }
      ]
    };

    $scope.selectedChocolate = function (selection) {
      $location.path('/listing/' + selection.originalObject.$id);
    };

    $scope.tags = [
      {
        tagName: 'dark',
        category: 'type'
      },
      {
        tagName: 'milk',
        category: 'type'
      },
      {
        tagName: 'white',
        category: 'type'
      },
      {
        tagName: 'walnuts',
        category: 'nuts'
      },
      {
        tagName: 'cashews',
        category: 'nuts'
      },
      {
        tagName: 'almonds',
        category: 'nuts'
      },
      {
        tagName: 'macadamia',
        category: 'nuts'
      },
      {
        tagName: 'hazelnuts',
        category: 'nuts'
      },
      {
        tagName: 'pistachio',
        category: 'nuts'
      },
      {
        tagName: 'pumpkin seeds',
        category: 'seeds'
      },
      {
        tagName: 'chia seeds',
        category: 'seeds'
      },
      {
        tagName: 'orange',
        category: 'fruit'
      },
      {
        tagName: 'tangerine',
        category: 'fruit'
      },
      {
        tagName: 'passion fruit',
        category: 'fruit'
      },
      {
        tagName: 'raspberry',
        category: 'berries'
      },
      {
        tagName: 'blueberry',
        category: 'berries'
      },
      {
        tagName: 'strawberry',
        category: 'berries'
      },
      {
        tagName: 'blackberry',
        category: 'berries'
      },
      {
        tagName: 'black current',
        category: 'berries'
      },
      {
        tagName: 'acai',
        category: 'berries'
      },
      {
        tagName: 'cardamom',
        category: 'spices'
      },
      {
        tagName: 'chili powder',
        category: 'spices'
      },
      {
        tagName: 'peppercorn',
        category: 'spices'
      },
      {
        tagName: 'nutmeg',
        category: 'spices'
      },
      {
        tagName: 'cinnamon',
        category: 'spices'
      },
      {
        tagName: 'pink peppercorn',
        category: 'spices'
      },
      {
        tagName: 'toffee',
        category: 'candy'
      },
      {
        tagName: 'pop rocks',
        category: 'candy'
      },
      {
        tagName: 'bacon',
        category: 'exotics'
      }
    ];


    $scope.addChocolate = function () {
      var modalInstance = $modal.open({
        templateUrl: 'chocolatesModal.html',
        controller: 'ChocolatesmodalCtrl',
        resolve: {
          row: function () {
            return {
              _id: null
            };
          },
          action: function () {
            return 'Add';
          }
        }
      });
      modalInstance.result.then(function (bar, id) {
        $scope.bars.$add({
          comments: [{
            comment : "null",
            dateTime : "null",
            user : "null"
          }],
          maker: bar.maker,
          name: bar.name,
          rating: bar.rating,
          review: bar.review
        });
      });
    };

    $scope.editChocolate = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'chocolatesModal.html',
        controller: 'ChocolatesmodalCtrl',
        resolve: {
          row: function () {
            return row;
          },
          action: function () {
            return 'Edit';
          }
        }
      });
      modalInstance.result.then(function (bar) {
        var rowIndex = bar,
            id = rowIndex.id,
            bar = $scope.bars.$getRecord(id);
        bar.maker = rowIndex.maker;
        bar.name = rowIndex.name;
        bar.rating = rowIndex.rating;
        bar.review = rowIndex.review;
        $scope.bars.$save(bar).then(function() {
          return;
        });
      });
    };

    $scope.removeChocolate = function (row) {
      var rowIndex = row.entity;
      $scope.bars.$remove(rowIndex);
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
                emailOld: user.email,
                emailNew: null,
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

        ref.update({email: user.emailOld, name: user.name, role: user.role}, function(err) {
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
