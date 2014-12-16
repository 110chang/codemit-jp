// #######################################
//
//   mod/geom/Vector
//
// #######################################

define([
	'mod/inherit',
	'mod/compare'
], function(inherit, compare) {
	var Vector = {
			x: 0,
		 	y: 0,
		 	magnitude: 0,
		 	direction: 0,
		 	
		 	init: function(a, b, isComponent) {
			 	if (isComponent === undefined || isComponent === null) {
					isComponent = true;
				}
				if (isComponent) {
					this.x = a;
					this.y = b;
					var polar = this.componentToPolar(a, b);
					this.magnitude = polar.mag;
					this.direction = polar.dir;
				} else {
					this.magnitude = a;
					this.direction = b;// Degree
					var comp = this.polarToComponent(a, b);
					this.x = comp.x;
					this.y = comp.y;
				}
				return this;
		 	},
		 	polarToComponent: function(mag, dir) {
				var x = mag * Math.cos(dir * Math.PI / 180),
					y = mag * Math.sin(dir * Math.PI / 180);
					
				return { x: x, y: y };
			},
			componentToPolar: function(x, y) {
				var mag = Math.sqrt(x * x + y * y),
					dir = 0;
				
				if (mag === 0) {
					return { mag: mag, dir: dir};
				}
				dir = (180 / Math.PI) * Math.asin(y / mag);
				
				if (x < 0) {
					dir = 180 - dir;
				} else if (x < 0 && y < 0) {
					dir += 360;
				}
				return { mag: mag, dir: dir};
			},
			getComponent: function() {
				return { x: this.x, y: this.y };
			},
			getPolar: function() {
				return { mag: this.magnitude, dir: this.direction };
			},
			add: function(vector) {
				if (!compare(vector, this)) {
					throw "arguments must be Vector.";
				}
				this.x += vector.x;
				this.y += vector.y;
				var polar = this.componentToPolar(this.x, this.y);
				this.magnitude = polar.mag;
				this.direction = polar.dir;
				
				return this;
			},
			sub: function(vector){
				if (!compare(vector, this)) {
					throw "arguments must be Vector.";
				}
				this.x -= vector.x;
				this.y -= vector.y;
				var polar = this.componentToPolar(this.x, this.y);
				this.magnitude = polar.mag;
				this.direction = polar.dir;
				
				return this;
			},
			scalarMultiply: function(num){
				if (typeof num !== 'number') {
					throw "arguments must be Number.";
				}
				this.x *= num;
				this.y *= num;
				var polar = this.componentToPolar(this.x, this.y);
				this.magnitude = polar.mag;
				this.direction = polar.dir;
				
				return this;
			},
			innerProduct: function(vector) {
				//console.log(vector);
				if (!compare(vector, this)) {
					throw "arguments must be Vector.";
				}
				return this.x * vector.x + this.y * vector.y;
			},
			crossProduct: function(vector) {
				//return only magnitude in 2D Vector
				if (!compare(vector, this)) {
					throw "arguments must be Vector.";
				}
				return this.x * vector.y - this.y * vector.x;
			},
			getAngle: function(vector) {
				if (!compare(vector, this)) {
					throw "arguments must be Vector.";
				}
				return Math.acos(this.innerProduct(vector) / this.magnitude * vector.magnitude);
			},
			normalize: function(){
				return inherit(Vector).init(1, this.direction, false);
			}
		};
	
	return Vector;
});