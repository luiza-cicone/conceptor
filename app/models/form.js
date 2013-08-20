
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Field Schema
 */

var FormSchema = new Schema({
  name: {type : String, default : '', trim : true},
  id : {type : String},
  description: {type : String, default : '', trim : true},
  json: Schema.Types.Mixed,
  json_second: Schema.Types.Mixed
}, {id : false})

/**
 * Validations
 */

/**
 * Methods
 */

FormSchema.methods = {

}

/**
 * Statics
 */

FormSchema.statics = {

  /**
   * Find technique by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (idx, cb) {
    this.findOne({ id : idx })
      .exec(cb)
  },

  /**
   * List field
   *
   * @param {Function} cb
   * @api private
   */

  list: function (cb) {
    this.find()
      .sort({'title': 1}) // sort by title
      .exec(cb)
  }

}

mongoose.model('Form', FormSchema)
