'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Measure'),
	Userdata = mongoose.model('Userdata'),
	_ = require('lodash');

module.exports = function(Articles) {
	
	var loopstarted = false;
	var timer ;
	var currentload ;
var setloadlimit =10;

  function  abcd (a)
	{
		console.log("abcd called:" + a);
	}
	
	function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
	}
	//var ary = ['three', 'seven', 'eleven'];
	

	function insertrecord(currload)
	{
		 //var article = new Article();
	
	var d = Date.now();
	 var loaddata = {
		 datestring: d,
		 currentload: currload
	 };
	 var query = {};
	  query['datestring'] = (new Date(d)).toLocaleDateString('en-US');
	  
	//	article.currentload  = currload;
	// toLocaleDateString('en-US')
	
	 Article.update(query,
         {$push: { 'loadarray' : loaddata }},{upsert:true}, function(err, items) { 
		 "use strict";

//            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

//			 return res.json(items);
			 
			});
			
			
	
	}


return {
	

getmessage : function(req, res) {
	
	var message = {
		messagedata:''
	};
	
	
	
	if(currentload > setloadlimit)
	{
		message.messagedata = "Server highly loaded. Please try after some time.";
		
	} 
	else
	{
		message.messagedata = "Normal.";
	}
	
	
	res.json(message);
	
},


	  
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

logmeasurement :function(req, res, next) {
	
	var measure = req.measure;
	// console.log(measure);
	if(measure.storedata == 'yes')
	{
	//	console.log('storedata');
		currentload = measure.currentload;
		insertrecord(currentload);
	}
	if(currentload > setloadlimit)
	{
		req.overload = 'yes';
	}
	else {
		req.overload = 'no';
	}
	
	
	next();
	
	
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

likinguserupdate : function(req, res, next) {
        "use strict";
	
	   
	   // var item = req.body.item;

       var likedata = {};
	   likedata.likinguserdata = req.likinguserdata;
	   likedata.likedtime = req.likedtime;
	   likedata.replied = false;
	   likedata.responsemsg = '';
	   likedata.responsetime = '';
	   likedata.object_id = req.likingobject['object_id'];
	   likedata.user_id = req.likinguserdata._id;
	   likedata.unique_id = req.likingobject['unique_id'];
	   
	   
//	   console.log('likinguserdata');
//	   console.log(likedata.likinguserdata);
//	console.log(req.likingobject);
	
/*	var likinguser = 
	   {'username': req.likinguserdata.displayName, 'userdata': likinguserdata};
		  //console.log("Pattern " + pattern);
		  */
		  
	//console.log(userdata);
	var query = {};
	  query['_id'] = req.likingobject['object_id'];
	
	
		
		  
		  
		  Article.update(query,
         {$push: { 'responses' : likedata }},{upsert:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			 return res.json(items);
			 
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
//	   console.log(object);
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
 * List of Near disposers
 */
 
 /*
 firstkey =key1 
 firstkey =key2
 secondkey = key1
 secondkey = key2
 
 uniquekey1 = (key1,key2)
 uniquekey2 = (key2,key1)
 
 a1 = [key1, key2]
 record ( key1mykeys[])
 */
 
getrecord2key : function(req, res) {
	var firstkey = req.firstkey;
	var secondkey = req.secondkey;
	
	if(typeof firstkey == 'undefined' || typeof secondkey == 'undefined')
	{
			return res.json(null);
	}
	if(firstkey == secondkey){
		return res.json(null);
	}
	
    // find a location
    Article.findOne({
      mykeys: {$all: [firstkey, secondkey]}
    }, {'_id':1}).exec(function(err, data) {
      if (err) {
        return res.json(500, err);
      }

      res.status(200).json(data);
    });
	
	
},

/*
only this user can see his records

*/
getrecords1key : function(req, res) {
	/*
	[{"_id":"5651e4619333834c2082d7ee","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4",
	"seconduserdata":"561a29b188512a5c4aac34bf","__v":0,"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},
	{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"},{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],
	"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"created":"2015-11-24T18:08:01.391Z"},
	{"_id":"5651e47a9333834c2082d7ef","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
	"exchanges":[],"mykeys":["561a29b188512a5c4aac34bf","561a29b188512a5c4aac34bf"],"created":"2015-11-24T18:08:01.392Z"},
	{"_id":"5651efcccf86f3fc2dab695d","firstuser":"raju4","firstuserdata":"561a29b188512a5c4aac34bf","__v":0,
	"exchanges":[{"message":"test1","firstkey":"561a29b188512a5c4aac34bf"}],"mykeys":[null,"561a29b188512a5c4aac34bf"],"created":"2015-11-24T18:08:01.393Z"}]
	*/
	
	/*
	
	[{"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
	"exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"}],"mykeys":["561a29b188512a5c4aac34bf","5617d5853ef6fd142e1e9707"],"created":"2015-11-24T18:22:16.031Z"}]
	
	[{"_id":"5654aad8e135b95836e7c230","firstuser":"raju3","firstuserdata":"5617d5853ef6fd142e1e9707","seconduser":"raju4","seconduserdata":"561a29b188512a5c4aac34bf","__v":0,
	"exchanges":[{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"},{"message":"test1","firstkey":"5617d5853ef6fd142e1e9707"}],
	"mykeys":["561a29b188512a5c4aac34bf","5617d5853ef6fd142e1e9707"],"created":"2015-11-24T18:22:16.031Z"}]
	
	
	*/
	var onekey = req.body.userid;
	var limit = 20;
	
	Article.find({
      mykeys: {$in: [onekey]}
    }).sort('-created').limit(limit).exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
	
},



/*
Both user can update this record
*/

updaterecord2key : function(req, res) {
	var firstkey = req.body.firstuserdata;
	var secondkey = req.body.seconduserdata;
	
	var dataobj = {owneruser: req.body.owneruser,
					owneruserid : req.body.owneruserid,
					objectdesc: req.body.objectdesc,
					objectdetails : req.body.objectdetails,
					responsemsg: req.body.responsemsg,
					likeduser : req.body.likeduser,
					likeduserid : req.body.likeduserid
	};
	if(typeof firstkey == 'undefined' || typeof secondkey == 'undefined')
	{
			return res.json(null);
	}
	if(firstkey == secondkey){
		return res.json(null);
	}
		
	var doc = {$set : {mykeys: [secondkey,firstkey]}, $push: {itemdetails: dataobj}} ;
	
	var query = {    mykeys: {$all: [firstkey, secondkey]}   };
	
	Article.findAndModify(query ,[],doc, {upsert: false} ,function(err, data) {
      if (err) {
        return res.json(500, err);
      }

//	  console.log(data);
	  if(data.value == null){
		  var article = new Article(req.body);
	
		
	article.mykeys = [req.body.firstuserdata, req.body.seconduserdata];
	article.itemdetails = [dataobj];
	
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
		   res.status(200).json(data);
		   
	  }
	  
	  
	  
     
    });
	
	
	
},


updateinteractrecord2key : function(req, res) {
	var firstkey = req.body.firstuserdata;
	var secondkey = req.body.seconduserdata;
	
	var dataobj = {senderkey: req.body.senderkey,
					senderusername: req.body.senderusername,
					sendermessage : req.body.sendermessage
					
	};

	if(typeof firstkey == 'undefined' || typeof secondkey == 'undefined')
	{
			return res.json(null);
	}
	if(firstkey == secondkey){
		return res.json(null);
	}
	
//	console.log(dataobj);
		
	var doc = {$set : {mykeys: [secondkey,firstkey]}, $push: {exchanges: dataobj}} ;
	
	var query = {    mykeys: {$all: [firstkey, secondkey]}   };
	
	Article.findAndModify(query ,[],doc, {upsert: false, new:true } ,function(err, data) {
      if (err) {
        return res.json(500, err);
      }

//	  console.log(data);
	  if(data.value == null){
		  var article = new Article(req.body);
	
		
	article.mykeys = [req.body.firstuserdata, req.body.seconduserdata];
	article.exchanges = [dataobj];
	
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

/*
db.people.findAndModify({
    query: { name: "Andy" },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } },
    upsert: true
})

*/


	

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
