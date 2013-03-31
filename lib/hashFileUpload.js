'use strict';

var path = require('path'),
	fs = require('fs');

/**
 * This middleware renames `req.files` to it's hash or just remove file if file
 * with such hash already exists
 */

module.exports = function() {
	return function(req, res, next) {
		//build plain array of files from req.files
		var files = [];
		for (var name in req.files) {
			var file = req.files[name];
			if (isArray(file)) {
				files = files.concat(files, file);
			} else {
				files.push(file);
			}
		}
		var filesTotal = 0,
			filesRenamed = 0;
		files.forEach(function(file) {
			filesTotal++;
			if (!file.hash) {
				next(new Error(
					'`hash` is not set at `req.files`, you should do that by ' +
					'passing `hash` option to bodyParser e.g. ' +
					'app.use(express.bodyParser({hash: "md5"})'
				));
				return;
			}
			var newPath = path.join(
				path.dirname(file.path),
				file.hash + path.extname(file.path)
			);
			fs.exists(newPath, (function(file) {
				return function(exists) {
					if (exists) {
						fs.unlink(file.path, callback);
					} else {
						fs.rename(file.path, newPath, callback);
					}
					file.path = newPath;
				}
			})(file));
		});
		function callback(err) {
			if (err) {
				next(err);
				return;
			} else {
				filesRenamed++;
				if (filesRenamed == filesTotal) next();
			}
		}
		if (filesTotal == 0) next();
	}
	function isArray(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	};
};
