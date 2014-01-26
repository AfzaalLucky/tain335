var fs = require('fs');
var path = require('path');
var vm =  require('vm');
var fnwrap = ['(function(define,require){','})(define,require)'];
var requireMock = {
	require: function(mod) {
		console.log(mod);
	},
	define: function(fn){
		fn(requireMock.require);
	}
}

vm.runInNewContext('(function(define,require){define(function(require){var a = require("a");var b = require("b")})})(define,require)', requireMock);

/*
function _resolveMod(path) {
	var content = fs.readFileSync(path, {ecoding: 'utf-8'});
}*/