
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Phase = mongoose.model('PhaseType')
  , ConcretePhase = mongoose.model('Phase')
  , Process = mongoose.model('ProcessType')
  , ConcreteProcess = mongoose.model('Process')
  , _ = require('underscore')
  , ProcessType = mongoose.model('ProcessType')

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
        title : "Projects",
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
        title : "New project",
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
    title : req.process_item.name,
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







/**


Processes


*/


exports.processes = function(req, res){
  ProcessType.list(function(err, techniques) {
    if (err) return res.render('500', {error : err.errors || err})
    res.render('admin/processes', {
      processes: techniques,
    })
  })
}

/**
 * New type of technique
 */

exports.newDefaultProcess = function(req, res){  
  Phase.list(function(err, phases) {
    if (err) return res.render('500', {error : err.errors || err})
    res.render('admin/new_default_process', {
      title: 'New process',
      process_item: new ProcessType({}),
      default_phases : phases
    })
  })
}

/**
 * Create a type of technique
 */

exports.createDefaultProcess = function (req, res) {
  var technique = new ProcessType(req.body)

  technique.save(function (err) {
    if (err) {
      res.render('admin/processes', {
        title : "Processes",
        processes : processes
      })
    }
    else {
      res.redirect('admin/processes/')
    }
  })
}

/**
 * Update technique
 */


exports.editDefaultProcess = function(req, res){
  Phase.list(function(err, phases) {
    if (err) return res.render('500', {error : err.errors || err})
     res.render('admin/edit_default_process', {
      title: req.process_item,
      process_item: req.process_item,
      default_phases : phases
    })
  })
}


exports.modifyDefaultProcess = function (req, res) {  
  var action = req.body.action
  delete req.body.action

  var technique = req.process_item
  
  if (action == 'save') {
    technique = _.extend(technique, req.body)

    technique.save(function (err) {
      if (err) {
        res.render('admin/processes', {
          technique: technique,
          errors: err.errors
        })
      }
      else {
        res.redirect('admin/processes/')
      }
    })
  }
  else {
    technique.remove(function(err){
      // req.flash('notice', 'Deleted successfully')
      res.redirect('/admin/processes/')
    })
  }
}
