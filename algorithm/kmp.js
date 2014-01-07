(function(str){
	var next = [];
	next[0] = -1;
	next[1] = 0;
	var k = 1;
	var i = 0;
	for(;k < str.length - 1;){
		if(str[i] == str[k]){
			next[k + 1] = next[k] + 1;
			i++;
		}else{
			next[k+1] = next[next[k]] + 1;
		}
		k++;
	}
	console.log(next);
})('abaababc')