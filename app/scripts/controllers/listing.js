'use strict';
/**
 * @ngdoc function
 * @name chocofireApp.controller:ListingCtrl
 * @description
 * # ListingCtrl
 * Controller of the chocofireApp
 */
angular.module('chocofireApp')
  .controller('ListingCtrl', function ($scope, Auth, Ref, $routeParams, $firebaseObject, $timeout, $modal, $localStorage, $location, viewUtils) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var listingId = $routeParams.id;
    var bar = $firebaseObject(Ref.child('chocolates').child(listingId));
    //Load data from DB
    bar.$loaded().then(function () {

      $scope.listing = bar;
      //Retrieve current user
      $scope.user = $localStorage.$default();
      $scope.editReview = null;

      var totalReviews = 0,
          reviews = $scope.listing.userReviews;
      for(var i in reviews) {
        if(reviews.hasOwnProperty(i)) {
          totalReviews += 1;
        }
      }

      //Check to see if current user has already left a review, and retrieve index of review and rating if so
      function checkArray() {
        if($scope.listing.userReviews[$scope.user.id]) {
          $scope.rating = $scope.listing.userReviews[$scope.user.id].rating;
          $scope.reviewText = $scope.listing.userReviews[$scope.user.id].content;
          $scope.reviewSubmitted = true;
        } else {
          $scope.rating = 0;
          $scope.reviewSubmitted = false;
        }
      }

      checkArray();

      //UI: User leaves or edits review
      $scope.leaveReview = function () {
        if($scope.reviewText) {
          var data = {
            content: $scope.reviewText,
            rating: $scope.rating,
            dateTime: Firebase.ServerValue.TIMESTAMP,
            user: $scope.user.firstName
          };

          $scope.listing.userReviews[$scope.user.id] = data;

          bar.$save();
        }
        //Refresh view by rerunning the checkArray function and updating scope
        $scope.reviewText = '';
        checkArray();
      }

      function calculateRatingBar(stars) {
        if($scope.listing.userReviews) {
          var starContainer = 0;
          for(var i in reviews) {
            if(reviews[i].rating === stars || reviews[i].rating === (stars + 0.5)) {
              starContainer += 1;
            }
          }
          var starPercentage = (starContainer / totalReviews) * 100;
          return {
            percent: starPercentage,
            number: starContainer
          }
        }
      }

      $scope.ratingPopover = {
        reviews: $scope.listing.userReviews,
        templateUrl: 'ratingPopover.html',
        title: 'Ratings: ' + totalReviews,
        ratingBar: {
          fiveStar: {
            stars: 5,
            bar: calculateRatingBar(5)
          },
          fourStar: {
            stars: 4,
            bar: calculateRatingBar(4)
          },
          threeStar: {
            stars: 3,
            bar: calculateRatingBar(3)
          },
          twoStar: {
            stars: 2,
            bar: calculateRatingBar(2)
          },
          oneStar: {
            stars: 1,
            bar: calculateRatingBar(1)
          }
        }
      }
    });
  });
