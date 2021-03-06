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
            data = {
                'firstName': userInfo.firstName,
                'lastName': userInfo.lastName,
                'college': userInfo.college,
                'email': userInfo.email,
                'username': userInfo.username,
                'password': userInfo.password,
                'phone': userInfo.phone
            };
            console.log(data);
            $http.post('/api/user', data).success(function (response) {
                deferred.resolve(response);
                ////立即上传头像
                //data = {'username': userInfo.username, 'avatar': userInfo.avatar};
                //$http.post('/api/user/avatar', data, {
                //    headers: {
                //        'Content-Type': undefined
                //    }
                //}).success(function (response) {
                //    deferred.resolve(response);
                //}).error(function (response) {
                //    deferred.reject(response);
                //});

            }).error(function (response) {
                deferred.reject(response);
            });
            return promise;

        },
        /**
         * 修改密码
         * @param password
         * @returns {*|promise}
         */
        changePassword: function (username, oldPassword, newPassword) {
            console.log('userService.changePassword');
            var deferred = $q.defer();
            var promise = deferred.promise;
            data = {'username': username, 'oldPassword': oldPassword, 'newPassword': newPassword}
            $http.put('/api/user', data).success(function (response) {
                deferred.resolve(response);
            }).error(function (response) {
                deferred.reject(response);
            });
            return promise;
        },
        /**
         * 上传头像
         * @param username
         * @param avatar
         * @returns {*}
         */
        updateAvatar: function (username, avatar) {
            console.log('userService.updateAvatar');
            var deferred = $q.defer();
            var promise = deferred.promise;
            var fd = new FormData();
            fd.append('username', username);
            fd.append('avatar', avatar);
            $http.post('/api/user/avatar', fd, {
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
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
        publishItem: function (itemInfo) {
            console.log('itemService.publishItem');
            var deferred = $q.defer();
            var fd = new FormData();
            fd.append('itemname', itemInfo.itemname);
            fd.append('stock', itemInfo.stock);
            fd.append('unitPrice', itemInfo.unitPrice);
            fd.append('description', itemInfo.description);
            fd.append('itemType', itemInfo.itemType);
            for (var i = 0; i < itemInfo.images.length; i++) {
                fd.append('img', itemInfo.images[i]);
            }

            var promise = deferred.promise;
            $http.post('/api/item', fd, {
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
        getItems: function () {
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
         *
         * @param id
         * @returns {*|promise}
         */
        getItemsById: function (id) {
            console.log('itemService.getItemsById');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/items/' + id).success(function (response) {
                deferred.resolve(response);
                console.log('itemService.getItemsById.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('itemService.getItemsById.error');
            });
            return promise;
        },
        /**
         * 购买商品
         * @returns {*|promise}
         */
        buyItem: function (itemInfo, unitPrice, quantity) {
            console.log('itemService.buyItem');
            var deferred = $q.defer();
            var promise = deferred.promise;
            var data = {'item': itemInfo, 'unitPrice': unitPrice, 'quantity': quantity};
            $http.post('/api/order', data).success(function (response) {
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
         * 以消费者身份查看订单
         */
        getOrdersAsCustomer: function () {
            console.log('orderService.getOrdersAsCustomer');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/orders/customer').success(function (response) {
                deferred.resolve(response);
                console.log('orderService.getOrdersAsCustomer.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('orderService.getOrdersAsCustomer.error');
            });
            return promise;
        },
        /**
         * 以销售者身份查看订单
         * @returns {*|promise}
         */
        getOrdersAsSeller: function () {
            console.log('orderService.getOrdersAsSeller');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/orders/seller').success(function (response) {
                deferred.resolve(response);
                console.log('orderService.getOrdersAsSeller.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('orderService.getOrdersAsSeller.error');
            });
            return promise;
        },
        /**
         * 以消费者身份评价
         */
        rateOrderAsCustomer: function (orderId, rateVal, rate) {
            console.log('orderService.rateOrderAsCustomer');
            var deferred = $q.defer();
            var promise = deferred.promise;
            var data = {'updateType': 'rate&state', 'rate': rateVal, 'state': 'successCompleted', 'rate': rate};
            $http.put('/api/orders/customer/' + orderId, data).success(function (response) {
                deferred.resolve(response);
                console.log('orderService.rateOrderAsCustomer.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('orderService.rateOrderAsCustomer.error');
            });
            return promise;
        }

    }
});
/**
 * 公告服务
 */
clientServices.service('articleService', function ($http, $q) {
        return {
            getArticles:function(){
                console.log('articleService.getArticles');
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('/api/articles').success(function (response) {
                    deferred.resolve(response);
                    console.log('articleService.getArticles.success');
                }).error(function (response) {
                    deferred.reject(response);
                    console.log('articleService.getArticles.error');
                });
                return promise;
            }
        }
    }
);
clientServices.service('messageService', function ($http, $q) {
    return {
        /**
         * 获得消息
         */
        getMessage:function(){
            console.log('messageService.getMessage');
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('/api/user/message').success(function (response) {
                deferred.resolve(response);
                console.log('itemService.getMessage.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('itemService.getMessage.error');
            });
            return promise;
        },
        /**
         *
         * @param id 对方id
         * @param content
         * @returns {*|promise}
         */
        postMessage:function(id,content){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var data = {'content': content};
            $http.post('/api/user/message/'+id, data).success(function (response) {
                deferred.resolve(response);
                console.log('messageService.postMessage.success');
            }).error(function (response) {
                deferred.reject(response);
                console.log('messageService.postMessage.error');
            });
            return promise;
        }

    };
});

/**
 * 读文件
 */
clientServices.factory('fileReader', ["$q", "$log", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
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

    var getReader = function (deferred, scope) {
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