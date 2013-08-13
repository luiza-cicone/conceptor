
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Phase = mongoose.model('Phase')
  , Technique = mongoose.model('Technique')
  , Link = mongoose.model('Link')
  , _ = require('underscore')
  
/**
 * List of Phases
 */

 //comment


exports.index = function(req, res){
  var options = {
  }

  Phase.list(options, function(err, phases) {
    if (err) return res.render('500', {error : err})
    Phase.count().exec(function (err, count) {
      res.render('phases/index', {
        title: 'List of Phase',
        phases: phases
      })
    })
  })
}

/**
 * View a phase
 */

exports.show = function(req, res){

  res.render('phases/show', {
    title: req.phase.name,
    techniques: req.phase.techniques,
    phase : req.phase,
    process_item : req.process_item
  })
}


/**
 * Find phase by id
 */
//test
exports.phase = function(req, res, next, id){

  Phase.load(id, function (err, phase) {
    if (err) return next(err)
    if (!phase) return next(new Error('Failed to load technique ' + id))
    req.phase = phase
    next()
  })
}


