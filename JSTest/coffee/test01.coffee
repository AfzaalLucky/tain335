square = (x) -> x * x;

fill = (container , liquid = "coffee") -> "Filling thie #{container} with #{liquid}"

singers = 
	Jagger: "Rock"
	Elvis : "Roll"

Kids = 
	brother:
		name:"Max"
		age:11
	sister:
		name:"Ida"
		age:9

$('.account').attr class:
						text:'like'
						life:'life'

outer = 1
changeNumbers = ->
	inner = -1
	outer = 10
inner = changeNumbers()

mood = greatlyImproved if singing

if happy and knowsIt
	clapsHands()
	chaChaCha()
else
	showIt()

date = if friday then sue else jill

gold = silver = rest = "unknow"

awardMedals = (first , second, others...) ->
	gold = first
	silver = second
	rest = others

eat food for food in['toast' , 'cheese' , 'wine']

foods = ['broccoli' , 'spinach' , 'chocolate']

eat food for food in foods when food isnt 'chocolate'

shortNames = (name for name in list when name.length < 5)

countdown = (num for num in [10..1])

evens = (x for x in [0..10] by 2)

yearsOld = max:10,ida:9,tim:11

ages = for child ,age of yearsOld
	"#{child} is #{age}"

ages = for own child , age of yearsOld
	"#{child} is #{age}"


if this.studyingEconomics 
	buy() while supply > demand
	sell() while supply > demand

num = 6
lyrics = while num -= 1
	"#{num} little mokeys , jumping on the bed"

unless true then "false"

if not true then "false"

my = "my string"[0..1]

if "1" == 1
	console.log "equal"
else
	console.log "not equal"

console.log "ll" unless true

console.log "dd" if d?
my or= {}

my.hasword()?.poke()

my.hasword?();

switch day 
	when "Sun" then console.log 'go relax'
	when "Sat" then console.log 'go dancing'
	else console.log 'go lang'

sum = (x , y) -> x + y

times = (a = 1 , b = 2) -> a * b
