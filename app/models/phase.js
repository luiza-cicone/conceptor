
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

var PhaseSchema = new Schema({
  type:       {type : Schema.ObjectId, ref : 'PhaseType'},
  name:       {type : String, default : '', trim : true},
  comments:   {type : String, default : '', trim : true},
  tags:       {type: [], get: getTags, set: setTags},
  techniques: [{type : Schema.ObjectId, ref : 'Technique'}],
  order:      {type : Number}
})

/**
 * Validations
 */

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
      .populate({ path:'techniques', options: { sort: {'createdAt': 1}}})
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
      .populate({ path:'techniques', options: { sort: {'createdAt': 1}}})
      // .limit(options.perPage)
      .sort({'order': 1}) // sort by date
      // .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Phase', PhaseSchema)
