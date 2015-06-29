
/*
 *    Main/Contact
 */


// external libraries
var $ = require('jquery');

// common modules
var Browser = require('./mod/browser');

// app modules
var Validation = require('./validation');


$(function() {
  //console.log('dom ready.');

  $('input,textarea').on('focus', function(e) {
    console.log('focus');
    $('.global-nav').addClass('gnav--hide');
  });
  $('input,textarea').on('blur', function(e) {
    console.log('blur');
    $('.global-nav').removeClass('gnav--hide');
  });

  var validation = new Validation();

});

