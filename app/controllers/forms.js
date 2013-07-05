
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Form = mongoose.model('Form')
  // , Field = mongoose.model('Field')
  , _ = require('underscore')

/*
 * Json form
 */

exports.json = function(name, cb){
  Form.load(name, function (err, form) {
    if (!form) return new Error('Failed to load form ' + name)
    cb(form.json);
  })
}
