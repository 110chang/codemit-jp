// #######################################
//
//   mod/geom/Line
//
// #######################################

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/point',
	'mod/geom/segment'
], function(inherit, compare, Point, Segment) {
	var Line = inherit(Segment, {
			init: function () {
				Segment.init.apply(this, arguments);
				return this;
			},
			contain: function (point) {
				if (!compare(Point, point)) {
					throw 'arguments must be geom.Point.';
				}
				var x0 = this.start.x,
					y0 = this.start.y,
					x1 = this.end.x,
					y1 = this.end.y;
				
				return (y1 - y0) * point.x - (x1 - x0) * point.y - x0 * y1 + x1 * y0 === 0;
			},
			intersection: function (segment) {
				// ### Avoid a circular dependencies ###
				var Triangle = require('mod/geom/triangle');
				
				if (!compare(Segment, segment)) {
					throw 'arguments must be geom.Segment.';
				}
				var t1 = inherit(Triangle).init(this.start, this.end, segment.start),
					t2 = inherit(Triangle).init(this.start, this.end, segment.end),
					I  = false;
				
				if (t1.getArea() * t2.getArea() < 0) {
					I = this.getIntersection(segment);
				}
				return I;
			},
			distance: function () {
				return Infinity;
			},
			middlePoint: function () {
				return false;
			},
			toString: function () {
				return '-Infinity -> Infinity';
			}
		});
	
	return Line;
});