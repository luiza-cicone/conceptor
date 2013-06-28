
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Form = mongoose.model('Form')
  // , Field = mongoose.model('Field')
  , _ = require('underscore')

/*
 * list
 */

exports.list = function(req, res){
  Form.list(function(err, techniques) {
    if (err) return res.render('500', {error : err.errors || err})
    res.render('techniques/new', {
      title: 'List of Techniques',
      techniques: techniques,
      phase : req.phase
    })
  })
}


/*
 * Json form
 */

exports.json = function(name, cb){
  Form.load(name, function (err, form) {
    if (!form) return new Error('Failed to load form ' + name)
    cb(form.json);
  })
}
