var i = 0, j = 0, k = 0, max = 60;
var tmout = setInterval(function() {
  console.log('setInterval :', i++);
  if (i > max) clearTimeout(tmout);
}, 0);



process.nextTick(nxt);
console.log('--------------------->');
(function f() {
  setImmediate(function () {
    console.log('setImmediate :', j++);
    if (j > max) return;
    f();
  });
})()

function nxt() {
	console.log('nextTick', k++);
	if (k < max) process.nextTick(nxt)
}