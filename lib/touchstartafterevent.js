
/*
 *    TouchStartAfterEvent
 *    trigger once after touchstart, first touchmove event
 */

var $ = require('jquery');

var _instance = null;
var isMove = false;
var startX, startY, distX, distY;

function touchStartHandler(e) {
  //console.log('%ctouchstart', 'background:#FF0;');
  startX = e.originalEvent.touches[0].screenX;
  startY = e.originalEvent.touches[0].screenY;
  $(document).on('touchmove', touchMoveHandler);
}
function touchEndHandler(e) {
  //console.log('%ctouchend', 'background:#F00;color:#FFF;');
  isMove = false;
  $(document).off('touchmove', touchMoveHandler);
}
function touchMoveHandler(e) {
  //console.log('%ctouchmove', 'color:#00F;');
  e.preventDefault();
  if (isMove === false) {
    distX = e.originalEvent.touches[0].screenX;
    distY = e.originalEvent.touches[0].screenY;
    $(document).trigger($.extend(e, {
      type: 'touchstartfirst',
      deltaX: distX - startX,
      deltaY: distY - startY,
    }));
  }
  isMove = true;
  return false;
}

function TouchStartAfterEvent() {
  //console.log('TouchStartAfterEvent#constructor');
  if (_instance instanceof TouchStartAfterEvent) {
    return _instance;
  }
  if (!(this instanceof TouchStartAfterEvent)) {
    return new TouchStartAfterEvent();
  }
  
  $(document).on('touchstart', touchStartHandler);
  $(document).on('touchend', touchEndHandler);

  _instance = this;
}

module.exports = TouchStartAfterEvent;

