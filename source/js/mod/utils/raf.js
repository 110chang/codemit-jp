/*
*
*   Utils.requestAnimationFrame r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var useRAF = true,
		requestAnimationFrame,
		cancelAnimationFrame;
	
	if (useRAF) {
		requestAnimationFrame = window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame  || 
		window.mozRequestAnimationFrame     || 
		window.oRequestAnimationFrame       || 
		window.msRequestAnimationFrame      || 
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
		
		cancelAnimationFrame = window.cancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.webkitCancelAnimationFrame ||
		window.msCancelAnimationFrame ||
		function(id) {
			window.clearTimeout(id);
			id = null;
		};
		
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = requestAnimationFrame;
		}
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = cancelAnimationFrame;
		}
	} else {
		return function(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	};
	
	return requestAnimationFrame;
});
