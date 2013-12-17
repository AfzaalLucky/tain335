mpg123n = require 'mpg123n'
mp3info = require 'mp3info'

player = new mpg123n.Player

mp3info '/home/paul/mvcproject/betty.mp3',(err,data)->
	if err
		console.log err
	console.log data

player.play '/home/paul/mvcproject/betty.mp3'

setTimeout (->
	player.pause()
	#player.play '/home/paul/mvcproject/betty.mp3'
	),
	5000

setTimeout (->
	player.pause()
	#player.play '/home/paul/mvcproject/betty.mp3'
	),
	12000
