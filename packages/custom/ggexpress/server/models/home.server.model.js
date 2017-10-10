'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
 
 /*
 DataSchema
 
 Home, array of data to be displayed (place, data)(place1, data)
 Comment, collect, push into array of the day. (user, time, message, )
 Reply display (user, comment, reply, time)
 Requests, time for processing (1 min)  (how to get)
 No of users (sample 1 min) (how to get)
 Time taken for data exchange (existing works)
 
 */



	
var HomeSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
    },
	address :{},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	// title, desc, img, link
	messagearray: [{}],
	replyarray: [{}],
	
	userdata: {		
	type: String
	},
	radius: {
		type: Number,
		default: 2
	}
});

HomeSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};


mongoose.model('Home', HomeSchema);
