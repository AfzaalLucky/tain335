var fs = require('fs');
var path = require('path');
var vm =  require('vm');
var util = require('util');
var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
var root = '/home/paul/tain335/nodejs-yo/webapp-1/ace-lib/modMock'
var dest = '/home/paul/tain335/nodejs-yo/webapp-1/ace-lib/modDone'

var fnwrap = ['(function(define){','})(define)'];
var tplwrap = ['(function(define){define(function(require){', '});})(define)']
//var tplwrap = ['(function(define.require){define(\"','\",function(require){','})})(define,require)'];
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
	_trim: function(str){
		return str.replace(/\s+/g, '');
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
	define: function (name, deps, callback) {
		var _path = requireMock.path;
        if(!moduleCache[_path]) {
			moduleCache[_path] = {fn:function(){},deps:[]};
		}

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!utils._isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && utils._isFunction(callback)) {
            deps = [];
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
						if (!path.extname(dep)) {;
							moduleCache[_path].deps.push(path.resolve(path.dirname(_path), dep) + '.js');
						} else {
							moduleCache[_path].deps.push(path.resolve(path.dirname(_path), dep));
						}
                    });
                //moduleCache[_path].deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(moduleCache[_path].deps);
            }
        }
        moduleCache[_path].fn = callback;
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

function _wrapTpl(content) {
	return tplwrap[0] + content + tplwrap[1];
}

function _isBasicDeps(str) {
	if (!str || str == 'require' || str == 'exports' || str == 'module') {
		return true;
	}
	return false;
}

function _resolveRequire(_path, opt) {
	opt = opt || {};
	var encoding = opt.encoding ? opt.encoding: 'utf-8';
	var content =  fs.readFileSync(_path, {encoding: encoding});
	requireMock.path = _path;
	if (path.extname(_path) == '.js') {
		content = _wrapMod(content);
	} else {
		if(!moduleCache[_path]) {
			moduleCache[_path] = {fn:'function(require){' + content + '}',deps:[]};
		}
		content = praseTpl(content, {filename:_path, compileDebug: false,_with:true, consumeEOL: true});
		moduleCache[_path].fn = content;
		content = _wrapTpl(content);
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

function combineJs(dest, encoding, indeep) {
	for(var prop in moduleCache) {
		if (moduleCache.hasOwnProperty(prop)) {
			var content = '';
			_combineJs.trace = {};
			_combineJs.trace[prop] = true;
			content = _combineJs(prop, encoding, indeep) + buildMainWrap(prop, moduleCache[prop].deps, moduleCache[prop].fn);
			console.log('------------------------------->>')
			console.log(content);
			console.log('<<-------------------------------');
		}
	}
}

function buildDepWrap(from, to, fn) {
	var _relativePath = path.relative(path.dirname(from), to).split('.js')[0];
	if (!_isRelativePath(_relativePath)) {
		_relativePath = './' + _relativePath;
	}
	buildMainWrap(to, moduleCache[to].deps, moduleCache[to].fn);
	//return '\n;define(\"' + _relativePath + '\",[\"require\"],' + fn.toString() + ')';
}

function buildMainWrap(prop, deps, fn) {
	var _deps = [];
	var mod = moduleCache[prop];
	if (!deps) {
		deps = _deps;
	}
	for(var i = 0; i < deps.length; i++) {
		var _relativePath = path.relative(path.dirname(prop), deps[i]).split('.js')[0];
		if (!_isRelativePath(_relativePath)) {
			_relativePath = './' + _relativePath;
		}
		_deps.push('\"' + _relativePath + '\"');
	}
	return '\n;define([' + (mod.fn.length === 1 ? ['\"require\"'] : ['\"require\"', '\"exports\"', '\"module\"']).concat(_deps) + '],' + fn.toString() + ')'; 
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
	if (!moduleCache[prop]) {
		throw new Error('---Error! Module Canot Found: ' + prop);
	}
	var deps = moduleCache[prop].deps;
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


function resolveInclude(name, filename) {
  var _path = path.join(path.dirname(filename), name);
  var ext = path.extname(name);
  if (!ext) _path += '.tpl.html';
  return _path;
}


function praseTpl(str, options){
  var options = options || {}
    , open = options.open || exports.open || '<%'
    , close = options.close || exports.close || '%>'
    , filename = options.filename
    , compileDebug = options.compileDebug !== false
    , buf = ""
    , included = !!options.included
    , consumeEOL = !!options.consumeEOL
    , encodeHtmlFn = 'function $encodeHtml(str) {\n\treturn (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;").replace(/\'/g, "&#39;").replace(/"/g, "&quot;");\n}\n';

  buf += 'var buf = [];';
  if (false !== options._with) buf += '\nwith (locals || {}) { (function(){ ';
  buf += '\nbuf.push(\'';
  var lineno = 1;
  for (var i = 0, len = str.length; i < len; ++i) {
    var stri = str[i];
    if (str.slice(i, open.length + i) == open) {
      i += open.length
      var prefix, postfix;
      switch (str[i]) {
        case '=':
        	if (str[i+1] == '=') {
        		prefix = "', $encodeHtml(";
		        postfix = "), '";
		        i += 2;
        	} else {
        		prefix = "',";
		        postfix = ",'";
		        ++i;
        	}        
	        break;
        default:
          prefix = "');";
          postfix = "; buf.push('";
      }
      var end = str.indexOf(close, i)
        , js = str.substring(i, end)
        , start = i
        , include = null
        , n = 0;
      if (0 == js.trim().indexOf('include')) {
        var name = js.trim().slice(7).trim();
        if (!filename) throw new Error('filename option is required for includes');
        var path = resolveInclude(name, filename);
        include = fs.readFileSync(path, 'utf8');
        include = arguments.callee(include, { filename: path, _with: false, open: open, close: close, compileDebug: compileDebug, consumeEOL: consumeEOL,included: true});
        if(!moduleCache[path]) {
			moduleCache[path] = {fn:'function(require){' + include + '}',deps:[]};
			requireMock.path = path;
        	vm.runInNewContext( _wrapTpl(include), requireMock);
		}
        requireMock.path = filename;
        buf += "' + (function(){" + include + "})() + '";
        js = '';
      }
      while (~(n = js.indexOf("\n", n))) n++, lineno++;
      if (js) {
        js = utils._trim(js);
        buf += prefix;
        buf += js;
        buf += postfix;
      }
      i += end - start + close.length - 1;

    } else if (stri == "\\") {
      buf += "\\\\";
    } else if (stri == "'") {
      buf += "\\'";
    } else if (stri == "\r") {
      // ignore
    } else if (stri == "\n") {
      if (!consumeEOL) {
        buf += "\\n";
        lineno++;
      }
    } else if (stri == " ") {
      // ignore
    } else if (stri == "\t"){
      // ignore
    } else {
    	buf += stri;
    }
  }
	if (false !== options._with) buf += "'); })();\n}";
	else buf += "');";
	if (!included) {
		buf = encodeHtmlFn + buf;
	}
	buf += "\nreturn buf.join('');"
	return buf;
};


rootScanner(root, 'utf-8');
console.log(moduleCache);
circleReferenceCheck();
combineJs('', 'utf-8', true);


//var content = fs.readFileSync('test.tpl.html', {encoding: 'utf-8'});
//console.log(praseTpl(content, {filename:'/home/paul/tain335/nodejs-yo/webapp-1/ace-lib/test.tpl.html', compileDebug: false,_with:true, consumeEOL: true}).toString());

