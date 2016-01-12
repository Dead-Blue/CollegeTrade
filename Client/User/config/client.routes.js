/**
 * Created by sun on 2015/12/17.
 */
//angular.module('clientApp',['ui.router','clientServices','clientControllers']).config(function($stateProvider, $urlRouterProvider) {
//    $urlRouterProvider.otherwise('/index');
//    $stateProvider.state('unSigined', {
//        url: '/index',
//        views:{
//            'topbar@unSigined':{
//                templateUrl:'/views/topbar.html'
//            },
//            'content@unSigined':{templateUrl:'/views/item-list.html'
//            }
//        }
//    }).state('unSigined.singin',{
//        url:'/login',
//        views:{
//            "content@unSigined":{
//                templateUrl:'/views/signin.html',
//                controller:'loginCtrl'
//
//            }
//        }
//
//    }).state('sigined', {
//        views:{
//            'content@sigined':{templateUrl:'/views/item-list.html'
//            }
//        }
//    }).state('sigined.index',{
//        views:{
//            "content@Sigined":{
//                template:'/views/item-list.html'
//
//
//            }
//        }
//
//    });
//});
angular.module('clientApp',[
    'ngRoute',
    'ngCookies',
    'clientServices',
    'clientControllers',
    'clientDirectives',
    'tm.pagination',
    'ui.bootstrap',
    'authentication',
    'chat',
    'message',
    'ng-sweet-alert'

]).config(function ($routeProvider) {
        $routeProvider.when('/',{
            templateUrl: '/views/item-list.html',
            controller:'itemListCtrl',
            publicAccess: true
        });
        $routeProvider.when('/signin',{
            controller:'loginCtrl',
            templateUrl: '/views/signin.html',
            publicAccess: true
        });
        $routeProvider.when('/signout',{
            controller:'logoutCtrl',
            templateUrl: '/views/item-list.html',
            publicAccess: true
        });
        $routeProvider.when('/signup',{
            controller:'registerCtrl',
            templateUrl: '/views/signup.html',
            publicAccess: true
        });
        $routeProvider.when('/publishItem',{
            controller:'publishItemCtrl',
            templateUrl: '/views/publish-item.html',
            publicAccess: true
        });
        $routeProvider.when('/itemDetails',{
        controller:'itemDetailsCtrl',
        templateUrl: '/views/item-details.html',
        publicAccess: true
        });
        $routeProvider.when('/orderListOfCustomer',{
        controller:'orderListOfCustomerCtrl',
        templateUrl: '/views/order-list-of-customer.html',
        publicAccess: true
        });
        $routeProvider.when('/orderListOfSeller',{
        controller:'orderListOfSellerCtrl',
        templateUrl: '/views/order-list-of-seller.html',
        publicAccess: true
    });

     $routeProvider.when('/changePassword',{
        controller:'changePasswordCtrl',
        templateUrl: '/views/change-password.html',
        publicAccess: true
    });

    $routeProvider.when('/changeAvatar',{
        controller:'changeAvatarCtrl',
        templateUrl: '/views/change-avatar.html',
        publicAccess: true
    });




});

