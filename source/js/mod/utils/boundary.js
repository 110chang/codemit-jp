/*
*
*   Utils.Boundary r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var Boundary = {
		scrollHeight: function() {
			// Ref. http://css-eblog.com/javascript/javascript-contents-height.html
			return Math.max.apply(null, [
				document.body.clientHeight,
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.documentElement.clientHeight
			]);
		},
		scrollTop: function() {
			return document.documentElement.scrollTop || document.body.scrollTop;
		},
		clientWidth: function() {
			return document.clientWidth || document.documentElement.clientWidth;
		},
		clientHeight: function() {
			return document.clientHeight || document.documentElement.clientHeight;
		}
	};
	
	return Boundary;
});
