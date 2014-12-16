/*
*
*   TransitionSlider.FadeOut r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/transitionslider/transition'
], function(inherit, compare, Transition) {
	var FadeOut = inherit(Transition, {
		
		init: function() {
			Transition.init.call(this);
			
			return this;
		},
		start: function(duration, slider) {
			//this.publish(Transition.TRANSITION_START);
			Transition.start.call(this);
			
			if (!duration && duration !== 0) {
				duration = slider.cnf.duration || 500;
			}
			
			slider.$old.css({
				'z-index': 2
			});
			slider.$current.css({
				'z-index': 1
			});
			slider.$old.fadeOut(duration, $.proxy(this.end, this));
		},
		end: function(e) {
			Transition.end.call(this);
		}
	});
	
	return FadeOut;
});
