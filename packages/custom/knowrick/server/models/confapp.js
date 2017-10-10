var mongoose = require('mongoose');
/* The ConfappDAO must be constructed with a connected database object */
function ConfappDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ConfappDAO)) {
        console.log('Warning: ConfappDAO constructor called without "new" operator');
        return new ConfappDAO(db);
    }
	
	var schema = mongoose.Schema({});

var confapp = mongoose.model('confapp', schema);

  //  var confapp = db.collection("confapp");
	/*
	this.getEventids = function(username, callback) {
        "use strict";
		username = "test15";
        confapp.findOne( {'creator': username}, {'home':1, '_id': 1},function(err, social1) {
            "use strict";

			console.log(social1);
            if (err) return callback(err, null);

            callback(null, social1);
        });
    }
	*/
	}

module.exports.ConfappDAO = ConfappDAO;
