'use strict';

angular.module('chocofireApp')
  .controller('MainCtrl', function ($scope, $cookies, $rootScope, $route, $localStorage, $firebaseArray, Ref, $location, User, Chocolate, usSpinnerService, $timeout) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var spin = function () {
      usSpinnerService.spin('spinner-1');
      $scope.spinneractive = true;
    };

    $timeout(function(){
      spin()
    }, 100);

    var chocolates = Chocolate.getChocolates();
    chocolates.$loaded().then(function() {

      $scope.chocolates = chocolates;

      $scope.currentPage = 1;

      $scope.maxSize = 3;

      $scope.maxItems = 100;

      function calcChocolate(pageNum) {
        spin();
        var start = pageNum * $scope.maxItems,
            end = start + $scope.maxItems;
        $scope.chocoArray = chocolates.slice(start, end);
      }

      calcChocolate(0);

      $scope.pageChanged = function () {
        calcChocolate($scope.currentPage - 1);
      };

      $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
      });

      $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
      });

      $scope.itemsDisplayedInList = 50;

      $scope.predicate = 'maker';
      $scope.reverse = false;
      $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };

      $scope.route = $route;

      $rootScope.$watch('user', function () {
        $scope.user = User.getLocalUser();
      });

      $scope.user = User.getLocalUser();

      $scope.selectedChocolate = function (selection) {
        $location.path('/listing/' + selection.originalObject.$id);
      };

      $scope.$watch('[predicate, reverse]', function () {
        if ($scope.spinneractive) {
          usSpinnerService.stop('spinner-1');
          $scope.spinneractive = false;
        }
      });

      $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        if ($scope.spinneractive) {
          usSpinnerService.stop('spinner-1');
          $scope.spinneractive = false;
        }
      });

      $scope.addChocolate = function () {
        Chocolate.addChocolate();
      }
    });
  });
