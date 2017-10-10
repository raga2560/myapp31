'use strict';
/*
var fs = require('fs-extra');
var path = require('path');
var crypto = require('crypto');
*/
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Userdata'),
	config = require('meanio').loadConfig(),
	_ = require('lodash');

module.exports = function(Articles) {

return {
	
/**
 * Create a article
 */
create : function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},


uploadImage : function(req, res){
    var destPath = path.join(__dirname, "../images/");
    //var originalFilename = req.files.file.originalFilename;
	res.json(req);
	/*
    var hashName = crypto.createHash('md5').update(originalFilename).digest('hex') + ".jpeg"; 
    var writeStream = req.files.file.ws;

   //if the file already exists in the path, then create a random file name from hashName.
  while (fs.existsSync(destPath+hashName)) {
    hashName = hashName.substring(0, hashName.length - 5);
     var rnd = crypto.randomBytes(3),
        value = new Array(3),
        len = hashName.length;
    for (var i = 0; i < 3; i++) {
        value[i] = hashName[rnd[i] % len];
      };
      hashName = hashName + value.join('') + ".jpeg";
    }
 fs.copy(writeStream.path, destPath+hashName, function (err) {
      if (err) return res.send(err);
      fs.chmodSync(destPath+hashName, '755'); //there is probably a better solution, I have to change the permission to access the file from public images directory 
	  uploadedimage = destPath+hashName ;
      fs.remove(writeStream.path, function(err){
        if (err) return res.error(err);
      });
	  
	  //var data = {path : "http://localhost:8888/images/" + hashName};
	  var data = {path : "/images/" + hashName};
	   return res.json(data);
    });
	
*/	
  
},



subscriberupdate : function(req, res, next) {
        "use strict";
	
	   
	   var item = req.body.item;

       var userdata = req.userdata;
		  //console.log("Pattern " + pattern);
		  
	console.log(userdata);
	var query = {};
	//  query['_id'] = userdata['_id'];
	  query['_id'] = userdata._id;   // This user has clicked
	
		var subscribedata ={};           //To this object
			subscribedata.object_id = item._id;
			subscribedata.created = item.created;
			subscribedata.loc = item.loc;
			subscribedata.price = item.price;
			subscribedata.objectdesc = item.objectdesc;
			subscribedata.objectdetails = item.objectdetails;
			
			
		  
		  Article.update(query,
         {$push: { 'subscribe' : subscribedata }},{upsert:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

			console.log (items);
            console.log("Found " + items.length + " posts");

			//req.likinguser = req.userdata;
			req.likinguserdata = req.userdata;
			req.likingobject = subscribedata;
			next();
			 //return res.json(items);
			 
			});
		  
	
		
        
  },
  
/**
 * Show the current article
 */
read :function(req, res) {
	res.json(req.article);
},

/**
 * Update a article
 */
update :function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},

/**
 * Delete an article
 */
delete : function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},

/**
 * List of Articles
 */
list : function(req, res) {
	//res.send('Anyone can access this');
	
	if(req.query.subscribed != null)
	{
	console.log(req.query.subscribed)	;
	Article.findOne({'user': req.user}).sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(articles);
			res.json(articles.subscribe);
		}
	});
	
	} else {
	
	
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	}); 
	}
},

/**
 * Article middleware
 */
userdataByuser : function(req, res, next) {

	var user = req.user;

//	console.log("user");
//	console.log(user);
    
	Article.findOne( { 'user' : user }).populate('user', 'username').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found'
			});
		}
		//console.log("dumping userdata");
		//console.log(article);
		req.userdata = {};
		req.userdata._id = article._id;
		req.userdata.username = article.user.username;
		
		console.log(article);
		next();
	});
},

userdataByID : function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Article is invalid'
		});
	}
   
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found'
			});
		}
		req.article = article;
		next();
	});
},

/**
 * Article authorization middleware
 */
hasAuthorization : function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
}

};

}
