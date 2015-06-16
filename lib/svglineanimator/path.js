
/*
 *    SVG Line Animator / Path
 */

var $ = require('jquery');
var TWEEN = require('tween.js');
var extend = require('extend');
var inherit = require('util').inherits;
var events = require('events');

var defaults = {
  duration: 2000,
  strokeColor: '#333',
  strokeWidth: '0.5px'
};

function Path(el, options) {
  //console.log('Path#constructor');
  this.options = $.extend({}, defaults, options);
  this.el = el;
  this.length = el.getTotalLength();
  //this.animate();
}
inherit(Path, events.EventEmitter);
extend(Path.prototype, {
  animate: function() {
    this.beforeAnimation();
    this.doAnimation();
  },
  beforeAnimation: function() {
    var l = this.length;

    $(this.el).attr({
      'fill-opacity': 0,
      'stroke-width': this.options.strokeWidth,
      'stroke': this.options.strokeColor,
      'stroke-opacity': 1,
      'stroke-dasharray': l + ' ' + l,
      'stroke-dashoffset': l
    });
  },
  doAnimation: function() {
    var duration = this.options.duration;
    var requestId = -1;
    var _el = this.el;
    var _self = this;
    var tweenOutline = new TWEEN.Tween({ offset: this.length });
    var tweenFill = new TWEEN.Tween({ opacity: 0 });
    
    tweenOutline.to({ offset: 1 }, duration * 0.6)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        _el.setAttribute('stroke-dashoffset', Math.floor(this.offset));
      }).start().chain(tweenFill);

    tweenFill.to({ opacity: 1 }, duration * 0.4)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        _el.setAttribute('fill-opacity', this.opacity);
        _el.setAttribute('stroke-opacity', 1 - this.opacity);
      }).onComplete(function(callback) {
        //console.log('cancel animation frame.');
        cancelAnimationFrame(requestId);
        requestId = -1;
        _self.emit('animationFinished');
      });
  }
});

module.exports = Path;

