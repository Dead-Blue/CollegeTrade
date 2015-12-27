/**
 * Created by sun on 2015/12/17.
 */
var client = angular.module('clientControllers', []);
client.controller('loginCtrl', ['$rootScope', '$scope', '$location', '$cookieStore', 'userService', function ($rootScope, $scope, $location, $cookieStore, userService) {
    console.log('loginCtrl');
    $scope.login = function (credentials) {
        console.log('clientControllers.loginCtrl.login');
        userService.login(credentials).then(function (response) {
            console.log("loginSuccess");
            console.log(credentials);
            $scope.resposeMessage = response;
            $rootScope.user = response.user;
            $cookieStore.put('user', $rootScope.user);
            $rootScope.isSigned = true;
            $location.path('/');

        }, function (response) {
            console.log("loginFail");
            $scope.resposeMessage = response;
            $rootScope.isSigned = false;
//失败
        });


    };
}]);

client.controller('mainCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, itemService) {
    console.log('mainCtrl');
    $rootScope.isSigned = false;
    $rootScope.user = $cookieStore.get('user');

    if ($rootScope.user != null) {
        $rootScope.isSigned = true;
    }
    $rootScope.$watchCollection('user', function () {
        if ($rootScope.user != null) {
            $rootScope.isSigned = true;
        }
    });


}]);
//
//注销
client.controller('logoutCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', 'userService', function ($rootScope, $scope, $cookieStore, $location, userService) {
    console.log('logoutCtrl');
    $rootScope.isSigned = false;
    $cookieStore.remove('user');
    userService.logout().then(function (response) {
        //注销成功
        $scope.resposeMessage = response;
        $location.path('/');
        console.log('注销成功');
    }, function (response) {

        $scope.resposeMessage = response;
        $rootScope.isSigned = false;
        console.log('注销失败');
//失败
    });

}]);
/**
 * 注册
 */
client.controller('registerCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', 'userService', function ($rootScope, $scope, $cookieStore, $location, userService) {
    console.log('clientControllers.registerCtrl');
    $scope.register = function (userInfo) {
        console.log('registerCtrl.register');

        userService.register(userInfo).then(function (response) {
            //注册成功

            console.log(userInfo);
            $scope.resposeMessage = response;

            console.log(response);
            if (response.success) {//注册成功直接跳转
                console.log('registerSuccess');
                $location.path('/');
                $cookieStore.put('user', response.user);
            } else {
                console.log('registerFail');
            }


        }, function (response) {
            console.log('registerFail');
            console.log(userInfo);
            $scope.resposeMessage = response;
            console.log(response);
//失败
        });
    };


}]);
/**
 * 发布商品
 */
client.controller('publishItemCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', 'fileReader', function ($rootScope, $scope, $cookieStore, $location, $window, itemService, fileReader) {
    console.log('clientControllers.publishItemCtrl');
    $scope.imageSrcs = [];
    $scope.itemInfo = {};

    $scope.itemTypes = [
        {name: '其他'},
        {name: '生活用品'},
        {name: '电子产品'},
        {name: '学习用品'},
        {name: '图书'},
        {name: '电脑配件'}
    ];
    $scope.typeSelected = $scope.itemTypes[0];
    $scope.itemInfo.itemType = '其他';
    /**
     * 预览显示图片
     */
    $scope.getFiles = function () {
        console.log('publishItemCtrl.getFiles');

        for (var i = 0; i < $scope.files.length; i++) {
            fileReader.readAsDataUrl($scope.files[i], $scope)
                .then(function (result) {
                    $scope.imageSrcs.push(result);

                });
        }

        $scope.itemInfo.images = $scope.images;


    };
    /**
     * 发布商品
     * @param itemInfo
     */
    $scope.publishItem = function (itemInfo) {
        console.log('publishItemCtrl.publishItem');
        itemInfo.itemType = $scope.typeSelected.name;
        var result = $window.confirm(
            "          " + "商品详情" + "           " + "\n" +
            "商品名：" + itemInfo.itemname + "\n"
            + "库存：" + itemInfo.stock + "\n"
            + "单价：" + itemInfo.unitPrice + "\n"
            + "分类：" + itemInfo.itemType + "\n"
        );
        if (!result) return;
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
/**
 * 获得商品列表
 */
client.controller('getItemsCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, itemService) {
    console.log('clientControllers.getItemsCtrl');
    //在显示中的列表
    $scope.onShownItems = [];
    //所有列表
    $scope.allItems = [];

    ///刷新商品列表
    console.log('getItemsCtrl.getItems');
    itemService.getItems().then(function (response) {
        console.log('getItemsCtrl.getItems.success');

        console.log(response);

        $scope.allItems = response;
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: $scope.allItems.length,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.onShownItems = [];
                for (var i = $scope.paginationConf.itemsPerPage * ( $scope.paginationConf.currentPage - 1); i < $scope.paginationConf.itemsPerPage * $scope.paginationConf.currentPage; i++) {
                    if ($scope.allItems[i] == null) {
                        break;
                    }
                    $scope.onShownItems.push($scope.allItems[i]);
                }
                console.log("currentPage" + $scope.paginationConf.currentPage);
                console.log($scope.onShownItems);
            }
        };
        if ($scope.allItems.length <= 0) {

            $window.alert("连接失败");
        }

    }, function (response) {
        console.log('getItemsCtrl.getItems.fail');
        console.log(response);
    });

//设置分页
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: $scope.allItems.length,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.onShownItems = [];
            for (var i = $scope.paginationConf.itemsPerPage * ( $scope.paginationConf.currentPage - 1); i < $scope.paginationConf.itemsPerPage * $scope.paginationConf.currentPage; i++) {
                if ($scope.allItems[i] == null) {
                    break;
                }
                $scope.onShownItems.push($scope.allItems[i]);
            }


        }
    };
    $scope.itemDetail = function (index) {
        console.log(index);
        $cookieStore.put("item", $scope.onShownItems[index]);
    }


}]);

client.controller('itemDetailsCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, itemService) {
    console.log('itemDetailsCtrl');
    $scope.txt="ssssssssssssss";
    $scope.$watch("itemDetails",function(){

        console.log('.............');
    });
    $scope.itemDetails = $cookieStore.get("item");
    console.log($scope.itemDetails);
    $scope.imageSrcs=$scope.itemDetails.imagesUrl;
    console.log();
    if($scope.itemDetails=null){
        console.log("$scope.item is null");
    }



}]);
