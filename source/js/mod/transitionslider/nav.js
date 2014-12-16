/*
*
*   TransitionSlider.Nav r1
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
	var Nav = {
		
		defaults 		 : {
			qList		 : 'li',
			qAnchor		 : 'a',
			activeClass	 : 'on'
		},
		cnf 		 : {},
		
		$el			 : null,
		$list		 : null,
		$anchors	 : null,
		slider		 : null,
		
		init: function($el, slider, options) {
			var cnf = this.cnf = $.extend(this.defaults, options || {});
			
			this.$el = $el;
			this.$list = this.$el.find(cnf.qList);
			this.$anchors = this.$el.find(cnf.qAnchor);
			this.slider = slider;
			this.$anchors.each(function(index) {
				$(this).on('click', function(e) {
					slider.jump(index);
				});
			});
			
			if (this.$list.size() !== slider.getOriginalLength()) {
				throw new Error('Number of elements does not match.');
			}
			
			slider.subscribe(slider.UPDATE, $.proxy(this.update, this));
		},
		update: function(e, data) {
			var cnf = this.cnf;
			
			this.$list.each(function(index) {
				if (index === data.current) {
					$(this).addClass(cnf.activeClass);
				} else {
					$(this).removeClass(cnf.activeClass);
				}
			});
		}
	};
	
	return Nav;
});
