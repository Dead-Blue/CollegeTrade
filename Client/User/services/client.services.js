/**
 * Created by sun on 2015/12/17.
 */
angular.module('clientServices', ['clientServices']).service('authService', function ($http, $q) {
    return {
        login: function (credentials) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post('/api/authentication', credentials).success(function (response) {
//��Ӧ�ɹ�
                deferred.resolve(response);


            }).error(function (response) {
//������Ӧʧ��
                deferred.reject(response);

            });
            return promise;
        }


    }
});