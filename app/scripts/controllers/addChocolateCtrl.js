angular.module('chocofireApp')
  .controller('AddChocolateCtrl', function ($scope, pageContent, usSpinnerService, Auth, $window, Ref, $firebaseArray, $firebaseObject, User, Chocolate, $timeout, $rootScope, $state, Restangular, $location) {
    $scope.bar = {};

    var original = {};

    $scope.bar.rating = 0;

    $scope.user = User.getLocalUser();

    $scope.alerts = [];

    $scope.master = {};

    var scannedCode = $location.search();

    var resetForm = function () {
      $scope.bar = {};
      $scope.chocolateForm.$setPristine();
      $scope.chocolateForm.$setValidity();
      $scope.chocolateForm.$setUntouched();
      $timeout(function(){
        $scope.chocolateForm.$invalid = true;
      });
    };

    if(scannedCode.code) {
      var spin = function () {
        usSpinnerService.spin('spinner-1');
        $scope.spinneractive = true;
      };

      $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
      });

      $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
      });

      $timeout(function () {
        spin();
      });

      var getItem = Restangular.all("/");

      pageContent.get(function () {
        var item = getItem.get('searchItem', {UPC: scannedCode.code});
        return item;
      }).then(function (list) {
        $scope.bar.maker = list[0].ItemAttributes[0].Manufacturer[0];
        $scope.bar.name = list[0].ItemAttributes[0].Brand[0];
        $scope.bar.amazonImage = list[0].LargeImage[0].URL[0];
        $scope.bar.amazonLink = list[0].DetailPageURL[0];
        usSpinnerService.stop('spinner-1');
      });
    } else {
      $scope.showContent = true;
    }

    if($scope.user.role < 75) {
      $scope.role = 'user';
    } else {
      $scope.role = 'admin';
    }

    if($rootScope.isIos) {
      $scope.scanUrl = 'zxing://scan/?ret=http%3A%2F%2Fwww.chocoverse.com%2F%23%2FaddChocolate%3Fcode%3D%7BCODE%7D&SCAN_FORMATS=UPC_A,EAN_13'
    } else {
      $scope.scanUrl = 'http://zxing.appspot.com/scan?ret=http%3A%2F%2Fwww.chocoverse.com%2F%23%2FaddChocolate%3Fcode%3D%7BCODE%7D&SCAN_FORMATS=UPC_A,EAN_13'
    }

    $scope.addChocolate = function () {

      if($scope.bar.amazonLink === undefined || $scope.bar.amazonLink === null || $scope.bar.amazonLink === '') {
        $scope.bar.amazonLink = 'false';
        $scope.bar.hasALink = 'false';
      } else {
        $scope.bar.hasALink = 'true';
      }

      if($scope.bar.amazonImage === undefined || $scope.bar.amazonImage === null || $scope.bar.amazonImage === '') {
        $scope.bar.amazonImage = 'false';
      }

      Chocolate.addChocolate($scope.bar);
    };

    $scope.clearForm = function () {
      resetForm();
    };

    $scope.cancel = function () {
      if($scope.user.role < 74) {
        $state.go('home');
      } else {
        $state.go('administration.chocolates');
      }
    };

    $rootScope.$on('CHOCOLATE_ADDED', function () {
      resetForm();
      $scope.alerts.push({type: 'success', msg: 'Well done! You successfully added a chocolate.'});
      $timeout(function () {
        $scope.alerts = [];
      }, 2000);
    });
  });
