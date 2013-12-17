function test(obj){
	return function(){
		return obj.value ;
	}
}

var o = {value : 5};
console.log(test(o)());
var t = test(o);
o.value = 10;
console.log(t());