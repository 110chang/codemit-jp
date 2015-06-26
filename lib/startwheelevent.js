
/*
 *    StartWheelEvent
 */

var $ = require('jquery');
var Browser = require('./mod/browser');

var _instance = null;

var wheelTimer;
var wheelNow = false;
var margin = Browser().IE() || Browser().IE11() ? 250 : 33;

function wheelHandler(e) {
  //console.log('StartWheelEvent#wheelHandler');
  e.preventDefault();

  if (!wheelNow) {
    $(window).trigger($.extend(e, { type: 'startwheel' }));
  }
  wheelNow = true;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(function() {
    wheelNow = false;
  }, margin);

  return false;
}

function StartWheelEvent() {
  //console.log('StartWheelEvent#constructor');
  if (_instance instanceof StartWheelEvent) {
    return _instance;
  }
  if (!(this instanceof StartWheelEvent)) {
    return new StartWheelEvent();
  }
  
  $(window).on('wheel._StartWheelEvent', wheelHandler);

  _instance = this;
}

module.exports = StartWheelEvent;

