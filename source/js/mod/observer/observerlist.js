// #######################################
//
//   Observer.ObserverList
//
// #######################################

define([], function() {
	var ObserverList = {
		observerList: null,
		
		init: function () {
			this.observerList = [];
			
			return this;
		},
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
			var pointer = -1,
				leftPart = [],
				rightPart = [];
			
			if (index === 0) {
				this.observerList.unshift(obj);
				poiner = index;
			} else if (index === this.observerList.length) {
				this.observerList.push(obj);
				pointer = index;
			} else if (index > 0 && index < this.observerList.length) {
				leftPart = this.observerList.slice(0, index);
				rightPart = this.observerList.slice(index);
				
				this.observerList = leftPart.concat(obj).concat(rightPart);
				//console.log(this.observerList);
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
			} else if (index > 0 && index < this.observerList.length) {
				leftPart = this.observerList.slice(0, index);
				rightPart = this.observerList.slice(index + 1);
				
				this.observerList = leftPart.concat(rightPart);
			}
		}
	};
	
	return ObserverList;
});
