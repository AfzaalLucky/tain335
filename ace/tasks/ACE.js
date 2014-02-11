var fs = require('fs');
var path = require('path');
var vm =  require('vm');
var util = require('util');
var utils = require('./lib/utils');
var grunt = require('grunt');
var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
var fnwrap = ['(function(define){','})(define)'];
var tplwrap = ['(function(define){define(function(require){', '});})(define)']
//var tplwrap = ['(function(define.require){define(\"','\",function(require){','})})(define,require)'];
var moduleCache = {};

var requireMock = {
	define: function (name, deps, callback) {
		var _path = requireMock.path;
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
        if (path.extname(_path) === '.js') {
        	moduleCache[_path].fn = callback;
        }
    }
}

function log() {
	grunt.log.writeln(_joint(arguments));
}
function warn(msg) {
	grunt.log.warn(_joint(arguments));
}

function _joint(obj){
	var args = [];
	var msg = '';
	if (obj.length == 1) {		
		msg = obj[0];
	} else {		
		args = utils._getArray(obj).slice(1);
		msg = obj[0].replace(/(%s)+/g, function(){
			return args.shift();
		})
	}
	return msg;
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

function _readFile(_path, encoding) {
	if (!fs.existsSync(path)) {
		throw new Error('Error! File not exists: ' + _path);
	}
	return fs.readFileSync(_path, encoding);
}

function _resolveSrcRequire(_path, opt) {
	moduleCache[_path].fn.replace(/<!--\s*(require|include)\s+(['"])([^'"]+)(['"])\s*-->/mg, function(m, $1, $2, $3, $4) {
		var modPath = path.join(path.dirname(_path), $3);
		if (!path.extname($3)) {
			modPath += '.js';
		}
		moduleCache[_path].deps.push(modPath);
		if ($1 == 'require') {
			_resolveRequire(modPath, {encoding:opt.encoding,indeep:true});
		} else {
			_resolveRequire(modPath, {encoding:opt.encoding,indeep:false});
		}
		return '';
	})
}

function _resolveRequire(_path, opt) {
	opt = opt || {};
	var encoding = opt.encoding ? opt.encoding: 'utf-8';
	var content = fs.readFileSync(_path, {encoding: encoding});
	requireMock.path = _path;
	if (path.extname(_path) == '.js') {
		if(!moduleCache[_path]) {
			moduleCache[_path] = {fn:function(){}, deps:[], indeep:opt.indeep};
		}
		content = _wrapMod(content);
	} else if (/\.tpl\.html?$/.test(_path)) {
		if (!moduleCache[_path]) {
			moduleCache[_path] = {fn:'function(require){' + content + '}',deps:[]};
		}
		content = praseTpl(content, {filename:_path, compileDebug: false,_with:true, consumeEOL: true});
		moduleCache[_path].fn = 'function(require){ return { render: function(locals){' + content + '}}}';
		content = _wrapTpl(content);
	} else if (/\.src\.html?$/.test(_path)) {
		if (!moduleCache[_path]) {
			moduleCache[_path] = {fn: content, deps: []};
		}
		_resolveSrcRequire(_path, opt);
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
				warn('root:%s isn\'t a directory', root);
			}
		}
	} else {
		warn('root path:%s not exist', root);
	} 
}

function combineJs(encoding) {
	for(var prop in moduleCache) {
		if (moduleCache.hasOwnProperty(prop)) {
			var content = '';
			_combineJs.trace = {};
			_combineJs.trace[prop] = true;
			var content = _combineJs(prop, encoding, moduleCache[prop].indeep) + buildMainWrap(prop, moduleCache[prop].deps, moduleCache[prop].fn);
			moduleCache[prop].buildContent = content;
		}
	}
}

function buildDepWrap(from, to, fn) {
	var _relativePath = path.relative(path.dirname(from), to).split('.js')[0];
	if (!_isRelativePath(_relativePath)) {
		_relativePath = './' + _relativePath;
	}
	return buildMainWrap(to, moduleCache[to].deps, moduleCache[to].fn, _relativePath);
}

function buildMainWrap(prop, deps, fn, name) {
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
	return '\n;define(' + (name ? '\"'+ name +'\",' : "") + '[' + (mod.fn.length === 1 ? ['\"require\"'] : ['\"require\"', '\"exports\"', '\"module\"']).concat(_deps) + '],' + fn.toString() + ')'; 
}

function _combineJs(path, encoding, indeep){
	var deps = moduleCache[path].deps;
	var content = '';
	if (!deps) {
		warn('---No This Module:%s---', path);
		return '';
	}
	for(var i = deps.length; i--;) {
		if (_combineJs.trace[deps[i]]) {
			continue;
		} else {
			_combineJs.trace[deps[i]] = true;
		}
		content += buildDepWrap(path, deps[i], moduleCache[deps[i]].fn);
		if (indeep) {
			content += _combineJs(deps[i], encoding, indeep);
		} else {
			return '';
		}
		
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


function resolveTplInclude(name, filename) {
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
    , encodeHtmlFn = '\nfunction $encodeHtml(str) {\n\treturn (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;").replace(/\'/g, "&#39;").replace(/"/g, "&quot;");\n}\n';

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
          break;
      }
      var end = str.indexOf(close, i)
        , js = str.substring(i, end)
        , start = i
        , include = null
        , n = 0;
      if (0 == js.trim().indexOf('include')) {
        var name = js.trim().slice(7).trim();
        if (!filename) throw new Error('filename option is required for includes');
        var path = resolveTplInclude(name, filename);
        include = fs.readFileSync(path, 'utf8');
        include = arguments.callee(include, { filename: path, _with: false, open: open, close: close, compileDebug: compileDebug, consumeEOL: consumeEOL,included: true});
        if(!moduleCache[path]) {
			moduleCache[path] = {fn:'function(require){ return { render: function(locals){' + include + '}}',deps:[]};
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

function copyFiles(from, dest, encoding) {
	for(var prop in moduleCache) {
		if (moduleCache.hasOwnProperty(prop)) {
			var _path = prop.replace(from, dest);
			var dirname = path.dirname(_path);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(path.dirname(_path));
			}
			if (path.extname(prop) == '.js') {
				fs.writeFileSync(_path, moduleCache[prop].buildContent, {encoding: 'utf-8'});
			} else if (!/\.tpl\.html?$/.test(prop)) {
				//fs
			}
		}
	}
}

module.exports = function(grunt) {
	grunt.registerMultiTask('ACE', 'ACE for package', function() {
		var options = this.options({});
		var taskType = this.target.split('-')[0];
		switch(taskType) {
			case 'scan':
				scanAll(options);
				break;
			case 'copy':
				copyAll(options);
				break;
		}
	});

	function scanAll(options) {
		rootScanner(options.root, options.encoding);
	}

	function copyAll(options) {
		combineJs(options.encoding);
		copyFiles(options.root, options.dest, options.encoding);
	}
}