'use strict';

angular.module('mean.ggexpress').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('ggexpress example page', {
      url: '/ggexpress/example',
      templateUrl: 'ggexpress/views/index.html'
    })
	
.state('dispose', {
      url: '/dispose',
      templateUrl: 'ggexpress/views/index.html'
    })
	.state('dispose.objecttype', {
            url: "/objecttype",
			views: {
                "view21": {
                    
					templateUrl: "ggexpress/views/objecttype_create.html",
					 controller: 'ObjecttypeController'
					 
					
                }
			 }
			
            
        })
		.state('dispose.objecttypelist', {
            url: "/objecttypelist",
			views: {
                "view21": {
                    
					templateUrl: "ggexpress/views/list-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                }
			 }
			
            
        })
		.state('dispose.deleteobjecttype', {
            url: "/objecttype/:objecttypeId/delete",
			views: {
                "view22": {
                    
					templateUrl: "ggexpress/views/delete-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                },
				 "view21": {
                    
					templateUrl: "ggexpress/views/list-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                }
			 }
			
            
        })
		
		.state('dispose.viewobjecttype', {
            url: "/objecttype/:objecttypeId",
			views: {
                "view21": {
                    
					templateUrl: "ggexpress/views/view-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                }
			 }
			
            
        })
		.state('dispose.startobjectservice', {
            url: "/processdataexchange",
			views: {
                "view21": {
                    
					templateUrl: "ggexpress/views/view-objectstart.view.html",
					 controller: 'ObjectStartController'
					 
					
                }
			 }
			
            
        })
		.state('dispose.editobjecttype', {
            url: "/objecttype/:objecttypeId/edit",
			views: {
                "view22": {
                    
					templateUrl: "ggexpress/views/edit-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                },
				 "view21": {
                    
					templateUrl: "ggexpress/views/list-objecttype.client.view.html",
					 controller: 'ObjecttypeController'
					 
					
                }
			 }
			
            
        })
		
	
	
	;
  }
]) 
;
