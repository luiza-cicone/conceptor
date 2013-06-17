
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
  var perPage = 5
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

    console.log ("\n\n\nprevious : " + previous + '\n\n')

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
 * Edit a technique
 */

exports.edit = function (req, res) {
  res.render('techniques/edit', {
    title: 'Edit '+req.technique.title,
    technique: req.technique,
  })
}

/**
 * Update a technique
 */

exports.update = function(req, res){
  var technique = req.technique
  var util = require('util');

  var newTechnique = _.omit(req.body, 'finished');
  technique = _.extend(technique, newTechnique);
  if (req.body.finished)
      technique = _.extend(technique, {'finishedAt' : Date.now()})

  console.log(util.inspect(technique, false, null));

  technique.save(function(err) {
    if (err) {
      console.log ("\n\n\n err : " + err + " \n\n\n")
      res.render('techniques/edit', {
        title: 'Edit Technique',
        technique: technique,
        errors: err.errors
      })
    }
    else {
      res.redirect('/techniques/' + technique._id)
    }
  })
}

/**
 * Delete a technique
 */

exports.destroy = function(req, res){
  var technique = req.technique
  technique.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('phases/'+ technique.phase)
  })
}


/**
  * Get JSON
  */

// exports.json = function (callback) {
//   var options = {}
//   Technique.list(options, function(err, techniques) {
//     if (err) return res.render('500', {error : err})
//     // console.log("\n\n\t\t\t" + techniques[0].createdAt.getTime() + "\n\n\n");
//     Link.list(options, function(err, links) {
//       if (err) return res.render('500', {error : err})

//       callback(techniques, links);
//     })
//   }) 
// }