var mongoose = require('mongoose')
  , fs = require('fs')

/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  var keys = Object.keys(errors)
  var errs = []

  // if there is no validation error, just display a generic error
  if (!keys) {
    console.log(errors);
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    errs.push(errors[key].type)
  })

  return errs
}

/**
 * Get mongoose model
 *
 * @api public
 */

exports.getModel = function (type) {
  try {
    mongoose.model(type, new mongoose.Schema({}, {strict: false}));
  } catch (error) {}
  return mongoose.model(type);
}


/**
 *
 * Save file
 *
 */

exports.saveFile = function(file) {
  var uploadsDir = __dirname + '/../uploads/';
  var path = uploadsDir + file.name;

  try {
    if (!file.name) return;

    var data = fs.readFileSync(file.path);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    while (fs.existsSync(path)) {
      var arr = path.split('.');
      var extension = arr.pop();

      arr.push('bis');
      arr.push(extension);
      path = arr.join('.')
    }
    fs.writeFileSync(path, data);
    return path;

  } catch (e) {
    console.log('error in utils.saveFile : ' + e);
    return null;
  }
}