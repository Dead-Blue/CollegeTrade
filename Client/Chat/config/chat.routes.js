angular.module('chat').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/chat', {
    templateUrl: 'Chat/views/chat.view.html'
  });
}]);
