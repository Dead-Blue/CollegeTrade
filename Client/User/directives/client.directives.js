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