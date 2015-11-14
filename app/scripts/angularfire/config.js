angular.module('firebase.config', [])
  .constant('FBURL', 'https://glaring-fire-9263.firebaseio.com/')
  //.constant('FBURL', 'https://glaring-fire-9263.firebaseio.com/')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous','facebook','google','twitter','github'])

  .constant('loginRedirectPath', '/login');
