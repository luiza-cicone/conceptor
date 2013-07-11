
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Technique = mongoose.model('Technique')
    , Link = mongoose.model('Link')
    , Form = mongoose.model('Form')
    , _ = require('underscore')
    , utils = require('../../lib/utils')

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


/*
 * New technique
 */

// TODO : selection on the techniques that are suggested
exports.new = function(req, res){
  Form.list(function(err, techniques) {
    if (err) return res.render('500', {error : err.errors || err})
    res.render('techniques/new', {
      title: 'List of Techniques',
      techniques: techniques,
      phase : req.phase
    })
  })
}

/**
 * New technique of type
 */

exports.newType = function(req, res){

  var type = req.params.type

  Form.load(type, function (err, form) {
    if (err || !form)
      return res.render('500', {error : "Failed to load form."})

    res.render('form', {
      title: "New technique",
      form: form,
      phase: req.phase
    });
  })
}

function saveFiles(files, cb) {

    if (!files || (files.count)) return;
    
    for(key in files) {
      var fileArray = files[key];
      var filesObject = {};

      if (!(fileArray instanceof Array)) {
        var newPath = utils.saveFile(fileArray);
        if (newPath)
            filesObject[key] = newPath;
      }
      else if (fileArray instanceof Array) {
        var pathArray = []
        for (var i = 0; i < fileArray.length; i++) {
          var newPath = utils.saveFile(fileArray[i]);
          if (newPath)
            pathArray.push(newPath);
        }
        filesObject[key] = pathArray;
      }
    }
    return filesObject;
  }

/**
 * Create a technique
 */

exports.create = function (req, res) {

  var json = req.body

  // TODO: handle previous and relationships
  // var previous = json.previous
  // delete json.previous

  // get Others model
  var Model = utils.getModel(json.form);
  delete json.form

  var others = _.omit(json, ["title", "comments", "tags", "type"]);

  var files = saveFiles(req.files)
  others.files = files

  var technique = new Technique(json)
  technique.user = req.user

  var phase = req.phase
  technique.phase = phase._id;

  Model.create(others, function(err, result) {
    if(err) console.log(err);

    technique.others = result._id;

    technique.save(function (err) {
      if (err) return res.render('500', {error : err})
      
      phase.addTechnique(technique, function (err) {
        if (err) return res.render('500', {error : err});
      });

      // if (previous instanceof Array) {
      //   previous.forEach(function (idprev) {
      //     var link = new Link({source : idprev, target : technique._id})
      //     link.save(function (err) {
      //       if (err) return res.render('500', {error : err})
      //     }); 
      //   })
      // } else if (typeof previous != "undefined") {
      //   var link = new Link({source : previous, target : technique._id})
      //   link.save(function (err) {
      //     if (err) return res.render('500', {error : err})
      //   }); 
      // }
      
      res.redirect('phases/'+ phase._id)

    });
  })
}

/**
 * Edit a technique
 */

exports.edit = function (req, res) {
  // res.render('techniques/edit', {
  //   title: 'Edit '+req.technique.title,
  //   technique: req.technique,
  // })

  var technique = req.technique

  console.log(technique)

  Form.load(technique.type, function (err, form) {
    if (err || !form)
      return res.render('500', {error : "Failed to load form."})

    res.render('form', {
      title: 'Edit Technique',
      form: form,
      technique: technique,
      phase: req.phase
    });
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
  var phase = req.phase;
  technique.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('phases/' + phase._id)
  })
}