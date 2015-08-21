angular.module('chocofireApp')
  .controller('AdminChocolatesCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, $modal, $location, $localStorage) {

    $scope.user = $localStorage.$default();

    $scope.gridOptions = {
      data: 'chocolates',
      showGroupPanel: true,
      enableCellSelection: false,
      enableRowSelection: false,
      enableCellEdit: false,
      rowHeight: 35,
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
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs btn-primary" data-ng-click="editChocolate(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          enableCellEdit: false,
          groupable: false,
          sortable: false,
          width: 35
        },
        {
          field: 'delete',
          displayName: '',
          cellTemplate: '<div><div class="ngCellText"><button class="btn btn-xs btn-warning" data-ng-click="removeChocolate(row)"><i class="fa fa-trash"></i></button></div></div>',
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
        $scope.chocolates.$add({
          maker: bar.maker,
          name: bar.name,
          rating: bar.rating,
          review: bar.review
        }).then(function(ref) {
          var id = ref.key(),
            userReviews = {},
            reviews = $firebaseObject(Ref.child('chocolates').child(id).child('userReviews'));
          userReviews = {
            maker: bar.maker,
            name: bar.name,
            content: bar.review,
            rating: bar.rating,
            dateTime: Firebase.ServerValue.TIMESTAMP,
            user: $scope.user.firstName,
            userId: $scope.user.id,
            barId: id
          };

          reviews[$scope.user.id] = userReviews;
          reviews.$save();
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
          bar = $scope.chocolates.$getRecord(id);
        bar.maker = rowIndex.maker;
        bar.name = rowIndex.name;
        bar.rating = rowIndex.rating;
        bar.review = rowIndex.review;
        bar.userReviews = bar.userReviews;
        $scope.chocolates.$save(bar).then(function() {
          return;
        });
      });
    };

    $scope.removeChocolate = function (row) {
      var rowIndex = row.entity;
      $scope.chocolates.$remove(rowIndex);
    };
  });
