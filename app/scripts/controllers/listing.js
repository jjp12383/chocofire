'use strict';
/**
 * @ngdoc function
 * @name chocofireApp.controller:ListingCtrl
 * @description
 * # ListingCtrl
 * Controller of the chocofireApp
 */
angular.module('chocofireApp')
  .controller('ListingCtrl', function ($scope, pageContent, Auth, Ref, $stateParams, $firebaseObject, $firebaseArray, $timeout, $modal, $localStorage, $state, $rootScope, usSpinnerService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var spin = function () {
      usSpinnerService.spin('spinner-1');
      $scope.spinneractive = true;
    };

    $timeout(function(){
      spin()
    });

    $rootScope.$on('us-spinner:spin', function(event, key) {
      $scope.spinneractive = true;
    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
      $scope.spinneractive = false;
    });

    $scope.authObject = Auth.$getAuth();
    var listingId = $stateParams.id;

    pageContent.get(function () {
      var bar = $firebaseObject(Ref.child('chocolates').child(listingId));
      return bar.$loaded();
    }).then(function (bar) {

      usSpinnerService.stop('spinner-1');

      var totalReviews = 0,
        reviews

      $scope.listing = bar;
      //Retrieve current user
      $scope.user = $localStorage.$default();
      $scope.editReview = null;

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

      var searchString = $scope.listing.maker + ' ' + $scope.listing.name;
      $scope.searchUrl = 'https://www.google.com/search?q=';
      searchString = searchString.split(' ').join('+');
      $scope.searchUrl += searchString + '&tbm=shop';

      function round(number) {
        var value = (number * 2).toFixed() / 2;
        return value;
      }

      //UI: User leaves or edits review
      $scope.leaveReview = function () {

        if($scope.authObject !== null) {
          if($scope.reviewText) {
            var data = {
              barId: listingId,
              maker: $scope.listing.maker,
              name: $scope.listing.name,
              flagged: 0,
              content: $scope.reviewText,
              rating: $scope.rating,
              dateTime: Firebase.ServerValue.TIMESTAMP,
              user: $scope.user.firstName,
              userId: $scope.user.id
            };

            $scope.listing.userReviews[$scope.user.id] = data;
            bar.$save().then(function () {
              var counter = 0,
                rating = 0;
              for(var i in bar.userReviews) {
                rating += Number(bar.userReviews[i].rating);
                counter += 1;
              }
              bar.rating = round(rating / counter);
              bar.$save().then(function () {
                buildRatingPopover();
              });
            });
          }
          //Refresh view by rerunning the checkArray function and updating scope
          $scope.reviewText = '';
          checkArray();
        } else {
          $rootScope.pleaseLogIn = true;
          $state.go('login');
        }
      }

      $scope.reportReview = function (review) {

        var user = $firebaseObject(Ref.child('users').child(review.userId));
        user.$loaded().then(function () {

          if(!review.flagged) {
            review.flagged = {};
            review.flagged[$scope.user.id] = true;
          } else {
            review.flagged[$scope.user.id] = true;
          }

          user.flagged = user.flagged + 1;
          user.$save();

          for(var i in $scope.listing.userReviews) {
            if($scope.listing.userReviews[i].userFlagged) {
              delete $scope.listing.userReviews[i].userFlagged;
            }
          }

          $scope.listing.$save().then(function () {
            $timeout(function () {
              $scope.userReviewed();
            }, 100);
          });
        });
      };

      $scope.deleteReview = function (review) {
        var modalInstance = $modal.open({
          templateUrl: 'deleteReviewModal.html',
          controller: 'DeleteReviewCtrl',
          resolve: {
            review: function () {
              return review;
            }
          }
        });
        modalInstance.result.then(function (review) {
          $scope.listing.userReviews[review.userId] = null;
          bar.$save().then(function () {
            var counter = 0,
              rating = 0;
            for(var i in bar.userReviews) {
              if(bar.userReviews[i]) {
                rating += Number(bar.userReviews[i].rating);
                counter += 1;
              }
            }
            bar.rating = round(rating / counter);
            bar.$save().then(function () {
              checkArray();
              buildRatingPopover();
              if($scope.listing.userReviews[review.userId] === $scope.user.id) {
                $scope.reviewText = '';
                $scope.rating = 0;
                $scope.$apply();
              }
            });
          });

        });
      };

      $scope.userReviewed = function () {
        for(var i in $scope.listing.userReviews) {
          if($scope.listing.userReviews[i].flagged) {
            if($scope.listing.userReviews[i].flagged.hasOwnProperty($scope.user.id)) {
              $scope.listing.userReviews[i].userFlagged = true;
            }
          }
        }
      };

      function calculateRatingBar(stars) {

        if($scope.listing.userReviews) {
          var starContainer = 0;
          for(var i in $scope.listing.userReviews) {
            if($scope.listing.userReviews[i] !== null) {
              if($scope.listing.userReviews[i].rating === stars || $scope.listing.userReviews[i].rating === (stars + 0.5)) {
                starContainer += 1;
              }
            }
          }
          var starPercentage = (starContainer / totalReviews) * 100;
          return {
            percent: starPercentage,
            number: starContainer
          }
        }
      }

      function buildRatingPopover() {

        totalReviews = 0;
        reviews = $scope.listing.userReviews;

        for(var i in reviews) {
          if(reviews.hasOwnProperty(i)) {
            totalReviews += 1;
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
      }

      buildRatingPopover();
    });
  });
