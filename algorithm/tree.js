(function(){
	//Node Class
	function Node(name, weight) {
		this.name = name;
		this.weight = weight;
	}
	//Create a tree
	var root = new Node('A');
	root.lchild = new Node('B');
	root.rchild = new Node('C');
	root.lchild.lchild = new Node('D');
	root.lchild.rchild = new Node('E');
	root.rchild.lchild = new Node('F');
	root.rchild.rchild = new Node('G');

	function preOrder(root){
		if(!root){
			return;
		}
		_preOrder += root.name;
		preOrder(root.lchild);
		preOrder(root.rchild);
	}

	function postOrder(root){
		if(!root){
			return;
		}
		postOrder(root.lchild);
		postOrder(root.rchild);
		_postOrder += root.name;
	}

	function middleOrder(root){
		if(!root){
			return;
		}
		middleOrder(root.lchild);
		_middleOrder += root.name;
		middleOrder(root.rchild);
	}

	function buildTree(_preOrder, _middleOrder, root){
		var mpos = 0;
		while(_preOrder[0] != _middleOrder[mpos++]);
		root.name = _preOrder[0];
		if(mpos-1 == 0){
			return root;
		}
		root.lchild = buildTree(_preOrder.slice(1, mpos), _middleOrder.slice(0, mpos - 1), new Node());
		root.rchild = buildTree(_preOrder.slice(mpos, _preOrder.length), _middleOrder.slice(mpos, _middleOrder.length), new Node());
		return root;
	}

	function copyTree(from, to){
		if(!from){
			return;
		}
		to.name = from.name;
		if(from.lchild){
			to.lchild = new Node();
			copyTree(from.lchild, to.lchild);
		}
		if(from.rchild){
			to.rchild = new Node();
			copyTree(from.rchild, to.rchild);
		}
	}

	function treeLike(aTree, bTree){
		if(aTree == null && bTree == null){
			return true;
		}else if((aTree == null && bTree != null) || (aTree != null && bTree == null)){
			return false;
		}else{
			var same = treeLike(aTree.lchild, bTree.lchild);
			if(same){
				same = treeLike(aTree.rchild, bTree.lchild);
			}
			return same;
		}
	}

	var _preOrder = '';
	var _postOrder = '';
	var _middleOrder = '';

	preOrder(root);
	middleOrder(root);
	postOrder(root);
	console.log(_preOrder);
	console.log(_middleOrder);
	console.log(_postOrder);

	var _root = buildTree(_preOrder, _middleOrder, new Node());
	console.log(_root);

	var _copyTree = new Node();
	copyTree(root, _copyTree);
	console.log(_copyTree);


	function buildHuffTree(array){
		var node = new Node();
		if(array.length > 1){
			array.sort(function(a , b){
				return a.weight - b.weight;
			});
			node.weight = array[0].weight + array[1].weight;
			node.lchild = array[0];
			node.rchild = array[1];
			array.splice(0,2);
			array.push(node);
			return buildHuffTree(array);
		}else{
			node.weight = array[0];
			return node;
		}
	}

	buildHuffTree([new Node(null,12), new Node(null,6), new Node(null,56), new Node(null,45), new Node(null,23), new Node(null,24)]);

	function preOrderSeq(arr){
		if(!arr.length){
			return;
		}
		var str = [];
		var stack = [];
		var i = 1;
		str.push(arr[i]);
		i *= 2;
		while(str.length != arr.length -1){	
			console.log(stack);
			if(arr[i]){
				stack.unshift(i + 1);
			}else{
			    i = stack.shift();
			}
			str.push(arr[i]);
			i *= 2;
		}
		return str;
	}

	var str = preOrderSeq([null,'A','B','E', 'C','D','F','G']);
	console.log(str);
})()