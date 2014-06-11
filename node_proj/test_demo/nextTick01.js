module.exports = (function() {
	'use strict';
	var http = require('http');

	var handler = function(req, res) {
		res.writeHead(200, {'Content-type': 'text/html'});
		foo(function() {
			console.log("bar");
		});
		console.log("received");
		res.end("Hello,world!");
	} 

	function foo(callback) {
		var i = 0;
		while(i < 1000000000) i++;
		console.log('nextTick');
		process.nextTick(callback);
	}

	http.createServer(handler).listen(3010);
})()
