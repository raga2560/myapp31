'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Ggexpress = new Module('ggexpress');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Ggexpress.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Ggexpress.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  /* Ggexpress.menus.add({
    title: 'ggexpress example page',
    link: 'ggexpress example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  */
   var test1 = require('./server/controllers/dataexchangetemplate');
   
   test1.mytest();
  
  Ggexpress.aggregateAsset('css', 'ggexpress.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Ggexpress.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Ggexpress.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Ggexpress.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Ggexpress;
});
