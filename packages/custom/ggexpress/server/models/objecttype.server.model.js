'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ObjecttypeSchema = new Schema({
	
	name: {
		type: String,
		trim: true
		
	},
	giver: [],
	taker: [],
	typedesc: [],
	group: {
		type: String, // involve, contrib
		default: '',
		trim: true
	},
	
	desc: {
		type: String,
		default: '',
		trim: true
	}
	
	
});

mongoose.model('Objecttype', ObjecttypeSchema);
