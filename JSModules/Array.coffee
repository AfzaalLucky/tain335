define (require)->
	isArray: (obj)->
		Array.isArray or (obj)->
			Object.prototype.toString.call obj is '[object Array]'

	getArray: (arr)->
		Array.prototype.slice.call arr