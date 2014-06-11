module.exports = (function() {
	'use strict';
	var http = require('http');
	function compute() {
		process.nextTick(compute);
	}

	http.createServer(function(req, res) {
		res.wirteHead(200, {'Contenty-Type': 'text/plain'});
		res.end('Hello World');
	}).listen(3010)

	compute();
})()