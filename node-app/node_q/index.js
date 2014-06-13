var Q = require('q');
var http = require('http');
var request = require('request');

var fn1 = function() {
	var defer = Q.defer();
	setTimeout(function() {
		defer.resolve(10);
	}, 1000)
	return defer.promise;
}

var fn2 = function(v1) {
	console.log(v1, 'fn2');
	var defer = Q.defer();
	setTimeout(function() {
		defer.resolve(11);
	}, 1000);
	return defer.promise;
}

var fn3 = function(val1) {
	console.log(val1, 'error');	
}

var fn4 = function(val) {
	console.log(val, 'fn4');
	return 34;
}

//Q.all([fn1(), fn2()]).then(fn4).catch(fn3)
//fn1().then(fn4, fn3)
fn1().then(fn4).then(fn3);
/*
Q.fcall(fn1).then(fn2).catch(function(error) {
	console.log(error);
}).done()*/

//fn1().then(fn2).fail(fn3);

//Q.when(fn1(), fn2()).done(fn3);

var server = http.createServer(function(req, res) {
	req.on('close', function() {
		console.log('server request close');
	});
	res.on('close', function() {
		console.log('response close');
	});
	res.on('finish', function() {
		console.log('finish');
	});
	setTimeout(function() {
		console.timeEnd('req'); 
		console.log('response return');
		res.end('hello');
	}, 1000 * 4);
}).listen(3300);
server.timeout = 5000
server.on('requset', function(req, res) {
	console.log('request');
});
server.on('connection', function() {
	console.log('connection');
});
server.on('connect', function(request, socket, head) {
	console.log('connect');
})
server.on('close', function() {
	console.log('close');
});
server.on('clientError', function() {
	console.log('clientError');
});

console.time('req');
console.time('error');
var req = http.request({
	port: 3300,
	headers: {
		'content-type': 'text/plain',
  'connection': 'keep-alive',
  'accept': '*/*'
	}
	//agent: false //will close socket immediate
}, function(res) {
	console.log('req finish');
});
/*
req.setTimeout(3000, function(err) {
	console.log('req timeout');
})*/
req.on('error', function() {
	console.timeEnd('error');
	console.log('req error');
	req.abort()
})
req.on('close', function() {
	console.log('client req close');
});
req.on('response', function() {
	console.log('req response');
});
req.on('socket', function() {
	console.log('req socket');
})

req.end();


