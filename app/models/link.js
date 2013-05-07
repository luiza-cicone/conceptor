
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Link Schema
 */

var LinkSchema = new Schema({
  source: {type : Schema.ObjectId, ref : 'Technique'},
  target: {type : Schema.ObjectId, ref : 'Technique'},
  comments: [{type : String, default : '', trim : true}]
})

/**
 * Validations
 */


/**
 * Methods
 */

LinkSchema.methods = {

}

/**
 * Statics
 */

LinkSchema.statics = {

  /**
   * Find link by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },


  /**
   * List links
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .exec(cb)
  }

}

mongoose.model('Link', LinkSchema)
