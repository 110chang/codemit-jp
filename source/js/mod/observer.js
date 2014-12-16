// #######################################
//
//   Observer
//
// #######################################

define([], function () {
	var Subject = {
			observers: inherit(ObserverList),
			
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
		},
		ObserverList = {
			observerList: [],
			
			add: function(obj) {
				return this.observerList.push(obj);
			},
			empty: function() {
				this.observerList = [];
			},
			count: function() {
				return this.observerList.length;
			},
			get: function(index) {
				if (index > -1 && index < this.observerList.length) {
					return this.observerList[index];
				}
			},
			insert: function(obj, index) {
				var pointer = -1;
				
				if (index === 0) {
					this.observerList.unshift(obj);
					poiner = index;
				} else if (index === this.observerList.length) {
					this.observerList.push(obj);
					pointer = index;
				}
				
				return pointer;
			},
			indexOf: function(obj, startIndex) {
				var i = startIndex || 0,
					pointer = -1;
				
				while (i < this.observerList.length) {
					if (this.observerList[i] === obj) {
						pointer = i;
					}
					i++;
				}
				
				return pointer;
			},
			removeIndexAt: function(index) {
				if (index === 0) {
					this.observerList.shift();
				} else if (index === this.observerList.length - 1) {
					this.observerList.pop();
				}
			}
 		}
	
	return Subject;
});
