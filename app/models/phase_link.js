
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

var PhaseLinkSchema = new Schema({
  source: {type : Schema.ObjectId, ref : 'PhaseType'},
  target: {type : Schema.ObjectId, ref : 'PhaseType'},
})

/**
 * Validations
 */


/**
 * Methods
 */

PhaseLinkSchema.methods = {

}

/**
 * Statics
 */

PhaseLinkSchema.statics = {

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
    var criteria = options || {}
    this.find(criteria)
      .lean()
      // .populate("source target")
      .exec(cb)
  }

}

mongoose.model('PhaseLink', PhaseLinkSchema)
