
/*
 *    Main
 */

// external libraries
var $ = require('jquery');
var TWEEN = require('tween.js');

// common modules
var reducedResize = require('./mod/reducedresize');
var Anchor = require('./mod/anchor');
var raf = require('./mod/raf');

// app modules
var SVGLineAnimator = require('./svglineanimator');
var Config = require('./config');
var ViewArea = require('./viewarea');
var Router = require('./router');
var StartWheelEvent = require('./startwheelevent');
var TouchStartFirst = require('./touchstartfirst');


$(function() {
  console.log('dom ready.');

  //Anchor().initialize();

  require('jquery-touchswipe');

  var router = new Router(location.hash);

  Config.forEach(function(cfg) {
    var $area = $('#' + cfg.id);
    var $logo = $area.children('.logo');
    var $tagline = $area.children('.tagline').fadeOut(0);
    var svg = new SVGLineAnimator($logo, cfg.svgOptions);

    // http://yami-beta.hateblo.jp/entry/2014/11/13/223859
    $area.height(window.innerHeight);
    
    svg.on('animationFinished', function() {
      $tagline.fadeIn(500);
    });
    
    $logo.on('click', function(e) {
      svg.animate();
    });

    var viewArea = new ViewArea($area);
    if (viewArea.isInView()) {
      svg.animate();
    }
    viewArea.on('viewJust', function() {
      //console.log('just!');
    });
    viewArea.on('viewIn', function() {
      console.log('in view!');
      console.log(viewArea.id);
      svg.animate();
      router.routeSilent(router.getNumberById(viewArea.id));
      //$tagline.fadeIn(cfg.svgOptions.duration || 2000);
    });
    viewArea.on('viewOut', function() {
      //console.log('out view!');
      $tagline.fadeOut(0);
    });

    $(window).on('reducedResize', function() {
      viewArea.resize();
    });

  }, this);


  if ('ontouchstart' in window) {
    TouchStartFirst();
    $(document).on('touchstartfirst', function(e) {
      console.log('touch start first');
      if (e.deltaY < 0) {
        router.next();
      }
      if (0 < e.deltaY) {
        router.prev();
      }
    });
  } else {
    StartWheelEvent();
    $(window).on('startwheel', function(e) {
      console.log('wheel start');
      if (e.originalEvent.deltaY > 0) {
        router.next();
      }
      if (e.originalEvent.deltaY < 0) {
        router.prev();
      }
    });
  }


  var tween;

  router.on('hashUpdate', function(e) {
    console.log('router hash change');

    if (tween && tween.stop) {
      tween.stop();
    }
    tween = new TWEEN.Tween({ 
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop || 0
    });

    tween
      .to({
        scrollTop: $(location.hash.replace(/^#\//, '#')).offset().top
      }, 1000)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        window.scrollTo(0, this.scrollTop);
      })
      .onComplete(function() {
        //$(window).off('wheel._main').on('wheel._main', wheelHandler);
      })
      .start();
  });
  router.route(router.current);

  // global TWEEN loop
  var loop = function() {
    requestId = requestAnimationFrame(loop);
    TWEEN.update();
  };
  loop();

});

