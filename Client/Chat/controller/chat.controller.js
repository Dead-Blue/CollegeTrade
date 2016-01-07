angular.module('chat').controller('ChatController', ['$scope', 'Socket', '$http', function ($scope, Socket, $http) {
    $scope.messages = [];

    //     $http({
    //     url: '/api/chat/roomMember',
    //     method: 'GET'
    // }).success(function (data, header, config, status) {
    //     $scope.onlineMember=data.onlineMember;

    // }).error(function (data, header, config, status) {
    //    $scope.onlineMember=-1;
    // });
        
    Socket.on('chatMessage', function (message) {
        $scope.messages.push(message);
    });
    Socket.on('newMember', function (message) {
        $scope.onlineMember= message.clientlist.length;
        $scope.messages.push(message);
    });
    Socket.on('leaveMember', function (message) {
        $scope.onlineMember= message.clientlist.length;
        $scope.messages.push(message);
    });
    $scope.sendMessage = function () {
        var message = {
            text: this.messageText,
        };

        Socket.emit('chatMessage', message);

        this.messageText = '';
        this.visible = !this.visible;
    }
    $scope.$on('$destory', function () {
        Socket.removeListener('chatMessage');
    })
}]);
angular.module('chat').filter('chatName', function () {
    return function (input, messageName, userName, fullName) {
        var out = fullName;
        if (messageName == userName) {
            out = "我";
        }
        return out;
    }
});