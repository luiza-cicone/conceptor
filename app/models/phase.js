
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Phase Schema
 */

var PhaseSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  techniques: [{type : Schema.ObjectId, ref : 'Technique'}]
})

/**
 * Validations
 */

PhaseSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Phase title cannot be blank')

PhaseSchema.path('body').validate(function (body) {
  return body.length > 0
}, 'Phase body cannot be blank')


/**
 * Methods
 */

PhaseSchema.methods = {

  /**
   * Add technique
   *
   * @param {Technique} technique
   * @param {Function} cb
   * @api private
   */

  addTechnique: function (technique, cb) {
    this.techniques.push({
      _id: technique._id
    })

    this.save(cb)
  }
}

/**
 * Statics
 */

PhaseSchema.statics = {

  /**
   * Find phase by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('techniques')
      .exec(cb)
  },


  /**
   * List phases
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('techniques')
      .limit(options.perPage)
      .sort({'title': 1}) // sort by date
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Phase', PhaseSchema)
