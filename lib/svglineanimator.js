
/*
 *    SVG Line Animator
 */

var Q = require('q');
var $ = jQuery = require('jquery');
var extend = require('extend');
var inherit = require('util').inherits;
var events = require('events');
var Path = require('./svglineanimator/path');

function SVGLineAnimator($el, options) {
  //console.log('SVGLineAnimator#constructor');
  if (!($el instanceof jQuery)) {
    $el = $($el);
  }
  this.$el = $el;
  this.paths = [];
  this.promises = [];
  
  // Its better to change original SVG http://graphicdesign.stackexchange.com/questions/15475/convert-primitive-to-path-using-svg-format-in-illustrator
  //var polys = document.querySelectorAll('polygon,polyline');
  //Array.prototype.forEach.call(polys, this.convertPolyToPath);

  $el.find('path').toArray().forEach(function(el) {
    this.paths.push(new Path(el, options));
  }, this);
}
inherit(SVGLineAnimator, events.EventEmitter);
extend(SVGLineAnimator.prototype, {
  animate: function() {
    //console.log('SVGLineAnimator#animate');
    if (this.isAnimate()) {
      return;
    }
    this.$el.css('opacity', 1);

    var promises = this.promises = [];

    this.paths.forEach(function(path) {
      var dfd = Q.defer();
      path.on('animationFinished', function() {
        dfd.resolve();
        path.removeAllListeners('animationFinished');
      });
      promises.push(dfd.promise);
      path.animate();
    }, this);
    
    Q.all(promises).then($.proxy(this.onAnimationFinished, this));
  },
  onAnimationFinished: function() {
    //console.log('SVGLineAnimator#onAnimationFinished');
    this.emit('animationFinished');
    this.promises = [];
  },
  isAnimate: function() {
    //console.log('SVGLineAnimator#isAnimate');
    return this.promises.length > 0;
  },
  convertPolyToPath: function(poly){
    // via http://stackoverflow.com/questions/10717190/convert-svg-polygon-to-path
    var svgNS = poly.ownerSVGElement.namespaceURI;
    var path = document.createElementNS(svgNS, 'path');
    var points = poly.getAttribute('points').split(/\s+|,/);
    var fill = poly.getAttribute('fill');
    var x0 = points.shift(), y0 = points.shift();
    var pathdata = 'M' + x0 + ',' + y0 + 'L' + points.join(' ');
    if (poly.tagName == 'polygon') {
      pathdata += 'z';
    }
    path.setAttribute('d', pathdata);
    path.setAttribute('fill', fill);
    poly.parentNode.replaceChild(path,poly);
  }
});

module.exports = SVGLineAnimator;

