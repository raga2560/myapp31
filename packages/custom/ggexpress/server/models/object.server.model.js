'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ObjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	objecttype: {   // "item", "training"
		type: String,
		trim: true
	},
	
	objectaction: {  // "sell", rent
		type: String,
		trim: true
	},
	objecttypedesc: {   // "used furniture", "c++ training"
		type: String,
		trim: true
	},
	objectdesc: {
		type: String,
		trim: true
	},
	objectdetails: {
		type: String,
		default: '',
		trim: true
		}, // price, title, text
	objectstatus : {
		
        responseschanged : Boolean,
		
        placeholder  : Number
    
	},
	
	price: {
		type: Number,
		trim: true
	},
	
	loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
    },
	responses: [{}],
	desc: {
		type: String,
		default: '',
		trim: true
	},
	userdata: {		
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Object', ObjectSchema);
