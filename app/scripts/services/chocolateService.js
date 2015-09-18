angular.module('chocofireApp')
  .factory('Chocolate', function (Ref, $firebaseArray, $firebaseObject, User, $modal) {

    var chocolateFunctions = {};

    chocolateFunctions.getChocolates = function() {
      var chocolates = $firebaseArray(Ref.child('chocolates'));
      return chocolates;
    };

    chocolateFunctions.addChocolate = function() {
      var user = User.getLocalUser();
      var chocolates = chocolateFunctions.getChocolates();

      var modalInstance = $modal.open({
        templateUrl: 'chocolatesModal.html',
        controller: 'ChocolatesmodalCtrl',
        resolve: {
          bar: function () {
            return {
              _id: null
            };
          },
          action: function () {
            return 'Add';
          }
        }
      });
      modalInstance.result.then(function (bar, id) {
        chocolates.$add({
          maker: bar.maker,
          name: bar.name,
          rating: bar.rating,
          review: bar.review,
          active: "true"
        }).then(function(ref) {
          var id = ref.key(),
            userReviews = {},
            reviews = $firebaseObject(Ref.child('chocolates').child(id).child('userReviews'));
          userReviews = {
            maker: bar.maker,
            name: bar.name,
            content: bar.review,
            rating: bar.rating,
            dateTime: Firebase.ServerValue.TIMESTAMP,
            user: user.firstName,
            userId: user.id,
            barId: id
          };

          reviews[user.id] = userReviews;
          reviews.$save();
        });
      });
    };

    chocolateFunctions.editChocolate = function (bar) {
      var modalInstance = $modal.open({
        templateUrl: 'chocolatesModal.html',
        controller: 'ChocolatesmodalCtrl',
        resolve: {
          bar: function () {
            return bar;
          },
          action: function () {
            return 'Edit';
          }
        }
      });
      modalInstance.result.then(function (chocolate) {
        var bar = $firebaseObject(Ref.child('chocolates').child(chocolate.id));
        var reviews = $firebaseObject(Ref.child('chocolates').child(chocolate.id).child('userReviews'));
        bar.maker = chocolate.maker;
        bar.name = chocolate.name;
        bar.rating = chocolate.rating;
        bar.review = chocolate.review;
        bar.active = chocolate.active;
        bar.userReviews = reviews;
        bar.$save();
      });
    };

    chocolateFunctions.deleteChocolate = function (bar) {
      var modalInstance = $modal.open({
        templateUrl: 'chocolateDeleteModal.html',
        controller: 'ChocolateDeletemodalCtrl',
        resolve: {
          bar: function () {
            return bar;
          }
        }
      });
      modalInstance.result.then(function (chocolate) {
        var id = chocolate.$id;
        var chocolates = $firebaseObject(Ref.child('chocolates').child(id));
        chocolates.$remove();
      });
    }

    return chocolateFunctions;
  });
