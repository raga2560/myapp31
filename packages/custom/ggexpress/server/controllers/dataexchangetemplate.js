'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Object'),
	Measure = mongoose.model('Measure'),
	Userdata = mongoose.model('Userdata'),
	_ = require('lodash');


	

var timer;

function dataexchange() 
	{
	
	var stat = {
		numberofobjects:0,
		useridkeys:0
	};
	var limit = 100;
		console.log("dataexchange called:" );
	stat.starttime = Date.now()	;
	Article.find({
     'objectstatus.responseschanged': true
    }).limit(limit).exec(function(err, objectrecords) {
      if (err) {
        return res.json(500, err);
      }
	  stat.numberofobjects = objectrecords.length;
	 // console.log("stat"+ stat.numberofobjects);
	  
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
				  //console.log("in objects="+responserecord.unique_id);
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
					responsetime : responserecord.responsetime,
					username : responserecord.username,
					userid : responserecord.userid
					};
				//	 console.log("userid to update:"+likinguser_id +","+ responserecord.unique_id);
					listofuserids_toupdate[likinguser_id][responserecord.unique_id] = obj;
					};
				  
			  }
		 
		  
		 
		  
		 
	  }
	  //5622830d34501e782318d5705622828334501e782318d56f1445102377391
	  //560f9c607a78962c91f69ade5622828334501e782318d56f1445102330777
	  
	  
	   var useridkeys = Object.keys(listofuserids_toupdate);
	   useridkeys = removeA(useridkeys, 'undefined');
	   stat.useridkeys = useridkeys.length;
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
		  // console.log(interesteduniqueid_keys);
		     for (var j=0; j< subscriberecords.length; j++) 
			  {
				  var myuniqvalue = subscriberecords[j].unique_id;
				  if( myuniqvalue != 'undefined') {
				//	   console.log(useridtosearch+"--"+ myuniqvalue); 
				  // element exists in array
				  if(interesteduniqueid_keys.indexOf(myuniqvalue) >= 0)
				  {
					  
					  userrecords[i].subscribe[j].responsemsg = listofuserids_toupdate[useridtosearch][myuniqvalue].responsemsg;
					  userrecords[i].subscribe[j].responsetime = listofuserids_toupdate[useridtosearch][myuniqvalue].responsetime;
					  userrecords[i].subscribe[j].username = listofuserids_toupdate[useridtosearch][myuniqvalue].username;
					  userrecords[i].subscribe[j].userid = listofuserids_toupdate[useridtosearch][myuniqvalue].userid;
					 
			//		  console.log(userrecords[i].subscribe[j].responsemsg);
				  }
				  }

				 
			  }
	   
		stat.useridtosearch = useridtosearch.length;
		 var query1 = {}
		 query1['_id'] = useridtosearch;
		  
		  // console.log (userrecords[i].subscribe);
		  Userdata.update(query1,
         {$set: { 'subscribe' : userrecords[i].subscribe  }}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

		//	console.log (items);
        //    console.log("Found " + items.length + " posts");

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
	stat.listofrecordsreset = listofrecords.length;
	  var query = {'_id': {$in: listofrecords }};
	  
	  Article.update(query,
         {$set: { 'objectstatus.responseschanged': false}}, {multi:true}, function(err, items) { 
		 "use strict";

            if (err) return res.json(null);

		//	console.log (items);
        //    console.log("Found " + items.length + " posts");

			// return res.json(items);
			 
			});
 
     // res.status(200).json(objectrecords);
	 stat.endtime = Date.now()	;
	 stat.timetaken = stat.endtime - stat.starttime;
	 //console.log(stat);
	 insertstatrecord(stat);
    });
	
	
	
}
function insertstatrecord(stat)
	{
		 //var article = new Article();
	
	var d = Date.now();
	 var loaddata = {
		 datestring: d,
		 stat: stat
	 };
	 var query = {};
	  query['datestring'] = (new Date(d)).toLocaleDateString('en-US');
	  
	//	article.currentload  = currload;
	// toLocaleDateString('en-US')
	
	 Measure.update(query,
         {$push: { 'exchanges' : loaddata }},{upsert:true}, function(err, items) { 
		 "use strict";

//            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

//			 return res.json(items);
			 
			});
			
			
	
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


module.exports = {
	

	
	
  validate_email: function(email, validationid, mailOptions) {
    mailOptions.html = 
      'Hi <br/>' +
      'Use the validation-id : ' + validationid + '<br/>' +
      'to validate email-id for ptpconnect <br/>' + 
	  'Regards <br/>' +
	  'admin' + '<br/>';
      
    
    mailOptions.subject = 'validation id for ptpconnect';
    return mailOptions;
  },
  mytest : function() {
	  console.log("in mytest");
	  console.log("before timer");
		timer = setInterval(dataexchange, 1000000, null, null);
		
		
  }
  
  	
  
};
