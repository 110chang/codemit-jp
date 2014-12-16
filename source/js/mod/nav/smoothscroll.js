/*
*
*   Nav.SmoothScroll r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/utils/boundary'
], function(Boundary) {
	var SmoothScroll = function(duration, easing) {
		duration = duration || 1000;
		easing = easing || 'easeInOutExpo';
		
		$('a[href*=#]').click(function (e) {
			var target,
				targetOffset,
				scrollHeight,
				clientHeight;
			
			if (this.hash.match(/^#\W/)) {
				return;
			}
			if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') 
			&& location.hostname === this.hostname) {
				$target = $(this.hash);
				$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
				if ($target.length) {
					targetOffset = $target.offset().top;
					scrollHeight = Boundary.scrollHeight();
					clientHeight = Boundary.clientHeight();
					//console.log((targetOffset + clientHeight) +','+ scrollHeight);
					if ((targetOffset + clientHeight) > scrollHeight) {
						targetOffset = scrollHeight - clientHeight;
					}
					$('html,body').animate({scrollTop: targetOffset}, duration, easing);
					return false;
				}
			}
		});
	};
	
	return SmoothScroll;
});