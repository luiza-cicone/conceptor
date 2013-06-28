
// /**
//  * Module dependencies.
//  */

// var mongoose = require('mongoose')
//   , env = process.env.NODE_ENV || 'development'
//   , config = require('../../config/config')[env]
//   , Schema = mongoose.Schema

// /**
//  * Field Schema
//  */

// var FieldSchema = new Schema({
//   key: {type : String, default : 'string', trim : true},
//   type: {type : String, default : 'string', trim : true},
//   title: {type : String, default : '', trim : true},
//   description: {type : String, default : '', trim : true},
//   default: {type : String, default : '', trim : true},
//   maxLength: {type : Number},
//   required: {type : Boolean, default : false}
// })

// /**
//  * Validations
//  */

// /**
//  * Methods
//  */

// FieldSchema.methods = {

// }

// /**
//  * Statics
//  */

// FieldSchema.statics = {

//   /**
//    * Find technique by id
//    *
//    * @param {ObjectId} id
//    * @param {Function} cb
//    * @api private
//    */

//   load: function (id, cb) {
//     this.findOne({ _id : id })
//           .exec(cb)
//   },

//   /**
//    * List field
//    *
//    * @param {Function} cb
//    * @api private
//    */

//   list: function (cb) {
//     var criteria = options.criteria || {}

//     this.find(criteria)
//       .sort({'title': 1}) // sort by title
//       .exec(cb)
//   }

// }

// mongoose.model('Field', FieldSchema)
