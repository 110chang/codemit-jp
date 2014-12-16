/*
*
*   SimpleSlider r1
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
	'mod/simpleslider/nav'
], function(inherit, compare, PubSub, Timer, KeyCode, Nav) {
	var SimpleSlider = inherit(PubSub, {
		
		ANIMATION_FINISH : 'onAnimationFinish',
		ANIMATION_START	 : 'onAnimationStart',
		UPDATE			 : 'onUpdate',
		HORIZONTAL		 : 'horizontalSlide',
		VERTICAL		 : 'verticalSlide',
		ALIGN_LEFT		 : 'alignLeft',
		ALIGN_RIGHT		 : 'alignRight',
		ALIGN_CENTER	 : 'alignCenter',
		ALIGN_TOP		 : 'alignTop',
		ALIGN_BOTTOM	 : 'alignBottom',
		
		defaults 	 : {
			id			 : 'simple-slider',
			qMask		 : '.simple-slider-mask',
			qContainer	 : 'ul',
			qSlides		 : 'li',
			qPrev		 : '.simple-slider-prev',
			qNext		 : '.simple-slider-next',
			easing		 : 'easeInOutExpo',
			direction	 : 'horisontalSlide',
			align		 : 'alignCenter',
			repeat		 : false,
			autoplay	 : false,
			useSwipe	 : false,
			duration	 : 5000,
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
		
		timer		 : null,
		pause		 : false,
		slides		 : [],
		slideWidth	 : 0,
		slideHeight	 : 0,
		initLeft	 : 0,
		initTop		 : 0,
		displayNum	 : 0,
		current		 : 0,
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
			}//console.log(cnf.pad);
			this.$el		 = $('#' + cnf.id);
			this.$mask		 = this.$el.find(cnf.qMask);
			this.$container	 = this.$mask.find(cnf.qContainer);
			this.$slides	 = this.$container.find(cnf.qSlides);
			this.$slidesBak	 = this.$slides.clone();
			this.$prev		 = this.$el.find(cnf.qPrev);
			this.$next		 = this.$el.find(cnf.qNext);
			
			this.slideWidth	 = this.$slides.width();
			this.slideHeight = this.$slides.height();
			this.initLeft	 = this._getInitLeft();
			this.initTop	 = this._getInitTop();
			this.timer		 = inherit(Timer).init(cnf.duration);
			this.displayNum	 = this._getDisplayCount();
			//console.log(this.initLeft);
			if (cnf.repeat) {
				this.current = this.displayNum;
			}
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
			event.preventDefault();
			
			if (this.cnf.direction === SimpleSlider.VERTICAL) {	
				if (direction === $.fn.swipe.directions.UP) {
					//console.log($.fn.swipe.directions.UP);
					this.next();
				} else if (direction === $.fn.swipe.directions.DOWN) {
					//console.log($.fn.swipe.directions.DOWN);
					this.prev();
				}
			} else {
				if (direction === $.fn.swipe.directions.LEFT) {
					//console.log($.fn.swipe.directions.LEFT);
					this.next();
				} else if (direction === $.fn.swipe.directions.RIGHT) {
					//console.log($.fn.swipe.directions.RIGHT);
					this.prev();
				}
			}
		},
		setup: function() {
			//console.log(this.displayNum);
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
			
			if (cnf.repeat) {
				this.$slides = this.$slidesBak.clone();
				this.$container.empty().append(this.$slides);
				
				addPrev = this.$slides.eq(this.slides.length - 1 - this.displayNum).nextAll().clone();
				addNext = this.$slides.eq(this.displayNum).prevAll().clone();
				Array.prototype.reverse.call(addNext);
				
				this.$container.prepend(addPrev);
				this.$container.append(addNext);
				this.$slides = this.$container.find(cnf.qSlides);
			}
			
			this.$slides.each(function(index) {
				if (cnf.direction === SimpleSlider.VERTICAL) {
					left = cnf.pad.left;
					top = (cnf.pad.top + height) * index;
					pos = cnf.pad.top - top;
				} else {
					left = (cnf.pad.left + width) * index;
					top = cnf.pad.top;
					pos = cnf.pad.left - left;
				}
				
				$(this).css({
					position: 'absolute',
					left: left,
					top: top
				});
				
				slides.push({
					$el: $(this),
					pos: pos
				})
			});
			
			this.first = cnf.repeat ? this.displayNum - 1 : 0;
			this.last = cnf.repeat ? this.slides.length - this.displayNum : this.slides.length - 1;
			this.triggerEnable();
			this.update(0);
			
			if (cnf.repeat && cnf.autoplay) {
				this.timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				this.timer.start();
			}
			
			return this;
		},
		update: function(duration) {
			var cnf = this.cnf,
				displayCurrent,
				option;
			//console.log(this.first + ' < ' + this.current + ' < ' + this.last);
			if (cnf.repeat && cnf.autoplay) {
				this.timer.stop();
			}
			if (!duration && duration !== 0) {
				duration = 500;
			}
			if (this.current < this.first) {
				this.current = this.first;
			}
			if (this.last < this.current) {
				this.current = this.last;
			}
			if (this.current === this.first || this.current === this.last) {
				this.triggerDisable();
			}
			displayCurrent = cnf.repeat ? this.current - this.displayNum : this.current;
			//console.log(cnf);
			this.publish(SimpleSlider.UPDATE, { current: displayCurrent });
			this.publish(SimpleSlider.ANIMATION_START);
			
			if (cnf.direction === SimpleSlider.VERTICAL) {
				option = {
					top: this.slides[this.current].pos + this.initTop
				};
			} else {
				option = {
					left: this.slides[this.current].pos + this.initLeft
				};
			}
			this.$container.stop().animate(option, duration, cnf.easing, $.proxy(this.onAnimationFinish, this));
			
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
			var oldDisplayCount = this.displayNum;
			
			this.slideWidth	 = this.$slides.width();
			this.slideHeight = this.$slides.height();
			this.initLeft	 = this._getInitLeft();
			this.initTop	 = this._getInitTop();
			this.displayNum	 = this._getDisplayCount();
			
			if (this.cnf.repeat) {
				this.current += this.displayNum - oldDisplayCount;
			}
			return this;
		},
		jump: function(num) {
			if (!this.pause) {
				this.current = this.cnf.repeat ? num + this.displayNum : num;
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
			var cnf = this.cnf;
			
			this.publish(SimpleSlider.ANIMATION_FINISH);
			this.triggerEnable();
			//console.log(this.first + ' < ' + this.current + ' < ' + this.last);
			if (cnf.repeat) {
				if (this.current === this.first) {
					this.current = this.last - 1;
					this.update(0);
					//console.log(this.current);
				} else if (this.current === this.last) {
					this.current = this.first + 1;
					this.update(0);
				}
			}
			if (cnf.repeat && cnf.autoplay) {
				this.timer.start();
			}
		},
		onTimer: function(e) {
			this.next();
		},
		onKey: function(key) {
			if (this.pause) {
				return;
			}
			if (this.cnf.direction === SimpleSlider.VERTICAL) {
				if (key === KeyCode.UP) {
					this.prev();
				}
				if (key === KeyCode.DOWN) {
					this.next();
				}
			} else {
				if (key === KeyCode.LEFT) {
					this.prev();
				}
				if (key === KeyCode.RIGHT) {
					this.next();
				}
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
		getCurrent: function() {
			return this.current;
		},
		getOriginalLength: function() {
			return this.$slidesBak.size();
		},
		_getDisplayCount: function() {
			if (this.cnf.direction === SimpleSlider.VERTICAL) {
				return Math.ceil(this.$mask.height() / (this.slideHeight + this.cnf.pad.top * 2));
			} else {
				return Math.ceil(this.$mask.width() / (this.slideWidth + this.cnf.pad.left * 2));
			}
		},
		_getInitLeft: function() {
			var cnf = this.cnf, left;
			//console.log(SimpleSlider.ALIGN_LEFT);
			if (cnf.align === SimpleSlider.ALIGN_LEFT) {
				left = 0;
			} else if (cnf.align === SimpleSlider.ALIGN_RIGHT) {
				left = this.$mask.width() - this.slideWidth - cnf.pad.left * 2;
			} else {
				left = (this.$mask.width() - this.slideWidth) / 2 - cnf.pad.left;
			}
			return left;
		},
		_getInitTop: function() {
			var cnf = this.cnf, top;
			
			if (cnf.align === SimpleSlider.ALIGN_TOP) {
				top = 0;
			} else if (cnf.align === SimpleSlider.ALIGN_BOTTOM) {
				top = this.$mask.height() - this.slideHeight - cnf.pad.top * 2;
			} else {
				top = (this.$mask.height() - this.slideHeight) / 2 - cnf.pad.top;
			}
			return top;
		}
	});
	
	return SimpleSlider;
});
