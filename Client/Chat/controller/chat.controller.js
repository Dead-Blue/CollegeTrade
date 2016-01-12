angular.module('chat').controller('ChatController', ['$scope', 'Socket', '$http','ngDialog', function ($scope, Socket, $http,ngDialog) {
    $scope.messages = [];
    $scope.privateMessages =[];
    $scope.onlineList = [];
    //     $http({
    //     url: '/api/chat/roomMember',
    //     method: 'GET'
    // }).success(function (data, header, config, status) {
    //     $scope.onlineMember=data.onlineMember;

    // }).error(function (data, header, config, status) {
    //    $scope.onlineMember=-1;
    // });
   $scope.dynamicPopover = {
    content: '暂无消息',
    scope:$scope, 
    templateUrl: 'chat/views/chat.messageBox.html',
    title: '消息列表'
  };
        
    Socket.on('chatMessage', function (message) {
        $scope.messages.push(message);
    });
    Socket.on('privateMessage', function (message) {
        $scope.privateMessages.push(message);
    });
    Socket.on('newMember', function (message) {
        $scope.onlineMember= message.clientlist.length;
        $scope.onlineList = message.clientlist
        $scope.messages.push(message);
    });
    Socket.on('leaveMember', function (message) {
        $scope.onlineMember= message.clientlist.length;
        $scope.onlineList = message.clientlist
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
    $scope.sendMessageToSomeone = function (targetSocketId,targetUsername) {
        var message = {
            text: this.messageText,
            targetSocketId:targetSocketId,
        };
        Socket.emit('sayToSomeone', message);
       var message2={
           text:this.messageText,
            type : 'message',
		    created : Date.now(),
		    username : this.user.username,
            fullName: this.user.fullName,
            targetUsername:targetUsername
       }
        this.privateMessages.push(message2);
        this.messageText = '';
        this.visible = !this.visible;
    }
    $scope.$on('$destory', function () {
        Socket.removeListener('chatMessage');
    })
    
    $scope.clickToOpen = function (username,fullName,socketId,targetUserId) {
        $scope.targetFullname=fullName
         $scope.targetUsername=username
         $scope.targetSocketId=socketId
         $scope.targetUserId=targetUserId
        ngDialog.open({ 
            className: 'ngdialog-theme-default',  
            scope:$scope,  
            template: 'chat/views/chat.dialog.html'
             });
    };
}]);
angular.module('chat').filter('chatName', function () {
    return function (input, messageName, userName, fullName) {
        var out = fullName;
        if (messageName == userName) {
            out = "我";
        }
        return out;
    }
}).filter('isOnline', function () {
    return function (input,onlineList, targetSocketId) {
        var out = '离线';
        if (onlineList.indexOf(targetSocketId)!=-1) {
            out = "在线";
        }
        return out;
    }
});