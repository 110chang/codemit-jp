/*
*
*   Canvas r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/utils/boundary',
	'mod/canvas/command'
], function(inherit, compare, boundary, Command) {
	var Canvas = {
			canvas		 : null,
			ctx			 : null,
			buffer		 : null,
			bufferCtx	 : null,
			commands	 : null,
			width		 : 0,
			height		 : 0,
			pixelRatio	 : 1,
			bgColor		 : '#FFF',
			
			init: function() {
				/*
				  arguments takes:
				    canvas[, width, height, [bgColor[, pixelRatio]]]
				  or
				    wrapperID[, width, height, [bgColor[, pixelRatio]]]
				*/
				var $wrap, width, height,
					canvas = Array.prototype.shift.call(arguments);
				
				if (canvas.getContext) {
					canvas = canvas;
				} else if (typeof canvas === 'string') {
					$wrap = $(canvas);
					canvas = $('<canvas/>').get(0);
					width = arguments[0] || $wrap.width();
					height = arguments[1] || $wrap.height();
					$wrap.empty().append(canvas);
				}
				
				this.canvas = canvas;
				this.width = arguments[0] || width || canvas.width;
				this.height = arguments[1] || height || canvas.height;
				this.bgColor = arguments[2] || this.bgColor;
				this.pixelRatio = arguments[3] || window.devicePixelRatio || 1;
				//console.log(this.pixelRatio);
				this.commands = [];
				this.ctx = this.canvas.getContext('2d');
				this._setBounds($(this.canvas));
				
				this.buffer = $('<canvas/>').get(0);
				this.bufferCtx = this.buffer.getContext('2d');
				this._setBounds($(this.buffer));
				
		 		return this;
			},
			resize: function(width, height, pixelRatio) {
				this.width = width;
				this.height = height;
				this._setBounds($(this.canvas));
				
				return this;
			},
			draw: function() {
				this.clear();
				
				if (this.commands.length > 0) {
					for (var i = 0; i < this.commands.length; i++) {
						this.commands[i].execute(this.bufferCtx);
					}
				}
				this.ctx.drawImage(this.buffer, 0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio, 0, 0, this.width, this.height);
				
				return this;
			},
			clear: function() {
				var width = this.width * this.pixelRatio,
					height = this.height * this.pixelRatio;
					
				this.bufferCtx.clearRect(0, 0, width, height);
				this.bufferCtx.fillStyle = this.bgColor;
				this.bufferCtx.fillRect(0, 0, width, height);
				
				this.ctx.drawImage(this.buffer, 0, 0, width, height, 0, 0, this.width, this.height);
				
				return this;
			},
			addCommand: function(options, methods) {
				var com = inherit(Command).init(options).add(methods);
				this.commands.push(com);
				
				return this;
			},
			clearCommand: function() {
				this.commands = [];
				
				return this;	
			},
			getDataURL: function() {
				return this.canvas.toDataURL();	
			},
			drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
				//console.log(image);
				this.ctx.clearRect(0, 0, this.width, this.height);
				this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
				
				return this;	
			},
			createGradient: function(colorStops, x0, y0, x1, y1) {
				var grad = this.ctx.createLinearGradient(x0, y0, x1, y1);

				for (var i = 0; i < colorStops.length; i++) {
					var c = colorStops[i];
					grad.addColorStop(c.pos, c.color);
				}
				return grad;
			},
			_setBounds: function($el) {
				// Set double value when retina display
				if (this.pixelRatio > 1) {
					$el.attr('width', this.width * this.pixelRatio);
					$el.attr('height', this.height * this.pixelRatio);
					$el.get(0).getContext('2d').scale(this.pixelRatio, this.pixelRatio);
				} else {
					$el.attr('width', this.width);
					$el.attr('height', this.height);
				}
				// Set display bounds in CSS
				$el.width(this.width);
				$el.height(this.height);
			}
		};
		
	return Canvas;
});
