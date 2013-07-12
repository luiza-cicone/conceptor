
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , fs = require('fs')


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
 * Process Schema
 */

var ProcessTypeSchema = new Schema({
  name:      {type : String, default : '', trim : true},
  comments:  {type : String, default : '', trim : true},
  tags:      {type: [], get: getTags, set: setTags},
  image:     {type : String, default : '', trim : true},
  phases:    {type : [Schema.Types.Mixed]}
})

/**
 * Methods
 */

ProcessTypeSchema.methods = {


}

/**
 * Statics
 */

ProcessTypeSchema.statics = {

  /**
   * Find technique by id
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
   * List techniques
   *
   * @param {Function} cb
   * @api private
   */

  list: function (cb) {
    this.find()
      .exec(cb)
  }
}

mongoose.model('ProcessType', ProcessTypeSchema)
