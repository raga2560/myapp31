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
 
var CommentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	commentarray: [{}],
	
	userdata: {		
	type: String
	}
});

CommentSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};


mongoose.model('Comment', CommentSchema);
