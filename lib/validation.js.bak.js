
/*
 *    Validation
 */

// external libraries
var ko = require('knockout');

// app modules
var FormVM = require('./validation/form');

var formConfig = [{
  key: 'name',
  validators: ['require']
}, {
  key: 'email',
  validators: ['require', 'email']
}, {
  key: 'question',
  validators: ['require']
}];

function Validation() {
  this.vm = new FormVM(formConfig);

  ko.applyBindings(this.vm);
}

module.exports = Validation;

