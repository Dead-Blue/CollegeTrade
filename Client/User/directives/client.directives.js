/**
 * Created by sun on 2015/12/26.
 */
clientDirectives=angular.module('clientDirectives', []);
clientDirectives .directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            console.log('clientDirectives.fileModel.link');
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            console.log(modelSetter);
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files);
                });
                //附件预览
                scope.files = (event.srcElement || event.target).files;
                console.log("viewFile");
                console.log(scope.files);
                scope.getFiles();
            });
        }
    };
}]);
//评价
clientDirectives.directive('starRating', function () {
    return {
        template: '<style type="text/css">'+
        '.rating {color: #a9a9a9;margin: 0;padding: 0;}'+
    'ul.rating {display: inline-block;}'+
    '.rating li {list-style-type: none;display: inline-block;padding: 1px;text-align: center;font-weight: bold;cursor: pointer;}'+
    '.rating .filled {color: #ffee33;}'+
        '</style>' +
        '等级：<ul class="rating" ng-mouseleave="leave()">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            readonly: '@',
            onHover: '=',
            onLeave: '=',
            onChange: '='
        },
        controller: function($scope){
            $scope.ratingValue = $scope.ratingValue || 0;
            $scope.max = $scope.max || 5;
            $scope.click = function(val){
                if ($scope.readonly && $scope.readonly === 'true') {
                    return;
                }
                $scope.onChange(val);
                $scope.ratingValue = val;
            };
            $scope.over = function(val){
                $scope.onHover(val);
            };
            $scope.leave = function(){
                $scope.onLeave();
            }
        },
        link: function (scope, elem, attrs) {
            elem.css("text-align", "center");
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            updateStars();

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
            scope.$watch('max', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
});

//手机号码验证
clientDirectives.directive('phone', function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            if (ngModel) {
                var phoneRegexp =/^1[3|4|5|8][0-9]\d{8}$/g;
            }
            var phoneValidator = function (value) {
                var validity = ngModel.$isEmpty(value) || phoneRegexp.test(value);
                ngModel.$setValidity("phone", validity);
                return validity ? value : undefined;
            };
            ngModel.$formatters.push(phoneValidator);
            ngModel.$parsers.push(phoneValidator);
        }
    };
});