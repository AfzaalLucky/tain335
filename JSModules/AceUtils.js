define(function(require) {
	//function binding
	function bind(fn, context) {
		return function() {
			fn.apply(context, arguments);
		}
	}

	//function curring
	function curry(fn) {
		var outterArgs = Array.prototype.slice.call(arguments, 1);
		return function() {
			var innerArgs = Array.prototype.slice.call(arguments);
			var finalArgs = outterArgs.contact(innerArgs);
			return fn.apply(null, finalArgs);
		}
	}

	function curryBinding(fn, context) {
		var outterArgs = Array.prototype.slice.call(arguments, 1);
		return function() {
			var innerArgs = Array.prototype.slice.call(arguments);
			var finalArgs = outterArgs.contact(innerArgs);
			return fn.apply(context, finalArgs);
		}
	}

	//function throttle
	function throttle(fn, context) {
		clearTimeout(fn.tId);
		fn.tId = setTimeout(function () {
			fn.call(context);
		});
	}

	function formatMsg(text, data) {
		text += '';
		if (data) {
			$.each(data, function(key, val) {
				text = text.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), val);
			});
		}
		return text;
	}

	var CookieUtil = {
		getCookie: function (name) {
			var cookieName = encodeURIComponent(name) + '=',
				cookieStart = document.cookie.indexOf(cookieName),
				cookieValue = null;

			if (cookieStart > -1) {
				var cookieEnd = document.cookie.indexOf(';', cookieStart);
				if (cookieEnd > -1) {
					cookieEnd = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.subString(cookieStart + cookieName.length, cookieEnd));
			}
			return cookieValue;
		},

		setCookie: function (name, value, expires, path, domain, secure) {
			var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			if (expres instanceof Date) {
				cookieText += '; expires=' + expires.toGMTString();
			}
			if (path) {
				cookieText += '; path=' + path;
			}
			if (domain) {
				cookieText += '; domain' + domain;
			}
			if (secure) {
				cookieText += '; secure'
			}

			document.cookie = cookieText;
		}

		unset: function (name, path, domain, secure) {
			this.set(name, "", new Date(0), path, domain, secure);
		}
	}

});