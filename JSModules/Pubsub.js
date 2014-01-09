var EventUtil = {};

(function(eventUtil){
	var topics = {};
	var subUid = 0;

	eventUtil.trriger = function(topic, context) {
		if(topics[topic]){
			for(var _i = 0, len = topics[topic].length; _i < len; _i++){
				topics[topic][_i].func(context);
			}
		}
	}

	eventUtil.on = function(topic, func){
		if(!topics[topic]){
			topics[topic] = []
		}
		var subscriber = {'token': subUid++, 'func':func};
		topics[topic].push(subscriber);
		return subscriber.token;
	}

	eventUtil.remove = function(token){
		for(var topic in topics){
			if(topics.hasOwnProperty(topic)){
				for(var _i = 0, len = topics[topic].length; _i < len; _i++){
					if(topics[topic][_i].token === token){
						return topics[topic].splice(_i, 1);
					}
				}
			}
		}
	}
})(EventUtil);