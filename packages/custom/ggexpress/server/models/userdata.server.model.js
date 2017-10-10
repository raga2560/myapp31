'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var UserdataSchema = new Schema({
	
	loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
    },
	address :{},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	deviceuuid: {
		type: String
	},
	
	disposals:[{}],
	responses: [{}],
	subscribe:[{}],
	notifications:[{}],
	pref:{ miles: Number
	}

});

mongoose.model('Userdata', UserdataSchema);
