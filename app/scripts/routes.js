'use strict';

angular.module('chocofireApp')

  .config(['$stateProvider', 'SECURED_ROUTES', function($stateProvider, SECURED_ROUTES) {
    $stateProvider.stateAuthenticated = function(path, state) {
      state.resolve = state.resolve || {};
      state.resolve.user = ['Auth', function(Auth) {
        return Auth.$requireAuth();
      }];
      $stateProvider.state(path, state);
      SECURED_ROUTES[path] = true;
      return $stateProvider;
    };
  }])

  .config(['$stateProvider', '$urlRouterProvider','RestangularProvider', function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .stateAuthenticated('account', {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .stateAuthenticated('administration', {
        url: '/administration',
        templateUrl: 'views/administration.html'
      })
      .stateAuthenticated('administration.users', {
        url: '/users',
        templateUrl: 'views/partials/adminUsers.html',
        controller: 'AdminUsersCtrl'
      })
      .stateAuthenticated('administration.chocolates', {
        url: '/chocolates',
        templateUrl: 'views/partials/adminChocolates.html',
        controller: 'AdminChocolatesCtrl'
      })
      .stateAuthenticated('administration.tags', {
        url: '/tags',
        templateUrl: 'views/partials/adminTags.html',
        controller: 'AdminTagsCtrl'
      })
      .stateAuthenticated('administration.flags', {
        url: '/flags',
        templateUrl: 'views/partials/adminFlags.html',
        controller: 'AdminFlagsCtrl'
      })
      .state('listing', {
        url: '/listing/:id',
        templateUrl: 'views/listing.html',
        controller: 'ListingCtrl'
      })
      .state('reviews', {
        url: '/reviews/:id',
        templateUrl: 'views/reviews.html',
        controller: 'ReviewsCtrl'
      })
      .state('userProfile', {
        url: '/userProfile/:id',
        templateUrl: 'views/userProfile.html',
        controller: 'UserProfileCtrl'
      })
      .state('addChocolate', {
        url: '/addChocolate',
        templateUrl: 'views/addChocolate.html',
        controller: 'AddChocolateCtrl'
      })
      .state('editChocolate', {
        url: '/editChocolate/:id',
        templateUrl: 'views/editChocolate.html',
        controller: 'EditChocolateCtrl'
      })
      .state('scannedChocolate', {
        url: '/addChocolate/:id',
        templateUrl: 'views/scannedChocolate.html',
        controller: 'ScannedChocolateCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      });


    RestangularProvider.setBaseUrl('http://ec2-52-8-197-62.us-west-1.compute.amazonaws.com');
  }])

  .run(['$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath','$state',
    function($rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath, $state) {
      // watch for login status changes and redirect if appropriate
      Auth.$onAuth(check);

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
        if( err === 'AUTH_REQUIRED' ) {
          $location.path('/login');
        }
      });

      function check(user) {
        if( !user && authRequired($state.current.name) ) {
          $location.path('/login');
        }
      }

      function authRequired(path) {
        return SECURED_ROUTES.hasOwnProperty(path);
      }
    }
  ])

  // used by route security
  .constant('SECURED_ROUTES', {

  });
