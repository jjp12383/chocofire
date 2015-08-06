angular.module('chocofireApp')
  .constant('ratingConfig', {
    max: 5,
    stateOn: null,
    stateOff: null
  })
  .controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function($scope, $attrs, ratingConfig) {
    var ngModelCtrl  = { $setViewValue: angular.noop };

    this.init = function(ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;

      ngModelCtrl.$formatters.push(function(value) {
        if (angular.isNumber(value) && value << 0 !== value) {
          value = value;
        }
        return value;
      });

      this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
      this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

      var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
        new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
      $scope.range = this.buildTemplateObjects(ratingStates);
    };

    this.buildTemplateObjects = function(states) {
      for (var i = 0, n = states.length; i < n; i++) {
        states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
      }
      return states;
    };

    $scope.rate = function(value) {
      if ( !$scope.readonly && value >= 0 && value <= $scope.range.length ) {
        ngModelCtrl.$setViewValue(value/2);
        ngModelCtrl.$render();
      }
    };

    $scope.enter = function(value) {
      if ( !$scope.readonly ) {
        $scope.value = value;
      }
      $scope.onHover({value: value});
    };

    $scope.reset = function() {
      $scope.value = ngModelCtrl.$viewValue * 2;
      $scope.onLeave();
    };

    $scope.onKeydown = function(evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        $scope.rate( $scope.value/2 + (evt.which === 38 || evt.which === 39 ? 1 : -1) );
      }
    };

    this.render = function() {
      $scope.value = ngModelCtrl.$viewValue * 2;
    };
  }])
  .directive('jpRating', function() {
  return {
    restrict: 'EA',
    require: ['jpRating', 'ngModel'],
    scope: {
      readonly: '=?',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: 'template/rating/rating.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      ratingCtrl.init( ngModelCtrl );
    }
  };
});

angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
    "    <span class=\"star-container\" ng-repeat=\"r in range track by $index\">\n" +
    "         <i ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"star\" ng-class=\"$index < value && (r.stateOn || 'choco-star') || (r.stateOff || 'choco-star-empty')\">\n" +
    "             <span class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
    "         </i>\n" +
    "    </span>\n" +
    "</span>");
}]);
