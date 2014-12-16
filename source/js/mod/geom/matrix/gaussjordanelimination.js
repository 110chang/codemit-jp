/*
*
*   geom.Matrix.GuassJordanElimination r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/Matrix'
], function(inherit, compare, Matrix) {
	var GuassJordanElimination = {
			x: 0,
		 	y: 0,
		 	magnitude: 0,
		 	direction: 0,
		 	
		 	init: function(a, b, result) {
			 	
				return this;
		 	},
		 	regulatePivot: function() {
			 	
		 	},
		 	sweep: function() {
			 	
		 	}
		};
	
	return GuassJordanElimination;
});