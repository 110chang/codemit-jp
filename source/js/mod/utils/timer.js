/*
*
*   Utils.Timer r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/pubsub'
], function(inherit, PubSub) {
	var Timer = inherit(PubSub, {
		
		TIMER		 : 'onTimer',
		TIMER_START	 : 'onTimerStart',
		TIMER_STOP	 : 'onTimerStop',
		
		duration	 : 10000,
		timer		 : null,
		repeat		 : -1,
		count		 : -1,
		startTime 	 : null,
		stopTime	 : null,
		
		init: function(duraion, repeat) {
			PubSub.init.call(this);
			this.duration = duraion || this.duration;
			if (typeof repeat === 'number') {
				this.repeat = repeat;
			}
			return this;
		},
		start: function() {
			clearInterval(this.timer);
			
			this.count = this.repeat;
			this.timer = setInterval($.proxy(this._onTimerHandler, this), this.duration);
			this.startTime = (new Date()).getTime();
			this.stopTime = null;
			
			this.publish(Timer.TIMER_START, { time: this.startTime });
			
			return this;
		},
		stop: function() {
			clearInterval(this.timer);
			
			this.timer = null;
			this.stopTime = (new Date()).getTime();
			
			this.publish(Timer.TIMER_STOP, { time: this.stopTime });
			
			return this;
		},
		_onTimerHandler: function() {
			this.count--;
			
			if (this.count <= 0) {
				this.stop();
			}
			this.publish(Timer.TIMER, { count: this.count });
		}
	});
	
	return Timer;
});
