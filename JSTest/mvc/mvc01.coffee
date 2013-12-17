Class = (parent)-> 

	klass = ->
		###
		为了将参数原原本本地传给方法
		###
		@init.apply(@,arguments)
	###
	为了清空对象属性
	###
	if parent
		subclass = ->
		subclass:: = parent::
		klass:: = new subclass
	###
	默认是空的init函数
	###
	klass::init = ->	
	klass::parent = klass
	klass.extend = (obj)->
		extended = obj.extended
		for key,val of obj
			klass[key] = val
		if extended
			extended klass 
	klass.include = (obj)->
		included = obj.included
		for key ,val of obj
			klass::[key] = val
		if included
			included klass
	klass.proxy = (func) ->
		=>func.apply @,arguments
	klass::proxy = klass.proxy
	klass

Person = new Class
Person::init = ->console.log "do something"
Person.include
	save: ->console.log "save a new record"
	included : (x)->console.log  x,"was included"
person = new Person
person.save()
###
静态方法(不推荐)
###
#Person.find = (id)->
	#console.log "find person by id"

###
实例方法(不推荐)
###
#Persion::save = ->
	#console.log "save person"

Animal = new Class
Animal.include
	breath:->console.log 'breath'
Cat = new Class(Animal)
cat = new Cat
cat.breath()
