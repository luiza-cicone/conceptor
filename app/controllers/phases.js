
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , async = require('async')
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
 * View a phase
 */

exports.showgraph = function(req, res){

  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Phase.list(options, function(err, phases) {
    if (err) return res.render('500', {error : err})
    Phase.count().exec(function (err, count) {
      res.render('phases/showgraph', {
        title: 'List of Phase',
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

// var page = req.param('page') > 0 ? req.param('page') : 0
//   var perPage = 15
//   var options = {
//     perPage: perPage,
//     page: page,
//     criteria : {phase : req.phase._id}
//   }

//   Technique.list(options, function(err, techniques) {
//     if (err) return res.render('500', {error : err})

//     Technique.count().exec(function (err, count) {
//       res.render('phases/show', {
//         title: 'List of Techniques',
//         techniques: techniques,
//         phase : req.phase
//       })
//     })
//   })
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