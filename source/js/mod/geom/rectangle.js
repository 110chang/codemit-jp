// #######################################
//
//   mod/geom/Rectangle
//
// #######################################

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/point'
], function(inherit, compare, Point) {
	var Rectangle = {
			x		 : 0,
			y		 : 0,
			width	 : 100,
			height	 : 100,
			center	 : null,
				
			init: function(x, y, width, height) {
				this.x		 = x || 0;
				this.y		 = y || 0;
				this.width	 = width || 100;
				this.height	 = height || 100;
				this.center  = inherit(Point).init(this.x + this.width / 2, this.y + this.height / 2);
				
				return this;
			},
			getCenter: function() {
				return this.center;
			},
			translate: function(x, y) {
				if (typeof x !== 'number' || typeof y !== 'number') {
					 throw 'arguments must be Number.';
				}
				this.x += x;
				this.y += y;
			},
			contain: function(point) {
				if (!compare(Point, point)) {
					throw 'arguments must be Point.';
				}
				return (this.x <= point.x && point.x <= this.x + this.width) && (this.y <= point.y && point.y <= this.y + this.height);
			},
			collapse: function(rect) {
				if (!compare(this, rect)) {
					throw 'arguments must be Rectangle.';
				}
				var lt = inherit(Point).init(rect.x, rect.y),
					rt = inherit(Point).init(rect.x + rect.width, rect.y),
					rb = inherit(Point).init(rect.x + rect.width, rect.y + rect.height),
					rt = inherit(Point).init(rect.x, rect.y + rect.height);
				
				return this.contain(lt) || this.contain(rt) || this.contain(rb) || this.contain(rt);
			}
		};
	
	return Rectangle;
});