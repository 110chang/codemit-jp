/*
*
*   TransitionSlider.Blind r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/utils/timer',
	'mod/transitionslider/transition'
], function(inherit, compare, Timer, Transition) {
	var _div = $('<div/>').css({
			overflow: 'hidden',
			position: 'absolute'
		}),
		
		Blind = inherit(Transition, {
			
			VIRTICAL	: 'verticalBlind',
			HORIZONTAL	: 'horizontalBlind',
			
			timer		: null,
			divX		: 12,
			divY		: 6,
			div			: 0,
			count		: 0,
			tileDur		: 0,
			tiles		: [],
			deferreds	: [],
			direction	: 'horizontalBlind',
			
			init: function(direction, div) {
				Transition.init.call(this);
				
				if (direction && typeof direction === 'string') {
					this.direction = direction;
				}
				if (this.direction === Blind.VIRTICAL) {
					this.div = div || this.divX;
				} else {
					this.div = div || this.divY;
				}
				
				return this;
			},
			start: function(duration, slider) {
				this.publish(Transition.TRANSITION_START);
				this.slider = slider;
				this.tiles = [];
				
				var $oldBak = slider.$old.clone(),
					$tile, $inner, width, height, right, bottom, i, j;
				
				if (!duration && duration !== 0) {
					duration = slider.cnf.animDur || 500;
				}
				if (this.direction === Blind.VIRTICAL) {
					width = slider.$old.width() / this.div;
					height = slider.$old.height();
				} else {
					width = slider.$old.width();
					height = slider.$old.height() / this.div;
				}
				_div.width(width).height(height);
				
				slider.$old.empty().css({
					'z-index': 3
				});
				slider.$current.css({
					'z-index': 2
				});
				
				for (i = 0; i < this.div; i++) {
					if (this.direction === Blind.VIRTICAL) {
						right = width * i;
						bottom = 0;
					} else {
						right = 0;
						bottom = height * i;
					}
					$inner = $oldBak.clone().css({
						position : 'absolute',
						left	 : 'auto',
						top		 : 'auto',
						right	 : -right,
						bottom	 : -bottom
					});
					$tile = _div.clone().append($inner).css({
						width	 : width,
						height	 : height,
						right	 : right,
						bottom	 : bottom
					});
					slider.$old.append($tile);
					this.tiles.push($tile);
				}
				this.count = this.tiles.length;
				this.tileDur = Math.ceil(duration / this.count);
				
				this.timer = inherit(Timer).init(this.tileDur, this.count);
				this.timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				this.timer.subscribe(Timer.TIMER_END, $.proxy(this.end, this));
				this.timer.start();
			},
			onTimer: function(e, data) {
				var count	 = data.count - 1,
					duration = Math.ceil(this.slider.cnf.animDur * count / this.count),
					option	 = this.direction === Blind.VIRTICAL ? { width: 0 } : { height: 0 };
				
				if (this.tiles[count]) {
					this.deferreds.push(
						this.tiles[count].animate(option, duration, 'easeOutQuad').promise()
					);
				}
			},
			end: function(e) {
				//console.log('tiling finish');
				$.when.apply(null, this.deferreds).then($.proxy(this.onAllAnimationFinish, this));
			},
			onAllAnimationFinish: function() {
				this.slider.$old.hide(0).remove();
				this.timer.stop();
				this.publish(Transition.TRANSITION_END);
			}
		});
	
	return Blind;
});
