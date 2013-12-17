function add(v1 , v2){
	return v1 + v2;
}
var myObject = {};
myObject.double = function(){
	var that  = this;
	var helper = function(){
		that.value = add(that.value , that.value);
	};
	helper();
};

myObject.value = 5;
myObject.double();
console.log(myObject.value);