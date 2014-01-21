define(function(require) {

	function bind(fn, context) {
		return function() {
			fn.apply(context, arguments);
		}
	}

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
});