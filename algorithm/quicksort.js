(function(){
	function exchange(arr, i , j){
		var tmp = arr[j];
		arr[j] = arr[i];
		arr[i] = tmp;
	}
	function partition(arr, i, j){	
		var flag = true;
		while(i < j){
			if(flag){
				if(arr[j] < arr[i]){
					exchange(arr, i, j);
					i++;
					flag = false;
					continue;
				}
				j--;
			}else{
				if(arr[i] > arr[j]){
					exchange(arr, i, j);
					j--;
					flag = true;
					continue;
				}
				i++;
			}
		}
		return i;
	}

	function quickSort(arr, p, r){
		var i = p;
		if(p < r){
			p = partition(arr, p, r);
			quickSort(arr, i, p);
			quickSort(arr, p+1, r);
		}
	}

	var arr = [3 , 15 , 2 , 8 , 12, 10];
	quickSort(arr, 0, arr.length - 1);
	console.log(arr);
})()

