var mongoose = require('mongoose')
  , fs = require('fs')


exports.printObject = function () {
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          console.log(k)
        }
    } 
}

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
  var root = __dirname + '/../public';
  var dir = '/uploads/';
  var path = dir + file.name;

  var p = dir + file.name

  try {
    if (!file.name) return;

    var data = fs.readFileSync(file.path);

    if (!fs.existsSync(root + dir)) {
      fs.mkdirSync(root + dir);
    }

    while (fs.existsSync(root + path)) {
      var arr = path.split('.');
      var extension = arr.pop();

      arr.push('bis');
      arr.push(extension);
      path = arr.join('.')
    }
    fs.writeFileSync(root + path, data);
    return path;

  } catch (e) {
    console.log('error in utils.saveFile : ' + e);
    return null;
  }
}

exports.pushArray = function(arr1, arr2) {
    arr1.push.apply(arr1, arr2);
}