'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Objecttype'),
	_ = require('lodash');

module.exports = function(Articles) {

return {
/**
 * Create a article
 */
create : function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},

insertreuser : function(req, res) {
	var article = req.article;

/*
	article.update()(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	}); */
},

/**
 * Show the current article
 */
read : function(req, res) {
	res.json(req.article);
},

/**
 * Update a article
 */
update : function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},

/**
 * Delete an article
 */
delete : function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
},

/**
 * List of Articles
 */
list : function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
},



objecttypesearch : function(req, res, next) {
        "use strict";

        var str = req.params.str;
		var pattern  = "/" + str + "/" + "i";
//		  console.log("Pattern " + pattern);
		  

		  Article.find({ 'item' : new RegExp(str) } , {'item':1, 'desc':1 }).exec(function(err, items) {
            "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			 return res.json(items);
            
        });
		
		
        
  },
  
  objecttype_by_item : function(req, res, next) {
        "use strict";

        var str = req.params.str;
		var pattern  = "/" + str + "/" + "i";
//		  console.log("Pattern " + pattern);
		  

		  Article.find({ 'item' : new RegExp(str) } , {'item':1, 'desc':1 }).exec(function(err, items) {
            "use strict";

            if (err) return res.json(null);

//			console.log (items);
//            console.log("Found " + items.length + " posts");

			 return res.json(items);
            
        });
		
		
        
  },
	

	

/**
 * Article middleware
 */
objecttypeByID : function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Article is invalid'
		});
	}

	Article.findById(id).populate('displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found'
			});
		}
		req.article = article;
		next();
	});
},

/**
 * Article authorization middleware
 */
hasAuthorization : function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
}

};
}
