var funs = [];
for(var i = 0 ; i<10 ; i++){
	funs.push(function(i){
		console.log("--->" + i);
	});
}
for( k = 0 ; k < funs.length ; k++){
	funs[k]();
}