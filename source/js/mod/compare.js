/*
*
*   Compare r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var compare = function(target, original, allowInherit) {
		if (!target) {
			throw new Error('Invalid arguments.');
		}
		if (!original) {
			throw new Error('Invalid arguments.');
		}
		if (allowInherit === undefined) {
			allowInherit = true;
		}
		var o;
		
		for (o in target) {
			if (original[o] === undefined) {
				return false;
			}
		}
		// exact match
		if (!allowInherit) {
			for (o in original) {
				if (target[o] === undefined) {
					return false;
				}
			}
		}
		return true;
	};
	
	return compare;
});
