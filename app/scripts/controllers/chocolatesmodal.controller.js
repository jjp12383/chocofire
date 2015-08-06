'use strict';

angular.module('chocofireApp')
    .controller('ChocolatesmodalCtrl', function ($scope, $modalInstance, row, action) {
        $scope.bar = row;
        $scope.action = action;
        $scope.bar = {
            id: row.$id,
            maker: row.maker,
            name: row.name,
            rating: row.rating,
            review: row.review
        };
        $scope.ok = function () {
            $modalInstance.close($scope.bar);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
