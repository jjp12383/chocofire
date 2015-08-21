angular.module('chocofireApp')
  .controller('AdminTagsCtrl', function ($scope, user, $q, Auth, Ref, $firebaseArray, $firebaseObject, $timeout, $modal, $location, $localStorage) {

    $scope.tags = [
      {
        tagName: 'dark',
        category: 'type'
      },
      {
        tagName: 'milk',
        category: 'type'
      },
      {
        tagName: 'white',
        category: 'type'
      },
      {
        tagName: 'walnuts',
        category: 'nuts'
      },
      {
        tagName: 'cashews',
        category: 'nuts'
      },
      {
        tagName: 'almonds',
        category: 'nuts'
      },
      {
        tagName: 'macadamia',
        category: 'nuts'
      },
      {
        tagName: 'hazelnuts',
        category: 'nuts'
      },
      {
        tagName: 'pistachio',
        category: 'nuts'
      },
      {
        tagName: 'pumpkin seeds',
        category: 'seeds'
      },
      {
        tagName: 'chia seeds',
        category: 'seeds'
      },
      {
        tagName: 'orange',
        category: 'fruit'
      },
      {
        tagName: 'tangerine',
        category: 'fruit'
      },
      {
        tagName: 'passion fruit',
        category: 'fruit'
      },
      {
        tagName: 'raspberry',
        category: 'berries'
      },
      {
        tagName: 'blueberry',
        category: 'berries'
      },
      {
        tagName: 'strawberry',
        category: 'berries'
      },
      {
        tagName: 'blackberry',
        category: 'berries'
      },
      {
        tagName: 'black current',
        category: 'berries'
      },
      {
        tagName: 'acai',
        category: 'berries'
      },
      {
        tagName: 'cardamom',
        category: 'spices'
      },
      {
        tagName: 'chili powder',
        category: 'spices'
      },
      {
        tagName: 'peppercorn',
        category: 'spices'
      },
      {
        tagName: 'nutmeg',
        category: 'spices'
      },
      {
        tagName: 'cinnamon',
        category: 'spices'
      },
      {
        tagName: 'pink peppercorn',
        category: 'spices'
      },
      {
        tagName: 'toffee',
        category: 'candy'
      },
      {
        tagName: 'pop rocks',
        category: 'candy'
      },
      {
        tagName: 'bacon',
        category: 'exotics'
      }
    ];
  });
