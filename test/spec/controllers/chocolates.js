'use strict';

describe('Controller: ChocolatesCtrl', function () {

  // load the controller's module
  beforeEach(module('chocofireApp'));

  var ChocolatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChocolatesCtrl = $controller('ChocolatesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
