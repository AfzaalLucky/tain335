module.exports =
	wsPort: 3001
	workerNum: 2
	cache: 'local'
	boxblock:200
	scanJobPool:500
	workerConf:
		windowSize:60
		maxJob: 100
		maxQueueJob: 0
		maxCache: 10000
		viewportSize:
		    width: 1024 
		    height: 600
		clipRect: 0,
		zoomFactor: 0,
		javascriptEnabled: false 