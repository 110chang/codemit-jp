/*
*
*   TransitionSlider.Transition r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/pubsub'
], function(inherit, compare, PubSub) {
	var Transition = inherit(PubSub, {
		
		TRANSITION_START: 'onTransitionStart',
		TRANSITION_END: 'onTransitionEnd',
		
		slider: null,
		
		init: function() {
			PubSub.init.call(this);
			
			return this;
		},
		start: function() {
			this.publish(Transition.TRANSITION_START);
		},
		end: function() {
			this.publish(Transition.TRANSITION_END);
		}
	});
	
	return Transition;
});
