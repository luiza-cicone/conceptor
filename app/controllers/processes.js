
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Technique = mongoose.model('Technique')
  , Phase = mongoose.model('Phase')
  , ProcessType = mongoose.model('ProcessType')
  , PhaseType = mongoose.model('PhaseType')
  , Process = mongoose.model('Process')
  , PhaseLink = mongoose.model('PhaseLink')
  , Link = mongoose.model('Link')
  , _ = require('underscore')
 
/**
 * Exports JSON for graph
 */

exports.json = function (id, callback) {
  var options = {}
  Process.load(id, function(err, process) {
    if (err) return err

    Phase.populate(process.phases, { path:'techniques', options: { sort: {'createdAt': 1}}}, function (err, doc) {
       if (err) return err
        callback(doc, process.links);
    })
  }) 
}


exports.graph = function(req, res){
  res.render('phases/graph', {process_item : req.process_item})
}

exports.schema = function (id, callback) {

  ProcessType.load(id, function(err, process) {
    if (err) return err
    callback(process.phases, process.links);
  }) 
}