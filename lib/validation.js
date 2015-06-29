
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
  this.vm.name.subscribe(function(val) {
    console.log(val);
  });
  this.vm.question.subscribe(function(val) {
    console.log(val);
  });

  /*this.vm.addValidator('name', this.vm.factory.require);
  this.vm.addValidator('email', this.vm.factory.require);
  this.vm.addValidator('email', this.vm.factory.email);
  this.vm.addValidator('question', this.vm.factory.require);*/

  ko.applyBindings(this.vm);
}

module.exports = Validation;

