// $q 是内置服务，所以可以直接使用
angular.module('message').service('MessageInfo', ['$http','$timeout', function ($http,$timeout) {
  this.getMessageDetail = function(messageID,callback){
  $http({
        url: '/api/user/messages/'+messageID,
        method: 'GET'
    }).success(function (data, header, config, status) {
        this.message=data;
       $timeout(function() {
          callback(data);
        });

    }).error(function (data, header, config, status) {
       this.message=null;
       var message;
       message.error='error'
      $timeout(function() {
          callback(message);
        });
    });
  }
  this.sendMessage = function(messageID,callback){
//TODO
  }
}]);