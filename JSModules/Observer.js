var ObserverList = (function() {
	function _ObserverList() {
		this.list = []
	}

	_ObserverList.prototype.add = function(obj) {
		this.list.push(obj);
	}

	_ObserverList.prototype.remove = function(index) {
		this.list.splice(index, 1);
	}

	_ObserverList.prototype.count = function(){
		return this.list.length;
	}

	_ObserverList.prototype.get = function(index) {
		return this.list[index]
	}

	_ObserverList.prototype.clear = function(){
		this.list.length = 0;
	}

	_ObserverList.prototype.indexOf = function(startIndex, obj){
		if(!obj){
			return -1;
		}
		if(startIndex > this.list.length){
			return -1;
		}
		while(startIndex < this.list.length){
			if(this.list[startIndex] === obj){
				return startIndex;
			}
			startIndex++;
		}
		return -1;
	}

	_ObserverList.prototype.each = function(func){
		if(func){
			this.list.each(func);
		}
	}

	return _ObserverList;
})();


var Subject = (function(){
	function _Subject(){
		this.observerList = new ObserverList();
	}

	_Subject.prototype.addObserver = function(observer){
		this.observerList.add(observer);
	}

	_Subject.prototype.removeObserver = function(index){
		this.observerList.remove(index);
	}

	_Subject.prototype.clear = function(){
		this.observerList.clear();
	}

	_Subject.prototype.notify = function(context){
		for(var _i = 0, len = this.observerList.length; _i < len; _i++){
			this.observerList[_i].update(context);
		}
	}
})();

var Observer = (function() {
	function _Observer(){
		this.update = function() {
			//update
		}
	}

	return _Observer;
})();