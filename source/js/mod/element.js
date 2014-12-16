// #######################################
//
//   Element
//   require: jQuery.cssAnimate
//
// #######################################

define([
	'mod/inherit',
	'mod/pubsub',
	'mod/utils/browser'
], function (inherit, PubSub, Browser) {
	var easingConverter = {
			'linear'			 : 'linear',
			'swing'				 : 'swing',
			'jswing'			 : 'swing',
			'easeInSine'		 : 'cubic-bezier(0.47, 0, 0.745, 0.715)',
			'easeOutSine'		 : 'cubic-bezier(0.39, 0.575, 0.565, 1)',
			'easeInOutSine'		 : 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
			'easeInQuad'		 : 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
			'easeOutQuad'		 : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			'easeInOutQuad'		 : 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
			'easeInCubic'		 : 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
			'easeOutCubic'		 : 'cubic-bezier(0.215, 0.61, 0.355, 1)',
			'easeInOutCubic'	 : 'cubic-bezier(0.645, 0.045, 0.355, 1)',
			'easeInQuart'		 : 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
			'easeOutQuart'		 : 'cubic-bezier(0.165, 0.84, 0.44, 1)',
			'easeInOutQuart'	 : 'cubic-bezier(0.77, 0, 0.175, 1)',
			'easeInQuint'		 : 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
			'easeOutQuint'		 : 'cubic-bezier(0.23, 1, 0.32, 1)',
			'easeInOutQuint'	 : 'cubic-bezier(0.86, 0, 0.07, 1)',
			'easeInExpo'		 : 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
			'easeOutExpo'		 : 'cubic-bezier(0.19, 1, 0.22, 1)',
			'easeInOutExpo'		 : 'cubic-bezier(1, 0, 0, 1)',
			'easeInCirc'		 : 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
			'easeOutCirc'		 : 'cubic-bezier(0.075, 0.82, 0.165, 1)',
			'easeInOutCirc'		 : 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
			'easeInBack'		 : 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
			'easeOutBack'		 : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			'easeInOutBack'		 : 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			'easeInElastic'		 : false,
			'easeOutElastic'	 : false,
			'easeInOutElastic'	 : false,
			'easeInBounce'		 : false,
			'easeOutBounce'		 : false,
			'easeInOutBounce'	 : false
		},
	
		Element = inherit(PubSub, {
			SHOW_COMPLETE: 'onShowComplete',
			HIDE_COMPLETE: 'onHideComplete',
			
			$el			 : null,
			origDisplay	 : null,
	 		animation	 : {
				hide		 : {
					opacity	 : 0
				},
				show		 : {
					opacity	 : 1
				}
			},
			options		 : {
				easing		 : 'easeInOutQuad',
				duration	 : 500,
				useCSS3		 : false,
				useNone		 : true // css display:none when hide complete
			},
			
			init: function ($el, animation, options) {
				console.log('Element#init');
				if ($el === undefined || $el === null) {
		 			throw new Error('Require jQuery object');
	 			}
	 			PubSub.init.call(this);
	 			
		 		this.$el = $el;
		 		this.origDisplay = $el.css('display');
		 		this.animation = animation || this.animation;
		 		$.extend(true, this.options, this.options, options || {});
		 		
		 		if (Browser.is_smallScreen) {
			 		this.options.easing = 'linear';
		 		}
		 		
		 		return this;
			},
	 		show: function (duration, easing) {
				console.log('Element#show');
	 			if (this.options.useNone) {
		 			this.$el.css({
		 				'display': this.origDisplay
		 			});
				}
				//console.log(this.animation);
				this._animate(
					this.animation.show, 
					duration, 
					easing, 
					this._onShowComplete
				);
				return this;
			},
			hide: function (duration, easing) {
				console.log('Element#hide');
				//console.log(this.animation);
				this._animate(
					this.animation.hide, 
					duration, 
					easing, 
					this._onHideComplete
				);
				return this;
			},
			_animate: function(props, duration, easing, callback) {
				duration = duration || this.options.duration;
				easing = easing || this.options.easing;
				
				//if (this.$el.cssAnimate && this.options.useCSS3) {
				//	console.log('Element#_animate:cssAnimation');
				//	method = easingConverter[this.options.easing];
					//console.log(props);
				//	if (method) {
				//		this.$el.cssAnimate(props, duration, easing, $.proxy(callback, this));
				//	} else {
				//		throw new Error('Don\'t support such easing function');
				//	}
				//} else {
					console.log('Element#_animate:jsAnimation');
					this.$el.stop().animate(props, duration, easing, $.proxy(callback, this));
				//}
			},
			_onShowComplete: function() {
				console.log('Element#_onShowComplete');
				this.publish(Element.SHOW_COMPLETE);
			},
			_onHideComplete: function() {
				console.log('Element#_onHideComplete');
				this.publish(Element.HIDE_COMPLETE);
				if (this.options.useNone) {
					this.$el.css({
						'display': 'none'
					});
				}
			}
		});
	
	return Element;
});