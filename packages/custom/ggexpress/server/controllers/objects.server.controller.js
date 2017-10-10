'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Object'),
	Userdata = mongoose.model('Userdata'),
	_ = require('lodash');

module.exports = function(Articles) {
	
	var loopstarted = false;
	var timer ;

  function mytest() {
	  console.log("in mytest");
  }

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
	


	function readandupdate()
	{
	/*
	responses -> []
	
	userrequests <-
	*/
	var limit = 100;
	Article.find({
     'objectstatus.responseschanged': true
    }).limit(limit).exec(function(err, records) {
      if (err) {
        return res.json(500, err);
      }

      res.status(200).json(records);
    });
	
	
	
	
	
	/*
	read the objects, that has responses.
	-> arrange it for each user.
	-> update it with in users record 
	*/
	
		
	
	}
	


return {
	
 
clearresponses : function(req, res) {
	
	var query = {};
	
	Article.update(query,
         {$set: { 'responses' : [] , 'objectstatus.responseschanged': false}}, {multi: true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

	//		console.log (items);
    //        console.log("Found " + items.length + " posts");

			// return res.json(items);
			 
			});
			
	Userdata.update(query,
         {$set: { 'subscribe' : [] }}, {multi: true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			  return res.json(items);
			 
			});
			
},

	  
processdataexchange : function(req, res) {
	
	if( req.query.startdataexchange == 'yes')
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


processdataexchange1 : function(req, res) {
	
	var limit = 100;
	Article.find({
     'objectstatus.responseschanged': true
    }).limit(limit).exec(function(err, objectrecords) {
      if (err) {
        return res.json(500, err);
      }
	  
	  // Userdata
	  /*
	  1 object, many responses
	  in each responses , we get reply.
	  this reply to be updated in subscribers-> 
	  */
	  var listofuserids_toupdate = {};
	  
	  for (var i=0; i< objectrecords.length; i++) {
		  var responserecords = objectrecords[i].responses;
		     for (var j=0; j< responserecords.length; j++) 
			  {
				  var responserecord = responserecords[j];
	//			  console.log("in objects="+responserecord.unique_id);
				 // console.log(likedata);
				 var likinguser_id = responserecord.likinguserdata._id;
				   if(responserecord.replied == true) {
			  
					if(typeof listofuserids_toupdate[likinguser_id] == 'undefined'){
					// listofuserids_toupdate.push(likedata.user_id);
					listofuserids_toupdate[likinguser_id] = {};
					}
					var obj = {
					unique_id : responserecord.unique_id,
					responsemsg :responserecord.responsemsg,
					responsetime : responserecord.responsetime
					};
		//			 console.log("userid to update:"+likinguser_id +","+ responserecord.unique_id);
					listofuserids_toupdate[likinguser_id][responserecord.unique_id] = obj;
					};
				  
			  }
		 
		  
		 
		  
		 
	  }
	  //5622830d34501e782318d5705622828334501e782318d56f1445102377391
	  //560f9c607a78962c91f69ade5622828334501e782318d56f1445102330777
	  
	   var useridkeys = Object.keys(listofuserids_toupdate);
	   useridkeys = removeA(useridkeys, 'undefined');
	 //  res.status(200).json(keys);
	   
	   var query = {'_id': {$in: useridkeys }};
	   
	  Userdata.find(query).exec(function(err, userrecords) {
      if (err) {
		  
        return res.json(500, err);
      }
	  
	  for (var i=0; i< userrecords.length; i++) {
		  //listofrecords.push(objectrecords[i]._id);
		  
		  var subscriberecords = userrecords[i].subscribe;
		  var useridtosearch = userrecords[i]._id;
		  var interesteduniqueid_keys = Object.keys(listofuserids_toupdate[useridtosearch]);
//		  console.log(interesteduniqueid_keys);
		     for (var j=0; j< subscriberecords.length; j++) 
			  {
				  var myuniqvalue = subscriberecords[j].unique_id;
				  if( myuniqvalue != 'undefined') {
		//			   console.log(useridtosearch+"--"+ myuniqvalue); 
				  // element exists in array
				  if(interesteduniqueid_keys.indexOf(myuniqvalue) >= 0)
				  {
					  
					  userrecords[i].subscribe[j].responsemsg = listofuserids_toupdate[useridtosearch][myuniqvalue].responsemsg;
					  userrecords[i].subscribe[j].responsetime = listofuserids_toupdate[useridtosearch][myuniqvalue].responsetime;
					 
		//			  console.log(userrecords[i].subscribe[j].responsemsg);
				  }
				  }

				 
			  }
	     
		 var query1 = {}
		 query1['_id'] = useridtosearch;
		  
		  // console.log (userrecords[i].subscribe);
		  Userdata.update(query1,
         {$set: { 'subscribe' : userrecords[i].subscribe  }}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			// return res.json(items);
			// res.status(200).json(keys);
			 
			});
			
			
		  
	  }
	  
	   //res.status(200).json(userrecords);
	  
	  });
	  // 
	  
	  
	  
	  var listofrecords = [];
	  for (var i=0; i< objectrecords.length; i++) {
		  listofrecords.push(objectrecords[i]._id);
	  }
	//  var query = {'_id': {$in: ["561a3dec604589344237ccec", "561a2ffe88512a5c4aac34c0"]}};
	  var query = {'_id': {$in: listofrecords }};
	  
	  Article.update(query,
         {$set: { 'objectstatus.responseschanged': false}}, {multi:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			// return res.json(items);
			 
			});
 
      res.status(200).json(objectrecords);
    });
	
	/*
	if(req.query.startdataexchange == 'yes')
	{
		console.log("before timer");
		timer = setInterval(abcd, 10);
		
	}
	if(req.query.startdataexchange == 'no')
	{
		console.log("before clear");
		if(timer != null) clearInterval(timer);
		
	}
	
	*/
	
},


/**
 * Create a article
 */
create : function(req, res) {
	var article = new Article(req.body);
	
		article.user = req.user;
		//article.pref.price = req.query.price;
		article.userdata = req.userdata;
	
console.log(article.userdata);
	
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
autostartdataexchange : function()
{
	console.log("before timer");
		timer = setInterval(dataexchange, 10000, null, null);
},

/**
 * Show the current article
 */
read : function(req, res) {
	/*
	This returns data like below
	
	{"_id":"562a2b6a4ce946d4292c4c69","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"user":{"_id":"561a29b188512a5c4aac34be"},
	"objectaction":"need","objecttypedesc":"software training","objecttype":"Education","objectdesc":"rangoli","loc":[13.0274307,77.5950068],"__v":0,"desc":"",
	"responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1445604233429,"replied":true,"responsemsg":"come to my home",
	"responsetime":1445604293058,"object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1445604233429"},{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},"likedtime":1447582573379,"replied":false,"responsemsg":"","responsetime":"","object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1447582573379"}],"objectstatus":{"responseschanged":false},
	"objectdetails":"paper rangoli","created":"2015-10-23T12:43:22.007Z"}
	
	Does it return data of only logged in user or all.
	(check risk if it need to be trimmed.)
	
	*/
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
	if(req.query.user != null)
	{
	/*
	For logged in user, it returns data like below.
	
	{"_id":"562a2b6a4ce946d4292c4c69","objectdesc":"rangoli","responses":[{"likinguserdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},
	"likedtime":1445604233429,"replied":true,"responsemsg":"come to my home","responsetime":1445604293058,
	"object_id":"562a2b6a4ce946d4292c4c69","user_id":"561a29b188512a5c4aac34bf","unique_id":"562a2b6a4ce946d4292c4c69561a29b188512a5c4aac34bf1445604233429"}
	
	user_id is risky. (encrypt this or avoid this)
    -> checked this is not actual userid. So no problem to stay.
	-> It is id from userdata record
	
	
	*/
	
//	console.log(req.query.user)	;
//	console.log(req.user)	;
	Article.find({'user': req.user},{'objectdesc':1, 'responses':1, 'objectdetails':1}).sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
	
	} else {
	/*
	This was used for testing
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
  deleteobject : function(req, res, next) {
        "use strict";
	
	   
	   var object = req.body.object;
	   // if(typeof listofuserids_toupdate[likinguser_id] == 'undefined'){

       if(typeof object == 'undefined'){
		    return res.json(null);
	   }
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
		  
		  Article.remove(query, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

		//	console.log (items);
        //    console.log("Found " + items.length + " posts");

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

		//	console.log (items);
        //    console.log("Found " + items.length + " posts");

			 return res.json(items);
			 
			});
		  
	
		
        
  },
  

  

/**
 * List of Near disposers
 */
near : function(req, res) {
	
	if(typeof req.query.latitude == 'undefined' || typeof req.query.longitude == 'undefined')
	{
		return res.json([]);
	}
	var limit = req.query.limit || 50;

    // get the max distance or set it to 8 kilometers
    var maxDistance = req.query.distance || 8;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    //maxDistance /= 6371;
	
	maxDistance = 6 + 100;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.query.latitude;
    coords[1] = req.query.longitude;

	/*
       This has to return objects.
	   the objects should have, object_id, name of objects, owner of the objects.(this will be useful for frontend to express like)
	   
	   -It should not have, the list of people who has liked this object. (As this is not needed for every mobile )
	   
	   current records
	   
	   [{"_id":"562a2b6a4ce946d4292c4c69","userdata":{"_id":"561a29b188512a5c4aac34bf","username":"raju4"},
	   "objectdesc":"rangoli","loc":[13.0274307,77.5950068],"objectdetails":"paper rangoli","created":"2015-10-23T12:43:22.007Z"}
	   
	   userdata is safe, as it cannot be used to access any password files.
	   _id is the object record id.
	   
	   If encryption is needed. _id in above records can be encrypted.
	   
	   
	*/
	// http://stackoverflow.com/questions/7837731/units-to-use-for-maxdistance-and-mongodb
    // find a location
    Article.find({
      loc: {
        $near: coords,
        $maxDistance: maxDistance/111.12
      }
    }, {'objectdesc':1, 'loc':1, 'objectdetails':1,'objectaction':1,'objecttype':1,'objecttypedesc':1, 'userdata':1, 'created':1, '_id':1}).sort('-created').limit(limit).exec(function(err, locations) {
      if (err) {
        return res.json(500, err);
      }

      res.status(200).json(locations);
    });
	
	
	/*
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	}); */
},


	

/**
 * Article middleware
 */
objectByID : function(req, res, next, id) {

console.log("objectByID");
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
