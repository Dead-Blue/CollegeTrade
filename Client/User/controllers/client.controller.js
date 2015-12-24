/**
 * Created by sun on 2015/12/17.
 */
var client=angular.module('clientControllers',[]);
client.controller('loginCtrl',['$rootScope','$scope','$http','$location','$cookieStore','authService',function($rootScope,$scope,$http,$location,$cookieStore,authService) {

    $scope.login =function(credentials){

        authService.login(credentials).then(function(response){
            //µÇÂ¼³É¹¦
            $scope.resposeMessage=response;
            $rootScope.user=response.user;
            $cookieStore.put('user',$rootScope.user);
            $rootScope.isSigned=true;
            $location.path('/');

        },function(response){

            $scope.resposeMessage=response;
            $rootScope.isSigned=false;
//Ê§°Ü
        });


    };


}]);

client.controller('mainCtrl',['$rootScope','$scope','$cookieStore',function($rootScope,$scope,$cookieStore) {
    $rootScope.isSigned=false;
    $rootScope.user=$cookieStore.get('user');
    if($rootScope.user!=null){
        $rootScope.isSigned=true;
    }
    $rootScope.$watchCollection('user',function(){
        if( $rootScope.user!=null){
            $rootScope.isSigned=true;
        }
        $scope.test=function(){
            $scope.isSigned=!$scope.isSigned;
            console.log($scope.isSigned);
        }


    })

}]);

client.controller('logoutCtrl',['$rootScope','$scope','$cookieStore',function($rootScope,$scope,$cookieStore) {
    $rootScope.isSigned=false;
    $cookieStore.remove('user');

}]);