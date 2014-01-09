Singleton = (function(){
	var instance;

	function _init(){
		return {
			'text':'i am Singleton'
		}
	}

	return {
		function getInstance(){
			if(!instance){
				instance = _init();
			}
			return instance
		}
	}
})();