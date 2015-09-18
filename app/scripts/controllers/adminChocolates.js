angular.module('chocofireApp')
  .controller('AdminChocolatesCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, User, Chocolate, $timeout, $modal, $location, $localStorage, uiGridConstants) {

    $scope.chocolates = Chocolate.getChocolates();
    $scope.gridOptions = {
      data: 'chocolates',
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      },
      rowHeight: 35,
      enableFiltering: true,
      columnDefs: [
        {
          field: 'maker',
          displayName: 'Maker',
          type: 'string',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 0
          }
        },
        {
          field: 'name',
          displayName: 'Name',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><a href="#/listing/{{row.entity.$id}}">{{grid.getCellValue(row, col)}}</a></div></div>',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          }
        },
        {
          field: 'rating',
          displayName: 'Rating',
          width: 100,
          cellClass: 'center-cell'
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
          cellTemplate: '<div><div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" data-ng-click="grid.appScope.editChocolate(row.entity)"><i class="fa fa-edit"></i></button></div></div>',
          enableSorting: false,
          enableFiltering: false,
          enableColumnMenu: false,
          width: 35
        },
        {
          field: 'delete',
          displayName: '',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><button class="btn btn-xs btn-warning" data-ng-click="grid.appScope.removeChocolate(row.entity)"><i class="fa fa-trash"></i></button></div></div>',
          enableCellEdit: false,
          enableSorting: false,
          enableFiltering: false,
          enableColumnMenu: false,
          width: 35
        }
      ]
    };

    $scope.selectedChocolate = function (selection) {
      $location.path('/listing/' + selection.originalObject.$id);
    };

    $scope.addChocolate = function () {
      Chocolate.addChocolate();
      $scope.gridApi.grid.refresh()
    };

    $scope.editChocolate = function (row) {
      Chocolate.editChocolate(row);
      $scope.gridApi.grid.refresh()
    };

    $scope.removeChocolate = function (row) {
      Chocolate.deleteChocolate(row);
      $scope.gridApi.grid.refresh();
    };

  });
