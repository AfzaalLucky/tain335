function Foo(){}

Foo.prototype.say = function(){
	console.log("hello");
}

var f = new Foo();
f.say();