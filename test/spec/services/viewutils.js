'use strict';

describe('Service: viewUtils', function () {

  // load the service's module
  beforeEach(module('chocofireApp'));

  // instantiate service
  var viewUtils;
  beforeEach(inject(function (_viewUtils_) {
    viewUtils = _viewUtils_;
  }));

  it('should do something', function () {
    expect(!!viewUtils).toBe(true);
  });

});
