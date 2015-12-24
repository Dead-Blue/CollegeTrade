/**
 * Created by sun on 2015/12/17.
 */
angular.module('clientServices', ['clientServices']).service('authService', function ($http, $q) {
    return {
        login: function (credentials) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post('/api/authentication', credentials).success(function (response) {
//响应成功
                deferred.resolve(response);


            }).error(function (response) {
//处理响应失败
                deferred.reject(response);

            });
            return promise;
        }


    }
});