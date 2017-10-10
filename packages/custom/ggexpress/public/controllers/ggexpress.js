'use strict';

/* jshint -W098 */
angular.module('mean.ggexpress').controller('GgexpressController', ['$scope', 'Global', 'Ggexpress',
  function($scope, Global, Ggexpress) {
    $scope.global = Global;
    $scope.package = {
      name: 'ggexpress'
    };
  }
])

.controller('ObjecttypeController', ['$scope', '$stateParams', '$location', 'Authentication', 'ObjecttypeService',
	function($scope, $stateParams, $location, Authentication, ObjecttypeService) {
		$scope.authentication = Authentication;

		
		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new ObjecttypeService({
				name: this.name,
				typedesc: this.typedesc.split(","),
				giver: this.giver.split(","),
				taker: this.taker.split(","),
				desc: this.desc,
				group: this.group,
				
				
			});

			// Redirect after save
			article.$save(function(response) {
				//$location.path('Objecttype/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.objecttype_submit = function ()
		{
			$scope.create();
		};

		
		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('objecttype');
				});
			}
		};
		

		$scope.additemtype = function ()
		{
			$scope.newitemtype;
			
		}
		$scope.deleteobjecttype = function (article)
		{
			$scope.remove($scope.article);
			/*
			var article = $scope.article;
			if (article) {
				article.$remove(); 
			} */
			
		}
		$scope.newgiver = function ()
		{
			//alert($scope.giveritem);
			//alert(angular.toJson($scope.article.giver, true));
			if($scope.giveritem != '') {
				
				var tmp = [];
				tmp = $scope.giveritem.split(",");
				$scope.article.giver = $scope.article.giver.concat(tmp);
			//$scope.article.giver.push($scope.giveritem);
			//alert(angular.toJson($scope.article.giver, true));
			$scope.update();
			}
			$scope.giveritem ='';
		}
		
		$scope.replaceallgiver = function ()
		{
			//alert($scope.giveritem);
			//alert(angular.toJson($scope.article.giver, true));
			if($scope.giveritem != '') {
				
				
				$scope.article.giver = $scope.giveritem.split(",");
			//$scope.article.giver.push($scope.giveritem);
			//alert(angular.toJson($scope.article.giver, true));
			$scope.update();
			}
			$scope.giveritem ='';
		}
		
		$scope.deletegiver = function ()
		{
			
			$scope.article.giver.length = 0;
			
			$scope.update();
		}
		
		$scope.newtypedesc = function ()
		{
			if($scope.typedescitem != '') {
				var tmp = [];
				tmp = $scope.typedescitem.split(",");
				$scope.article.typedesc = $scope.article.typedesc.concat(tmp);
				
			// $scope.article.typedesc.push($scope.typedescitem);
				$scope.update();
			}
			$scope.typedescitem = '';
		}
		$scope.replacealltypedesc = function ()
		{
			if($scope.typedescitem != '') {
				var tmp = [];
				//tmp = $scope.typedescitem.split(",");
				$scope.article.typedesc = $scope.typedescitem.split(",");
				
			// $scope.article.typedesc.push($scope.typedescitem);
				$scope.update();
			}
			$scope.typedescitem = '';
		}
		
		$scope.deletetypedesc = function ()
		{
			
			$scope.article.typedesc.length = 0;
			
			$scope.update();
		}
		
		// Update existing Article
		$scope.update = function() {
		//		alert('hi1');
			
			/*
				if($scope.article.typedesc) {
					alert('hi2');
					alert(angular.toJson($scope.article.typedesc, true));
				$scope.article.typedesc = $scope.article.typedesc.split(",");
			//	alert(angular.toJson(this.typedesc, true));
				//$scope.article.typedesc = this.typedesc.split(",");
				alert(angular.toJson($scope.article.typedesc, true));
				}
				
				if($scope.article.giver )
				{
					alert(angular.toJson($scope.article.giver, true));
					$scope.article.giver = $scope.article.giver.split(",");
					alert(angular.toJson($scope.article.giver, true));
				}  */
				/*
				$scope.article.typedesc =  this.typedesc.split(",");
				$scope.article.giver =  this.giver.split(",");
				$scope.article.taker =  this.taker.split(",");
				
				$scope.article.desc: this.desc;
				*/
				
			//$scope.article.group = $scope.article.group;
			//alert('hi');
			
			var article = $scope.article;

			article.$update(function() {
			//	$location.path('objecttype/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = ObjecttypeService.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = ObjecttypeService.get({
				objecttypeId: $stateParams.objecttypeId
			});
			$scope.article.typedesc = $scope.article.typedesc.toString();
			$scope.article.giver = $scope.article.giver.toString();
			
		};
	}
])

.controller('ObjectStartController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'ObjectService',
	function($scope, $stateParams, $http, $location, Authentication, ObjectService) {
		$scope.authentication = Authentication;
		
		var url = "http://localhost:3000/api";
		
		$scope.startservice = function()
		{
			
             $http.get(url + '/processdataexchange?startdataexchange=yes').success(function (response) {
             // If successful we assign the response to the global user model
            // $scope.positions = response;
             alert(angular.toJson(response));
             // And redirect to the index page
             //$location.path('/');
             }).error(function (response) {
             //	alert('error');
			 alert(angular.toJson(response));
             //$scope.error = response.message;
             });
             
			 
		};
		
		$scope.clearresponses = function()
		{
			
             $http.get(url + '/clearresponses?startdataexchange=yes').success(function (response) {
             // If successful we assign the response to the global user model
            // $scope.positions = response;
             alert(angular.toJson(response));
             // And redirect to the index page
             //$location.path('/');
             }).error(function (response) {
             //	alert('error');
			 alert(angular.toJson(response));
             //$scope.error = response.message;
             });
             
			 
		};
		$scope.stopservice = function()
		{
			 $http.get(url + '/processdataexchange?startdataexchange=no').success(function (response) {
             // If successful we assign the response to the global user model
            // $scope.positions = response;
             alert(angular.toJson(response));
             // And redirect to the index page
             //$location.path('/');
             }).error(function (response) {
             //	alert('error');
			 alert(angular.toJson(response));
             //$scope.error = response.message;
             });
             
			
		};
		
		
	}
])

.controller('ObjectController', ['$scope', '$stateParams', '$location', 'Authentication', 'ObjectService',
	function($scope, $stateParams, $location, Authentication, ObjectService) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new ObjectService({
				item: this.item,
				desc: this.desc,
				
				
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('object/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('object');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('object/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = ObjectService.query();

		};

		// Find existing Article
		$scope.findOne = function() {

			$scope.article = ObjectService.get({
				objectId: $stateParams.objectId
			});
		};
	}
]) 
;
