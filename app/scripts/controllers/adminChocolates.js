angular.module('chocofireApp')
  .controller('AdminChocolatesCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, User, Chocolate, $timeout, $modal, $location, $localStorage, uiGridConstants, $rootScope) {

    $scope.chocolates = Chocolate.getChocolates();

    $scope.gridOptions = {
      data: 'chocolates',
      onRegisterApi: function (gridApi) {
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
          cellClass: 'center-cell',
          filter: {
            condition: uiGridConstants.filter.EXACT
          }
        },
        {
          field: 'active',
          displayName: 'Is Active',
          width: 100,
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: [ {value: true, label: 'Yes'}, {value: false, label: 'No'} ],
            disableCancelFilterButton: true
          },
          cellClass: 'center-cell',
          cellTemplate: '<div><div class="ui-grid-cell-contents"><span data-ng-if="grid.getCellValue(row, col) === &apos;true&apos;">Yes</span><span data-ng-if="grid.getCellValue(row, col) === &apos;false&apos;">No</span></div></div>'
        },
        {
          field: 'hasALink',
          displayName: 'Has A-Link?',
          width: 120,
          filter: {
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
      Chocolate.addChocolate('admin');
    };

    $scope.editChocolate = function (row) {
      $location.path('/editChocolate/' + row.$id);
    };

    $scope.removeChocolate = function (row) {
      Chocolate.deleteChocolate(row);
    };

    $rootScope.$on('CHOCOLATE_LIST_UPDATED', function () {
      $timeout(function () {
        $scope.gridApi.grid.refresh();
      },50);
    })

  });
