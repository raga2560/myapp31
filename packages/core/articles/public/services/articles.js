'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource',
  function($resource) {
    return $resource('api/article3s/:article3Id', {
      article3Id: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
