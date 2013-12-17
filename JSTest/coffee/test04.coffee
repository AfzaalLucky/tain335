theBait = 1000
theSwitch = 0

[theBait , theSwitch] = [theSwitch , theBait]


weatherReport = (location) ->
	[location , 72 , "Mostly Sun"]
[city ,temp , forecast] = weatherReport "Berkeley, CA"

futurists = 
	sculptor:"Umberto Boccioni"
	painter:"Vladimir Buriliuk"
	poet:
		name:"Ft"
		address:["Via" , "Bellagio"]

{poet:{name , address:[street , city]}} = futurists