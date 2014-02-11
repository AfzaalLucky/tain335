
;define("./main.tpl.html",["require","exports","module","./C","./mod/E"],function(require){ return { render: function(locals){
function $encodeHtml(str) {
	return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}
var buf = [];
with (locals || {}) { (function(){ 
buf.push('');if (user) {; buf.push('<h2>', $encodeHtml(user.name), '</h2><h2>',user.name,'</h2><h2>',user.name,'</h2><h2>',user.name,'</h2>');}; buf.push('' + (function(){var buf = [];
buf.push('');var C = require('./C'); buf.push('');var E = require('./mod/E'); buf.push('');if (user) {; buf.push('<h2>', $encodeHtml(user.name), '</h2>');}; buf.push('');
return buf.join('');})() + ''); })();
}
return buf.join('');}}})
;define("./mod/E",["require"],function (require){
 	//var C = require('./../D');
})
;define("./C",["require"],function (require){
	//wewe
})
;define(["require","./main.tpl.html","./main.tpl.html"],function (require){
 	var tpl = require('./main.tpl.html');
 	//var E = require('./mod/E');
})