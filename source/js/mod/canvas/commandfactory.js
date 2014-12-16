/*
*
*   Canvas.CommandFactory r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/compare',
	'mod/geom/point'
], function(compare, Point) {
	var CommandFactory = {
			CLEAR		 : 'clear',
			CIRCLE		 : 'circle',
			LINE		 : 'line',
			POLYLINE	 : 'polyline',
			RECTANGLE	 : 'rectangle',
			TRIANGLE	 : 'triangle',
			TEXT		 : 'text',
			RANDOM		 : 'random',
			
			create: function() {
				var feature	= Array.prototype.shift.call(arguments);
				
				if (typeof feature === 'function') {
					return feature;
				} else if (typeof feature === 'string') {
					return this[feature].apply(this, arguments)
				}
			},
			clear: function(width, height) {
				return function(ctx) {
					ctx.clearRect(0, 0, width, height);
				};
			},
			circle: function(x, y, radius, halfPixelHinting) {
				if (radius === undefined || radius === null) {
					radius = 10;
				}
				if (halfPixelHinting) {
					x += 0.5;
					y += 0.5;
				}
				return function(ctx) {
					ctx.moveTo(x, y);
					ctx.arc(x, y, radius, 0, Math.PI * 2);
					ctx.closePath();
				};
			},
			line: function(x0, y0, x1, y1, halfPixelHinting) {
				if (halfPixelHinting) {
					x0 += 0.5;
					y0 += 0.5;
					x1 += 0.5;
					y1 += 0.5;
				}
				return function(ctx) {
					ctx.moveTo(x0, y0);
					ctx.lineTo(x1, y1);
					ctx.closePath();
				};
			},
			polyline: function(points, close, halfPixelHinting) {
				return function(ctx) {
					var x, y, point, i = 0;
					
					for (; i < points.length; i++) {
						point = points[i];
						
						if (!compare(Point, point)) {
							continue;
						}
						x = point.x;
						y = point.y;
						
						if (halfPixelHinting) {
							x += 0.5;
							y += 0.5;
						}
						if (i === 0) {
							ctx.moveTo(x, y);
						} else {
							ctx.lineTo(x, y);
						}
					}
					if (close) {
						ctx.closePath();
					}
				};
			},
			rectangle: function(x, y, width, height, halfPixelHinting) {
				if (halfPixelHinting) {
					x += 0.5;
					y += 0.5;
				}
				return function(ctx) {
					ctx.moveTo(x, y);
					ctx.lineTo(x + width, y);
					ctx.lineTo(x + width, y + height);
					ctx.lineTo(x, y + height);
					ctx.closePath();
				};
			},
			triangle: function(x0, y0, x1, y1, x2, y2, halfPixelHinting) {
				if (halfPixelHinting) {
					x0 += 0.5;
					y0 += 0.5;
					x1 += 0.5;
					y1 += 0.5;
					x2 += 0.5;
					y2 += 0.5;
				}
				return function(ctx) {
					ctx.beginPath();
					ctx.moveTo(x0, y0);
					ctx.lineTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.lineTo(x0, y0);
					ctx.closePath();
				};
			},
			text: function(content, x, y, center) {
				if (center === undefined) {
					center = true;
				}
				return function(ctx) {
					var dx = 0,
						dy = 0;
					
					if (center) {
						dx = -ctx.measureText(content).width / 2;
						dy = /(\d+)px/.exec(ctx.font)[1] / 2;
					}

					x += dx;
					y += dy;
					
					ctx.fillText(content, x, y);
				};
			},
			random: function(x, y, width, height) {
				return function(ctx) {
					var imageData = null, rgba = [], i = 0, j = 0, k;
					
					for (i = 0; i < height; i++) {
						for (j = 0; j < width; j++) {
							k = (i * width + j) * 4;
							
							rgba[k + 0] = 255 * Math.random();
							rgba[k + 1] = 255 * Math.random();
							rgba[k + 2] = 255 * Math.random();
							rgba[k + 3] = 255;
						}
					}
					imageData = ctx.createImageData(width, height);
					for (i = 0; i < rgba.length; i++) {
						imageData.data[i] = rgba[i];
					}
					ctx.putImageData(imageData, x, y);
				};
			}
		};
		
	return CommandFactory;
});
