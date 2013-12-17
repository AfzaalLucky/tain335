Pubsub = 
	subscribe : (ev, callback)->
		calls = @_callback or= {}
		(@_callback[ev] or= []).push callback
		@
	publish : ->
		args = Array::slice.call arguments,0
		ev = args.shift()
		if !@_callback 
			return @
		if !@_callback[ev]
			return @
		list =  @_callback[ev]
		for item in list
			item.apply(@,arguments)
		@

Pubsub.subscribe "wem",()->console.log "Wem!"
Pubsub.publish("wem")