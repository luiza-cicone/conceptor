
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Form = mongoose.model('Form')
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
    title: 'New type of technique',
    technique: new Form({})
  })
}

/**
 * Create a type of technique
 */

exports.createTechnique = function (req, res) {
  var technique = new Form(req.body)

  if (technique.json)
    technique.json = JSON.parse(technique.json);
  if (technique.json_second)
    technique.json_second = JSON.parse(technique.json_second);

  technique.save(function (err) {
    if (err) {
      res.render('admin/techniques', {
        technique: technique,
        errors: err.errors
      })
    }
    else {
      res.redirect('admin/techniques/')
    }
  })
}

/*
 * list
 */

exports.techniques = function(req, res){
  Form.list(function(err, techniques) {
    if (err) return res.render('500', {error : err.errors || err})
    res.render('admin/techniques', {
      techniques: techniques,
    })
  })
}

/**
 * Find technique by id
 */

exports.technique = function(req, res, next, id){

  Form.load(id, function (err, technique) {
    if (err) return next(err)
    if (!technique) return next(new Error('Failed to load technique ' + id))
    req.type = technique
    next()
  })
}

/**
 * View a technique
 */

exports.show = function(req, res){
  res.render('admin/show_technique', {
    title: req.type.name,
    technique: req.type,
    json: JSON.stringify(req.type.json, null, 2),
    json_second: JSON.stringify(req.type.json_second, null, 2)
  })
}

/**
 * Update technique
 */

exports.modifyTechnique = function (req, res) {  
  var action = req.body.action
  delete req.body.action

  var technique = req.type
  
  if (action == 'save') {
    technique = _.extend(technique, req.body)

  console.log(technique)
  if (technique.json)
    technique.json = JSON.parse(technique.json);
  if (technique.json_second)
    technique.json_second = JSON.parse(technique.json_second);

    technique.save(function (err) {
      if (err) {
        res.render('admin/techniques', {
          technique: technique,
          errors: err.errors
        })
      }
      else {
        res.redirect('admin/techniques/')
      }
    })
  }
  else {
    technique.remove(function(err){
      // req.flash('notice', 'Deleted successfully')
      res.redirect('/admin/techniques/')
    })
  }
}
