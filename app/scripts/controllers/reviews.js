'use strict';

/**
 * @ngdoc function
 * @name chocofireApp.controller:ReviewsCtrl
 * @description
 * # ReviewsCtrl
 * Controller of the chocofireApp
 */
angular.module('chocofireApp')
  .controller('ReviewsCtrl', function ($scope, Auth, Ref, $routeParams, $firebaseObject, $timeout, $modal, $localStorage, viewUtils) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Retrieve specific listing using id in route
    var listingId = $routeParams.id;
    var bar = $firebaseObject(Ref.child('chocolates').child(listingId));

    //Load data from DB
    bar.$loaded().then(function () {
      $scope.listing = bar;

      //Retrieve current user
      $scope.user = $localStorage.$default();
      $scope.editReview = null;

      //Check to see if current user has already left a review, and retrieve index of review and rating if so
      function checkArray() {
        var checkedArray = viewUtils.checkArrayForValue($scope.listing.userReviews, 'user', $scope.user.email);
        $scope.editReview = checkedArray.index;
        if(checkedArray.value) {
          $scope.rating = checkedArray.value.rating;
        } else {
          $scope.rating = 0;
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
            user: $scope.user.email
          };

          //If there is already at least one user review for listing
          if($scope.listing.userReviews) {
            //If user already left a review, edit that review
            if($scope.editReview !== null) {
              $scope.listing.userReviews[$scope.editReview] = data;
              //otherwise add new review
            } else {
              $scope.listing.userReviews.push(data);
            }
            bar.$save();
            //otherwise create userReviews array and add the review
          } else {
            $scope.listing.userReviews = [data];
            bar.$save();
          }
        }
        //Refresh view by rerunning the checkArray function and updating scope
        $scope.reviewText = '';
        checkArray();
      }
    });
  });
