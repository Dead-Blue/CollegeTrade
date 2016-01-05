/**
 * Created by sun on 2015/12/17.
 */
clientServices = angular.module('clientServices', []);
/**
 * 用户服务
 */
clientServices.service('userService', function ($http, $q) {
    return {
        isLogin: function () {
            console.log('userService.islogin');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post('/api/authentication').success(function (response) {

            }).error(function (response) {

            })
        },

        /**
         * 登录
         * @param credentials
         * @returns {*|promise}
         */
        login: function (credentials) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            console.log('userService.login');
            $http.post('/api/authentication', credentials).success(function (response) {
//响应成功
                deferred.resolve(response);


            }).error(function (response) {
//处理响应失败
                deferred.reject(response);

            });
            return promise;
        },
        /**
         * 注销
         * @returns {*|promise}
         */
        logout: function () {
            console.log('userService.logout');
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.delete('/api/authentication').success(function (response) {
//响应成功
                deferred.resolve(response);


            }).error(function (response) {
//处理响应失败
                deferred.reject(response);

            });
            return promise;
        },
        /**
         * 用户注册
         * @param userInfo
         */
        register: function (userInfo) {
            console.log('userService.register');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post('/api/user',userInfo).success(function (response) {
                deferred.resolve(response);
            }).error(function (response) {
                deferred.reject(response);
            });
            return promise;
        }


    }
});
/**
 * 商品服务
 */
clientServices.service('itemService', function ($http, $q) {
    return {
        /**
         * 发布商品信息
         * @param itemInfo
         */
        publishItem:function(itemInfo){
            console.log('itemService.publishItem');
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('itemname',itemInfo.itemname);
            fd.append('stock',itemInfo.stock);
            fd.append('unitPrice',itemInfo.unitPrice);
            fd.append('description',itemInfo.description);
            fd.append('itemType',itemInfo.itemType);
            for(var i=0;i<itemInfo.images.length;i++){
                fd.append('img',itemInfo.images[i]);
            }

            var promise = deferred.promise;
            $http.post('/api/item',fd, {
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                deferred.resolve(response);
                console.log('itemService.publishItem.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('itemService.publishItem.error');
            });
            return promise;
        },
        /**
         *获得商品列表
         */
        getItems:function(){
            console.log('itemService.getItems');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/items').success(function (response) {
                deferred.resolve(response);
                console.log('itemService.getItems.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('itemService.getItems.error');
            });
            return promise;
        },
        /**
         * 购买商品
         * @returns {*|promise}
         */
        buyItem:function(itemInfo,unitPrice,quantity){
            console.log('itemService.buyItem');
            var deferred = $q.defer();
            var promise = deferred.promise;
            var data = {'item':itemInfo,'unitPrice':unitPrice,'quantity':quantity};
            $http.post('/api/order',data).success(function (response) {
                deferred.resolve(response);
                console.log('itemService.buyItem.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('itemService.buyItem.error');
            });
            return promise;
        }

    }
});
clientServices.service('orderService', function ($http, $q) {
    return {
        /**
         * 获得订单
         */
        getOrders:function(){
            console.log('orderService.getOrders');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/orders').success(function (response) {
                deferred.resolve(response);
                console.log('orderService.getOrders.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('orderService.getOrders.error');
            });
            return promise;
        }
    }
});
/**
 * 读文件
 */
clientServices.factory('fileReader', ["$q", "$log", function($q, $log){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}])