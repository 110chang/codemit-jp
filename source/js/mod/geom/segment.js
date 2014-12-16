// #######################################
//
//   mod/geom/Segment
//
// #######################################

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/vector',
	'mod/geom/point'
], function(inherit, compare, Vector, Point) {
	var Segment = {
			start     : null,
			end       : null,
			direction : 0,
			length    : 0,
			
			init: function() {
				if (arguments.length < 2) {
					throw 'Not enough arguments';
				} else if (arguments.length === 2) {
					// Type of arguments must be Geometry.Point
					if (!compare(Point, arguments[0]) || !compare(Point, arguments[1])) {
						throw 'arguments must be Point.';
					}
					this.start = arguments[0];
					this.end   = arguments[1];
					this.direction = this.start.angleBetween(this.end);
					this.length = this.start.distanceTo(this.end);
					
				} else if (arguments.length === 3) {
					// The first argument must be Point. Remainings must be Number.
					if (!compare(Point, arguments[0] 
						|| typeof(arguments[1]) !== 'number' || typeof(arguments[2]) !== 'number')) {
						throw 'arguments invalid.';
					}
					this.start = arguments[0];
					this.direction = arguments[1];
					this.length = arguments[2];
					this.end = inherit(Point).init(
						this.start.x + this.length * Math.cos(this.direction),
						this.start.y - this.length * Math.sin(this.direction)
					);
					
				} else if (arguments.length > 3) {
					// Type of arguments must be Number. Remainings are ignore.
					for (var i = 0; i < arguments.length; i += 1) {
						if (typeof(arguments[i]) !== 'number') {
							throw 'arguments must be Number.';
						}
					}
					this.start = inherit(Point).init(arguments[0], arguments[1]);
					this.end   = inherit(Point).init(arguments[2], arguments[3]);
					this.direction = this.start.angleBetween(this.end);
					this.length = this.start.distanceTo(this.end);
				}
				return this;
			},
			contain: function(point) {
				if (!compare(Point, point)) {
					throw 'arguments must be Point.';
				}
				var x0 = this.start.x,
					y0 = this.start.y,
					x1 = this.end.x,
					y1 = this.end.y;
				
				if (point.x < x0 || point.y < y0 || x1 < point.x || y1 < point.y) {
					return false;
				}
				return (y1 - y0) * point.x - (x1 - x0) * point.y - x0 * y1 + x1 * y0 === 0;
			},
			intersection: function(segment) {
				// ### Avoid a circular dependencies ###
				var Triangle = require('mod/geom/triangle');
				
				if (!compare(this, segment)) {
					throw 'arguments must be geom.Segment.';
				}
				var t1 = inherit(Triangle).init(this.start, this.end, segment.start),
					t2 = inherit(Triangle).init(this.start, this.end, segment.end),
					t3 = inherit(Triangle).init(segment.start, segment.end, this.start),
					t4 = inherit(Triangle).init(segment.start, segment.end, this.end),
					I  = false;
				
				if (t1.getArea() * t2.getArea() < 0 && t3.getArea() * t4.getArea() < 0) {
					I = this.getIntersection(segment);
				}
				return I;
			},
			getIntersection: function(segment) {
				if (!compare(this, segment)) {
					throw 'arguments must be geom.Segment.';
				}
				var AB = inherit(Vector).init(this.end.x - this.start.x, this.end.y - this.start.y),
					CD = inherit(Vector).init(segment.end.x - segment.start.x, segment.end.y - segment.start.y),
					AC = inherit(Vector).init(segment.start.x - this.start.x, segment.start.y - this.start.y),	
					cpAB = CD.crossProduct(AB);
					cpAC = CD.crossProduct(AC);
				
				AB.scalarMultiply(cpAC / cpAB);
				//console.log(AB.x + ', ' + AB.y);
				return inherit(Point).init(this.start.x + AB.x, this.start.y + AB.y);
			},
			distance: function() {
				return this.length;
			},
			middlePoint: function() {
				return this.start.middlePointOf(this.end);
			},
			getAngle: function(asRadian) {
				if (asRadian === undefined) { asRadian = true; }
				var radian = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
				return (asRadian) ? radian : radian * 180 / Math.PI;
			},
			angleBetween: function(segment, asRadian) {
				if (!compare(this, segment)) {
					throw 'arguments must be geom.Segment.';
				}
				if (asRadian === undefined) { asRadian = true; }
				var radian = segment.getAngle() - this.getAngle();
				
				return (asRadian) ? radian : radian * 180 / Math.PI;;
			},
			toString: function() {
				return '( ' + this.start.x + ', ' + this.start.y + ' ) -> ( ' + + this.end.x + ', ' + this.end.y + ' )';
			}
		};
	
	return Segment;
});