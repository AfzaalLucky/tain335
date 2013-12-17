jQuery = 
	extend : (sub , sup)->
		for val in sup
			if sup.hasOwnProperty(val)
				sub[val] = sup[val]
Math.guid = ->
	('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g , (c)->
		r = Math.random()*16|0
		v = if c is 'x' then r else (r&0x3|0x8)
		v.toString 16).toUpperCase()


#普通对象充当构造方法
Model = #Class类型类
	inherited : ->console.log "inherited"
	created: ->console.log "created"
	prototype : 
		init:->console.log "init"
	create:->#创建类
		obj = Object.create @
		obj.parent = @#类似java的super
		console.log obj.parent is obj.__proto__
		obj:: = Object.create @::
		obj.created()
		@inherited obj
		obj
	init :->#静态方法 创建类的对象
		instance = Object.create(@::)
		instance.parent = @
		instance.init.apply instance,arguments #调用实例方法
		instance
	extend:(o)->
		extended = o.extended
		jQuery.extend @,o
		if extended
			extended @
	include :(o)->
		included = o.included
		jQuery.extend @::,o
		if included
			included(@)


User = Model.create()
User.init()