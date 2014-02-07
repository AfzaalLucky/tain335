var fs = require('fs');
var path = require('path');
var vm =  require('vm');
var util = require('util');
var Emitter = require('events').EventEmitter;
var emitter = new Emitter();
var root = '/home/paul/Project/nodejs-yo/webapp-1/ace-lib/modMock'
var dest = '/home/paul/Project/nodejs-yo/webapp-1/ace-lib/modDone'

var fnwrap = ['(function(define,require){','})(define,require)'];
var moduleCache = {};

var _ots = Object.prototype.toString;
var utils = {
	_isFunction: function(obj) {
		return _ots.call(obj) == '[object Function]';
	},
	_isArray: function(obj) {
		return _ots.call(obj) == '[object Array]';
	},
	_getArray: function(arr) {
		return Array.prototype.slice(arr);
	},
	_each: function(arr, callback) {
		for(var i = arr.length; i--;) {
			callback(arr[i], i, arr);
		}
	},
	_clone: function(obj, deep, level) {
		var res = obj;
		deep = deep || 0;
		level = level || 0;
		if (level > deep) {
			return res;
		}
		if (typeof obj == 'object' && obj) {
			if (_isArray(obj)) {
				res = [];
				_each(obj, function(item){
					res.push(item);
				});
			} else {
				res = {};
				for(var p in obj) {
					if (obj.hasOwnProperty(p)) {
						res[p] = deep ? _clone(obj[p], deep, ++level) : obj[p];
					}
				}
			}
		}
	}
}

var requireMock = {
	require: function(mod) {
		var _path = requireMock.path;
		if (!path.extname(mod)) {;
			moduleCache[_path].deps.push(path.resolve(path.dirname(_path), mod) + '.js');
		} else {
			moduleCache[_path].deps.push(path.resolve(path.dirname(_path), mod));
		}
	},
	define: function() {
		if(!moduleCache[requireMock.path]) {
			moduleCache[requireMock.path] = {fn:function(){},deps:[]};
		}
		switch(arguments.length){
			case 1:
				if (utils._isFunction(arguments[0])) {
					moduleCache[requireMock.path].fn = arguments[0];
					arguments[0](requireMock.require);
				} else if(typeof arguments[0] == 'object' && arguments[0].constructor == Object) {

				} else {
					console.warn('---Illegal argument! define function expect a function or object;Module path:%s---', requireMock.path);
				}
				break;
			case 2:
				if (util.isArray(arguments[0]) && utils._isFunction(arguments[1])) {

				} else {
					console.warn('---Illegal argument! define function expect a array and function;Module path:%s---', requireMock.path);
				}
				break;
			case 3:

				break;

			default :
				console.log.warn('---Illegal arguments!Module path:%s---', requireMock.path);
				break;
		}
	}
}

function _isParrentPath(path) {
	return /^\.\.\//.test(path);
}

function _isCurrentPath(path) {
	return /^\.\//.test(path) || /^\//.test(path);
}

function _isRelativePath(path) {
	return /^\.\.\//.test(path) || /^\.\//.test(path);
}

function _wrapMod(content) {
	return fnwrap[0] + content + fnwrap[1];
}

function _resolveRequire(_path, encoding) {
	var content =  fs.readFileSync(_path, {encoding: encoding});
	content = _wrapMod(content);
	if (path.extname(_path) == '.js') {
		requireMock.path = _path;
	} else {
		if(!moduleCache[_path]) {
			moduleCache[_path] = {fn:function(){},deps:[]};
		}
		return;
	}
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
		if (stats.isDirectory()){
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

function combineJs(dest, encoding, indeep) {
	for(var prop in moduleCache) {
		if (moduleCache.hasOwnProperty(prop)) {
			var content = '';
			_combineJs.trace = {};
			_combineJs.trace[prop] = true;
			content = _combineJs(prop, encoding, indeep) + buildMainWrap(prop, moduleCache[prop].deps, moduleCache[prop].fn);
			console.log(content);
			console.log('-------------------------------');
		}
	}
}

function buildDepWrap(from, to, fn) {
	var _relativePath = path.relative(path.dirname(from), to).split('.js')[0];
	if (!_isRelativePath(_relativePath)) {
		_relativePath = './' + _relativePath;
	}
	return ';define(\"' + _relativePath + '\",[\"require\"],' + fn.toString() + ')';
}

function buildMainWrap(prop, deps, fn) {
	var _deps = [];
	if (!deps) {
		deps = _deps;
	}
	for(var i = 0; i < deps.length; i++) {
		var _relativePath = path.relative(path.dirname(prop), deps[i]).split('.js')[0];
		if (_relativePath.indexOf('.') == -1) {
			_relativePath = './' + _relativePath;
		}
		_deps.push('\"' + _relativePath + '\"');
	}
	_deps.unshift('\"require\"');
	return ';define([' + _deps + '],' + fn.toString() + ')'; 
}

function _combineJs(path, encoding, indeep){
	var deps = moduleCache[path].deps;
	var content = '';
	if (!deps) {
		console.warn('---No This Module:%s---', path);
		return '';
	}
	for(var i = deps.length; i--;) {
		if (_combineJs.trace[deps[i]]) {
			continue;
		} else {
			_combineJs.trace[deps[i]] = true;
		}
		if (indeep) {
			content += _combineJs(deps[i], encoding, true);
		}
		content += buildDepWrap(path, deps[i], moduleCache[deps[i]].fn);
	}
	return content;
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
	console.log(prop);
	var deps = moduleCache[prop].deps;
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
console.log(moduleCache);
circleReferenceCheck();
combineJs('', 'utf-8', true);

