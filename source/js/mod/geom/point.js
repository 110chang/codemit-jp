/*
*
*   geom.Point r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare'
], function(inherit, compare) {
	var Point = {
			x: 0,
			y: 0,
			
			init: function(x, y) {
				this.x = x || 0;
				this.y = y || 0;
				
				return this;
			},
			translate: function(x, y) {
				if (typeof x !== 'number' || typeof y !== 'number') {
					 throw "arguments must be Number.";
				}
				this.x += x;
				this.y += y;
				
				return this;
			},
			slopeBetween: function(point) {
				if (!compare(this, point)) {
					 throw "arguments must be Point.";
				}
				return (point.y - this.y) / (point.x - this.x);
			},
			angleBetween: function(point, asRadian) {
				if (asRadian === undefined) { asRadian = true; }
				if (!compare(this, point)) {
					 throw "arguments must be Point.";
				}
				var radian = Math.atan2(point.y - this.y, point.x - this.x);
				return (asRadian) ? radian : radian * 180 / Math.PI;
			},
			distanceTo: function(point) {
				if (!compare(this, point)) {
					 throw "arguments must be Point.";
				}
				return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
			},
			middlePointOf: function(point) {
				if (!compare(this, point)) {
					 throw "arguments must be Point.";
				}
				return inherit(Point).init((this.x + point.x) / 2, (this.y + point.y) / 2);
			},
			toString: function() {
				return '( ' + this.x + ', ' + this.y + ' )';
			}
		};
	
	return Point;
});
