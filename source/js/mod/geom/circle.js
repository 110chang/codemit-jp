// #######################################
//
//   mod/geom/Circle
//
// #######################################

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/point',
	'mod/geom/matrix'
], function(inherit, compare, Point, Matrix) {
	var Circle = {
			x		 : 0,
			y		 : 0,
			radius	 : 100,
			center	 : null,
					
			init: function(x, y, radius) {
				this.x		 = x || 0;
				this.y		 = y || 0;
				this.radius	 = radius || 1;
				this.center  = inherit(Point).init(this.x, this.y);
				
				return this;
			},
			getCenter: function(){
				return this.center;
			},
			translate: function(x, y) {
				if (typeof x !== 'number' || typeof y !== 'number') {
					 throw 'arguments must be Number.';
				}
				var origin = inherit(Matrix).init([[this.x], [this.y], [1]]),
					trans  = inherit(Matrix).init([[1, 0, x], [0, 1, y], [0, 0, 1]]),
					result = trans.multiply(origin);
					
				this.x = result.get();
				this.y = result.get(1, 0); 
			},
			scaling: function(s) {
				this.radius *= s;
			},
			contain: function(point) {
				if (!compare(Point, point)) {
					throw 'arguments must be Point.';
				}
				return Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2) <= this.radius * this.radius;
			},
			collapse: function(circ) {
				if (!compare(this, circ)) {
					throw 'arguments must be Circle.';
				}
				return (Math.pow(circ.x - this.x, 2) + Math.pow(circ.y - this.y, 2)) <= Math.pow(this.radius + circ.radius, 2);
			}
		};
	
	return Circle;
});