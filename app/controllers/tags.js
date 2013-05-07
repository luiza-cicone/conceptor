
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Technique = mongoose.model('Technique')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Technique.list(options, function(err, techniques) {
    if (err) return res.render('500')
    Technique.count(criteria).exec(function (err, count) {
      res.render('techniques/index', {
        title: 'List of Technique',
        techniques: techniques,
        page: page,
        pages: count / perPage
      })
    })
  })
}
