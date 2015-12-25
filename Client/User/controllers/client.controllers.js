/**
 * Created by sun on 2015/12/17.
 */
var client=angular.module('clientControllers',[]);
client.controller('loginCtrl',['$rootScope','$scope','$location','$cookieStore','authService',function($rootScope,$scope,$location,$cookieStore,authService) {
    console.log('loginCtrl');
    $scope.login =function(credentials){

        authService.login(credentials).then(function(response){
            //��¼�ɹ�
            $scope.resposeMessage=response;
            $rootScope.user=response.user;
            $cookieStore.put('user',$rootScope.user);
            $rootScope.isSigned=true;
            $location.path('/');

        },function(response){

            $scope.resposeMessage=response;
            $rootScope.isSigned=false;
//ʧ��
        });


    };


}]);

client.controller('mainCtrl',['$rootScope','$scope','$cookieStore',function($rootScope,$scope,$cookieStore) {
    console.log('mainCtrl');
    $rootScope.isSigned=false;
    $rootScope.user=$cookieStore.get('user');
    if($rootScope.user!=null){
        $rootScope.isSigned=true;
    }
    $rootScope.$watchCollection('user',function(){
        if( $rootScope.user!=null){
            $rootScope.isSigned=true;
        }
    })

}]);
//
//ע��
client.controller('logoutCtrl',['$rootScope','$scope','$cookieStore','$location','authService',function($rootScope,$scope,$cookieStore,$location,authService) {
    console.log('logoutCtrl');
    $rootScope.isSigned=false;
    $cookieStore.remove('user');
        authService.logout().then(function(response){
            //ע���ɹ�
            $scope.resposeMessage=response;
            $rootScope.user=response.user;
            $rootScope.isSigned=true;
            $location.path('/');
            console.log('ע���ɹ�');
        },function(response){

            $scope.resposeMessage=response;
            $rootScope.isSigned=false;
            console.log('ע��ʧ��');
//ʧ��
        });

}]);