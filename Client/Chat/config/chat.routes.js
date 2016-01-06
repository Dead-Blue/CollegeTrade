angular.module('chat').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/chat', {
    templateUrl: 'chat/views/chat.view.html'
  });
}]);
