  
/*
 *    Validation/Form
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

function FormVM(settings) {
  this.validators = {};
  this.factory = new ValidatorFactory(this);

  settings.forEach(function(obj) {
    var key = obj.key;

    this[key] = ko.observable('');

    obj.validators.forEach(function(validator) {
      this.addValidator(key, this.factory[validator]);
      this[key + capFirst(validator) + 'Msg'] = this.factory[validator](key);
    }, this);
  }, this);
}
extend(FormVM.prototype, {
  onSubmit: function(form) {
    var key, results = [];
    for (key in this.validators) {
      this.validators[key].forEach(function(validator) {
        //console.log('%c%s:%c%s', 'background:#FFC;', key, 'color:#00F;', validator());
        results.push(validator());
      }, this);
    }
    //console.log(!/false/.test(results));
    if (!/false/.test(results)) {
      form.submit();
    }
  },
  addValidator: function(key, func) {
    if (!this.validators[key]) {
      this.validators[key] = [];
    }
    this.validators[key].push(func(key));
  }
});

module.exports = FormVM;

