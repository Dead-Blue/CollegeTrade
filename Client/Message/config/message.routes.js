angular.module('message').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/message', {
    templateUrl: 'Message/views/message.view.html'
  });
}]);
