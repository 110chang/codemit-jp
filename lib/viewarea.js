
/*
 *    ViewArea
 */

// external libraries
var $ = jQuery = require('jquery');
var extend = require('extend');
var inherit = require('util').inherits;
var events = require('events');

// common modules
var Browser = require('./mod/browser');

function ViewArea($el, options) {
  //console.log('ViewArea#constructor');
  if (!($el instanceof jQuery)) {
    $el = $($el);
  }
  this.$el = $el;
  this.$debug = $('<div/>').addClass('debug');
  this.id = $el.attr('id');
  this.inview = false;
  this.just = false;
  this.createBounds();
  //$(window).trigger('scroll._viewArea');
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
    var viewHeight = this.$el.height();

    if (Browser().iOS()) {
      // http://yami-beta.hateblo.jp/entry/2014/11/13/223859
      this.$el.width(window.innerWidth);
      this.$el.height(window.innerHeight);
      viewHeight = window.innerHeight;
    }
    //console.log(this.$el.height());
    this.bounds = {
      just   : el.offsetTop,
      top    : el.offsetTop - viewHeight,
      bottom : el.offsetTop + viewHeight
    };
    //this.updateDebug();
    $(window).trigger('scroll._viewArea');
    //console.log('%s < %s < %s', this.bounds.top, this.bounds.just, this.bounds.bottom);
  },
  updateDebug: function() {
    if (this.$el.find('.debug').size() === 0) {
      this.$el.append(this.$debug);
    }
    this.$debug.text(this.bounds.top + '<' + this.bounds.just + '<' + this.bounds.bottom);
  }
});

module.exports = ViewArea;
