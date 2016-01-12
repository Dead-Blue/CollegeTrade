angular.module('message').controller('MessageController', ['$scope', 'MessageInfo','ngDialog', function ($scope, MessageInfo,ngDialog) {
    $scope.clickToOpen = function (messageID) {
        MessageInfo.getMessageDetail(messageID,function(message){
            var createdDate = new Date(message.created);
           message.created =(createdDate).toLocaleDateString() + " " + (createdDate).toLocaleTimeString();
            $scope.message=message;
            ngDialog.open({ 
            className: 'ngdialog-theme-default',  
            scope:$scope,  
            template: 'message/views/message.messageDetail.html'
        });
        })
    };
    
      $scope.clickToSend = function (targetID,targetName) {
          $scope.targetID = targetID;
          $scope.targetName = targetName;
            ngDialog.open({ 
            className: 'ngdialog-theme-default',  
            scope:$scope,  
            template: 'message/views/message.sendMessage.html'
        });
    };
}]);