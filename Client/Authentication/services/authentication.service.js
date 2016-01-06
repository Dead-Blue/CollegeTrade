angular.module('authentication').factory('Authentication', ['$rootScope',
	function($rootScope) {
		this.user = $rootScope.user;
		
		return {
			user: this.user
		};
	}
]);