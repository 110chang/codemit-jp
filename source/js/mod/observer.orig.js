// #######################################
//
//   Observer
//
// #######################################

define([], function () {
	var Observer = {
		stack: {
			any: []
		},
		addListener: function (type, fn, context) {
			type = type || 'any';
			fn = typeof fn === 'function' ? fn : context[fn];
			
			if (typeof this.stack[type] === 'undefined') {
				this.stack[type] = [];
			}
			
			if (this.stack[type].length > 0) {
				if (this.stack[type][0].fn === fn && this.stack[type][0].context === context) {
					return;
				}
			}
			//console.log(this.stack[type].fn + '===' + fn);
			this.stack[type].push({
				fn: fn,
				context: context || this
			});
		},
		removeListener: function (type, fn, context) {
			this.resolveObserver('unsubscribe', type, fn, context);
		},
		dispatch: function (type, data) {
			this.resolveObserver('publish', type, data);
		},
		resolveObserver: function (action, type, arg, context) {
			var type = type || 'any',
				listener = this.stack[type],
				max = listener ? listener.length : 0,
				i = 0;
				
			for (; i < max; i++) {
				if (action === 'publish') {
					listener[i].fn.call(listener[i].context, arg);
				} else {
					if (listener[i].fn === arg && listener[i].context === context) {
						stack.splice(i, 1);
					}
				}
			}
		}
	};
	
	return Observer;
});
