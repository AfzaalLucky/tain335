module.exports = (->
	WorkerBox = require './workerbox'
	crypto = require 'crypto'
	emitter = new (require('events').EventEmitter)()
	boxList = []
	boxMap = {}
	addToBoxMap = (conn , socket)->
		box = new WorkerBox conn,socket
		boxMap[conn.id] = box
		console.log 'add new connection ' + conn.id + ' list index:'+box.index

	addToBoxList = (box)->
		box.index = boxList.push(box) - 1
		console.log 'add worker list index is ' + box.index

	dispatch = (job)->
		target = crypto.pseudoRandomBytes(32)[1]%boxList.length
		#console.log 'target is ' + target
		boxList[target].add job

	removeBox = (conn)->
		#console.log 'try remove conn.id ' + conn.id
		box = boxMap[conn.id]
		if box
			console.log 'remove connection ' + conn.id
			if box.index
				boxList.splice boxMap[conn.id].index,1
			boxMap[conn.id].unBox()
			boxMap[conn.id] = null;
			delete boxMap[conn.id]

	next = (index)->
		#console.log index
		boxList[(index + 1)%boxList.length]

	emitter.on 'dispatch' , dispatch
	
	next:next 
	addToBoxMap:addToBoxMap
	addToBoxList:addToBoxList
	dispatch:dispatch
	removeBox:removeBox
	on:emitter.on.bind emitter
	off:emitter.removeListener.bind emitter
	emit:emitter.emit.bind emitter
	)()
