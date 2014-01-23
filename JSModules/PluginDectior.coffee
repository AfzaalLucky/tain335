define (require)->
	_hasFFPlugin = (@name)->
		for item in navigator.plugins
			if item.name.toLowerCase().indexOf(name) > -1
				return true
		false

	_hasIEPlugin = (name)->
		try
			new ActiveXObject name
			return true
		catch e
			return false
		

	hasFlash : (name)->
		result = _hasFFPlugin 'Flash'
		if not result
			result = _hasIEPlugin "ShockwaveFlash.ShockwaveFlash"
		result