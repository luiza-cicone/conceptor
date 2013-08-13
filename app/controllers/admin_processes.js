
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Phase = mongoose.model('PhaseType')
  , ConcretePhase = mongoose.model('Phase')
  , Process = mongoose.model('ProcessType')
  , ConcreteProcess = mongoose.model('Process')
  , _ = require('underscore')

/*
 * Home
 */

exports.index = function(req, res) {
  res.render('home', {})
}

/*
 * List all user processes 
 */
exports.list = function(req, res) {
  ConcreteProcess.list(function(err, processes) {
    if (err) 
      return res.render('500', {error : err.errors || err})

      res.render('admin/list_processes', {
        title : "Processes",
        processes : processes,
        concrete : 1
      })
  })
}

/**
 * List all default processes for starting a new
 */

exports.listAll = function(req, res) {

  Process.list(function(err, processes) {
    if (err) 
      return res.render('500', {error : err.errors || err})

      res.render('admin/list_processes', {
        title : "Choose a base process",
        processes : processes
      })

  })
}

/**
 * Find default process by id
 */

exports.default_process = function(req, res, next, id){
  Process.load(id, function (err, process) {
    if (err) return next(err)
    if (!process) return next(new Error('Failed to load process ' + id))
    req.process_item = process
    req.concrete = 0;
    next()
  })
}

/**
 * Find user process by id
 */

exports.process = function(req, res, next, id){
  ConcreteProcess.load(id, function (err, process) {
    if (err) return next(err)
    if (!process) return next(new Error('Failed to load process ' + id))
    req.process_item = process
    req.concrete = 1;
    next()
  })
}

/**
 * Show details of process
 */

exports.showOne = function(req, res) {
  
  res.render('admin/show_process', {
    concrete : req.concrete,
    process_item : req.process_item
  })
}


/**
 * New concrete process
 */
exports.new = function(req, res) {

  var p = new ConcreteProcess({});
  p = _.extend(p, req.process_item)

  console.log("\nnew : ")
  console.log(p)

  res.render('admin/new_process', {
    title: 'New process',
    process_item: p,
    isNew : 1
  })
}

exports.create = function(req, res) {
  var p = new ConcreteProcess({});
  p = _.extend(p, req.body)

  p.save (function (err, concreteProcess) {
    if (err) return res.render('500', {error : err});
    var phases = [];
    req.process_item.phases.forEach(function(phase, err){
      // TODO : save other params
      var newphase = {"name" : phase.name, "type" : phase._id}
      phases.push(newphase)
    })
    // save all new phases for the concrete proc
    ConcretePhase.create(phases, function(err) {
      if (err) return res.render('500', {error : err});

      var phasesID = [];
      for (var i = 1;i < arguments.length;i ++)
        phasesID.push(arguments[i]._id);
      concreteProcess = _.extend(concreteProcess, {phases : phasesID});

      console.log("\n\n\nconcreteProcess");
      console.log(concreteProcess);
      concreteProcess.save(function(err) {
        if (err) return res.render('500', {error : err});
      });
    })
    res.redirect('processes/' + p._id)
  })
}

exports.graph2 = function(req, res){
  res.render('graph2', {})
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