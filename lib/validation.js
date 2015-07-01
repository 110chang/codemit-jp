  
/*
 *    Validation
 */

// external libraries
var ko = require('knockout');
var extend = require('extend');

var REG_EMAIL = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var REG_TEL = /^\+?[\d-]{1,5}\-?\d{1,4}\-?\d{4}$/;

function capFirst(str) {
  return str.replace(/^.{1}/, str.slice(0, 1).toUpperCase());
}

function ValidatorFactory(vm) {
  this.require = function(key) {
    return ko.computed(function() {
      return vm[key]() !== '' && vm[key]() != null;
    });
  };
  this.email = function(key) {
    return ko.computed(function() {
      return REG_EMAIL.test(vm[key]());
    });
  };
}

function Validation(settings) {
  //console.log('Validation#constructor');
  this.validators = {};
  this.factory = new ValidatorFactory(this);

  settings.forEach(function(obj) {
    var key = obj.key;

    this[key] = ko.observable('');

    obj.validators.forEach(function(validator) {
      // add to validators list
      this.addValidator(key, this.factory[validator]);
      // create message binding
      // if name: email, validator: require then
      // create computed variable named `emailRequireMsg`
      this[key + capFirst(validator) + 'Msg'] = this.factory[validator](key);
    }, this);
  }, this);

  ko.applyBindings(this);
}
extend(Validation.prototype, {
  onSubmit: function(form) {
    //console.log('Validation#onSubmit');
    var key, results = [];
    for (key in this.validators) {
      this.validators[key].forEach(function(validator) {
        //console.log('%c%s:%c%s', 'background:#FFC;', key, 'color:#00F;', validator());
        results.push(validator());
      }, this);
    }
    if (!/false/.test(results)) {
      form.submit();
    }
  },
  addValidator: function(key, func) {
    //console.log('Validation#addValidator');
    if (!this.validators[key]) {
      this.validators[key] = [];
    }
    this.validators[key].push(func(key));
  }
});

module.exports = Validation;

