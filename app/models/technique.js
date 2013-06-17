
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

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
  body: {type : String, default : '', trim : true},
  phase: {type : Schema.ObjectId, ref : 'Phase'},
  user: {type : Schema.ObjectId, ref : 'User'},
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now},
  finishedAt  : {type : Date}
})

/**
 * Validations
 */

TechniqueSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Technique title cannot be blank')

TechniqueSchema.path('body').validate(function (body) {
  return body.length > 0
}, 'Technique body cannot be blank')

/**
 * Methods
 */

TechniqueSchema.methods = {
/**
   * Add technique
   *
   * @param {Technique} technique
   * @param {Function} cb
   * @api private
   */

  // addChildTechnique: function (technique, cb) {
  //   this.children.push({
  //     _id: technique._id
  //   })

  //   this.save(cb)
  // }
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
      .exec(cb)
  },

  /**
   * List techniques
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': 1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Technique', TechniqueSchema)
