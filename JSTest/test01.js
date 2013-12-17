//从一个对象删除一个属性 并不影响原型链
var o = {name : "haha"};
var o2 = Object.create(o);
console.log(o2.name);
delete o2.name;
console.log(o2.name);
delete o.name;
console.log(o2.name);