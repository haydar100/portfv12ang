'use strict';

// Declare app level module which depends on views, and components
angular.module('portfvangular', [
  'ngRoute',
  'portfvangular.view1',
  'portfvangular.view2',
  'portfvangular.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
