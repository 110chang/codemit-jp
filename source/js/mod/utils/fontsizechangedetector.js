/*
*
*   Utils.FontSizeChangeDetector r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/pubsub',
	'mod/utils/timer'
], function(inherit, PubSub, Timer) {
	var FontSizeChangeDetector = (function() {
		var instance = null,
			$div	 = $('<div />'),
			str		 = 'S',
			target	 = 0,
			timer	 = null;
		
		return instance || inherit(PubSub, {
			FONT_SIZE_CHANGE: 'onFontSizeChange',
			
			init: function(interval) {
				PubSub.init.call(this);
				
				if (interval === undefined) {
					interval = 66; // neary 1000 / 15
				}
				$div.text(str);
				$div.css({
					'visibility' : 'hidden',
					'position' : 'absolute',
					'top': 0
				});
				$('body').append($div);
				target = $div.get(0).offsetHeight;
				
				timer = inherit(Timer).init(interval).start();
				timer.subscribe(Timer.TIMER, $.proxy(this.onTimer, this));
				
				instance = this;
				
				return this;
			},
			onTimer: function(e) {
				if (target !== $div.get(0).offsetHeight) {
					target = $div.get(0).offsetHeight;
					this.publish(this.FONT_SIZE_CHANGE);
				}
			}
		});
	}());
	
	return FontSizeChangeDetector;
});
