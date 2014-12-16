/*
*
*   Preload r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/pubsub',
	'mod/utils/browser',
	'mod/utils/timer'
], function(inherit, PubSub, Browser, Timer) {
	var Preload = (function() {
		var total, loaded, psuedo, print;
		
		return inherit(PubSub, {
			PRELOAD_INTERVAL: 'onPreloadInterval',
			PRELOAD_FINISH	: 'onPreloadFinish',
			
			$imgs: null,
			timer: null,
			
			init: function(qImgs) {
				PubSub.init.call(this);
				
				if (qImgs === undefined) {
					qImgs = 'img';
				}
				this.$imgs = $(qImgs);
				this.timer = inherit(Timer).init(1000 / 60).start();
				this.timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				
				total = 0;
				loaded = 0;
				psuedo = 0;
				print = 0;
				
				return this;
			},
			exec: function() {
				this.$imgs.each(function (index) {
					if (!this.complete) {
						total++;
						
						if (Browser.IE) {
							this.src = this.src + '?' + new Date().getTime();
						}
						$(this).on('load', function(e) {
							loaded++;
						});
					}
				});
				if (total === 0) {
					total = 1;
					loaded = 1;
				}
			},
			onTimer: function() {
				if (psuedo < loaded) {
					psuedo += (loaded - psuedo) * 0.1;
				}
				if (total > 0 && Math.abs(total - psuedo) < 0.1) {
					psuedo = total;
					this.timer.stop();
				}
				print = Math.round((psuedo / total) * 100) || 0;
				
				this.publish(this.PRELOAD_INTERVAL, {
					loaded : print
				});
				
				if (total > 0 && total === psuedo) {
					this.publish(this.PRELOAD_FINISH);
				}
			}
		});
	}());
	
	return Preload;
});
