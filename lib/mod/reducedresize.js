
/*
*   ReducedResize r1
*/


var $ = jQuery = require('jquery');
var Browser = require('./browser');

var resizeEvent = Browser().nonPC() ? 'orientationchange' : 'resize';
console.log(resizeEvent);
var timer = false;
var event = new $.Event('reducedResize');
$(window).on(resizeEvent, function(e) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    $(window).trigger(event);
  }, 125);
});
