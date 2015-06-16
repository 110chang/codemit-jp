
/*
 *    ViewArea
 */

var $ = jQuery = require('jquery');
var extend = require('extend');
var inherit = require('util').inherits;
var events = require('events');

function ViewArea($el, options) {
  //console.log('ViewArea#constructor');
  if (!($el instanceof jQuery)) {
    $el = $($el);
  }
  this.$el = $el;
  this.id = $el.attr('id');
  this.inview = false;
  this.just = false;
  this.createBounds();
  $(window).trigger('scroll._viewArea');
  $(window).on('scroll._viewArea', $.proxy(this.onScroll, this));
}
inherit(ViewArea, events.EventEmitter);
extend(ViewArea.prototype, {
  resize: function() {
    //console.log('ViewArea#resize');
    this.createBounds();
    $(window).trigger('scroll._viewArea');
  },
  onScroll: function(e) {
    //console.log('ViewArea#onScroll');
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
    var preInView = this.inview;
    var preJust = this.just;
    this.inview = this.bounds.top < scrollTop && scrollTop < this.bounds.bottom;
    this.just = this.bounds.just === scrollTop;

    if (this.just && this.just !== preJust) {
      //console.log('just!');
      this.emit('viewJust');
    }
    if (this.inview && this.inview !== preInView) {
      //console.log('in view!');
      this.emit('viewIn');
    }
    if (!this.inview && this.inview !== preInView) {
      //console.log('out view!');
      this.emit('viewOut');
    }
  },
  isInView: function() {
    //console.log('ViewArea#isInView');
    return this.inview;
  },
  isJust: function() {
    //console.log('ViewArea#isJust');
    return this.just;
  },
  createBounds: function() {
    //console.log('ViewArea#createBounds');
    var el = this.$el.get(0);
    this.bounds = {
      just   : el.offsetTop,
      top    : el.offsetTop - this.$el.height(),
      bottom : el.offsetTop + this.$el.height()
    };
    //console.log('%s < %s < %s', this.bounds.top, this.bounds.just, this.bounds.bottom);
  }
});

module.exports = ViewArea;
