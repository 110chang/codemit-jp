/*
 *
 *   Main 
 *
 */

requirejs.config({
  baseUrl: '/js',
  urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'mod'   : 'mod',
    'tween' : 'lib/tween.min'
  }
});

require([
  'mod/utils/raf',
  'tween'
], function(RAF) {
  $(function() {
    //console.log('DOM ready.');
    //console.log(TWEEN);
    var duration = 2000,
      requestId = -1,
      $logo = $('#logo'),
      $paths = $('path'),
      $tagline = $('#tagline'),
      init, loop;

    if (!Modernizr.svg) {
      return;
    }
    init = function() {
      if (requestId != -1) {
        //console.log('now animate!')
        return;
      }
      $paths.each(function(index) {
        var e = this,
          l = e.getTotalLength(),
          offsetStart = { offset: l },
          offsetEnd = { offset: 0 },
          opacityStart = { opacity: 0 },
          opacityEnd = { opacity: 1 },
          tweenOutline, tweenFill, updateOutline, updateFill;

        $(e).attr({
          'fill-opacity': 0,
          'stroke-width': '0.5px',
          'stroke': '#333',
          'stroke-opacity': 1,
          'stroke-dasharray': l + ' ' + l,
          'stroke-dashoffset': l
        });

        updateOutline = (function(_e) {
          return function(callback) {
            //console.log(_e);
            _e.setAttribute('stroke-dashoffset', Math.floor(this.offset));
          }
        }(e));
        updateFill = (function(_e) {
          return function(callback) {
            //console.log(_e);
            _e.setAttribute('fill-opacity', this.opacity);
            _e.setAttribute('stroke-opacity', 1 - this.opacity);
          }
        }(e));
        tweenOutline = new TWEEN.Tween(offsetStart);
        tweenFill = new TWEEN.Tween(opacityStart);
        
        tweenOutline.to(offsetEnd, duration * 0.6)
          .easing( TWEEN.Easing.Quartic.Out )
          .onUpdate(updateOutline).start().chain(tweenFill);

        tweenFill.to(opacityEnd, duration * 0.4)
          .easing( TWEEN.Easing.Quartic.Out )
          .onUpdate(updateFill).onComplete(function(callback) {
            //console.log('cancel animation frame.')
            cancelAnimationFrame(requestId);
            requestId = -1;
          });
      });

      $logo.css('opacity', 1);
      $tagline.css('opacity', 0).delay(duration * 0.6).animate({
        'opacity': 1
      }, duration * 0.4, 'easeOutQuad');
      //console.log(TWEEN.getAll())
      requestId = requestAnimationFrame(loop);
    };
    loop = function() {
      requestAnimationFrame(loop);
      TWEEN.update();
    };
    $(window).on('click touchstart', function(e) {
      init();
    });
    init();

  });
});