angular.module('chocofireApp')
  .factory('Chocolate', function (Ref, $firebaseArray, $firebaseObject, User, $modal, $rootScope, Auth, $state) {

    var chocolateFunctions = {};

    chocolateFunctions.getChocolates = function() {
      var chocolates = $firebaseArray(Ref.child('chocolates'));
      return chocolates;
    };

    chocolateFunctions.addChocolate = function(bar) {
      var user = User.getLocalUser();
      var chocolates = chocolateFunctions.getChocolates();
      chocolates.$add({
        maker: bar.maker,
        name: bar.name,
        rating: bar.rating,
        review: bar.review,
        active: "true",
        amazonLink: bar.amazonLink,
        amazonImage: bar.amazonImage,
        hasALink: bar.hasALink
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
        $rootScope.$broadcast('CHOCOLATE_ADDED');
      });
    };

    chocolateFunctions.editChocolate = function (chocolate) {

      var bar = $firebaseObject(Ref.child('chocolates').child(chocolate.$id));
      bar.$loaded().then(function () {
        bar.maker = chocolate.maker;
        bar.name = chocolate.name;
        bar.rating = chocolate.rating;
        bar.review = chocolate.review;
        bar.active = chocolate.active;
        bar.amazonImage = chocolate.amazonImage;
        bar.amazonLink = chocolate.amazonLink;
        bar.userReviews = bar.userReviews;
        if(bar.amazonLink === 'false') {
          bar.hasALink = "false";
        } else {
          bar.hasALink = chocolate.hasALink;
        }
        bar.$save();
        $rootScope.$emit('CHOCOLATE_EDITED', true);
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
        $rootScope.$broadcast('CHOCOLATE_LIST_UPDATED', true);
      });
    };

    return chocolateFunctions;
  });
