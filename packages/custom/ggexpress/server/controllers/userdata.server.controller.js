'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Userdata'),
	config = require('meanio').loadConfig(),
	 crypto = require('crypto'),
	 nodemailer = require('nodemailer'),
	  ses = require('nodemailer-ses-transport'),
	  templates = require('./emailtemplate'),
	_ = require('lodash');

	var bunyan = require('bunyan');
	
	var log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    
    {
      level: 'error',
      path: 'myapp-error.log'  // log ERROR and above to a file 
    }
  ]
   });
   
   log.level('info');
	
var mysupportedversion = "ABC123";
/**
 * Send reset password email
 */
function sendMail(mailOptions) {
	
	/*
var transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAIKVWGN5MTLNLLCOQ',
    secretAccessKey: 'AWS/AvMLkNUH/wglvmexxx6V4Je1dADF0Dzdg0L59u+SNB0e'
}));

transporter.sendMail(mailOptions, function(err, response) {
        if (err) return err;
		console.log(response);
        return response;
    });
	*/
	
	/*
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
		console.log(response);
        return response;
    });
	*/
	/*
	var transport = nodemailer.createTransport("SES",{
    accessKeyId: 'AKIAIKVWGN5MTLNLLCOQ',
    secretAccessKey: 'AWS/AvMLkNUH/wglvmexxx6V4Je1dADF0Dzdg0L59u+SNB0e'
}
	
	);
	*/
	
	/*
	var transport = nodemailer.createTransport("SES", ses({
    accessKeyId: 'AKIAIKVWGN5MTLNLLCOQ',
    secretAccessKey: 'AWS/AvMLkNUH/wglvmexxx6V4Je1dADF0Dzdg0L59u+SNB0e'
}));

*/

var transport = nodemailer.createTransport("SMTP", {
  //  service: 'SES', // Gmail, SMTP
	host: "email-smtp.us-east-1.amazonaws.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
      user: 'AKIAIKVWGN5MTLNLLCOQ',
      pass: 'AvMLkNUH/wglvmexxx6V4Je1dADF0Dzdg0L59u+SNB0e'
    }
  });

  
  /*
  var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail', // Gmail, SMTP
    auth: {
      user: 'raga2560@gmail.com',
      pass: 'obama4india'
    }
  });
*/
  
    transport.sendMail(mailOptions, function(err, response) {
		console.log("inside send mail");
        if (err) {
			console.log(err);
			return err;
		}
//		console.log(response);
        return response;
    });
	
}

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex').toUpperCase() // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}


function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

// var value1 = randomValueBase64(12) // value 'wNm2OQu7UaTB'


var validatearray = [];

module.exports = function(Articles) {

return {
	
validateemail : function(req, res) {
	var email = req.body.email;
	var validationid = '';
	var response = {
		validationid:'',
		email: ''
	};
	
	var mailOptions = {
                        to: email,
                        From: '"Ramesh" <raga2560@yahoo.com>'
						
                    };
					
				validationid =	randomValueHex(5);
                    mailOptions = templates.validate_email(email, validationid,  mailOptions);
                    sendMail(mailOptions);
				
					response.email = email;
					response.validationid = validationid;
		/*			validdata.email = email;
					validdata.refid = response.refid;
					validdata.expired = false;
					
					validatearray.push(response);
	*/
                    res.json(response);
},	
getversion: function(req, res) {
	var temp ={
			
			supportedapp: mysupportedversion
	};
		res.json(temp);
 },
 
/**
 * Create a article
 */
 
create : function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	//article.deviceuuid = req.uuid;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var temp ={
			userid: article._id,
			username : req.user.username,
			supportedapp: mysupportedversion
			
		};
		
			res.json(temp);
		}
	});
},

userdataslocationset: function(req, res, next) {
        "use strict";
	
	   
		
    var query = {};
	//  query['_id'] = userdata['_id'];
	  query['_id'] = req.userdata._id;  
	  var locdata = [req.body.latitude, req.body.longitude];
	  var address = {city:req.body.city, state:req.body.state, country:req.body.country, pin_code: req.body.postal_code, place:req.body.place};
	  //console.log(locdata);
	  //console.log(address);
			  Article.update(query,
         {$set: { 'loc' : locdata ,'address':address }},{upsert:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(err);

			
	//		console.log (items);
            

			//req.likinguser = req.userdata;
			 return res.json(items);
			 
			});

			
},	
subscriberupdate : function(req, res, next) {
        "use strict";
	
	   
	   var item = req.body.item;
	   var likedtime = req.body.likedtime;

       var userdata = req.userdata;
		  //console.log("Pattern " + pattern);
		  
		  if(typeof item == 'undefined')
		  {
			  return  res.json(null);
		  }
	// console.log(userdata);
	var query = {};
	//  query['_id'] = userdata['_id'];
	  query['_id'] = userdata._id;   // This user has clicked
	
		var subscribedata ={};           //To this object
			subscribedata.object_id = item._id;
			subscribedata.created = item.created;
			subscribedata.loc = item.loc;
			subscribedata.price = item.price;
			subscribedata.likedtime = likedtime;
			subscribedata.responsemsg = '';
			subscribedata.responsetime = '';
			subscribedata.objectdesc = item.objectdesc;
			subscribedata.objectdetails = item.objectdetails;
			subscribedata.unique_id = randomValueBase64(20);
			
			 
			
		/*
		When ever a person likes objects displayed in map, he clicks on the objects and
		expresses interest.
		
		In the users (userdata structure, subscribe field), we note down all the he has liked.
		
		In the objects (responses field), we note down name of users who liked the objects.
		*/		
		  
		  Article.update(query,
         {$push: { 'subscribe' : subscribedata }},{upsert:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

	//		console.log("inside subscriberupdate");
	//		console.log (items);
    //        console.log("Found " + items.length + " posts");

			//req.likinguser = req.userdata;
			req.likinguserdata = req.userdata;
			req.likingobject = subscribedata;
			req.likedtime = likedtime;
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
		/*
		if subscribed=thisuser,
		then we get data like this
		
		{"unique_id":"56261e6b6ef90d1816dc46fc561a29b188512a5c4aac34bf1445338757020","objectdetails":"junk reuse","objectdesc":"junk reuse","responsetime":1445499352858,
		"responsemsg":"i like your junksssssssgsgs","likedtime":1445338757020,"loc":[12.952274899999999,77.6438852],"created":"2015-10-20T10:58:51.207Z",
		 "object_id":"56261e6b6ef90d1816dc46fc"}
		
		In this, records of only loggedin user is returned.
		userid is obtained from login session. (quite safe)
		
		All data is safe. Nothing to encrypt
		
		*/
	
	// console.log(req.query.subscribed)	;
	Article.findOne({'user': req.user}).sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
	//		console.log(articles);
	//		log.info(articles);
	//		log.error(articles.subscribe);
	       res.json(articles.subscribe.length > 20 ? articles.subscribe.slice(-20) : articles.subscribe);
			// res.json(articles.subscribe);
		}
	});
	
	} else {
	/*
	This was used for testing. In this all objects were returned.
	*/
	
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

	console.log("user");
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
		req.userdata.address = article.address;
		
	//	console.log(article);
		next();
	});
},
readuserdata : function(req, res) {
	// var article = new Article(req.body);
	// article.user = req.user;
	// console.log(req.user);

	Article.findOne({user:req.user}, {'_id':1}).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found'
			});
		}
		
		var temp ={
			userid: article._id,
			username : req.user.username,
			supportedapp: mysupportedversion
			
		};
		res.json(temp);
		
		
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
