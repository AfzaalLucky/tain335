webpage = require 'webpage'
fetch = require './fetch'
config = 
	wsProto: 'ws://'
	wsRemote: 'localhost'
	wsPort: 3001
	maxJob: 100
	viewportSize:
	    width: 1024 
	    height: 600
	clipRect: 0
	zoomFactor: 0
	javascriptEnabled: false
	windowSize: 60

bufferPool = []
currentNum = 0
ackList = []
pages = []

dojob = (job)->
		if pages.length
			#client.log 'pages ' + pages.length
			page = pages.pop()
		else
			page = webpage.create()
		jobId = job.id
		url = job.url
		imagePath = job.image
		content = job.content
		viewportSize = job.viewportSize || config.viewportSize
		clipRect = job.clipRect || config.clipRect
		zoomFactor = job.zoomFactor || config.zoomFactor
		page.settings = 
			javascriptEnabled: job.javascriptEnabled || config.javascriptEnabled
			loadImages: true
			userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/1.9.0'
		currentNum++
		page.open url,(status)->
			if status is "fail"
				data = 
					id : jobId
					url: url
					status: false
			else
				page.render imagePath + jobId + '.png'
				if content 
					fetchObj = fetch page.content
					data = 
						jobId: jobId
						url: url
						title: fetchObj.title
						description: fetchObj.description
						image: imagePath
						status: true
				else
					data = 
						jobId: jobId
						url: url
						status: true
			#page.close()
			currentNum--
			ackList.push data
			pages.push page
			_checkBufferPool()
			#socket communication

calProductivity = ()->
	productivity = (currentNum/config.maxJob)*0.75 + (bufferPool.length/config.maxJob)*0.5
	#client.log 'productivity:' + productivity
	productivity

calWindowSize = ()->
	#console.log config.windowSize
	windowSize = Math.round(config.windowSize * (1 - calProductivity())) 
	#client.log 'adjust windowSize:' + windowSize
	windowSize

_checkBufferPool = ()->
	while currentNum < config.maxJob and (job = bufferPool.shift())
		dojob job
		

beginJob = (jobList)->
	for job in jobList
		if currentNum < config.maxJob
			dojob(job)
		else 
			bufferPool.push job

client = 
	connect:->
		console.log config.wsProto + config.wsRemote + ':' + config.wsPort + '/'
		@websocket = new WebSocket config.wsProto + config.wsRemote + ':' + config.wsPort + '/'
		@websocket.onopen = (evt)=>
			@shutdown = false
		@websocket.onmessage = (evt)=>
			@onMessage(evt)
		@websocket.onerror = (evt)=>
		@websocket.onclose = ()=>
			if !@shutdown
				#try reconnet only one time
				setTimeout ()=>
						@connect()
					,500
			else
				phantom.exit()


	onMessage: (evt)->
		data = JSON.parse evt.data
		if data.method is "POST"
			beginJob data.jobList
		else if data.method is "CLOSE"
			phantom.exit
		else if data.method is "CONFIG"
			config = data.opts
			#console.log('receive config:' + config);
			@ready();

	ready:->
		@websocket.send JSON.stringify
								method:'READY'
		@_interval = setInterval (()=>
						@adjust calWindowSize()
					),200

	adjust:(size)->
		@websocket.send JSON.stringify
								method: 'ADJUST'
								ackList: ackList
								windowSize : size
		ackList.length = 0

	log:(msg)->
		@websocket.send JSON.stringify
								method: 'LOG'
								msg: msg
client.connect()




