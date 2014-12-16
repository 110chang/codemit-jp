/*
*
*   TransitionSlider.Tiling r1
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
		
		Tiling = inherit(Transition, {
			
			timer		: null,
			divX		: 12,
			divY		: 6,
			count		: 0,
			tileDur		: 0,
			tiles		: [],
			deferreds	: [],
			
			init: function(divX, divY) {
				Transition.init.call(this);
				
				this.divX = divX || this.divX;
				this.divY = divY || this.divY;
				
				return this;
			},
			start: function(duration, slider) {
				this.publish(Transition.TRANSITION_START);
				this.slider = slider;
				this.tiles = [];
				
				var $oldBak = slider.$old.clone(), $tile, $inner,
					width = slider.$old.width() / this.divX,
					height = slider.$old.height() / this.divY,
					i, j;
				//console.log($oldBak.get(0).id);
				if (!duration && duration !== 0) {
					duration = slider.cnf.animDur || 500;
				}
				_div.width(width).height(height);
				
				slider.$old.empty().css({
					'z-index': 3
				});
				slider.$current.css({
					'z-index': 2
				});
				$oldBak.find('img').width(slider.$old.width());
							
				for (i = 0; i < this.divY; i++) {
					this.tiles[i] = [];
					
					for (j = 0; j < this.divX; j++) {
						$inner = $oldBak.clone().css({
							position : 'absolute',
							left	 : -width * j,
							top		 : -height * i
						});
						$tile = _div.clone().append($inner).css({
							width	 : width,
							height	 : height,
							left	 : width * j,
							top		 : height * i
						});
						slider.$old.append($tile);
						this.tiles[i].push($tile);
					}
				}
				this.count = this.tiles[0].length + this.tiles.length - 1;
				this.tileDur = Math.ceil(duration / this.count);
				
				this.timer = inherit(Timer).init(this.tileDur, this.count);
				this.timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				this.timer.subscribe(Timer.TIMER_END, $.proxy(this.end, this));
				this.timer.start();
			},
			onTimer: function(e, data) {
				var count = this.count - data.count;
				
				for (var i = 0; i < this.count; i++) {
					if (this.tiles[i] && this.tiles[i][count - i]) {
						this.deferreds.push(
							this.tiles[i][count - i].fadeOut({
								duration: this.slider.cnf.animDur / 2,
								easing: 'easeOutExpo'
							}).promise()
						);
					}
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
	
	return Tiling;
});
