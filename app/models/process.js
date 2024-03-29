
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

var ProcessSchema = new Schema({
  type:       {type : Schema.ObjectId, ref : 'ProcessType'},
  name:       {type : String, default : '', trim : true},
  comments:   {type : String, default : '', trim : true},
  tags:       {type: [], get: getTags, set: setTags},
  createdAt:  {type : Date, default : Date.now},
  finishedAt: {type : Date},
  phases:     [{type : Schema.ObjectId, ref : 'Phase'}],
  links:     [{type : Schema.ObjectId, ref : 'Link'}]
})


/**
 * Methods
 */

ProcessSchema.methods = {


}

/**
 * Statics
 */

ProcessSchema.statics = {


  /**
   * List concreete processes
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (cb) {

    this.find()
      // .sort({'createdAt': 1}) // sort by date
      .exec(cb)
  },

  /**
   * Find process by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate({ path:'phases', options: { sort: {'order': 1} } })
      .populate({ path:'links' })
      .exec(cb);
  }


}
mongoose.model('Process', ProcessSchema)