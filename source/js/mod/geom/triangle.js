// #######################################
//
//   mod/geom/Triangle
//
// #######################################

define([
	'mod/inherit',
	'mod/compare',
	'mod/geom/point',
	'mod/geom/segment'
], function(inherit, compare, Point, Segment) {
	var Triangle = {
			start			 : null,
			middle			 : null,
			end				 : null,
			area			 : 0,
			gravityCenter	 : null,
			circumCenter	 : null,
			circumCenter2	 : null,
			segmentA		 : null,
			segmentB		 : null,
			segmentC		 : null,
			angleA			 : null,
			angleB			 : null,
			angleC			 : null,
			
			init: function(start, middle, end) {
				if (!compare(Point, start) || !compare(Point, middle) || !compare(Point, end)) {
					throw "arguments must be Point";
				}
				this.start		 = start;
				this.middle		 = middle;
				this.end		 = end;
				
				// Calcurate in advance
				var x0 = this.start.x,
					y0 = this.start.y,
					x1 = this.middle.x,
					y1 = this.middle.y,
					x2 = this.end.x,
					y2 = this.end.y,
					area;
				
				area = this.area = ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / 2;
				this.gravityCenter = inherit(Point).init((x0 + x1 + x2) / 3, (y0 + y1 + y2) / 3);
				
				this.angleA = (function() {
					
					var ac = inherit(Segment).init(x0, y0, x2, y2),
						ab = inherit(Segment).init(x0, y0, x1, y1);
					
					return Math.abs(ac.angleBetween(ab));
				}());
				
				this.angleB = (function() {
					var ba = inherit(Segment).init(x1, y1, x0, y0),
						bc = inherit(Segment).init(x1, y1, x2, y2);
					
					return Math.abs(ba.angleBetween(bc));
				}());
				
				this.angleC = (function() {
					var cb = inherit(Segment).init(x2, y2, x1, y1),
						ca = inherit(Segment).init(x2, y2, x0, y0);
									
					return Math.abs(cb.angleBetween(ca));
				}());
				
				this.segmentA = inherit(Segment).init(this.middle, this.end);
				this.segmentB = inherit(Segment).init(this.end, this.start);
				this.segmentC = inherit(Segment).init(this.start, this.middle);
				
				/*this.circumCenter = (function() {
					var x10 = x1 - x0, x21 = x2 - x1, x20 = x2 - x0,
						y10 = y1 - y0, y21 = y2 - y1, y20 = y2 - y0,
						a = x10 * x10 + y10 * y10, b = x20 * x20 + y20 * y20,
						c = x10 * y10 + x10 * y20 + x20 * y10 + x20 * y20;
					
					return inherit(geom.Point).init(
						(a * y10 + a * y20 + b * y10 + b * y20) / 2 * c,
						(x10 * a + x10 * b + x20 * a + x20 * b) / 2 * c
					);
				}());*/
				
				/*this.circumCenter = (function() {
					var a	 = this.angleA,
						b	 = this.angleB,
						c	 = this.angleC,
						sin	 = Math.sin,
						cos  = Math.cos,
						f	 = function(_1, _2, _3) {
							var a2 = 2 * sin(a) * cos(a),
								b2 = 2 * sin(b) * cos(b),
								c2 = 2 * sin(c) * cos(c);
								
							return (_1 * a2 + _2 * b2 + _3 * c2) / (a2 + b2 + c2);
						}
					return inherit(geom.Point).init(f(x0, x1, x2), f(y0, y1, y2));
				}());*/
				
				/*this.circumCenter = (function() {
					var x12 = Math.abs(x1 - x2),
						x20 = Math.abs(x2 - x0),
						x01 = Math.abs(x0 - x1),
						y12 = Math.abs(y1 - y2),
						y20 = Math.abs(y2 - y0),
						y01 = Math.abs(y0 - y1),
						s = area,
						f = function(a, b, c, va, vb, vc) {						
							return (a * a * (b * b + c * c - a * a) * va + b * b * (c * c + a * a - b * b) * vb + c * c * (a * a + b * b - c * c) * vc) / (16 * s * s);
						}
					return inherit(geom.Point).init(f(x12, x20, x01, x0, x1, x2), f(y12, y20, y01, y0, y1, y2));
				}());*/
				
				//console.log(this.circumCenter);
				return this;
			},
			getArea: function(asSigned) {
				if (asSigned === undefined) {
					asSigned = true;
				}
				return (asSigned) ? this.area : Math.abs(this.area);
			},
			getGravityCenter: function() {
				return this.gravityCenter;
			},
			getCircumCenter: function() {
				return this.circumCenter;
			},
			translate: function(x, y) {
				if (typeof x !== 'number' || typeof y !== 'number') {
					 throw "arguments must be Number.";
				}
				this.start.translate(x, y);
				this.middle.translate(x, y);
				this.end.translate(x, y);
			},
			contain: function(point) {
				if (!compare(Point, point)) {
					throw 'arguments must be Point';
				}
				var seg = inherit(Segment).init(point, this.gravityCenter);
				
				return !this.segmentA.intersection(seg) && !this.segmentB.intersection(seg) && !this.segmentC.intersection(seg);
			}
		};
	
	return Triangle;
});