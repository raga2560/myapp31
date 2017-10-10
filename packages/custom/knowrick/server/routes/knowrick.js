'use strict';

var SessionHandler = require('../controllers/session');



    
	
	
/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Knowrick, app, auth, database) {

  var sessionHandler = new SessionHandler(database);
  
  app.get('/api/knowrick/example/anyone', function(req, res, next) {
    res.send('Anyone can access this1');
  });

  app.get('/api/knowrick/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/knowrick/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });
  
  app.get('/api/knowrick/confappGetSession', sessionHandler.confappGetSession);

  app.get('/api/knowrick/example/render', function(req, res, next) {
    Knowrick.render('index', {
      package: 'knowrick'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
