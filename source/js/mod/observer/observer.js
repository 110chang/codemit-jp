// #######################################
//
//   Observer.Observer
//
// #######################################

define([], function() {
	var Observer = {
		update: function() {
			throw new Error('Implement a concrete function.')
		}
	};
	
	return Observer;
});
