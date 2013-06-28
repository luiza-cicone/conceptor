
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

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Phase.list(options, function(err, phases) {
    if (err) return res.render('500', {error : err})
    Phase.count().exec(function (err, count) {
      res.render('phases/index', {
        title: 'List of Phase',
        phases: phases,
        page: page,
        pages: count / perPage
      })
    })
  })
}

/**
 * View graph
 */

exports.graph = function(req, res){

  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Phase.list(options, function(err, phases) {
    if (err) return res.render('500', {error : err})
    Phase.count().exec(function (err, count) {
      res.render('phases/graph', {
        title: 'Graph',
        phases: phases,
        page: page,
        pages: count / perPage
      })
    })
  })
  
}

exports.show = function(req, res){

  res.render('phases/show', {
    title: req.phase.title,
    techniques: req.phase.techniques,
    phase : req.phase
  })
}


/**
 * Find phase by id
 */

exports.phase = function(req, res, next, id){

  Phase.load(id, function (err, phase) {
    if (err) return next(err)
    if (!phase) return next(new Error('Failed to load technique ' + id))
    req.phase = phase
    next()
  })
}

/**
 * Exports JSON for graph
 */

exports.json = function (callback) {
  var options = {}
  Phase.list(options, function(err, techniques) {
    if (err) return res.render('500', {error : err})
    Link.list(options, function(err, links) {
      if (err) return res.render('500', {error : err})
      callback(techniques, links);
    })
  }) 
}

