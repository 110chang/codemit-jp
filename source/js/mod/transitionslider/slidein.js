/*
*
*   TransitionSlider.SlideIn r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/transitionslider/transition'
], function(inherit, compare, Transition) {
	var SlideIn = inherit(Transition, {
		
		init: function() {
			Transition.init.call(this);
			
			return this;
		},
		start: function(duration, slider) {
			this.publish(Transition.TRANSITION_START);
			
			if (!duration && duration !== 0) {
				duration = slider.cnf.duration || 500;
			}
			slider.$old.css({
				'z-index': 1
			});
			slider.$current.css({
				'left': slider.slideWidth,
				'z-index': 2
			});
			slider.$current.animate({
				left: 0
			}, duration, $.proxy(this.end, this));
		},
		end: function(e) {
			console.log('slidein finish');
			this.publish(Transition.TRANSITION_END);
		}
	});
	
	return SlideIn;
});
