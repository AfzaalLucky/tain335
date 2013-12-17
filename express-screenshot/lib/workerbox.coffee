module.exports = (()->
	configMod = require './config'
	jobPool = require './jobPool'
	statistics = require './statistics'
	statistics.expect 1000
	config = configMod.get()
	class WorkerBox
		constructor:(conn , socket)->
			@socket = socket
			@conn = conn
			@windowSize = config.workerConf.windowSize
			@boxDelivers = config.boxDelivers
			@boxblock = config.boxblock
			@expressbox = []
			@mailbox = []
			@tracebox = {}
			configMod.on 'set',(opts)=>
				@boxDelivers = config.boxDelivers
				if opts.boxblock && opts.boxblock isnt @boxblock
					clearInterval @_task
					@config()

			conn.addListener 'message',(msg)=>
				@receive(msg)
			conn.addListener 'close',->

			@config(config.workerConf);

		send:(data)->
			if(data.length)
				@_send
					method:'POST'
					jobList:data
				for job in data
					@tracebox[job.id] = job
				console.log 'has sent ' + data.length
				data.length = 0


		receive:(msg)->
			msg = JSON.parse msg
			if msg.method is "READY"
				console.log 'worker is ready ' + @conn.id
				@_init()
			else if msg.method is "ADJUST"
				#console.log 'adjust windowSize is ' + msg.windowSize
				statistics.statistics(msg.ackList.length)
				if msg.ackList.length
					console.log 'ack jobs ' + msg.ackList.length
					@_ackJobs msg.ackList
				@windowSize = msg.windowSize

			else if msg.method is "LOG"
				console.log 'conn.id:' + @conn.id + '   ' + msg.msg

		add:(job)->
			if !job
				return
			if @windowSize <= 0
				console.log '----------cache job-------------'
				jobPool.push job
				return 
			@mailbox.push job
			if @mailbox.length > @windowSize
				@send(@mailbox)
				return

		_init:()->
			@_task = setInterval (()=>
				if @expressbox.length
					@send @expressbox
				else if @mailbox.length
					@send @mailbox)
				,@boxblock
			router = require './router'
			router.addToBoxList @
		config:(opts)->
			@_send
				method:'CONFIG'
				opts:opts 

		_send:(data)->
			if(data)
				@socket.send @conn.id,JSON.stringify data			
				#console.log 'send conn.id:' + @conn.id + '---' + data

		_ackJobs:(ackList)->
			for job in ackList
				@tracebox[job.jobId] = null
				delete @tracebox[job.jobId]

		express:(job)->
			if !job
				return

		unBox:->
			console.log 'unBoxing ... ' + @conn.id
			@conn.removeAllListeners()
			clearInterval @_task
			for job in @mailbox
				jobPool.unshift job
			for key , val of @tracebox
				jobPool.unshift val
			console.log 'jobPool count:' + jobPool.count()
	)()