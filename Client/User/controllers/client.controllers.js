/**
 * Created by sun on 2015/12/17.
 */
var client = angular.module('clientControllers', []);


/**
 * 登录
 */
client.controller('loginCtrl', ['$rootScope', '$scope', '$location', '$cookieStore', '$window', 'userService', function ($rootScope, $scope, $location, $cookieStore, $window, userService) {
    console.log('loginCtrl');
    $rootScope.user = $rootScope.user = $cookieStore.get('user');
    if ($rootScope.user != null) {
        $location.path('/');
        return;
    }
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
            swal("登录失败!", "请确认用户名与密码", "error");

            $scope.resposeMessage = response;
            credentials.password = null;
            $rootScope.isSigned = false;
//失败
        });


    };
}]);

/**
 * 修改密码
 */
client.controller('changePasswordCtrl', ['$rootScope', '$scope', '$location', '$cookieStore', '$window', 'userService', function ($rootScope, $scope, $location, $cookieStore, $window, userService) {
    console.log('changePasswordCtrl');
    $rootScope.user = $rootScope.user = $cookieStore.get('user');
    if ($rootScope.user == null) {
        swal("请先登录");
        $location.path('/');
        return;
    }
    $scope.changePassword = function (username,oldPassword,newPassword) {
        console.log('clientControllers.changePasswordCtrl.changePassword');
        userService.changePassword(username,oldPassword,newPassword).then(function (response) {
            console.log("changePassword.success");
            console.log(response);
            if(response.success){
                swal("修改成功!", "", "success");
                $location.path('/');
            }
            else{
                swal("修改失败!", response.message, "error");
            }
        }, function (response) {
            console.log("loginFail");
            swal("修改失败!", response, "error");
        });


    };
}]);

/**
 * 主窗口
 */
client.controller('mainCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, itemService) {
    console.log('mainCtrl');
    $rootScope.user = $cookieStore.get('user');
    $scope.itemType = "";
    if ($rootScope.user != null) {
        $rootScope.isSigned = true;
    }
    $rootScope.$watchCollection('user', function () {
        if ($rootScope.user != null) {
            $rootScope.isSigned = true;
        }
    });
    /**
     * 改变商品分类
     * @param itemType
     */
    $scope.changeItemType = function (itemType) {

        $location.path('/');
        $scope.itemType = itemType;
        console.log(itemType);

    };

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
                swal("注册成功!", "", "success");
                $location.path('/');
                $cookieStore.put('user', response.user);
            } else {
                swal("注册失败!", "", "error");
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
        $scope.imageSrcs = [];
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
        /**
         * 设置弹出框
         */
        $scope.sweet={};
        $scope.sweet.option = {
            "title": "你确认发布吗？",
            "text": "           " + "商品详情" + "           " + "\n" +
            "商品名：" + itemInfo.itemname + "\n"
            + "库存：" + itemInfo.stock + "\n"
            + "单价：" + itemInfo.unitPrice + "\n"
            + "分类：" + itemInfo.itemType + "\n",

            "type": "info",
            "showCancelButton": true,
            "confirmButtonColor": "#DD6B55",
            "confirmButtonText": "是",
            "cancelButtonText": "否",
            "closeOnConfirm": false,
            "closeOnCancel": true
        };


        swal($scope.sweet.option, function (isConfirm) {//弹出提示框
            if (isConfirm) {
                itemService.publishItem(itemInfo).then(
                    function (response) {
                        $scope.resposeMessage = response;
                        console.log(response);
                        swal("发布成功!", "", "success");
                        $location.path('/');
                    }, function (response) {
                        swal("发布失败!", "", "success");
                    });
            }

        });
        //var result = $window.confirm(
        //    "          " + "商品详情" + "           " + "\n" +
        //    "商品名：" + itemInfo.itemname + "\n"
        //    + "库存：" + itemInfo.stock + "\n"
        //    + "单价：" + itemInfo.unitPrice + "\n"
        //    + "分类：" + itemInfo.itemType + "\n"
        //);
        //if (!result) return;
        //itemService.publishItem(itemInfo).then(
        //    function (response) {
        //
        //        console.log('publishItemCtrl.publishItem');
        //        $scope.resposeMessage = response;
        //        console.log(response);
        //        $window.alert('发布成功');
        //
        //        $location.path('/');
        //    }, function (response) {
        //
        //    });
    }
}]);
/**
 * 获得商品列表
 */
client.controller('itemListCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', '$filter', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, $filter, itemService) {
    console.log('clientControllers.itemListCtrl');
    //在显示中的商品
    $scope.onShownItems = [];
    //所有商品
    $scope.allItems = [];
    //将要显示商品
    $scope.preShowItems = [];

    /**
     * 初始化分页函数
     */
    initPagination = function () {
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: $scope.preShowItems.length,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                console.log("Pagination onChange");
                $scope.onShownItems = [];
                for (var i = $scope.paginationConf.itemsPerPage * ( $scope.paginationConf.currentPage - 1); i < $scope.paginationConf.itemsPerPage * $scope.paginationConf.currentPage; i++) {
                    if ($scope.preShowItems[i] == null) {
                        break;
                    }
                    $scope.onShownItems.push($scope.preShowItems[i]);
                }


            }
        };
    };
    console.log('itemListCtrl.getItems');

    itemService.getItems().then(function (response) {
        console.log('itemListCtrl.getItems.success');

        $scope.allItems = response;
        $scope.preShowItems = $scope.allItems;

        initPagination();
        if ($scope.allItems.length < 0) {

            //$window.alert("连接失败");
            swal("获取数据失败!", "", "error");
        }

    }, function (response) {
        console.log('itemListCtrl.getItems.fail');
        console.log(response);
    });

//分页不设置会报错
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: $scope.allItems.length,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50]

    };
    //点击详情后的操作
    $scope.itemDetail = function (index) {
        console.log(index);
        $cookieStore.put("item", $scope.onShownItems[index]);
    };
    /**
     * 检测$scope.itemType值的变化
     */
    $scope.$watch("itemType", function () {
        console.log("itemType", $scope.itemType);
        if ($scope.itemType == null) {
            $scope.preShowItems = $scope.allItems;
        } else {
            //根据itemType选择preShowItems
            $scope.preShowItems = $filter('filter')($scope.allItems, {itemType: $scope.itemType});
        }
        console.log("preShowItems", $scope.preShowItems);
        initPagination();
    });
}]);
/**
 * 详情页
 */
client.controller('itemDetailsCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'itemService', function ($rootScope, $scope, $cookieStore, $location, $window, itemService) {
    console.log('itemDetailsCtrl');

    $scope.quantity = 1;

    //
    $scope.itemDetails = $cookieStore.get("item");
    console.log($scope.itemDetails);


    $scope.unitPrice = $scope.itemDetails.unitPrice;

    if ($scope.itemDetails == null) {
        console.log("$scope.item is null");
    }

    $scope.buyItem = function (itemDetails, unitPrice, quantity) {
        console.log('itemDetailsCtrl.buyItem');
//配置Alert
        $scope.sweet = {};
        $scope.sweet.option = {
            title: "购买",
            text: "你确定要购买此产品吗？数量为：" + $scope.quantity,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: false,
            closeOnCancel: true
        };
        swal($scope.sweet.option, function (isConfirm) {//弹出提示框
            if (isConfirm) {//确认购买
                itemService.buyItem(itemDetails, unitPrice, quantity).then(
                    function (response) {
                        console.log(response);
                        swal("购买成功!", "", "success");
                        //更新视图
                        itemService.getItemsById($scope.itemDetails.id).then(
                            function (response) {
                                console.log("getItemsById");
                                $scope.itemDetails = response;
                                $cookieStore.put("item", $scope.itemDetails);
                            }
                            , function (response) {
                            });
                    },
                    function (response) {
                        console.log(response);
                        swal("购买失败!", "", "error");
                        if (response.message == "User is not logged in") {
                            $location.path('/signin');
                        }
                    }
                );
            }
        });

    }

}]);
/**
 * 以消费者身份查看订单
 */
client.controller('orderListOfCustomerCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'orderService', function ($rootScope, $scope, $cookieStore, $location, $window, orderService) {
    console.log('clientControllers.orderListOfCustomerCtrl');
    //在显示中的列表
    $scope.onShownOrders = [];
    //所有列表
    $scope.allOrders = [];

    ///初始化分页
    initPagination = function () {
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: $scope.allOrders.length,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.onShownOrders = [];
                for (var i = $scope.paginationConf.itemsPerPage * ( $scope.paginationConf.currentPage - 1); i < $scope.paginationConf.itemsPerPage * $scope.paginationConf.currentPage; i++) {
                    if ($scope.allOrders[i] == null) {
                        break;
                    }
                    var order = {
                        'id': $scope.allOrders[i].id,
                        'created': $scope.allOrders[i].created,
                        'itemname': $scope.allOrders[i].item.itemname,
                        'state': (function () {
                            var state = $scope.allOrders[i].state;
                            console.log(state);
                            if ('trading' == state) return "交易中";
                            if ('successCompleted' == state) return "交易完成";
                            return state;
                        })(),
                        'price': $scope.allOrders[i].price,
                        'rate': $scope.allOrders[i].rate
                    };

                    $scope.onShownOrders.push(order);
                }
            }
        };
    };
    orderService.getOrdersAsCustomer().then(function (response) {
        console.log('orderListOfCustomerCtrl.getOrdersAsCustomer.success');
        console.log(response);
        $scope.allOrders = response;
        if ($scope.allOrders.length <= 0) {
            //$window.alert("没有记录");
            swal("没有记录!");
            return;
        }
        initPagination();


    }, function (response) {
        console.log('orderListCtrl.getOrdersAsCustomer.fail');
        swal("获取数据失败!", "", "error");
        console.log(response);
    });
    /**
     * 评价
     * @param index
     */
    $scope.rateOrder = function (index) {
        console.log("rateId", $scope.onShownOrders[index].id);
        console.log("rateVal", $scope.ratingVal);
        orderService.rateOrderAsCustomer($scope.onShownOrders[index].id, $scope.ratingVal, "").
            then(function (response) {
                console.log(response);
                //$window.alert("评价成功");
                swal("评价成功!", "", "success");
                //刷新页面
                $location.path("/orderListOfCustomer")
            }, function (response) {
                console.log(response);
                swal("评价失败!");
                $location.path("/orderListOfCustomer")
            });
        //每评一次分就重置
        $scope.ratingVal = 5;
    };
//不写会报错
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50]
    };

    $scope.max = 5;
    $scope.ratingVal = 5;
    $scope.readonly = false;
    $scope.onHover = function (val) {
        $scope.hoverVal = val;

    };
    $scope.onLeave = function () {


    };
    $scope.onChange = function (val) {
        $scope.ratingVal = val;
        console.log('onChange', val)
    };
}]);

/**
 * 以销售者身份查看订单
 */
client.controller('orderListOfSellerCtrl', ['$rootScope', '$scope', '$cookieStore', '$location', '$window', 'orderService', function ($rootScope, $scope, $cookieStore, $location, $window, orderService) {
    console.log('clientControllers.orderListOfSellerCtrl');
    //在显示中的列表
    $scope.onShownOrders = [];
    //所有列表
    $scope.allOrders = [];

    ///刷新订单列表
    initPagination = function () {
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: $scope.allOrders.length,
            itemsPerPage: 15,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.onShownOrders = [];
                for (var i = $scope.paginationConf.itemsPerPage * ( $scope.paginationConf.currentPage - 1); i < $scope.paginationConf.itemsPerPage * $scope.paginationConf.currentPage; i++) {
                    if ($scope.allOrders[i] == null) {
                        break;
                    }
                    var order = {
                        'created': $scope.allOrders[i].created,
                        'itemname': $scope.allOrders[i].item.itemname,
                        'state': (function () {
                            var state = $scope.allOrders[i].state;
                            console.log(state);
                            if ('trading' == state) return "交易中";
                            if ('successCompleted' == state) return "交易完成";
                            return state;
                        })(),
                        'price': $scope.allOrders[i].price,
                        'quantity': $scope.allOrders[i].quantity,
                        'rate': (function () {
                            if ($scope.allOrders[i].rate == "") {
                                return "---"
                            } else {
                                return $scope.allOrders[i].rate;
                            }
                        })()
                    };

                    $scope.onShownOrders.push(order);
                }
                console.log($scope.onShownOrders);
            }
        };
    };
    orderService.getOrdersAsSeller().then(function (response) {
        console.log('orderListOfSellerCtrl.getOrdersAsSeller.success');
        console.log(response);
        $scope.allOrders = response;
        if ($scope.allOrders.length <= 0) {
            swal("没有记录!");
            return;
        }
        initPagination();
    }, function (response) {
        console.log('orderListCtrl.getOrdersAsSeller.fail');
        //$window.alert("失败");
        swal("获取数据失败!", "", "error");
        console.log(response);
    });

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50]
    };


}]);

