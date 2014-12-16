/*
*
*   Canvas.Command r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var Command = {
			methods			 : [],
			conf 			 : null,
			allowFill		 : false,
			allowStroke		 : false,
			allowText		 : false,
			
			init: function(options) {
				if (options.fillStyle) {
					this.allowFill = true;
				}
				if (options.strokeStyle) {
					this.allowStroke = true;
				}
				if (options.font) {
					//if (this.allowFill || this.allowStroke) {
					//	throw new Error('Don\'t mix text and the other drawing function.')
					//} else {
						this.allowText = true;
					//}
				}
				this.conf = options;
				this.methods = [];
				
				return this;
			},
			add: function(method) {
				if ($.isArray(method)) {
					for (var i = 0; i < method.length; i++) {
						this.methods.push(method[i]);
					}
				} else if (typeof method === 'function') {
					this.methods.push(method);
				} else {
					throw new Error('Arguments must be Array or Function.')
				}
				
				return this;
			},
			execute: function(ctx) {
				$.extend(ctx, this.conf);
				ctx.save();
				//console.log(ctx);
				if (!this.allowText) {
					ctx.beginPath();
				}
				for (var i = 0; i < this.methods.length; i++) {
					this.methods[i].call(this, ctx);
				}
				if (!this.allowText) {
					if (this.allowStroke) {
						ctx.stroke();
					}
					if (this.allowFill) {
						ctx.fill();
					}
				}
				ctx.restore();
				return this;
			}
		};
		
	return Command;
});
