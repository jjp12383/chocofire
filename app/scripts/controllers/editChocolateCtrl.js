angular.module('chocofireApp')
  .controller('EditChocolateCtrl', function ($scope, pageContent, usSpinnerService, Auth, Ref, $firebaseArray, $firebaseObject, User, Chocolate, $timeout, $rootScope, $state, $stateParams, Restangular, $location) {

    var spin = function () {
      usSpinnerService.spin('spinner-1');
      $scope.spinneractive = true;
    };

    $timeout(function(){
      spin()
    });

    $rootScope.$on('us-spinner:spin', function(event, key) {
      $scope.spinneractive = true;
    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
      $scope.spinneractive = false;
    });

    var listingId = $stateParams.id;

    pageContent.get(function () {
      var bar = $firebaseObject(Ref.child('chocolates').child(listingId));
      return bar.$loaded();
    }).then(function (bar) {

      usSpinnerService.stop('spinner-1');

      var original = bar.active;

      var getItem = Restangular.all("/");

      $scope.bar = bar;

      $scope.user = User.getLocalUser();

      $scope.alerts = [];

      $scope.master = {};

      var scannedCode = $location.search();

      if(scannedCode.code) {
        getItem.get('searchItem', {UPC: scannedCode.code}).then(function (list) {
          $scope.bar.maker = list[0].ItemAttributes[0].Manufacturer[0];
          $scope.bar.name = list[0].ItemAttributes[0].Brand[0];
          $scope.bar.amazonImage = list[0].LargeImage[0].URL[0];
          $scope.bar.amazonLink = list[0].DetailPageURL[0];
        });
      }

      if($scope.user.role < 75) {
        $scope.role = 'user';
      } else {
        $scope.role = 'admin';
      };

      $scope.scanCode = function () {
        if($rootScope.isIos) {
          setTimeout(function () { window.location = 'https://itunes.apple.com/us/app/barcodes-scanner/id417257150?mt=8'; }, 25);
          window.location = 'zxing://scan/?ret=http%3A%2F%2Fwww.chocoverse.com%2F%23%2FeditChocolate%2F' + listingId + '%3Fcode%3D%7BCODE%7D&SCAN_FORMATS=UPC_A,EAN_13';
        } else {
          window.location = 'http://zxing.appspot.com/scan?ret=http%3A%2F%2Fwww.chocoverse.com%2F%23%2FeditChocolate%2F' + listingId + '%3Fcode%3D%7BCODE%7D&SCAN_FORMATS=UPC_A,EAN_13'
        }
      };

      $scope.editChocolate = function () {
        if($scope.bar.amazonLink === undefined || $scope.bar.amazonLink === null || $scope.bar.amazonLink === '') {
          $scope.bar.amazonLink = 'false';
          $scope.bar.hasALink = 'false';
        } else {
          $scope.bar.hasALink = 'true';
        }

        if($scope.bar.amazonImage === undefined || $scope.bar.amazonImage === null || $scope.bar.amazonImage === '') {
          $scope.bar.amazonImage = 'false';
        }

        Chocolate.editChocolate($scope.bar);
      };

      $scope.cancel = function () {
        if($scope.user.role < 74) {
          $state.go('home');
        } else {
          $state.go('administration.chocolates');
        }
      };

      $rootScope.$on('CHOCOLATE_EDITED', function () {

        if(original === 'false' && $scope.bar.active === 'true') {
          getItem.get('chocolateActivated', {bar: $scope.bar});
        }

        original = $scope.bar.active;

        $scope.alerts.push({type: 'success', msg: 'Well done! You successfully edited the chocolate.'});
        $timeout(function () {
          $scope.alerts = [];
        }, 2000);
      });
    });
  });
