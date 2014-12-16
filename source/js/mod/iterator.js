/*
*
*   Iterator r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var Iterator = {
			data: [],
			index: 0,
			length: 0,
			
			init: function(_data) {
				if (_data === undefined) {
					throw new Error('Require any data.');
				}
				this.data   = _data;
				this.length = _data.length;
				
				return this;
			},
			next: function() {
				return this.data[this.index++];
			},
			current: function() {
				return this.data[this.index];
			},
			rewind: function() {
				this.index = 0;
			},
			hasNext: function() {
				return this.index < this.length;
			}
		};
	
	return Iterator;
});