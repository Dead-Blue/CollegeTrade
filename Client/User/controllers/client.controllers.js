/**
 * Created by sun on 2015/12/17.
 */
var client=angular.module('clientControllers',[]);
client.controller('loginCtrl',['$rootScope','$scope','$location','$cookieStore','userService',function($rootScope,$scope,$location,$cookieStore,userService) {
    console.log('loginCtrl');
    $scope.login =function(credentials){
        console.log('clientControllers.loginCtrl.login');
        userService.login(credentials).then(function(response){
            console.log("loginSuccess");
            console.log(credentials);
            $scope.resposeMessage=response;
            $rootScope.user=response.user;
            $cookieStore.put('user',$rootScope.user);
            $rootScope.isSigned=true;
            $location.path('/');

        },function(response){
            console.log("loginFail");
            $scope.resposeMessage=response;
            $rootScope.isSigned=false;
//失败
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
//注销
client.controller('logoutCtrl',['$rootScope','$scope','$cookieStore','$location','userService',function($rootScope,$scope,$cookieStore,$location,userService) {
    console.log('logoutCtrl');
    $rootScope.isSigned=false;
    $cookieStore.remove('user');
    userService.logout().then(function(response){
        //注销成功
        $scope.resposeMessage=response;
        $location.path('/');
        console.log('注销成功');
    },function(response){

        $scope.resposeMessage=response;
        $rootScope.isSigned=false;
        console.log('注销失败');
//失败
    });

}]);
/**
 * 注册
 */
client.controller('registerCtrl',['$rootScope','$scope','$cookieStore','$location','userService',function($rootScope,$scope,$cookieStore,$location,userService) {
    console.log('clientControllers.registerCtrl');
    $scope.register=function(userInfo){
        console.log('registerCtrl.register');

        userService.register(userInfo).then(function(response){
            //注册成功

            console.log(userInfo);
            $scope.resposeMessage=response;

            console.log(response);
            if(response.success){//注册成功直接跳转
                console.log('registerSuccess');
                $location.path('/');
                $cookieStore.put('user',response.user);
            }else{
                console.log('registerFail');
            }



        },function(response){
            console.log('registerFail');
            console.log(userInfo);
            $scope.resposeMessage=response;
            console.log(response);
//失败
        });
    };


}]);
/**
 * 发布商品
 */
client.controller('publishItemCtrl',['$rootScope','$scope','$cookieStore','$location','$window','itemService','fileReader',function($rootScope,$scope,$cookieStore,$location,$window,itemService,fileReader) {
    console.log('clientControllers.publishItemCtrl');
    $scope.imageSrcs=[];
    $scope.itemInfo={};
    $scope.getFiles = function () {
        console.log('publishItemCtrl.getFiles');

        for(var i= 0;i<$scope.files.length;i++)
        {
            fileReader.readAsDataUrl($scope.files[i], $scope)
                .then(function (result) {
                    $scope.imageSrcs.push(result);
                   
                });
        }

        $scope.itemInfo.images=$scope.images;


    };

    $scope.publishItem=function(itemInfo) {
        console.log('publishItemCtrl.publishItem');
        var result = $window.confirm(
            "          "+商品详情+"           "+
            "商品名："+itemInfo.itemname+"\n"
            +"库存："+itemInfo.stock+"\n"
            +"单价："+itemInfo.unitPrice+"\n"
        );
        if(!result) return;
        itemService.publishItem(itemInfo).then(
            function (response) {

                console.log('publishItemCtrl.publishItem');
                $scope.resposeMessage = response;
                console.log(response);
                $window.alert('发布成功');
                $location.path('/');
            }, function (response) {

            });
    }
}]);