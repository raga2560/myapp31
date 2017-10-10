/* globals require */
'use strict';

/**
 * Module dependencies.
 */
var mean = require('meanio'),
  compression = require('compression'),
  morgan = require('morgan'),
  consolidate = require('consolidate'),
  express = require('express'),
  
  helpers = require('view-helpers'),
  flash = require('connect-flash'),
  modRewrite = require('connect-modrewrite'),
  // seo = require('mean-seo'),
  config = mean.loadConfig();

module.exports = function(app, db) {

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;
 



  // cache=memory or swig dies in NODE_ENV=production
  app.locals.cache = 'memory';

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  app.use(compression({
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    level: 9
  }));

  // Enable compression on bower_components
  app.use('/bower_components', express.static(config.root + '/bower_components'));

  // Adds logging based on logging config in config/env/ entry
  require('./middlewares/logging')(app, config.logging);

  // assign the template engine to .html files
  app.engine('html', consolidate[config.templateEngine]);

  // set .html as the default extension
  app.set('view engine', 'html');

    app.use('/goGreen',express.static(__dirname + '/goGreen/www'));
	app.use('/disposer',express.static(__dirname + '/disposer/www'));
	app.use('/imagetest',express.static(__dirname + '/imagetest/www'));
	app.use('/videotest',express.static(__dirname + '/videotest/www'));
	app.use('/downloadtest',express.static(__dirname + '/downloadtest/www'));
	app.use('/pacificbarber',express.static(__dirname + '/pacificbarber/www'));
	app.use('/511',express.static(__dirname + '/The511ForLA/www'));
	app.use('/511new',express.static(__dirname + '/The511ForLA/wwwnew'));
	app.use('/ionicmaterial',express.static(__dirname + '/Ionic-Material-master/demo/www'));
	app.use('/ionicmaterial_docs1',express.static(__dirname + '/Ionic-Material-master/docs/docs.html'));
	app.use('/ionicmaterial_docs2',express.static(__dirname + '/Ionic-Material-master/docs/codepen-template.html'));
	app.use('/bitpay',express.static(__dirname + '/bitpay_cordova_sdk_sample/www'));
	
	app.use('/disposeropenshift',express.static(__dirname + '/disposer-openshift/www'));
	app.use('/CustomSass',express.static(__dirname + '/CustomSass/www'));
	
	console.log(__dirname);
  
  
  // Dynamic helpers
  app.use(helpers(config.app.name));

  // Connect flash for flash messages
  app.use(flash());

  app.use(modRewrite([
    
    '!^/api/.*|\\_getModules|\\.html|\\.js|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.ico|\\.gif|\\.svg|\\.eot|\\.ttf|\\.woff|\\.pdf$ / [L]'    

  ]));

  // app.use(seo());
};
