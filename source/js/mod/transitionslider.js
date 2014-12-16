/*
*
*   TransitionSlider r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/pubsub',
	'mod/utils/timer',
	'mod/utils/keycode',
	'mod/transitionslider/nav',
	'mod/transitionslider/transition',
	'mod/transitionslider/fadeout'
], function(inherit, compare, PubSub, Timer, KeyCode, Nav, Transition, FadeOut) {
	var TransitionSlider = inherit(PubSub, {
		
		ANIMATION_FINISH : 'onAnimationFinish',
		ANIMATION_START	 : 'onAnimationStart',
		UPDATE			 : 'onUpdate',
		
		defaults 	 : {
			id			 : 'transition-slider',
			qMask		 : '.transition-slider-mask',
			qContainer	 : 'ul',
			qSlides		 : 'li',
			qPrev		 : '.transition-slider-prev',
			qNext		 : '.transition-slider-next',
			repeat		 : false,
			autoplay	 : false,
			useSwipe	 : false,
			duration	 : 5000,
			animDur		 : 500,
			pad			 : 0
		},
		cnf 		 : {},
		
		$el			 : null,
		$mask		 : null,
		$container	 : null,
		$slides		 : null,
		$prev		 : null,
		$next		 : null,
		$slidesBak	 : null,
		$current	 : null,
		$old		 : null,
		
		transition	 : null,
		timer		 : null,
		pause		 : false,
		slides		 : [],
		slideWidth	 : 0,
		slideHeight	 : 0,
		initLeft	 : 0,
		initTop		 : 0,
		current		 : 0,
		old			 : 0,
		first		 : 0,
		last		 : 0,
		
		init: function(options) {
			PubSub.init.call(this, this.duration);
			var cnf = this.cnf = $.extend({}, this.defaults, options || {});
			
			if (typeof cnf.pad === 'number') {
				cnf.pad = {
					left: cnf.pad,
					top: cnf.pad
				}
			}
			this.$el		 = $('#' + cnf.id);
			this.$mask		 = this.$el.find(cnf.qMask);
			this.$container	 = this.$mask.find(cnf.qContainer);
			this.$slides	 = this.$container.find(cnf.qSlides);
			this.$slidesBak	 = this.$slides.clone();
			this.$prev		 = this.$el.find(cnf.qPrev);
			this.$next		 = this.$el.find(cnf.qNext);
			this.$current	 = this.$slides.eq(this.current).clone();
			this.$old		 = this.$slides.eq(this.current).clone();
			
			this.transition	 = inherit(FadeOut).init(this);
			this.slideWidth	 = this.$slides.width();
			this.slideHeight = this.$slides.height();
			this.initLeft	 = cnf.pad.left;
			this.initTop	 = cnf.pad.top;
			this.timer		 = inherit(Timer).init(cnf.duration);
			//console.log(this.slideHeight);
			if (cnf.useSwipe) {
				this.$el.swipe({
					swipe			 : $.proxy(this.onSwipe, this),
					excludedElements : 'button, input, select, textarea, .noSwipe',
					threshold		 : 0
				});
			}
			
			return this;
		},
		onSwipe: function(event, direction, distance, duration, fingerCount) {
			event.preventDefault && event.preventDefault();
			//console.log(event);
			if (direction === $.fn.swipe.directions.LEFT) {
				//console.log($.fn.swipe.directions.LEFT);
				this.next();
			} else if (direction === $.fn.swipe.directions.RIGHT) {
				//console.log($.fn.swipe.directions.RIGHT);
				this.prev();
			}
		},
		setup: function() {
			//console.log(this.$slides.eq(this.current));
			var cnf		 = this.cnf,
				width	 = this.slideWidth,
				height	 = this.slideHeight,
				pad		 = this.pad,
				slides	 = this.slides = [],
				addPrev, addNext, left, top, pos;
			
			this.$container.css({
				position: 'absolute',
				left: this.initLeft,
				top: this.initTop
			});
			this.$slides.show(0);
			
			//Remain elements for apply changes when resizing.
			this.$mask.append(this.$slides.css({
				position: 'absolute',
				left: $(window).width() * 2,
				top: 0,
				'z-index': 0
			}));
			
			this.transition.subscribe(Transition.TRANSITION_END, $.proxy(this.onAnimationFinish, this));
			this.first = 0;
			this.last = this.$slides.size() - 1;
			this.triggerEnable();
			this.update(0);
			
			if (cnf.repeat && cnf.autoplay) {
				this.timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				this.timer.start();
			}
			return this;
		},
		update: function(duration) {
			var cnf = this.cnf;
			//console.log(this.first + ' < ' + this.current + ' < ' + this.last);
			this.triggerDisable();
			
			if (cnf.repeat && cnf.autoplay) {
				this.timer.stop();
			}
			if (!duration && duration !== 0) {
				duration = cnf.animDur;
			}
			if (this.current < this.first) {
				this.current = cnf.repeat ? this.last : this.first;
			}
			if (this.last < this.current) {
				this.current = cnf.repeat ? this.first : this.last;
			}
			this.publish(TransitionSlider.UPDATE, { current: this.current });
			this.publish(TransitionSlider.ANIMATION_START);
			
			// Not working in iPhone without `clone`
			this.$current = this.$slides.eq(this.current).clone().css({
				position: 'absolute',
				left: 0,
				top: 0,
				'z-index': 2
			});
			this.$container.empty().append(this.$current).append(this.$old);
			this.transition.start(duration, this);
			//console.log(this.$old);
			if (!cnf.repeat) {
				if (this.current === this.first) {
					this.$prev.fadeOut(250);
				} else {
					this.$prev.fadeIn(250);
				}
				if (this.current === this.last) {
					this.$next.fadeOut(250);
				} else {
					this.$next.fadeIn(250);
				}
			}
		},
		resize: function() {
			this.slideWidth	 = this.$slides.width();
			this.slideHeight = this.$slides.height();
			
			return this;
		},
		jump: function(num) {
			if (!this.pause) {
				this.current = num;
				this.update();
			}
		},
		prev: function(e) {
			//console.log('prev');
			this.current--;
			this.update();
		},
		next: function(e) {
			//console.log('next');
			this.current++;
			this.update();
		},
		onAnimationFinish: function(e) {
			//console.log('animation finish');
			var cnf = this.cnf;
			
			this.publish(TransitionSlider.ANIMATION_FINISH);
			this.triggerEnable();
			//console.log(this.first + ' < ' + this.current + ' < ' + this.last);
			if (cnf.repeat && cnf.autoplay) {
				this.timer.start();
			}
			this.$old = this.$current;
			this.old = this.current;
		},
		onTimer: function(e) {
			this.next();
		},
		onKey: function(key) {
			if (this.pause) {
				return;
			}
			if (key === KeyCode.LEFT) {
				this.prev();
			}
			if (key === KeyCode.RIGHT) {
				this.next();
			}
		},
		triggerEnable: function() {
			//console.log('trigger enable');
			this.pause = false;
			this.$prev.off('click').on('click', $.proxy(this.prev, this));
			this.$next.off('click').on('click', $.proxy(this.next, this));
			
			if (this.cnf.useSwipe) {
				this.$el.swipe('enable');
			}
		},
		triggerDisable: function() {
			//console.log('trigger disable');
			this.pause = true;
			this.$prev.off('click');
			this.$next.off('click');
			
			if (this.cnf.useSwipe) {
				this.$el.swipe('disable');
			}
		},
		addNavigation: function($nav, options) {
			//console.log(SimpleSlider);
			var slider = this;
			
			$nav.each(function(index) {				
				inherit(Nav).init($(this), slider, options);
			});
			
			return this;
		},
		nav: function($nav, options) {
			return this.addNavigation($nav, options);
		},
		setTransition: function(transition) {
			if (compare(Transition, transition)) {
				this.transition = transition;
			} else {
				throw new Error('Arguments must be instance of Transition.')
			}
			return this;
		},
		getCurrent: function() {
			return this.current;
		},
		getOriginalLength: function() {
			return this.$slidesBak.size();
		}
	});
	
	return TransitionSlider;
});
