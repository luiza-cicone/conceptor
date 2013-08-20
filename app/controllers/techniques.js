
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Technique = mongoose.model('Technique')
    , PhaseType = mongoose.model('PhaseType')
    , Process = mongoose.model('Process')
    , Link = mongoose.model('Link')
    , Form = mongoose.model('Form')
    , _ = require('underscore')
    , utils = require('../../lib/utils')
    , _str = require('underscore.string');

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
    phase: req.phase,
    process_item: req.process_item
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


exports.getOne = function(id, next){
  Technique.load(id, function (err, technique) {
    if (err) return next(err)
    next(technique)
  })
}

/*
 * New technique
 */

// TODO : selection on the techniques that are suggested
exports.new = function(req, res){

    var abstracts = [];

    var concretes = req.process_item.phases;
    for(i = 0; i <concretes.length; i ++) {
      abstracts.push(concretes[i].type)
    }

    var phases = []
    PhaseType.list({_id : {$in : abstracts}}, function(err, abstracts) {
      for(i = 0; i <concretes.length; i ++) {
        phases.push({_id : concretes[i]._id, name: concretes[i].name, techniques : abstracts[i].techniques})
      }
      res.render('techniques/new', {
        title: 'List of Techniques',
        phases: phases,
        process_item: req.process_item
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

    var technique = new Technique({}) 

    res.render('init', {
      title: 'New ' + form.name,
      form: form,
      technique: technique,
      phase: req.phase,
      process_item: req.process_item
    });
  })
}

exports.createFirst = function(req, res){

  console.log("start type")

  var type = req.params.type

  var technique = new Technique(req.body) 
  technique.user = req.user

  technique.save(function (err) {
    if (err)  {
        console.log("error in startType")
        return res.render('500', {error : err})
    }
    res.redirect('processes/'+ req.process_item._id+'/'+req.phase._id+'/'+technique._id+'/'+type+'/2')
  })
}


exports.startType = function(req, res){

  form = req.type;

  res.render('form', {
    title: 'New ' + form.name,
    form: form,
    technique: req.technique,
    phase: req.phase,
    process_item: req.process_item,
    start : true
  });
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
        key = _str.capitalize(key)
        if (pathArray.length != 0)
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

  var Model = utils.getModel(json.type);

  var others = _.omit(json, ["title", "comments", "tags", "type", "action", "createdAt"]);

  var files = saveFiles(req.files)
  others.files = files
  
  var technique = req.technique

  console.log("technique in request");
  console.log(technique)

  technique = _.extend(technique, json);

  var phase = req.phase
  technique.phase = phase._id;

  Model.create(others, function(err, result) {
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

  var technique = req.technique

  Form.load(technique.type, function (err, form) {
    if (err || !form)
      return res.render('500', {error : "Failed to load form."})

    res.render('form', {
      title: 'Edit Technique',
      form: form,
      technique: technique,
      phase: req.phase,
      process_item: req.process_item
    });
  })
}

/**
 * Update a technique
 */

exports.update = function(req, res){
  var json = req.body

  console.log(json)

  var technique = req.technique
  var util = require('util');

  technique = _.extend(technique, json);
  if (json.action == 'finish')
      technique = _.extend(technique, {'finishedAt' : Date.now()})

  var Model = utils.getModel(json.type);

  technique.save(function(err) {
    if (err) {
      if (err) return res.render('500', {error : err})
    }
    else {
      var files = saveFiles(req.files)
      
      if (technique.others) {
        // add new files to existing files
        for(key in technique.others.files) {
          if (files[key])
            utils.pushArray(files[key], technique.others.files[key])
          else files[key] = technique.others.files[key]
        }
      

        var others = _.omit(json, ["title", "comments", "tags", "type", "action", "createdAt"]);
        others.files = files;
        
        Model.update({_id : technique.others._id}, others, function(err, numberAffected, raw) {
          if(err) console.log(err);
          res.redirect('/processes/' + req.process_item._id+'/' + req.phase._id + "/" + technique._id)
        });
      } else res.redirect('/processes/' + req.process_item._id+'/' + req.phase._id + "/" + technique._id)
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