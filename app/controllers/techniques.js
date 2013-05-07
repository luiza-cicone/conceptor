
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , async = require('async')
    , Technique = mongoose.model('Technique')
    , Link = mongoose.model('Link')
    , _ = require('underscore')

/**
 * List of Techniques
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Technique.list(options, function(err, techniques) {
    if (err) return res.render('500', {error : err})
    Technique.count().exec(function (err, count) {
      res.render('techniques/index', {
        title: 'List of Techniques',
        techniques: techniques,
        page: page,
        pages: count / perPage
      })
    })
  })
}

/**
 * View a technique
 */

exports.show = function(req, res){
  res.render('techniques/show', {
    title: req.technique.title,
    technique: req.technique
  })
}


/**
 * Find technique by id
 */

exports.technique = function(req, res, next, id){
  var User = mongoose.model('User')

  Technique.load(id, function (err, technique) {
    if (err) return next(err)
    if (!technique) return next(new Error('Failed to load technique ' + id))
    req.technique = technique
    next()
  })
}


/**
 * New technique
 */

exports.new = function(req, res){

var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }
  
  Technique.list(options, function(err, techniques) {
    if (err) return res.render('500', {error : err})
    res.render('techniques/new', {
      title: 'New Technique',
      technique: new Technique({}),
      techniques: techniques,
      phase: req.phase
    })
  })
}

/**
 * Create a technique
 */

exports.create = function (req, res) {
  var previous = req.body.previous
  delete req.body.previous
  var technique = new Technique(req.body)
  technique.user = req.user
  var phase = req.phase

  technique.save(function (err) {
    if (err) return res.render('500', {error : err})

    phase.addTechnique(technique, function (err) {
      if (err) return res.render('500', {error : err})
    })
    if (previous instanceof Array) {
      previous.forEach(function (idprev) {
        var link = new Link({source : idprev, target : technique._id})
        link.save(function (err) {
          if (err) return res.render('500', {error : err})
        }); 
      })
    } else if (typeof previous != "undefined") {
      var link = new Link({source : previous, target : technique._id})
      link.save(function (err) {
        if (err) return res.render('500', {error : err})
      }); 
    }
    
    res.redirect('phases/'+ phase._id)

  });
}

/**
  * Get JSON
  */

exports.json = function (callback) {
  var options = {}
  Technique.list(options, function(err, techniques) {
    if (err) return res.render('500', {error : err})
    console.log("0 : " + techniques[0])
    Link.list(options, function(err, links) {
      if (err) return res.render('500', {error : err})
      links.forEach(function(link){

      })
      callback(techniques, links);
    })
  }) 
}