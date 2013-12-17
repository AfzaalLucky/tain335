console.log ['ff' , 'dd' , 'ee' , 'tt'].slice(2).join(',')

outer = 1
inner = 2
changeNumbers = ->
	inner = -1
	outer = 10
inner = changeNumbers()