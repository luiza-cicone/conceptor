
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Technique = mongoose.model('Technique')
    , Link = mongoose.model('Link')
    , Form = mongoose.model('Form')
    , _ = require('underscore')
    , fs = require('fs');


/**
 * List of Techniques
 */

exports.index = function(req, res){
  var options = {}

  Technique.list(options, function(err, techniques) {
    if (err) return res.render('500', {error : err.errors || err})
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
  console.log("phase : ")
  console.log(req.phase)
  res.render('techniques/show', {
    title: req.technique.title,
    technique: req.technique,
    phase: req.phase
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
 * New technique of type
 */

exports.newType = function(req, res){

  var name = req.params.technique_type
  Form.load(name, function (err, form) {
    if (err || !form)
      return res.render('500', {error : "Failed to load form."})

    res.render('form', {
      title : form.name,
      phase: req.phase
    });
  })
}


/**
 * New technique
 */

// exports.new = function(req, res){    
//   res.render('techniques/new', {
//     title: 'New Technique',
//     phase: req.phase
//   })
// }


/**
 * Create a technique
 */

exports.create = function (req, res) {
  var files = req.files
  var errors1;
  fs.readFile(req.files.files[0].path, function (err, data) {
    // ...
    var newPath = __dirname + "/uploads /" + req.files.files[0].name;
    fs.writeFile(newPath, data, function (err) {
      if (err) return res.render('500', {error : err})

      var previous = req.body.previous
      delete req.body.previous

      var technique = new Technique(req.body)
      technique.user = req.user

      var phase = req.phase
      var techniques = req.techniques;

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
    });
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
  var technique = req.technique;
  technique.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('phases')
  })
}