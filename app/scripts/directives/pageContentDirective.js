angular.module('chocofireApp')
  .directive('pageContent', ['pageContent', function (pageContent) {
    return {
      restrict: 'C',

      link: function (scope, element) {
        element.addClass('hide');
        pageContent.registerObserver(function () {
          element.removeClass('hide');
          element.addClass('show');
        });
      }
    };
  }]);
