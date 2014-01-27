var fs = require('fs');
var path = require('path');
var vm =  require('vm');
var util = require('util');
var Emitter = require('events').EventEmitter;
var emitter = new Emitter();
var root = '/home/paul/tain335/nodejs-yo/webapp-1/ace-lib/modMock'
var dest = '/home/paul/tain335/nodejs-yo/webapp-1/ace-lib/modDone'

var fnwrap = ['(function(define,require){','})(define,require)'];
var moduleCache = {};
var requireMock = {
	require: function(mod) {
		var _path = requireMock.path;
		moduleCache[_path].push(path.resolve(path.dirname(_path), mod + '.js'));
	},
	define: function() {
		if(!moduleCache[requireMock.path]){
			moduleCache[requireMock.path] = [];
		}
		switch(arguments.length){
			case 1:
				if (typeof arguments[0] == 'function') {
					arguments[0](requireMock.require);
				} else if(typeof arguments[0] == 'object' && arguments[0].constructor == Object) {

				} else {
					console.warn('---Illegal argument! define function expect a function or object---');
				}
				break;
			case 2:
				if (util.isArray(arguments[0]) && typeof arguments[1] == 'function') {

				} else {
					console.warn('---Illegal argument! define function expect a array and function---');
				}
				break;

		}
	}
}

function _wrapMod(content) {
	return fnwrap[0] + content + fnwrap[1];
}

function _resolveRequire(path, encoding) {
	var content =  fs.readFileSync(path, {encoding: encoding});
	content = _wrapMod(content);
	requireMock.path = path;
	vm.runInNewContext(content, requireMock);
}


function fileScanner(path, encoding) {
	var stats = fs.statSync(path);
	if (stats.isDirectory()) {
		var files = fs.readdirSync(path);
		for(var i = files.length; i--;) {
			fileScanner(path + '/' + files[i], encoding);
		}
	} else {
		_resolveRequire(path, encoding);
	}
}

function rootScanner(root, encoding) {
	if (fs.existsSync(root)) {
		var stats = fs.statSync(root);
		if(stats.isDirectory()){
			if (stats.isDirectory()) {
				fileScanner(root, encoding);
			} else {
				console.error('---root:%s isn\'t a directory', root);
			}
		}
	} else {
		console.error('---root path:%s not exist---', root);
	} 
}

function copy(from, dest) {

}

function combineSrc(path, encoding, indeep) {
	var deps = moduleCache[path];
	if(!deps){
		console.warn('---No This Module:%s---', path);
	}
	var content =  fs.readFileSync(path, {encoding: encoding});
}

function circleReferenceCheck() {
	if (!_depsTrace.trace) {
		_depsTrace.trace = [];
	}
	for(var prop in moduleCache) {
		if (moduleCache.hasOwnProperty(prop)) {		
			_circleReferenCheck(prop);		
		}
	}
}

function _circleReferenCheck(prop) {
	var deps = moduleCache[prop];
	if(!deps){
		throw new Error('---Error! Module Canot Found: ' + prop);
	}
	_depsTrace.trace.unshift(prop);
	for(var j = deps.length; j--;) {
		_depsTrace(deps[j]);
	}
	_depsTrace.trace.shift();
}

function _depsTrace(mod) {
	for(var i = _depsTrace.trace.length; i-- ;) {
		if (_depsTrace.trace[i] == mod) {
			throw new Error('---Error! Circle Reference: ' + mod + '\n' + _depsTrace.trace.join('\n'));
		}
	}
	_circleReferenCheck(mod);
}

rootScanner(root, 'utf-8');
circleReferenceCheck();

