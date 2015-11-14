angular.module('chocofireApp')
  .factory('pageContent', ['$timeout', function ($timeout) {

    return {
      'showContent': function() {
        if (typeof this.pendingRequests === 'undefined') {
          throw "Invalid call to showContent.";
        }

        this.pendingRequests--;

        /*if (this.pendingRequests === 0) {*/
        $timeout(_.bind(function () {
          this.notifyObservers();
        }, this), 50);
        /*}*/
      },

      'get': function(contentFunction) {
        if (typeof this.pendingRequests === 'undefined') {
          this.pendingRequests = 0;
        }

        if (typeof contentFunction !== 'function') {
          throw "Invalid content function.";
        }

        this.pendingRequests++;

        var d = (contentFunction)();

        d['finally'](_.bind(this.showContent, this));

        return d;
      },

      'registerObserver': function(callback) {
        if (typeof this.callbacks === 'undefined') {
          this.callbacks = [];
        }

        this.callbacks.push(callback);
      },

      'notifyObservers': function() {
        angular.forEach(this.callbacks, function (callback) {
          callback();
        });
      }
    };
  }]);
