
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
 * Phase Schema
 */

var PhaseTypeSchema = new Schema({
  name:       {type : String, default : '', trim : true},
  comments:       {type : String, default : '', trim : true},
  tags:       {type: [], get: getTags, set: setTags},
  techniques: [{type : Schema.ObjectId, ref : 'Form'}]
})

/**
 * Validations
 */

PhaseTypeSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'Phase name cannot be blank')


/**
 * Methods
 */

PhaseTypeSchema.methods = {

  /**
   * Add technique
   *
   * @param {Technique} technique
   * @param {Function} cb
   * @api private
   */

  // addTechnique: function (technique, cb) {
  //   this.techniques.push({
  //     _id: technique._id
  //   })
  //   this.save(cb)
  // }
}

/**
 * Statics
 */

PhaseTypeSchema.statics = {

  /**
   * Find phase by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      // .populate('techniques')
      .exec(cb)
  },


  /**
   * List phases
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (cb) {

    this.find()
      // .populate('techniques')
      .exec(cb)
  }

}

mongoose.model('PhaseType', PhaseTypeSchema)
