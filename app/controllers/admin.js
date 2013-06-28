
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Form = mongoose.model('Form')
  // , Field = mongoose.model('Field')
  , _ = require('underscore')


/**
 * Index
 */

exports.index = function(req, res){    
  res.render('admin/index', {})
}

/**
 * New type of technique
 */

exports.newTechnique = function(req, res){    
  res.render('admin/new_technique', {
    title: 'New type of technique'
  })
}

// /**
//  * Create a type of technique
//  */

exports.createTechnique = function (req, res) {
  var technique = new Form(req.body)

  technique.json = JSON.parse(technique.json);

  technique.save(function (err) {
    if (err) {
      res.render('admin/techniques', {
        title: 'New type of technique',
        technique: technique,
        errors: err.errors
      })
    }
    else {
      res.redirect('admin/techniques')
    }
  })
}