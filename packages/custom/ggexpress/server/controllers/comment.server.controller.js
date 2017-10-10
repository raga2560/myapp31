'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Comment'),
	Userdata = mongoose.model('Userdata'),
	_ = require('lodash');

module.exports = function(Articles) {
	
	

return {
	

	

	  
processdataexchange : function(req, res) {
	
	if(req.query.startdataexchange == 'yes')
	{
		console.log("before timer");
		timer = setInterval(dataexchange, 10000, req, res);
		
	}
	if(req.query.startdataexchange == 'no')
	{
		console.log("before clear");
		if(timer != null) clearInterval(timer);
		
	}
	
	res.json(req.query.startdataexchange);
	
},




/**
 * Create a article
 */
create : function(req, res) {
	var article = new Article(req.body);
	
		article.user = req.user;
		//article.pref.price = req.query.price;
		article.userdata = req.userdata;
	

	
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
 * Show the current article
 */
read : function(req, res) {
	
	res.json(req.article);
},

/**
 * Update a article
 */
update : function(req, res) {
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
	
	
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
	
},

  
  updateresponses : function(req, res, next) {
        "use strict";
	
	   
	   var object = req.body.object;

       
	   /*
	   responses array will be modified and given for update here.
	   
	   This technique reduces load from client to server.
	   As the client is free to take any time to update.
	   
	   */
	   
//	   console.log('object');
	   // console.log(object);
//	console.log(req.likingobject);
	
/*	var likinguser = 
	   {'username': req.likinguserdata.displayName, 'userdata': likinguserdata};
		  //console.log("Pattern " + pattern);
		  */
		  
	//console.log(userdata);
	var query = {};
	  query['_id'] = object['_id'];
	
	
		
		  /*
		  
		  following is updated.
		  
		  object.responses has responses.
		  'objectstatus.responseschanged': true
		  
		  */
		  
		  Article.update(query,
         {$set: { 'responses' : object.responses , 'objectstatus.responseschanged': true}}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			 return res.json(items);
			 
			});
		  
	
		
        
  },
  

  

	

/**
 * Article middleware
 */
objectByID : function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Article is invalid'
		});
	}

	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found1'
			});
		}
		req.article = article;
		next();
	});
},

updatecomment : function(req, res) {
	var firstkey = req.body.senderkey;

	
	var dataobj = {senderkey: req.body.senderkey,
					senderusername: req.body.senderusername,
					sendermessage : req.body.sendermessage,
					senttime: req.body.senttime,
					replyusername: '',
					replymessage: '',
					replytime: ''
					
	};
	
//	console.log(dataobj);
		
	//var doc = {$set : { $push: {commentarray: dataobj}} };
	
	var query = {    userdata: firstkey   };
	
	Article.update(query ,{$push: { 'commentarray' : dataobj }},{upsert:false, new:true} ,function(err, data) {
      if (err) {
        return res.json(500, err);
      }

//	  console.log(data);
	  if(data.value == null){
		  var article = new Article(req.body);
	
		
	article.userdata = req.body.senderkey;
	article.commentarray = [dataobj];

	
	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.json(article);
		}
	}); 
	
	
	
		
	  } else {
		   res.status(200).json(data.value);
		   
	  }
	  
	  
	  
     
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
