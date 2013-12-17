obj = {obj:1 , yu:2};
objc = Object.create(obj);
console.log(objc.obj);
obj.obj = 22;
console.log(objc.hasOwnProperty("obj"));
console.log(objc.obj);