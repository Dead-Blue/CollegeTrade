angular.module('chat').controller('ChatController', ['$scope', 'Socket', function($scope, Socket) {
  $scope.messages = [];
  Socket.on('chatMessage', function(message) {
    $scope.messages.push(message);
  });
  $scope.sendMessage = function() {
    var message = {
      text: this.messageText,
    };

    Socket.emit('chatMessage', message);

    this.messageText = '';
    this.visible = !this.visible;
  }
  $scope.$on('$destory', function() {
    Socket.removeListener('chatMessage');
  })
}]);
angular.module('chat').filter('chatName',function(){
    return function(input,messageName,userName,fullName){
        var out = fullName;
        if(messageName==userName){
            out="我";
        }
        return out;
    }
});