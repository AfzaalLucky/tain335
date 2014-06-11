module.exports = (function() {
	'use strict';
	var http = require('http');
	var fs = require('fs');

	var handler = function(req, res) {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.end("Hello World!");
		maybeSync(true, function() {
			console.log('callback');
		});
		bar();
	}

	function maybeSync(arg, cb) {
		if(arg) {
			//cb();// this method could be async or sync
			process.nextTick(cb)
			return;
		}
		fs.stat('./nextTick01.js', cb);
	}

	function bar() {
		console.log('bar');
	}

	http.createServer(handler).listen(3010);
})()