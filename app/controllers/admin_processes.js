
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Phase = mongoose.model('PhaseType')
  , Process = mongoose.model('ProcessType')
  , ProcessI = mongoose.model('Process')
  , _ = require('underscore')


exports.index = function(req, res) {
  res.render('home', {})
}

exports.list = function(req, res) {
  ProcessI.list(function(err, processes) {
    if (err) 
      return res.render('500', {error : err.errors || err})
      res.render('admin/list_default_processes', {
        title : "Processes",
        processes : processes,
        concrete : 1
      })
  })
}

/**
 * List all types of default processes
 */

exports.listAll = function(req, res) {

  Process.list(function(err, processes) {
    if (err) 
      return res.render('500', {error : err.errors || err})

      res.render('admin/list_default_processes', {
        title : "Choose a process",
        processes : processes
      })

  })
}

/**
 * Find phase by id
 */

exports.default_process = function(req, res, next, id){
  Process.load(id, function (err, process) {
    if (err) return next(err)
    if (!process) return next(new Error('Failed to load process ' + id))
    req.process = process
    req.defaultA = 1;
    next()
  })
}

exports.process = function(req, res, next, id){
  ProcessI.load(id, function (err, process) {
    if (err) return next(err)
    if (!process) return next(new Error('Failed to load process ' + id))
    req.process = process
    req.defaultA = 0;
    next()
  })
}

/**
 * Show details of one default process
 */

exports.showOne = function(req, res) {
  console.log("show : ")
  console.log(req.process)
  res.render('admin/show_default_process', {
    aProcess : req.process,
    title : req.process.name,
    defaultA : req.defaultA
  })
}

exports.new = function(req, res) {
  var p = new ProcessI({})
  p = _.extend(req.process)
  res.render('admin/new_process', {
    title: 'New process',
    aProcess: p,
    isNew : 1
  })
}

exports.create = function(req, res) {
  var p = new ProcessI({});
  p = _.extend(p, req.aProcess);
  p = _.extend(p, req.body)
  
  console.log(p)
    
  p.save (function (err) {
    if (err) return res.render('500', {error : err});
    res.redirect('processes/' + p._id)
  })
}

exports.insertA = function(req, res) {  

  // console.log("here");

  // Phase.list(function(err, phases) {
  //       console.log(phases);

  //   if (err) return res.render('500', {error : err.errors || err})
  //   console.log(phases);

  //   Process.create({
  //     name: "Cours IHM",
  //     comments: "4 pers, 1 mois",
  //     phases: [
  //       phases[0]._id,
  //       [
  //         phases[1]._id, phases[2]._id, phases[3]._id
  //       ]
  //     ]
  //   }, function (err, process) {

  //       console.log("err")
  //       console.log(err)

  //       console.log("process")
  //       console.log(process)

  
  //       res.render('admin/index', {
  //         msg : "inserted processes"
  //       })
  //   })

  // })

}