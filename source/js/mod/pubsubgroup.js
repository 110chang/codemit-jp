/*
*
*   PubSubGroup r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/compare',
	'mod/pubsub'
], function(inherit, compare, PubSub) {
	var PubSubGroup = inherit(PubSub, {
			COMPLETE: 'onComplete',
			count: 0,
			
			init: function() {
				PubSub.init.call(this);
				this.count = 0;
				
				return this;
			},
			add: function(publisher, topic) {
				if (!compare(publisher, PubSub)) {
					throw new Error('Publisher must be inherit PubSub.');
				}
				publisher.subscribe(topic, '_onPublish', this);
				this.count++;
			},
			_onPublish: function() {
				this.count--;
				
				if (this.count === 0) {
					this.publish(PubSubGroup.COMPLETE);
				}
			}
		});
	
	return PubSubGroup;
});
