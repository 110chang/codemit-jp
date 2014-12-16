// #######################################
//
//   Observer.Subject
//
// #######################################

define([
	'mod/inherit',
	'mod/observer/observerlist'
], function(inherit, ObserverList) {
	var Subject = {
		observers: null,
		
		init: function () {
			this.observers = inherit(ObserverList).init();
			
			return this;
		},
		addObserver: function(observer) {
			this.observers.add(observer);
		},
		removeObserver: function(observer) {
			this.observers.removeIndexAt(this.observers.indexOf(observer, 0));
		},
		notify: function(context) {
			var count = this.observers.count(),
				i = 0;
			
			for (; i < count; i++) {
				this.observers.get(i).update(context);
			}
		}
	};
	
	return Subject;
});
