var 
  ConfappDAO = require('../models/confapp').ConfappDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler (db) {
    "use strict";

    var confapp = new ConfappDAO(db);
	
	  this.confappGetSession = function(req, res, next) {
        "use strict";

        /*
		
		var session_id = req.cookies.session;
        sessions.getUsername(session_id, function(err, username1) {
            "use strict";

          
              var  username = {
				username:username1  
			  } ;
            
			
			  console.log("username="+username.username);
			  
           
			if(err) return res.json({error:err});
			else {
				return res.json(username);
			}
			
		});
		
					*/
					 res.send('Anyone can access this2');
		
		
		
    }
	}

module.exports = SessionHandler;