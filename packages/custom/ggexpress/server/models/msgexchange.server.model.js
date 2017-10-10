'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var MsgexchangeSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
		
	firstuser: {  
		type: String
	},
	seconduser: { 
		type: String
	},
	firstuserdata: {
		type: String		
	},
	seconduserdata: {
			type: String
	},
	
	firstuserref: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	
	seconduserref: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	itemdetails: [{}],
	
	mykeys : {
			type: Array,
			index: true
	},
	exchanges: [{}]
});

MsgexchangeSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.model('Msgexchange', MsgexchangeSchema);
