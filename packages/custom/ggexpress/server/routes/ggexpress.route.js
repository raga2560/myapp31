'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
/*
module.exports = function(Ggexpress, app, auth, database) {

  app.get('/api/ggexpress/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/ggexpress/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/ggexpress/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/ggexpress/example/render', function(req, res, next) {
    Ggexpress.render('index', {
      package: 'ggexpress'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};

*/


'use strict';

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.article.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  } 
  next();
};

var hasPermissions = function(req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
      var permission = req.body.permissions[i];
      if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        };
    };

    next();
};
var measuredata = {
		currentload:0,
		storedata :'no',
		date: ''
	};
var stat ={
	starttime:0,
	endtime:0
};
var startmeasurement = true;
var stopmeasurement = false;
var measurement = function(req, res, next) {
/*
1 hour
10 min
60min = 1 hour
once in 10 min measure for 1 min.


*/
	// console.log('in measurement function');
	measuredata.storedata = 'no';
	if(startmeasurement == true && stat.starttime == 0){
	stat.starttime = Date.now()	;
	measuredata.currentload = 0;
	measuredata.date = stat.starttime;
	// console.log('in measurement function-1');
	}
    
	stat.timetaken = Date.now() - stat.starttime;
	// console.log(stat.timetaken);
	if(stat.timetaken > 0 && stat.timetaken <20000) // 20 sec * 1000
	{
		
		
		measuredata.currentload ++;
	//	console.log('in measurement function-2');
		
	}
	if(stopmeasurement == false && stat.timetaken >20000)
	{
		stopmeasurement = true;
		measuredata.storedata = 'yes';
//		console.log('in measurement function-3');
	}
	
	if(stat.timetaken > 600000 ) // 10 min 600000 1000*60sec*10
	{
		
		startmeasurement = true;
		stat.starttime = 0;
//		console.log('in measurement function-4');
		
	}
	
	 
	 
	
    req.measure = measuredata;

    next();
};

module.exports = function(Article3s, app, auth) {
  
 // var articles = require('../controllers/article3s.controller')(Article3s);
 var upload = require('../controllers/upload.server.controller')(Article3s);
  var userdata = require('../controllers/userdata.server.controller')(Article3s);
  //var disposetype = require('../controllers/disposetype.server.controller') (Article3s);
 // var disposeable = require('../controllers/disposeable.server.controller')(Article3s);
  var object = require('../controllers/objects.server.controller')(Article3s);
  var objecttype = require('../controllers/objecttype.server.controller') (Article3s);
  var messageexchange = require('../controllers/msgexchange.server.controller') (Article3s);
  var comment = require('../controllers/comment.server.controller') (Article3s);
  var home = require('../controllers/home.server.controller') (Article3s);
  var measure = require('../controllers/measure.server.controller') (Article3s);
  
  /*
  app.route('/api/article3s')
    .get(articles.all)
    .post(auth.requiresLogin, hasPermissions, articles.create);
  app.route('/api/article3s/:article3Id')
    .get(auth.isMongoId, articles.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, hasPermissions, articles.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.destroy);

  // Finish with setting up the articleId param
  app.param('article3Id', articles.article);
  */
  
//var userdata = require('../controllers/userdata.server.controller')(Article3s);

	app.route('*')
		.get(measurement,  measure.logmeasurement)
		.post(measurement,  measure.logmeasurement);

	app.route('/api/measure/getmessage')
		.post(measure.getmessage);
	
    app.route('/api/messageexchange/getrecords')
		.post(auth.requiresLogin, messageexchange.getrecords1key);
		
	app.route('/api/messageexchange/sendmessage')
			.post(auth.requiresLogin,  messageexchange.updaterecord2key);
			
	app.route('/api/messageexchange/deleterecord2key')
			.post(auth.requiresLogin,  messageexchange.deleterecord2key);
	
	app.route('/api/messageexchange/sendinteractionmessage')
			.post(auth.requiresLogin,  messageexchange.updateinteractrecord2key);
			
	app.route('/api/comment/sendmessage')
			.post(auth.requiresLogin,  comment.updatecomment);
	
	
		
	app.route('/api/upload/uploadImage')
			.post(auth.requiresLogin,  upload.uploadImage);
			
	
	// Article Routes
	app.route('/api/userdatas')
		.get(auth.requiresLogin, userdata.list)
		.post(auth.requiresLogin, userdata.create);
		
	app.route('/api/getversion')
		.get( userdata.getversion);

	app.route('/api/userdatascreate')
		.post(auth.requiresLogin, userdata.create);
	app.route('/api/userdataslocationset')
			.post(auth.requiresLogin, userdata.userdataByuser, userdata.userdataslocationset);
		
	app.route('/api/userdatasread')
		.get(auth.requiresLogin, userdata.readuserdata);

	app.route('/api/validateemail')
		.post(userdata.validateemail);
  		
	app.route('/api/userdatas/subscriberupdate')
			.post(auth.requiresLogin, userdata.userdataByuser, userdata.subscriberupdate, object.likinguserupdate);

	app.route('/api/userdatas/:userdataId')
		.get(auth.isMongoId, userdata.read)
		.put(auth.isMongoId, auth.requiresLogin, userdata.hasAuthorization, userdata.update)
		.delete(auth.isMongoId, auth.requiresLogin, userdata.hasAuthorization, userdata.delete);

	// Finish by binding the article middleware
	app.param('userdataId', userdata.userdataByID);
	
	/*	
		
		
//var disposetype = require('../controllers/disposetype.server.controller') (Article3s);
	app.route('/api/disposetype')
		.get(disposetype.list)
		.post(auth.requiresLogin, disposetype.create);

	app.route('/api/disposetype/mobile/search/:str')
		.get(disposetype.disposetypesearch);
    
	app.route('/api/disposetype/:disposetypeId')
		.get(auth.isMongoId, disposetype.read)
		.put(auth.isMongoId, auth.requiresLogin, disposetype.hasAuthorization, disposetype.update)
		.delete(auth.isMongoId, auth.requiresLogin, disposetype.hasAuthorization, disposetype.delete);

	// Finish by binding the article middleware
	app.param('disposetypeId', disposetype.disposetypeByID);
	
//var disposeable = require('../controllers/disposeable.server.controller')(Article3s);

	app.route('/api/disposeable')
		.get(disposeable.list)
			
	.post(auth.requiresLogin, disposeable.create);

	app.route('/api/disposeable/mapdisposeablers')
		.get(disposeable.list);

    app.route('/api/disposeable/near')
		.get(disposeable.near);
		
	app.route('/api/disposeable/:disposeableId')
		.get(disposeable.read)
		.put(auth.isMongoId, auth.requiresLogin, disposeable.hasAuthorization, disposeable.update)
		.delete(auth.isMongoId,auth.requiresLogin, disposeable.hasAuthorization, disposeable.delete);

	// Finish by binding the article middleware
	app.param('disposeableId', disposeable.disposeableByID);
	
*/


//var object = require('../controllers/objects.server.controller')(Article3s);
	app.route('/api/home/gethomemessage')
			.post( home.gethomemessage);
			
	app.route('/api/home/insertmessage_homepage')
		.post(auth.requiresLogin,  home.insertmessage_homepage);
	app.route('/api/home/clearmessage_homepage')
		.post(auth.requiresLogin,  home.clearmessage_homepage);
	
	

	app.route('/api/object')
		.get(auth.requiresLogin, object.list) 
		.post(auth.requiresLogin, userdata.userdataByuser, object.create);
	
	app.route('/api/object/mapobjectrs')
		.get(object.list);

    app.route('/api/object/near')
		.get(object.near);
		
	app.route('/api/object/:objectId')
		.get(object.read)
		.put(auth.isMongoId, auth.requiresLogin, object.hasAuthorization, object.update)
		.delete(auth.isMongoId,auth.requiresLogin, object.hasAuthorization, object.delete);
		
	app.route('/api/object/updateresponses')
			.post(auth.requiresLogin,  object.updateresponses);
			
	
	

	app.route('/api/object/deleteobject')
			.post(auth.requiresLogin,  object.deleteobject);

			
	app.route('/api/processdataexchange')
			.get(  object.processdataexchange);
	app.route('/api/clearresponses')
			.get(  object.clearresponses);

	// Finish by binding the article middleware
	app.param('objectId', object.objectByID);


//var objecttype = require('../controllers/objecttype.server.controller') (Article3s);
	app.route('/api/objecttype')
		.get(objecttype.list)
		.post(auth.requiresLogin, objecttype.create);

	app.route('/api/objecttype/mobile/search/:str')
		.get(objecttype.objecttypesearch);
    
	app.route('/api/objecttype/:objecttypeId')
		.get(auth.isMongoId, objecttype.read)
		.put(auth.isMongoId, auth.requiresLogin,  objecttype.update)
		.delete(auth.isMongoId, auth.requiresLogin, objecttype.hasAuthorization, objecttype.delete);

	// Finish by binding the article middleware
	app.param('objecttypeId', objecttype.objecttypeByID);

	
	
	
};

