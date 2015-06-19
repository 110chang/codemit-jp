
/*
 *    Router
 */

// external libraries
var extend = require('extend');
var inherit = require('util').inherits;
var events = require('events');

// app modules
var Config = require('./config');

// id : id
// get hash: #/hash
// set hash: /hash

function isId(token) {
  return /^[a-zA-Z][0-9a-zA-Z\-_]+/.test(token);
}
function isHash(token) {
  return /^#?\/[a-zA-Z][0-9a-zA-Z\-_]+/.test(token);
}
function hashToId(hash) {
  return hash.replace(/^#?\//, '');
}
function idToHash(id) {
  return '/' + id;
}

function Router(hash) {
  console.log('Router#constructor');

  this.routes = [];
  this.current = 0;
  this.isLocked = false;

  Config.forEach(function(cfg) {
    this.routes.push(cfg.id);
  }, this);

  if (!hash) {
    hash = idToHash(this.routes[0]);
  }
  this.route(this.getNumberById(hashToId(hash)));
}
inherit(Router, events.EventEmitter);
extend(Router.prototype, {
  route: function(number) {
    console.log('Router#route');
    console.log(number);

    if (this.isLocked) {
      return;
    }
    if (this.routes.length <= number) {
      return;
    }
    if (number < 0) {
      return;
    }

    this.current = number;
    location.hash = idToHash(this.getId(number));
    this.emit('hashUpdate');
  },
  routeSilent: function(number) {
    console.log('Router#routeSilent');

    if (this.isLocked) {
      return;
    }
    if (this.routes.length <= number) {
      return;
    }
    if (number < 0) {
      return;
    }

    this.current = number;
    location.hash = idToHash(this.getId(number));
  },
  routeByHref: function(href) {
    console.log('Router#routeByHref');
    console.log(href.split(/#\//)[1]);
    this.route(this.getNumberById(href.split(/#\//)[1]));
  },
  next: function() {
    console.log('Router#next');
    this.route(this.current + 1);
  },
  prev: function() {
    console.log('Router#prev');
    console.log(this.current);
    this.route(this.current - 1);
  },
  lock: function() {
    this.isLocked = true;
  },
  unlock: function() {
    this.isLocked = false;
  },
  getId: function(num) {
    return this.routes[num] || this.routes[0];
  },
  getNumberById: function(token) {
    if (isHash(token)) {
      token = hashToId(token);
    }
    if (!isId(token)) {
      return 0;
    }
    return this.routes.indexOf(token);
  }
});

module.exports = Router;
