class Main extends Spine.Controller
	constructor:->
		super
		Task.bind('create' , @addOne)
		Task.bind('refresh' , @addAll)
		Task.fetch()
	addOne:(task) =>
		view = new Task(item : task)
		@append(view.render())
	addAll:=>
		Task.each(@addOne)