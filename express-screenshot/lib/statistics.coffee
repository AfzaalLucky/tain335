module.exports = (->	
	expects = []
	statistics = (increment , start)-> 
		totalFinished += increment
		#console.log totalFinished
		for exp in expects
			if totalFinished >= exp
				console.timeEnd 'Test'

	expect = (exp)->
		expects.push exp

	inspect = ()->
		console.log 'inspect objects'

	expect:expect
	statistics:statistics
	)()