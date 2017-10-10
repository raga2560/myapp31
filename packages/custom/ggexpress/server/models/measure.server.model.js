'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var MeasureSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	datestring : {
		type: String
	},
	currentload: {  
		type: Number
	},
	loadarray :[{}],
	itemdetails: [{}],
	
	
	exchanges: [{}]
});

MeasureSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.model('Measure', MeasureSchema);
