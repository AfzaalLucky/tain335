define (require)->
	addHandler: (el, type, handler, isBubbled)->
		if el.addEventListener then el.addEventListener type, handler, isBubbled
		else if el.attachEvent then el.attachEvent 'on'+type, handler
		else el['on' + type] = handler

	removeHandler: (el, type, handler)->
		if el.removeEventListener then el.removeEventListener type, handler, isBubbled
		else if el.detachEvent 'on'+type, handler then el.detachEvent 'on'+type, handler
		else el['on' + type] = null

	getEvent: (event)->
		if event then event else window.event

	getTarget: (event)->
		event.target or event.srcElement

	preventDefault: (event)->
		if event.preventDefault then event.preventDefault()
		else event.returnValue = false

	stopPropagation: (event)->
		if event.stopPropagation then event.stopPropagation()
		else event.cancelBubble = false

