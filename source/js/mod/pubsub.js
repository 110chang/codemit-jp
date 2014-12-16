/*
*
*   PubSub r1
*
*   @author Yuji Ito @110chang
*   via "Learning JavaScript Design Patterns" by Addy Osmani
*
*/

define([], function() {
	var _uid = -1,
		
		PubSub = {
			topics: null,
			
			init: function() {
				this.topics = {};
				
				return this;
			},
			publish: function(topic, args) {
				if (!this.topics[topic]) {
					return false;
				}
				
				var subscribers = this.topics[topic],
					len = subscribers ? subscribers.length : 0,
					context, func;
				
				while (len--) {
					context = subscribers[len].context || undefined;
					func = subscribers[len].func;
					
					if (context === undefined) {
						func(topic, args);
					} else {
						context[func].call(context, topic, args);
					}
				}
			},
			subscribe: function(topic, func, context) {
				if (!this.topics[topic]) {
					this.topics[topic] = [];
				}
				
				var token = (++_uid) + '',
					subscriber = {};
				//console.log(_uid);
				if (typeof func === 'string' && context !== undefined) {
					subscriber = {
						token: token,
						context: context,
						func: func
					}
				} else if (typeof func === 'function') {
					subscriber = {
						token: token,
						func: func
					}
				}
				
				this.topics[topic].push(subscriber);
				
				return token;
			},
			unsubscribe: function() {
				var i = 0;
				
				if (arguments.length === 1) {
					var token = arguments[0], m;
					
					for (m in this.topics) {
						if (this.topics[m]) {
							for (; i < this.topics[m].length; i++) {
								if (this.topics[m][i].token === token) {
									this.topics[m].splice(i, 1);
									
									return token;
								}
							}
						}
					}
				} else if (arguments.length === 2) {
					var topic = arguments[0],
						func = arguments[1];
					
					if (this.topics[topic]) {
						for (; i < this.topics[topic].length; i++) {
							if (this.topics[topic][i].func === func) {
								this.topics[topic].splice(i, 1);
								
								return token;
							}
						}
					}
				}
				
				return this;
			}
		};
	
	return PubSub;
});
