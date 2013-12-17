function Test(){

}

var t1 = new Test();
console.log(t1.hasOwnProperty(constructor));

console.log(typeof Test.constructor);
var o  = {};
o.constructor =  undefined;
Test.prototype = o;
console.log(typeof o.constructor);
var t = new Test();
console.log(typeof t.constructor);