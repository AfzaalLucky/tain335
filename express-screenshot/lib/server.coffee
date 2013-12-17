module.exports = (()->
	ws = require 'websocket-server'
	configMod =  require './config'
	spawn = require('child_process').spawn
	router = require './router'
	config = configMod.get()

	wsserver = 
		init: ()->
			@socket = ws.createServer()
			@socket.addListener 'connection',(conn)=>
				router.addToBoxMap conn,@socket
				conn.addListener 'close',()->
					router.removeBox conn
			@socket.listen config.wsPort

	workerMan =
		sub:'w',
		mid:0,
		init:()->
			while config.workerNum--
				@createWorker()
		getId:()->
			this.sub + @mid++ + Math.round Math.random() * 10
		createWorker:()->
			id = @getId()
			console.log 'createWorker ' + id
			worker = spawn 'phantomjs' , [ __dirname + '/worker.js','--disk-cache=true']
			worker.on 'close' , (code)->
				console.log code
				console.log 'worker ' + id + ' died'

	acceptJob = (job)->
		router.emit 'dispatch',job

	acceptJob:acceptJob
	initServer:wsserver.init.bind wsserver
	initWorker:workerMan.init.bind workerMan
)()

