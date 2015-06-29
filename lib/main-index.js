
/*
 *    Main/Index
 */


// external libraries
var $ = require('jquery');
var TWEEN = require('tween.js');

// common modules
var reducedResize = require('./mod/reducedresize');
var raf = require('./mod/raf');
var Browser = require('./mod/browser');

// app modules
var SVGLineAnimator = require('./svglineanimator');
var Config = require('./config');
var ViewArea = require('./viewarea');
var Router = require('./router');
var StartWheelEvent = require('./startwheelevent');
var TouchStartAfter = require('./touchstartafter');
var Validation = require('./validation');

if (Browser().ie < 9) {
  return;
}

$(function() {
  //console.log('dom ready.');

  var router = new Router();
  var tween;

  router.on('hashUpdate', function(e) {
    //console.log('router hash change');
    router.lock();

    if (tween && tween.stop) {
      tween.stop();
    }
    tween = new TWEEN.Tween({ 
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop || 0
    });

    tween
      .to({
        scrollTop: $(location.hash.replace(/^#\//, '#')).offset().top
      }, 500)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        window.scrollTo(0, this.scrollTop);
      })
      .onComplete(function() {
        //$(window).off('wheel._main').on('wheel._main', wheelHandler);
        router.unlock();
        tween.stop();
      })
      .start();
  });

  var onReducedResize = function() {
    router.route(router.current);
  }

  $(window).on('reducedResize', onReducedResize);

  $('#global-nav a').on('click', function(e) {
    router.routeByHref(this.href);
  });

  // global TWEEN loop
  var loop = function() {
    requestId = requestAnimationFrame(loop);
    TWEEN.update();
  };
  loop();


  Config.forEach(function(cfg) {
    var $area = $('#' + cfg.id);
    var $logo = $area.find('.logo');
    var $tagline = $area.find('.tagline,.outbound').fadeOut(0);
    var $sidebar = $area.find('.sidebar');
    var $close = $area.find('.close');
    var viewArea = new ViewArea($area);

    if (cfg.svgOptions) {
      var svg = new SVGLineAnimator($logo, cfg.svgOptions);

      svg.on('animationFinished', function() {
        $tagline.fadeIn(250);
      });
      
      $logo.on('click', function(e) {
        svg.animate();
      });

      if (viewArea.isInView()) {
        svg.animate();
      }
    }

    viewArea.on('viewJust', function() {
      //console.log('just!');
    });
    viewArea.on('viewIn', function() {
      //console.log('in view!');
      //console.log(viewArea.id);
      if (cfg.svgOptions) {
        svg.animate();
      }
      router.routeSilent(router.getNumberById(viewArea.id));
      //$tagline.fadeIn(cfg.svgOptions.duration || 2000);
    });
    viewArea.on('viewOut', function() {
      //console.log('out view!');
      $tagline.fadeOut(0);
    });

    $(window).on('reducedResize', function() {
      //console.log('window#reducedResize');
      viewArea.resize();
    });

    if ($sidebar.size() > 0) {
      $sidebar.on('click', function(e) {
        router.toggleDesc();
      });
    }
    if ($close.size() > 0) {
      $close.on('click', function(e) {
        //console.log('click');
        router.hideDesc();
      });
    }

  }, this);


  if ('ontouchstart' in window) {
    TouchStartAfter();
    $(document).on('touchstartfirst', function(e) {
      //console.log('touch start first');
      //console.log('%s,%s', e.deltaX, e.deltaY);
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX < 0) {
          router.showDesc();
        } else if (0 < e.deltaX) {
          router.hideDesc();
        }
      } else {
        if (e.deltaY < 0) {
          router.next();
        } else if (0 < e.deltaY) {
          router.prev();
        }
      }
    });
  } else {
    StartWheelEvent();
    $(window).on('startwheel', function(e) {
      //console.log('wheel start');
      if (Math.abs(e.originalEvent.deltaX) > Math.abs(e.originalEvent.deltaY)) {
        if (e.originalEvent.deltaX > 0) {
          router.showDesc();
        }
        if (e.originalEvent.deltaX < 0) {
          router.hideDesc();
        }
      } else {
        if (e.originalEvent.deltaY > 0) {
          router.next();
        }
        if (e.originalEvent.deltaY < 0) {
          router.prev();
        }
      }
    });
  }

  $(window).on('hashchange', function(e) {
    //console.log('hashchange');
    if (!router.isLocked) {
      router.routeByHash(location.hash);
    }
  });

  //if (Browser().iOS()) {
    $('input,textarea').on('focus', function(e) {
      console.log('focus');
      $(window).off('reducedResize', onReducedResize);
      $('.global-nav').addClass('gnav--hide');
    });

    $('input,textarea').on('blur', function(e) {
      console.log('blur');
      $('.global-nav').removeClass('gnav--hide');
      $(window).on('reducedResize', onReducedResize);
    });
  //}

  router.unlock();
  router.routeByHash(location.hash);

  var validation = new Validation();

});

