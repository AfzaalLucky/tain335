(function(){

	function Node(name){
		this.name = name;
	}

	//非递归版本
	function DFSTraverse(vertex, arc, v){
		var visited = [];
		var stack = [];
		visited[v] = 1;
		stack.unshift(v);
		console.log(vertex[v].name);
		while(stack.length){
			v = stack[stack.length - 1];
			for(var j = 0; j < vertex.length; j++){
				if(arc[v][j] && !visited[j]){
					visited[j] = 1;
					stack.push(j);
					console.log(vertex[j].name);
					break;
				}
				if(j == vertex.length -1){
					stack.pop();
				}
			}
		}
	}

	//递归版本
	function DFSTraverse(){
		
	}

	var vertex = [new Node('v0'), new Node('v1'), new Node('v2'), new Node('v3')];
	var arc = new Array(4);
	arc[0] = new Array();
	arc[1] = new Array();
	arc[2] = new Array();
	arc[3] = new Array();

	arc[0][3] = 1;
	arc[0][1] = 1;
	arc[1][2] = 1;
	arc[1][3] = 1;

	arc[3][0] = 1;
	arc[1][0] = 1;
	arc[2][1] = 1;
	arc[3][1] = 1;

	DFSTraverse(vertex, arc, 0);
})();