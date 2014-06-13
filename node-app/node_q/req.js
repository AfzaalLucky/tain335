var request = require('request');

	console.time('check');

	request({
		url: 'http://www.facebook.com',
		followRedirect: true,
		encoding: 'utf-8',
		timeout: 3000,
		method: 'GET',
		json: true,
		pool: false
	}, function(err, res, body) {
		if(err) {
			console.log(err);
			console.timeEnd('check');
			
		} else {
			console.log(3232);
			console.timeEnd('check');
			
		}
	});

