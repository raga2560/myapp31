'use strict';

angular.module('mean.ggexpress').factory('Ggexpress', [
  function() {
    return {
      name: 'ggexpress'
    };
  }
])
.factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}])
.factory('Users', ['$resource',
	function($resource) {
		var url = "http://localhost:3000/";
		return $resource(url+'users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('UserdataService', ['$resource',
	function($resource) {
		return $resource('userdatas/:userdataId', {
			userdataId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('ObjecttypeService', ['$resource',
	function($resource) {
		return $resource('/api/objecttype/:objecttypeId', {
			objecttypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('ObjectService', ['$resource',
	function($resource) {
		return $resource('/api/object/:objectId', {
			disposeableId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
