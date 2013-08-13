
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , utils = require('../../lib/utils')
  , Schema = mongoose.Schema
  , _ =  require('underscore')

var util = require("util")
/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Technique Schema
 */

var TechniqueSchema = new Schema({
  title: {type : String, default : '', trim : true},
  comments: {type : String, default : '', trim : true},
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now},
  finishedAt  : {type : Date},
  phase: {type : Schema.ObjectId, ref : 'Phase'},
  type: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  others: {type : Schema.Types.ObjectId}
})

// /**
//  * Pre-remove hook
//  */

//
// TechniqueSchema.pre('remove', function (next) {
//   var phase = this.phase
//   var others = this.others

//   // if there are files associated with the item, remove from the cloud too
//   others.remove(others, function (err) {
//     if (err) return next(err)
//   }, 'article')

//   next()
// })

/**
 * Validations
 */

// TechniqueSchema.path('title').validate(function (title) {
//   return title.length > 0
// }, 'Technique title cannot be blank')

// TechniqueSchema.path('body').validate(function (body) {
//   return body.length > 0
// }, 'Technique body cannot be blank')

/**
 * Methods
 */

TechniqueSchema.methods = {

}

/**
 * Statics
 */

TechniqueSchema.statics = {

  /**
   * Find technique by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {

    this.findOne({ _id : id })
      .populate('user', 'name email')
      .exec(function (err, technique) {
        if (technique == null)  return cb(null, null);

        var model = utils.getModel(technique.type)

        // find others
        model.findOne({_id: technique.others}, function(err, obj){
          if (obj)
            technique._doc.others = obj.toObject()
          cb(err, technique);
        })  
      }) 
  },

  /**
   * List techniques
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {

    this.find(options)
      .populate('user', 'name')
      .sort({'createdAt': 1}) // sort by date
      .exec(cb)
  }

}

mongoose.model('Technique', TechniqueSchema)
