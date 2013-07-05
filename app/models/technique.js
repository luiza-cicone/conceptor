
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
 * Technique Schema
 */

var TechniqueSchema = new Schema({
  title: {type : String, default : '', trim : true},
  comments: {type : String, default : '', trim : true},
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now},
  finishedAt  : {type : Date},
  phase: {type : Schema.ObjectId, ref : 'Phase'},
  type: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  others: {type : Schema.ObjectId, ref : 'Other'}
})

/**
 * Validations
 */

// TechniqueSchema.path('title').validate(function (title) {
//   return title.length > 0
// }, 'Technique title cannot be blank')

// TechniqueSchema.path('body').validate(function (body) {
//   return body.length > 0
// }, 'Technique body cannot be blank')

/**
 * Methods
 */

TechniqueSchema.methods = {

  /*
   * Upload and save
   */

  uploadAndSave: function (files, cb) {

    console.log(files);

    if (!files || (files.count)) return this.save(cb)
    
    for(key in files) {

      var fileArray = files[key];
      if (!(fileArray instanceof Array)) {
        var newPath = saveFile(fileArray);
      }
      else if (fileArray instanceof Array) {
        var stringArray = [];
        for (var i = 0; i < fileArray.length; i++) {
          var newPath = saveFile(fileArray[i]);
          if (newPath)
            stringArray.push(newPath);
        }
      }
    }
  
    this.save(cb);
  }

  /*
   * Other ?
   */

}

function saveFile(file) {
  if (!file.name) return;

  fs.readFile(file.path, function (err, data) {
    if (err) console.log(err)
    var newPath = __dirname + "/../uploads/" + file.name;

    fs.writeFile(newPath, data, function (err) {
      if (err) console.log(err)
    })

    return newPath

  })
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
