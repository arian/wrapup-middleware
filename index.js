"use strict";

var fs = require('fs');
var path = require('path');
var wrapup = require('wrapup');

module.exports = function(options, _wrup){

	return function wrapupMiddleware(req, res, next){
		if (req.method != 'GET') return next();

		res.type('js');

		// make optional, so we can dependency inject for testing
		var wrup = _wrup ? _wrup : wrapup();

		// redirect errors
		wrup.on('error', function(err){
			next(err);
		});

		// write wrapup response to the http response
		wrup.pipe(res);

		if (options){

			if (options.dest){
				options.output = path.join(options.dest, req.url);
			}

			wrup.options(options);
		}

		// require files
		var name, file, r, src;
		if (options && options.requires){
			for (name in options.requires){
				r = options.requires[name];
				file = typeof r == 'string' ? r : name;
				if (typeof r == 'string') wrup.require(name, file);
				else wrup.require(file);
			}
		} else {
			src = options && options.src || process.cwd();
			wrup.require(path.join(src, req.url));
		}

		wrup.up();
	};
};
