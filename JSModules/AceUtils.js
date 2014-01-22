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
});