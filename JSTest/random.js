var pswMap = {}
function random(arr,pre) {
    if(!arr.length){
        return
    }
    if(arr.length === 1) {
        pre.push(arr[0]);
        if(!pswMap[pre.join('')]){
            pswMap[pre.join('')] = true;
            console.log(pre.join(''));
        }
        return
    }   
    for(var i = 0; i < arr.length; i++) {
        var arrCp = arr.slice(0);
        var preCp = pre.slice(0);
        arrCp.splice(i,1);
        preCp.push(arr[i]) 
        random(arrCp,preCp);
    }
}
random([1,1,2,2,9,9],[])