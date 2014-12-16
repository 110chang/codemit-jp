/*
*
*   Canvas.BitmapData r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var BitmapData = {
			ctx: null,
			data: [],
			width: 0,
			height: 0,
			
			init: function(ctx) {
				this.ctx = ctx;
				this.data = [];
				
				return this;
			},
			random: function(width, height) {
				var data = [], i = 0, j = 0, k;
				
				for (; i < height; i++) {
					for (; j < width; j++) {
						k = i * width + j * 4;
						
						data[k + 0] = 255 * Math.random();
						data[k + 1] = 255 * Math.random();
						data[k + 2] = 255 * Math.random();
						data[k + 3] = 255;
					}
				}
				this.ctx.createImageData(width, height);
				this.width = width;
				this.height = height;
				
				return this;
			}
		};
		
	return BitmapData;
});