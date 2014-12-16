/*
*
*   Inherit r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var inherit = function() {
		var i = 0, o = {}, F = function() {}, child, prop;
		
		for (; i < arguments.length; i++) {
			//console.log(arguments);
			for (prop in arguments[i]) {
				o[prop] = arguments[i][prop];
			}
		}
		F.prototype = o;
		child = new F();
		
		return child;
	};
	
	return inherit;
});
