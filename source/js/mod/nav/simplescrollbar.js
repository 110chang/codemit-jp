// #######################################
//
//   Nav.SimpleScrollBar
//
// #######################################

define([
	'mod/inherit',
	'mod/observer',
	'mod/utils/boundary',
	'mod/utils/browser'
], function (inherit, Observer, boundary, Browser) {
	var $div = $('<div/>'),
		
		SimpleScrollBar = inherit(Observer, {
			SET_OUTSIDE : 'setOutside',
			SET_INSIDE : 'setInside',
			
			$el : null,
			$inner : null,
			$wrap : null,
			$hScrl : null,
			$vScrl : null,
			
			wrapCls : 'simple-scroll-wrapper',
			innerCls : 'simple-scroll-inner',
			hScrlCls : 'simple-scroll-hscrlbar',
			vScrlCls : 'simple-scroll-vscrlbar',
			wrapId : '',
			zIndex : 9999,
			eitherSide : 'setInside',
			
			init : function ($el, settings) {
				this.$el = $el;
				
				$.extend(this, settings || {});
				
				this.wrapId = 'simple-scroll-' + (new Date()).getTime();
				this.$inner = this.$el.find('.' + this.innerCls);
				
				this.$el.wrap(
					$div.clone().attr('id', this.wrapId).addClass(this.wrapCls)
				);
				this.$wrap = $('#' + this.wrapId);
				
				if (this.$el.width() < this.$inner.width()) {
					this.$wrap.width(this.$el.width());
					this._setHorizontalBar();
					console.log(this.$el.width() + '<' + this.$inner.width());
				}
				if (this.$el.height() < this.$inner.height()) {
					this._setVerticalBar();
					console.log(this.$el.height() + '<' + this.$inner.height());
				}
				
				return this;
			},
			update : function (scrollTop) {
				
			},
			resize : function () {
				
			},
			_setHorizontalBar : function () {
				this.$wrap.append(
					$div.clone().addClass(this.hScrlCls)
				);
				this.$hScrl = this.$wrap.find('.' + this.hScrlCls);
				this.$hScrl.css({
					'position' : 'absolute',
					'left' : 0,
					'bottom': 0
				});
				var hScrl = inherit(ScrollBar).init(this.$hScrl, {
					direction : ScrollBar.HORIZONTAL,
					baseHeight : this.$wrap.width(),
					range : 1 - this.$el.width() / this.$inner.width()
				});
				//console.log(this.$hScrl);
				if (this.eitherSide === this.SET_OUTSIDE) {
					this.$wrap.height(this.$el.height() + hScrl.baseWidth);
				} else if (this.eitherSide === this.SET_INSIDE) {
					this.$wrap.height(this.$el.height());
					this.$el.height(this.$el.height() - hScrl.baseWidth);
				} else {
					
				}
			},
			_setVerticalBar : function () {
				this.$wrap.append(
					$div.clone().addClass(this.vScrlCls)
				);
				this.$vScrl = this.$wrap.find('.' + this.vScrlCls);
				this.$vScrl.css({
					'position' : 'absolute',
					'right' : 0,
					'top': 0
				});
				var vScrl = inherit(ScrollBar).init(this.$vScrl, {
					direction : ScrollBar.VERTICAL,
					baseHeight : this.$wrap.height(),
					range : 1 - this.$el.height() / this.$inner.height()
				});
				//console.log(this.$vScrl);
				if (this.eitherSide === this.SET_OUTSIDE) {
					this.$wrap.width(this.$el.width() + vScrl.baseWidth);
				} else if (this.eitherSide === this.SET_INSIDE) {
					this.$wrap.width(this.$el.width());
					this.$el.width(this.$el.width() - vScrl.baseWidth);
				} else {
					
				}
			}
		}),
		ScrollBar = inherit(Observer, {
			HORIZONTAL : 'horizontal',
			VERTICAL : 'vertical',
			
			$el : null,
			$base : null,
			$bar : null,
			
			baseCls : 'simple-scroll-base',
			barCls : 'simple-scroll-bar',
			baseWidth : 10,
			baseHeight : 100,
			barWidth : 6,
			barHeight : 0,
			direction : 'vertical',
			scrollTop : 0,
			minScroll : 0,
			maxScroll : 0,
			range : 0.5,
			pad : 0,
			
			init : function ($el, settings) {
				this.$el = $el;
				$.extend(this, settings || {});
				
				var _self = this,
					_initY = 0,
					_initX = 0,
					
					onMouseDown = function (e) {
						//console.log(e.clientX);
						$(document).bind('mousemove', onMouseMove).bind('mouseup', onMouseUp);
						_initX = e.clientX;
						_initY = e.clientY;
						_self.onMouseDown();
					},
					onMouseMove = function (e) {
						//console.log(e.clientX);
						_self.onMouseMove(e.clientX - _initX, e.clientY - _initY);
					},
					onMouseUp = function (e) {
						//console.log(e.clientX);
						$(document).unbind('mousemove', onMouseMove);
						_self.onMouseUp(e.clientX - _initX, e.clientY - _initY);
					};
				
				this.$el.append(
					$div.clone().addClass(this.baseCls).append(
						$div.clone().addClass(this.barCls)
					)
				);
				this.$base = this.$el.find('.' + this.baseCls);
				this.$bar = this.$el.find('.' + this.barCls);
				
				this.$bar.css({
					cursor : 'pointer'
				}).bind('mousedown', onMouseDown);
				
				this.pad = (this.baseWidth - this.barWidth) / 2;
				this.barHeight = this.baseHeight * (1 - this.range) - this.pad * 2;
				this.minScroll = this.pad;
				this.maxScroll = this.pad + this.baseHeight * this.range;
				
				if (this.direction === this.VERTICAL) {
					this._createVerticalBar();
				} else if (this.direction === this.HORIZONTAL) {
					this._createHorizontalBar();
				} else {
					
				}
				return this;
			},
			onMouseDown : function () {
				if (this.direction === this.VERTICAL) {
					this.scrollTop = this.$bar.position().top;	
				} else if (this.direction === this.HORIZONTAL) {
					this.scrollTop = this.$bar.position().left;
				} else {
					
				}
			},
			onMouseMove : function (dx, dy) {	
				var pos = this.scrollTop;
				console.log(dx + ', ' + dy);
				if (this.direction === this.VERTICAL) {
					if (this.minScroll < pos + dy && pos + dy < this.maxScroll) {
						this.$bar.css({
							'top' : pos + dy
						});
					}
				} else if (this.direction === this.HORIZONTAL) {
					if (this.minScroll < pos + dx && pos + dx < this.maxScroll) {
						this.$bar.css({
							'left' : pos + dx
						});
					}
				} else {
					
				}
			},
			onMouseUp : function () {	
				if (this.direction === this.VERTICAL) {
					this.scrollTop = this.$bar.position().top;	
				} else if (this.direction === this.HORIZONTAL) {
					this.scrollTop = this.$bar.position().left;
				} else {
					
				}
			},
			checkBounds : function () {
				
			},
			_createHorizontalBar : function () {
				//console.log(this.$el);
				this.$base.css({
					position : 'absolute',
					left: 0,
					bottom: 0,
					width : this.baseHeight,
					height : this.baseWidth
				});
				this.$bar.css({
					position : 'absolute',
					width : this.barHeight,
					height : this.barWidth,
					left : this.pad + 'px',
					top: this.pad + 'px'
				});
			},
			_createVerticalBar : function () {
				this.$base.css({
					position : 'absolute',
					right: 0,
					top: 0,
					width : this.baseWidth,
					height : this.baseHeight
				});
				this.$bar.css({
					position : 'absolute',
					width : this.barWidth,
					height : this.barHeight,
					left : this.pad + 'px',
					top: this.pad + 'px'
				});
			}
		});
	
	return SimpleScrollBar;
});
