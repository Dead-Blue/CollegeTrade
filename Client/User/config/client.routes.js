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
//            'content@unSigined':{templateUrl:'/views/goods-list.html'
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
//            'content@sigined':{templateUrl:'/views/goods-list.html'
//            }
//        }
//    }).state('sigined.index',{
//        views:{
//            "content@Sigined":{
//                template:'/views/goods-list.html'
//
//
//            }
//        }
//
//    });
//});
angular.module('clientApp',['ngRoute','ngCookies','clientServices','clientControllers','clientDirectives'])
    .config(function ($routeProvider) {
        $routeProvider.when('/',{
            templateUrl: '/views/goods-list.html',
            controller:'mainCtrl',
            publicAccess: true
        });
        $routeProvider.when('/signin',{
            controller:'loginCtrl',
            templateUrl: '/views/signin.html',
            publicAccess: true
        });
        $routeProvider.when('/signout',{
            controller:'logoutCtrl',
            templateUrl: '/views/goods-list.html',
            publicAccess: true
        });
        $routeProvider.when('/signup',{
            controller:'registerCtrl',
            templateUrl: '/views/signup.html',
            publicAccess: true
        });
        $routeProvider.when('/publishItem',{
            controller:'publishItemCtrl',
            templateUrl: '/views/publishItem.html',
            publicAccess: true
        });
});

