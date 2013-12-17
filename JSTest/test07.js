function Foo1(){

}

function Foo2(){

}

var f1 = new Foo1();

Foo2.prototype =  f1;

var f2 = new Foo2();

console.log(f2.constructor ===  Foo2);
console.log(f2.constructor === Foo1);